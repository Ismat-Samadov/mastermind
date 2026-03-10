'use client';

// Screen for AI-breaks mode: the player builds their secret code before the AI starts.

import { motion } from 'framer-motion';
import type { PegColor, Difficulty } from '@/types/game';
import { PEG_COLORS, PEG_COLOR_STYLES, DIFFICULTY_CONFIGS } from '@/lib/constants';

interface Props {
  playerCode: (PegColor | null)[];
  difficulty: Difficulty;
  selectedColor: PegColor | null;
  onSelectColor: (color: PegColor) => void;
  onSetPeg: (index: number, color: PegColor | null) => void;
  onConfirm: () => void;
}

export default function SetupCode({
  playerCode,
  difficulty,
  selectedColor,
  onSelectColor,
  onSetPeg,
  onConfirm,
}: Props) {
  const cfg = DIFFICULTY_CONFIGS[difficulty];
  const colors = PEG_COLORS.slice(0, cfg.numColors);
  const complete = playerCode.slice(0, cfg.codeLength).every((p) => p !== null);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: '#050010', color: '#e0e0ff' }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-black text-cyan-400 tracking-widest mb-2">SET YOUR CODE</h2>
        <p className="text-gray-400 text-sm">
          Choose {cfg.codeLength} colors — the AI will try to crack it!
        </p>
      </motion.div>

      {/* Code slots */}
      <div className="flex gap-3 mb-8">
        {Array.from({ length: cfg.codeLength }).map((_, i) => {
          const color = playerCode[i];
          const s = color ? PEG_COLOR_STYLES[color] : null;
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (selectedColor) {
                  onSetPeg(i, selectedColor);
                } else if (color) {
                  onSetPeg(i, null);
                }
              }}
              aria-label={`Slot ${i + 1}${color ? `: ${PEG_COLOR_STYLES[color].label}` : ' (empty)'}`}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/25 hover:border-white/50 transition-all"
              // Dynamic peg color — must use inline style (runtime value)
              style={
                s
                  ? { backgroundColor: s.bg, boxShadow: `0 0 18px ${s.glow}` }
                  : { backgroundColor: 'rgba(255,255,255,0.05)' }
              }
            />
          );
        })}
      </div>

      {/* Color picker */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {colors.map((color) => {
          const s = PEG_COLOR_STYLES[color];
          const active = selectedColor === color;
          return (
            <motion.button
              key={color}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSelectColor(color)}
              aria-label={s.label}
              aria-pressed={active}
              className={`w-11 h-11 rounded-full border-2 transition-all ${
                active ? 'border-white' : 'border-transparent'
              }`}
              // Dynamic peg color — must use inline style (runtime value)
              style={{
                backgroundColor: s.bg,
                transform: active ? 'scale(1.12) translateY(-3px)' : undefined,
                boxShadow: active
                  ? `0 0 22px ${s.glow}, 0 0 44px ${s.ring}`
                  : `0 0 7px ${s.ring}`,
              }}
            />
          );
        })}
      </div>

      {/* Confirm */}
      <motion.button
        whileHover={{ scale: complete ? 1.06 : 1 }}
        whileTap={{ scale: complete ? 0.94 : 1 }}
        onClick={onConfirm}
        disabled={!complete}
        className={`px-10 py-3 rounded-xl font-bold text-sm transition-all ${
          complete
            ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/45'
            : 'bg-gray-700/30 text-gray-600 cursor-not-allowed border border-gray-700/30'
        }`}
      >
        {complete ? 'Challenge the AI →' : `Fill all ${cfg.codeLength} slots`}
      </motion.button>
    </div>
  );
}
