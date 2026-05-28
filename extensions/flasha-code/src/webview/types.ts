export interface FlashaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ModeInfo {
  id: string;
  label: string;
  icon?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
}

export interface Checkpoint {
  id: string;
  label: string;
  timestamp: number;
}

export interface MemoryEntry {
  key: string;
  value: string;
  timestamp: number;
}
