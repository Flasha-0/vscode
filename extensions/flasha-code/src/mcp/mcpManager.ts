export interface MCPRequest {
  action: string;
  params: Record<string, any>;
}

export interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface MCPServer {
  readonly name: string;
  readonly description: string;
  canHandle(action: string): boolean;
  execute(request: MCPRequest): Promise<MCPResponse>;
}

export class MCPManager {
  private servers: Map<string, MCPServer> = new Map();

  register(server: MCPServer) {
    this.servers.set(server.name, server);
  }

  get(name: string): MCPServer | undefined {
    return this.servers.get(name);
  }

  getAll(): MCPServer[] {
    return Array.from(this.servers.values());
  }

  async execute(request: MCPRequest): Promise<MCPResponse> {
    for (const server of this.servers.values()) {
      if (server.canHandle(request.action)) {
        return server.execute(request);
      }
    }
    return { success: false, error: `No server handles action: ${request.action}` };
  }
}
