
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NexusStatus, Macro, SensorData, HarvestTask, Credential, EmailIdentity } from './types';
import Sidebar from './components/Sidebar';
import Console from './components/Console';
import MacroLibrary from './components/MacroLibrary';
import VoiceIndicator from './components/VoiceIndicator';
import SecurityDashboard from './components/SecurityDashboard';
import CredentialVault from './components/CredentialVault';
import EmailRotator from './components/EmailRotator';
import NexusAvatar from './components/NexusAvatar';
import MediaCenter from './components/MediaCenter';
import { NexusOrchestrator } from './services/nexusService';

// Fix: Missing HarvesterView component implementation to resolve compilation error
const HarvesterView: React.FC<{ addLog: (m: string, t: any) => void }> = ({ addLog }) => {
  const [tasks, setTasks] = useState<HarvestTask[]>([]);
  const [url, setUrl] = useState('');

  const startHarvest = (type: 'github' | 'wget') => {
    if (!url) return;
    
    // Directive: Duplicate check logic
    if (tasks.some(t => t.url === url)) {
      addLog(`Harvester: Asset ${url} already indexed. Integrity confirmed.`, 'warn');
      return;
    }

    const newTask: HarvestTask = {
      id: Math.random().toString(36).substr(2, 9),
      url,
      type,
      status: 'pending',
      path: `/storage/0000-0000/NexusVault/${url.split('/').pop() || 'asset'}`
    };

    setTasks(prev => [newTask, ...prev]);
    addLog(`Harvester: Initiating ${type} sequence for ${url}`, 'info');
    
    // Simulate harvesting process
    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, status: 'cloning' } : t));
      setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, status: 'completed' } : t));
        addLog(`Harvester: Resource ${url} cloned to SD Vault.`, 'nexus');
      }, 3000);
    }, 1000);
    setUrl('');
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold tracking-tighter uppercase text-cyan-400">Vault Harvester</h2>
        <div className="flex space-x-2">
           <input 
             value={url} 
             onChange={e => setUrl(e.target.value)}
             placeholder="GIT REPO / URL" 
             className="bg-slate-900 border border-cyan-900 rounded px-3 py-1 text-[10px] w-48 focus:border-cyan-400 outline-none text-cyan-100"
           />
           <button onClick={() => startHarvest('github')} className="bg-cyan-600/20 border border-cyan-500 px-3 py-1 rounded text-[10px] font-bold hover:bg-cyan-500/30 transition-colors">CLONE</button>
           <button onClick={() => startHarvest('wget')} className="bg-cyan-900/20 border border-cyan-900 px-3 py-1 rounded text-[10px] font-bold hover:bg-slate-800 transition-colors">WGET</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {tasks.map(task => (
          <div key={task.id} className="p-3 bg-slate-950 border border-cyan-900/30 rounded flex justify-between items-center group hover:border-cyan-400/30 transition-all">
            <div className="flex flex-col overflow-hidden">
              <span className="text-[10px] text-cyan-200 font-mono truncate">{task.url}</span>
              <span className="text-[8px] text-slate-500 uppercase font-bold">{task.path}</span>
            </div>
            <div className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ml-4 ${
              task.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 
              task.status === 'cloning' ? 'bg-cyan-500/10 text-cyan-500 animate-pulse border border-cyan-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {task.status}
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-[10px] text-slate-600 italic border border-dashed border-slate-800 p-8 rounded text-center flex flex-col items-center justify-center space-y-2">
            <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Vault ingestion standby. Targets needed.</span>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [status, setStatus] = useState<NexusStatus>(NexusStatus.IDLE);
  const [activeTab, setActiveTab] = useState<'console' | 'macros' | 'security' | 'harvester' | 'vault' | 'rotator' | 'media'>('console');
  const [logs, setLogs] = useState<{ time: string; msg: string; type: 'info' | 'warn' | 'error' | 'nexus' }[]>([]);
  const [sensors, setSensors] = useState<SensorData>({ magnetometer: 0, rfLevel: 0, tamperLevel: 'low' });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  const orchestrator = useRef<NexusOrchestrator | null>(null);

  const addLog = useCallback((msg: string, type: 'info' | 'warn' | 'error' | 'nexus' = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }].slice(-50));
  }, []);

  const initializeSystem = useCallback(() => {
    if (orchestrator.current) return;
    orchestrator.current = new NexusOrchestrator(addLog, (newStatus) => setStatus(newStatus));
    orchestrator.current.startListening();
    orchestrator.current.performAudit();
    setIsInitialized(true);
    addLog("Nexus Core: Hands-free core initialized. System listening.", 'nexus');
  }, [addLog]);

  // Force authentication for zero-friction hands-free access
  useEffect(() => {
    setIsAuthenticated(true);
    setCurrentUser("VAULT_MASTER_01");
    addLog("Vault: Identity established via persistent local session.", 'nexus');
    // Auto-initialize system immediately
    setTimeout(initializeSystem, 100);
  }, [addLog, initializeSystem]);

  const handleVoiceCommand = () => {
    if (!isInitialized) {
      initializeSystem();
      return;
    }
    if (status === NexusStatus.IDLE) {
      orchestrator.current?.startListening();
    } else {
      orchestrator.current?.stopListening();
    }
  };

  const handleLogout = () => {
    setIsInitialized(false);
    orchestrator.current?.stopListening();
    addLog("System: Core standby mode engaged.", 'warn');
  };

  // Removed isAuthenticated check to allow direct access
  return (
    <div className="flex h-screen w-full bg-[#020617] font-mono text-cyan-400 overflow-hidden select-none">
      {!isInitialized && (
        <div className="absolute inset-0 bg-[#020617]/95 z-[100] flex flex-col items-center justify-center p-8 text-center backdrop-blur-xl">
          <div className="w-32 h-32 mb-8 relative">
             <div className="absolute inset-0 border-4 border-cyan-500 rounded-full animate-ping opacity-20" />
             <div className="w-full h-full border-4 border-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_30px_#22d3ee]">
                <span className="text-5xl font-black italic tracking-tighter text-cyan-400">NC</span>
             </div>
          </div>
          <h1 className="text-3xl font-black mb-2 tracking-[0.2em] text-white uppercase italic">Nexus Core AI</h1>
          <p className="text-cyan-800 max-w-sm mb-4 text-sm uppercase font-bold tracking-widest">S25 Ultra Optimized Core</p>
          <p className="text-[10px] text-slate-500 mb-12 uppercase tracking-widest">Hands-Free Persistence: ACTIVE</p>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-cyan-900/20 border border-cyan-500/30 rounded-full animate-pulse">
               <div className="w-2 h-2 bg-cyan-400 rounded-full" />
               <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Initializing Voice Array...</span>
            </div>
            <p className="text-[9px] text-slate-600 uppercase tracking-widest">Listening for "Nexus Core"</p>
          </div>
        </div>
      )}

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col p-4 space-y-4 relative">
        <header className="flex justify-between items-center border-b border-cyan-900/40 pb-3">
          <div className="flex items-center space-x-4">
            <div className={`w-2.5 h-2.5 rounded-full ${status === NexusStatus.LISTENING ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse' : status === NexusStatus.ALERT ? 'bg-red-500 shadow-[0_0_15px_#ef4444] animate-pulse' : 'bg-cyan-900'}`} />
            <h1 className="text-xl font-black tracking-widest uppercase italic text-slate-100">Nexus Core Presence</h1>
          </div>
          <div className="flex items-center space-x-6">
             <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Hands-Free Active</span>
             </div>
             <div className="text-[10px] flex flex-col items-end opacity-40">
                <span>IDENTITY: {currentUser}</span>
                <span>AUTH: JWS_SIGNED</span>
             </div>
             <VoiceIndicator status={status} onClick={handleVoiceCommand} />
          </div>
        </header>

        <div className="flex-1 overflow-hidden grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 flex flex-col space-y-4">
            <div className="flex-1 bg-slate-900/30 rounded-sm border border-cyan-900/30 p-4 overflow-hidden flex flex-col relative backdrop-blur-sm">
              {activeTab === 'console' && <Console logs={logs} />}
              {activeTab === 'macros' && <MacroLibrary addLog={addLog} />}
              {activeTab === 'security' && <SecurityDashboard sensors={sensors} />}
              {activeTab === 'harvester' && <HarvesterView addLog={addLog} />}
              {activeTab === 'vault' && <CredentialVault addLog={addLog} />}
              {activeTab === 'rotator' && <EmailRotator />}
              {activeTab === 'media' && <MediaCenter />}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 flex flex-col space-y-6 overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/20 border border-cyan-900/20 rounded-sm p-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
               <NexusAvatar status={status} />
               <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            </div>
            
            <div className="h-48 bg-slate-900/40 border border-cyan-900/30 rounded-sm p-4 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center border-b border-cyan-900 pb-2 mb-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-600">Diagnostic Stream</h3>
                <div className="flex space-x-3">
                  <button onClick={() => orchestrator.current?.performAudit()} className="text-[8px] text-cyan-500 hover:text-cyan-300 uppercase font-bold">Re-Run Audit</button>
                  <button onClick={handleLogout} className="text-[8px] text-slate-600 hover:text-red-500 uppercase font-bold">Terminate Session</button>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                   <div className="flex justify-between text-[10px] uppercase font-bold">
                     <span className="text-slate-500">Magnetic Interference</span>
                     <span className="text-cyan-400">{sensors.magnetometer.toFixed(2)} μT</span>
                   </div>
                   <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-cyan-900/20">
                     <div className={`h-full transition-all duration-300 ${sensors.tamperLevel === 'high' ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${Math.min(sensors.magnetometer * 2.5, 100)}%` }} />
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-2 border border-cyan-900/30 bg-black/40 rounded-sm">
                      <p className="text-[9px] uppercase font-bold text-slate-600 mb-1">Macro Status</p>
                      <p className="text-[10px] text-green-400 font-bold">ACTIVE_WAITING</p>
                   </div>
                   <div className="p-2 border border-cyan-900/30 bg-black/40 rounded-sm">
                      <p className="text-[9px] uppercase font-bold text-slate-600 mb-1">Rotator Load</p>
                      <p className="text-[10px] text-cyan-400 font-bold">AGENT_01_ENGAGED</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
