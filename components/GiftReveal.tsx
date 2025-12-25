import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GiftData } from '../types';
import { getGiftImage } from '../utils/giftImages';
import { getGiftModel } from '../utils/giftModels';

// Workaround for TypeScript error with custom element
const ModelViewer = 'model-viewer' as any;

interface GiftRevealProps {
  data: GiftData;
  onReset: () => void;
  hasNextGift?: boolean;
}

const GiftReveal: React.FC<GiftRevealProps> = ({ data, onReset, hasNextGift }) => {
  const giftImage = getGiftImage(data.giftName);
  const giftModel = getGiftModel(data.giftName);
  const isInspirational = data.theme === 'inspiration';
  
  // Special checks for specific people
  const isLove = data.recipient.toLowerCase().includes('bhagawati');
  const isSister = data.recipient.toLowerCase().includes('ranjana');
  const isCarlSagan = data.recipient.toLowerCase().includes('carl sagan') || data.recipient.toLowerCase().includes('sagan');

  useEffect(() => {
    const duration = (isLove || isSister || isCarlSagan) ? 5000 : 3000;
    const end = Date.now() + duration;

    // Define color palettes
    let colors = ['#fbbf24', '#dc2626', '#ffffff']; // Default: Gold, Red, White

    if (isLove) {
       colors = ['#ef4444', '#ec4899', '#ffffff']; // Red, Pink, White
    } else if (isSister) {
       colors = ['#a855f7', '#22d3ee', '#f0abfc']; // Purple, Cyan, Light Purple
    } else if (isCarlSagan) {
       colors = ['#1e1b4b', '#7c3aed', '#06b6d4']; // Deep Blue, Purple, Cyan (cosmic colors)
    }

    const frame = () => {
      confetti({
        particleCount: (isLove || isSister || isCarlSagan) ? 8 : 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: (isLove || isSister || isCarlSagan) ? 8 : 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [isLove, isSister, isCarlSagan]);

  const handleCopy = () => {
    const text = `I got ${data.giftName} for Christmas! "${data.message}" #LumiereDeNoel`;
    navigator.clipboard.writeText(text);
    alert("Message copied to clipboard! Share the magic.");
  };

  // --- Dynamic Styles ---

  let containerClass = "glass-card p-8 md:p-12 rounded-[2.5rem] text-center relative overflow-hidden transform-style-3d transition-transform hover:rotate-x-1 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/20";
  let badgeClass = "inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-950/40 text-yellow-200 text-[10px] md:text-xs tracking-[0.2em] uppercase border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.15)] backdrop-blur-md";
  let glowColor = isInspirational ? "bg-blue-400/20" : "bg-yellow-500/20";
  let badgeText = "Official North Pole Delivery";
  let badgeDotColor = "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]";
  let buttonPrimaryClass = "bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border-red-400/30 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]";
  let buttonSecondaryClass = "text-yellow-200 border border-yellow-500/30 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]";

  if (isLove) {
     containerClass = "glass-card p-8 md:p-12 rounded-[2.5rem] text-center relative overflow-hidden transform-style-3d transition-transform hover:rotate-x-1 shadow-[0_0_80px_rgba(236,72,153,0.6)] border border-pink-400/50 bg-gradient-to-br from-pink-900/80 to-red-900/80";
     badgeClass = "inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-950/40 text-pink-200 text-[10px] md:text-xs tracking-[0.2em] uppercase border border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.3)] backdrop-blur-md";
     glowColor = "bg-pink-500/30";
     badgeText = "My Love Special Edition";
     badgeDotColor = "bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]";
     buttonPrimaryClass = "bg-gradient-to-r from-pink-700 to-pink-600 hover:from-pink-600 hover:to-pink-500 border-pink-400/30 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]";
     buttonSecondaryClass = "text-pink-200 border border-pink-500/30 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]";
  } else if (isSister) {
     containerClass = "glass-card p-8 md:p-12 rounded-[2.5rem] text-center relative overflow-hidden transform-style-3d transition-transform hover:rotate-x-1 shadow-[0_0_80px_rgba(168,85,247,0.6)] border border-purple-400/50 bg-gradient-to-br from-indigo-950/80 to-purple-900/80";
     badgeClass = "inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-950/40 text-purple-200 text-[10px] md:text-xs tracking-[0.2em] uppercase border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] backdrop-blur-md";
     glowColor = "bg-purple-500/30";
     badgeText = "Best Sister Edition";
     badgeDotColor = "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]";
     buttonPrimaryClass = "bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 border-purple-400/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]";
     buttonSecondaryClass = "text-purple-200 border border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]";
  } else if (isCarlSagan) {
     containerClass = "glass-card p-8 md:p-12 rounded-[2.5rem] text-center relative overflow-hidden transform-style-3d transition-transform hover:rotate-x-1 shadow-[0_0_80px_rgba(30,27,75,0.6)] border border-blue-400/50 bg-gradient-to-br from-slate-950/80 to-blue-900/80";
     badgeClass = "inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-950/40 text-cyan-200 text-[10px] md:text-xs tracking-[0.2em] uppercase border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-md";
     glowColor = "bg-cyan-500/30";
     badgeText = "Cosmic Explorer Edition";
     badgeDotColor = "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]";
     buttonPrimaryClass = "bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-600 hover:to-cyan-500 border-cyan-400/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]";
     buttonSecondaryClass = "text-cyan-200 border border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]";
  }

  // Button Text Logic
  let nextButtonText = "Open Another";
  if (hasNextGift) {
      if (isLove) {
          if (data.giftName.includes("Ring")) {
             nextButtonText = "One Last Message...";
          } else {
             nextButtonText = "I have one more surprise...";
          }
      } else if (isSister) {
          if (data.giftName.includes("Crown")) {
            nextButtonText = "Read Final Message";
          } else {
             nextButtonText = "Wait, there's more...";
          }
      } else {
          nextButtonText = "Open Another";
      }
  }

  return (
    <div className="animate-fade-in-up w-full max-w-3xl mx-auto p-4 perspective-1000">
      <div className={containerClass}>
        
        {/* Special Love Animation Background */}
        {isLove && (
           <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-10 left-10 text-4xl animate-float opacity-30">❤️</div>
              <div className="absolute bottom-20 right-10 text-6xl animate-float opacity-20" style={{animationDelay: '1s'}}>💖</div>
              <div className="absolute top-1/2 right-1/4 text-3xl animate-pulse opacity-30" style={{animationDelay: '2s'}}>✨</div>
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-transparent to-pink-900/20"></div>
           </div>
        )}

        {/* Special Sister Animation Background */}
        {isSister && (
           <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-10 right-10 text-4xl animate-spin-slow opacity-30">⭐</div>
              <div className="absolute bottom-1/4 left-10 text-5xl animate-float opacity-20" style={{animationDelay: '1.5s'}}>🌟</div>
              <div className="absolute top-1/3 left-1/2 text-2xl animate-pulse opacity-40">✨</div>
              <div className="absolute bottom-10 right-1/4 text-4xl animate-bounce opacity-20" style={{animationDelay: '0.5s'}}>🎈</div>
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-transparent to-purple-900/20"></div>
           </div>
        )}

        {/* Special Carl Sagan Animation Background */}
        {isCarlSagan && (
           <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-10 left-10 text-4xl animate-spin-slow opacity-30">🌌</div>
              <div className="absolute bottom-20 right-10 text-5xl animate-float opacity-20" style={{animationDelay: '1s'}}>🚀</div>
              <div className="absolute top-1/2 right-1/4 text-3xl animate-pulse opacity-30" style={{animationDelay: '2s'}}>⭐</div>
              <div className="absolute bottom-1/4 left-10 text-4xl animate-bounce opacity-25" style={{animationDelay: '0.5s'}}>🪐</div>
              <div className="absolute top-1/3 right-1/3 text-2xl animate-float opacity-35" style={{animationDelay: '1.5s'}}>✨</div>
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-slate-900/20"></div>
           </div>
        )}

        {/* Top Decoration */}
        <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-${isLove ? 'pink' : (isSister ? 'purple' : (isCarlSagan ? 'cyan' : 'yellow'))}-500 to-transparent opacity-80 shadow-[0_0_15px_rgba(255,255,255,0.5)]`}></div>
        
        <div className="mb-6 relative z-10">
           <span className={badgeClass}>
             <span className={`w-2 h-2 rounded-full ${badgeDotColor} animate-pulse`}></span>
             {badgeText}
           </span>
        </div>

        <h2 className="font-serif text-4xl md:text-6xl mb-2 text-white tracking-wide drop-shadow-md relative z-10">
          {isLove ? "For My Beloved" : (isSister ? "For My Dear Sister" : (isCarlSagan ? "For the Cosmic Explorer" : "Merry Christmas"))}
        </h2>
        <h3 className={`text-2xl md:text-4xl font-serif mb-8 italic relative z-10 ${isLove ? 'text-pink-300' : (isSister ? 'text-purple-300' : (isCarlSagan ? 'text-cyan-300' : 'text-yellow-400/90'))}`}>
          {data.recipient}
        </h3>

        {/* Gift Showcase Container */}
        <div className={`relative my-8 py-4 px-6 rounded-2xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-inner min-h-[400px] flex flex-col items-center justify-center z-10 ${isInspirational ? 'bg-gradient-to-b from-blue-900/30 to-purple-900/30' : ''}`}>
           {/* Background Glow for Image/Model */}
           <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-[60px] rounded-full pointer-events-none ${glowColor}`}></div>

           <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1 rounded-full text-xs tracking-widest border uppercase z-20 shadow-lg ${isLove ? 'bg-pink-950 text-pink-200 border-pink-400/30' : (isSister ? 'bg-indigo-950 text-purple-200 border-purple-400/30' : (isCarlSagan ? 'bg-slate-950 text-cyan-200 border-cyan-400/30' : 'bg-[#0F172A] text-blue-200 border-blue-400/30'))}`}>
             {isLove ? 'Made with Love' : (isSister ? 'Magical Surprise' : (isCarlSagan ? 'Cosmic Gift' : (isInspirational ? 'Gift of Wisdom' : 'Inside the Box')))}
           </div>
           
           <div className="relative z-10 w-full h-64 md:h-80 mb-6 flex items-center justify-center">
             {giftModel ? (
               <ModelViewer
                 src={giftModel}
                 alt={data.giftName}
                 auto-rotate
                 camera-controls
                 shadow-intensity="1"
                 environment-image="neutral"
                 exposure={isLove || isSister || isCarlSagan ? "1.2" : "1"}
                 disable-zoom
                 interaction-prompt="none"
                 className="w-full h-full"
               ></ModelViewer>
             ) : giftImage ? (
               <img 
                 src={giftImage} 
                 alt={data.giftName}
                 className="w-full h-full object-contain mx-auto filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500 animate-float"
                 style={{ 
                    maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)'
                 }}
               />
             ) : null}
           </div>

           <h1 className={`text-3xl md:text-5xl font-bold mb-4 drop-shadow-2xl leading-tight px-2 relative z-10 ${isLove ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-pink-100 to-white' : (isSister ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-100 to-white' : (isCarlSagan ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-cyan-100 to-white' : (isInspirational ? 'ice-text' : 'gold-text')))}`}>
            {data.giftName}
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-200 leading-relaxed font-light px-4 italic relative z-10 font-serif">
            &ldquo;{data.message}&rdquo;
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8 relative z-10">
          <button 
            onClick={onReset}
            className={`group px-10 py-4 text-white rounded-xl font-serif tracking-widest uppercase text-xs shadow-lg transition-all transform hover:-translate-y-0.5 border ${buttonPrimaryClass}`}
          >
            {nextButtonText}
          </button>
          
          <button 
            onClick={handleCopy}
            className={`group px-10 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-serif tracking-widest uppercase text-xs transition-all backdrop-blur-md flex items-center justify-center gap-2 ${buttonSecondaryClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            Share Gift
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftReveal;
