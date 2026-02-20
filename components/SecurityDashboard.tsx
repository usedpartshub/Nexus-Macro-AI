
import React from 'react';
import { SensorData } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SecurityDashboardProps {
  sensors: SensorData;
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ sensors }) => {
  // Mock data for historical visualization
  const data = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    mag: 30 + Math.random() * 10,
    rf: -60 + Math.random() * 5
  }));

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-slate-950 border border-cyan-900 rounded flex flex-col items-center">
          <span className="text-[10px] text-cyan-700 font-bold uppercase mb-2">Magnetometer</span>
          <span className="text-2xl font-bold">{sensors.magnetometer.toFixed(1)} <span className="text-xs opacity-50">μT</span></span>
        </div>
        <div className="p-4 bg-slate-950 border border-cyan-900 rounded flex flex-col items-center">
          <span className="text-[10px] text-cyan-700 font-bold uppercase mb-2">RF Signature</span>
          <span className="text-2xl font-bold">{sensors.rfLevel.toFixed(1)} <span className="text-xs opacity-50">dBm</span></span>
        </div>
        <div className="p-4 bg-slate-950 border border-cyan-900 rounded flex flex-col items-center">
          <span className="text-[10px] text-cyan-700 font-bold uppercase mb-2">Integrity Status</span>
          <span className={`text-xl font-bold ${sensors.tamperLevel === 'high' ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
            {sensors.tamperLevel.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex-1 bg-black/40 rounded border border-cyan-900/30 p-2">
        <h4 className="text-[10px] font-bold text-cyan-700 uppercase mb-4 px-2">Real-time Interference Log</h4>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#020617', border: '1px solid #164e63', fontSize: '10px' }}
              itemStyle={{ color: '#22d3ee' }}
            />
            <Line type="monotone" dataKey="mag" stroke="#22d3ee" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="rf" stroke="#ec4899" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 h-32">
         <div className="bg-slate-950 border border-cyan-900 rounded p-3 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-cyan-700 uppercase">SMTP Tunnel Payload</span>
            <div className="font-mono text-[10px] text-slate-500 overflow-hidden leading-tight">
               POST /v1/alert HTTP/1.1<br/>
               Host: vault.nexus.local<br/>
               X-Payload-Sign: 8f92e...<br/>
               [SENSORS_CRITICAL_SPIKE]
            </div>
         </div>
         <div className="bg-slate-950 border border-cyan-900 rounded p-3 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-cyan-700 uppercase">VM Macro Status</span>
            <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs">SSH Link Active (UserLAnd)</span>
            </div>
            <button className="text-[10px] bg-cyan-900/40 py-1 rounded text-cyan-300">TRIGGER MACRO SYNC</button>
         </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
