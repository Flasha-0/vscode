import * as vscode from 'vscode';
import type { Agent, AgentContext, AgentResult } from './agentTypes';

export class DocAgent implements Agent {
  readonly id = 'auto-doc';
  readonly name = 'Auto Document';
  readonly description = 'Generates JSDoc/TSDoc comments for undocumented functions';
  readonly icon = '📝';

  async run(context: AgentContext): Promise<AgentResult> {
    const start = Date.now();

    context.onProgress('Scanning for undocumented functions...');
    const files = await vscode.workspace.findFiles(
      '**/*.{ts,js,tsx,jsx}',
      '**/node_modules/**'
    );

    let documented = 0;
    let totalFunctions = 0;

    for (let i = 0; i < files.length; i++) {
      if (context.signal.aborted) return { success: false, message: 'Cancelled', durationMs: Date.now() - start };
      context.onProgress(`Scanning ${files[i].fsPath} (${i + 1}/${files.length})`);

      const doc = await vscode.workspace.openTextDocument(files[i]);
      const text = doc.getText();
      const lines = text.split('\n');

      for (let l = 0; l < lines.length; l++) {
        const line = lines[l].trim();
        const isFunction = /^(export\s+)?(async\s+)?function\s+|=>\s*{/.test(line) ||
          /^\s*\w+\s*=\s*(async\s+)?\(/.test(line);

        if (isFunction) {
          totalFunctions++;
          const prevLine = lines[l - 1]?.trim();
          if (prevLine && !prevLine.startsWith('/*') && !prevLine.startsWith('*') && !prevLine.startsWith('//')) {
            documented++;
          }
        }
      }
    }

    const message = documented === 0
      ? 'All functions are documented'
      : `${documented}/${totalFunctions} functions need documentation`;

    return {
      success: true,
      message,
      details: `${totalFunctions} total functions, ${totalFunctions - documented} documented`,
      durationMs: Date.now() - start,
    };
  }
}
