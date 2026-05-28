import * as vscode from 'vscode';

interface EnvVar {
  key: string;
  value: string;
}

export class EnvironmentManagerService {
  async listEnvFiles(): Promise<string[]> {
    const files = await vscode.workspace.findFiles('**/.env*', '**/node_modules/**');
    return files.map(f => f.fsPath);
  }

  async readEnvFile(uri: vscode.Uri): Promise<EnvVar[]> {
    const data = await vscode.workspace.fs.readFile(uri);
    const text = new TextDecoder().decode(data);
    return text.split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => {
        const eq = line.indexOf('=');
        if (eq === -1) return { key: line.trim(), value: '' };
        return { key: line.substring(0, eq).trim(), value: line.substring(eq + 1).trim() };
      });
  }

  async writeEnvFile(uri: vscode.Uri, vars: EnvVar[]): Promise<void> {
    const text = vars.map(v => `${v.key}=${v.value}`).join('\n') + '\n';
    await vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(text));
  }

  async switchEnv(envName: string): Promise<void> {
    const envFile = vscode.Uri.joinPath(
      vscode.workspace.workspaceFolders?.[0]?.uri || vscode.Uri.file('.'),
      `.env.${envName}`
    );
    const mainEnv = vscode.Uri.joinPath(
      vscode.workspace.workspaceFolders?.[0]?.uri || vscode.Uri.file('.'),
      '.env'
    );

    try {
      const data = await vscode.workspace.fs.readFile(envFile);
      await vscode.workspace.fs.writeFile(mainEnv, data);
      vscode.window.showInformationMessage(`Switched to ${envName} environment`);
    } catch {
      vscode.window.showErrorMessage(`Environment file .env.${envName} not found`);
    }
  }

  detectEnvironments(): string[] {
    return ['development', 'staging', 'production', 'test', 'local'];
  }
}
