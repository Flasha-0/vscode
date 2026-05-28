# Flasha Code Modes

Flasha Code has 15 AI modes, each optimized for a specific task.

## Mode List

| # | Mode ID | Label (ar) | Auto-Detection Keywords | Best Model |
|---|---------|-----------|------------------------|------------|
| 1 | `auto` | تلقائي | (default) | big-pickle |
| 2 | `plan` | تخطيط | plan, roadmap, architecture, design, خطة, تصميم | big-pickle |
| 3 | `build` | بناء | create, implement, build, write code, أنشئ, اكتب كود | big-pickle |
| 4 | `chat` | محادثة | explain, what is, how to, what does, شرح, كيف, ما هو | big-pickle |
| 5 | `review` | مراجعة | review, check, audit, inspect, راجع, افحص | big-pickle |
| 6 | `debug` | تصحيح | debug, error, bug, fix, broken, خطأ, عطل, صحح | big-pickle |
| 7 | `test` | اختبار | test, unittest, jest, pytest, اختبر | deepseek-free |
| 8 | `document` | توثيق | document, docs, readme, شرح, وثق | big-pickle |
| 9 | `refactor` | إعادة هيكلة | refactor, optimize, clean, improve, حسّن, نظف | big-pickle |
| 10 | `security` | أمان | security, vulnerability, hack, protect, أمان, ثغرة | deepseek-free |
| 11 | `deploy` | نشر | deploy, release, publish, ci/cd, انشر | big-pickle |
| 12 | `analyze` | تحليل | analyze, stats, performance, metrics, حلّل, إحصائيات | big-pickle |
| 13 | `design` | تصميم | ui, ux, design, layout, css, style, واجهة, تصميم | big-pickle |
| 14 | `migrate` | ترحيل | migrate, upgrade, convert, port, رحّل, حوّل | big-pickle |
| 15 | `git` | Git | git, commit, push, merge, branch, rebase | big-pickle |

## How Auto Mode Works

When `auto` is selected, Flasha Code detects the user's intent by scanning the input message for keywords (in both Arabic and English). When a match is found, the mode switches automatically.

## Mode-to-Model Recommendations

- **Simple chat/explain**: big-pickle (free, fast)
- **Code generation**: big-pickle
- **Testing/debugging**: deepseek-free (specialized)
- **Security audit**: deepseek-free (security-focused)
- **Local/offline**: ollama/llama3.1 or ollama/deepseek-coder
