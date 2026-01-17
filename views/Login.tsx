
import React from 'react';
import { ShieldCheck, User, Briefcase, Sparkles } from 'lucide-react';
import HolographicCard from '../components/HolographicCard';

interface Props {
  onUserStart: () => void;
  onCounsellorStart: () => void;
}

const Login: React.FC<Props> = ({ onUserStart, onCounsellorStart }) => {
  return (
    <div className="h-full flex flex-col justify-center max-w-md mx-auto p-6 space-y-12 animate-in fade-in duration-1000">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="absolute -inset-2 bg-cyan-500/20 blur-xl rounded-full" />
              <div className="relative w-10 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                <ShieldCheck className="text-cyan-400 w-5 h-5" />
              </div>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.8]">
              Dost
            </h1>
            <div className="flex items-center gap-2 mt-2 ml-1">
              <div className="w-4 h-1 bg-cyan-400 rounded-full" />
              <span className="text-cyan-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] italic opacity-90 whitespace-nowrap">
                you are not alone
              </span>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm font-light leading-relaxed max-w-[280px] pt-2">
            Step into your private neural sanctuary. A space designed for clarity, healing, and connection.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* User Dashboard Selection */}
        <button 
          onClick={onUserStart}
          className="group relative p-7 text-left bg-white/5 border border-white/5 rounded-[2.5rem] hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-500 active:scale-[0.97] overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <User size={20} className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
                <span className="text-xl font-black text-white uppercase tracking-tight italic">User Dashboard</span>
              </div>
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">Entry to Wellness Hub</p>
            </div>
            <div className="w-10 h-10 rounded-2xl border border-white/10 flex items-center justify-center group-hover:border-cyan-400/50 group-hover:bg-cyan-400/10 transition-all duration-500">
              <Sparkles size={16} className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </button>

        {/* Counsellor Dashboard Selection */}
        <button 
          onClick={onCounsellorStart}
          className="group relative p-7 text-left bg-white/5 border border-white/5 rounded-[2.5rem] hover:bg-white/10 hover:border-fuchsia-400/30 transition-all duration-500 active:scale-[0.97] overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/5 to-fuchsia-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Briefcase size={20} className="text-gray-500 group-hover:text-fuchsia-400 transition-colors" />
                <span className="text-xl font-black text-white uppercase tracking-tight italic">Counsellor Portal</span>
              </div>
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">Expert Verification</p>
            </div>
            <div className="w-10 h-10 rounded-2xl border border-white/10 flex items-center justify-center group-hover:border-fuchsia-400/50 group-hover:bg-fuchsia-400/10 transition-all duration-500">
              <ShieldCheck size={16} className="text-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </button>
      </div>

      <div className="flex flex-col items-center gap-2 text-gray-700 pt-6">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em]">
          <Sparkles size={14} className="text-cyan-400" /> Neural Sanctuary v4.2
        </div>
        <p className="text-[8px] font-bold text-gray-800 uppercase tracking-widest text-center">Secure handshake encryption active.</p>
      </div>
    </div>
  );
};

export default Login;
