# ════════════════════════════════════════════════════════════════
# 🔥 FLASHA CODE – الملف الرئيسي الشامل للتنفيذ
# ════════════════════════════════════════════════════════════════
#
# هذا الملف يحتوي على كل ما يحتاجه OpenCode لبناء
# مشروع Flasha Code بالكامل من الصفر.
#
# الميزانية: صفر (مفتوح المصدر بالكامل)
# الهدف: أفضل برنامج فايب كودينج مجاني في العالم
#
# ════════════════════════════════════════════════════════════════

---

## 📋 جدول المحتويات

1. [ملخص المشروع](#1-ملخص-المشروع)
2. [القرارات التقنية النهائية](#2-القرارات-التقنية-النهائية)
3. [هيكل المشروع الكامل](#3-هيكل-المشروع-الكامل)
4. [المخطط الهندسي](#4-المخطط-الهندسي-architecture)
5. [الأوضاع الـ 15](#5-الأوضاع-الـ-15-modes)
6. [نظام الذاكرة](#6-نظام-الذاكرة-memories)
7. [نظام القواعد](#7-نظام-القواعد-rules)
8. [نظام الـ Hooks](#8-نظام-الـ-hooks)
9. [نظام الموديلات](#9-نظام-الموديلات-models)
10. [التكاملات](#10-التكاملات-integrations)
11. [الواجهة](#11-الواجهة-ui)
12. [خطة التنفيذ المرحلية](#12-خطة-التنفيذ-المرحلية)
13. [التعليمات التقنية التفصيلية](#13-التعليمات-التقنية-التفصيلية)

---

## 1. ملخص المشروع

**Flasha Code** = محرر كود / IDE مبني كـ Fork من OpenCode VS Code IDE
- مجاني 100% ومفتوح المصدر (MIT License)
- خفيف: 400-600MB حجم، 400-800MB RAM
- مبني للفايب كودينج: من الفكرة للنشر
- يدعم 75+ موديل AI (محلي + سحابي + مجاني)
- يدعم 7+ لغات واجهة (عربي أولاً)
- الموديل الافتراضي: **OpenCode Zen**

### الجهاز المستهدف:
- Windows 11
- Intel Core i7-7700HQ @ 2.80GHz
- 16GB RAM
- 40GB مساحة حرة

---

## 2. القرارات التقنية النهائية

### 2.1 الـ Base (الأساس)
```
Fork من: cpkt9762/opencode-vscode-ide (VS Code + OpenCode مدمج)
السبب: جاهز فيه OpenCode كـ Core Agent + واجهة VS Code مستقرة
الترخيص: MIT
```

### 2.2 Tech Stack
```
Runtime:        Electron (من VS Code الأصلي)
Language:       TypeScript (strict mode)
UI Framework:   React (للـ sidebar و panels)
Build:          Node.js 22.x + npm/yarn
AI Backend:     OpenCode Core (Go binary - مدمج)
Protocol:       JSON-RPC عبر loopback HTTP proxy
CLI:            Rust (من VS Code الأصلي)
```

### 2.3 الموديل الافتراضي
```json
{
  "defaultModel": "opencode-zen",
  "defaultFallback": "big-pickle",
  "freeModels": ["opencode-zen", "big-pickle", "deepseek-v4-flash-free"],
  "paidModels": ["claude-opus-4.7", "claude-sonnet-4.6", "gemini-3.1-pro", "gemini-3.5-flash"]
}
```
**ملاحظة مهمة:** OpenCode Zen هو الموديل الافتراضي اللي يتحط تلقائياً لما المستخدم يفتح البرنامج أول مرة.

---

## 3. هيكل المشروع الكامل

```
flasha-code/
├── 📄 README.md
├── 📄 LICENSE                          ← MIT
├── 📄 product.json                     ← Flasha Code branding
├── 📄 package.json
├── 📄 Makefile
├── 📄 .nvmrc                           ← Node.js 22.x
│
├── 📁 src/
│   └── 📁 vs/
│       └── 📁 workbench/
│           └── 📁 contrib/
│               └── 📁 flasha/                    ← 🧠 كل كود Flasha هنا
│                   │
│                   ├── 📁 browser/                ← Renderer (واجهة المستخدم)
│                   │   ├── 📁 react/src/
│                   │   │   ├── 📁 components/
│                   │   │   │   ├── 📄 ChatPanel.tsx           ← شات الـ AI
│                   │   │   │   ├── 📄 ModeSelector.tsx        ← اختيار الوضع (Auto/Plan/Build/...)
│                   │   │   │   ├── 📄 ModelPicker.tsx         ← اختيار الموديل
│                   │   │   │   ├── 📄 MemoriesPanel.tsx       ← عرض/إدارة الذاكرة
│                   │   │   │   ├── 📄 RulesEditor.tsx         ← محرر القواعد
│                   │   │   │   ├── 📄 LivePreview.tsx         ← المعاينة الحية
│                   │   │   │   ├── 📄 CheckpointTimeline.tsx  ← خط زمني للـ Checkpoints
│                   │   │   │   ├── 📄 DiffViewer.tsx          ← عرض الفروقات
│                   │   │   │   ├── 📄 DeployPanel.tsx         ← نشر المشروع
│                   │   │   │   ├── 📄 SecurityReport.tsx      ← تقرير الأمان
│                   │   │   │   ├── 📄 AnalyticsPanel.tsx      ← إحصائيات الاستخدام
│                   │   │   │   ├── 📄 TemplateGallery.tsx     ← معرض القوالب
│                   │   │   │   ├── 📄 APITester.tsx           ← اختبار الـ APIs
│                   │   │   │   ├── 📄 EnvironmentManager.tsx  ← إدارة البيئات
│                   │   │   │   ├── 📄 OnboardingWizard.tsx    ← معالج الإعداد الأولي
│                   │   │   │   └── 📄 Settings.tsx            ← الإعدادات
│                   │   │   │
│                   │   │   ├── 📁 hooks/
│                   │   │   │   ├── 📄 useAIChat.ts            ← Hook للتواصل مع AI
│                   │   │   │   ├── 📄 useMode.ts              ← Hook للأوضاع
│                   │   │   │   ├── 📄 useMemories.ts          ← Hook للذاكرة
│                   │   │   │   ├── 📄 useCheckpoints.ts       ← Hook للـ Checkpoints
│                   │   │   │   └── 📄 useModel.ts             ← Hook لاختيار الموديل
│                   │   │   │
│                   │   │   └── 📁 styles/
│                   │   │       ├── 📄 themes.css              ← الثيمات
│                   │   │       └── 📄 rtl.css                 ← دعم RTL
│                   │   │
│                   │   ├── 📄 chatThreadService.ts             ← إدارة محادثات AI
│                   │   ├── 📄 modeService.ts                   ← إدارة الأوضاع (أهم ملف!)
│                   │   ├── 📄 memoriesService.ts               ← خدمة الذاكرة
│                   │   ├── 📄 rulesService.ts                  ← خدمة القواعد
│                   │   ├── 📄 hooksService.ts                  ← خدمة الـ Hooks
│                   │   ├── 📄 livePreviewService.ts            ← خدمة المعاينة الحية
│                   │   ├── 📄 checkpointService.ts             ← خدمة الـ Checkpoints
│                   │   ├── 📄 templateService.ts               ← خدمة القوالب
│                   │   ├── 📄 analyticsService.ts              ← خدمة الإحصائيات
│                   │   ├── 📄 editCodeService.ts               ← نظام تعديل الكود
│                   │   ├── 📄 autocompleteService.ts           ← الإكمال التلقائي
│                   │   └── 📄 toolsService.ts                  ← أدوات الـ AI
│                   │
│                   ├── 📁 common/                              ← مشترك بين Main و Browser
│                   │   ├── 📄 modes.ts                         ← تعريف كل الأوضاع
│                   │   ├── 📄 modelCapabilities.ts             ← قدرات كل موديل
│                   │   ├── 📄 settingsService.ts               ← الإعدادات المركزية
│                   │   ├── 📄 sendLLMMessageService.ts         ← إرسال رسائل للـ AI
│                   │   ├── 📄 memoriesTypes.ts                 ← أنواع الذاكرة
│                   │   ├── 📄 rulesTypes.ts                    ← أنواع القواعد
│                   │   ├── 📄 hooksTypes.ts                    ← أنواع الـ Hooks
│                   │   ├── 📄 mcpService.ts                    ← Model Context Protocol
│                   │   ├── 📄 i18n.ts                          ← نظام الترجمة
│                   │   └── 📁 prompt/
│                   │       ├── 📄 prompts.ts                   ← System prompts لكل وضع
│                   │       ├── 📄 autoModeDetector.ts          ← كاشف الوضع التلقائي
│                   │       └── 📄 contextBuilder.ts            ← بناء السياق الذكي
│                   │
│                   └── 📁 electron-main/                       ← Main Process
│                       ├── 📁 llmMessage/                     ← استدعاء الموديلات
│                       │   ├── 📄 ollamaProvider.ts           ← Ollama (محلي)
│                       │   ├── 📄 openrouterProvider.ts       ← OpenRouter
│                       │   ├── 📄 antigravityProvider.ts      ← Antigravity Auth
│                       │   └── 📄 customProvider.ts           ← مزود مخصص
│                       ├── 📄 memoriesStore.ts                ← تخزين الذاكرة
│                       ├── 📄 rulesEngine.ts                  ← محرك القواعد
│                       ├── 📄 hooksEngine.ts                  ← محرك الـ Hooks
│                       ├── 📄 checkpointStore.ts              ← تخزين الـ Checkpoints
│                       └── 📄 mcpChannel.ts                   ← MCP server
│
├── 📁 resources/
│   ├── 📁 opencode-bin/                ← OpenCode binary
│   ├── 📁 icons/                       ← أيقونات Flasha Code
│   ├── 📁 templates/                   ← قوالب المشاريع الجاهزة
│   │   ├── 📁 nextjs-supabase/
│   │   ├── 📁 react-firebase/
│   │   ├── 📁 landing-page/
│   │   ├── 📁 ecommerce/
│   │   └── 📁 blog-portfolio/
│   └── 📁 i18n/                        ← ملفات الترجمة
│       ├── 📄 ar.json                  ← العربية
│       ├── 📄 en.json                  ← English
│       ├── 📄 es.json                  ← Español
│       ├── 📄 fr.json                  ← Français
│       ├── 📄 zh.json                  ← 中文
│       ├── 📄 hi.json                  ← हिन्दी
│       └── 📄 pt.json                  ← Português
│
├── 📁 extensions/                      ← Extensions مدمجة
│
├── 📁 scripts/                         ← سكريبتات البناء
│   ├── 📄 build.sh
│   ├── 📄 package.sh
│   └── 📄 release.sh
│
├── 📁 docs/                            ← التوثيق
│   ├── 📄 ARCHITECTURE.md
│   ├── 📄 CONTRIBUTING.md
│   ├── 📄 MODES.md
│   └── 📄 DEVELOPMENT.md
│
└── 📁 .flasha/                         ← مجلد إعدادات Flasha (لكل مشروع)
    ├── 📄 rules.md                     ← قواعد المشروع
    ├── 📄 hooks.json                   ← hooks المشروع
    └── 📁 memories/
        ├── 📄 project-patterns.json
        ├── 📄 decisions.json
        └── 📄 conventions.json
```

---

## 4. المخطط الهندسي (Architecture)

```
┌─────────────────────────────────────────────────────────────────┐
│                     FLASHA CODE IDE                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  RENDERER PROCESS                         │   │
│  │                                                           │   │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐  │   │
│  │  │  Monaco  │ │   Chat   │ │   Mode   │ │    Live     │  │   │
│  │  │  Editor  │ │  Panel   │ │ Selector │ │  Preview    │  │   │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬──────┘  │   │
│  │       │             │            │               │         │   │
│  │  ┌────┴─────────────┴────────────┴───────────────┴──────┐ │   │
│  │  │              FLASHA SERVICES LAYER                    │ │   │
│  │  │                                                       │ │   │
│  │  │  modeService ← memoriesService ← rulesService        │ │   │
│  │  │  chatThread  ← editCode ← autocomplete ← hooks       │ │   │
│  │  │  livePreview ← checkpoint ← template ← analytics     │ │   │
│  │  └───────────────────────┬───────────────────────────────┘ │   │
│  └──────────────────────────┼────────────────────────────────┘   │
│                              │ IPC (JSON-RPC)                     │
│  ┌──────────────────────────┼────────────────────────────────┐   │
│  │                  MAIN PROCESS                              │   │
│  │                          │                                 │   │
│  │  ┌──────────────────────┴──────────────────────────────┐  │   │
│  │  │              OPENCODE CORE (Go Binary)               │  │   │
│  │  │                                                      │  │   │
│  │  │  ┌────────────┐  ┌──────────┐  ┌─────────────────┐  │  │   │
│  │  │  │   Agent    │  │  Tools   │  │  Context Engine  │  │  │   │
│  │  │  │  Engine    │  │  System  │  │  (Smart Index)   │  │  │   │
│  │  │  └─────┬──────┘  └────┬─────┘  └────────┬────────┘  │  │   │
│  │  │        │              │                   │           │  │   │
│  │  │  ┌─────┴──────────────┴───────────────────┴────────┐ │  │   │
│  │  │  │              MODEL ROUTER                        │ │  │   │
│  │  │  │                                                  │ │  │   │
│  │  │  │  ┌──────────┐ ┌───────────┐ ┌───────────────┐   │ │  │   │
│  │  │  │  │  Ollama  │ │OpenRouter │ │ Antigravity   │   │ │  │   │
│  │  │  │  │ (Local)  │ │  (Free)   │ │   (Free)      │   │ │  │   │
│  │  │  │  └──────────┘ └───────────┘ └───────────────┘   │ │  │   │
│  │  │  │  ┌──────────┐ ┌───────────┐ ┌───────────────┐   │ │  │   │
│  │  │  │  │  Claude  │ │  Gemini   │ │   Custom      │   │ │  │   │
│  │  │  │  │  (BYOK)  │ │  (BYOK)   │ │   (BYOK)      │   │ │  │   │
│  │  │  │  └──────────┘ └───────────┘ └───────────────┘   │ │  │   │
│  │  │  └──────────────────────────────────────────────────┘ │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │              LOCAL STORES                            │   │   │
│  │  │  memories/ ← rules/ ← hooks/ ← checkpoints/        │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │              MCP SERVERS                             │   │   │
│  │  │  GitHub ← Supabase ← Vercel ← Figma ← Custom       │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

الاتصالات الخارجية:
  ├── GitHub API (OAuth + Git operations)
  ├── Supabase (PostgreSQL + Auth + Storage)
  ├── Firebase (Firestore - بديل)
  ├── Vercel (Deploy API)
  ├── Ollama (localhost:11434)
  ├── OpenRouter API (free models)
  └── Antigravity Auth (free Claude/Gemini)
```

---

## 5. الأوضاع الـ 15 (Modes)

### 5.0 وضع Auto (الافتراضي) ⭐
```typescript
// src/vs/workbench/contrib/flasha/common/modes.ts

export enum FlashaMode {
  AUTO = 'auto',           // ← الافتراضي - يختار الوضع تلقائياً
  PLAN = 'plan',
  BUILD = 'build',
  CHAT = 'chat',
  REVIEW = 'review',
  DEBUG = 'debug',
  TEST = 'test',
  DOCUMENT = 'document',
  REFACTOR = 'refactor',
  SECURITY = 'security',
  DEPLOY = 'deploy',
  ANALYZE = 'analyze',
  DESIGN = 'design',
  MIGRATE = 'migrate',
  GIT = 'git',
}

// كاشف الوضع التلقائي - "زي بن تن"
export const AUTO_MODE_DETECTOR: Record<string, FlashaMode> = {
  // كلمات مفتاحية → الوضع المناسب

  // Plan
  'خطط|plan|صمم لي|design for me|أحتاج فكرة': FlashaMode.PLAN,

  // Build
  'ابني|اعمل|أنشئ|build|create|make|عايز موقع|عايز صفحة': FlashaMode.BUILD,

  // Chat
  'إيه الفرق|اشرح|explain|what is|ليه بنستخدم|إيه رأيك': FlashaMode.CHAT,

  // Review
  'راجع|review|check|فيه مشكلة|شوف الكود': FlashaMode.REVIEW,

  // Debug
  'error|خطأ|مش شغال|باج|bug|fix|صلح|crashed|بيقع': FlashaMode.DEBUG,

  // Test
  'test|اختبر|اكتب تيست|unit test|اختبار': FlashaMode.TEST,

  // Document
  'وثق|document|اكتب docs|شرح الكود|add comments': FlashaMode.DOCUMENT,

  // Refactor
  'حسن|refactor|نظف|clean|optimize|أسرع|خفف': FlashaMode.REFACTOR,

  // Security
  'أمان|security|ثغرة|vulnerability|hack|حماية': FlashaMode.SECURITY,

  // Deploy
  'انشر|deploy|ارفع|publish|vercel|hosting': FlashaMode.DEPLOY,

  // Analyze
  'حلل|analyze|أداء|performance|بطيء|slow': FlashaMode.ANALYZE,

  // Design
  'صمم|design|UI|واجهة|شكل|ستايل|لون': FlashaMode.DESIGN,

  // Migrate
  'حول|migrate|convert|غير من|انقل|upgrade': FlashaMode.MIGRATE,

  // Git
  'commit|push|pull|branch|merge|فرع|ادفع': FlashaMode.GIT,
}
```

### عرض الوضع في الواجهة:
```
┌─────────────────────────────────────────┐
│  ⚡ Auto (Build)     🔄 Big Pickle     │  ← الوضع الحالي + الموديل
│                                         │
│  💬 عايز موقع Landing Page لكورس       │  ← رسالة المستخدم
│     رياضيات بستايل عصري                │
│                                         │
│  🤖 تم التعرف: وضع البناء (Build)      │  ← AI اختار الوضع
│     جاري إنشاء الملفات...              │
│                                         │
│  📁 تم إنشاء:                          │
│     ├── pages/index.tsx                 │
│     ├── components/Hero.tsx             │
│     ├── components/Features.tsx         │
│     └── styles/globals.css              │
│                                         │
│  [✅ قبول] [❌ رفض] [✏️ تعديل]          │
└─────────────────────────────────────────┘
```

### التنقل السلس بين الأوضاع (زي بن تن):
```
المستخدم: "ابنيلي صفحة Login"
→ Auto يختار: Build ← يبني الصفحة

المستخدم: "فيه Error في الكونسول"
→ Auto ينتقل لـ: Debug ← يحلل ويصلح (بدون ما المستخدم يغير حاجة)

المستخدم: "تمام، دلوقتي وثق الكود"
→ Auto ينتقل لـ: Document ← يضيف تعليقات و JSDoc

المستخدم: "افحص الأمان"
→ Auto ينتقل لـ: Security ← يفحص ثغرات

كل ده في نفس المحادثة! سلس زي بن تن بالظبط 🔥
```

### System Prompt لكل وضع:

```typescript
// src/vs/workbench/contrib/flasha/common/prompt/prompts.ts

export const MODE_PROMPTS: Record<FlashaMode, string> = {

  [FlashaMode.AUTO]: `
أنت Flasha Code AI Agent. أنت ذكي بما يكفي لتحديد نوع المهمة تلقائياً.
حلل رسالة المستخدم واختر الوضع المناسب من: plan, build, chat, review, debug, test, document, refactor, security, deploy, analyze, design, migrate, git.
أعلن الوضع المختار في بداية ردك هكذا: [MODE: build]
ثم نفّذ المهمة بالكامل وفقاً لقواعد ذلك الوضع.
انتقل بين الأوضاع بسلاسة حسب الحاجة في نفس المحادثة.
`,

  [FlashaMode.PLAN]: `
أنت مخطط مشاريع. لا تكتب كود. بدلاً من ذلك:
1. حلل المتطلبات
2. اكتب requirements.md بالمتطلبات التفصيلية
3. اكتب design.md بالتصميم المعماري
4. اكتب tasks.md بالمهام المقسمة ومرتبة
5. اسأل المستخدم للموافقة قبل التنفيذ
`,

  [FlashaMode.BUILD]: `
أنت مبرمج خبير. نفّذ المطلوب بالكامل:
1. أنشئ/عدّل الملفات المطلوبة
2. اكتب كود نظيف وموثق
3. شغّل الأوامر اللازمة في Terminal
4. تأكد من أن كل شيء يعمل
5. اعرض التغييرات في Diff
التزم بقواعد المشروع (.flasha/rules.md) إن وجدت.
`,

  [FlashaMode.CHAT]: `
أنت مساعد برمجي ودود. أجب على الأسئلة بوضوح وبساطة.
لا تعدل أي ملفات. فقط اشرح وساعد في الفهم.
استخدم أمثلة كود توضيحية عند الحاجة.
`,

  [FlashaMode.REVIEW]: `
أنت مراجع كود محترف. راجع الكود وأبلغ عن:
1. 🐛 أخطاء منطقية (Bugs)
2. ⚡ مشاكل أداء (Performance)
3. 🔒 ثغرات أمنية (Security)
4. 📐 مشاكل تصميم (Design)
5. 📝 نقص توثيق (Documentation)
6. ♻️ فرص تحسين (Improvements)
صنّف كل مشكلة: 🔴 Critical | 🟡 Warning | 🔵 Info
لا تعدل الكود مباشرة - اقترح التعديلات فقط.
`,

  [FlashaMode.DEBUG]: `
أنت خبير تصحيح أخطاء. عند وجود خطأ:
1. اقرأ رسالة الخطأ بعناية
2. حدد الملف والسطر المسبب
3. حلل السبب الجذري
4. اقترح الحل
5. نفّذ الإصلاح (بعد موافقة المستخدم)
6. تأكد من عدم تكرار الخطأ
`,

  [FlashaMode.TEST]: `
أنت كاتب اختبارات محترف. اكتب اختبارات شاملة:
1. Unit Tests للوظائف المنفردة
2. Integration Tests للتكاملات
3. Edge Cases لحالات الحدود
4. استخدم أدوات الاختبار الموجودة في المشروع
5. حقق تغطية 80%+ على الأقل
`,

  [FlashaMode.DOCUMENT]: `
أنت كاتب توثيق محترف. وثّق الكود:
1. أضف JSDoc/TSDoc لكل function وclass
2. اكتب README.md شامل
3. وثّق الـ API endpoints
4. أضف أمثلة استخدام
5. اكتب CHANGELOG إذا لزم
`,

  [FlashaMode.REFACTOR]: `
أنت خبير إعادة هيكلة. حسّن الكود بدون تغيير وظيفته:
1. طبّق مبادئ SOLID
2. أزل التكرار (DRY)
3. حسّن الأداء
4. بسّط التعقيد
5. تأكد من أن كل الاختبارات لا تزال تنجح
`,

  [FlashaMode.SECURITY]: `
أنت خبير أمن معلومات. افحص الكود أمنياً:
1. SQL Injection
2. XSS (Cross-Site Scripting)
3. CSRF (Cross-Site Request Forgery)
4. مفاتيح API مكشوفة
5. ثغرات المصادقة والتفويض
6. OWASP Top 10
صنّف كل ثغرة: 🔴 Critical | 🟠 High | 🟡 Medium | 🔵 Low
اقترح الإصلاح لكل ثغرة.
`,

  [FlashaMode.DEPLOY]: `
أنت خبير نشر. ساعد في نشر المشروع:
1. اكتشف نوع المشروع (Next.js/React/Static/...)
2. تأكد من جاهزية المشروع للنشر
3. ساعد في ربط Vercel/أي منصة
4. اعرض رابط المشروع بعد النشر
5. تأكد من إعدادات البيئة (env variables)
`,

  [FlashaMode.ANALYZE]: `
أنت محلل أداء. حلل المشروع:
1. حجم Bundle وكيفية تقليله
2. سرعة التحميل (LCP, FID, CLS)
3. استهلاك الذاكرة
4. كفاءة الاستعلامات
5. فرص التحسين مرتبة بالأولوية
`,

  [FlashaMode.DESIGN]: `
أنت مصمم واجهات محترف. صمم UI/UX:
1. أنشئ المكونات المطلوبة
2. استخدم Tailwind CSS
3. تأكد من Responsive Design
4. اتبع أحدث الاتجاهات
5. وفّر Dark/Light mode
اعرض Preview للنتيجة.
`,

  [FlashaMode.MIGRATE]: `
أنت خبير ترحيل. حوّل المشروع:
1. حلل التقنية الحالية
2. خطط للترحيل (ملف ملف)
3. نفّذ التحويل مع الحفاظ على الوظائف
4. حدّث الـ dependencies
5. شغّل الاختبارات بعد كل خطوة
`,

  [FlashaMode.GIT]: `
أنت خبير Git. ساعد في:
1. كتابة رسائل Commit واضحة (Conventional Commits)
2. إدارة الفروع (Branching strategy)
3. حل التعارضات (Merge conflicts)
4. إنشاء Pull Requests مع وصف واضح
5. مراجعة تاريخ التغييرات
`,
}
```

---

## 6. نظام الذاكرة (Memories)

### المبدأ: ذاكرة أوتوماتيكية على مستويين

```typescript
// src/vs/workbench/contrib/flasha/common/memoriesTypes.ts

export interface MemorySystem {
  // المستوى 1: ذاكرة عامة (لكل المشاريع)
  global: GlobalMemories;
  // المستوى 2: ذاكرة المشروع (لكل مشروع منفصل)
  project: ProjectMemories;
}

export interface GlobalMemories {
  // تفضيلات المستخدم العامة
  userPreferences: {
    language: string;           // 'ar' | 'en' | ...
    theme: string;              // 'dark' | 'light'
    defaultModel: string;       // 'opencode-zen'
    codingStyle: string;        // 'functional' | 'oop'
    favoriteFrameworks: string[]; // ['next.js', 'react']
    indentation: 'tabs' | 'spaces';
    indentSize: number;         // 2 | 4
  };
  // أنماط الكود المتكررة
  codingPatterns: {
    preferredPatterns: string[];   // ['named exports', 'async/await']
    avoidedPatterns: string[];     // ['var', 'callbacks', 'any']
  };
  // سجل التفاعلات
  interactionHistory: {
    totalSessions: number;
    totalTokensUsed: number;
    favoriteMode: FlashaMode;
    lastUsed: Date;
  };
}

export interface ProjectMemories {
  // معلومات المشروع (يتعلمها تلقائياً)
  projectInfo: {
    name: string;
    type: string;               // 'nextjs' | 'react' | 'node' | ...
    framework: string;
    language: string;           // 'typescript' | 'javascript'
    packageManager: string;     // 'npm' | 'yarn' | 'pnpm' | 'bun'
    database: string;           // 'supabase' | 'firebase' | 'none'
    styling: string;            // 'tailwind' | 'css-modules' | 'styled'
    testing: string;            // 'vitest' | 'jest' | 'none'
  };
  // قرارات معمارية
  decisions: Array<{
    date: string;
    decision: string;           // "نستخدم Repository Pattern"
    reason: string;             // "عشان نفصل الـ data layer"
    context: string;
  }>;
  // أنماط خاصة بالمشروع
  conventions: {
    fileNaming: string;         // 'kebab-case' | 'PascalCase'
    folderStructure: string;    // وصف البنية
    apiPattern: string;         // 'REST' | 'GraphQL'
    stateManagement: string;    // 'zustand' | 'redux' | 'context'
  };
}
```

### التعلم التلقائي:
```typescript
// src/vs/workbench/contrib/flasha/browser/memoriesService.ts

export class MemoriesService {

  // يتعلم تلقائياً عند فتح مشروع جديد
  async learnFromProject(projectPath: string): Promise<ProjectMemories> {
    const memories: ProjectMemories = {
      projectInfo: {
        name: await this.detectProjectName(projectPath),
        type: await this.detectProjectType(projectPath),      // يقرأ package.json
        framework: await this.detectFramework(projectPath),    // يقرأ dependencies
        language: await this.detectLanguage(projectPath),      // يدور على tsconfig.json
        packageManager: await this.detectPackageManager(projectPath), // يدور على lock files
        database: await this.detectDatabase(projectPath),      // يقرأ .env + deps
        styling: await this.detectStyling(projectPath),        // tailwind.config?
        testing: await this.detectTesting(projectPath),        // vitest.config?
      },
      decisions: [],
      conventions: await this.detectConventions(projectPath),
    };
    return memories;
  }

  // يتعلم من تفاعلات المستخدم بشكل مستمر
  async learnFromInteraction(message: string, response: string, mode: FlashaMode): void {
    // لو المستخدم بيفضل أسلوب معين → يحفظه
    // لو المستخدم رفض اقتراح → يتعلم عدم تكراره
    // لو المستخدم عدّل كود الـ AI → يتعلم الأسلوب المفضل
  }
}
```

### مكان التخزين:
```
# ذاكرة عامة (على مستوى البرنامج)
~/.config/flasha-code/memories/
  ├── global-preferences.json
  ├── coding-patterns.json
  └── interaction-history.json

# ذاكرة المشروع (داخل كل مشروع)
project-folder/.flasha/memories/
  ├── project-patterns.json
  ├── decisions.json
  └── conventions.json
```

---

## 7. نظام القواعد (Rules)

### المبدأ: نسختين + كتابة تلقائية + يدوية

```typescript
// src/vs/workbench/contrib/flasha/common/rulesTypes.ts

export interface RulesSystem {
  // قواعد عامة (لكل المشاريع)
  global: GlobalRules;
  // قواعد المشروع (اختياري - لكل مشروع)
  project: ProjectRules | null;
  // القواعد المدمجة (Global + Project) - الأولوية للمشروع
  merged: MergedRules;
}
```

### القواعد العامة (تتحفظ في):
```
~/.config/flasha-code/rules/global-rules.md
```

### القواعد الخاصة بالمشروع (تتحفظ في):
```
project-folder/.flasha/rules.md
```

### إنشاء القواعد تلقائياً:
```typescript
// عند فتح مشروع لأول مرة، الـ AI يحلل المشروع ويكتب القواعد

async function autoGenerateRules(projectPath: string): Promise<string> {
  // يقرأ package.json, tsconfig.json, .eslintrc, .prettierrc
  // يحلل الكود الموجود ويستنتج الأنماط
  // يكتب ملف rules.md تلقائياً

  return `
# Flasha Code Rules - ${projectName}
## تم إنشاؤه تلقائياً بواسطة Flasha Code AI

## Stack
- Framework: ${detectedFramework}
- Language: ${detectedLanguage}
- Styling: ${detectedStyling}
- Database: ${detectedDatabase}

## قواعد الكود
- ${detectedRules.join('\n- ')}

## ممنوعات
- ${detectedAntiPatterns.join('\n- ')}
  `;
}
```

### خيار الإنشاء اليدوي:
- زر "📋 إنشاء قواعد" في الـ sidebar
- يفتح محرر القواعد (RulesEditor.tsx)
- المستخدم يكتب القواعد يدوياً أو يعدل على المولدة تلقائياً

---

## 8. نظام الـ Hooks

```typescript
// src/vs/workbench/contrib/flasha/common/hooksTypes.ts

export interface Hook {
  name: string;
  description: string;
  when: HookTrigger;
  then: HookAction;
  enabled: boolean;
}

export type HookTrigger =
  | { type: 'fileSave'; patterns: string[] }      // عند حفظ ملف
  | { type: 'fileCreate'; patterns: string[] }     // عند إنشاء ملف
  | { type: 'fileDelete'; patterns: string[] }     // عند حذف ملف
  | { type: 'preCommit' }                          // قبل Commit
  | { type: 'postCommit' }                         // بعد Commit
  | { type: 'preBuild' }                           // قبل Build
  | { type: 'manual'; command: string }            // يدوي

export type HookAction =
  | { type: 'runCommand'; command: string }        // تشغيل أمر
  | { type: 'askAgent'; prompt: string }           // طلب من AI
  | { type: 'notify'; message: string }            // إشعار
```

### Hooks افتراضية:
```json
// .flasha/hooks.json
{
  "hooks": [
    {
      "name": "Auto Format on Save",
      "when": { "type": "fileSave", "patterns": ["*.ts", "*.tsx", "*.js", "*.jsx"] },
      "then": { "type": "runCommand", "command": "npx prettier --write {file}" },
      "enabled": true
    },
    {
      "name": "Auto Lint on Save",
      "when": { "type": "fileSave", "patterns": ["*.ts", "*.tsx"] },
      "then": { "type": "runCommand", "command": "npx eslint --fix {file}" },
      "enabled": true
    },
    {
      "name": "Security Check Pre-Commit",
      "when": { "type": "preCommit" },
      "then": { "type": "askAgent", "prompt": "افحص الملفات المعدّلة أمنياً وأبلغ عن أي ثغرات" },
      "enabled": true
    },
    {
      "name": "Auto Update Docs",
      "when": { "type": "fileSave", "patterns": ["src/api/**/*.ts"] },
      "then": { "type": "askAgent", "prompt": "حدّث التوثيق ليعكس التغييرات في ملف API المعدّل" },
      "enabled": false
    },
    {
      "name": "Run Tests on Change",
      "when": { "type": "fileSave", "patterns": ["src/**/*.ts"] },
      "then": { "type": "runCommand", "command": "npm test -- --related {file}" },
      "enabled": false
    }
  ]
}
```

---

## 9. نظام الموديلات (Models)

### الافتراضي: OpenCode Zen
```typescript
// src/vs/workbench/contrib/flasha/common/modelCapabilities.ts

export const MODELS_CONFIG = {
  // الموديل الافتراضي ⭐
  default: 'opencode-zen',

  // الموديلات المتاحة
  models: [
    // ── مجاني 100% ──
    {
      id: 'opencode-zen',
      name: 'OpenCode Zen',
      provider: 'opencode',
      free: true,
      isDefault: true,                    // ← الافتراضي
      description: 'الموديل الافتراضي - سريع وذكي',
    },
    {
      id: 'big-pickle',
      name: 'Big Pickle',
      provider: 'opencode',
      free: true,
      description: 'موديل مجاني قوي',
    },
    {
      id: 'deepseek-v4-flash-free',
      name: 'DeepSeek V4 Flash Free',
      provider: 'openrouter',
      free: true,
      description: 'سريع ومجاني من DeepSeek',
    },

    // ── محلي (Ollama) - مجاني 100% ──
    {
      id: 'ollama-llama3',
      name: 'Llama 3.1 8B (محلي)',
      provider: 'ollama',
      free: true,
      local: true,
      description: 'يعمل على جهازك - خصوصية كاملة',
    },
    {
      id: 'ollama-deepseek-coder',
      name: 'DeepSeek Coder (محلي)',
      provider: 'ollama',
      free: true,
      local: true,
      description: 'متخصص في الكود - محلي',
    },
    {
      id: 'ollama-qwen-coder',
      name: 'Qwen 2.5 Coder (محلي)',
      provider: 'ollama',
      free: true,
      local: true,
      description: 'ممتاز في الكود - محلي',
    },

    // ── مدفوع (BYOK - Bring Your Own Key) ──
    {
      id: 'claude-opus-4.7',
      name: 'Claude Opus 4.7',
      provider: 'anthropic',
      free: false,
      description: 'أقوى موديل للمهام المعقدة',
    },
    {
      id: 'claude-sonnet-4.6',
      name: 'Claude Sonnet 4.6',
      provider: 'anthropic',
      free: false,
      description: 'سريع وذكي - الأفضل للكود',
    },
    {
      id: 'gemini-3.1-pro',
      name: 'Gemini 3.1 Pro Preview',
      provider: 'google',
      free: false,
      description: 'قوي في التحليل والتخطيط',
    },
    {
      id: 'gemini-3.5-flash',
      name: 'Gemini 3.5 Flash',
      provider: 'google',
      free: false,
      description: 'سريع جداً - مناسب للمهام البسيطة',
    },
  ],

  // إعدادات لكل وضع (أي موديل يُستخدم في أي وضع)
  modeModelMap: {
    // الأوضاع الثقيلة → أقوى موديل متاح
    'plan': 'best-available',
    'build': 'best-available',
    'review': 'best-available',
    'security': 'best-available',

    // الأوضاع الخفيفة → أسرع موديل
    'chat': 'fastest-available',
    'document': 'fastest-available',
    'git': 'fastest-available',

    // Auto → حسب المهمة
    'auto': 'adaptive',
  },
};
```

---

## 10. التكاملات (Integrations)

### 10.1 GitHub
```typescript
// تكامل GitHub عبر MCP + OAuth

export const GITHUB_INTEGRATION = {
  auth: {
    method: 'OAuth',
    scopes: ['repo', 'user', 'read:org'],
    tokenStorage: 'OS Keychain',     // آمن
  },
  features: {
    clone: true,                      // استنساخ مشاريع
    push: true,                       // دفع التغييرات
    pull: true,                       // سحب التغييرات
    branch: true,                     // إدارة الفروع
    commit: true,                     // مع رسائل AI
    pullRequests: true,               // إنشاء/عرض PRs
    issues: true,                     // عرض/إنشاء Issues
    aiCommitMessages: true,           // AI يكتب رسالة Commit
    aiPRDescription: true,            // AI يكتب وصف PR
  },
};
```

### 10.2 Supabase
```typescript
export const SUPABASE_INTEGRATION = {
  setup: {
    method: 'Connection Wizard',      // معالج ربط سهل
    requiredKeys: ['SUPABASE_URL', 'SUPABASE_ANON_KEY'],
    storage: '.env',                   // يحفظ في .env
  },
  features: {
    tableViewer: true,                // عرض جداول بسيط
    queryRunner: true,                // تنفيذ Queries
    schemaViewer: true,               // عرض الـ Schema
    authHelper: true,                 // مساعد المصادقة
  },
};
```

### 10.3 Firebase (بديل)
```typescript
export const FIREBASE_INTEGRATION = {
  setup: {
    method: 'Connection Wizard',
    requiredKeys: ['FIREBASE_CONFIG'],
    storage: '.env',
  },
  features: {
    firestoreViewer: true,
    authHelper: true,
  },
};
```

### 10.4 Vercel
```typescript
export const VERCEL_INTEGRATION = {
  setup: {
    method: 'API Token',
    requiredKeys: ['VERCEL_TOKEN'],
    storage: 'OS Keychain',
  },
  features: {
    oneClickDeploy: true,             // زر "انشر" واحد
    autoDetectProject: true,          // يكتشف نوع المشروع
    environmentVariables: true,       // إدارة env vars
    githubAutoDefloy: true,           // ربط مع GitHub
    previewDeployments: true,         // روابط معاينة
    deploymentLogs: true,             // سجل النشر
  },
};
```

### 10.5 MCP Servers
```json
// opencode.json (أو flasha.json)
{
  "mcp": {
    "github": {
      "type": "local",
      "command": ["npx", "@anthropic/mcp-github"],
      "enabled": true
    },
    "supabase": {
      "type": "local",
      "command": ["npx", "@anthropic/mcp-supabase"],
      "enabled": false
    },
    "playwright": {
      "type": "local",
      "command": ["npx", "@playwright/mcp@latest"],
      "enabled": false
    },
    "figma": {
      "type": "local",
      "command": ["npx", "@anthropic/mcp-figma"],
      "enabled": false
    }
  }
}
```

---

## 11. الواجهة (UI)

### 11.1 الثيم والهوية
```css
/* Flasha Code Brand Colors */
:root {
  --flasha-primary: #F59E0B;        /* أصفر/ذهبي (من الشعار) */
  --flasha-secondary: #1E1E2E;      /* خلفية داكنة */
  --flasha-accent: #10B981;         /* أخضر للنجاح */
  --flasha-error: #EF4444;          /* أحمر للأخطاء */
  --flasha-bg: #0D1117;             /* خلفية رئيسية */
  --flasha-sidebar: #161B22;        /* خلفية جانبية */
  --flasha-text: #E6EDF3;           /* نص رئيسي */
  --flasha-text-secondary: #8B949E; /* نص ثانوي */
}
```

### 11.2 Layout رئيسي
```
┌─────────────────────────────────────────────────────────────────┐
│  🔥 Flasha Code    [بحث Ctrl+K]              [🌐 AR ▾]  [⚙️]  │
├────┬────────────────────────────────────────────┬───────────────┤
│    │                                            │               │
│ 📁 │              Monaco Editor                 │   💬 Chat     │
│    │                                            │   Panel       │
│ F  │         (المحرر الرئيسي)                   │               │
│ i  │                                            │  ┌─────────┐  │
│ l  │                                            │  │⚡Auto(B) │  │
│ e  │                                            │  │  ▾       │  │
│    │                                            │  │ اكتب    │  │
│ E  │                                            │  │ رسالتك  │  │
│ x  │                                            │  │ هنا...  │  │
│ p  │                                            │  │         │  │
│ l  │                                            │  │[📎][🔗] │  │
│ o  │                                            │  └─────────┘  │
│ r  │                                            │               │
│ e  ├────────────────────────────────────────────┤  Model:       │
│ r  │              Terminal                      │  🧠 OC Zen ▾  │
│    │              (ذكي بالـ AI)                  │               │
├────┴────────────────────────────────────────────┴───────────────┤
│  ⚡ Auto (Build)  │  🧠 OpenCode Zen  │  📊 Tokens: 1.2K      │
└─────────────────────────────────────────────────────────────────┘
```

### 11.3 Sidebar Icons
```
[F] Flasha Home / مشاريع حديثة
[📁] File Explorer
[🔍] Search
[🔀] Git / Source Control
[🐛] Debug
[📦] Extensions
[💬] AI Chat (الشات الرئيسي)
[🧠] Memories (الذاكرة)
[📋] Rules (القواعد)
[🚀] Deploy (النشر)
[⚙️] Settings (الإعدادات)
```

### 11.4 دعم اللغات (i18n)
```
7 لغات مدعومة:
1. 🇸🇦 العربية (ar) - افتراضي + RTL
2. 🇺🇸 English (en)
3. 🇪🇸 Español (es)
4. 🇫🇷 Français (fr)
5. 🇨🇳 中文 (zh)
6. 🇮🇳 हिन्दी (hi)
7. 🇧🇷 Português (pt)
```

### 11.5 Live Preview مدمج
```typescript
// Live Preview + Responsive Testing مدمجين
export const LIVE_PREVIEW_CONFIG = {
  position: 'split-right',           // يفتح على اليمين
  hotReload: true,                   // تحديث تلقائي
  responsivePresets: [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 14', width: 390, height: 844 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'Desktop', width: 1440, height: 900 },
    { name: 'Full', width: '100%', height: '100%' },
  ],
  showDeviceFrame: true,             // إطار الجهاز
};
```

---

## 12. خطة التنفيذ المرحلية

### المرحلة 0: التأسيس (أسبوع 1-2)
```
المهام:
□ Fork من cpkt9762/opencode-vscode-ide
□ تغيير الـ Branding (اسم + أيقونات + ألوان)
  - product.json → Flasha Code
  - الأيقونات → شعار Flasha
  - الألوان → الثيم الذهبي/الداكن
□ إعداد بيئة التطوير
  - Node.js 22.x
  - تشغيل make install-deps
  - تشغيل make compile
  - تشغيل make run (التأكد إنه شغال)
□ إنشاء هيكل المجلدات الجديد
  - src/vs/workbench/contrib/flasha/
  - resources/i18n/
  - resources/templates/
□ إعداد GitHub repo جديد
  - README.md
  - LICENSE (MIT)
  - CONTRIBUTING.md
□ التأكد من أن OpenCode Zen هو الموديل الافتراضي

الناتج: نسخة Flasha Code تفتح وتشتغل بالـ branding الجديد
```

### المرحلة 1: MVP (أسبوع 3-6)
```
المهام:
□ نظام الأوضاع (Modes)
  - إنشاء modes.ts مع كل الأوضاع الـ 15
  - إنشاء ModeSelector.tsx (واجهة اختيار الوضع)
  - إنشاء autoModeDetector.ts (الكاشف التلقائي)
  - System prompts لكل وضع
  - عرض الوضع الحالي في الـ Status Bar: "⚡ Auto (Build)"
□ نظام الذاكرة (أساسي)
  - memoriesService.ts (تعلم تلقائي أساسي)
  - تخزين global + project memories
  - تعلم من package.json + tsconfig
□ نظام القواعد (أساسي)
  - rulesService.ts
  - إنشاء قواعد تلقائي عند فتح مشروع
  - محرر قواعد يدوي بسيط
□ تحسين الشات
  - ChatPanel.tsx محسّن
  - عرض الوضع الحالي جنب اسم الموديل
  - Diff Viewer مدمج
□ Checkpoints أساسية
  - حفظ/استرجاع snapshots
  - Timeline بسيط

الناتج: Flasha Code مع 15 وضع + ذاكرة + قواعد + Checkpoints
```

### المرحلة 2: v1.0 (أسبوع 7-12)
```
المهام:
□ Terminal ذكي بالـ AI
  - أوامر بالعربي → ترجمة لأوامر حقيقية
  - اقتراحات أوامر
  - شرح Errors تلقائي
  - Auto-fix للأخطاء
□ Live Preview
  - معاينة مدمجة (WebView)
  - Hot Reload
  - أحجام شاشات مختلفة
□ GitHub تكامل كامل
  - OAuth login
  - Clone/Push/Pull/Branch/Commit
  - AI Commit Messages
  - PR creation (أساسي)
□ Supabase تكامل
  - Connection Wizard
  - Table Viewer
  - Query Runner
□ Vercel Deploy
  - زر "انشر" واحد
  - Auto-detect project type
  - Deployment logs
□ نظام الـ Hooks
  - Hook engine
  - Hooks افتراضية
  - واجهة إدارة Hooks
□ دعم اللغة العربية + 6 لغات
  - نظام i18n
  - ملفات الترجمة
  - RTL support

الناتج: Flasha Code 1.0 - جاهز للاستخدام اليومي
```

### المرحلة 3: v1.5+ (أسبوع 13-20)
```
المهام:
□ MCP Servers
  - GitHub MCP
  - Supabase MCP
  - Playwright (Browser Automation)
  - Figma (تحويل تصميم لكود)
□ Templates/Scaffolding
  - معرض قوالب
  - 5 قوالب جاهزة
  - إنشاء قوالب مخصصة
□ API Tester مدمج
  - GET/POST/PUT/DELETE
  - عرض Response
  - حفظ Requests
□ Artifacts/Previews في الشات
  - AI يعرض Preview للـ UI جوا الشات
  - تعديل بصري
□ Background Agents (بسيط)
  - Agent يشتغل في Thread منفصل
  - إشعار لما يخلص
□ Spec-Driven Development
  - requirements.md → design.md → tasks.md
□ Smart Context Engine
  - Indexing ذكي للمشروع
  - تحميل الملفات المرتبطة فقط
□ Learning Mode (وضع التعلم)
  - شرح كل سطر
  - اقتراح موارد
  - Mini tutorials
□ Analytics Dashboard
  - إحصائيات الاستخدام
  - Tokens consumed
  - AI vs Human code ratio
□ Environment Manager
  - إدارة ملفات .env
  - تبديل بين بيئات
□ Firebase Module

الناتج: Flasha Code 1.5 - أسطوري! 🔥
```

---

## 13. التعليمات التقنية التفصيلية

### 13.1 كيف تبدأ (للـ AI Agent)

```bash
# الخطوة 1: Clone الـ Base
git clone https://github.com/cpkt9762/opencode-vscode-ide.git flasha-code
cd flasha-code

# الخطوة 2: تثبيت المتطلبات
make install-deps

# الخطوة 3: تغيير الـ Branding
# عدّل product.json:
{
  "nameShort": "Flasha Code",
  "nameLong": "Flasha Code",
  "applicationName": "flasha-code",
  "dataFolderName": ".flasha-code",
  "win32MutexName": "flashacode",
  "licenseName": "MIT",
  "urlProtocol": "flasha-code"
}

# الخطوة 4: إنشاء هيكل Flasha
mkdir -p src/vs/workbench/contrib/flasha/browser/react/src/components
mkdir -p src/vs/workbench/contrib/flasha/browser/react/src/hooks
mkdir -p src/vs/workbench/contrib/flasha/browser/react/src/styles
mkdir -p src/vs/workbench/contrib/flasha/common/prompt
mkdir -p src/vs/workbench/contrib/flasha/electron-main/llmMessage
mkdir -p resources/i18n
mkdir -p resources/templates

# الخطوة 5: Build
make compile

# الخطوة 6: Run
make run
```

### 13.2 الملفات الأولى المطلوب إنشاؤها (بالترتيب)

```
1. src/vs/workbench/contrib/flasha/common/modes.ts          ← تعريف الأوضاع
2. src/vs/workbench/contrib/flasha/common/prompt/prompts.ts  ← System prompts
3. src/vs/workbench/contrib/flasha/common/prompt/autoModeDetector.ts ← كاشف الوضع
4. src/vs/workbench/contrib/flasha/browser/modeService.ts    ← خدمة الأوضاع
5. src/vs/workbench/contrib/flasha/browser/react/src/components/ModeSelector.tsx
6. src/vs/workbench/contrib/flasha/common/memoriesTypes.ts   ← أنواع الذاكرة
7. src/vs/workbench/contrib/flasha/browser/memoriesService.ts ← خدمة الذاكرة
8. src/vs/workbench/contrib/flasha/electron-main/memoriesStore.ts ← تخزين
9. src/vs/workbench/contrib/flasha/common/rulesTypes.ts      ← أنواع القواعد
10. src/vs/workbench/contrib/flasha/browser/rulesService.ts  ← خدمة القواعد
```

### 13.3 تعديل الموديل الافتراضي

```typescript
// في ملف الإعدادات الرئيسي، تأكد أن OpenCode Zen هو الافتراضي:

// src/vs/workbench/contrib/flasha/common/settingsService.ts
export const DEFAULT_SETTINGS = {
  model: {
    primary: 'opencode-zen',          // ← الموديل الافتراضي
    fallback: 'big-pickle',           // ← البديل
    autocomplete: 'opencode-zen',     // ← للإكمال التلقائي
  },
  mode: {
    default: 'auto',                  // ← الوضع الافتراضي
  },
  language: {
    default: 'ar',                    // ← العربية افتراضياً
    rtl: true,
  },
  theme: {
    default: 'flasha-dark',           // ← الثيم الداكن
  },
};
```

### 13.4 مبادئ مهمة

```
1. كل شيء مجاني - لا يوجد أي ميزة تحتاج اشتراك
2. الخصوصية - الكود لا يُرسل لأي سيرفر بدون إذن المستخدم
3. الأداء - البرنامج لازم يشتغل بسلاسة على i7 + 16GB RAM
4. البساطة - المستخدم الجديد يقدر يبدأ في أقل من دقيقة
5. العربي أولاً - الواجهة والأوامر تدعم العربي بالكامل
6. OpenCode Zen هو الافتراضي دايماً
7. وضع Auto هو الافتراضي دايماً
8. الذاكرة والقواعد أوتوماتيكية (المستخدم مش محتاج يعمل حاجة)
```

---

## ════════════════════════════════════════════════════════════════
## ⚡ ملخص تنفيذي
## ════════════════════════════════════════════════════════════════
##
## Flasha Code = Fork من OpenCode VS Code IDE
## + 15 وضع AI (مع Auto mode زي بن تن)
## + ذاكرة أوتوماتيكية (عامة + لكل مشروع)
## + قواعد أوتوماتيكية (عامة + لكل مشروع)
## + Hooks (أتمتة أحداث)
## + Live Preview مدمج
## + Terminal ذكي بالـ AI
## + GitHub + Supabase + Vercel تكامل
## + MCP Servers
## + 7 لغات (عربي أولاً)
## + Templates جاهزة
## + API Tester + Learning Mode
## + Checkpoints + Timeline
## + Analytics Dashboard
## + Environment Manager
##
## الموديل الافتراضي: OpenCode Zen
## الوضع الافتراضي: Auto
## الميزانية: صفر
## الهدف: أفضل IDE فايب كودينج مجاني في العالم 🔥
##
## ════════════════════════════════════════════════════════════════
