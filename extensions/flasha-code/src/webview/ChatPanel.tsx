import React, { useState, useRef, useEffect } from 'react';
import type { FlashaMessage } from './types';

interface Props {
  messages: FlashaMessage[];
  onSend: (content: string) => void;
}

export default function ChatPanel({ messages, onSend }: Props) {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (text) {
      onSend(text);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
            <p style={{ fontSize: '24px', margin: 0 }}>🦎</p>
            <p>مرحباً بك في فلاشا كود! كيف أساعدك؟</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{
            margin: '8px 0',
            padding: '8px 12px',
            borderRadius: '8px',
            background: msg.role === 'user' ? '#2d5a3d' : '#2d2d2d',
            color: msg.role === 'user' ? '#a3e6a3' : '#d4d4d4',
            maxWidth: '85%',
            alignSelf: msg.role === 'user' ? 'flex-start' : 'flex-end',
            direction: 'rtl',
            whiteSpace: 'pre-wrap',
          }}>
            {msg.content}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ display: 'flex', gap: '8px', padding: '8px 0', borderTop: '1px solid #333' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب رسالتك..."
          rows={2}
          style={{
            flex: 1,
            resize: 'none',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #555',
            background: '#252526',
            color: '#d4d4d4',
            fontFamily: 'inherit',
            fontSize: '13px',
            direction: 'rtl',
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            background: '#f0ad4e',
            color: '#1e1e1e',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          إرسال
        </button>
      </div>
    </div>
  );
}
