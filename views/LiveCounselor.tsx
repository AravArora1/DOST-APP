
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Shield, BrainCircuit, MessageSquare, Send, Sparkles, Loader2, User, Bot } from 'lucide-react';
import { createAiClient, decodeAudioData, decodeAudio, encodeAudio, triggerDostWorkflow } from '../services/geminiService';
import { LiveServerMessage, Modality, Blob } from '@google/genai';

const LiveCounselor: React.FC = () => {
  const [sanctuaryMode, setSanctuaryMode] = useState<'voice' | 'chat'>('voice');
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [volume, setVolume] = useState(0);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Audio refs
  const sessionRef = useRef<any>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (sanctuaryMode === 'chat' && chatMessages.length === 0) {
      setChatMessages([{ role: 'model', text: 'Welcome to your private Neural Sanctuary. I am Dost. Your thoughts are safe here. How can I support you today?' }]);
    }
  }, [sanctuaryMode, chatMessages.length]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  const toggleSession = async () => {
    if (isActive) {
      stopSession();
      return;
    }
    startSession();
  };

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = createAiClient();
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i]*inputData[i];
              setVolume(Math.min(100, Math.sqrt(sum/inputData.length) * 500));
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob: Blob = {
                data: encodeAudio(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decodeAudio(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
          },
          onclose: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: 'You are Dost, a sympathetic and kind mental health companion. Your goal is to listen and validate feelings.',
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setIsConnecting(false);
    if (sessionRef.current) sessionRef.current.close();
    inputAudioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setVolume(0);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;
    const userText = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      // Transitioned from native Gemini Chat to On-Demand.io Workflow
      const responseText = await triggerDostWorkflow(userText);
      setChatMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'model', text: 'My neural link is weak. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in duration-700">
      {/* Modality Switcher */}
      <div className="flex justify-center">
        <div className="p-1 bg-white/5 border border-white/10 rounded-2xl flex gap-1">
          <button 
            onClick={() => setSanctuaryMode('voice')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sanctuaryMode === 'voice' ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-500 hover:text-white'}`}
          >
            <Mic size={14} /> Spatial Voice
          </button>
          <button 
            onClick={() => setSanctuaryMode('chat')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sanctuaryMode === 'chat' ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-500 hover:text-white'}`}
          >
            <MessageSquare size={14} /> Neural Chat
          </button>
        </div>
      </div>

      {sanctuaryMode === 'voice' ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-12 animate-in zoom-in-95 duration-500">
          <div className="text-center space-y-4 max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <BrainCircuit size={14} /> Sanctuary Protocol Active
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white italic uppercase">Vocal Resonance</h1>
            <p className="text-gray-400 text-sm font-light">Your voice triggers a neural sympathetic response. Dost is listening.</p>
          </div>

          <div className="relative">
            <div className={`absolute inset-[-40px] rounded-full bg-cyan-500/5 blur-[60px] transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
            <button 
              onClick={toggleSession}
              disabled={isConnecting}
              className={`relative z-10 w-52 h-52 rounded-full flex flex-col items-center justify-center gap-3 transition-all duration-500 shadow-[0_0_50px_rgba(0,0,0,0.5)]
                ${isActive ? 'bg-black border-4 border-cyan-400' : 'bg-white/5 hover:bg-white/10 border-2 border-white/10'}`}
            >
              {isConnecting ? (
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
              ) : isActive ? (
                <>
                  <div className="flex items-end gap-1.5 h-12">
                    {[...Array(8)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-2 bg-cyan-400 rounded-full transition-all duration-75"
                        style={{ height: `${20 + Math.random() * volume}%` }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-cyan-400 tracking-widest uppercase">Listening</span>
                </>
              ) : (
                <>
                  <Mic size={56} className="text-white opacity-80" />
                  <span className="text-[9px] font-black text-gray-400 tracking-widest uppercase">Tap to speak</span>
                </>
              )}
            </button>
          </div>
          <div className="flex gap-10 opacity-40">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Volume2 size={16} /> Real-time</div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Shield size={16} /> Encrypted</div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 p-4" ref={chatScrollRef}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                   <div className={`group relative max-w-[85%] px-6 py-4 rounded-[2rem] border transition-all ${
                     msg.role === 'user' 
                      ? 'bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.1)]' 
                      : 'bg-white/5 text-white border-white/10 backdrop-blur-xl hover:bg-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)]'
                   }`}>
                      <div className={`absolute -top-3 ${msg.role === 'user' ? '-right-1' : '-left-1'} flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-gray-500 group-hover:text-fuchsia-400 transition-colors`}>
                        {msg.role === 'user' ? <><User size={10} /> You</> : <><Bot size={10} /> Dost AI</>}
                      </div>
                      <p className="text-sm font-light leading-relaxed">{msg.text}</p>
                   </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-pulse">
                   <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-[2rem]">
                      <div className="flex gap-1">
                         <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce" />
                         <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                         <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                   </div>
                </div>
              )}
           </div>

           <div className="p-6 bg-black/40 border-t border-white/5 backdrop-blur-3xl rounded-[2.5rem] mt-4">
              <div className="relative group">
                 <input 
                   value={chatInput}
                   onChange={(e) => setChatInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                   placeholder="Share your thoughts with Dost..."
                   className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-fuchsia-400/50 transition-all pr-14 placeholder:text-gray-700"
                 />
                 <button 
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-fuchsia-500 text-white rounded-xl hover:scale-105 active:scale-95 disabled:opacity-30 transition-all shadow-xl"
                 >
                   <Send size={18} />
                 </button>
              </div>
              <div className="mt-3 flex items-center justify-center gap-4">
                 <div className="flex items-center gap-1.5 text-[8px] font-black text-gray-600 uppercase tracking-widest">
                    <Sparkles size={10} /> Powered by Dost Automation Workflow
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LiveCounselor;
