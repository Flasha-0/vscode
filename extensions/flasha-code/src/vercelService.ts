import * as vscode from 'vscode';

export class VercelService {
  async deploy(): Promise<void> {
    const folder = vscode.workspace.workspaceFolders?.[0];
    if (!folder) {
      vscode.window.showErrorMessage('Open a project first');
      return;
    }
    const terminal = vscode.window.createTerminal('فلاشة كود Vercel');
    terminal.show();
    terminal.sendText('npx vercel --prod');
    vscode.window.showInformationMessage('Deploying to Vercel...');
  }

  async deployPreview(): Promise<void> {
    const terminal = vscode.window.createTerminal('فلاشة كود Vercel');
    terminal.show();
    terminal.sendText('npx vercel');
  }
}
