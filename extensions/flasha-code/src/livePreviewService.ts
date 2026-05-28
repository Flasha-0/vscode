import * as vscode from 'vscode';

export class LivePreviewService {
  private panel: vscode.WebviewPanel | undefined;
  private disposables: vscode.Disposable[] = [];

  async show(): Promise<void> {
    if (this.panel) { this.panel.reveal(); return; }

    this.panel = vscode.window.createWebviewPanel(
      'flasha.livePreview', 'فلاشة كود معاينة',
      vscode.ViewColumn.Beside, { enableScripts: true }
    );

    this.panel.webview.html = '<html><body style="background:#0D1117;color:#E6EDF3;display:flex;align-items:center;justify-content:center;font-family:system-ui">Open a file to preview</body></html>';

    this.disposables.push(
      vscode.workspace.onDidSaveTextDocument(doc => {
        if (this.panel) {
          this.refresh(doc);
        }
      })
    );

    this.panel.onDidDispose(() => {
      this.panel = undefined;
      this.disposables.forEach(d => d.dispose());
    });
  }

  private async refresh(doc: vscode.TextDocument): Promise<void> {
    if (!this.panel) return;
    const ext = doc.fileName.split('.').pop()?.toLowerCase();
    const htmlContent = await this.renderPreview(doc, ext);
    this.panel.webview.html = htmlContent;
  }

  private async renderPreview(doc: vscode.TextDocument, ext?: string): Promise<string> {
    switch (ext) {
      case 'html':
      case 'htm':
        return doc.getText();
      case 'md':
        return `<html><body>${doc.getText().replace(/\n/g, '<br>')}</body></html>`;
      case 'svg':
        return `<html><body style="margin:0;background:white">${doc.getText()}</body></html>`;
      default:
        return `<html><body style="background:#0D1117;color:#E6EDF3;padding:20px;white-space:pre;font-family:monospace">${doc.getText().substring(0, 5000)}</body></html>`;
    }
  }
}
