
import React from 'react';
import { NexusStatus } from '../types';

interface NexusAvatarProps {
  status: NexusStatus;
}

const NexusAvatar: React.FC<NexusAvatarProps> = ({ status }) => {
  const isListening = status === NexusStatus.LISTENING;
  const isThinking = status === NexusStatus.THINKING;
  const isExecuting = status === NexusStatus.EXECUTING;

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Outer Energy Field */}
      <div className={`absolute inset-0 rounded-full border border-cyan-500/20 transition-all duration-1000 ${
        isListening ? 'scale-110 opacity-100' : 'scale-100 opacity-40'
      }`} />
      
      {/* The Visual Presence */}
      <div className="relative w-56 h-56 rounded-full overflow-hidden neon-border z-10">
        <img 
          src="https://images.unsplash.com/photo-1614728263952-84ea206f9c45?q=80&w=1000&auto=format&fit=crop" 
          alt="NEXus Presence"
          className={`w-full h-full object-cover transition-all duration-700 ${
            isListening ? 'brightness-125 saturate-150' : 
            isThinking ? 'brightness-75 grayscale-[0.5] blur-[2px]' : 
            'brightness-90 contrast-110'
          }`}
        />
        
        {/* Overlay Gradients */}
        <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60`} />
        
        {/* Voice Activity Layer */}
        {isListening && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-full border-[8px] border-cyan-500/30 animate-pulse rounded-full" />
          </div>
        )}
      </div>

      {/* Orbital Data Rings */}
      <div className={`absolute w-full h-full border-t-2 border-cyan-400/20 rounded-full animate-spin-slow z-0`} />
      <div className={`absolute w-[110%] h-[110%] border-b-2 border-pink-500/10 rounded-full animate-reverse-spin z-0`} />

      <div className="absolute -bottom-12 left-0 right-0 text-center flex flex-col items-center">
        <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${
          isListening ? 'text-cyan-400' : 
          isThinking ? 'text-pink-500' : 
          isExecuting ? 'text-green-500' : 'text-slate-600'
        }`}>
          {status === NexusStatus.IDLE ? 'Awaiting Interaction' : `NEXus ${status}`}
        </span>
        <div className="mt-2 flex space-x-1">
          <div className={`w-1 h-1 rounded-full ${isListening ? 'bg-cyan-500 animate-bounce' : 'bg-slate-800'}`} />
          <div className={`w-1 h-1 rounded-full ${isListening ? 'bg-cyan-500 animate-bounce [animation-delay:0.1s]' : 'bg-slate-800'}`} />
          <div className={`w-1 h-1 rounded-full ${isListening ? 'bg-cyan-500 animate-bounce [animation-delay:0.2s]' : 'bg-slate-800'}`} />
        </div>
        <div className="mt-4 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
           <span className="text-[7px] font-black text-green-500 uppercase tracking-[0.3em]">Hands-Free Persistence Active</span>
        </div>
      </div>
    </div>
  );
};

export default NexusAvatar;
