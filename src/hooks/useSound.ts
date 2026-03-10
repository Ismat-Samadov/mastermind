'use client';

import { useState, useEffect } from 'react';
import { soundManager } from '@/lib/soundManager';

/** Manages sound-effects and background music toggles with localStorage persistence. */
export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const s = localStorage.getItem('mastermind_sound');
    const m = localStorage.getItem('mastermind_music');
    if (s !== null) {
      const on = s === 'true';
      setSoundEnabled(on);
      soundManager.setEnabled(on);
    }
    if (m !== null) setMusicEnabled(m === 'true');
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundManager.setEnabled(next);
      localStorage.setItem('mastermind_sound', String(next));
      if (!next) soundManager.stopMusic();
      return next;
    });
  };

  const toggleMusic = () => {
    setMusicEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('mastermind_music', String(next));
      if (next && soundEnabled) {
        soundManager.startMusic();
      } else {
        soundManager.stopMusic();
      }
      return next;
    });
  };

  return { soundEnabled, musicEnabled, toggleSound, toggleMusic };
}
