
import React from 'react';
import { NexusStatus } from '../types';

interface VoiceIndicatorProps {
  status: NexusStatus;
  onClick: () => void;
}

const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({ status, onClick }) => {
  const isListening = status === NexusStatus.LISTENING;

  return (
    <button 
      onClick={onClick}
      className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
        isListening ? 'border-cyan-400 bg-cyan-400/20 scale-110' : 'border-cyan-900 bg-slate-950'
      }`}
    >
      {isListening && (
        <>
          <span className="absolute inset-0 rounded-full border border-cyan-400 animate-ping" />
          <span className="absolute inset-[-4px] rounded-full border border-cyan-400/30 animate-ping [animation-delay:200ms]" />
        </>
      )}
      <svg className={`w-6 h-6 ${isListening ? 'text-cyan-400' : 'text-cyan-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    </button>
  );
};

export default VoiceIndicator;
