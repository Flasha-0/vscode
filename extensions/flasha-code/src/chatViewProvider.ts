import * as vscode from 'vscode';
import { FlashaModeManager } from './modeManager';
import { OpenCodeService } from './opencodeService';
import { AutoModeDetector } from './autoModeDetector';
import { MemoryService } from './memoryService';

export class ChatViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'flasha.chat';
  private _view?: vscode.WebviewView;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly modeManager: FlashaModeManager,
    private readonly opencode: OpenCodeService,
    private readonly autoDetect: AutoModeDetector,
    private readonly memory: MemoryService
  ) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this.getHtml();

    webviewView.webview.onDidReceiveMessage(async (msg) => {
      switch (msg.type) {
        case 'sendMessage': {
          this.autoDetect.autoSetMode(msg.text);
          await this.memory.set('last_input', msg.text);
          const model = vscode.workspace.getConfiguration('flasha').get<string>('defaultModel', 'opencode/big-pickle');
          const response = await this.opencode.query(model, msg.mode, msg.text);
          webviewView.webview.postMessage({ type: 'response', text: response });
          break;
        }
        case 'setMode':
          this.modeManager.setMode(msg.value);
          break;
      }
    });
  }

  private getHtml(): string {
    const modes = this.modeManager.getAllModes();
    const modeBtns = modes.map(m =>
      `<button class="mode-btn${m === 'auto' ? ' active' : ''}" data-mode="${m}">${m}</button>`
    ).join('');

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Flasha Code</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,-apple-system,sans-serif;background:#0D1117;color:#E6EDF3;padding:12px}
.modes{display:flex;gap:4px;margin-bottom:10px;overflow-x:auto;padding-bottom:4px}
.mode-btn{padding:3px 10px;border-radius:5px;border:1px solid #30363D;background:#161B22;color:#8B949E;cursor:pointer;font-size:11px;white-space:nowrap}
.mode-btn.active{background:#F59E0B;color:#0D1117;border-color:#F59E0B}
.chat{display:flex;flex-direction:column;gap:8px;margin-bottom:10px;min-height:150px}
.msg{padding:8px 12px;border-radius:6px;font-size:13px;line-height:1.5}
.msg.user{background:#1A2332;border:1px solid #30363D}
.msg.ai{background:#161B22;border:1px solid #21262D}
.msg.ai .label{font-size:10px;color:#8B949E;margin-bottom:4px}
.input{display:flex;gap:6px;position:sticky;bottom:0;background:#0D1117;padding-top:6px}
textarea{flex:1;padding:8px 12px;border-radius:6px;border:1px solid #30363D;background:#161B22;color:#E6EDF3;font-size:13px;resize:none;min-height:36px}
button.send{padding:6px 14px;border-radius:6px;border:none;background:#F59E0B;color:#0D1117;cursor:pointer;font-weight:600}
.loading{text-align:center;color:#8B949E;font-size:12px;padding:8px}
</style></head><body>
<div class="modes">${modeBtns}</div>
<div class="chat" id="chat"></div>
<div class="input"><textarea id="input" placeholder="Message..." rows="2"></textarea><button class="send" id="send">Send</button></div>
<script>
const vscode=acquireVsCodeApi();
let mode='auto';
document.querySelectorAll('.mode-btn').forEach(b=>{b.onclick=()=>{
document.querySelectorAll('.mode-btn').forEach(x=>x.classList.remove('active'));
b.classList.add('active');mode=b.dataset.mode;vscode.postMessage({type:'setMode',value:mode})}});
document.getElementById('send').onclick=()=>{
const i=document.getElementById('input');const t=i.value.trim();if(!t)return;
const c=document.getElementById('chat');const m=document.createElement('div');
m.className='msg user';m.textContent=t;c.appendChild(m);i.value='';
const l=document.createElement('div');l.className='loading';l.textContent='...';c.appendChild(l);
vscode.postMessage({type:'sendMessage',text:t,mode})};
document.getElementById('input').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();document.getElementById('send').click()}};
window.addEventListener('message',e=>{const msg=e.data;if(msg.type==='response'){
const l=document.querySelector('.loading');if(l)l.remove();
const c=document.getElementById('chat');const r=document.createElement('div');
r.className='msg ai';r.innerHTML='<div class="label">Big Pickle</div>'+msg.text;c.appendChild(r)}});
</script></body></html>`;
  }
}
