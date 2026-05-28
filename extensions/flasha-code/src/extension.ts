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
import { FlashDirectoryService } from './flashDirectoryService';
import { ProviderRegistry } from './providers/providerRegistry';
import { MCPManager } from './mcp/mcpManager';
import { GitHubMcp } from './mcp/githubMcp';
import { SupabaseMcp } from './mcp/supabaseMcp';
import { PlaywrightMcp } from './mcp/playwrightMcp';
import { FigmaMcp } from './mcp/figmaMcp';
import { TemplateManager } from './templateManager';
import { ApiTesterService } from './apiTester';
import { FirebaseService } from './firebaseService';
import { AnalyticsService } from './analyticsService';
import { EnvironmentManagerService } from './environmentManager';
import { AgentService } from './agents/agentService';

export function activate(context: vscode.ExtensionContext) {
  const modeManager = new FlashaModeManager();
  const opencode = OpenCodeService.getInstance(context);
  _opencode = opencode;
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
  const providers = new ProviderRegistry();
  const mcp = new MCPManager();
  const templates = new TemplateManager();
  const apiTester = new ApiTesterService();
  const firebase = new FirebaseService();
  const analytics = new AnalyticsService();
  const envManager = new EnvironmentManagerService();
  const agents = new AgentService();

  mcp.register(new GitHubMcp());
  mcp.register(new SupabaseMcp());
  mcp.register(new PlaywrightMcp());
  mcp.register(new FigmaMcp());

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
        vscode.window.showInformationMessage(`فلاشة كود: ${modeManager.getLabel(selected.label)}`);
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

  const flashDir = new FlashDirectoryService();
  const wsRoot = flashDir.getWorkspaceRoot();
  if (wsRoot) {
    flashDir.ensureDirectory(wsRoot);
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.init', async () => {
      const root = flashDir.getWorkspaceRoot();
      if (root) {
        await flashDir.ensureDirectory(root);
        vscode.window.showInformationMessage('تم تهيئة مجلد فلاشة كود');
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.template', async () => {
      const list = await templates.listTemplates();
      const picked = await vscode.window.showQuickPick(
        list.map(t => ({ label: t.name, description: t.description }))
      );
      if (picked && vscode.workspace.workspaceFolders?.[0]) {
        await templates.scaffold(
          list.find(t => t.name === picked.label)!.id,
          vscode.workspace.workspaceFolders[0].uri
        );
        vscode.window.showInformationMessage(`Scaffolded: ${picked.label}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.api', async () => {
      const url = await vscode.window.showInputBox({ prompt: 'API URL' });
      if (url) {
        const result = await apiTester.send({ method: 'GET', url, headers: {} });
        vscode.window.showInformationMessage(`${result.status}: ${result.body.slice(0, 100)}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.firebase.connect', () => firebase.connect())
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.analytics', async () => {
      const summary = await analytics.getSummary();
      const items = summary.map(s => `${s.event}: ${s.count}`);
      vscode.window.showQuickPick(items);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.env.switch', async () => {
      const envs = envManager.detectEnvironments();
      const picked = await vscode.window.showQuickPick(envs);
      if (picked) await envManager.switchEnv(picked);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.providers', async () => {
      const list = providers.getAll();
      const items = await Promise.all(list.map(async p => ({
        label: p.name,
        description: `${p.models.length} models - ${await p.isAvailable() ? '✓' : '✗'}`,
      })));
      vscode.window.showQuickPick(items);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.agents.list', async () => {
      const list = agents.getAgents();
      const picked = await vscode.window.showQuickPick(
        list.map(a => ({ label: `${a.icon} ${a.name}`, description: a.description }))
      );
      if (picked) {
        const agent = list.find(a => `${a.icon} ${a.name}` === picked.label);
        if (agent) await agents.runAgent(agent.id);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.agents.run', async () => {
      const list = agents.getAgents();
      const picked = await vscode.window.showQuickPick(
        list.map(a => ({ label: `${a.icon} ${a.name}`, description: a.description }))
      );
      if (picked) {
        const agent = list.find(a => `${a.icon} ${a.name}` === picked.label);
        if (agent) await agents.runAgent(agent.id);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('flasha.agents.review', () => agents.runAgent('code-review'))
  );

  vscode.commands.executeCommand('setContext', 'flasha.mode', 'auto');
  opencode.start();
  rules.detectProjectRules();
}

let _opencode: OpenCodeService | undefined;

export function deactivate() {
  _opencode?.stop();
}
