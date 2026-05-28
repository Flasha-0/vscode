import type { LLMProvider, LLMRequest, LLMResponse } from './llmProvider';

export class OllamaProvider implements LLMProvider {
  readonly name = 'Ollama';
  readonly models = ['ollama/llama3.1', 'ollama/deepseek-coder', 'ollama/qwen-coder'];
  private baseUrl = 'http://localhost:11434';

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  }

  async query(request: LLMRequest): Promise<LLMResponse> {
    const start = Date.now();
    const modelName = request.model.replace('ollama/', '');
    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        messages: request.messages,
        stream: false,
        options: {
          temperature: request.temperature ?? 0.7,
          num_predict: request.maxTokens ?? 2048,
        },
      }),
    });
    if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
    const data = await res.json();
    return {
      content: data.message?.content || '',
      model: request.model,
      provider: 'ollama',
      latencyMs: Date.now() - start,
    };
  }
}
