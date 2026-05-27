import * as vscode from 'vscode';

interface MemoryEntry {
  key: string;
  value: string;
  timestamp: number;
}

export class MemoryService {
  private static STORAGE_KEY = 'flasha.memory';

  constructor(private context: vscode.ExtensionContext) {}

  private get storage(): vscode.SecretStorage | vscode.Memento {
    return this.context.globalState;
  }

  async set(key: string, value: string): Promise<void> {
    const entries = await this.getAll();
    entries.push({ key, value, timestamp: Date.now() });
    await this.storage.update(MemoryService.STORAGE_KEY, JSON.stringify(entries));
  }

  async get(key: string): Promise<string | undefined> {
    const entries = await this.getAll();
    return entries.find(e => e.key === key)?.value;
  }

  async getAll(): Promise<MemoryEntry[]> {
    const raw = this.storage.get<string>(MemoryService.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  async search(query: string): Promise<MemoryEntry[]> {
    const entries = await this.getAll();
    return entries.filter(e =>
      e.key.toLowerCase().includes(query.toLowerCase()) ||
      e.value.toLowerCase().includes(query.toLowerCase())
    );
  }

  async clear(): Promise<void> {
    await this.storage.update(MemoryService.STORAGE_KEY, undefined);
  }
}
