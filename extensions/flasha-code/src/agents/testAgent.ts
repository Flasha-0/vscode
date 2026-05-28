import { execSync } from 'child_process';
import type { Agent, AgentContext, AgentResult } from './agentTypes';

export class TestAgent implements Agent {
  readonly id = 'auto-test';
  readonly name = 'Auto Test';
  readonly description = 'Runs project tests and reports results';
  readonly icon = '🧪';

  async run(context: AgentContext): Promise<AgentResult> {
    const start = Date.now();

    context.onProgress('Detecting test framework...');
    const cmd = this.detectTestCommand(context.workspaceRoot);
    if (!cmd) {
      return { success: false, message: 'No test framework detected', durationMs: Date.now() - start };
    }

    context.onProgress(`Running: ${cmd}`);
    try {
      const output = execSync(cmd, { cwd: context.workspaceRoot, encoding: 'utf-8', timeout: 120000 });
      const passed = !output.includes('FAIL') && !output.includes('failed');
      return {
        success: passed,
        message: passed ? 'All tests passed' : 'Some tests failed',
        details: output,
        durationMs: Date.now() - start,
      };
    } catch (e: any) {
      return {
        success: false,
        message: 'Tests failed',
        details: e.stdout || e.message,
        durationMs: Date.now() - start,
      };
    }
  }

  private detectTestCommand(root: string): string | null {
    try {
      const pkg = JSON.parse(execSync('cat package.json', { cwd: root, encoding: 'utf-8' }));
      const scripts = pkg.scripts || {};
      if (scripts.test) return 'npm test';
      if (scripts['test:ci']) return 'npm run test:ci';
    } catch { /* ignore */ }

    try { execSync('ls pytest.ini pyproject.toml', { cwd: root, encoding: 'utf-8' }); return 'python -m pytest'; } catch { /* ignore */ }
    try { execSync('ls go.mod', { cwd: root, encoding: 'utf-8' }); return 'go test ./...'; } catch { /* ignore */ }
    try { execSync('ls Cargo.toml', { cwd: root, encoding: 'utf-8' }); return 'cargo test'; } catch { /* ignore */ }

    return null;
  }
}
