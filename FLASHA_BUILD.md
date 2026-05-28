# Building Flasha Code

## Quick Start

```powershell
# 1. Clone
git clone https://github.com/Flasha-0/vscode.git
cd vscode

# 2. Install dependencies
yarn install --frozen-lockfile

# 3. Build
yarn compile

# 4. Run
yarn start
```

## Building Only the Extension (Faster)

```powershell
cd extensions/flasha-code
npm install
npx tsc -b tsconfig.json
```

Then load the extension in VS Code:
1. Open VS Code
2. Ctrl+Shift+P → "Developer: Install Extension from Location..."
3. Select `extensions/flasha-code`

## Prerequisites

- **Node.js** 22.x — https://nodejs.org
- **yarn** — `npm install -g yarn`
- **Python** 3.x (for native modules)
- **C++ Build Tools** — Visual Studio 2022 Build Tools with "Desktop development with C++"

## Project Structure

```
extensions/flasha-code/     # Main Flasha extension
  src/                      # TypeScript source
    extension.ts           # Entry point
    chatViewProvider.ts    # Chat UI
    modeManager.ts         # 15 modes
    opencodeService.ts     # OpenCode CLI integration
    autoModeDetector.ts    # Auto mode switching
    memoryService.ts       # Session memory
    rulesService.ts        # Project rules
    checkpointsService.ts  # Project snapshots
    githubService.ts       # Git/GitHub operations
    vercelService.ts       # Vercel deploy
    livePreviewService.ts  # Live preview
    supabaseService.ts     # Supabase connection
    hooksService.ts        # Automation hooks
    smartTerminal.ts       # AI terminal suggestions
    statusBar.ts           # Mode indicator

src/vs/workbench/contrib/flasha/  # Deep VS Code integration
  flasha.contribution.ts
  common/
    modes.ts
    modelCapabilities.ts
    opencodeService.ts
    chatThreadService.ts
    prompt/prompts.ts
```

## Using OpenCode CLI

For AI features, install OpenCode:

```bash
npm install -g @opencode/cli
opencode serve --port 4096
```

Flasha Code will auto-connect to `localhost:4096`.
