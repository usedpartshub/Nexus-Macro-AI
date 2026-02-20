
import React, { useEffect, useRef } from 'react';

interface ConsoleProps {
  logs: { time: string; msg: string; type: 'info' | 'warn' | 'error' | 'nexus' }[];
}

const Console: React.FC<ConsoleProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 p-2 font-mono text-xs custom-scrollbar">
      {logs.map((log, i) => (
        <div key={i} className="flex space-x-2 animate-in fade-in slide-in-from-left-2 duration-300">
          <span className="text-cyan-900">[{log.time}]</span>
          <span className={`
            ${log.type === 'nexus' ? 'text-cyan-400 font-bold' : ''}
            ${log.type === 'warn' ? 'text-yellow-500' : ''}
            ${log.type === 'error' ? 'text-red-500 font-bold blink' : ''}
            ${log.type === 'info' ? 'text-slate-400' : ''}
          `}>
            {log.type === 'nexus' ? '>> ' : ''}{log.msg}
          </span>
        </div>
      ))}
      {logs.length === 0 && <div className="text-cyan-900 italic">Initializing core systems...</div>}
    </div>
  );
};

export default Console;
