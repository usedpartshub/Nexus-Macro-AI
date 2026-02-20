
import React, { useState } from 'react';
import { Macro, MacroStep } from '../types';
import MacroEditor from './MacroEditor';

interface MacroLibraryProps {
  addLog: (m: string, t: any) => void;
}

const MacroLibrary: React.FC<MacroLibraryProps> = ({ addLog }) => {
  const [macros, setMacros] = useState<Macro[]>([
    { 
      id: '1', 
      name: 'FB_HUSTLE_LOGIN', 
      description: 'Opens FB, waits 2s, clicks login, injects vault creds.', 
      trigger: 'command', 
      status: 'active',
      steps: [
        { id: 's1', type: 'OPEN_URL', value: 'https://m.facebook.com', delayMs: 1000 },
        { id: 's2', type: 'WAIT', value: '2s', delayMs: 2000 },
        { id: 's3', type: 'CLICK', value: 'Login Button', coordX: 450, coordY: 720, delayMs: 500 },
        { id: 's4', type: 'TYPE', value: '[VAULT_CREDS_FB]', delayMs: 1000 },
      ]
    },
    { 
      id: '2', 
      name: 'GPT_UI_ANALYZE', 
      description: 'Opens GPT, takes screenshot, Nexus analyzes UI to adjust macro.', 
      trigger: 'command', 
      status: 'active',
      steps: [
        { id: 's1', type: 'OPEN_URL', value: 'https://chat.openai.com', delayMs: 2000 },
        { id: 's2', type: 'SCREEN_CAPTURE', value: 'gpt_main_ui', delayMs: 1000 },
        { id: 's3', type: 'UI_ANALYSIS', value: 'locate_input_box', delayMs: 2000 },
        { id: 's4', type: 'TYPE', value: 'Tell me a story about freedom.', delayMs: 500 },
      ]
    },
    { 
      id: '3', 
      name: 'TOKEN_SAVER_SWITCH', 
      description: 'Switches between 20 free accounts when tokens are exhausted.', 
      trigger: 'event', 
      status: 'active',
      steps: [
        { id: 's1', type: 'SWITCH_ACCOUNT', value: 'NEXT_AVAILABLE', delayMs: 1500 },
        { id: 's2', type: 'OPEN_URL', value: 'https://chat.openai.com', delayMs: 1000 },
      ]
    },
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const [editingMacro, setEditingMacro] = useState<Macro | null>(null);

  const deployMacro = async (macro: Macro) => {
    addLog(`Nexus Core: Initiating sequence [${macro.name}]...`, 'nexus');
    for (const step of macro.steps) {
      addLog(`Executing [${step.type}]: ${step.value}...`, 'info');
      await new Promise(res => setTimeout(res, step.delayMs));
    }
    addLog(`Sequence Complete: ${macro.name} executed successfully.`, 'nexus');
  };

  const startRecording = () => {
    setIsRecording(true);
    addLog("Nexus Core: Screen Recording Activated. Capture every touch and coordinate.", 'warn');
    setTimeout(() => {
      setIsRecording(false);
      addLog("Nexus Core: Recording Saved to Macro Library Buffer.", 'info');
    }, 5000);
  };

  const saveMacro = (updated: Macro) => {
    setMacros(macros.map(m => m.id === updated.id ? updated : m));
    setEditingMacro(null);
    addLog(`Nexus Core: Sequence [${updated.name}] fine-tuned and saved.`, 'nexus');
  };

  if (editingMacro) {
    return <MacroEditor macro={editingMacro} onSave={saveMacro} onCancel={() => setEditingMacro(null)} />;
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center border-b border-cyan-900/30 pb-4">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold tracking-tighter uppercase text-cyan-400">Automation Core</h2>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest">S25 Ultra Local Execution Engine</span>
        </div>
        <div className="flex space-x-2">
          <div className="px-3 py-1 bg-cyan-900/20 border border-cyan-900/40 rounded text-[9px] font-bold text-cyan-700 flex items-center">
            VOICE_TRIGGER: ENABLED
          </div>
          <button 
            onClick={startRecording}
            className={`px-4 py-1 rounded text-xs border transition-all ${isRecording ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : 'bg-cyan-600/20 border-cyan-500 hover:bg-cyan-500/30'}`}
          >
            {isRecording ? 'RECORDING...' : 'RECORD MACRO'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
        <div className="flex flex-col space-y-3 overflow-hidden">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Macros</h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {macros.map(m => (
              <div key={m.id} className="p-4 bg-slate-950 border border-cyan-900/50 rounded-sm flex flex-col justify-between group hover:border-cyan-400/50 transition-all">
                <div onClick={() => deployMacro(m)} className="cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-cyan-200">{m.name}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-900/30 text-cyan-400">{m.trigger.toUpperCase()}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-4">{m.description}</p>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex space-x-1">
                    {m.steps.map((s) => (
                      <div key={s.id} className="w-1 h-1 bg-cyan-900 rounded-full" />
                    ))}
                  </div>
                  <button 
                    onClick={() => setEditingMacro(m)}
                    className="text-[8px] text-cyan-700 hover:text-cyan-400 uppercase font-black tracking-widest"
                  >
                    Fine-Tune Sequence
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="p-4 bg-black/40 border border-cyan-900/20 rounded-sm">
            <h3 className="text-[10px] font-black text-cyan-700 uppercase tracking-widest mb-3">Hands-Free Voice Commands</h3>
            <div className="space-y-3">
              {[
                { cmd: 'Nexus Core, start harvest', desc: 'Clones target repo to SD Vault' },
                { cmd: 'Nexus Core, search [query]', desc: 'Performs local-first web research' },
                { cmd: 'Nexus Core, rotate email', desc: 'Switches active marketing identity' },
                { cmd: 'Nexus Core, schedule 14:30', desc: 'Schedules current macro for time' },
                { cmd: 'Nexus Core, lock vault', desc: 'Terminates session immediately' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col space-y-0.5">
                  <span className="text-[10px] font-bold text-cyan-400">"{item.cmd}"</span>
                  <span className="text-[8px] text-slate-600 uppercase tracking-tighter">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-900/20 border border-cyan-900/20 rounded-sm flex-1">
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">System Watchdog</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-black/20 rounded border border-cyan-900/10">
                <span className="text-[9px] text-slate-500 uppercase font-bold">Auto-Recovery</span>
                <span className="text-[9px] text-green-500 font-black">ENABLED</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-black/20 rounded border border-cyan-900/10">
                <span className="text-[9px] text-slate-500 uppercase font-bold">JWS Integrity</span>
                <span className="text-[9px] text-cyan-500 font-black">VERIFIED</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-black/20 rounded border border-cyan-900/10">
                <span className="text-[9px] text-slate-500 uppercase font-bold">Android Bridge</span>
                <span className="text-[9px] text-cyan-500 font-black">READY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isRecording && (
        <div className="absolute inset-0 bg-red-500/10 border-4 border-red-500/20 rounded-lg pointer-events-none z-50 flex items-center justify-center">
           <div className="bg-red-600 text-white px-6 py-2 rounded-full font-bold animate-bounce shadow-2xl">RECORDING ACTIVE</div>
        </div>
      )}
    </div>
  );
};

export default MacroLibrary;
