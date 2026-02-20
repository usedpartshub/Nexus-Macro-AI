import React, { useState } from 'react';
import { Macro, MacroStep } from '../types';

interface MacroEditorProps {
  macro: Macro;
  onSave: (updatedMacro: Macro) => void;
  onCancel: () => void;
}

const MacroEditor: React.FC<MacroEditorProps> = ({ macro, onSave, onCancel }) => {
  const [editedMacro, setEditedMacro] = useState<Macro>({ ...macro });

  const addStep = () => {
    const newStep: MacroStep = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'WAIT',
      value: '1s',
      delayMs: 1000
    };
    setEditedMacro({
      ...editedMacro,
      steps: [...editedMacro.steps, newStep]
    });
  };

  const updateStep = (id: string, updates: Partial<MacroStep>) => {
    setEditedMacro({
      ...editedMacro,
      steps: editedMacro.steps.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const removeStep = (id: string) => {
    setEditedMacro({
      ...editedMacro,
      steps: editedMacro.steps.filter(s => s.id !== id)
    });
  };

  return (
    <div className="flex flex-col h-full space-y-4 bg-black/60 p-6 border border-cyan-500/30 rounded-sm backdrop-blur-md">
      <div className="flex justify-between items-center border-b border-cyan-900/40 pb-3">
        <h2 className="text-lg font-black text-cyan-400 uppercase tracking-widest italic">Sequence Editor: {macro.name}</h2>
        <div className="flex space-x-2">
          <button onClick={onCancel} className="px-4 py-1 text-[10px] font-bold text-slate-500 hover:text-white uppercase">Cancel</button>
          <button onClick={() => onSave(editedMacro)} className="px-6 py-1 bg-cyan-600 text-white text-[10px] font-black rounded-sm uppercase shadow-[0_0_15px_rgba(34,211,238,0.3)]">Save Sequence</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] text-slate-500 uppercase font-bold">Macro Name</label>
            <input 
              value={editedMacro.name}
              onChange={e => setEditedMacro({...editedMacro, name: e.target.value})}
              className="w-full bg-slate-900 border border-cyan-900/40 p-2 text-xs text-cyan-100 outline-none focus:border-cyan-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-slate-500 uppercase font-bold">Trigger Type</label>
            <select 
              value={editedMacro.trigger}
              onChange={e => setEditedMacro({...editedMacro, trigger: e.target.value as any})}
              className="w-full bg-slate-900 border border-cyan-900/40 p-2 text-xs text-cyan-100 outline-none focus:border-cyan-400"
            >
              <option value="command">VOICE_COMMAND</option>
              <option value="schedule">SCHEDULED</option>
              <option value="event">SYSTEM_EVENT</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Execution Steps</h3>
            <button onClick={addStep} className="text-[10px] text-cyan-500 font-bold hover:underline">+ ADD STEP</button>
          </div>
          
          <div className="space-y-2">
            {editedMacro.steps.map((step, index) => (
              <div key={step.id} className="p-3 bg-slate-900/40 border border-cyan-900/20 rounded-sm flex items-center space-x-3 group">
                <span className="text-[10px] font-black text-cyan-800 w-4">{index + 1}</span>
                
                <select 
                  value={step.type}
                  onChange={e => updateStep(step.id, { type: e.target.value as any })}
                  className="bg-black border border-cyan-900/40 text-[10px] p-1 text-cyan-400 outline-none"
                >
                  <option value="OPEN_URL">OPEN_URL</option>
                  <option value="CLICK">CLICK</option>
                  <option value="TYPE">TYPE</option>
                  <option value="WAIT">WAIT</option>
                  <option value="SCREEN_CAPTURE">SCREEN_CAPTURE</option>
                  <option value="UI_ANALYSIS">UI_ANALYSIS</option>
                  <option value="SWITCH_ACCOUNT">SWITCH_ACCOUNT</option>
                  <option value="CLOSE_TAB">CLOSE_TAB</option>
                </select>

                <input 
                  value={step.value}
                  onChange={e => updateStep(step.id, { value: e.target.value })}
                  placeholder="Value / Target"
                  className="flex-1 bg-black border border-cyan-900/40 text-[10px] p-1 text-slate-300 outline-none"
                />

                <div className="flex items-center space-x-1">
                  <input 
                    type="number"
                    value={step.delayMs}
                    onChange={e => updateStep(step.id, { delayMs: parseInt(e.target.value) })}
                    className="w-12 bg-black border border-cyan-900/40 text-[10px] p-1 text-slate-500 outline-none"
                  />
                  <span className="text-[8px] text-slate-700 uppercase">ms</span>
                </div>

                <button onClick={() => removeStep(step.id)} className="text-slate-700 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacroEditor;
