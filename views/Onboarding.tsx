
import React, { useState } from 'react';
import { Shield, Lock, Fingerprint, Sparkles } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const steps = [
  {
    title: "How is your heart feeling?",
    subtitle: "A gentle check-in to begin your journey.",
    options: ["Sunny & Calm", "Light Clouds", "Foggy/Confused", "Stormy/Heavy"]
  },
  {
    title: "How was your sleep?",
    subtitle: "Rest is the foundation of mental hygiene.",
    options: ["Deep & Restful", "Tossing & Turning", "Hardly Slept", "Always Tired"]
  },
  {
    title: "Current energy level?",
    subtitle: "We'll tailor your path to your capacity.",
    options: ["High Energy", "Balanced", "Feeling Low", "Running on Empty"]
  },
  {
    title: "Social Battery",
    subtitle: "How are you feeling about connection?",
    options: ["Want to Talk", "Selective", "Need Solitude", "Feeling Isolated"]
  },
  {
    title: "Daily Focus",
    subtitle: "What matters most right now?",
    options: ["Finding Peace", "Gaining Clarity", "Productivity", "Healing"]
  },
  {
    title: "Nourishment Check",
    subtitle: "Body and mind flow together.",
    options: ["Balanced", "Comfort Eating", "No Appetite", "Irregular"]
  },
  {
    title: "Almost there...",
    subtitle: "Your anonymity is 100% guaranteed.",
    options: ["Secure my Identity", "Start Anonymously", "Begin my Sanctuary"]
  }
];

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleSelect = (opt: string) => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="h-full flex flex-col justify-center max-w-md mx-auto p-6 space-y-8 animate-in slide-in-from-right-12 duration-1000">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-1.5 flex-1 max-w-[180px]">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 flex-1 rounded-full transition-all duration-700 ease-out ${i <= currentStep ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-white/5'}`} 
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-[8px] font-black uppercase tracking-widest text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <Lock size={10} /> Vault Protected
          </div>
        </div>
        
        <div key={currentStep} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight leading-tight">{steps[currentStep].title}</h2>
          <p className="text-gray-400 text-base font-light leading-relaxed">{steps[currentStep].subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {steps[currentStep].options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(opt)}
            className="group relative p-6 text-left bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-500 active:scale-[0.97] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex justify-between items-center">
              <span className="text-lg font-medium text-white/90 group-hover:text-white transition-colors">{opt}</span>
              <div className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center group-hover:border-cyan-400/50 group-hover:bg-cyan-400/10 transition-all duration-500 rotate-45 group-hover:rotate-0">
                <Sparkles size={14} className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 text-gray-500 pt-4">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em]">
          <Fingerprint size={14} /> Biometric Privacy
        </div>
        <p className="text-[8px] font-bold text-gray-600 uppercase tracking-wider text-center">You are anonymous. No names, no footprints.</p>
      </div>
    </div>
  );
};

export default Onboarding;
