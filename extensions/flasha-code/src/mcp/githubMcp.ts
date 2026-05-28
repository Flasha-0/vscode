import * as vscode from 'vscode';
import type { MCPServer, MCPRequest, MCPResponse } from './mcpManager';

export class GitHubMcp implements MCPServer {
  readonly name = 'GitHub';
  readonly description = 'Manage GitHub repos, issues, PRs';

  canHandle(action: string): boolean {
    return action.startsWith('github.');
  }

  async execute(request: MCPRequest): Promise<MCPResponse> {
    const { action, params } = request;
    try {
      switch (action) {
        case 'github.clone':
          return this.clone(params.url, params.directory);
        case 'github.commit':
          return this.commit(params.message);
        case 'github.push':
          return this.push();
        case 'github.pr':
          return this.createPR(params.title, params.body);
        case 'github.issues':
          return this.listIssues(params.repo);
        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  private async clone(url: string, directory?: string): Promise<MCPResponse> {
    const terminal = vscode.window.createTerminal('Git Clone');
    terminal.show();
    terminal.sendText(`git clone ${url} ${directory || ''}`);
    return { success: true, data: { message: `Cloning ${url}` } };
  }

  private async commit(message: string): Promise<MCPResponse> {
    const terminal = vscode.window.createTerminal('Git Commit');
    terminal.show();
    terminal.sendText(`git add -A && git commit -m "${message}"`);
    return { success: true, data: { message: `Committed: ${message}` } };
  }

  private async push(): Promise<MCPResponse> {
    const terminal = vscode.window.createTerminal('Git Push');
    terminal.show();
    terminal.sendText('git push');
    return { success: true, data: { message: 'Pushing...' } };
  }

  private async createPR(title: string, body?: string): Promise<MCPResponse> {
    const terminal = vscode.window.createTerminal('Git PR');
    terminal.show();
    terminal.sendText(`gh pr create --title "${title}" --body "${body || ''}"`);
    return { success: true, data: { message: `Creating PR: ${title}` } };
  }

  private async listIssues(repo?: string): Promise<MCPResponse> {
    const cmd = repo ? `gh issue list -R ${repo}` : 'gh issue list';
    const terminal = vscode.window.createTerminal('Git Issues');
    terminal.show();
    terminal.sendText(cmd);
    return { success: true, data: { message: 'Listing issues...' } };
  }
}
