import React from 'react';
import type { ModelInfo } from './types';

interface Props {
  models: ModelInfo[];
  current: string;
  onChange: (modelId: string) => void;
}

export default function ModelPicker({ models, current, onChange }: Props) {
  return (
    <select
      value={current}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '6px 8px',
        borderRadius: '4px',
        border: '1px solid #555',
        background: '#252526',
        color: '#d4d4d4',
        fontSize: '12px',
      }}
    >
      {models.map(model => (
        <option key={model.id} value={model.id}>
          {model.name} ({model.provider})
        </option>
      ))}
    </select>
  );
}
