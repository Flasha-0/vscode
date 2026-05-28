import * as vscode from 'vscode';
import * as path from 'path';
import { FlashaModeManager } from './modeManager';
import { OpenCodeService } from './opencodeService';
import { AutoModeDetector } from './autoModeDetector';
import { MemoryService } from './memoryService';
import { ProviderRegistry } from './providers/providerRegistry';
import type { LLMRequest } from './providers/llmProvider';

export class ChatViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'flasha.chat';
  private _view?: vscode.WebviewView;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly modeManager: FlashaModeManager,
    private readonly opencode: OpenCodeService,
    private readonly autoDetect: AutoModeDetector,
    private readonly memory: MemoryService,
    private readonly providers: ProviderRegistry
  ) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this.getHtml(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (msg) => {
      switch (msg.type) {
        case 'sendMessage': {
          this.autoDetect.autoSetMode(msg.content);
          await this.memory.set('last_input', msg.content);
          const model = vscode.workspace.getConfiguration('flasha').get<string>('defaultModel', 'opencode/big-pickle');
          let response = await this.opencode.query(model, msg.mode, msg.content);
          if (response.startsWith('[Offline]') || response.startsWith('[HTTP') || response.startsWith('[Timeout]')) {
            const available = this.providers.getAll().filter(p => p.models.length > 0);
            if (available.length > 0) {
              const provider = available[0];
              const providerRequest: LLMRequest = {
                model: provider.models[0],
                messages: [{ role: 'user', content: msg.content }],
                temperature: 0.7,
              };
              try {
                const providerResult = await provider.query(providerRequest);
                response = providerResult.content;
              } catch {
                response = '❌ مافيش اتصال. شغل OpenCode:\n`opencode serve --port 4096`';
              }
            } else {
              response = '❌ مافيش Provider متاح. صل OpenCode أو ضيف API Key في الإعدادات.';
            }
          }
          webviewView.webview.postMessage({ type: 'addMessage', message: { role: 'assistant', content: response, timestamp: Date.now() } });
          break;
        }
        case 'setMode':
          this.modeManager.setMode(msg.mode);
          break;
        case 'setModel':
          vscode.workspace.getConfiguration('flasha').update('defaultModel', msg.model, true);
          break;
      }
    });
  }

  private getHtml(webview: vscode.Webview): string {
    const bundlePath = vscode.Uri.file(path.join(this.context.extensionPath, 'dist', 'webview', 'webview.js'));
    const bundleUri = webview.asWebviewUri(bundlePath);

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${webview.cspSource} 'unsafe-eval'; style-src ${webview.cspSource} 'unsafe-inline';">
  <title>فلاشة كود</title>
</head>
<body>
  <div id="root"></div>
  <script src="${bundleUri}"></script>
</body>
</html>`;
  }
}
