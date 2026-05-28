import * as vscode from 'vscode';

export class SmartTerminal {
  private terminal: vscode.Terminal | undefined;

  async show(): Promise<void> {
    if (this.terminal) { this.terminal.show(); return; }
    this.terminal = vscode.window.createTerminal('Flasha Terminal');
    this.terminal.show();
  }

  async executeInContext(command: string): Promise<void> {
    await this.show();
    this.terminal?.sendText(command);
  }

  async suggestCommand(naturalLanguage: string): Promise<string> {
    const commands: Record<string, string> = {
      'build': 'npm run build',
      'test': 'npm test',
      'install': 'npm install',
      'deploy': 'npx vercel --prod',
      'push': 'git push',
      'commit': 'git add -A && git commit -m "update"',
      'start': 'npm start',
      'dev': 'npm run dev',
      'lint': 'npm run lint',
      'typecheck': 'npm run typecheck',
    };

    for (const [key, cmd] of Object.entries(commands)) {
      if (naturalLanguage.toLowerCase().includes(key)) {
        return cmd;
      }
    }
    return `echo "No suggestion for: ${naturalLanguage}"`;
  }
}
