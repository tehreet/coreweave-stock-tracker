"use client"; // Required for useState, useEffect, useRef

import React, { useState, useEffect, useRef } from 'react';
import TradingViewWidget from '../components/TradingViewWidget';

// Placeholder URL - find a real .mp3 or .wav cowbell loop
const cowbellSoundUrl = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_b749a638c7.mp3'; // Example sound

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Effect to play/pause audio when isPlaying state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Audio play failed:", error);
          // Optionally reset state if play fails automatically
          // setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset audio to start
      }
    }
  }, [isPlaying]);

  const toggleSound = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      {/* Audio Element (hidden) */}
      <audio ref={audioRef} src={cowbellSoundUrl} loop preload="auto" />

      {/* Button to toggle sound */}  
      <button 
        onClick={toggleSound}
        className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 z-20"
      >
        {isPlaying ? 'Stop Cowbell ' : 'Needs More Cowbell! '}
      </button>
      
      {/* Container for the chart */}
      <div className="w-full max-w-4xl bg-gray-900/50 backdrop-blur-sm rounded-lg shadow-xl p-4 border border-gray-700 z-10">
         <TradingViewWidget />
      </div>
    </main>
  );
}
