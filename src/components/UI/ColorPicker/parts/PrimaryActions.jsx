import { Copy, RotateCcw, Shuffle } from "lucide-react";

const PrimaryActions = ({
  onRandom,
  onReset,
  onCopy,
  copiedText,
  tempColor,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={onRandom}
        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-br from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/50 rounded-lg text-purple-300 text-xs font-semibold transition-all active:scale-95 outline-none focus:outline-none"
      >
        <Shuffle className="w-3.5 h-3.5" />
        Random
      </button>

      <button
        onClick={onReset}
        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-br from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/50 rounded-lg text-amber-300 text-xs font-semibold transition-all active:scale-95 outline-none focus:outline-none"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset
      </button>

      <button
        onClick={onCopy}
        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-br from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/50 rounded-lg text-green-300 text-xs font-semibold transition-all active:scale-95 outline-none focus:outline-none"
      >
        <Copy className="w-3.5 h-3.5" />
        {copiedText === tempColor ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default PrimaryActions;
