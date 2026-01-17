
import React, { useState } from 'react';
import { Send, Shield, Info, AlertCircle, Hash, Users, MessageCircle } from 'lucide-react';
import { Message } from '../types';
import { moderateMessage } from '../services/geminiService';

const rooms = [
  { id: 'general', name: 'General Support', description: 'Open talk about everything wellness.', count: 42 },
  { id: 'anxiety', name: 'Anxiety Circle', description: 'Coping strategies and peer support.', count: 28 },
  { id: 'sleep', name: 'Sleep Sanctuary', description: 'Resting together and sharing tips.', count: 15 },
  { id: 'vent', name: 'Safe Vent', description: 'Release what\'s heavy without judgment.', count: 56 },
];

const Community: React.FC = () => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'community', username: 'Anon-92', avatar: 'https://picsum.photos/32/32?random=1', text: 'Just completed my first meditation today. Feeling lighter.', timestamp: new Date() },
    { id: '2', sender: 'bot', username: 'Dost AI', text: 'I\'m monitoring this room to keep it safe. Speak freely but kindly.', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim() || isChecking) return;
    setIsChecking(true);
    setError(null);

    const check = await moderateMessage(input);
    if (check.safe) {
      const newMessage: Message = { id: Date.now().toString(), sender: 'user', username: 'Me', text: input, timestamp: new Date() };
      setMessages([...messages, newMessage]);
      setInput('');
    } else {
      setError(`Safe Guard: ${check.reason || 'Harmful content detected.'}`);
    }
    setIsChecking(false);
  };

  if (!activeRoom) {
    return (
      <div className="h-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div>
          <h1 className="text-3xl font-bold">Safe Circles</h1>
          <p className="text-gray-400 mt-1">Anonymous peer groups moderated by Dost AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map(room => (
            <button 
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className="p-6 text-left bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Hash size={24} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase">
                  <Users size={12} /> {room.count} active
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">{room.name}</h3>
              <p className="text-sm text-gray-500 font-light">{room.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => setActiveRoom(null)}
          className="text-cyan-400 font-bold text-sm hover:underline"
        >
          ← Back to Circles
        </button>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-lime-400/10 border border-lime-400/20 rounded-full">
           <Shield size={14} className="text-lime-400" />
           <span className="text-[10px] font-black text-lime-400 uppercase tracking-widest">AI Moderated Room</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden flex flex-col backdrop-blur-xl">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
            <MessageCircle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg">{rooms.find(r => r.id === activeRoom)?.name}</h3>
            <p className="text-xs text-gray-500">Always anonymous. Always safe.</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`max-w-[80%] px-5 py-3 rounded-[2rem] text-sm leading-relaxed ${
                msg.sender === 'user' ? 'bg-cyan-500 text-black font-bold' : 
                msg.sender === 'bot' ? 'bg-white/10 text-lime-400 border border-lime-400/20' : 
                'bg-white/5 border border-white/5 text-gray-300'
              }`}>
                {msg.username && msg.sender !== 'user' && (
                  <div className="text-[10px] font-black uppercase mb-1 opacity-50 tracking-widest">{msg.username}</div>
                )}
                {msg.text}
              </div>
            </div>
          ))}
          {error && (
             <div className="flex justify-center">
                <div className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl text-xs font-bold">
                  <AlertCircle size={16} /> {error}
                </div>
             </div>
          )}
        </div>

        <div className="p-6 bg-black/40 border-t border-white/10">
          <div className="relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Send an anonymous message..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-cyan-400 transition-all pr-16"
            />
            <button 
              onClick={handleSend}
              disabled={isChecking}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-cyan-400 text-black rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-lg"
            >
              <Send size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
