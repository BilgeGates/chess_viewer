import React, { useCallback } from 'react';
import { Copy, RotateCcw, Shuffle } from 'lucide-react';

/**
 * Combines: Random, Reset, Copy buttons
 */
const PrimaryActions = React.memo(
  ({ onRandom, onReset, onCopy, copiedText, tempColor }) => {
    const handleRandomClick = useCallback(() => {
      onRandom();
    }, [onRandom]);

    const handleResetClick = useCallback(() => {
      onReset();
    }, [onReset]);

    const handleCopyClick = useCallback(() => {
      onCopy();
    }, [onCopy]);

    const isCopied = copiedText === tempColor;

    return (
      <div className="grid grid-cols-3 gap-2">
        {/* Random Button */}
        <button
          onClick={handleRandomClick}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-br from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/50 rounded-lg text-purple-300 text-xs font-semibold transition-all active:scale-95 outline-none"
        >
          <Shuffle className="w-3.5 h-3.5" />
          Random
        </button>

        {/* Reset Button */}
        <button
          onClick={handleResetClick}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-br from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/50 rounded-lg text-amber-300 text-xs font-semibold transition-all active:scale-95 outline-none"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>

        {/* Copy Button */}
        <button
          onClick={handleCopyClick}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-br from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/50 rounded-lg text-green-300 text-xs font-semibold transition-all active:scale-95 outline-none"
        >
          <Copy className="w-3.5 h-3.5" />
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.copiedText === nextProps.copiedText &&
      prevProps.tempColor === nextProps.tempColor
    );
  }
);

PrimaryActions.displayName = 'PrimaryActions';

export default PrimaryActions;
