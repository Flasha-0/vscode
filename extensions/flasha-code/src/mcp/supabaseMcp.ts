import type { MCPServer, MCPRequest, MCPResponse } from './mcpManager';

interface SupabaseClient {
  url: string;
  key: string;
}

export class SupabaseMcp implements MCPServer {
  readonly name = 'Supabase';
  readonly description = 'Query Supabase tables, manage data';

  private client: SupabaseClient | null = null;

  connect(url: string, key: string) {
    this.client = { url, key };
  }

  canHandle(action: string): boolean {
    return action.startsWith('supabase.');
  }

  async execute(request: MCPRequest): Promise<MCPResponse> {
    if (!this.client) {
      return { success: false, error: 'Supabase not connected' };
    }
    const { action, params } = request;
    try {
      switch (action) {
        case 'supabase.query':
          return this.query(params.table, params.select);
        case 'supabase.insert':
          return this.insert(params.table, params.data);
        case 'supabase.tables':
          return this.listTables();
        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  private headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.client!.key}`,
      'apikey': this.client!.key,
    };
  }

  private async query(table: string, select = '*'): Promise<MCPResponse> {
    const res = await fetch(`${this.client!.url}/rest/v1/${table}?select=${select}`, {
      headers: this.headers(),
    });
    return { success: res.ok, data: await res.json() };
  }

  private async insert(table: string, data: any): Promise<MCPResponse> {
    const res = await fetch(`${this.client!.url}/rest/v1/${table}`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(data),
    });
    return { success: res.ok, data: await res.json() };
  }

  private async listTables(): Promise<MCPResponse> {
    const res = await fetch(`${this.client!.url}/rest/v1/`, {
      headers: this.headers(),
    });
    const data = await res.text();
    return { success: true, data: { tables: data } };
  }
}
