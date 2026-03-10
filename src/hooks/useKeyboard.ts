'use client';

import { useEffect } from 'react';
import type { PegColor } from '@/types/game';
import { PEG_COLORS, DIFFICULTY_CONFIGS } from '@/lib/constants';

interface Props {
  status: string;
  currentGuess: (PegColor | null)[];
  difficulty: string;
  onSelectColor: (color: PegColor) => void;
  onPlacePeg: () => void;
  onRemovePeg: (index: number) => void;
  onSubmit: () => void;
  onPause: () => void;
  onResume: () => void;
}

/**
 * Global keyboard handler.
 * 1–8  → select color
 * Space → place selected color into the next empty slot
 * Enter → submit current guess
 * Backspace → remove rightmost filled peg
 * P / Escape → pause / resume
 */
export function useKeyboard({
  status,
  currentGuess,
  difficulty,
  onSelectColor,
  onPlacePeg,
  onRemovePeg,
  onSubmit,
  onPause,
  onResume,
}: Props) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      // Pause / resume
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (status === 'paused') { onResume(); return; }
        if (status === 'playing') { onPause(); return; }
      }

      if (status !== 'playing') return;

      // Number keys 1–8: select color
      const n = parseInt(e.key);
      if (n >= 1 && n <= 8) {
        const color = PEG_COLORS[n - 1];
        if (color) { onSelectColor(color); return; }
      }

      // Space: place current color
      if (e.key === ' ') {
        e.preventDefault();
        onPlacePeg();
        return;
      }

      // Enter: submit guess
      if (e.key === 'Enter') {
        onSubmit();
        return;
      }

      // Backspace: remove last peg
      if (e.key === 'Backspace') {
        const len = DIFFICULTY_CONFIGS[difficulty]?.codeLength ?? 4;
        for (let i = len - 1; i >= 0; i--) {
          if (currentGuess[i] !== null) {
            onRemovePeg(i);
            break;
          }
        }
        return;
      }
    };

    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [status, currentGuess, difficulty, onSelectColor, onPlacePeg, onRemovePeg, onSubmit, onPause, onResume]);
}
