import * as vscode from 'vscode';

interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: Record<string, string>;
  body?: string;
}

interface APIResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  latencyMs: number;
}

export class ApiTesterService {
  async send(request: APIRequest): Promise<APIResponse> {
    const start = Date.now();
    const headers: Record<string, string> = { ...request.headers };
    if (request.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(request.url, {
      method: request.method,
      headers,
      body: request.body || undefined,
    });

    const resHeaders: Record<string, string> = {};
    res.headers.forEach((v, k) => { resHeaders[k] = v; });

    return {
      status: res.status,
      statusText: res.statusText,
      headers: resHeaders,
      body: await res.text(),
      latencyMs: Date.now() - start,
    };
  }

  saveRequest(name: string, req: APIRequest): void {
    const config = vscode.workspace.getConfiguration('flasha');
    const saved = config.get<Record<string, APIRequest>>('savedRequests', {});
    saved[name] = req;
    config.update('savedRequests', saved, vscode.ConfigurationTarget.Global);
  }

  getSavedRequests(): Record<string, APIRequest> {
    return vscode.workspace.getConfiguration('flasha').get<Record<string, APIRequest>>('savedRequests', {});
  }
}
