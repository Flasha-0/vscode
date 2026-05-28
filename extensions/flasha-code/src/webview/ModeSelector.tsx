import React from 'react';
import type { ModeInfo } from './types';

interface Props {
  modes: ModeInfo[];
  current: string;
  onChange: (modeId: string) => void;
}

const MODE_ICONS: Record<string, string> = {
  auto: '🔄', plan: '📋', build: '🔨', chat: '💬', review: '👁', debug: '🐛',
  test: '🧪', document: '📝', refactor: '🔧', security: '🛡', deploy: '🚀',
  analyze: '📊', design: '🎨', migrate: '📦', git: '🔀',
};

export default function ModeSelector({ modes, current, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '8px', borderBottom: '1px solid #333', direction: 'rtl' }}>
      {modes.map(mode => (
        <button
          key={mode.id}
          onClick={() => onChange(mode.id)}
          style={{
            padding: '4px 10px',
            border: `1px solid ${current === mode.id ? '#f0ad4e' : '#444'}`,
            borderRadius: '12px',
            background: current === mode.id ? '#f0ad4e22' : 'transparent',
            color: current === mode.id ? '#f0ad4e' : '#aaa',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: current === mode.id ? 'bold' : 'normal',
          }}
        >
          {MODE_ICONS[mode.id] || '⚡'} {mode.label}
        </button>
      ))}
    </div>
  );
}
