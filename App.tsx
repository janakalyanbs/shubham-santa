import React, { useState, useEffect } from 'react';
import Snowfall from './components/Snowfall';
import AudioPlayer from './components/AudioPlayer';
import GiftBox from './components/GiftBox';
import GiftReveal from './components/GiftReveal';
import { generateChristmasGift } from './services/geminiService';
import { GiftData } from './types';

const LOADING_MESSAGES = [
  "Checking the Secret List...",
  "Consulting Shubham Santa...",
  "Loading Sleigh with Goodies...",
  "Wrapping your surprise...",
  "Ho Ho Ho! Almost there..."
];

// Special Gifts for Bhagwati (Love)
const BHAGWATI_EXTRA_GIFTS: GiftData[] = [
  { 
    recipient: 'Bhagwati', 
    giftName: 'A Red Rose That Never Fades', 
    message: 'Like this bloom, my love for you remains fresh, vibrant, and beautiful, today and for all eternity.', 
    theme: 'luxury', 
    isInList: true 
  },
  { 
    recipient: 'Bhagwati', 
    giftName: 'A Diamond Promise Ring', 
    message: 'A circle has no end, just like my love for you. A promise of forever, starting now.', 
    theme: 'luxury', 
    isInList: true 
  }
];

// Special Gifts for Ranjana (Sister)
const RANJANA_EXTRA_GIFTS: GiftData[] = [
  {
    recipient: 'Ranjana',
    giftName: 'A Magical Flying Skateboard',
    message: 'So you can zoom through life, chase your wildest dreams, and never let anything slow you down!',
    theme: 'whimsical',
    isInList: true
  },
  {
    recipient: 'Ranjana',
    giftName: 'The Crown of the Star Princess',
    message: 'Because to me, you are royalty. Keep shining, keep ruling your world with that beautiful smile.',
    theme: 'luxury',
    isInList: true
  }
];

// Special Gifts for Carl Sagan (Tech & Cosmic Exploration)
const CARLSAGAN_EXTRA_GIFTS: GiftData[] = [
  {
    recipient: 'Carl Sagan',
    giftName: 'Quantum Computer with AI Assistant',
    message: 'To my brilliant brother: Just like you explore the cosmos, this quantum computer will help you unlock the mysteries of the universe through code and computation. The future of science is in your hands.',
    theme: 'tech',
    isInList: true
  },
  {
    recipient: 'Carl Sagan',
    giftName: 'Neuralink Brain-Computer Interface',
    message: 'For the mind that questions everything: Connect your brilliant brain directly to the digital universe. No more limits between thought and technology. You were born for this revolution.',
    theme: 'tech',
    isInList: true
  },
  {
    recipient: 'Carl Sagan',
    giftName: 'Autonomous Space Exploration Drone',
    message: 'Explore distant worlds without leaving Earth. This drone carries your curiosity to places humans can only dream of. The cosmos is calling, and you\'re the perfect explorer.',
    theme: 'tech',
    isInList: true
  }
];

type AppStep = 'welcome' | 'thank_you' | 'input' | 'processing' | 'not_in_list' | 'ready_to_open' | 'revealed' | 'end_card';

const App: React.FC = () => {
  const [name, setName] = useState('');
  const [urlUser, setUrlUser] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpeningBox, setIsOpeningBox] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [giftData, setGiftData] = useState<GiftData | null>(null);
  const [step, setStep] = useState<AppStep>('welcome');
  
  // Track extra gifts for special users
  const [bhagwatiGiftIndex, setBhagwatiGiftIndex] = useState(0);
  const [ranjanaGiftIndex, setRanjanaGiftIndex] = useState(0);
  const [carlSaganGiftIndex, setCarlSaganGiftIndex] = useState(0);
  
  // Track Sierra's flow
  const [sierraCardShown, setSierraCardShown] = useState(false);

  // Check URL params on mount
  useEffect(() => {
    const checkUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const user = params.get('user');
      console.log('URL search:', window.location.search);
      console.log('Parsed user param:', user);

      if (user && user.trim()) {
        console.log('Setting urlUser and name to:', user);
        setUrlUser(user.trim());
        setName(user.trim());
      } else {
        console.log('No user param found');
      }
    };

    checkUrlParams();

    // Also check when URL changes
    const handleUrlChange = () => checkUrlParams();
    window.addEventListener('popstate', handleUrlChange);

    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Cycle loading messages
  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % LOADING_MESSAGES.length;
        setLoadingMsg(LOADING_MESSAGES[i]);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleSameToYou = () => {
    setStep('thank_you');
  };

  const processGiftGeneration = async (recipientName: string) => {
    setStep('processing');
    setIsProcessing(true);

    try {
      // Magic delay for anticipation
      const minWait = new Promise(resolve => setTimeout(resolve, 3000));
      const giftPromise = generateChristmasGift(recipientName);
      
      const [result] = await Promise.all([giftPromise, minWait]);

      const data: GiftData = {
        recipient: recipientName,
        giftName: result.giftName,
        message: result.message,
        theme: result.theme as any,
        isInList: result.isInList
      };

      setGiftData(data);
      setIsProcessing(false);
      
      // Decision Logic: Is user in list?
      if (result.isInList) {
        setStep('ready_to_open'); // Go straight to box for nice list people
      } else {
        setStep('not_in_list'); // Intercept with modal for others
      }

    } catch (error) {
      console.error(error);
      setStep('input');
      setIsProcessing(false);
    }
  };

  const handleCheckList = () => {
    if (urlUser) {
      // Skip input step if user comes from URL
      processGiftGeneration(urlUser);
    } else {
      setStep('input');
    }
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    processGiftGeneration(name);
  };

  const handleProceedFromModal = () => {
    setStep('ready_to_open');
  };

  const handleReveal = () => {
    if (isOpeningBox) return;
    setIsOpeningBox(true);
    // Wait for animation before showing content (1.5s matches the css transitions)
    setTimeout(() => {
      setStep('revealed');
      setIsOpeningBox(false);
    }, 1500);
  };
  
  const handleReset = () => {
    const lowerName = name.toLowerCase();
    
    // --- Bhagwati Logic ---
    if (lowerName.includes('bhagwati')) {
       if (bhagwatiGiftIndex < BHAGWATI_EXTRA_GIFTS.length) {
         setGiftData(BHAGWATI_EXTRA_GIFTS[bhagwatiGiftIndex]);
         setBhagwatiGiftIndex(prev => prev + 1);
         setStep('ready_to_open'); 
         return;
       } 
       else if (step !== 'end_card') {
         setStep('end_card');
         return;
       }
    }

    // --- Ranjana Logic ---
    if (lowerName.includes('ranjana')) {
        if (ranjanaGiftIndex < RANJANA_EXTRA_GIFTS.length) {
            setGiftData(RANJANA_EXTRA_GIFTS[ranjanaGiftIndex]);
            setRanjanaGiftIndex(prev => prev + 1);
            setStep('ready_to_open');
            return;
        }
        else if (step !== 'end_card') {
            setStep('end_card');
            return;
        }
    }

    // --- Carl Sagan Logic ---
    if (lowerName.includes('carl sagan') || lowerName.includes('sagan')) {
        if (carlSaganGiftIndex < CARLSAGAN_EXTRA_GIFTS.length) {
            setGiftData(CARLSAGAN_EXTRA_GIFTS[carlSaganGiftIndex]);
            setCarlSaganGiftIndex(prev => prev + 1);
            setStep('ready_to_open');
            return;
        }
        else if (step !== 'end_card') {
            setStep('end_card');
            return;
        }
    }

    // --- Sierra Logic ---
    if (lowerName.includes('sierra')) {
        if (!sierraCardShown) {
            setSierraCardShown(true);
            setStep('end_card');
            return;
        }
    }

    // Default Reset Behavior
    setGiftData(null);
    if (!urlUser) {
        setName('');
    }
    // Reset special counters
    setBhagwatiGiftIndex(0);
    setRanjanaGiftIndex(0);
    setCarlSaganGiftIndex(0);
    setSierraCardShown(false);
    setStep('welcome');
  };

  // Helper flags
  const currentUser = urlUser || name;
  const isBhagwati = currentUser.toLowerCase().includes('bhagwati');
  const isRanjana = currentUser.toLowerCase().includes('ranjana');
  const isCarlSagan = currentUser.toLowerCase().includes('carl sagan') || currentUser.toLowerCase().includes('sagan');
  const isShubham = currentUser.toLowerCase().includes('shubham');
  const isSierra = currentUser.toLowerCase().includes('sierra');

  const hasMoreGifts =
      (isBhagwati && bhagwatiGiftIndex < BHAGWATI_EXTRA_GIFTS.length) ||
      (isRanjana && ranjanaGiftIndex < RANJANA_EXTRA_GIFTS.length) ||
      (isCarlSagan && carlSaganGiftIndex < CARLSAGAN_EXTRA_GIFTS.length);

  const isFinalGift =
      (isBhagwati && bhagwatiGiftIndex === BHAGWATI_EXTRA_GIFTS.length) ||
      (isRanjana && ranjanaGiftIndex === RANJANA_EXTRA_GIFTS.length) ||
      (isCarlSagan && carlSaganGiftIndex === CARLSAGAN_EXTRA_GIFTS.length) ||
      (isSierra && !sierraCardShown);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans text-slate-100">
      <Snowfall />
      <AudioPlayer />

      {/* Transparent overlay to let snowy body background show through but darken slightly for text contrast */}
      <div className="absolute inset-0 bg-[#0B1026]/70 z-0"></div>
      
      {/* Additional gradient for depth */}
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#0B1026] to-transparent pointer-events-none z-0"></div>

      <div className="z-10 w-full max-w-5xl px-4 flex flex-col items-center min-h-[600px] justify-center text-center">
        
        {/* STEP 1: WELCOME */}
        {step === 'welcome' && (
          <div className={`glass-card p-10 md:p-16 rounded-[2rem] w-full max-w-xl shadow-2xl animate-fade-in-up border relative overflow-hidden ${isBhagwati ? 'border-pink-300/30' : (isRanjana ? 'border-purple-300/30' : (isCarlSagan ? 'border-cyan-300/30' : (isShubham ? 'border-yellow-300/30' : 'border-blue-200/20')))}`}>
            
            {/* Custom Welcome Decorations */}
            {isBhagwati && (
              <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute top-10 left-10 text-4xl animate-float opacity-30">🌹</div>
                 <div className="absolute bottom-10 right-10 text-4xl animate-float opacity-30" style={{animationDelay: '1s'}}>🌸</div>
                 <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-transparent"></div>
              </div>
            )}
            
            {isRanjana && (
              <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute top-5 right-5 text-3xl animate-spin-slow opacity-50">✨</div>
                 <div className="absolute bottom-10 left-10 text-4xl animate-bounce opacity-30">🎈</div>
                 <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent"></div>
              </div>
            )}

            {isCarlSagan && (
              <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute top-10 left-10 text-cyan-300 text-3xl animate-pulse">🚀</div>
                 <div className="absolute bottom-20 right-10 text-cyan-200 text-4xl animate-bounce">🤖</div>
                 <div className="absolute top-5 right-5 text-cyan-400 text-2xl animate-spin-slow">⚡</div>
                 <div className="absolute bottom-10 left-1/4 text-cyan-300 text-2xl animate-float">💻</div>
                 <div className="absolute top-1/3 right-1/4 text-cyan-200 text-3xl animate-pulse" style={{animationDelay: '1s'}}>🧠</div>
                 <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent"></div>
              </div>
            )}

            {isShubham && (
              <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute top-10 left-1/4 text-yellow-300 text-2xl animate-pulse">✨</div>
                 <div className="absolute bottom-20 right-1/4 text-yellow-100 text-3xl animate-bounce">🌟</div>
                 <div className="absolute top-5 right-5 text-yellow-400 text-xl animate-spin-slow">⭐</div>
                 <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 via-transparent to-transparent"></div>
              </div>
            )}

            <div className="relative z-10">
              <div className="mb-6 text-6xl md:text-8xl animate-float">
                {isBhagwati ? '💝' : (isRanjana ? '🧚' : (isCarlSagan ? '🚀' : (isShubham ? '👑' : '🎄')))}
              </div>
              <h1 className="christmas-font text-6xl md:text-8xl text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] leading-tight">
                Happy Christmas{urlUser ? <span className={`block mt-2 ${isBhagwati ? 'text-pink-300' : (isRanjana ? 'text-purple-300' : (isCarlSagan ? 'text-cyan-300' : (isShubham ? 'gold-text' : 'text-yellow-300')))}`}>{urlUser}!</span> : '!'}
              </h1>
              <button
                onClick={handleSameToYou}
                className={`mt-8 px-10 py-4 rounded-full text-white font-bold text-xl hover:scale-105 transition-transform border shadow-lg ${isBhagwati ? 'bg-gradient-to-r from-pink-600 to-pink-400 border-pink-300 shadow-pink-500/30' : (isRanjana ? 'bg-gradient-to-r from-purple-600 to-indigo-500 border-purple-300 shadow-purple-500/30' : (isCarlSagan ? 'bg-gradient-to-r from-cyan-600 to-blue-500 border-cyan-300 shadow-cyan-500/30' : (isShubham ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 border-yellow-300 shadow-yellow-500/30 text-yellow-900' : 'bg-gradient-to-r from-green-700 to-green-500 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)]')))}`}
              >
                Same To You! 🎅
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: THANK YOU & NEW YEAR */}
        {step === 'thank_you' && (
          <div className="glass-card p-10 md:p-16 rounded-[2rem] w-full max-w-2xl shadow-2xl animate-slide-in border border-blue-200/20 overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
             
             <h2 className="serif text-3xl md:text-5xl text-yellow-200/90 mb-6 italic tracking-wide">
               Thank You{urlUser ? `, ${urlUser}` : ''}!
             </h2>
             
             <div className="relative py-8 my-6 border-t border-b border-white/10 bg-white/5 backdrop-blur-md rounded-xl">
               <p className="text-xl text-blue-100/80 font-light mb-2 uppercase tracking-[0.2em]">
                 Wishing you a prosperous
               </p>
               <h1 className="title-font text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-300 font-bold drop-shadow-2xl">
                 2026
               </h1>
               <p className="text-lg text-yellow-400 font-serif mt-2 italic">
                 in Advance
               </p>
             </div>
             
             <div className="flex justify-center mt-8">
               <button 
                 onClick={handleCheckList}
                 className="group relative px-10 py-5 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 rounded-full text-white text-lg font-bold shadow-[0_0_25px_rgba(234,179,8,0.4)] transition-all transform hover:-translate-y-1"
               >
                 {urlUser ? "Check My Gift" : "Check Your Gift List"} &rarr;
               </button>
             </div>
          </div>
        )}

        {/* STEP 3: INPUT */}
        {step === 'input' && (
          <div className="glass-card p-8 md:p-14 rounded-[2rem] w-full max-w-xl text-center shadow-2xl animate-slide-in border border-blue-200/20">
            <h1 className="christmas-font text-5xl md:text-6xl text-white mb-2 tracking-wide">
              Shubham Santa's List
            </h1>
            <p className="font-sans text-blue-100/80 mb-10 text-lg">
              Are you on the list? Let's check.
            </p>

            <form onSubmit={handleStart} className="flex flex-col gap-6">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..." 
                className="w-full bg-blue-900/30 border border-blue-200/30 rounded-2xl px-6 py-5 text-white text-2xl placeholder-blue-200/30 outline-none focus:border-white/60 focus:ring-1 focus:ring-white/50 transition-all text-center font-serif"
              />
              
              <button 
                type="submit"
                disabled={!name.trim()}
                className="group relative px-8 py-5 bg-gradient-to-r from-red-700 to-red-600 rounded-2xl text-white font-bold tracking-[0.1em] uppercase transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden border border-red-400/30"
              >
                <span className="relative z-10 text-xl">Check List & Get Gift</span>
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: PROCESSING */}
        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center animate-fade-in-up">
             <div className="relative">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400/20 blur-[80px] rounded-full animate-pulse`}></div>
                <GiftBox 
                  onClick={() => {}} 
                  isOpening={false} 
                  className="animate-float cursor-wait"
                />
             </div>
             
             <div className="mt-16 h-20 text-center">
                 <p className="text-blue-100 font-serif text-2xl animate-pulse">
                    {loadingMsg}
                 </p>
             </div>
          </div>
        )}

        {/* STEP 5: NOT IN LIST MODAL */}
        {step === 'not_in_list' && (
          <div className="glass-card p-1 md:p-2 rounded-[2rem] w-full max-w-2xl shadow-2xl animate-slide-in border border-red-200/20 relative overflow-hidden bg-[#fffdf5]">
             {/* Paper Texture Effect */}
             <div className="w-full h-full bg-[#0B1026] p-6 rounded-[1.8rem]">
               <div className="bg-[#fff1f1] text-slate-800 p-8 md:p-12 rounded-xl relative border border-red-900/10 shadow-inner">
                  
                  {/* Wax Seal */}
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-red-700 shadow-lg flex items-center justify-center border-4 border-red-800 text-red-900 font-bold text-xs transform rotate-12">
                     SANTA<br/>OFFICIAL
                  </div>

                  <h2 className="christmas-font text-5xl md:text-6xl text-red-700 mb-6 leading-tight">
                    From the Desk of Santa
                  </h2>
                  
                  <div className="text-left font-serif text-lg md:text-xl leading-relaxed text-slate-700 space-y-4">
                     <p>
                       <strong>Dear {name},</strong>
                     </p>
                     <p>
                       We checked the list twice, and it seems the elves might have missed a page! But here at the North Pole...
                     </p>
                     <p className="text-xl md:text-2xl text-red-600 font-bold italic py-2 border-l-4 border-red-400 pl-4 bg-red-50">
                       “Shubham Santa won't do discrimination!”
                     </p>
                     <p>
                       Even if you weren't on the list, kindness is for everyone. I have prepared a special gift just for you.
                     </p>
                  </div>
                  
                  <div className="mt-8 flex justify-center">
                    <button 
                      onClick={handleProceedFromModal}
                      className="group relative px-10 py-4 bg-gradient-to-r from-green-700 to-green-600 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 shadow-xl border border-green-500/50 flex items-center gap-3"
                    >
                      <span>🎁</span> Collect Your Gift
                    </button>
                  </div>
               </div>
             </div>
          </div>
        )}

        {/* STEP 6: READY TO OPEN */}
        {step === 'ready_to_open' && (
          <div className="flex flex-col items-center justify-center animate-fade-in-up">
             <div className="relative">
                {/* Glow for Ready State - Fades out on Open */}
                {/* Dynamic Glow Color */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 ${isBhagwati && bhagwatiGiftIndex > 0 ? 'bg-pink-500/30' : (isRanjana && ranjanaGiftIndex > 0 ? 'bg-purple-500/30' : 'bg-yellow-400/20')} blur-[80px] rounded-full transition-opacity duration-1000 ${isOpeningBox ? 'opacity-0' : 'animate-pulse'}`}></div>
                
                <GiftBox 
                  onClick={handleReveal} 
                  isOpening={isOpeningBox} 
                  giftName={giftData?.giftName}
                  // Stop floating when opening to avoid jumpy animation
                  className={isOpeningBox ? '' : 'animate-float cursor-pointer'}
                />
             </div>
             
             <div 
               className={`mt-24 h-20 text-center transition-all duration-500 ${isOpeningBox ? 'opacity-0 translate-y-10' : 'opacity-100'}`}
               onClick={handleReveal}
             >
                <div className="animate-bounce cursor-pointer">
                    <p className="text-white font-serif text-3xl drop-shadow-lg gold-text mb-2">
                       {hasMoreGifts ? "Another Surprise For You..." : (giftData?.isInList ? "Gift Found!" : "A Gift For You!")}
                    </p>
                    <p className="text-blue-200/70 text-sm uppercase tracking-widest">Tap to Open</p>
                </div>
             </div>
          </div>
        )}

        {/* STEP 7: REVEAL */}
        {step === 'revealed' && giftData && (
          <GiftReveal 
            data={giftData} 
            onReset={handleReset} 
            hasNextGift={hasMoreGifts || isFinalGift} 
          />
        )}

        {/* STEP 8: END CARD (Shared Logic, Different Content) */}
        {step === 'end_card' && (
           <div className={`glass-card p-8 md:p-14 rounded-[2rem] w-full max-w-2xl text-center shadow-[0_0_100px_rgba(255,255,255,0.2)] animate-fade-in-up border relative overflow-hidden bg-gradient-to-br ${isBhagwati ? 'from-pink-950/90 to-red-950/90 border-pink-400/50 shadow-pink-500/30' : (isRanjana ? 'from-indigo-950/90 to-purple-950/90 border-purple-400/50 shadow-purple-500/30' : (isCarlSagan ? 'from-slate-950/90 to-blue-950/90 border-cyan-400/50 shadow-cyan-500/30' : (isSierra ? 'from-slate-800 to-black border-yellow-500/20 shadow-yellow-500/10' : 'from-slate-900 to-slate-800')))}`}>
              
              {/* Floating Background Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                 {isBhagwati ? (
                   <>
                     <div className="absolute top-10 right-10 text-4xl animate-float opacity-20">❤️</div>
                     <div className="absolute bottom-10 left-10 text-4xl animate-float opacity-20" style={{animationDelay: '1.5s'}}>❤️</div>
                   </>
                 ) : isRanjana ? (
                   <>
                     <div className="absolute top-10 left-10 text-4xl animate-spin-slow opacity-30">⭐</div>
                     <div className="absolute bottom-10 right-10 text-4xl animate-float opacity-20" style={{animationDelay: '1s'}}>✨</div>
                   </>
                 ) : null}
              </div>

              <div className="relative z-10 font-serif">
                 <div className={`mb-6 inline-block p-4 rounded-full border ${isBhagwati ? 'bg-pink-500/10 border-pink-500/30' : (isRanjana ? 'bg-purple-500/10 border-purple-500/30' : (isCarlSagan ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-white/10'))}`}>
                    <span className="text-4xl">
                      {isSierra ? '🎅' : '💌'}
                    </span>
                 </div>
                 
                 <h2 className={`text-4xl md:text-5xl mb-8 italic drop-shadow-lg font-bold ${isBhagwati ? 'text-pink-200' : (isRanjana ? 'text-purple-200' : 'text-white')}`}>
                    {isSierra ? "A Note from Santa" : "One Last Thing..."}
                 </h2>

                 {isBhagwati && (
                   <div className="text-lg md:text-2xl leading-relaxed text-pink-100/90 space-y-6 italic">
                      <p>"We are far apart right now, but you are always in my heart."</p>
                      <p>I love you and I miss you deeply.</p>
                      <p>I was thinking about you, but today...</p>
                      <p className="text-3xl text-white font-bold py-2 animate-pulse">I am your Santa! Ho Ho Ho! 🎅</p>
                      <p>Have a great life ahead, my love.</p>
                      <p className="text-2xl mt-8 font-bold text-pink-300">See ya soon.</p>
                   </div>
                 )}

                 {isRanjana && (
                   <div className="text-lg md:text-2xl leading-relaxed text-purple-100/90 space-y-6 italic">
                      <p>"To my dearest little sister..."</p>
                      <p>No matter how big you get or how far you go, I will always be your big brother watching over you.</p>
                      <p>Keep dreaming, keep smiling, and remember...</p>
                      <p className="text-3xl text-white font-bold py-2 animate-pulse">I've always got your back! 🛡️</p>
                      <p>May your life be as magical as you are.</p>
                      <p className="text-2xl mt-8 font-bold text-purple-300">Merry Christmas, Choti!</p>
                   </div>
                 )}
                 
                 {isCarlSagan && (
                   <div className="text-lg md:text-2xl leading-relaxed text-cyan-100/90 space-y-6 italic">
                      <p>"To my brilliant brother, the tech visionary..."</p>
                      <p>You've always been ahead of your time, pushing the boundaries of what's possible with technology. From the first computers to quantum leaps forward, you've been the pioneer showing us the way.</p>
                      <p>Keep innovating, keep coding, keep exploring the infinite possibilities of technology...</p>
                      <p className="text-3xl text-white font-bold py-2 animate-pulse">The future belongs to dreamers like you! 🚀</p>
                      <p>May your code compile perfectly and your algorithms run flawlessly.</p>
                      <p className="text-2xl mt-8 font-bold text-cyan-300">Merry Christmas, Bro!</p>
                   </div>
                 )}

                 {isSierra && (
                   <div className="text-lg md:text-2xl leading-relaxed text-slate-200/90 space-y-6 italic">
                      <p>"Sorry I couldn't find the iPhone..."</p>
                      <p className="text-sm opacity-70">(...real ones are hard to email!)</p>
                      <p className="mt-8 font-bold text-yellow-200">
                        Your lovely Santa Shubham
                      </p>
                   </div>
                 )}

                 <div className={`mt-12 pt-8 border-t ${isBhagwati ? 'border-pink-500/30' : (isRanjana ? 'border-purple-500/30' : 'border-white/20')}`}>
                    <button
                      onClick={() => {
                        setBhagwatiGiftIndex(0);
                        setRanjanaGiftIndex(0);
                        setCarlSaganGiftIndex(0);
                        setSierraCardShown(false);
                        setGiftData(null);
                        setStep('welcome');
                      }}
                      className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-sm tracking-widest uppercase transition-colors"
                    >
                       Start Over
                    </button>
                 </div>
              </div>
           </div>
        )}

      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 w-full text-center">
         <p className="text-white/20 text-xs tracking-widest">Made with ❄️ by Shubham Santa</p>
      </div>
    </div>
  );
};

export default App;
