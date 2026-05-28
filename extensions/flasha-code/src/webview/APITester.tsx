import React, { useState } from 'react';

interface APIRequest {
  method: string;
  url: string;
  headers: string;
  body: string;
}

interface APIResponse {
  status: number;
  statusText: string;
  body: string;
  latencyMs: number;
}

export default function APITester() {
  const [req, setReq] = useState<APIRequest>({ method: 'GET', url: '', headers: '{}', body: '' });
  const [res, setRes] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  const handleSend = async () => {
    setLoading(true);
    try {
      const headers = JSON.parse(req.headers || '{}');
      const start = Date.now();
      const response = await fetch(req.url, {
        method: req.method,
        headers,
        body: req.method !== 'GET' ? req.body || undefined : undefined,
      });
      const text = await response.text();
      setRes({
        status: response.status,
        statusText: response.statusText,
        body: text,
        latencyMs: Date.now() - start,
      });
    } catch (e: any) {
      setRes({ status: 0, statusText: 'Error', body: e.message, latencyMs: 0 });
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '8px', direction: 'ltr', fontSize: '12px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        <select
          value={req.method}
          onChange={e => setReq({ ...req, method: e.target.value })}
          style={inputStyle({ width: '80px' })}
        >
          {methods.map(m => <option key={m}>{m}</option>)}
        </select>
        <input
          value={req.url}
          onChange={e => setReq({ ...req, url: e.target.value })}
          placeholder="https://api.example.com/endpoint"
          style={inputStyle({ flex: 1 })}
        />
        <button onClick={handleSend} disabled={loading} style={sendBtnStyle}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
      <input
        value={req.headers}
        onChange={e => setReq({ ...req, headers: e.target.value })}
        placeholder='{"Content-Type": "application/json"}'
        style={inputStyle({})}
      />
      <textarea
        value={req.body}
        onChange={e => setReq({ ...req, body: e.target.value })}
        placeholder="Request body (JSON)"
        rows={3}
        style={{ ...textAreaStyle, height: '80px' }}
      />
      {res && (
        <div style={{ padding: '8px', borderRadius: '4px', background: '#2d2d2d' }}>
          <div style={{ color: res.status < 400 ? '#a3e6a3' : '#f48771', fontWeight: 'bold' }}>
            {res.status} {res.statusText} ({res.latencyMs}ms)
          </div>
          <pre style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap', color: '#aaa', fontSize: '11px' }}>
            {res.body}
          </pre>
        </div>
      )}
    </div>
  );
}

const inputStyle = (extra: React.CSSProperties): React.CSSProperties => ({
  padding: '6px 8px', borderRadius: '4px', border: '1px solid #555',
  background: '#252526', color: '#d4d4d4', fontSize: '12px', ...extra,
});

const textAreaStyle: React.CSSProperties = {
  padding: '8px', borderRadius: '4px', border: '1px solid #555',
  background: '#252526', color: '#d4d4d4', fontSize: '12px', resize: 'vertical',
  fontFamily: 'monospace',
};

const sendBtnStyle: React.CSSProperties = {
  padding: '6px 14px', border: 'none', borderRadius: '4px',
  background: '#2ea043', color: '#fff', cursor: 'pointer', fontWeight: 'bold',
};
