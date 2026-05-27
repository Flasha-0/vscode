import * as vscode from 'vscode';

const MODE_LABELS: Record<string, { ar: string; en: string }> = {
  auto: { ar: 'ØªÙ„Ù‚Ø§Ø¦ÙŠ', en: 'Auto' },
  plan: { ar: 'ØªØ®Ø·ÙŠØ·', en: 'Plan' },
  build: { ar: 'Ø¨Ù†Ø§Ø¡', en: 'Build' },
  chat: { ar: 'Ø¯Ø±Ø¯Ø´Ø©', en: 'Chat' },
  review: { ar: 'Ù…Ø±Ø§Ø¬Ø¹Ø©', en: 'Review' },
  debug: { ar: 'ØªØµØ­ÙŠØ­', en: 'Debug' },
  test: { ar: 'Ø§Ø®ØªØ¨Ø§Ø±', en: 'Test' },
  document: { ar: 'ØªÙˆØ«ÙŠÙ‚', en: 'Document' },
  refactor: { ar: 'ØªØ­Ø³ÙŠÙ†', en: 'Refactor' },
  security: { ar: 'Ø£Ù…Ø§Ù†', en: 'Security' },
  deploy: { ar: 'Ù†Ø´Ø±', en: 'Deploy' },
  analyze: { ar: 'ØªØ­Ù„ÙŠÙ„', en: 'Analyze' },
  design: { ar: 'ØªØµÙ…ÙŠÙ…', en: 'Design' },
  migrate: { ar: 'ØªØ±Ø­ÙŠÙ„', en: 'Migrate' },
  git: { ar: 'Ø¬ÙŠØª', en: 'Git' },
};

export class FlashaModeManager {
  private _currentMode: string = 'auto';
  private _onModeChanged = new vscode.EventEmitter<string>();

  readonly onModeChanged = this._onModeChanged.event;

  get currentMode(): string { return this._currentMode; }

  setMode(mode: string) {
    if (MODE_LABELS[mode]) {
      this._currentMode = mode;
      this._onModeChanged.fire(mode);
      vscode.commands.executeCommand('setContext', 'flasha.mode', mode);
    }
  }

  getLabel(mode: string): string {
    const lang = vscode.workspace.getConfiguration('flasha').get<string>('language', 'ar');
    return MODE_LABELS[mode]?.[lang as keyof typeof MODE_LABELS[string]] ?? mode;
  }

  getAllModes(): string[] {
    return Object.keys(MODE_LABELS);
  }
}
