// Renders the small 2×N grid of black/white feedback pegs for a guess row.
// Black = correct color & position. White = correct color, wrong position.

interface Props {
  blacks: number;
  whites: number;
  codeLength: number;
}

export default function FeedbackPegs({ blacks, whites, codeLength }: Props) {
  // Build an ordered array: blacks first, then whites, then empties
  const pegs = Array.from({ length: codeLength }, (_, i) => {
    if (i < blacks) return 'black';
    if (i < blacks + whites) return 'white';
    return 'empty';
  });

  // Two columns regardless of code length
  return (
    <div className="grid grid-cols-2 gap-[3px]">
      {pegs.map((type, i) => (
        <div
          key={i}
          title={
            type === 'black'
              ? 'Correct position & color'
              : type === 'white'
              ? 'Correct color, wrong position'
              : 'No match'
          }
          className={`w-[10px] h-[10px] rounded-full transition-all duration-300 ${
            type === 'black'
              ? 'bg-yellow-400 shadow-sm shadow-yellow-400/70'
              : type === 'white'
              ? 'bg-gray-200 shadow-sm shadow-white/50'
              : 'bg-gray-700/40 border border-gray-600/20'
          }`}
        />
      ))}
    </div>
  );
}
