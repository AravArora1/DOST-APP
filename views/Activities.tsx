
import React, { useState, useEffect } from 'react';
import { Wind, BookOpen, Heart, Droplets, Trophy, Gift, Sparkles, Cloud, ShieldCheck, Trash2, Calendar, CheckCircle2 } from 'lucide-react';
import HolographicCard from '../components/HolographicCard';

interface JournalEntry {
  id: string;
  text: string;
  timestamp: Date;
}

const Activities: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'journal' | 'meditation' | 'hydration' | 'rewards'>('breathing');
  const [breathingState, setBreathingState] = useState<'idle' | 'in' | 'out'>('idle');
  const [journalText, setJournalText] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [saveAnim, setSaveAnim] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dost_entries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEntries(parsed.map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) })));
      } catch (e) {
        console.error("Failed to load entries", e);
      }
    }
  }, []);

  const saveJournal = () => {
    if (!journalText.trim()) return;
    setSaveAnim(true);
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      text: journalText,
      timestamp: new Date(),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('dost_entries', JSON.stringify(updated));
    setTimeout(() => {
      setJournalText('');
      setSaveAnim(false);
    }, 1500);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('dost_entries', JSON.stringify(updated));
  };

  const navItems = [
    { id: 'breathing', icon: Wind, label: 'Breath' },
    { id: 'journal', icon: BookOpen, label: 'Write' },
    { id: 'meditation', icon: Cloud, label: 'Stillness' },
    { id: 'hydration', icon: Droplets, label: 'Fluid' },
    { id: 'rewards', icon: Trophy, label: 'Store' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'journal':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
             <HolographicCard className="p-0 border-none bg-black/40 rounded-[2.5rem]">
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-fuchsia-500/10 rounded-2xl flex items-center justify-center text-fuchsia-400 border border-fuchsia-500/20 shadow-xl">
                      <BookOpen size={28} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tighter">Shadow Journal</h3>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Archiving for +40 XP</p>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea 
                      value={journalText}
                      onChange={(e) => setJournalText(e.target.value)}
                      disabled={saveAnim}
                      placeholder="Release your thoughts into the digital vault..."
                      className={`w-full h-48 bg-white/5 border border-white/5 rounded-[2rem] p-8 text-xl font-light text-white focus:outline-none focus:border-fuchsia-400/50 transition-all placeholder:text-gray-700 no-scrollbar resize-none ${saveAnim ? 'opacity-30 scale-95' : ''}`}
                    />
                    {saveAnim && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-fuchsia-400 animate-in zoom-in-90 duration-300">
                         <CheckCircle2 size={48} className="animate-bounce" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Entry Securely Archived</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                       <ShieldCheck className="text-lime-400" size={14} /> End-to-End Encryption
                    </span>
                    <button 
                      onClick={saveJournal}
                      disabled={saveAnim || !journalText.trim()}
                      className="px-8 py-4 bg-fuchsia-500 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(192,38,211,0.2)] hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
                    >
                      Save Memory
                    </button>
                  </div>
                </div>
             </HolographicCard>

             <div className="space-y-4 pb-20 px-2">
                <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">Historical Reflections ({entries.length})</h4>
                {entries.length === 0 ? (
                  <div className="p-16 text-center border-2 border-dashed border-white/5 rounded-[3rem] text-gray-700 font-bold uppercase text-xs tracking-widest">
                    The vault is silent.
                  </div>
                ) : (
                  entries.map(entry => (
                    <HolographicCard key={entry.id} className="p-0 border-white/5 bg-white/[0.02] overflow-hidden rounded-3xl">
                      <div className="p-6">
                         <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 text-[9px] font-black text-fuchsia-400 uppercase tracking-widest">
                              <Calendar size={12} /> {entry.timestamp.toLocaleDateString()} at {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <button onClick={() => deleteEntry(entry.id)} className="text-gray-600 hover:text-red-400 transition-colors p-2">
                              <Trash2 size={14} />
                            </button>
                         </div>
                         <p className="text-gray-400 font-light text-sm leading-relaxed">{entry.text}</p>
                      </div>
                    </HolographicCard>
                  ))
                )}
             </div>
          </div>
        );
      case 'breathing':
        return (
          <HolographicCard className="flex-1 min-h-[480px] bg-gradient-to-br from-cyan-500/5 to-transparent">
            <div className="h-full flex flex-col items-center justify-center gap-12 text-center py-12 px-6">
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tighter text-white">Vagal Nerve Tone</h2>
                <p className="text-gray-400 text-sm font-light max-w-sm leading-relaxed">Box breathing cycles reset the nervous system and clear cortisol.</p>
              </div>
              <div className="relative">
                <div className={`w-64 h-64 rounded-full border border-cyan-400/20 flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${
                  breathingState === 'in' ? 'scale-125 border-cyan-400 bg-cyan-400/5 shadow-[0_0_100px_rgba(34,211,238,0.2)]' : 
                  breathingState === 'out' ? 'scale-100 border-fuchsia-400 bg-fuchsia-400/5 shadow-[0_0_100px_rgba(192,38,211,0.2)]' : ''
                }`}>
                  <Wind className={`w-20 h-20 transition-colors duration-1000 ${breathingState === 'in' ? 'text-cyan-400' : breathingState === 'out' ? 'text-fuchsia-400' : 'text-white/10'}`} />
                </div>
                {breathingState !== 'idle' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black italic uppercase tracking-widest text-white drop-shadow-2xl">{breathingState}</span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => {
                  setBreathingState('in');
                  setTimeout(() => setBreathingState('out'), 4000);
                  setTimeout(() => setBreathingState('idle'), 8000);
                }}
                disabled={breathingState !== 'idle'}
                className="px-12 py-5 bg-white text-black font-black rounded-2xl transition-all shadow-2xl active:scale-95 disabled:opacity-30 text-xs uppercase tracking-[0.2em]"
              >
                Sync Breath (+25 XP)
              </button>
            </div>
          </HolographicCard>
        );
      case 'hydration':
        return (
          <HolographicCard className="min-h-[480px] bg-gradient-to-br from-blue-500/5 to-transparent">
             <div className="h-full flex flex-col items-center justify-center gap-12 text-center py-12 px-8">
                <div className="relative">
                   <Droplets className="text-blue-400 w-32 h-32 animate-pulse" />
                   <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full -z-10" />
                </div>
                <div className="space-y-4">
                   <h3 className="text-4xl font-black tracking-tighter text-white">Molecular Clarity</h3>
                   <p className="text-gray-400 text-sm font-light leading-relaxed">Brain hydration directly correlates with emotional cognitive load capacity.</p>
                </div>
                <div className="flex gap-4">
                   {[1,2,3,4,5,6,7,8].map(i => (
                     <div key={i} className={`w-4 h-12 rounded-xl border-2 transition-all duration-1000 ${i <= 5 ? 'bg-blue-500/40 border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.5)]' : 'border-white/5 bg-white/[0.02]'}`} />
                   ))}
                </div>
                <button className="px-12 py-5 bg-blue-500 text-white font-black rounded-2xl shadow-2xl active:scale-95 transition-all text-xs uppercase tracking-widest">
                  Drink 250ml (+10 XP)
                </button>
             </div>
          </HolographicCard>
        );
      case 'meditation':
        return (
          <HolographicCard className="min-h-[480px] bg-gradient-to-br from-cyan-500/5 to-transparent">
             <div className="h-full flex flex-col items-center justify-center gap-12 text-center py-12 px-8">
                <Cloud className="text-cyan-400 w-24 h-24 animate-bounce duration-[12000ms]" />
                <div className="space-y-4">
                   <h3 className="text-4xl font-black tracking-tighter text-white">Zen Core Engine</h3>
                   <p className="text-gray-400 text-sm font-light leading-relaxed">Stillness allows the mind to defragment daily sensory input.</p>
                </div>
                <div className="flex gap-4">
                   {[1,2,3,4,5].map(i => (
                     <div key={i} className={`w-4 h-4 rounded-full transition-all duration-1000 ${i === 1 ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]' : 'bg-white/5'}`} />
                   ))}
                </div>
                <button className="px-12 py-5 bg-cyan-500 text-black font-black rounded-2xl shadow-2xl active:scale-95 transition-all text-xs uppercase tracking-widest">
                  Begin Zen Session (+50 XP)
                </button>
             </div>
          </HolographicCard>
        );
      case 'rewards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {[
              { title: 'Zomato Pro', desc: '50% Off Healthy Meals', cost: '2500 XP', color: 'bg-red-500/10 text-red-400', border: 'border-red-500/20' },
              { title: 'Spotify Premium', desc: '1 Month Focus Focus', cost: '5000 XP', color: 'bg-green-500/10 text-green-400', border: 'border-green-500/20' },
              { title: 'Cult.fit Pass', desc: '1 Week Mindfulness/Therapy', cost: '1500 XP', color: 'bg-orange-500/10 text-orange-400', border: 'border-orange-500/20' },
              { title: 'Dost AI Pro', desc: 'Infinite Voice Support', cost: '1000 XP', color: 'bg-cyan-500/10 text-cyan-400', border: 'border-cyan-500/20' },
            ].map((reward, i) => (
              <HolographicCard key={i} className={`p-0 ${reward.border} min-h-[220px]`}>
                <div className="p-8 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${reward.color} border border-current opacity-70`}>Partner Reward</div>
                      <Gift size={18} className="text-white/10" />
                    </div>
                    <h4 className="text-2xl font-black text-white">{reward.title}</h4>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">{reward.desc}</p>
                  </div>
                  <button className="mt-6 w-full py-3 bg-white text-black font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all shadow-xl active:scale-[0.98]">
                    Unlock: {reward.cost}
                  </button>
                </div>
              </HolographicCard>
            ))}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col gap-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Habit Room</h1>
          <p className="text-gray-400 font-light mt-1">Small shifts lead to massive mental changes.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl text-yellow-400 font-bold text-xs shadow-xl">
          <Sparkles size={16} className="animate-pulse" />
        </div>
      </div>

      <div className="flex overflow-x-auto gap-4 p-3 bg-white/5 rounded-[2.5rem] border border-white/5 no-scrollbar backdrop-blur-md">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-sm font-black transition-all whitespace-nowrap
                ${isActive ? 'bg-white text-black shadow-2xl scale-[1.05]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={20} strokeWidth={2.5} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default Activities;
