import type { LLMProvider, LLMRequest, LLMResponse } from './llmProvider';

export class CustomProvider implements LLMProvider {
  readonly name = 'Custom API';
  readonly models: string[];

  constructor(
    models: string[],
    private endpoint: string,
    private apiKey: string,
    private customHeaders: Record<string, string> = {}
  ) {
    this.models = models.length ? models : ['custom/default'];
  }

  async isAvailable(): Promise<boolean> {
    return !!this.endpoint;
  }

  setEndpoint(url: string) { this.endpoint = url; }
  setApiKey(key: string) { this.apiKey = key; }
  setHeaders(headers: Record<string, string>) { this.customHeaders = headers; }

  async query(request: LLMRequest): Promise<LLMResponse> {
    const start = Date.now();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.customHeaders,
    };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2048,
      }),
    });
    if (!res.ok) throw new Error(`Custom API error: ${res.status}`);
    const data = await res.json();
    return {
      content: data.choices?.[0]?.message?.content || data.content || '',
      model: request.model,
      provider: 'custom',
      latencyMs: Date.now() - start,
    };
  }
}
