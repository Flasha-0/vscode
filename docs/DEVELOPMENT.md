# Development Guide

## Prerequisites

- Node.js 22+
- npm 10+
- VS Code 1.98+

## Quick Start

```bash
# Install extension dependencies
cd extensions/flasha-code
npm install

# Build
npm run compile
```

## Build Commands

| Command | Description |
|---------|-------------|
| `npm run compile` | Build extension + webview bundle |
| `npm run watch` | Watch mode for development |

## Project Configuration

### Extension Settings (`package.json`)

| Setting | Default | Description |
|---------|---------|-------------|
| `flasha.defaultModel` | `opencode/big-pickle` | Default AI model |
| `flasha.defaultMode` | `auto` | Default mode |
| `flasha.language` | `ar` | UI language |
| `flasha.opencodePort` | `4096` | OpenCode server port |

## Adding an LLM Provider

1. Create `src/providers/myProvider.ts` implementing `LLMProvider` interface
2. Register in `ProviderRegistry`
3. Add to model list in webview

## Testing

```bash
# Type check
npx tsc --noEmit

# Build check
npm run compile
```

## Debugging

Set `"flasha.opencodePort"` and check Developer Tools console (`Help > Toggle Developer Tools`) for webview messages.
