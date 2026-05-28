import * as vscode from 'vscode';

interface Checkpoint {
  id: string;
  label: string;
  timestamp: number;
  files: Record<string, string>;
}

export class CheckpointsService {
  private static STORAGE_KEY = 'flasha.checkpoints';

  constructor(private context: vscode.ExtensionContext) {}

  async save(label: string): Promise<string> {
    const id = `cp_${Date.now()}`;
    const files: Record<string, string> = {};
    const wsFiles = await vscode.workspace.findFiles('**/*.{ts,js,tsx,jsx,py,rs,go,c,cpp,h,hpp,json,yaml,yml,toml}',
      '**/{node_modules,target,dist,build,.git,__pycache__}/**');
    for (const uri of wsFiles.slice(0, 50)) {
      try {
        const content = await vscode.workspace.fs.readFile(uri);
        files[uri.fsPath] = Buffer.from(content).toString('utf-8');
      } catch {}
    }
    const checkpoint: Checkpoint = { id, label, timestamp: Date.now(), files };
    const all = await this.list();
    all.push(checkpoint);
    await this.context.globalState.update(CheckpointsService.STORAGE_KEY, JSON.stringify(all));
    return id;
  }

  async restore(id: string): Promise<void> {
    const all = await this.list();
    const cp = all.find(c => c.id === id);
    if (!cp) throw new Error(`Checkpoint ${id} not found`);
    for (const [path, content] of Object.entries(cp.files)) {
      try {
        await vscode.workspace.fs.writeFile(vscode.Uri.file(path), Buffer.from(content));
      } catch {}
    }
  }

  async list(): Promise<Checkpoint[]> {
    const raw = this.context.globalState.get<string>(CheckpointsService.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  async delete(id: string): Promise<void> {
    const all = await this.list();
    await this.context.globalState.update(CheckpointsService.STORAGE_KEY,
      JSON.stringify(all.filter(c => c.id !== id)));
  }
}
