export interface LLMRequest {
  model: string;
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
  model: string;
  provider: string;
  latencyMs: number;
}

export interface LLMProvider {
  readonly name: string;
  readonly models: string[];
  query(request: LLMRequest): Promise<LLMResponse>;
  isAvailable(): Promise<boolean>;
}
