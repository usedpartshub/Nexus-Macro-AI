
import React, { useState } from 'react';
import { EmailIdentity } from '../types';

const EmailRotator: React.FC = () => {
  const [identities, setIdentities] = useState<EmailIdentity[]>(
    Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 1}`,
      email: `marketing.agent.${i + 1}@nexusvault.io`,
      provider: i % 3 === 0 ? 'chatgpt' : i % 3 === 1 ? 'grok' : 'gemini',
      isActive: i === 0,
      usageCount: Math.floor(Math.random() * 50)
    }))
  );

  const rotate = (id: string) => {
    setIdentities(prev => prev.map(ident => ({
      ...ident,
      isActive: ident.id === id
    })));
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold tracking-tighter uppercase">Marketing Agent Rotator</h2>
        <div className="text-[10px] text-cyan-600 font-bold px-2 py-1 bg-cyan-950 rounded border border-cyan-900">
          20 IDENTITIES PROTECTED
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 overflow-y-auto pr-2 custom-scrollbar">
        {identities.map(ident => (
          <div 
            key={ident.id} 
            onClick={() => rotate(ident.id)}
            className={`p-3 rounded border transition-all cursor-pointer flex flex-col justify-between h-24 ${
              ident.isActive 
                ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                : 'bg-slate-950/50 border-cyan-900/30 opacity-60 hover:opacity-100 hover:border-cyan-700'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-bold uppercase text-slate-500">#{ident.id}</span>
              <span className={`text-[8px] px-1 rounded font-bold uppercase ${
                ident.provider === 'grok' ? 'bg-pink-500/20 text-pink-400' : 
                ident.provider === 'chatgpt' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {ident.provider}
              </span>
            </div>
            <div className="text-[10px] font-mono truncate mb-1">{ident.email}</div>
            <div className="flex justify-between items-center">
               <span className="text-[9px] text-slate-600">USED: {ident.usageCount}x</span>
               {ident.isActive && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-slate-900 border border-cyan-900/50 rounded flex justify-between items-center">
         <div className="text-[10px] italic text-cyan-700">Rotating agents resets cookie headers and finger-printing profiles automatically.</div>
         <button className="px-6 py-1.5 bg-pink-600/20 border border-pink-500/50 rounded text-[10px] font-bold uppercase text-pink-400 hover:bg-pink-500/30">Force Immediate Rotation</button>
      </div>
    </div>
  );
};

export default EmailRotator;
