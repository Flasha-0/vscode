import { WebviewViewProvider, WebviewView, WebviewViewResolveContext, CancellationToken } from 'vscode';

export class FlashaViewProvider implements WebviewViewProvider {
  public static readonly viewType = 'flasha.chat';

  private _view?: WebviewView;

  resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    token: CancellationToken
  ): void | Thenable<void> {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [],
    };

    webviewView.webview.html = this.getHtmlContent();
  }

  private getHtmlContent(): string {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flasha Code</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #0D1117;
      color: #E6EDF3;
      padding: 12px;
    }
    .mode-selector {
      display: flex;
      gap: 6px;
      margin-bottom: 12px;
      overflow-x: auto;
    }
    .mode-btn {
      padding: 4px 12px;
      border-radius: 6px;
      border: 1px solid #30363D;
      background: #161B22;
      color: #8B949E;
      cursor: pointer;
      font-size: 12px;
      white-space: nowrap;
    }
    .mode-btn.active {
      background: #F59E0B;
      color: #0D1117;
      border-color: #F59E0B;
    }
    .chat-area {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 12px;
      min-height: 200px;
    }
    .message {
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      line-height: 1.5;
    }
    .message.user {
      background: #1A2332;
      border: 1px solid #30363D;
    }
    .message.assistant {
      background: #161B22;
      border: 1px solid #21262D;
    }
    .input-area {
      display: flex;
      gap: 8px;
      position: sticky;
      bottom: 0;
      background: #0D1117;
      padding-top: 8px;
    }
    textarea {
      flex: 1;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #30363D;
      background: #161B22;
      color: #E6EDF3;
      font-size: 13px;
      resize: none;
      min-height: 40px;
    }
    button {
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      background: #F59E0B;
      color: #0D1117;
      cursor: pointer;
      font-weight: 600;
    }
    .model-picker {
      margin-bottom: 8px;
      font-size: 12px;
      color: #8B949E;
    }
    select {
      background: #161B22;
      color: #E6EDF3;
      border: 1px solid #30363D;
      border-radius: 4px;
      padding: 2px 6px;
    }
  </style>
</head>
<body>
  <div class="mode-selector" id="modes"></div>
  <div class="model-picker">
    Ø§Ù„Ù…ÙˆØ¯ÙŠÙ„: <select id="modelSelect">
      <option value="opencode/big-pickle">Big Pickle</option>
      <option value="opencode/deepseek-v4-flash-free">DeepSeek V4 Flash</option>
    </select>
  </div>
  <div class="chat-area" id="chatArea"></div>
  <div class="input-area">
    <textarea id="inputField" placeholder="Ø§ÙƒØªØ¨ Ø±Ø³Ø§Ù„ØªÙƒ Ù‡Ù†Ø§..." rows="2"></textarea>
    <button id="sendBtn">Ø¥Ø±Ø³Ø§Ù„</button>
  </div>
  <script>
    const vscode = acquireVsCodeApi();
    const modes = ['auto','plan','build','chat','review','debug','test','document','refactor','security','deploy'];
    let activeMode = 'auto';
    const modeContainer = document.getElementById('modes');
    modes.forEach(m => {
      const btn = document.createElement('button');
      btn.className = 'mode-btn' + (m === 'auto' ? ' active' : '');
      btn.textContent = m;
      btn.onclick = () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeMode = m;
        vscode.postMessage({ type: 'setMode', value: m });
      };
      modeContainer.appendChild(btn);
    });
    document.getElementById('sendBtn').onclick = () => {
      const input = document.getElementById('inputField');
      const text = input.value.trim();
      if (!text) return;
      const chatArea = document.getElementById('chatArea');
      const msg = document.createElement('div');
      msg.className = 'message user';
      msg.textContent = text;
      chatArea.appendChild(msg);
      input.value = '';
      vscode.postMessage({ type: 'sendMessage', text, mode: activeMode });
    };
  </script>
</body>
</html>`;
  }
}
