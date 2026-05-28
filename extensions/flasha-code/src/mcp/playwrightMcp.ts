import type { MCPServer, MCPRequest, MCPResponse } from './mcpManager';

export class PlaywrightMcp implements MCPServer {
  readonly name = 'Playwright';
  readonly description = 'Browser automation - navigate, click, extract';

  private playwrightAvailable: boolean | null = null;

  canHandle(action: string): boolean {
    return action.startsWith('browser.');
  }

  async execute(request: MCPRequest): Promise<MCPResponse> {
    const { action, params } = request;
    try {
      switch (action) {
        case 'browser.screenshot':
          return this.screenshot(params.url, params.selector);
        case 'browser.extract':
          return this.extractText(params.url, params.selector);
        case 'browser.click':
          return this.clickElement(params.url, params.selector);
        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  private async ensurePlaywright(): Promise<any> {
    if (this.playwrightAvailable === false) {
      throw new Error('Playwright not installed. Run: npm install playwright');
    }
    try {
      return await import('playwright');
    } catch {
      this.playwrightAvailable = false;
      throw new Error('Playwright not installed. Run: npm install playwright');
    }
  }

  private async screenshot(url: string, selector?: string): Promise<MCPResponse> {
    const { chromium } = await this.ensurePlaywright();
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url);
    if (selector) await page.waitForSelector(selector);
    const buffer = selector
      ? await page.locator(selector).screenshot()
      : await page.screenshot();
    await browser.close();
    return { success: true, data: { screenshot: buffer.toString('base64'), format: 'png' } };
  }

  private async extractText(url: string, selector?: string): Promise<MCPResponse> {
    const { chromium } = await this.ensurePlaywright();
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const text = selector
      ? await page.locator(selector).innerText()
      : await page.content();
    await browser.close();
    return { success: true, data: { text } };
  }

  private async clickElement(url: string, selector: string): Promise<MCPResponse> {
    const { chromium } = await this.ensurePlaywright();
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.click(selector);
    await browser.close();
    return { success: true, data: { message: `Clicked ${selector}` } };
  }
}
