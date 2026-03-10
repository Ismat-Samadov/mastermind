'use client';

import { useState, useCallback } from 'react';
import type { GameState, PegColor, Difficulty, GameMode } from '@/types/game';
import { DIFFICULTY_CONFIGS } from '@/lib/constants';
import {
  generateSecretCode,
  calculateFeedback,
  calculateScore,
  isGuessComplete,
} from '@/lib/gameLogic';
import { easyAiGuess, hardAiGuess } from '@/lib/aiSolver';
import { soundManager } from '@/lib/soundManager';

// ─── Initial state ────────────────────────────────────────────────────────────

const blank = (len: number): (PegColor | null)[] => Array(len).fill(null);

const INITIAL: GameState = {
  secretCode: [],
  guesses: [],
  currentGuess: blank(4),
  activeSlot: 0,
  selectedColor: null,
  status: 'menu',
  difficulty: 'medium',
  mode: 'player-breaks',
  score: 0,
  timeElapsed: 0,
  aiGuesses: [],
  playerCode: blank(4),
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGame() {
  const [state, setState] = useState<GameState>(INITIAL);

  /** Start a new game with chosen difficulty + mode */
  const startGame = useCallback((difficulty: Difficulty, mode: GameMode) => {
    const cfg = DIFFICULTY_CONFIGS[difficulty];
    const empty = blank(cfg.codeLength);

    if (mode === 'player-breaks') {
      // AI generates a secret; player must crack it
      const secretCode = generateSecretCode(cfg.numColors, cfg.codeLength);
      setState({ ...INITIAL, secretCode, currentGuess: empty, playerCode: empty, status: 'playing', difficulty, mode });
    } else {
      // Player sets up their code; AI will crack it
      setState({ ...INITIAL, currentGuess: empty, playerCode: empty, status: 'setup', difficulty, mode });
    }
    soundManager.click();
  }, []);

  /** Finalise the player-defined code for AI-breaks mode */
  const confirmPlayerCode = useCallback(() => {
    setState((prev) => {
      const cfg = DIFFICULTY_CONFIGS[prev.difficulty];
      if (!isGuessComplete(prev.playerCode, cfg.codeLength)) return prev;
      soundManager.click();
      return { ...prev, secretCode: prev.playerCode as PegColor[], status: 'playing', aiGuesses: [] };
    });
  }, []);

  /** Select a color from the palette (works in playing + setup) */
  const selectColor = useCallback((color: PegColor) => {
    setState((prev) => {
      if (prev.status !== 'playing' && prev.status !== 'setup') return prev;
      soundManager.selectColor();
      return { ...prev, selectedColor: color };
    });
  }, []);

  /** Set a peg in the player-defined code (setup mode) */
  const setPlayerCodePeg = useCallback((slotIndex: number, color: PegColor | null) => {
    setState((prev) => {
      if (prev.status !== 'setup') return prev;
      const newCode = [...prev.playerCode];
      newCode[slotIndex] = color;
      soundManager.placePeg();
      return { ...prev, playerCode: newCode };
    });
  }, []);

  /** Place the selected color into a slot of the current guess */
  const placePeg = useCallback((slotIndex?: number) => {
    setState((prev) => {
      if (prev.status !== 'playing' || prev.mode !== 'player-breaks') return prev;
      if (!prev.selectedColor) return prev;

      const cfg = DIFFICULTY_CONFIGS[prev.difficulty];
      const target = slotIndex ?? prev.currentGuess.findIndex((p) => p === null);
      if (target === -1 || target >= cfg.codeLength) return prev;

      const newGuess = [...prev.currentGuess];
      newGuess[target] = prev.selectedColor;

      // Advance the active slot to the next empty one
      const next = newGuess.findIndex((p, i) => i > target && p === null);
      soundManager.placePeg();
      return { ...prev, currentGuess: newGuess, activeSlot: next === -1 ? target : next };
    });
  }, []);

  /** Remove a peg from a specific slot */
  const removePeg = useCallback((slotIndex: number) => {
    setState((prev) => {
      if (prev.status !== 'playing' || prev.mode !== 'player-breaks') return prev;
      const newGuess = [...prev.currentGuess];
      newGuess[slotIndex] = null;
      soundManager.removePeg();
      return { ...prev, currentGuess: newGuess, activeSlot: slotIndex };
    });
  }, []);

  /** Submit the current guess and evaluate feedback */
  const submitGuess = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'playing' || prev.mode !== 'player-breaks') return prev;

      const cfg = DIFFICULTY_CONFIGS[prev.difficulty];
      if (!isGuessComplete(prev.currentGuess, cfg.codeLength)) return prev;

      const feedback = calculateFeedback(prev.currentGuess, prev.secretCode);
      soundManager.submitGuess();

      const newGuesses = [
        ...prev.guesses,
        { pegs: prev.currentGuess.filter(Boolean) as PegColor[], feedback },
      ];
      const empty = blank(cfg.codeLength);

      if (feedback.blacks === cfg.codeLength) {
        // Player wins
        const score = calculateScore(prev.difficulty, newGuesses.length, cfg.maxGuesses, prev.timeElapsed);
        soundManager.win();
        return { ...prev, guesses: newGuesses, currentGuess: empty, status: 'won', score };
      }

      if (newGuesses.length >= cfg.maxGuesses) {
        // Player loses
        soundManager.lose();
        return { ...prev, guesses: newGuesses, currentGuess: empty, status: 'lost', score: 0 };
      }

      return { ...prev, guesses: newGuesses, currentGuess: empty, activeSlot: 0 };
    });
  }, []);

  /** Advance the AI one step in AI-breaks mode */
  const stepAiGuess = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'playing' || prev.mode !== 'ai-breaks') return prev;

      const cfg = DIFFICULTY_CONFIGS[prev.difficulty];
      const history = prev.aiGuesses.map((g) => ({ guess: g.pegs, feedback: g.feedback }));

      const aiGuess =
        prev.difficulty === 'hard'
          ? hardAiGuess(history, cfg.numColors, cfg.codeLength)
          : easyAiGuess(history, cfg.numColors, cfg.codeLength);

      const feedback = calculateFeedback(aiGuess, prev.secretCode);
      const newAiGuesses = [...prev.aiGuesses, { pegs: aiGuess, feedback }];

      if (feedback.blacks === cfg.codeLength) {
        // AI wins → player loses
        soundManager.lose();
        return { ...prev, aiGuesses: newAiGuesses, status: 'lost', score: 0 };
      }

      if (newAiGuesses.length >= cfg.maxGuesses) {
        // AI failed → player wins
        const score = calculateScore(prev.difficulty, cfg.maxGuesses, cfg.maxGuesses, prev.timeElapsed);
        soundManager.win();
        return { ...prev, aiGuesses: newAiGuesses, status: 'won', score };
      }

      soundManager.submitGuess();
      return { ...prev, aiGuesses: newAiGuesses };
    });
  }, []);

  const pauseGame = useCallback(() => {
    setState((prev) => (prev.status === 'playing' ? { ...prev, status: 'paused' } : prev));
  }, []);

  const resumeGame = useCallback(() => {
    setState((prev) => (prev.status === 'paused' ? { ...prev, status: 'playing' } : prev));
  }, []);

  const setTimeElapsed = useCallback((t: number) => {
    setState((prev) => ({ ...prev, timeElapsed: t }));
  }, []);

  const setActiveSlot = useCallback((slot: number) => {
    setState((prev) => ({ ...prev, activeSlot: slot }));
  }, []);

  const resetToMenu = useCallback(() => {
    setState(INITIAL);
    soundManager.stopMusic();
  }, []);

  return {
    state,
    startGame,
    confirmPlayerCode,
    selectColor,
    setPlayerCodePeg,
    placePeg,
    removePeg,
    submitGuess,
    stepAiGuess,
    pauseGame,
    resumeGame,
    setTimeElapsed,
    setActiveSlot,
    resetToMenu,
  };
}
