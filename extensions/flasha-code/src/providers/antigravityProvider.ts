import type { LLMProvider, LLMRequest, LLMResponse } from './llmProvider';

export class AntigravityProvider implements LLMProvider {
  readonly name = 'Antigravity';
  readonly models = ['antigravity/default'];
  private baseUrl = 'https://api.antigravity.ai/v1';

  constructor(private apiKey: string) {}

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }

  async query(request: LLMRequest): Promise<LLMResponse> {
    const start = Date.now();
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2048,
      }),
    });
    if (!res.ok) throw new Error(`Antigravity error: ${res.status}`);
    const data = await res.json();
    return {
      content: data.choices?.[0]?.message?.content || '',
      model: request.model,
      provider: 'antigravity',
      latencyMs: Date.now() - start,
    };
  }
}
