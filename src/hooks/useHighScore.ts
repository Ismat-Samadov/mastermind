'use client';

import { useState, useEffect } from 'react';

const HS_KEY = 'mastermind_high_score';

/** Persists and retrieves the all-time high score from localStorage. */
export function useHighScore() {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(HS_KEY);
    if (stored) setHighScore(parseInt(stored, 10));
  }, []);

  const updateHighScore = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(HS_KEY, String(score));
    }
  };

  return { highScore, updateHighScore };
}
