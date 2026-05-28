import { FlashaModeManager } from './modeManager';

const MODE_KEYWORDS: Record<string, RegExp[]> = {
  plan: [/plan/i, /خطط/i, /تصميم.*حل/i, /strategy/i, /roadmap/i, /architecture/i, /مخطط/i],
  build: [/build/i, /ابني/i, /create.*(file|app|project|class|function|component)/i, /implement/i, /نفذ/i, /create/i, /generate/i],
  review: [/review/i, /راجع/i, /code.*review/i, /مراجعة/i, /inspect/i, /audit/i, /check.*code/i],
  debug: [/debug/i, /fix/i, /bug/i, /خلل/i, /error/i, /خطأ/i, /not working/i, /doesn.*t work/i, /مشكلة/i, /fix/i, /broken/i],
  test: [/test/i, /اختبار/i, /unit.*test/i, /spec/i, /t?est/i, /assert/i, /jest/i, /pytest/i, /vitest/i],
  document: [/doc/i, /document/i, /وثق/i, /توثيق/i, /readme/i, /شرح/i, /api.*doc/i, /jsdoc/i, /comment/i],
  refactor: [/refactor/i, /حسن/i, /optimize/i, /clean/i, /نظف/i, /improve/i, /simplify/i, /إعادة.*هيكلة/i],
  security: [/security/i, /secure/i, /أمن/i, /vulnerability/i, /ثغرة/i, /hack/i, /اختراق/i, /permission/i, /auth/i],
  deploy: [/deploy/i, /انشر/i, /release/i, /publish/i, /إصدار/i, /نشر/i, /CI/i, /CD/i, /وركل/i, /vercel/i],
  analyze: [/analyze/i, /حلل/i, /analysis/i, /تحليل/i, /metric/i, /مقاييس/i, /performance/i, /أداء/i, /profile/i],
  design: [/design/i, /ui/i, /ux/i, /interface/i, /تصميم/i, /واجهة/i, /color/i, /لون/i, /layout/i, /style/i, /css/i],
  migrate: [/migrate/i, /هاجر/i, /ترحيل/i, /migration/i, /upgrade/i, /الترقية/i, /convert/i, /تحويل/i, /transfer/i],
  git: [/git/, /commit/i, /push/i, /pull/i, /merge/i, /branch/i, /clone/i, /remote/i, /PR/i, /جمعة/i],
  chat: [/hello/i, /hi/i, /مرحبا/i, /اهلا/i, /who are you/i, /من.*انت/i, /how are/i],
};

export class AutoModeDetector {
  constructor(private modeManager: FlashaModeManager) {}

  detect(input: string): string | null {
    for (const [mode, patterns] of Object.entries(MODE_KEYWORDS)) {
      for (const regex of patterns) {
        if (regex.test(input)) {
          return mode;
        }
      }
    }
    return null;
  }

  autoSetMode(input: string): void {
    const detected = this.detect(input);
    if (detected && detected !== this.modeManager.currentMode) {
      this.modeManager.setMode(detected);
    }
  }
}
