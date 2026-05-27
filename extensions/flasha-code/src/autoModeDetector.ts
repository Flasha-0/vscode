import { FlashaModeManager } from './modeManager';

const MODE_KEYWORDS: Record<string, RegExp[]> = {
  plan: [/plan/i, /Ø®Ø·Ø·/i, /ØªØµÙ…ÙŠÙ….*Ø­Ù„/i, /strategy/i, /roadmap/i, /architecture/i, /Ù…Ø®Ø·Ø·/i],
  build: [/build/i, /Ø§Ø¨Ù†ÙŠ/i, /create.*(file|app|project|class|function|component)/i, /implement/i, /Ù†ÙØ°/i, /create/i, /generate/i],
  review: [/review/i, /Ø±Ø§Ø¬Ø¹/i, /code.*review/i, /Ù…Ø±Ø§Ø¬Ø¹Ø©/i, /inspect/i, /audit/i, /check.*code/i],
  debug: [/debug/i, /fix/i, /bug/i, /Ø®Ù„Ù„/i, /error/i, /Ø®Ø·Ø£/i, /not working/i, /doesn.*t work/i, /Ù…Ø´ÙƒÙ„Ø©/i, /fix/i, /broken/i],
  test: [/test/i, /Ø§Ø®ØªØ¨Ø§Ø±/i, /unit.*test/i, /spec/i, /t?est/i, /assert/i, /jest/i, /pytest/i, /vitest/i],
  document: [/doc/i, /document/i, /ÙˆØ«Ù‚/i, /ØªÙˆØ«ÙŠÙ‚/i, /readme/i, /Ø´Ø±Ø­/i, /api.*doc/i, /jsdoc/i, /comment/i],
  refactor: [/refactor/i, /Ø­Ø³Ù†/i, /optimize/i, /clean/i, /Ù†Ø¸Ù/i, /improve/i, /simplify/i, /Ø¥Ø¹Ø§Ø¯Ø©.*Ù‡ÙŠÙƒÙ„Ø©/i],
  security: [/security/i, /secure/i, /Ø£Ù…Ù†/i, /vulnerability/i, /Ø«ØºØ±Ø©/i, /hack/i, /Ø§Ø®ØªØ±Ø§Ù‚/i, /permission/i, /auth/i],
  deploy: [/deploy/i, /Ø§Ù†Ø´Ø±/i, /release/i, /publish/i, /Ø¥ØµØ¯Ø§Ø±/i, /Ù†Ø´Ø±/i, /CI/i, /CD/i, /ÙˆØ±ÙƒÙ„/i, /vercel/i],
  analyze: [/analyze/i, /Ø­Ù„Ù„/i, /analysis/i, /ØªØ­Ù„ÙŠÙ„/i, /metric/i, /Ù…Ù‚Ø§ÙŠÙŠØ³/i, /performance/i, /Ø£Ø¯Ø§Ø¡/i, /profile/i],
  design: [/design/i, /ui/i, /ux/i, /interface/i, /ØªØµÙ…ÙŠÙ…/i, /ÙˆØ§Ø¬Ù‡Ø©/i, /color/i, /Ù„ÙˆÙ†/i, /layout/i, /style/i, /css/i],
  migrate: [/migrate/i, /Ù‡Ø§Ø¬Ø±/i, /ØªØ±Ø­ÙŠÙ„/i, /migration/i, /upgrade/i, /Ø§Ù„ØªØ±Ù‚ÙŠØ©/i, /convert/i, /ØªØ­ÙˆÙŠÙ„/i, /transfer/i],
  git: [/git/, /commit/i, /push/i, /pull/i, /merge/i, /branch/i, /clone/i, /remote/i, /PR/i, /Ø¬Ù…Ø¹Ø©/i],
  chat: [/hello/i, /hi/i, /Ù…Ø±Ø­Ø¨Ø§/i, /Ø§Ù‡Ù„Ø§/i, /who are you/i, /Ù…Ù†.*Ø§Ù†Øª/i, /how are/i],
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
