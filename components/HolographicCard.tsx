
import React, { useState, useRef, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  isFlippable?: boolean;
  backContent?: ReactNode;
  padding?: string;
}

const HolographicCard: React.FC<Props> = ({ 
  children, 
  className = '', 
  isFlippable = false, 
  backContent,
  padding = 'p-6 md:p-8'
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 25; 
    const rotateY = (centerX - x) / 25;
    
    setRotate({ x: rotateX, y: rotateY });
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50 });
  };

  const handleFlip = () => {
    if (isFlippable) setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`perspective-1000 w-full ${className}`}
      onClick={handleFlip}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative transition-all duration-500 preserve-3d w-full cursor-pointer h-full min-h-fit
          ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y + (isFlipped ? 180 : 0)}deg)`
        }}
      >
        {/* Front */}
        <div className={`relative z-10 backface-hidden rounded-[2.5rem] backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl overflow-visible transition-all h-full min-h-fit`}>
          {/* Specular Glare */}
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 rounded-[2.5rem]"
            style={{
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.8) 0%, transparent 60%)`
            }}
          />
          <div className={`relative z-20 ${padding} h-full flex flex-col`}>
            {children}
          </div>
        </div>

        {/* Back */}
        {isFlippable && backContent && (
          <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-[2.5rem] backdrop-blur-xl bg-black/60 border border-white/20 shadow-2xl overflow-hidden`}>
             <div className={`relative z-10 ${padding} h-full flex flex-col`}>
              {backContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolographicCard;
