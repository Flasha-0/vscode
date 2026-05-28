import * as vscode from 'vscode';
import { FlashDirectoryService } from './flashDirectoryService';

export class RulesService {
  private fileWatcher: vscode.FileSystemWatcher | undefined;
  private flashDir = new FlashDirectoryService();

  constructor(private context: vscode.ExtensionContext) {}

  async detectProjectRules(): Promise<string[]> {
    const files = await vscode.workspace.findFiles(
      '**/{.flasharules,.flashaignore,.clinerules,.cursorules,**/.vscode/flasha.json}'
    );
    return files.map(f => f.fsPath);
  }

  watchRules(callback: (paths: string[]) => void): void {
    this.fileWatcher?.dispose();
    this.fileWatcher = vscode.workspace.createFileSystemWatcher('**/.flasharules');
    this.fileWatcher.onDidChange(() => this.detectProjectRules().then(callback));
    this.fileWatcher.onDidCreate(() => this.detectProjectRules().then(callback));
  }

  async autoGenerateRules(projectRoot: vscode.Uri): Promise<void> {
    const techs = await this.detectTechStack(projectRoot);
    const lines = [
      '# Flasha Code - Project Rules (Auto-generated)',
      `# Detected: ${techs.join(', ')}`,
      '',
      '- Use consistent code style with existing patterns',
      '- Keep functions small and focused',
      '- Write self-documenting code',
      ...techs.map(t => `- Respect ${t} best practices`),
    ];
    const content = lines.join('\n');

    const rulesFile = this.flashDir.getRulesFile(projectRoot);
    if (rulesFile) {
      await this.flashDir.ensureDirectory(projectRoot);
      await this.flashDir.writeTextFile(rulesFile, content);
    }

    const rootRules = vscode.Uri.joinPath(projectRoot, '.flasharules');
    await vscode.workspace.fs.writeFile(rootRules, new TextEncoder().encode(content));
  }

  async getFlashRules(projectRoot?: vscode.Uri): Promise<string | undefined> {
    const file = this.flashDir.getRulesFile(projectRoot);
    return file ? this.flashDir.readTextFile(file) : undefined;
  }

  private async detectTechStack(root: vscode.Uri): Promise<string[]> {
    const techs: string[] = [];
    const entries = await vscode.workspace.fs.readDirectory(root);
    for (const [name] of entries) {
      if (name === 'package.json') techs.push('Node.js');
      if (name === 'tsconfig.json') techs.push('TypeScript');
      if (name === 'pyproject.toml' || name === 'requirements.txt') techs.push('Python');
      if (name === 'Cargo.toml') techs.push('Rust');
      if (name === 'go.mod') techs.push('Go');
      if (name === 'Gemfile') techs.push('Ruby');
      if (name === 'CMakeLists.txt') techs.push('C++');
      if (name.endsWith('.csproj')) techs.push('C#');
    }
    return [...new Set(techs)];
  }
}
