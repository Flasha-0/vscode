import * as vscode from 'vscode';
import type { Agent, AgentContext, AgentRun, AgentStatus, AgentResult } from './agentTypes';
import { CodeReviewAgent } from './codeReviewAgent';
import { TestAgent } from './testAgent';
import { DocAgent } from './docAgent';

export class AgentService {
  private agents = new Map<string, Agent>();
  private runs = new Map<string, AgentRun>();
  private runCounter = 0;

  constructor() {
    this.register(new CodeReviewAgent());
    this.register(new TestAgent());
    this.register(new DocAgent());
  }

  register(agent: Agent) {
    this.agents.set(agent.id, agent);
  }

  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  getRuns(): AgentRun[] {
    return Array.from(this.runs.values()).sort((a, b) => b.startedAt - a.startedAt);
  }

  async runAgent(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Agent not found: ${agentId}`);

    const runId = `run-${++this.runCounter}-${Date.now()}`;
    const run: AgentRun = {
      agentId, runId, status: 'running', startedAt: Date.now(),
    };
    this.runs.set(runId, run);

    const wsRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    const abortController = new AbortController();

    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: `🤖 ${agent.icon} ${agent.name}`,
      cancellable: true,
    }, async (progress, token) => {
      token.onCancellationRequested(() => abortController.abort());

      const context: AgentContext = {
        workspaceRoot: wsRoot,
        onProgress: (message) => {
          progress.report({ message });
        },
        signal: abortController.signal,
      };

      try {
        const result = await agent.run(context);
        run.status = result.success ? 'completed' : 'failed';
        run.completedAt = Date.now();
        run.result = result;

        if (result.success) {
          vscode.window.showInformationMessage(`✅ ${agent.name}: ${result.message}`);
        } else {
          vscode.window.showWarningMessage(`⚠️ ${agent.name}: ${result.message}`);
        }
      } catch (e: any) {
        run.status = 'failed';
        run.completedAt = Date.now();
        run.result = { success: false, message: e.message, durationMs: Date.now() - run.startedAt };
        vscode.window.showErrorMessage(`❌ ${agent.name}: ${e.message}`);
      }
    });
  }
}
