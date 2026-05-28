import type { MCPServer, MCPRequest, MCPResponse } from './mcpManager';

export class FigmaMcp implements MCPServer {
  readonly name = 'Figma';
  readonly description = 'Import Figma designs, extract components';

  private accessToken: string = '';

  setToken(token: string) { this.accessToken = token; }

  canHandle(action: string): boolean {
    return action.startsWith('figma.');
  }

  async execute(request: MCPRequest): Promise<MCPResponse> {
    if (!this.accessToken) {
      return { success: false, error: 'Figma not authenticated' };
    }
    const { action, params } = request;
    try {
      switch (action) {
        case 'figma.import':
          return this.importFile(params.fileId);
        case 'figma.components':
          return this.listComponents(params.fileId);
        case 'figma.export':
          return this.exportNode(params.fileId, params.nodeId, params.format);
        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  private async figmaFetch(path: string) {
    const res = await fetch(`https://api.figma.com/v1${path}`, {
      headers: { 'X-Figma-Token': this.accessToken },
    });
    return res.json();
  }

  private async importFile(fileId: string): Promise<MCPResponse> {
    const data = await this.figmaFetch(`/files/${fileId}`);
    return { success: true, data };
  }

  private async listComponents(fileId: string): Promise<MCPResponse> {
    const data = await this.figmaFetch(`/files/${fileId}/components`);
    return { success: true, data };
  }

  private async exportNode(fileId: string, nodeId: string, format = 'svg'): Promise<MCPResponse> {
    const data = await this.figmaFetch(`/images/${fileId}?ids=${nodeId}&format=${format}`);
    return { success: true, data };
  }
}
