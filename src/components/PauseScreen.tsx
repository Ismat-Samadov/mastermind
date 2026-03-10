'use client';

// Pause overlay with resume and quit options.

import { motion } from 'framer-motion';

interface Props {
  onResume: () => void;
  onMenu: () => void;
}

export default function PauseScreen({ onResume, onMenu }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="bg-gray-950/98 border border-cyan-500/30 rounded-2xl p-8 max-w-xs w-full text-center"
      >
        <div className="text-5xl mb-4">⏸</div>
        <h2 className="text-2xl font-black text-cyan-400 tracking-widest mb-6">PAUSED</h2>
        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onResume}
            className="py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all shadow-lg shadow-cyan-500/35"
          >
            Resume <span className="opacity-60 text-xs">(P)</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onMenu}
            className="py-3 rounded-xl bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 hover:text-white border border-gray-700/30 transition-all"
          >
            Main Menu
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
