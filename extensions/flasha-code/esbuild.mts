import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  // Build extension (Node.js target)
  await esbuild.build({
    platform: 'node',
    target: 'node18',
    entryPoints: {
      'extension': path.join(dirname, 'src', 'extension.ts'),
    },
    outdir: path.join(dirname, 'dist'),
    bundle: true,
    external: ['vscode'],
    sourcemap: true,
    minify: false,
    format: 'cjs',
  });

  // Build webview React bundle (browser target)
  await esbuild.build({
    platform: 'browser',
    target: 'es2020',
    entryPoints: {
      'webview': path.join(dirname, 'src', 'webview', 'index.tsx'),
    },
    outdir: path.join(dirname, 'dist', 'webview'),
    bundle: true,
    sourcemap: true,
    minify: true,
    format: 'iife',
    jsx: 'automatic',
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
