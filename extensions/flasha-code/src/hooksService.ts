import * as vscode from 'vscode';
import { FlashDirectoryService } from './flashDirectoryService';

type HookEvent = 'onSave' | 'onCommit' | 'onBuild' | 'onOpen' | 'onStart';

interface Hook {
  event: HookEvent;
  action: string;
  mode: string;
  enabled: boolean;
}

export class HooksService {
  private static STORAGE_KEY = 'flasha.hooks';
  private disposables: vscode.Disposable[] = [];
  private flashDir = new FlashDirectoryService();

  constructor(private context: vscode.ExtensionContext) {
    this.registerDefaultHooks();
  }

  private async registerDefaultHooks() {
    const hooks = await this.getHooks();

    if (hooks.find(h => h.event === 'onSave')) {
      this.disposables.push(
        vscode.workspace.onDidSaveTextDocument(doc => {
          this.executeHook('onSave', doc.fileName);
        })
      );
    }

    this.disposables.push(
      vscode.commands.registerCommand('flasha.hooks.list', async () => {
        const allHooks = await this.getHooks();
        const items = allHooks.map(h => ({
          label: `${h.enabled ? '✓' : '○'} ${h.event}: ${h.action}`,
          description: h.mode,
        }));
        vscode.window.showQuickPick(items);
      })
    );
  }

  async getHooks(): Promise<Hook[]> {
    const defaultHooks: Hook[] = [
      { event: 'onSave', action: 'auto_review', mode: 'review', enabled: true },
      { event: 'onCommit', action: 'auto_check', mode: 'test', enabled: false },
    ];

    const hooksFile = this.flashDir.getHooksFile();
    if (hooksFile) {
      const content = await this.flashDir.readTextFile(hooksFile);
      if (content) {
        try {
          return JSON.parse(content);
        } catch { /* fall through */ }
      }
    }

    const raw = this.context.globalState.get<string>(HooksService.STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultHooks;
  }

  async saveHooks(hooks: Hook[]): Promise<void> {
    const json = JSON.stringify(hooks, null, 2);
    const hooksFile = this.flashDir.getHooksFile();
    if (hooksFile) {
      await this.flashDir.ensureDirectory();
      await this.flashDir.writeTextFile(hooksFile, json);
    }
    await this.context.globalState.update(HooksService.STORAGE_KEY, json);
  }

  private async executeHook(event: HookEvent, context: string) {
    const hooks = await this.getHooks();
    for (const hook of hooks.filter(h => h.event === event && h.enabled)) {
      console.log(`[فلاشة كود] ${event} → ${hook.action} (${context})`);
    }
  }

  dispose() {
    this.disposables.forEach(d => d.dispose());
  }
}
