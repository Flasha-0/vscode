import React from 'react';

interface Props {
  content: string;
}

export default function DiffViewer({ content }: Props) {
  if (!content) {
    return <div style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>لا يوجد Diff للعرض</div>;
  }

  return (
    <pre style={{
      padding: '12px',
      borderRadius: '4px',
      background: '#1a1a1a',
      color: '#d4d4d4',
      fontSize: '12px',
      overflow: 'auto',
      direction: 'ltr',
      whiteSpace: 'pre-wrap',
      fontFamily: "'Fira Code', 'Consolas', monospace",
    }}>
      {content.split('\n').map((line, i) => {
        let color = '#d4d4d4';
        if (line.startsWith('+')) color = '#a3e6a3';
        else if (line.startsWith('-')) color = '#f48771';
        else if (line.startsWith('@@')) color = '#569cd6';
        return <div key={i} style={{ color }}>{line}</div>;
      })}
    </pre>
  );
}
