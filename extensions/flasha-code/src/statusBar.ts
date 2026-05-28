import * as vscode from 'vscode';
import { FlashaModeManager } from './modeManager';

export class FlashaStatusBar {
  private item: vscode.StatusBarItem;
  private modelItem: vscode.StatusBarItem;
  private modeManager: FlashaModeManager;

  constructor(modeManager: FlashaModeManager) {
    this.modeManager = modeManager;
    this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.item.command = 'flasha.setMode';
    this.item.backgroundColor = undefined;
    this.updateMode();
    this.item.show();

    this.modelItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
    this.modelItem.command = 'flasha.providers';
    this.updateModel();
    this.modelItem.show();

    modeManager.onModeChanged(() => this.updateMode());
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('flasha.defaultModel')) this.updateModel();
    });
  }

  private updateMode() {
    const mode = this.modeManager.currentMode;
    const label = this.modeManager.getLabel(mode);
    this.item.text = `$(flame) ${mode.toUpperCase()}`;
    this.item.tooltip = `Flasha Code: ${label}`;
    this.item.color = mode === 'auto' ? '#F59E0B' : '#58A6FF';
  }

  private updateModel() {
    const model = vscode.workspace.getConfiguration('flasha').get<string>('defaultModel', 'opencode/big-pickle');
    const short = model.split('/').pop() || model;
    this.modelItem.text = `$(circuit-board) ${short}`;
    this.modelItem.tooltip = `Model: ${model}`;
  }

  dispose() {
    this.item.dispose();
    this.modelItem.dispose();
  }
}
