import * as vscode from 'vscode';
import { ChatViewProvider } from './chatViewProvider';
import { FlashaModeManager } from './modeManager';
import { OpenCodeService } from './opencodeService';

export function activate(context: vscode.ExtensionContext) {
  const modeManager = new FlashaModeManager();
  const opencode = OpenCodeService.getInstance(context);

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.chat', () => {
      vscode.commands.executeCommand('workbench.view.extension.flasha');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.setMode', async () => {
      const modes = ['auto','plan','build','chat','review','debug','test','document','refactor','security','deploy','analyze','design','migrate','git'];
      const selected = await vscode.window.showQuickPick(modes.map(m => ({ label: m, description: modeManager.getLabel(m) })));
      if (selected) {
        modeManager.setMode(selected.label);
        vscode.window.showInformationMessage(`Flasha Code: Mode set to ${selected.label}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('flasha.chat', new ChatViewProvider(context, modeManager))
  );

  opencode.start();

  console.log('[Flasha Code] Activated');
}

export function deactivate() {
  OpenCodeService.getInstance({} as any).stop();
}
