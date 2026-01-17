
import React from 'react';
import { 
  ArrowLeft, Brain, CheckCircle2, AlertTriangle, ArrowRight, 
  Wind, Moon, Sun, ZapIcon, Sparkles, Activity, ShieldCheck,
  ClipboardList, Heart
} from 'lucide-react';
import { AIRecommendation, AppTab } from '../types';
import HolographicCard from '../components/HolographicCard';

interface Props {
  results: AIRecommendation | null;
  onBack: () => void;
  navigateTo: (tab: AppTab) => void;
}

const ResultsView: React.FC<Props> = ({ results, onBack, navigateTo }) => {
  if (!results) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
        <Activity size={48} className="text-gray-700 animate-pulse" />
        <h2 className="text-2xl font-black text-gray-600 uppercase tracking-widest">No Active Protocol</h2>
        <button onClick={onBack} className="text-cyan-400 font-black uppercase text-xs tracking-[0.2em] border-b border-cyan-400/20 pb-1">Return to Hub</button>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-1000 space-y-10 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-all group"
        >
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/30 group-hover:bg-white/10 transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Return to Hub</span>
        </button>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-lime-400/10 border border-lime-400/20 rounded-full text-lime-400 text-[9px] font-black uppercase tracking-widest">
          <ShieldCheck size={14} /> Scan Complete
        </div>
      </div>

      {/* Hero */}
      <div className="space-y-4 text-center px-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-[60px] rounded-full animate-pulse" />
            <div className="relative w-24 h-24 bg-black/40 border border-white/10 rounded-[2.5rem] flex items-center justify-center text-cyan-400 shadow-2xl backdrop-blur-3xl">
              <Brain size={48} />
            </div>
          </div>
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
          Neural <span className="text-cyan-400">Strategy.</span>
        </h1>
        <p className="text-gray-500 text-xs font-black uppercase tracking-[0.4em]">Personalized Wellness Protocol</p>
      </div>

      <div className="grid grid-cols-1 gap-8 px-2 max-w-3xl mx-auto w-full">
        
        {/* Wellness Protocol Brief (requested textbox) */}
        <HolographicCard className="p-0 border-none bg-zinc-900/80 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <ClipboardList size={80} />
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-400/10 flex items-center justify-center text-lime-400">
                <Sparkles size={20} />
              </div>
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">Wellness Protocol Brief</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 border border-white/5 p-6 rounded-[2rem]">
               <div className="space-y-1">
                 <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Severity Index</span>
                 <div className={`text-2xl font-black uppercase italic ${results.shouldSeeTherapist ? 'text-red-400' : 'text-lime-400'}`}>
                    {results.severityLabel}
                 </div>
               </div>
               <div className="space-y-1">
                 <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Counselor Status</span>
                 <div className={`text-2xl font-black uppercase italic ${results.shouldSeeTherapist ? 'text-red-400' : 'text-gray-400'}`}>
                    {results.shouldSeeTherapist ? 'Referral Advised' : 'Self-Care Mode'}
                 </div>
               </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 font-light text-base leading-relaxed border-l-2 border-white/10 pl-6 py-2">
                {results.predictionReasoning}
              </p>
              
              {results.shouldSeeTherapist && (
                <button 
                  onClick={() => navigateTo(AppTab.COUNSELORS)} 
                  className="flex items-center gap-2 text-cyan-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors"
                >
                  Locate Specialists <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </HolographicCard>

        {/* Habits */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 px-2">
             <div className="w-8 h-8 rounded-lg bg-fuchsia-400/10 flex items-center justify-center text-fuchsia-400">
               <Heart size={16} />
             </div>
             <h3 className="text-[10px] font-black uppercase text-fuchsia-400 tracking-[0.4em]">Neural Rewiring: Daily Habits</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.microHabits.map((habit, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 hover:border-fuchsia-400/40 transition-all group flex flex-col justify-between h-full">
                   <div>
                     <div className="w-10 h-10 rounded-2xl bg-fuchsia-400/10 flex items-center justify-center text-fuchsia-400 mb-4 group-hover:scale-110 transition-transform">
                         {habit.category.toLowerCase().includes('sleep') ? <Moon size={20}/> : habit.category.toLowerCase().includes('sun') ? <Sun size={20}/> : <ZapIcon size={20}/>}
                     </div>
                     <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2 italic">{habit.title}</h4>
                     <p className="text-[10px] text-gray-500 leading-relaxed mb-4">{habit.description}</p>
                   </div>
                   <div className="text-[8px] font-black text-fuchsia-400 uppercase tracking-[0.2em]">{habit.category}</div>
                </div>
              ))}
           </div>
        </div>

        {/* Breathing */}
        <div className="space-y-4 pb-12">
           <div className="flex items-center gap-2 px-2">
             <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center text-cyan-400">
               <Wind size={16} />
             </div>
             <h3 className="text-[10px] font-black uppercase text-cyan-400 tracking-[0.4em]">Physiological State Resets</h3>
           </div>
           <div className="space-y-3">
              {results.breathingExercises.map((ex, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between group hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-cyan-400/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:rotate-12 transition-transform">
                      <Wind size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white italic uppercase leading-none mb-1">{ex.title}</h4>
                      <p className="text-xs text-gray-500 font-light">{ex.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{ex.duration}</span>
                     <button 
                      onClick={() => navigateTo(AppTab.ACTIVITIES)}
                      className="px-6 py-2 bg-cyan-400 text-black font-black text-[9px] uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                     >
                       Launch
                     </button>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Return Button */}
        <div className="flex justify-center pt-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-[2rem] text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 shadow-2xl"
          >
            <ArrowLeft size={16} /> Finalize & Return to Hub
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
