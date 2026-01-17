
import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Lock, User, Sparkles, Loader2, GraduationCap, 
  Upload, FileCheck, CheckCircle2, ShieldCheck, FileImage, AlertCircle
} from 'lucide-react';
import HolographicCard from '../components/HolographicCard';
import { verifySpecialistCredential } from '../services/geminiService';

interface Props {
  onLogin: (name: string) => void;
  onBack: () => void;
}

const CounsellorLogin: React.FC<Props> = ({ onLogin, onBack }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [jpgDegreeFile, setJpgDegreeFile] = useState<File | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const jpgDegreeInputRef = useRef<HTMLInputElement>(null);

  const handleJpgDegreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setJpgDegreeFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !password || !qualifications || !jpgDegreeFile) return;
    
    setIsAuthenticating(true);
    setError(null);
    
    try {
      const result = await verifySpecialistCredential(jpgDegreeFile);
      
      if (result.success) {
        onLogin(name);
      } else {
        setError(result.error || "Neural verification failed.");
      }
    } catch (err) {
      setError("System failure during verification handshake.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-700">
      <div className="max-w-xl w-full space-y-4">
        <div className="flex justify-between items-center px-1">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-white transition-colors group"
          >
            <ArrowLeft size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Return</span>
          </button>
          <div className="flex items-center gap-2 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border bg-cyan-400/10 border-cyan-400/20 text-cyan-400">
            <ShieldCheck size={10} /> Secure Portal
          </div>
        </div>

        <div className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="absolute -inset-3 bg-fuchsia-500/20 blur-xl rounded-full" />
              <div className="relative w-12 h-12 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-2xl flex items-center justify-center text-fuchsia-400">
                <ShieldCheck size={24} />
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic leading-none">Specialist <br/> Verification</h2>
          <p className="text-gray-500 text-[8px] font-black uppercase tracking-[0.4em] mt-1">Neural Credentialing V4.0</p>
        </div>

        <HolographicCard className="p-0 border-none bg-black/60 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1 flex items-center gap-1.5">
                  <User size={10} /> Name
                </label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Clinical Handle"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-fuchsia-400/50 transition-all placeholder:text-gray-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1 flex items-center gap-1.5">
                  <Lock size={10} /> Password
                </label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-fuchsia-400/50 transition-all placeholder:text-gray-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest ml-1 flex items-center gap-1.5">
                <GraduationCap size={12} /> Professional History
              </label>
              <textarea 
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                required
                placeholder="Detail your clinical expertise and institutional affiliations..."
                className="w-full h-16 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-fuchsia-400/50 transition-all placeholder:text-gray-800 resize-none no-scrollbar"
              />
            </div>

            <div className="flex justify-center pt-2">
              <div className="w-full md:w-1/2 space-y-1.5">
                <label className="text-[7px] font-black uppercase text-fuchsia-400 tracking-widest ml-1 flex items-center gap-1 h-3 overflow-hidden">
                  <FileImage size={8} /> Specialist Degree (JPG)
                </label>
                <div 
                  onClick={() => jpgDegreeInputRef.current?.click()}
                  className={`cursor-pointer group relative border-2 border-dashed rounded-[1rem] p-4 transition-all flex flex-col items-center justify-center text-center gap-1 h-28 ${
                    jpgDegreeFile ? 'bg-fuchsia-500/20 border-fuchsia-500/60 shadow-[0_0_20px_rgba(192,38,211,0.2)]' : 'bg-white/5 border-white/10 hover:border-fuchsia-400/40 hover:bg-white/10'
                  }`}
                >
                  <input type="file" ref={jpgDegreeInputRef} onChange={handleJpgDegreeChange} className="hidden" accept=".jpg,.jpeg" />
                  {jpgDegreeFile ? (
                    <>
                      <FileCheck className="text-fuchsia-400" size={20} />
                      <span className="text-[8px] font-bold text-white max-w-full truncate px-2">{jpgDegreeFile.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="text-gray-600 group-hover:text-fuchsia-400 transition-colors" size={20} />
                      <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest leading-tight">Upload JPG Credential</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-[9px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="pt-2">
              <button 
                type="submit"
                disabled={isAuthenticating || !name || !password || !qualifications || !jpgDegreeFile}
                className="w-full py-4 bg-fuchsia-500 text-white font-black rounded-xl shadow-[0_15px_30px_-5px_rgba(192,38,211,0.4)] hover:bg-fuchsia-600 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.25em]"
              >
                {isAuthenticating ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>Verify Credentials <CheckCircle2 size={16} /></>
                )}
              </button>
            </div>
          </form>
        </HolographicCard>
        
        <div className="flex flex-col items-center gap-3 text-gray-700">
          <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.4em]">
            <Sparkles size={12} className="text-fuchsia-400" /> Authorized Expert Channel
          </div>
          <p className="text-[7px] font-bold uppercase tracking-widest opacity-40">Encryption active: On-Demand Workflow Security</p>
        </div>
      </div>
    </div>
  );
};

export default CounsellorLogin;
