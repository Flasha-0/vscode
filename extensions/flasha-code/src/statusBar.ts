import * as vscode from 'vscode';
import { FlashaModeManager } from './modeManager';

export class FlashaStatusBar {
  private item: vscode.StatusBarItem;

  constructor(private modeManager: FlashaModeManager) {
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.item.command = 'flasha.setMode';
    this.item.backgroundColor = undefined;
    this.update();
    this.item.show();
    modeManager.onModeChanged(() => this.update());
  }

  private update() {
    const mode = this.modeManager.currentMode;
    const label = this.modeManager.getLabel(mode);
    this.item.text = `$(flame) ${mode.toUpperCase()}`;
    this.item.tooltip = `Flasha Code: ${label}`;
    this.item.color = mode === 'auto' ? '#F59E0B' : '#58A6FF';
  }

  dispose() { this.item.dispose(); }
}
