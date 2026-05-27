import { OpenCodeService, ChatMessage } from './opencodeService.js';

export interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  mode: string;
  createdAt: number;
  updatedAt: number;
}

export class ChatThreadService {
  private threads: Map<string, ChatThread> = new Map();
  private currentThreadId: string | null = null;
  private openCode: OpenCodeService;

  constructor(openCode: OpenCodeService) {
    this.openCode = openCode;
  }

  createThread(mode: string = 'auto'): string {
    const id = `thread_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const thread: ChatThread = {
      id,
      title: 'Ù…Ø­Ø§Ø¯Ø«Ø© Ø¬Ø¯ÙŠØ¯Ø©',
      messages: [],
      mode,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.threads.set(id, thread);
    this.currentThreadId = id;
    return id;
  }

  async addMessage(role: 'user' | 'assistant' | 'system', content: string): Promise<void> {
    if (!this.currentThreadId) {
      this.createThread();
    }
    const thread = this.threads.get(this.currentThreadId!);
    if (!thread) return;

    const message: ChatMessage = {
      role,
      content,
      mode: thread.mode,
      timestamp: Date.now(),
    };
    thread.messages.push(message);
    thread.updatedAt = Date.now();

    if (role === 'user') {
      await this.openCode.sendMessage(message);
    }
  }

  getCurrentThread(): ChatThread | undefined {
    return this.currentThreadId ? this.threads.get(this.currentThreadId) : undefined;
  }

  getAllThreads(): ChatThread[] {
    return Array.from(this.threads.values());
  }

  switchToThread(id: string): void {
    if (this.threads.has(id)) {
      this.currentThreadId = id;
    }
  }

  deleteThread(id: string): void {
    this.threads.delete(id);
    if (this.currentThreadId === id) {
      this.currentThreadId = null;
    }
  }

  setMode(mode: string): void {
    const thread = this.threads.get(this.currentThreadId ?? '');
    if (thread) {
      thread.mode = mode;
    }
  }
}
