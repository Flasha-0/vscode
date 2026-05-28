# Flasha Code Build Guide

## Quick Build

```bash
cd extensions/flasha-code
npm install
npm run compile
```

Build output:
- `dist/extension.js` - VS Code extension bundle
- `dist/webview/webview.js` - React webview bundle

## Commands

| Command | Description |
|---------|-------------|
| `npm run compile` | Build extension + webview (esbuild) |
| `npm run watch` | Watch mode (tsc) |

## TypeScript

```bash
npm install
npx tsc --noEmit    # type check (0 errors expected)
```

## Package for VS Code Marketplace

```bash
npm install -g @vscode/vsce
npx vsce package
code --install-extension flasha-code-*.vsix
```

## CI/CD

The `.github/workflows/` directory contains:
- `build.yml` - type-check on every push
- `release.yml` - auto-release on `v*` tag (creates GitHub Release)

## Requirements

- Node.js 22+
- npm 10+
- VS Code 1.98+
