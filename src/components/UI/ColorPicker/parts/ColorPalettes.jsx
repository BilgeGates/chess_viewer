import { Check } from "lucide-react";

const ColortPalettes = ({
  activePalette,
  setActivePalette,
  tempColor,
  onColorSelect,
}) => {
  const COLOR_PALETTES = {
    basic: [
      "#FFFFFF",
      "#000000",
      "#FF0000",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#FF00FF",
      "#00FFFF",
    ],
    grays: [
      "#FFFFFF",
      "#F5F5F5",
      "#E0E0E0",
      "#BDBDBD",
      "#9E9E9E",
      "#757575",
      "#424242",
      "#212121",
    ],
    warm: [
      "#FFEBEE",
      "#FFCDD2",
      "#EF5350",
      "#E53935",
      "#D32F2F",
      "#C62828",
      "#B71C1C",
      "#8B0000",
    ],
    cool: [
      "#E3F2FD",
      "#90CAF9",
      "#42A5F5",
      "#2196F3",
      "#1976D2",
      "#1565C0",
      "#0D47A1",
      "#001F3F",
    ],
    nature: [
      "#E8F5E9",
      "#A5D6A7",
      "#66BB6A",
      "#4CAF50",
      "#388E3C",
      "#2E7D32",
      "#1B5E20",
      "#004D40",
    ],
    sunset: [
      "#FFF3E0",
      "#FFE082",
      "#FFB74D",
      "#FF9800",
      "#F57C00",
      "#E65100",
      "#BF360C",
      "#3E2723",
    ],
    ocean: [
      "#E0F7FA",
      "#80DEEA",
      "#26C6DA",
      "#00BCD4",
      "#00ACC1",
      "#0097A7",
      "#00838F",
      "#006064",
    ],
    royal: [
      "#F3E5F5",
      "#CE93D8",
      "#AB47BC",
      "#9C27B0",
      "#8E24AA",
      "#7B1FA2",
      "#6A1B9A",
      "#4A148C",
    ],
  };

  return (
    <div>
      <div className="flex gap-1 mb-2 overflow-x-auto pb-1 scrollbar-hide">
        {Object.keys(COLOR_PALETTES).map((palette) => (
          <button
            key={palette}
            onClick={() => setActivePalette(palette)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all outline-none focus:outline-none ${
              activePalette === palette
                ? "bg-blue-600 text-white"
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
            }`}
          >
            {palette.charAt(0).toUpperCase() + palette.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-8 gap-1.5">
        {COLOR_PALETTES[activePalette].map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className="aspect-square rounded-lg border-2 transition-all hover:scale-110 active:scale-95 shadow-md hover:shadow-lg relative outline-none focus:outline-none"
            style={{
              background: color,
              borderColor: tempColor === color ? "#3b82f6" : "#374151",
            }}
          >
            {tempColor === color && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check
                  className="w-3 h-3 text-white drop-shadow-lg"
                  strokeWidth={3}
                />
              </div>
            )}
          </button>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ColortPalettes;
