import * as vscode from 'vscode';
import { ChatViewProvider } from './chatViewProvider';
import { FlashaModeManager } from './modeManager';
import { OpenCodeService } from './opencodeService';
import { AutoModeDetector } from './autoModeDetector';
import { MemoryService } from './memoryService';
import { RulesService } from './rulesService';
import { CheckpointsService } from './checkpointsService';
import { FlashaStatusBar } from './statusBar';
import { GitHubService } from './githubService';
import { VercelService } from './vercelService';
import { LivePreviewService } from './livePreviewService';
import { SupabaseService } from './supabaseService';
import { HooksService } from './hooksService';
import { SmartTerminal } from './smartTerminal';

export function activate(context: vscode.ExtensionContext) {
  const modeManager = new FlashaModeManager();
  const opencode = OpenCodeService.getInstance(context);
  const autoDetect = new AutoModeDetector(modeManager);
  const memory = new MemoryService(context);
  const rules = new RulesService(context);
  const checkpoints = new CheckpointsService(context);
  const git = new GitHubService();
  const vercel = new VercelService();
  const preview = new LivePreviewService();
  const supabase = new SupabaseService();
  const hooks = new HooksService(context);
  const terminal = new SmartTerminal();

  new FlashaStatusBar(modeManager);

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.chat', () => {
      vscode.commands.executeCommand('workbench.view.extension.flasha');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.setMode', async () => {
      const selected = await vscode.window.showQuickPick(
        modeManager.getAllModes().map(m => ({
          label: m, description: modeManager.getLabel(m)
        }))
      );
      if (selected) {
        modeManager.setMode(selected.label);
        vscode.window.showInformationMessage(`Flasha: ${modeManager.getLabel(selected.label)}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.checkpoint.save', async () => {
      const label = await vscode.window.showInputBox({ prompt: 'Checkpoint label' });
      if (label) {
        const id = await checkpoints.save(label);
        vscode.window.showInformationMessage(`Checkpoint saved: ${id}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.checkpoint.restore', async () => {
      const list = await checkpoints.list();
      const picked = await vscode.window.showQuickPick(
        list.map(c => ({ label: c.label, description: c.id }))
      );
      if (picked) {
        await checkpoints.restore(picked.description!);
        vscode.window.showInformationMessage('Checkpoint restored');
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.rules.generate', async () => {
      const wsFolder = vscode.workspace.workspaceFolders?.[0];
      if (wsFolder) {
        await rules.autoGenerateRules(wsFolder.uri);
        vscode.window.showInformationMessage('Rules generated');
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.git.clone', () => {
      vscode.window.showInputBox({ prompt: 'GitHub repo URL' })
        .then(url => { if (url) git.clone(url, vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || ''); });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.deploy', () => vercel.deploy())
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.deploy.preview', () => vercel.deployPreview())
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.preview', () => preview.show())
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.supabase.connect', () => supabase.connect())
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.terminal', () => terminal.show())
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.terminal.run', async () => {
      const input = await vscode.window.showInputBox({ prompt: 'What do you want to do?' });
      if (input) {
        const cmd = await terminal.suggestCommand(input);
        terminal.executeInContext(cmd);
      }
    })
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('flasha.chat',
      new ChatViewProvider(context, modeManager, opencode, autoDetect, memory))
  );

  vscode.commands.executeCommand('setContext', 'flasha.mode', 'auto');
  opencode.start();
  rules.detectProjectRules();
}

export function deactivate() {
  OpenCodeService.getInstance({} as any).stop();
}
