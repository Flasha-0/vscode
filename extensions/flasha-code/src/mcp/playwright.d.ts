declare module 'playwright' {
  export interface Browser { newPage(): Promise<Page>; close(): Promise<void>; }
  export interface Page { goto(url: string): Promise<void>; waitForSelector(s: string): Promise<void>; content(): Promise<string>; screenshot(opts?: any): Promise<Buffer>; locator(s: string): { screenshot(opts?: any): Promise<Buffer>; innerText(): Promise<string>; }; click(s: string): Promise<void>; }
  export const chromium: { launch(): Promise<Browser>; };
}
