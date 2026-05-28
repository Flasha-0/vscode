import * as vscode from 'vscode';
import * as cp from 'child_process';

let _instance: OpenCodeService | undefined;
let _contextForCleanup: vscode.ExtensionContext | undefined;

export class OpenCodeService {
  private process: cp.ChildProcess | null = null;
  private port: number;
  private ws: WebSocket | null = null;
  private reqId = 0;
  private pending = new Map<number, { resolve: (v: string) => void; reject: (e: Error) => void }>();

  static getInstance(context?: vscode.ExtensionContext): OpenCodeService {
    if (!_instance) {
      _instance = new OpenCodeService(context);
    }
    if (context) _contextForCleanup = context;
    return _instance;
  }

  private constructor(context?: vscode.ExtensionContext) {
    this.port = vscode.workspace.getConfiguration('flasha').get<number>('opencodePort', 4096);
  }

  async start(): Promise<void> {
    if (this.process) return;
    try {
      this.process = cp.spawn('opencode', ['serve', '--port', String(this.port)], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env },
      });
      this.process.stdout?.on('data', (d: Buffer) => console.log(`[OpenCode] ${d.toString().trim()}`));
      this.process.stderr?.on('data', (d: Buffer) => console.error(`[OpenCode] ${d.toString().trim()}`));
      this.process.on('exit', (code) => {
        console.log(`[OpenCode] exited (${code})`);
        this.process = null;
        this.ws = null;
      });
      console.log(`[Flasha] OpenCode started on port ${this.port}`);
      setTimeout(() => this.connectWs(), 1500);
    } catch (e) {
      console.warn('[Flasha] OpenCode CLI not found â€” install with: npm i -g @opencode/cli');
    }
  }

  private async connectWs(): Promise<void> {
    try {
      const ws = new WebSocket(`ws://localhost:${this.port}`);
      ws.onopen = () => console.log('[Flasha] Connected to OpenCode');
      ws.onmessage = (event: MessageEvent) => {
        try {
          const msg = JSON.parse(event.data.toString());
          const p = this.pending.get(msg.id);
          if (p) { p.resolve(msg.result?.text || JSON.stringify(msg.result)); this.pending.delete(msg.id); }
        } catch { }
      };
      ws.onclose = () => { this.ws = null; };
      ws.onerror = () => { this.ws = null; };
      this.ws = ws;
    } catch { console.warn('[Flasha] WebSocket connection failed'); }
  }

  async query(model: string, mode: string, prompt: string): Promise<string> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const id = ++this.reqId;
      return new Promise((resolve, reject) => {
        this.pending.set(id, { resolve, reject });
        this.ws?.send(JSON.stringify({
          id, method: 'chat',
          params: { model, mode, messages: [{ role: 'user', content: prompt }] }
        }));
        setTimeout(() => { this.pending.delete(id); resolve('[Timeout]'); }, 60000);
      });
    }
    try {
      const res = await fetch(`http://localhost:${this.port}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, mode, messages: [{ role: 'user', content: prompt }] }),
      });
      if (res.ok) { const data: any = await res.json(); return data.choices?.[0]?.message?.content || JSON.stringify(data); }
      return `[HTTP ${res.status}] ${res.statusText}`;
    } catch (e: any) {
      return `[Offline] OpenCode not responding. Start with: opencode serve --port ${this.port}`;
    }
  }

  stop(): void {
    this.ws?.close();
    this.ws = null;
    this.process?.kill();
    this.process = null;
    _instance = undefined;
  }
}
