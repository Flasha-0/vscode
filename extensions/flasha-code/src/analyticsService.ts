import * as vscode from 'vscode';

interface AnalyticsEvent {
  event: string;
  timestamp: number;
  data?: Record<string, any>;
}

export class AnalyticsService {
  private static STORAGE_KEY = 'flasha.analytics';
  private enabled = true;

  async track(event: string, data?: Record<string, any>): Promise<void> {
    if (!this.enabled) return;

    const events = await this.getEvents();
    events.push({ event, timestamp: Date.now(), data });
    await vscode.workspace.getConfiguration('flasha').update(
      AnalyticsService.STORAGE_KEY,
      events.slice(-1000), // keep last 1000
      vscode.ConfigurationTarget.Global
    );
  }

  async getEvents(): Promise<AnalyticsEvent[]> {
    return vscode.workspace.getConfiguration('flasha').get<AnalyticsEvent[]>(AnalyticsService.STORAGE_KEY, []);
  }

  async getSummary(): Promise<{ event: string; count: number }[]> {
    const events = await this.getEvents();
    const counts = new Map<string, number>();
    for (const e of events) {
      counts.set(e.event, (counts.get(e.event) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count);
  }

  async getTokenEstimate(): Promise<{ total: number; byModel: Record<string, number> }> {
    const events = await this.getEvents();
    const aiEvents = events.filter(e => e.event === 'ai_query');
    const byModel: Record<string, number> = {};
    let total = 0;
    for (const e of aiEvents) {
      const model = e.data?.model || 'unknown';
      const tokens = e.data?.tokens || 0;
      byModel[model] = (byModel[model] || 0) + tokens;
      total += tokens;
    }
    return { total, byModel };
  }
}
