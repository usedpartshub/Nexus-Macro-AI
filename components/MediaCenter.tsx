import React, { useState } from 'react';

interface MediaResult {
  id: string;
  title: string;
  source: string;
  type: 'movie' | 'educational' | 'document';
  url: string;
}

const MediaCenter: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaResult[]>([]);
  const [activeMedia, setActiveMedia] = useState<MediaResult | null>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setSearching(true);
    
    // Simulate searching free open-source APIs (PubMed, Wayback, OpenMedia)
    setTimeout(() => {
      const mockResults: MediaResult[] = [
        { id: '1', title: `${query} - Wayback Archive`, source: 'Wayback Machine', type: 'educational', url: 'https://archive.org' },
        { id: '2', title: `${query} - Open Access Study`, source: 'PubMed Open', type: 'document', url: 'https://pubmed.ncbi.nlm.nih.gov' },
        { id: '3', title: `${query} - Public Domain Feature`, source: 'OpenMedia API', type: 'movie', url: 'https://picsum.photos/1920/1080' },
      ];
      setResults(mockResults);
      setSearching(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center border-b border-cyan-900/30 pb-4">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold tracking-tighter uppercase text-cyan-400">Nexus Media Center</h2>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest">Free Open-Source Content Engine</span>
        </div>
        <div className="flex space-x-2">
           <input 
             value={query}
             onChange={e => setQuery(e.target.value)}
             onKeyDown={e => e.key === 'Enter' && handleSearch()}
             placeholder="SEARCH MOVIES / ARCHIVES / PUBMED"
             className="bg-slate-900 border border-cyan-900 rounded px-3 py-1 text-[10px] w-64 focus:border-cyan-400 outline-none text-cyan-100"
           />
           <button 
             onClick={handleSearch}
             className="bg-cyan-600/20 border border-cyan-500 px-4 py-1 rounded text-[10px] font-bold text-cyan-400 hover:bg-cyan-500/30 transition-all"
           >
             {searching ? 'SEARCHING...' : 'DISCOVER'}
           </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        <div className="col-span-12 lg:col-span-8 bg-black/40 border border-cyan-900/20 rounded-sm overflow-hidden flex flex-col items-center justify-center relative">
          {activeMedia ? (
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 bg-black flex items-center justify-center">
                 <img 
                   src={activeMedia.url} 
                   alt="Media Placeholder" 
                   className="max-w-full max-h-full object-contain opacity-60"
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                       <svg className="w-8 h-8 text-cyan-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M8 5v14l11-7z" />
                       </svg>
                    </div>
                 </div>
              </div>
              <div className="p-4 bg-slate-900/60 border-t border-cyan-900/40 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold text-cyan-100">{activeMedia.title}</h3>
                  <span className="text-[8px] text-slate-500 uppercase font-bold">Source: {activeMedia.source}</span>
                </div>
                <button onClick={() => setActiveMedia(null)} className="text-[9px] text-slate-500 hover:text-white uppercase font-bold">Close Player</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 opacity-20">
              <svg className="w-20 h-20 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] uppercase tracking-[0.3em] font-black">Media Player Standby</span>
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-3 overflow-hidden">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Search Results</h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {results.map(res => (
              <div 
                key={res.id} 
                onClick={() => setActiveMedia(res)}
                className="p-3 bg-slate-950 border border-cyan-900/30 rounded-sm hover:border-cyan-400/50 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-cyan-100 group-hover:text-cyan-400 transition-colors">{res.title}</span>
                  <span className="text-[7px] px-1.5 py-0.5 bg-cyan-900/20 text-cyan-600 rounded uppercase font-bold">{res.type}</span>
                </div>
                <span className="text-[8px] text-slate-600 uppercase font-bold">{res.source}</span>
              </div>
            ))}
            {results.length === 0 && !searching && (
              <div className="text-[9px] text-slate-700 italic text-center py-12 uppercase tracking-widest">No content indexed.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCenter;
