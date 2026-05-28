import * as vscode from 'vscode';

export class GitHubService {
  async clone(repoUrl: string, targetPath: string): Promise<void> {
    const terminal = vscode.window.createTerminal('فلاشة كود Git');
    terminal.show();
    terminal.sendText(`git clone ${repoUrl} "${targetPath}"`);
  }

  async commit(message: string): Promise<void> {
    const terminal = vscode.window.createTerminal('فلاشة كود Git');
    terminal.show();
    terminal.sendText(`git add -A && git commit -m "${message.replace(/"/g, '\\"')}"`);
  }

  async push(): Promise<void> {
    const terminal = vscode.window.createTerminal('فلاشة كود Git');
    terminal.show();
    terminal.sendText('git push');
  }

  async createPR(title: string, body: string): Promise<void> {
    const terminal = vscode.window.createTerminal('فلاشة كود Git');
    terminal.show();
    terminal.sendText(`gh pr create --title "${title}" --body "${body}"`);
  }
}
