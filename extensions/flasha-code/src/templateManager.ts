import * as vscode from 'vscode';
import * as path from 'path';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  language: string;
  techStack: string[];
  files: Record<string, string>;
}

const TEMPLATES: Record<string, ProjectTemplate> = {
  'nextjs-supabase': {
    id: 'nextjs-supabase',
    name: 'Next.js + Supabase',
    description: 'Full-stack app with Next.js, Supabase auth, and PostgreSQL',
    language: 'TypeScript',
    techStack: ['Next.js', 'Supabase', 'PostgreSQL', 'Tailwind CSS'],
    files: {
      'package.json': JSON.stringify({
        name: 'my-app', version: '0.1.0', private: true,
        scripts: { dev: 'next dev', build: 'next build', start: 'next start' },
        dependencies: { next: '^14', react: '^18', 'react-dom': '^18', '@supabase/supabase-js': '^2' },
        devDependencies: { typescript: '^5', '@types/node': '^20', '@types/react': '^18', tailwindcss: '^3' },
      }, null, 2),
      'tsconfig.json': JSON.stringify({
        compilerOptions: { target: 'es5', lib: ['dom', 'dom.iterable', 'esnext'], allowJs: true, strict: true, 'jsx': 'preserve', module: 'esnext', moduleResolution: 'bundler' },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'], exclude: ['node_modules'],
      }, null, 2),
      'pages/index.tsx': `export default function Home() { return <div className="p-8"><h1 className="text-2xl font-bold">Flasha + Next.js + Supabase</h1></div> }`,
      '.env.local': `NEXT_PUBLIC_SUPABASE_URL=\nNEXT_PUBLIC_SUPABASE_ANON_KEY=\n`,
    },
  },
  'react-firebase': {
    id: 'react-firebase',
    name: 'React + Firebase',
    description: 'React SPA with Firebase auth, Firestore, and hosting',
    language: 'TypeScript',
    techStack: ['React', 'Firebase', 'Vite', 'CSS'],
    files: {
      'package.json': JSON.stringify({
        name: 'my-app', version: '0.1.0', private: true,
        scripts: { dev: 'vite', build: 'tsc && vite build', preview: 'vite preview' },
        dependencies: { react: '^18', 'react-dom': '^18', firebase: '^10' },
        devDependencies: { typescript: '^5', vite: '^5', '@vitejs/plugin-react': '^4' },
      }, null, 2),
      'vite.config.ts': `import { defineConfig } from 'vite'; import react from '@vitejs/plugin-react'; export default defineConfig({ plugins: [react()] });`,
      'src/App.tsx': `export default function App() { return <h1>Flasha + React + Firebase</h1> }`,
      'src/main.tsx': `import React from 'react'; import ReactDOM from 'react-dom/client'; import App from './App'; ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);`,
      'index.html': '<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
      '.env': `VITE_FIREBASE_API_KEY=\nVITE_FIREBASE_PROJECT_ID=\n`,
    },
  },
  'express-postgres': {
    id: 'express-postgres',
    name: 'Express + PostgreSQL',
    description: 'REST API backend with Express, Prisma ORM, and PostgreSQL',
    language: 'TypeScript',
    techStack: ['Express', 'PostgreSQL', 'Prisma', 'Node.js'],
    files: {
      'package.json': JSON.stringify({
        name: 'my-api', version: '0.1.0', private: true,
        scripts: { dev: 'ts-node src/index.ts', build: 'tsc', start: 'node dist/index.js' },
        dependencies: { express: '^4', '@prisma/client': '^5', cors: '^2' },
        devDependencies: { typescript: '^5', 'ts-node': '^10', '@types/express': '^4', '@types/node': '^20', prisma: '^5' },
      }, null, 2),
      'tsconfig.json': JSON.stringify({ compilerOptions: { target: 'ES2020', module: 'commonjs', strict: true, esModuleInterop: true, outDir: './dist' } }, null, 2),
      'src/index.ts': `import express from 'express'; const app = express(); app.use(express.json()); app.get('/', (_, res) => res.json({ message: 'Flasha API' })); app.listen(3000, () => console.log('Server on :3000'));`,
      'prisma/schema.prisma': `datasource db { provider = "postgresql" url = env("DATABASE_URL") } generator client { provider = "prisma-client-js" }`,
      '.env': `DATABASE_URL=postgresql://user:pass@localhost:5432/mydb\n`,
    },
  },
  'python-fastapi': {
    id: 'python-fastapi',
    name: 'Python FastAPI',
    description: 'Async Python API with FastAPI, SQLAlchemy, and Pydantic',
    language: 'Python',
    techStack: ['Python', 'FastAPI', 'SQLAlchemy', 'Pydantic'],
    files: {
      'requirements.txt': 'fastapi\nuvicorn\nsqlalchemy\npsycopg2-binary\npydantic\nalembic\n',
      'main.py': `from fastapi import FastAPI\napp = FastAPI(title="Flasha API")\n\n@app.get("/")\ndef root():\n    return {"message": "Flasha + FastAPI"}\n`,
      'models.py': `from sqlalchemy import create_engine, Column, Integer, String\nfrom sqlalchemy.ext.declarative import declarative_base\n\nBase = declarative_base()\nclass Item(Base):\n    __tablename__ = "items"\n    id = Column(Integer, primary_key=True)\n    name = Column(String)\n`,
      '.env': `DATABASE_URL=postgresql://user:pass@localhost:5432/mydb\n`,
    },
  },
  'electron-react': {
    id: 'electron-react',
    name: 'Electron + React',
    description: 'Desktop app with Electron, React, and TypeScript',
    language: 'TypeScript',
    techStack: ['Electron', 'React', 'Vite', 'TypeScript'],
    files: {
      'package.json': JSON.stringify({
        name: 'my-desktop-app', version: '0.1.0', private: true,
        scripts: { dev: 'vite', build: 'tsc && vite build', electron: 'electron .', 'electron:dev': 'concurrently \"vite\" \"wait-on http://localhost:5173 && electron .\"' },
        dependencies: { react: '^18', 'react-dom': '^18' },
        devDependencies: { electron: '^28', typescript: '^5', vite: '^5', '@vitejs/plugin-react': '^4', concurrently: '^8', 'wait-on': '^7' },
      }, null, 2),
      'main.js': `const { app, BrowserWindow } = require('electron'); app.whenReady().then(() => { const win = new BrowserWindow({ width: 1024, height: 768 }); win.loadURL('http://localhost:5173'); });`,
      'src/App.tsx': `export default function App() { return <h1>Flasha + Electron + React</h1> }`,
      'src/main.tsx': `import React from 'react'; import ReactDOM from 'react-dom/client'; import App from './App'; ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);`,
      'index.html': '<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    },
  },
};

export class TemplateManager {
  async listTemplates(): Promise<ProjectTemplate[]> {
    return Object.values(TEMPLATES);
  }

  async scaffold(templateId: string, targetDir: vscode.Uri): Promise<void> {
    const template = TEMPLATES[templateId];
    if (!template) throw new Error(`Template not found: ${templateId}`);

    for (const [filePath, content] of Object.entries(template.files)) {
      const fullPath = vscode.Uri.joinPath(targetDir, filePath);
      const parent = vscode.Uri.joinPath(fullPath, '..');
      await vscode.workspace.fs.createDirectory(parent);
      await vscode.workspace.fs.writeFile(fullPath, new TextEncoder().encode(content));
    }
  }
}
