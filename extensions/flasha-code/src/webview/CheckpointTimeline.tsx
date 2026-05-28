import React from 'react';
import type { Checkpoint } from './types';

interface Props {
  checkpoints: Checkpoint[];
}

export default function CheckpointTimeline({ checkpoints }: Props) {
  if (checkpoints.length === 0) {
    return <div style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>لا توجد نقاط تفتيش</div>;
  }

  return (
    <div style={{ position: 'relative', padding: '8px 0' }}>
      <div style={{ position: 'absolute', right: '20px', top: 0, bottom: 0, width: '2px', background: '#444' }} />
      {checkpoints.map((cp, i) => (
        <div key={i} style={{ position: 'relative', padding: '8px 40px', direction: 'rtl' }}>
          <div style={{
            position: 'absolute', right: '14px', top: '12px', width: '14px', height: '14px',
            borderRadius: '50%', background: '#f0ad4e', border: '2px solid #1e1e1e',
          }} />
          <div style={{ padding: '8px 12px', borderRadius: '4px', background: '#2d2d2d' }}>
            <strong style={{ color: '#f0ad4e', fontSize: '12px' }}>{cp.label}</strong>
            <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#888' }}>{cp.id}</p>
            <small style={{ color: '#666', fontSize: '10px' }}>{new Date(cp.timestamp).toLocaleString()}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
