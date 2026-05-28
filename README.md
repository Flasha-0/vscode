# Flasha Code 🔥

> بيئة تطوير مدعومة بالذكاء الاصطناعي — 15 وضعًا ذكيًا، محادثة AI مدمجة، Agents في الخلفية، وتكامل مع GitHub • Supabase • Vercel • Firebase • MCP
>
> AI-powered IDE extension with 15 smart modes, built-in chat, background agents, and cloud integrations.

![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![React](https://img.shields.io/badge/React-19-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

---

## 📸 لمحة سريعة

```
┌──────────────────────────────────────────────────┐
│  🚀 Flasha Code                                 │
│  ┌──────────────┐  ┌───────────────────────────┐ │
│  │  15 أوضاع     │  │  🤖 AI Chat               │ │
│  │  Auto/Plan/   │  │  Big Pickle (مجاني)       │ │
│  │  Build/Chat.. │  │  DeepSeek / Llama / أكثر  │ │
│  └──────────────┘  └───────────────────────────┘ │
│  ┌──────────────┐  ┌───────────────────────────┐ │
│  │  ⚡ Agents    │  │  🔌 Integrations          │ │
│  │  Code Review  │  │  GitHub · Supabase        │ │
│  │  Auto Test    │  │  Vercel · Firebase        │ │
│  │  Auto Doc     │  │  MCP · API Tester         │ │
│  └──────────────┘  └───────────────────────────┘ │
│  ┌──────────────┐  ┌───────────────────────────┐ │
│  │  🧠 الذاكرة   │  │  📦 Templates            │ │
│  │  مشروع + عام  │  │  Next.js · Express       │ │
│  │  auto-learn   │  │  FastAPI · Electron       │ │
│  └──────────────┘  └───────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

---

## ✨ المميزات كاملة

### 🤖 AI المدمج
| الميزة | الوصف |
|--------|-------|
| **شات AI** | محادثة ذكية داخل VS Code (React UI) |
| **15 وضع ذكي** | Auto, Plan, Build, Chat, Review, Debug, Test, Document, Refactor, Security, Deploy, Analyze, Design, Migrate, Git |
| **Auto Detection** | كشف تلقائي للوضع المناسب حسب كلامك (عربي + إنجليزي) |
| **4 مزودي AI** | OpenCode CLI (افتراضي)، Ollama (محلي)، OpenRouter، Antigravity، Custom API |
| **Background Agents** | Code Review، Auto Test، Auto Document — تشتغل في الخلفية وتجيك إشعارات |
| **Smart Terminal** | AI يقترح أوامر terminal حسب طلبك |

### 🧠 الذاكرة والقواعد
| الميزة | الوصف |
|--------|-------|
| **ذاكرة عامة** | تحفظ تفضيلاتك عبر كل المشاريع (`globalState`) |
| **ذاكرة مشروع** | `.flasha/memories/` — ذاكرة خاصة لكل مشروع |
| **قواعد أوتوماتيكية** | `.flasha/rules.md` — يكتشف التقنية ويكتب القواعد بنفسه |
| **Hooks** | `.flasha/hooks.json` — أتمتة: onSave، onCommit، onBuild |

### 🔌 التكاملات
| التكامل | الوظائف |
|---------|---------|
| **GitHub** | Clone, Commit, Push, PR (via terminal + MCP) |
| **Supabase** | Connect Wizard, REST Query, Table Viewer |
| **Vercel** | Deploy بنقرة واحدة، Preview Deployments |
| **Firebase** | Connect Wizard, Firestore Query |
| **MCP** | GitHub MCP، Supabase MCP، Playwright (browser automation)، Figma (تصميم → كود) |

### 🛠 الأدوات
| الأداة | الوصف |
|--------|-------|
| **API Tester** | اختبر APIs مباشرة (GET/POST/PUT/DELETE) |
| **Live Preview** | معاينة HTML/MD/SVG في WebView |
| **Checkpoints** | Snapshot للمشروع — حفظ واسترجاع |
| **Analytics** | إحصائيات الاستخدام وتقدير الـ tokens |
| **Environment Manager** | إدارة ملفات `.env` والتبديل بين البيئات |
| **Template Gallery** | 5 قوالب جاهزة: Next.js+Supabase، React+Firebase، Express+Postgres، Python+FastAPI، Electron+React |

### 🌐 اللغات (7)
| اللغة | الملف |
|-------|-------|
| العربية (افتراضي) | `ar.json` |
| English | `en.json` |
| Español | `es.json` |
| Français | `fr.json` |
| 中文 | `zh.json` |
| हिन्दी | `hi.json` |
| Português | `pt.json` |

### 🎨 واجهة React (10 تبويبات)
```
💬 Chat  |  🧠 Memories  |  📊 Diff  |  📌 Savepoints
📜 Rules |  🔌 API       |  👁 Preview |  🚀 Deploy
📈 Stats |  📦 Templates
```

---

## 🚀 التثبيت كمجاملة VS Code

```bash
# من VS Code Quick Open (Ctrl+P):
ext install flasha-code

# أو من الـ VSIX بعد الـ release:
extensions/flasha-code/
  npm install
  npm run compile
  npx vsce package
  code --install-extension flasha-code-*.vsix
```

## 🛠 التطوير

```bash
# المتطلبات
Node.js 22.x
npm 10+

# Clone
git clone https://github.com/Flasha-0/vscode.git -b flasha-extension
cd vscode/extensions/flasha-code/

# Install + Build
npm install
npm run compile    # → dist/extension.js + dist/webview/webview.js

# TypeScript check (0 errors)
npx tsc --noEmit
```

## ⚙️ الإعدادات

| الإعداد | الافتراضي | الوصف |
|---------|-----------|-------|
| `flasha.defaultModel` | `opencode/big-pickle` | الموديل الافتراضي |
| `flasha.defaultMode` | `auto` | الوضع الافتراضي |
| `flasha.language` | `ar` | لغة الواجهة |
| `flasha.opencodePort` | `4096` | منفذ OpenCode server |

## 📂 هيكل المشروع

```
extensions/flasha-code/
├── src/
│   ├── extension.ts              # مدخل الإضافة
│   ├── chatViewProvider.ts       # WebView provider
│   ├── modeManager.ts            # مدير الـ 15 وضع
│   ├── autoModeDetector.ts       # كاشف الوضع التلقائي
│   ├── opencodeService.ts        # التواصل مع OpenCode CLI
│   ├── flashDirectoryService.ts  # مدير مجلد .flasha/
│   ├── memoryService.ts          # ذاكرة عامة + مشروع
│   ├── rulesService.ts           # قواعد أوتوماتيكية
│   ├── hooksService.ts           # Hooks
│   ├── checkpointsService.ts     # Snapshots
│   ├── statusBar.ts              # مؤشر الحالة
│   ├── smartTerminal.ts          # Terminal ذكي
│   ├── apiTester.ts              # API Tester
│   ├── analyticsService.ts       # Analytics
│   ├── environmentManager.ts     # إدارة البيئات
│   ├── firebaseService.ts        # Firebase
│   ├── githubService.ts          # GitHub
│   ├── livePreviewService.ts     # Live Preview
│   ├── supabaseService.ts        # Supabase
│   ├── vercelService.ts          # Vercel
│   ├── templateManager.ts        # قوالب المشاريع
│   ├── agents/                   # Background Agents
│   │   ├── agentService.ts
│   │   ├── codeReviewAgent.ts
│   │   ├── testAgent.ts
│   │   └── docAgent.ts
│   ├── providers/                # LLM Providers
│   │   ├── llmProvider.ts
│   │   ├── ollamaProvider.ts
│   │   ├── openrouterProvider.ts
│   │   ├── antigravityProvider.ts
│   │   └── customProvider.ts
│   ├── mcp/                      # MCP Servers
│   │   ├── mcpManager.ts
│   │   ├── githubMcp.ts
│   │   ├── supabaseMcp.ts
│   │   ├── playwrightMcp.ts
│   │   └── figmaMcp.ts
│   └── webview/                  # React UI (13 components)
│       ├── App.tsx               # الرئيسي (10 تبويبات)
│       ├── ChatPanel.tsx         # الشات
│       ├── ModeSelector.tsx      # أزرار الأوضاع
│       ├── ModelPicker.tsx       # اختيار الموديل
│       ├── MemoriesPanel.tsx     # الذكريات
│       ├── DiffViewer.tsx        # الفروقات
│       ├── CheckpointTimeline.tsx# نقاط التفتيش
│       ├── RulesEditor.tsx       # محرر القواعد
│       ├── APITester.tsx         # اختبار API
│       ├── LivePreview.tsx       # معاينة حية
│       ├── DeployPanel.tsx       # النشر
│       ├── AnalyticsPanel.tsx    # الإحصائيات
│       └── TemplateGallery.tsx   # معرض القوالب
├── dist/                         # الإخراج النهائي
├── docs/                         # الوثائق
├── package.json                  # manifest
├── esbuild.mts                   # build script
├── ar.json ... pt.json           # 7 ترجمات
└── tsconfig.json
```

---

## 📜 الترخيص

MIT License — استخدم، عدّل، وزّع بدون قيود.

## 🤝 المساهمة

نرحب بالمساهمات! شوف [CONTRIBUTING.md](docs/CONTRIBUTING.md).

---

*Made with ❤️ for the Arabic dev community — and the world.*
