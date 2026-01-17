
import React from 'react';

const AmbientGlow: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 blur-[120px] rounded-full animate-pulse delay-1000" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[40%] bg-lime-400/5 blur-[100px] rounded-full animate-bounce" style={{ animationDuration: '20s' }} />
    </div>
  );
};

export default AmbientGlow;
