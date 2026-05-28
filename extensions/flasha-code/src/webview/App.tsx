import React, { useState, useEffect, useCallback } from 'react';
import { vscode } from './vscodeApi';
import ChatPanel from './ChatPanel';
import ModeSelector from './ModeSelector';
import ModelPicker from './ModelPicker';
import MemoriesPanel from './MemoriesPanel';
import DiffViewer from './DiffViewer';
import CheckpointTimeline from './CheckpointTimeline';
import RulesEditor from './RulesEditor';
import APITester from './APITester';
import LivePreview from './LivePreview';
import DeployPanel from './DeployPanel';
import AnalyticsPanel from './AnalyticsPanel';
import TemplateGallery from './TemplateGallery';
import type { FlashaMessage, ModeInfo, ModelInfo, Checkpoint, MemoryEntry } from './types';

type Tab = 'chat' | 'memories' | 'diff' | 'checkpoints' | 'rules' | 'api' | 'preview' | 'deploy' | 'analytics' | 'templates';

const TAB_ICONS: Record<Tab, string> = {
  chat: '💬', memories: '🧠', diff: '📊', checkpoints: '📌',
  rules: '📜', api: '🔌', preview: '👁', deploy: '🚀',
  analytics: '📈', templates: '📦',
};

const TAB_LABELS: Record<Tab, string> = {
  chat: 'Chat', memories: 'Memories', diff: 'Diff', checkpoints: 'Savepoints',
  rules: 'Rules', api: 'API', preview: 'Preview', deploy: 'Deploy',
  analytics: 'Stats', templates: 'Templates',
};

export default function App() {
  const [messages, setMessages] = useState<FlashaMessage[]>([]);
  const [currentMode, setCurrentMode] = useState('auto');
  const [currentModel, setCurrentModel] = useState('opencode/big-pickle');
  const [modes] = useState<ModeInfo[]>([
    { id: 'auto', label: 'تلقائي' }, { id: 'plan', label: 'تخطيط' },
    { id: 'build', label: 'بناء' }, { id: 'chat', label: 'محادثة' },
    { id: 'review', label: 'مراجعة' }, { id: 'debug', label: 'تصحيح' },
    { id: 'test', label: 'اختبار' }, { id: 'document', label: 'توثيق' },
    { id: 'refactor', label: 'إعادة هيكلة' }, { id: 'security', label: 'أمان' },
    { id: 'deploy', label: 'نشر' }, { id: 'analyze', label: 'تحليل' },
    { id: 'design', label: 'تصميم' }, { id: 'migrate', label: 'ترحيل' },
    { id: 'git', label: 'Git' },
  ]);
  const [models] = useState<ModelInfo[]>([
    { id: 'opencode/big-pickle', name: 'Big Pickle', provider: 'OpenCode' },
    { id: 'deepseek-v4-flash-free', name: 'DeepSeek Free', provider: 'DeepSeek' },
    { id: 'ollama/llama3.1', name: 'Llama 3.1', provider: 'Local' },
    { id: 'ollama/deepseek-coder', name: 'DeepSeek Coder', provider: 'Local' },
  ]);
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [diffContent, setDiffContent] = useState('');

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = event.data;
      switch (msg.type) {
        case 'addMessage':
          setMessages(prev => [...prev, msg.message]);
          break;
        case 'setMode':
          setCurrentMode(msg.mode);
          break;
        case 'setModel':
          setCurrentModel(msg.model);
          break;
        case 'setMemories':
          setMemories(msg.memories);
          break;
        case 'setCheckpoints':
          setCheckpoints(msg.checkpoints);
          break;
        case 'setDiff':
          setDiffContent(msg.content);
          break;
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const sendMessage = useCallback((content: string) => {
    const message: FlashaMessage = { role: 'user', content, timestamp: Date.now() };
    setMessages(prev => [...prev, message]);
    vscode.postMessage({ type: 'sendMessage', content, mode: currentMode, model: currentModel });
  }, [currentMode, currentModel]);

  const handleModeChange = useCallback((modeId: string) => {
    setCurrentMode(modeId);
    vscode.postMessage({ type: 'setMode', mode: modeId });
  }, []);

  const handleModelChange = useCallback((modelId: string) => {
    setCurrentModel(modelId);
    vscode.postMessage({ type: 'setModel', model: modelId });
  }, []);

  const tabs: Tab[] = ['chat', 'memories', 'diff', 'checkpoints', 'rules', 'api', 'preview', 'deploy', 'analytics', 'templates'];

  return (
    <div style={styles.container} dir="rtl">
      <header style={styles.header}>
        <ModelPicker models={models} current={currentModel} onChange={handleModelChange} />
      </header>
      <ModeSelector modes={modes} current={currentMode} onChange={handleModeChange} />
      <nav style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab}
            style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }}
            onClick={() => setActiveTab(tab)}
            title={TAB_LABELS[tab]}
          >
            {TAB_ICONS[tab]}
          </button>
        ))}
      </nav>
      <main style={styles.main}>
        {activeTab === 'chat' && <ChatPanel messages={messages} onSend={sendMessage} />}
        {activeTab === 'memories' && <MemoriesPanel memories={memories} />}
        {activeTab === 'diff' && <DiffViewer content={diffContent} />}
        {activeTab === 'checkpoints' && <CheckpointTimeline checkpoints={checkpoints} />}
        {activeTab === 'rules' && <RulesEditor />}
        {activeTab === 'api' && <APITester />}
        {activeTab === 'preview' && <LivePreview />}
        {activeTab === 'deploy' && <DeployPanel />}
        {activeTab === 'analytics' && <AnalyticsPanel />}
        {activeTab === 'templates' && <TemplateGallery />}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif', background: '#1e1e1e', color: '#d4d4d4' },
  header: { padding: '8px', borderBottom: '1px solid #333' },
  tabs: { display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #333' },
  tab: { padding: '6px 8px', border: 'none', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '14px' },
  activeTab: { color: '#f0ad4e', borderBottom: '2px solid #f0ad4e', background: '#2d2d2d' },
  main: { flex: 1, overflow: 'auto', padding: '8px' },
};
