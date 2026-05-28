# Contributing to Flasha Code

## Development Setup

```bash
# Clone the repository
git clone https://github.com/Flasha-0/vscode.git
cd vscode

# Install dependencies for the extension
cd extensions/flasha-code
npm install

# Build
npm run compile
```

## Project Structure

- `extensions/flasha-code/` - The Flasha Code extension
- `src/webview/` - React UI components
- `src/providers/` - LLM provider implementations
- `src/mcp/` - MCP server integrations
- `docs/` - Documentation

## Building

```bash
# Build extension + webview
cd extensions/flasha-code
npm run compile
```

## Code Style

- TypeScript strict mode
- No semicolons where possible
- Arabic-first comments for user-facing strings
- Async/await over promises
- Named exports for services

## Pull Request Process

1. Ensure TypeScript compiles: `npm run compile`
2. Update docs if adding new features
3. Add translation entries for new strings
4. PRs are merged after review

## Adding a New Mode

1. Add mode to `ModeSelector` in `src/webview/App.tsx`
2. Add auto-detection keywords in `autoModeDetector.ts`
3. Add system prompt in `prompts.ts`

## Adding a Translation

Add a `{lang}.json` file in `extensions/flasha-code/` following the format of `en.json`.
