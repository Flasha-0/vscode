import React from 'react';
import type { MemoryEntry } from './types';

interface Props {
  memories: MemoryEntry[];
}

export default function MemoriesPanel({ memories }: Props) {
  if (memories.length === 0) {
    return <div style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>لا توجد ذكريات محفوظة</div>;
  }

  return (
    <div>
      {memories.map((mem, i) => (
        <div key={i} style={{ padding: '8px', margin: '4px 0', borderRadius: '4px', background: '#2d2d2d', direction: 'rtl' }}>
          <strong style={{ color: '#f0ad4e', fontSize: '12px' }}>{mem.key}</strong>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#aaa' }}>{mem.value}</p>
          <small style={{ color: '#666', fontSize: '10px' }}>{new Date(mem.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
