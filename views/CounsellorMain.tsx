
import React from 'react';
import { LogOut, ShieldCheck, User, Sparkles } from 'lucide-react';

interface Props {
  name: string;
  onLogout: () => void;
}

const CounsellorMain: React.FC<Props> = ({ name, onLogout }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-1000 p-8 relative">
      {/* Top Header Bar */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center bg-black/40 backdrop-blur-2xl border border-white/5 p-4 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-fuchsia-500/20 border border-fuchsia-500/40 rounded-xl flex items-center justify-center text-fuchsia-400 shadow-[0_0_15px_rgba(192,38,211,0.3)]">
            <User size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-black text-white uppercase tracking-widest leading-none mb-1">
              {name || 'Specialist'}
            </span>
            <div className="flex items-center gap-1 text-[8px] font-bold text-fuchsia-400 uppercase tracking-widest">
              <Sparkles size={8} /> Active Protocol
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-gray-500 uppercase tracking-widest">
            <ShieldCheck size={10} /> Identity Verified
          </div>
          <button 
            onClick={onLogout}
            className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center gap-2 group"
          >
            <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest group-hover:translate-x-[-2px] transition-transform">Logout</span>
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="absolute -inset-10 bg-fuchsia-500/10 blur-[80px] rounded-full animate-pulse" />
          <h1 className="relative text-6xl md:text-9xl font-black tracking-tighter text-white uppercase italic leading-none opacity-90 drop-shadow-2xl">
            Expert <br /> 
            <span className="text-fuchsia-500">Center</span>
          </h1>
        </div>
        <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent mx-auto rounded-full mt-4" />
        <p className="text-gray-700 text-xs font-black uppercase tracking-[1em] mt-12 animate-pulse">
          Command State: Verified
        </p>
      </div>
      
      {/* Structural Watermark */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-[0.015] pointer-events-none select-none">
        <div className="text-[25rem] font-black tracking-tighter text-white">COMMAND</div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl px-4">
        {[
          { label: 'Patient Queue', value: '08', color: 'text-cyan-400' },
          { label: 'Sessions Today', value: '12', color: 'text-fuchsia-400' },
          { label: 'Trust Rating', value: '4.9', color: 'text-yellow-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/5 backdrop-blur-lg p-6 rounded-[2rem] text-center group hover:bg-white/10 transition-all">
            <div className={`text-4xl font-black ${stat.color} mb-1 tracking-tighter group-hover:scale-110 transition-transform`}>{stat.value}</div>
            <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounsellorMain;