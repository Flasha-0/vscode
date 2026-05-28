import type { LLMProvider, LLMRequest, LLMResponse } from './llmProvider';
import { OllamaProvider } from './ollamaProvider';
import { OpenRouterProvider } from './openrouterProvider';
import { AntigravityProvider } from './antigravityProvider';
import { CustomProvider } from './customProvider';

export class ProviderRegistry {
  private providers: Map<string, LLMProvider> = new Map();
  private ollama: OllamaProvider;

  constructor() {
    this.ollama = new OllamaProvider();
    this.register(this.ollama);
  }

  register(provider: LLMProvider) {
    this.providers.set(provider.name, provider);
  }

  get(name: string): LLMProvider | undefined {
    return this.providers.get(name);
  }

  getAll(): LLMProvider[] {
    return Array.from(this.providers.values());
  }

  async query(request: LLMRequest): Promise<LLMResponse> {
    const provider = this.findProvider(request.model);
    if (!provider) {
      throw new Error(`No provider found for model: ${request.model}`);
    }
    return provider.query(request);
  }

  findProvider(model: string): LLMProvider | undefined {
    for (const provider of this.providers.values()) {
      if (provider.models.includes(model)) {
        return provider;
      }
    }
    return undefined;
  }

  getOllama(): OllamaProvider {
    return this.ollama;
  }

  createOpenRouter(apiKey: string): OpenRouterProvider {
    const p = new OpenRouterProvider(apiKey);
    this.register(p);
    return p;
  }

  createAntigravity(apiKey: string): AntigravityProvider {
    const p = new AntigravityProvider(apiKey);
    this.register(p);
    return p;
  }

  createCustom(models: string[], endpoint: string, apiKey: string): CustomProvider {
    const p = new CustomProvider(models, endpoint, apiKey);
    this.register(p);
    return p;
  }
}
