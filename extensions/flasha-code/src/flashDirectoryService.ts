import * as vscode from 'vscode';

export class FlashDirectoryService {
  static readonly DIR_NAME = '.flasha';
  static readonly RULES_FILE = 'rules.md';
  static readonly HOOKS_FILE = 'hooks.json';
  static readonly MEMORIES_DIR = 'memories';

  getWorkspaceRoot(): vscode.Uri | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri;
  }

  async ensureDirectory(uri?: vscode.Uri): Promise<boolean> {
    const root = uri || this.getWorkspaceRoot();
    if (!root) return false;

    const dir = vscode.Uri.joinPath(root, FlashDirectoryService.DIR_NAME);
    const memories = vscode.Uri.joinPath(dir, FlashDirectoryService.MEMORIES_DIR);

    for (const path of [dir, memories]) {
      try {
        await vscode.workspace.fs.stat(path);
      } catch {
        await vscode.workspace.fs.createDirectory(path);
      }
    }
    return true;
  }

  getRulesFile(uri?: vscode.Uri): vscode.Uri | undefined {
    const root = uri || this.getWorkspaceRoot();
    if (!root) return undefined;
    return vscode.Uri.joinPath(root, FlashDirectoryService.DIR_NAME, FlashDirectoryService.RULES_FILE);
  }

  getHooksFile(uri?: vscode.Uri): vscode.Uri | undefined {
    const root = uri || this.getWorkspaceRoot();
    if (!root) return undefined;
    return vscode.Uri.joinPath(root, FlashDirectoryService.DIR_NAME, FlashDirectoryService.HOOKS_FILE);
  }

  getMemoriesDir(uri?: vscode.Uri): vscode.Uri | undefined {
    const root = uri || this.getWorkspaceRoot();
    if (!root) return undefined;
    return vscode.Uri.joinPath(root, FlashDirectoryService.DIR_NAME, FlashDirectoryService.MEMORIES_DIR);
  }

  async readTextFile(file: vscode.Uri): Promise<string | undefined> {
    try {
      const data = await vscode.workspace.fs.readFile(file);
      return new TextDecoder().decode(data);
    } catch {
      return undefined;
    }
  }

  async writeTextFile(file: vscode.Uri, content: string): Promise<void> {
    await vscode.workspace.fs.writeFile(file, new TextEncoder().encode(content));
  }

  async listMemories(uri?: vscode.Uri): Promise<string[]> {
    const dir = this.getMemoriesDir(uri);
    if (!dir) return [];
    try {
      const entries = await vscode.workspace.fs.readDirectory(dir);
      return entries.filter(([, type]) => type === vscode.FileType.File).map(([name]) => name);
    } catch {
      return [];
    }
  }

  async readMemory(name: string, uri?: vscode.Uri): Promise<string | undefined> {
    const dir = this.getMemoriesDir(uri);
    if (!dir) return undefined;
    return this.readTextFile(vscode.Uri.joinPath(dir, name));
  }

  async writeMemory(name: string, content: string, uri?: vscode.Uri): Promise<void> {
    const dir = this.getMemoriesDir(uri);
    if (!dir) return;
    await this.ensureDirectory(uri);
    await this.writeTextFile(vscode.Uri.joinPath(dir, name), content);
  }
}
