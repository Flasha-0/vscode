import React, { useState } from 'react';
import { vscode } from './vscodeApi';

export default function RulesEditor() {
  const [rules, setRules] = useState('# Flasha Rules\n\n- Keep functions small\n- Use TypeScript');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    vscode.postMessage({ type: 'saveRules', content: rules });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', direction: 'rtl' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <button onClick={handleSave} style={btnStyle}>
          {saved ? '✓ تم الحفظ' : '💾 حفظ القواعد'}
        </button>
      </div>
      <textarea
        value={rules}
        onChange={e => setRules(e.target.value)}
        style={{
          flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid #444',
          background: '#1a1a1a', color: '#d4d4d4', fontFamily: "'Fira Code', monospace",
          fontSize: '12px', resize: 'none', direction: 'ltr', whiteSpace: 'pre',
        }}
      />
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '6px 14px', border: 'none', borderRadius: '4px',
  background: '#f0ad4e', color: '#1e1e1e', cursor: 'pointer', fontWeight: 'bold',
};
