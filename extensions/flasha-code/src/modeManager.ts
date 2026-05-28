import * as vscode from 'vscode';

const MODE_LABELS: Record<string, { ar: string; en: string }> = {
  auto: { ar: 'تلقائي', en: 'Auto' },
  plan: { ar: 'تخطيط', en: 'Plan' },
  build: { ar: 'بناء', en: 'Build' },
  chat: { ar: 'دردشة', en: 'Chat' },
  review: { ar: 'مراجعة', en: 'Review' },
  debug: { ar: 'تصحيح', en: 'Debug' },
  test: { ar: 'اختبار', en: 'Test' },
  document: { ar: 'توثيق', en: 'Document' },
  refactor: { ar: 'تحسين', en: 'Refactor' },
  security: { ar: 'أمان', en: 'Security' },
  deploy: { ar: 'نشر', en: 'Deploy' },
  analyze: { ar: 'تحليل', en: 'Analyze' },
  design: { ar: 'تصميم', en: 'Design' },
  migrate: { ar: 'ترحيل', en: 'Migrate' },
  git: { ar: 'جيت', en: 'Git' },
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
