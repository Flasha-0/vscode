import React, { useState, useEffect } from 'react';
import { vscode } from './vscodeApi';

interface AnalyticsEvent {
  event: string;
  count: number;
}

export default function AnalyticsPanel() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [tokenEstimate, setTokenEstimate] = useState(0);

  useEffect(() => {
    vscode.postMessage({ type: 'getAnalytics' });
    const handler = (e: MessageEvent) => {
      if (e.data.type === 'analytics') {
        setEvents(e.data.events || []);
        setTokenEstimate(e.data.tokens || 0);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div style={{ direction: 'rtl' }}>
      <h3 style={{ color: '#f0ad4e', margin: '0 0 12px' }}>📊 إحصائيات الاستخدام</h3>

      <div style={{ padding: '12px', borderRadius: '6px', background: '#2d2d2d', marginBottom: '8px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#58A6FF' }}>
          ~{tokenEstimate.toLocaleString()}
        </div>
        <div style={{ color: '#888', fontSize: '11px' }}>Total AI tokens estimated</div>
      </div>

      {events.length === 0 && (
        <div style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
          No analytics data yet
        </div>
      )}

      {events.map((ev, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '8px 12px', margin: '2px 0',
          borderRadius: '4px', background: '#1a1a1a',
        }}>
          <span style={{ color: '#d4d4d4', fontSize: '12px' }}>{ev.event}</span>
          <span style={{ color: '#f0ad4e', fontWeight: 'bold', fontSize: '12px' }}>{ev.count}</span>
        </div>
      ))}
    </div>
  );
}
