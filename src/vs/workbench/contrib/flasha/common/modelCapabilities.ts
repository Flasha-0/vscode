export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  free: boolean;
  local: boolean;
  isDefault: boolean;
  description: string;
}

export const MODELS_CONFIG: { default: string; models: ModelConfig[] } = {
  default: 'opencode/big-pickle',
  models: [
    {
      id: 'opencode/big-pickle',
      name: 'Big Pickle',
      provider: 'opencode',
      free: true,
      local: false,
      isDefault: true,
      description: 'Ø§Ù„Ù…ÙˆØ¯ÙŠÙ„ Ø§Ù„Ø§ÙØªØ±Ø§Ø¶ÙŠ - Ù…Ø¬Ø§Ù†ÙŠ ÙˆØ³Ø±ÙŠØ¹',
    },
    {
      id: 'opencode/deepseek-v4-flash-free',
      name: 'DeepSeek V4 Flash Free',
      provider: 'openrouter',
      free: true,
      local: false,
      isDefault: false,
      description: 'Ø³Ø±ÙŠØ¹ ÙˆÙ…Ø¬Ø§Ù†ÙŠ',
    },
    {
      id: 'ollama/llama3.1',
      name: 'Llama 3.1 8B (Ù…Ø­Ù„ÙŠ)',
      provider: 'ollama',
      free: true,
      local: true,
      isDefault: false,
      description: 'ÙŠØ¹Ù…Ù„ Ø¹Ù„Ù‰ Ø¬Ù‡Ø§Ø²Ùƒ - Ø®ØµÙˆØµÙŠØ© ÙƒØ§Ù…Ù„Ø©',
    },
    {
      id: 'ollama/deepseek-coder',
      name: 'DeepSeek Coder (Ù…Ø­Ù„ÙŠ)',
      provider: 'ollama',
      free: true,
      local: true,
      isDefault: false,
      description: 'Ù…ØªØ®ØµØµ ÙÙŠ Ø§Ù„ÙƒÙˆØ¯ - Ù…Ø­Ù„ÙŠ',
    },
    {
      id: 'opencode/claude-opus-4-7',
      name: 'Claude Opus 4.7',
      provider: 'anthropic',
      free: false,
      local: false,
      isDefault: false,
      description: 'Ø£Ù‚ÙˆÙ‰ Ù…ÙˆØ¯ÙŠÙ„ Ù„Ù„Ù…Ù‡Ø§Ù… Ø§Ù„Ù…Ø¹Ù‚Ø¯Ø©',
    },
    {
      id: 'opencode/gpt-5.2-codex',
      name: 'GPT 5.2 Codex',
      provider: 'openai',
      free: false,
      local: false,
      isDefault: false,
      description: 'Ù…Ù…ØªØ§Ø² Ù„Ù„ÙƒÙˆØ¯',
    },
  ],
};
