import * as vscode from 'vscode';

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
          label: `${h.enabled ? 'âœ“' : 'â—‹'} ${h.event}: ${h.action}`,
          description: h.mode,
        }));
        vscode.window.showQuickPick(items);
      })
    );
  }

  async getHooks(): Promise<Hook[]> {
    const raw = this.context.globalState.get<string>(HooksService.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [
      { event: 'onSave', action: 'auto_review', mode: 'review', enabled: true },
      { event: 'onCommit', action: 'auto_check', mode: 'test', enabled: false },
    ];
  }

  private async executeHook(event: HookEvent, context: string) {
    const hooks = await this.getHooks();
    for (const hook of hooks.filter(h => h.event === event && h.enabled)) {
      console.log(`[Flasha Hook] ${event} â†’ ${hook.action} (${context})`);
    }
  }

  dispose() {
    this.disposables.forEach(d => d.dispose());
  }
}
