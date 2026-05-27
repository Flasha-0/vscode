import { ChildProcess, spawn } from 'child_process';
import { EventEmitter } from 'events';

export interface OpenCodeConfig {
  binaryPath: string;
  port: number;
  autoStart: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  mode?: string;
  timestamp: number;
}

export class OpenCodeService extends EventEmitter {
  private process: ChildProcess | null = null;
  private config: OpenCodeConfig;
  private connected = false;

  constructor(config: Partial<OpenCodeConfig> = {}) {
    super();
    this.config = {
      binaryPath: 'opencode',
      port: 4096,
      autoStart: true,
      ...config,
    };
  }

  async start(): Promise<void> {
    if (this.process) return;

    return new Promise((resolve, reject) => {
      try {
        this.process = spawn(this.config.binaryPath, [
          'serve',
          '--port', String(this.config.port),
        ], {
          stdio: ['pipe', 'pipe', 'pipe'],
        });

        this.process.on('error', (err) => {
          console.error('[Flasha] OpenCode process error:', err);
          reject(err);
        });

        this.process.on('exit', (code) => {
          console.log('[Flasha] OpenCode process exited:', code);
          this.process = null;
          this.connected = false;
          this.emit('disconnected');
        });

        if (this.process.stdout) {
          this.process.stdout.on('data', (data: Buffer) => {
            const msg = data.toString();
            if (msg.includes('Server running')) {
              this.connected = true;
              this.emit('connected');
              resolve();
            }
          });
        }

        setTimeout(() => {
          if (!this.connected) {
            this.connected = true;
            this.emit('connected');
            resolve();
          }
        }, 3000);
      } catch (err) {
        reject(err);
      }
    });
  }

  async stop(): Promise<void> {
    if (this.process) {
      this.process.kill();
      this.process = null;
      this.connected = false;
    }
  }

  async sendMessage(message: ChatMessage): Promise<string> {
    if (!this.connected) {
      await this.start();
    }
    this.emit('message', message);
    return '';
  }

  isConnected(): boolean {
    return this.connected;
  }

  getConfig(): OpenCodeConfig {
    return { ...this.config };
  }
}
