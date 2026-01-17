
import React, { useState } from 'react';
import { 
  Flame, Star, Brain, Ticket, Activity, MessageCircle, 
  MapPin, Mic2, RefreshCw, CheckCircle2, Loader2
} from 'lucide-react';
import { UserStats, AppTab, AIRecommendation } from '../types';
import HolographicCard from '../components/HolographicCard';
import { analyzeScreeningResult } from '../services/geminiService';

interface Props {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  navigateTo: (tab: AppTab) => void;
  onTestComplete: (results: AIRecommendation) => void;
}

const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge?",
  "Not being able to stop or control worrying?",
  "Worrying too much about different things?",
  "Trouble relaxing?",
  "Being so restless that it is hard to sit still?",
  "Becoming easily annoyed or irritable?",
  "Feeling afraid, as if something awful might happen?"
];

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things?",
  "Feeling down, depressed, or hopeless?",
  "Trouble falling or staying asleep, or sleeping too much?",
  "Feeling tired or having little energy?",
  "Poor appetite or overeating?",
  "Feeling bad about yourself or that you are a failure?",
  "Trouble concentrating on things?",
  "Moving or speaking so slowly that other people could have noticed?",
  "Thoughts that you would be better off dead?"
];

const Dashboard: React.FC<Props> = ({ stats, setStats, navigateTo, onTestComplete }) => {
  const [testPhase, setTestPhase] = useState<'idle' | 'testing' | 'analyzing'>('idle');
  const [activeTest, setActiveTest] = useState<'PHQ9' | 'GAD7' | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [showStreakAnim, setShowStreakAnim] = useState(false);

  const questions = activeTest === 'GAD7' ? GAD7_QUESTIONS : PHQ9_QUESTIONS;
  const progress = ((currentQuestionIdx + 1) / questions.length) * 100;

  const handleAnswer = async (points: number) => {
    const newScore = testScore + points;
    if (currentQuestionIdx < questions.length - 1) {
      setTestScore(newScore);
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setTestPhase('analyzing');
      try {
        const result = await analyzeScreeningResult(activeTest!, newScore);
        
        setStats(prev => ({ 
          ...prev, 
          isScreened: true, 
          points: prev.points + 1200, 
          lastTestResult: result.shouldSeeTherapist ? 'high' : 'low',
          streak: prev.streak + 1
        }));
        
        setShowStreakAnim(true);
        setTimeout(() => {
          setShowStreakAnim(false);
          onTestComplete(result);
        }, 2000);
      } catch (err) {
        console.error("AI Analysis failed", err);
        setTestPhase('idle');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 relative">
      {showStreakAnim && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="bg-black/80 backdrop-blur-xl p-10 rounded-[3rem] border border-orange-500/30 flex flex-col items-center animate-in zoom-in-90 duration-500 shadow-2xl">
             <Flame size={80} className="text-orange-500 animate-bounce mb-4" />
             <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Streak Up!</h2>
             <p className="text-orange-400 font-bold text-xl uppercase tracking-widest">Generating Protocol...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-start px-2">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent italic">Dost Hub</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-2.5 py-0.5 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-[9px] font-black text-cyan-400 uppercase tracking-widest">
                LVL {stats.level} Voyager
              </div>
              <div className="flex items-center gap-1 text-orange-400 font-black text-[10px]">
                <Flame size={12} className="animate-pulse" /> {stats.streak} DAY STREAK
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl shadow-2xl">
              <Star size={16} className="text-yellow-400 fill-yellow-400/20" />
              <span className="mono text-xl font-black">{stats.points}</span>
            </div>
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">XP BALANCE</span>
          </div>
        </div>

        <div className="px-2 space-y-1.5">
           <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-700">
              <span>Next Level: {stats.level + 1}</span>
              <span>{Math.round((stats.points / stats.xpToNextLevel) * 100)}%</span>
           </div>
           <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-lime-500 transition-all duration-1000 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                style={{ width: `${(stats.points / stats.xpToNextLevel) * 100}%` }}
              />
           </div>
        </div>
      </div>

      <div className="relative group px-1">
        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-lime-400 rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-20 transition-all duration-1000" />
        <HolographicCard 
          padding="p-3 md:py-4 md:px-6"
          className="relative overflow-visible border-none bg-black/60 rounded-[2.5rem] w-full"
        >
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full h-full">
            {/* Massive Logo Icon */}
            <div className="relative flex-shrink-0 hidden md:block">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-400/20 via-transparent to-fuchsia-400/20 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-inner">
                <Brain className="text-white/90 animate-pulse" size={44} />
              </div>
              <div className="absolute -top-2 -right-2 bg-lime-400 text-black px-2 py-1 rounded-xl text-[10px] font-black uppercase shadow-2xl">+1.2k XP</div>
            </div>
            
            <div className="flex-1 w-full">
              {testPhase === 'idle' ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-500">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-white/10 border border-white/5 text-white/50 text-[7px] font-black rounded-full uppercase tracking-[0.2em]">Neural Scan Protocol</span>
                      <span className="text-lime-400 font-bold text-[10px] uppercase flex items-center gap-1">
                         <Ticket size={12} /> Clinical
                      </span>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">Advanced Screening</h3>
                    <p className="text-gray-300 font-light text-sm leading-tight max-w-lg mt-1">
                      Deep-link your mental state to launch a personalized wellness sanctuary.
                    </p>
                  </div>
                  <div className="flex flex-row md:flex-col gap-2 shrink-0">
                    <button 
                      onClick={() => { setActiveTest('GAD7'); setTestPhase('testing'); setCurrentQuestionIdx(0); setTestScore(0); }}
                      className="px-8 py-3 bg-white text-black font-black rounded-2xl transition-all hover:scale-105 active:scale-95 text-[10px] uppercase tracking-[0.1em] shadow-xl whitespace-nowrap min-w-[140px]"
                    >
                      Launch GAD-7
                    </button>
                    <button 
                      onClick={() => { setActiveTest('PHQ9'); setTestPhase('testing'); setCurrentQuestionIdx(0); setTestScore(0); }}
                      className="px-8 py-3 bg-white/5 text-white border border-white/10 font-black rounded-2xl transition-all hover:scale-105 active:scale-95 text-[10px] uppercase tracking-[0.1em] whitespace-nowrap min-w-[140px]"
                    >
                      Launch PHQ-9
                    </button>
                  </div>
                </div>
              ) : testPhase === 'testing' ? (
                <div className="flex flex-col md:flex-row md:items-center gap-6 animate-in slide-in-from-right-4 duration-500">
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
                         <span>{activeTest} Step {currentQuestionIdx + 1}/{questions.length}</span>
                         <span>{Math.round(progress)}%</span>
                      </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-1">
                       <div className="h-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                    <h4 className="text-2xl font-black text-white leading-none italic tracking-tight line-clamp-2">{questions[currentQuestionIdx]}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2 shrink-0">
                    {['Not at all', 'Several days', 'More than half', 'Nearly every day'].map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleAnswer(i)}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-cyan-400 transition-all text-center whitespace-nowrap min-w-[130px] leading-tight"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-6 py-4 animate-in fade-in duration-500">
                  <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                  <div className="text-left">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">Defragmenting Neural State</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Generating Protocol results...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </HolographicCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-1 pb-10">
        <button onClick={() => navigateTo(AppTab.ACTIVITIES)} className="group text-left focus:outline-none transition-transform hover:-translate-y-1.5 duration-500">
          <HolographicCard padding="p-5" className="min-h-[140px] border-white/5 bg-gradient-to-br from-lime-500/5 to-transparent rounded-[2rem]">
            <div className="h-full flex flex-col justify-between">
              <div className="w-10 h-10 bg-lime-500/10 rounded-xl flex items-center justify-center text-lime-400 border border-lime-500/20 group-hover:scale-110 transition-all shadow-lg">
                <Activity size={20} />
              </div>
              <div className="mt-3">
                <h3 className="text-xl font-black text-white tracking-tighter italic uppercase leading-none">Habit Room</h3>
                <p className="text-[10px] text-gray-600 font-light mt-1">Meditation & Journaling.</p>
              </div>
            </div>
          </HolographicCard>
        </button>

        <button onClick={() => navigateTo(AppTab.COMMUNITY)} className="group text-left focus:outline-none transition-transform hover:-translate-y-1.5 duration-500">
          <HolographicCard padding="p-5" className="min-h-[140px] border-white/5 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-[2rem]">
            <div className="h-full flex flex-col justify-between">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 border border-cyan-400/20 group-hover:scale-110 transition-all shadow-lg">
                <MessageCircle size={20} />
              </div>
              <div className="mt-3">
                <h3 className="text-xl font-black text-white tracking-tighter italic uppercase leading-none">Safe Circles</h3>
                <p className="text-[10px] text-gray-600 font-light mt-1">Anonymous AI Chat.</p>
              </div>
            </div>
          </HolographicCard>
        </button>

        <button onClick={() => navigateTo(AppTab.COUNSELORS)} className="group text-left focus:outline-none transition-transform hover:-translate-y-1.5 duration-500">
          <HolographicCard padding="p-5" className="min-h-[140px] border-white/5 bg-gradient-to-br from-fuchsia-500/5 to-transparent rounded-[2rem]">
            <div className="h-full flex flex-col justify-between">
              <div className="w-10 h-10 bg-fuchsia-500/10 rounded-xl flex items-center justify-center text-fuchsia-400 border border-fuchsia-500/20 group-hover:scale-110 transition-all shadow-lg">
                <MapPin size={20} />
              </div>
              <div className="mt-3">
                <h3 className="text-xl font-black text-white tracking-tighter italic uppercase leading-none">Connect Hub</h3>
                <p className="text-[10px] text-gray-600 font-light mt-1">Therapist Matching.</p>
              </div>
            </div>
          </HolographicCard>
        </button>

        <button onClick={() => navigateTo(AppTab.LIVE)} className="group text-left focus:outline-none transition-transform hover:-translate-y-1.5 duration-500">
          <HolographicCard padding="p-5" className="min-h-[140px] border-white/5 bg-gradient-to-br from-orange-500/5 to-transparent rounded-[2rem]">
            <div className="h-full flex flex-col justify-between">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400 border border-orange-500/20 group-hover:scale-110 transition-all shadow-lg">
                <Mic2 size={20} />
              </div>
              <div className="mt-3">
                <h3 className="text-xl font-black text-white tracking-tighter italic uppercase leading-none">Voice Support</h3>
                <p className="text-[10px] text-gray-300 font-light mt-1">AI Vocal Resonance.</p>
              </div>
            </div>
          </HolographicCard>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
