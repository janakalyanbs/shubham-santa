import React, { useState, useEffect, useRef } from 'react';

// Default fallback (public domain) for festive theme
const DEFAULT_FESTIVE = "https://actions.google.com/sounds/v1/holidays/jingle_bells.ogg";

const THEME_MAP: Record<string, string> = {
  festive: DEFAULT_FESTIVE,
  romantic: "/romantic.mp3",
  whimsical: "/other.mp3",
  cosmic: "/other.mp3",
  tech: "/other.mp3",
  classic: "/other.mp3",
  inspiration: "/other.mp3",
};

interface Props {
  theme?: string | null;
  autoplayOnTheme?: boolean;
  onAutoplayHandled?: () => void;
}

const AudioPlayer: React.FC<Props> = ({ theme = 'festive', autoplayOnTheme = false, onAutoplayHandled }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chimeRef = useRef<HTMLAudioElement | null>(null);

  // Initialize with the default festive loop so manual toggles still work
  useEffect(() => {
    audioRef.current = new Audio(THEME_MAP.festive);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (chimeRef.current) {
        chimeRef.current.pause();
        chimeRef.current = null;
      }
    };
  }, []);

  // When a theme is requested to autoplay (triggered by a user gesture), play a chime then the theme loop
  useEffect(() => {
    if (!autoplayOnTheme || !theme) return;

    try {
      const chime = new Audio('/audio/chime.ogg');
      chime.volume = 0.45;
      chimeRef.current = chime;

      // After chime ends, start theme background loop
      chime.onended = () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const bg = new Audio(THEME_MAP[theme] || THEME_MAP.festive);
        bg.loop = true;
        bg.volume = 0.3;
        audioRef.current = bg;
        bg.play().then(() => setIsPlaying(true)).catch(() => {});
        if (onAutoplayHandled) onAutoplayHandled();
      };

      chime.play().catch(() => {
        // If chime fails (autoplay policy), fall back to starting the theme immediately
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const bg = new Audio(THEME_MAP[theme] || THEME_MAP.festive);
        bg.loop = true;
        bg.volume = 0.3;
        audioRef.current = bg;
        bg.play().then(() => setIsPlaying(true)).catch(() => {});
        if (onAutoplayHandled) onAutoplayHandled();
      });
    } catch (e) {
      console.error('Audio autoplay failed', e);
      if (onAutoplayHandled) onAutoplayHandled();
    }
  }, [autoplayOnTheme, theme, onAutoplayHandled]);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(THEME_MAP[theme] || THEME_MAP.festive);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error('Playback failed', e));
    }
  };

  return (
    <button
      onClick={togglePlay}
      className="fixed bottom-6 right-6 z-50 glass p-3 rounded-full text-white hover:bg-white/10 transition-all duration-300 shadow-[0_0_15px_rgba(255,215,0,0.3)] group"
      aria-label={isPlaying ? "Mute Music" : "Play Music"}
    >
      {isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:text-yellow-300">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:text-yellow-300">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      )}
    </button>
  );
};

export default AudioPlayer;