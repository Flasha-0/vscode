import * as vscode from 'vscode';

export class RulesService {
  private fileWatcher: vscode.FileSystemWatcher | undefined;

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
    const rulesPath = vscode.Uri.joinPath(projectRoot, '.flasharules');
    const lines = [
      '# Flasha Code - Project Rules (Auto-generated)',
      `# Detected: ${techs.join(', ')}`,
      '',
      '- Use consistent code style with existing patterns',
      '- Keep functions small and focused',
      '- Write self-documenting code',
      ...techs.map(t => `- Respect ${t} best practices`),
    ];
    const encoder = new TextEncoder();
    await vscode.workspace.fs.writeFile(rulesPath, encoder.encode(lines.join('\n')));
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
