'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/** Counts up in seconds while `running` is true. Call `reset` to go back to 0. */
export function useTimer(running: boolean) {
  const [time, setTime] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  const reset = useCallback(() => setTime(0), []);

  return { time, reset };
}
