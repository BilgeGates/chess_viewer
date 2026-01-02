import { BOARD_THEMES } from "../../../../constants/chessConstants";
import { hexToRgb } from "../../../../utils";

const ThemeMainView = ({ currentLight, currentDark, onThemeApply }) => {
  const getRgbString = (hex) => {
    const rgb = hexToRgb(hex);
    return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : "0, 0, 0";
  };

  return (
    <div className="p-5 space-y-5">
      {/* Preset Themes */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-400 tracking-wider">
          Preset Themes
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {Object.entries(BOARD_THEMES).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => onThemeApply(theme.light, theme.dark)}
              className="group relative px-2.5 py-3 bg-gray-900/80 hover:bg-gray-800/90 rounded-lg text-xs text-gray-300 hover:text-white transition-all overflow-hidden"
            >
              <div className="absolute inset-0 opacity-25 group-hover:opacity-35 transition-opacity flex">
                <div
                  className="w-1/2 h-full"
                  style={{ background: theme.light }}
                />
                <div
                  className="w-1/2 h-full"
                  style={{ background: theme.dark }}
                />
              </div>
              <span className="relative z-10 font-semibold drop-shadow-md">
                {theme.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Custom Colors (Read-Only Info Display) */}
      <div className="rounded-xl bg-gradient-to-br from-gray-900/70 via-gray-900/60 to-gray-900/70 p-5  backdrop-blur-sm space-y-4">
        <h4 className="text-sm font-bold text-gray-400">
          Current Custom Colors
        </h4>

        <div className="space-y-3">
          {/* Light Square Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-950/50 rounded-lg border border-gray-700/50">
            <div
              className="w-12 h-12 rounded-lg border-2 border-gray-700 flex-shrink-0"
              style={{ background: currentLight }}
            />
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">Light Square</div>
              <div className="text-sm font-mono text-gray-200 font-bold">
                {currentLight}
              </div>
              <div className="text-xs text-gray-500 font-mono">
                RGB: {getRgbString(currentLight)}
              </div>
            </div>
          </div>

          {/* Dark Square Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-950/50 rounded-lg border border-gray-700/50">
            <div
              className="w-12 h-12 rounded-lg border-2 border-gray-700 flex-shrink-0"
              style={{ background: currentDark }}
            />
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">Dark Square</div>
              <div className="text-sm font-mono text-gray-200 font-bold">
                {currentDark}
              </div>
              <div className="text-xs text-gray-500 font-mono">
                RGB: {getRgbString(currentDark)}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-700/50 text-center text-xs text-gray-500">
          Modify colors in the{" "}
          <span className="text-blue-400 font-semibold">Advanced Picker</span>{" "}
          tab
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-xl bg-gradient-to-br from-gray-900/70 via-gray-900/60 to-gray-900/70 p-5 border border-gray-700/60 backdrop-blur-sm">
        <h4 className="text-sm font-bold text-gray-400 mb-4">Board Preview</h4>
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-8 gap-0 overflow-hidden w-full max-w-[280px] aspect-square">
            {Array.from({ length: 64 }).map((_, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const isLight = (row + col) % 2 === 0;
              return (
                <div
                  key={i}
                  className="w-full h-full transition-colors duration-300"
                  style={{ background: isLight ? currentLight : currentDark }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ThemeMainView;
