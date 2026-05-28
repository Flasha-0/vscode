import * as vscode from 'vscode';

export class SupabaseService {
  async connect(): Promise<void> {
    const url = await vscode.window.showInputBox({
      prompt: 'Supabase Project URL',
      placeHolder: 'https://xxxxx.supabase.co',
      validateInput: v => v?.startsWith('https://') ? null : 'Must start with https://'
    });
    if (!url) return;
    const key = await vscode.window.showInputBox({
      prompt: 'Supabase anon/public key',
      password: true
    });
    if (!key) return;
    const config = vscode.workspace.getConfiguration('flasha');
    await config.update('supabase.url', url, vscode.ConfigurationTarget.Global);
    await config.update('supabase.key', key, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage('Connected to Supabase');
  }

  async viewTable(table: string): Promise<void> {
    const config = vscode.workspace.getConfiguration('flasha');
    const url = config.get<string>('supabase.url');
    const key = config.get<string>('supabase.key');
    if (!url || !key) {
      vscode.window.showErrorMessage('Connect to Supabase first');
      return;
    }
    const panel = vscode.window.createWebviewPanel(
      'flasha.supabase', `Supabase: ${table}`,
      vscode.ViewColumn.Active, { enableScripts: true }
    );
    panel.webview.html = `<html><body style="background:#0D1117;color:#E6EDF3;padding:20px">Fetching ${table}...</body></html>`;
  }
}
