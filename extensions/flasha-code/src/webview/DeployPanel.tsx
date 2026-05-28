import React from 'react';
import { vscode } from './vscodeApi';

export default function DeployPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', direction: 'rtl' }}>
      <h3 style={{ color: '#f0ad4e', margin: 0 }}>🚀 النشر</h3>

      <div style={{ padding: '12px', borderRadius: '6px', background: '#2d2d2d' }}>
        <strong style={{ color: '#58A6FF' }}>Vercel</strong>
        <p style={{ color: '#aaa', fontSize: '11px', margin: '4px 0' }}>
          انشر تطبيقك على Vercel بنقرة واحدة
        </p>
        <button onClick={() => vscode.postMessage({ type: 'deploy' })} style={btnStyle}>
          🚀 انشر على Vercel
        </button>
      </div>

      <div style={{ padding: '12px', borderRadius: '6px', background: '#2d2d2d' }}>
        <strong style={{ color: '#58A6FF' }}>GitHub Pages</strong>
        <p style={{ color: '#aaa', fontSize: '11px', margin: '4px 0' }}>
          انشر موقع ثابت على GitHub Pages
        </p>
        <button onClick={() => vscode.postMessage({ type: 'deployGhPages' })} style={btnStyle}>
          📦 انشر على GitHub Pages
        </button>
      </div>

      <div style={{ padding: '12px', borderRadius: '6px', background: '#2d2d2d' }}>
        <strong style={{ color: '#58A6FF' }}>Preview Deployment</strong>
        <p style={{ color: '#aaa', fontSize: '11px', margin: '4px 0' }}>
          أنشئ معاينة قبل النشر النهائي
        </p>
        <button onClick={() => vscode.postMessage({ type: 'deployPreview' })} style={{ ...btnStyle, background: '#1f6feb' }}>
          👁 معاينة
        </button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '8px 16px', border: 'none', borderRadius: '4px',
  background: '#2ea043', color: '#fff', cursor: 'pointer', fontWeight: 'bold', width: '100%',
};
