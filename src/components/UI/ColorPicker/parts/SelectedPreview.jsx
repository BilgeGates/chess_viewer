import { Check } from "lucide-react";

const SelectedPreview = ({ tempColor, getRgbValues, onCopy, onApply }) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-950/80 to-gray-900/80 rounded-xl border border-gray-700/50 backdrop-blur-sm">
      <div className="relative">
        <div
          className="w-16 h-16 rounded-xl border-2 border-gray-700 flex-shrink-0 shadow-xl"
          style={{ background: tempColor }}
        />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
      </div>

      <div className="flex-1">
        <div className="text-xs text-gray-500 mb-1 font-medium">
          Selected Color
        </div>
        <div className="text-sm font-mono text-gray-200 font-bold mb-0.5">
          {tempColor.toUpperCase()}
        </div>
        <button
          onClick={onCopy}
          className="text-xs text-blue-400 hover:text-blue-300 font-mono transition-colors outline-none focus:outline-none"
        >
          RGB: {getRgbValues()}
        </button>
      </div>

      <button
        onClick={onApply}
        className="px-5 py-3 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 flex items-center gap-2 outline-none focus:outline-none"
      >
        <Check className="w-4 h-4" />
        Apply
      </button>
    </div>
  );
};

export default SelectedPreview;
