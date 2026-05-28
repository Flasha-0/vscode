# Flasha Code Architecture

## Overview

Flasha Code is a VS Code extension that adds AI-powered development capabilities with 15 modes, smart memory, hooks, and cloud integrations.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  VS Code Host                    │
│  ┌───────────────────────────────────────────┐  │
│  │         Flasha Code Extension              │  │
│  │  ┌─────────────────┐  ┌────────────────┐  │  │
│  │  │  Core Services   │  │  AI Providers   │  │  │
│  │  │  - ModeManager   │  │  - OpenCode CLI │  │  │
│  │  │  - MemoryService │  │  - Ollama       │  │  │
│  │  │  - RulesService  │  │  - OpenRouter   │  │  │
│  │  │  - HooksService  │  │  - Custom       │  │  │
│  │  │  - Checkpoints   │  └────────────────┘  │  │
│  │  └─────────────────┘                       │  │
│  │  ┌─────────────────┐  ┌────────────────┐  │  │
│  │  │  Integrations    │  │  Webview UI    │  │  │
│  │  │  - GitHub        │  │  - React App   │  │  │
│  │  │  - Supabase      │  │  - ChatPanel   │  │  │
│  │  │  - Vercel        │  │  - ModePicker  │  │  │
│  │  │  - Firebase      │  │  - Memories    │  │  │
│  │  │  - MCP Servers   │  └────────────────┘  │  │
│  │  └─────────────────┘                       │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │              .flasha/ Directory            │  │
│  │  ├── rules.md          (project rules)     │  │
│  │  ├── hooks.json        (automation hooks)  │  │
│  │  └── memories/         (project memories)  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Key Design Decisions

### Extension Pattern
Flasha Code is built as a VS Code extension, not a fork. This means:
- Installable from VSIX/marketplace
- Works with any VS Code version
- Easy updates without rebuilding core

### React Webview UI
The chat panel uses React with esbuild bundling:
- `src/webview/` - React components
- Built to `dist/webview/webview.js`
- Communicates via `postMessage` API

### Two-Level Storage
- **Global** (`context.globalState`) - user preferences, cross-project memories
- **Project** (`.flasha/` directory) - per-project rules, hooks, memories

## File Structure

```
extensions/flasha-code/
├── src/
│   ├── extension.ts              # Activation entry point
│   ├── chatViewProvider.ts       # Webview provider
│   ├── modeManager.ts            # 15 modes management
│   ├── autoModeDetector.ts       # Keyword-based auto-detection
│   ├── opencodeService.ts        # OpenCode CLI communication
│   ├── flashDirectoryService.ts  # .flasha/ directory manager
│   ├── memoryService.ts          # Memory (global + project)
│   ├── rulesService.ts           # Rules auto-generation
│   ├── hooksService.ts           # Automation hooks
│   ├── checkpointsService.ts     # Project snapshots
│   ├── statusBar.ts              # Mode indicator
│   ├── smartTerminal.ts          # AI-suggested commands
│   ├── githubService.ts          # GitHub clone/commit/push/PR
│   ├── vercelService.ts          # Vercel deploy
│   ├── livePreviewService.ts     # HTML/MD preview
│   ├── supabaseService.ts        # Supabase connection
│   ├── providers/                # LLM providers
│   │   ├── llmProvider.ts        # Base interface
│   │   ├── ollamaProvider.ts     # Local Ollama
│   │   ├── openrouterProvider.ts # OpenRouter API
│   │   ├── antigravityProvider.ts# Antigravity
│   │   └── customProvider.ts     # Custom API
│   ├── mcp/                      # MCP Servers
│   │   ├── mcpManager.ts         # MCP registry
│   │   ├── githubMcp.ts          # GitHub MCP
│   │   ├── supabaseMcp.ts        # Supabase MCP
│   │   ├── playwrightMcp.ts      # Browser automation
│   │   └── figmaMcp.ts           # Figma import
│   └── webview/                  # React components
│       ├── index.tsx             # Entry point
│       ├── App.tsx               # Main app
│       ├── ChatPanel.tsx         # Chat interface
│       ├── ModeSelector.tsx      # Mode buttons
│       ├── ModelPicker.tsx       # Model dropdown
│       ├── MemoriesPanel.tsx     # Memories viewer
│       ├── DiffViewer.tsx        # Diff display
│       └── CheckpointTimeline.tsx# Checkpoint timeline
├── resources/
│   └── templates/                # Project templates
├── docs/                         # Documentation
├── dist/                         # Built output
└── package.json                  # Extension manifest
```
