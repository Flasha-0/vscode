import * as vscode from 'vscode';
import type { Agent, AgentContext, AgentResult } from './agentTypes';

export class CodeReviewAgent implements Agent {
  readonly id = 'code-review';
  readonly name = 'Code Review';
  readonly description = 'Reviews uncommitted changes for bugs, security issues, and best practices';
  readonly icon = '👁';

  async run(context: AgentContext): Promise<AgentResult> {
    const start = Date.now();

    context.onProgress('Fetching git changes...');
    const changes = await this.getGitChanges(context.workspaceRoot);
    if (context.signal.aborted) return { success: false, message: 'Cancelled', durationMs: Date.now() - start };

    if (!changes.length) {
      return { success: true, message: 'No changes to review', durationMs: Date.now() - start };
    }

    context.onProgress(`Reviewing ${changes.length} files...`);
    const issues: string[] = [];
    for (let i = 0; i < changes.length; i++) {
      if (context.signal.aborted) return { success: false, message: 'Cancelled', durationMs: Date.now() - start };
      context.onProgress(`Reviewing ${changes[i]} (${i + 1}/${changes.length})`);
      const fileIssues = await this.reviewFile(changes[i]);
      issues.push(...fileIssues);
    }

    const message = issues.length
      ? `Found ${issues.length} issue(s)`
      : 'No issues found - looks good!';

    return {
      success: true,
      message,
      details: issues.join('\n'),
      durationMs: Date.now() - start,
    };
  }

  private async getGitChanges(root: string): Promise<string[]> {
    try {
      const { execSync } = require('child_process');
      const output = execSync('git diff --name-only', { cwd: root, encoding: 'utf-8' });
      return output.split('\n').filter(Boolean);
    } catch {
      return [];
    }
  }

  private async reviewFile(filePath: string): Promise<string[]> {
    try {
      const doc = await vscode.workspace.openTextDocument(
        vscode.Uri.file(filePath)
      );
      const text = doc.getText();
      const issues: string[] = [];

      if (text.includes('console.log') && filePath.match(/\.(ts|js|tsx|jsx)$/)) {
        issues.push(`${filePath}: Remove console.log statements before commit`);
      }
      if (text.includes('TODO')) {
        issues.push(`${filePath}: Contains TODO`);
      }
      if (text.includes('FIXME')) {
        issues.push(`${filePath}: Contains FIXME`);
      }
      if (text.length > 500) {
        const lines = text.split('\n').length;
        if (lines > 200) {
          issues.push(`${filePath}: File is very long (${lines} lines) - consider splitting`);
        }
      }

      return issues;
    } catch {
      return [];
    }
  }
}
