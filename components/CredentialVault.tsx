
import React, { useState } from 'react';
import { Credential } from '../types';

interface CredentialVaultProps {
  addLog: (m: string, t: any) => void;
}

const CredentialVault: React.FC<CredentialVaultProps> = ({ addLog }) => {
  const [creds, setCreds] = useState<Credential[]>([
    { id: '1', platform: 'Facebook', username: 'john_entrepreneur', passwordEncrypted: '********', totpSecret: 'F92A 11BB' },
    { id: '2', platform: 'X (Twitter)', username: 'writingmate_dev', passwordEncrypted: '********' },
    { id: '3', platform: 'Bank of S25', username: 'vault_master', passwordEncrypted: '********' },
    { id: '4', platform: 'Grok Free Access', username: 'rotator_1@vault.net', passwordEncrypted: '********' },
  ]);

  const [showAdd, setShowAdd] = useState(false);

  const handleUse = (platform: string) => {
    addLog(`NEXus: Injecting credentials for ${platform}...`, 'nexus');
    addLog(`System: Automating login sequence with 2500ms jitter delay.`, 'info');
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold tracking-tighter uppercase">NEXus Platform Vault</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-cyan-600/20 border border-cyan-500 px-4 py-1 rounded text-xs hover:bg-cyan-500/30">
          + ADD IDENTITY
        </button>
      </div>

      {showAdd && (
        <div className="p-4 bg-slate-950 border border-cyan-500/40 rounded-lg space-y-3 animate-in fade-in zoom-in-95">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Platform (e.g. Facebook)" className="bg-slate-900 border border-cyan-900 rounded p-2 text-xs" />
            <input type="text" placeholder="Username" className="bg-slate-900 border border-cyan-900 rounded p-2 text-xs" />
            <input type="password" placeholder="Password" className="bg-slate-900 border border-cyan-900 rounded p-2 text-xs" />
            <input type="text" placeholder="TOTP Secret (Optional)" className="bg-slate-900 border border-cyan-900 rounded p-2 text-xs" />
          </div>
          <button className="w-full bg-cyan-600/40 py-2 rounded text-xs font-bold uppercase">Save Encrypted</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {creds.map(c => (
          <div key={c.id} className="p-4 bg-slate-950/50 border border-cyan-900/30 rounded-lg flex justify-between items-center group hover:border-cyan-500/40 transition-all">
            <div className="space-y-1">
              <div className="text-sm font-bold text-cyan-200">{c.platform}</div>
              <div className="text-[10px] text-slate-500 font-mono uppercase">{c.username}</div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleUse(c.platform)}
                className="px-4 py-1.5 bg-cyan-900/20 border border-cyan-900 rounded text-[10px] uppercase hover:bg-cyan-500/20 hover:text-cyan-400 transition-all"
              >
                Log Me In
              </button>
              <button className="p-1.5 border border-cyan-900 rounded opacity-50 hover:opacity-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CredentialVault;
