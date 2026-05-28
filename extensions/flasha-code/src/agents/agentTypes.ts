export type AgentStatus = 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  run(context: AgentContext): Promise<AgentResult>;
}

export interface AgentContext {
  workspaceRoot: string;
  onProgress(message: string): void;
  signal: AbortSignal;
}

export interface AgentResult {
  success: boolean;
  message: string;
  details?: string;
  durationMs: number;
}

export interface AgentRun {
  agentId: string;
  runId: string;
  status: AgentStatus;
  startedAt: number;
  completedAt?: number;
  result?: AgentResult;
}
