import * as vscode from 'vscode';
import * as cp from 'child_process';

let _instance: OpenCodeService | undefined;

export class OpenCodeService {
  private process: cp.ChildProcess | null = null;
  private port: number;

  static getInstance(context: vscode.ExtensionContext): OpenCodeService {
    if (!_instance) {
      _instance = new OpenCodeService(context);
    }
    return _instance;
  }

  private constructor(private context: vscode.ExtensionContext) {
    this.port = vscode.workspace.getConfiguration('flasha').get<number>('opencodePort', 4096);
  }

  async start(): Promise<void> {
    if (this.process) return;
    try {
      this.process = cp.spawn('opencode', ['serve', '--port', String(this.port)], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env },
      });
      this.process.stdout?.on('data', (d) => console.log(`[OpenCode] ${d}`));
      this.process.stderr?.on('data', (d) => console.error(`[OpenCode] ${d}`));
      this.process.on('exit', (code) => {
        console.log(`[OpenCode] exited (${code})`);
        this.process = null;
      });
      console.log(`[Flasha] OpenCode started on port ${this.port}`);
    } catch (e) {
      console.warn('[Flasha] OpenCode not available, running in offline mode');
    }
  }

  async query(model: string, mode: string, prompt: string): Promise<string> {
    if (!this.process) return '[Offline mode] OpenCode CLI not running';
    // WebSocket/JSON-RPC communication with OpenCode
    return `[${mode}] â†’ ${prompt}`;
  }

  stop(): void {
    this.process?.kill();
    this.process = null;
    _instance = undefined;
  }
}
