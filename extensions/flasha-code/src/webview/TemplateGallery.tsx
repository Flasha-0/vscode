import React, { useState, useEffect } from 'react';
import { vscode } from './vscodeApi';

interface Template {
  id: string;
  name: string;
  description: string;
  techStack: string[];
}

export default function TemplateGallery() {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    vscode.postMessage({ type: 'getTemplates' });
    const handler = (e: MessageEvent) => {
      if (e.data.type === 'templates') {
        setTemplates(e.data.templates || []);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const handleScaffold = (id: string) => {
    vscode.postMessage({ type: 'scaffold', templateId: id });
  };

  return (
    <div style={{ direction: 'rtl' }}>
      <h3 style={{ color: '#f0ad4e', margin: '0 0 12px' }}>📦 قوالب المشاريع</h3>

      {templates.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
          Loading templates...
        </div>
      )}

      {templates.map(t => (
        <div key={t.id} style={{
          padding: '12px', marginBottom: '8px', borderRadius: '6px',
          background: '#2d2d2d', border: '1px solid #3d3d3d',
        }}>
          <div style={{ fontWeight: 'bold', color: '#58A6FF', fontSize: '13px' }}>{t.name}</div>
          <p style={{ color: '#aaa', fontSize: '11px', margin: '4px 0' }}>{t.description}</p>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {t.techStack.map(tech => (
              <span key={tech} style={{
                padding: '2px 6px', borderRadius: '3px', background: '#1a1a1a',
                color: '#888', fontSize: '10px',
              }}>
                {tech}
              </span>
            ))}
          </div>
          <button onClick={() => handleScaffold(t.id)} style={btnStyle}>
            ⚡ إنشاء من هذا القالب
          </button>
        </div>
      ))}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '6px 14px', border: 'none', borderRadius: '4px',
  background: '#f0ad4e', color: '#1e1e1e', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px',
};
