import { Pipette } from "lucide-react";

const ColorInput = ({
  value,
  hexInput,
  onHexChange,
  onToggle,
  getRgbValues,
}) => {
  return (
    <div className="flex items-center gap-2 p-2.5 bg-gray-900/60 rounded-xl border border-gray-700/50 transition-all shadow-lg">
      <button
        onClick={onToggle}
        className="w-14 h-14 rounded-lg flex-shrink-0 transition-all shadow-lg hover:shadow-xl relative overflow-hidden group outline-none focus:outline-none focus-visible:outline-none focus:ring-0"
        style={{ background: value }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      <div className="flex-1 space-y-1">
        <input
          type="text"
          value={hexInput}
          onChange={onHexChange}
          onBlur={(e) => {
            if (!/^#[0-9A-F]{6}$/i.test(e.target.value)) {
              e.target.value = value;
            }
          }}
          className="w-full bg-gray-950/50 text-gray-200 text-sm font-mono font-bold px-3 py-2 rounded-lg focus:ring-0 focus:outline-none focus-visible:outline-none outline-none transition-all caret-blue-400"
          placeholder="#FFFFFF"
          maxLength={7}
        />
        <div className="text-xs text-gray-500 font-mono px-1">
          RGB: {getRgbValues()}
        </div>
      </div>

      <button
        onClick={onToggle}
        className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 rounded-lg transition-all shadow-lg outline-none focus:outline-none focus-visible:outline-none"
      >
        <Pipette className="w-5 h-5 text-blue-400" />
      </button>
    </div>
  );
};

export default ColorInput;
