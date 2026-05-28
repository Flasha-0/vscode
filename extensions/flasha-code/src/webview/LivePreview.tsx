import React, { useState, useEffect, useRef } from 'react';
import { vscode } from './vscodeApi';

export default function LivePreview() {
  const [content, setContent] = useState('');
  const [type, setType] = useState<'html' | 'md' | 'svg'>('html');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [url, setUrl] = useState('');

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data.type === 'preview') {
        setContent(e.data.content);
        setType(e.data.format || 'html');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  useEffect(() => {
    if (iframeRef.current && content) {
      const blob = new Blob([content], { type: 'text/html' });
      setUrl(URL.createObjectURL(blob));
    }
  }, [content]);

  const handleFilePick = () => {
    vscode.postMessage({ type: 'pickPreviewFile' });
  };

  if (!content) {
    return (
      <div style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
        <p style={{ fontSize: '24px' }}>👁</p>
        <p>Select a file to preview</p>
        <button onClick={handleFilePick} style={btnStyle}>Browse File</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        <span style={{ color: '#888', fontSize: '11px', padding: '4px' }}>
          {type.toUpperCase()} Preview
        </span>
        <button onClick={handleFilePick} style={smallBtnStyle}>Open</button>
      </div>
      <iframe
        ref={iframeRef}
        src={url}
        style={{ flex: 1, border: '1px solid #444', borderRadius: '4px', background: '#fff' }}
        sandbox="allow-scripts"
      />
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '6px 14px', border: 'none', borderRadius: '4px',
  background: '#f0ad4e', color: '#1e1e1e', cursor: 'pointer', fontWeight: 'bold', marginTop: '8px',
};

const smallBtnStyle: React.CSSProperties = {
  padding: '2px 8px', border: '1px solid #555', borderRadius: '3px',
  background: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: '10px',
};
