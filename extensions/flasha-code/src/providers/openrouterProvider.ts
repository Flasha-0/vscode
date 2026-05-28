import type { LLMProvider, LLMRequest, LLMResponse } from './llmProvider';

export class OpenRouterProvider implements LLMProvider {
  readonly name = 'OpenRouter';
  readonly models = ['openrouter/deepseek-v4', 'openrouter/claude-sonnet', 'openrouter/gemini-pro'];

  constructor(private apiKey: string) {}

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }

  async query(request: LLMRequest): Promise<LLMResponse> {
    const start = Date.now();
    const modelName = request.model.replace('openrouter/', '');
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2048,
      }),
    });
    if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`);
    const data = await res.json();
    return {
      content: data.choices?.[0]?.message?.content || '',
      model: request.model,
      provider: 'openrouter',
      latencyMs: Date.now() - start,
    };
  }
}
