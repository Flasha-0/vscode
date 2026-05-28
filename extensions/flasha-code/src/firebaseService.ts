import * as vscode from 'vscode';

interface FirebaseConfig {
  apiKey: string;
  projectId: string;
  authDomain?: string;
  storageBucket?: string;
}

export class FirebaseService {
  private config: FirebaseConfig | null = null;

  async connect(): Promise<boolean> {
    const apiKey = await vscode.window.showInputBox({ prompt: 'Firebase API Key', password: true });
    if (!apiKey) return false;
    const projectId = await vscode.window.showInputBox({ prompt: 'Firebase Project ID' });
    if (!projectId) return false;

    this.config = { apiKey, projectId };
    vscode.window.showInformationMessage(`Connected to Firebase: ${projectId}`);
    return true;
  }

  isConnected(): boolean {
    return this.config !== null;
  }

  getConfig(): FirebaseConfig | null {
    return this.config;
  }

  async queryFirestore(collection: string): Promise<any> {
    if (!this.config) throw new Error('Firebase not connected');
    const token = await this.getAccessToken();
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${this.config.projectId}/databases/(default)/documents/${collection}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    return res.json();
  }

  private async getAccessToken(): Promise<string> {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${this.config!.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnSecureToken: true }),
    });
    const data = await res.json();
    return data.idToken || '';
  }
}
