import { memo, useCallback } from 'react';
import { BOARD_THEMES } from '../../../../constants/chessConstants';
import { useIntersectionObserver } from '../../../../hooks';

const ThemePresetButton = memo(({ themeKey, theme, isActive, onClick }) => {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  return (
    <button
      ref={ref}
      onClick={() => onClick(themeKey, theme)}
      aria-label={`Apply ${theme.name || themeKey} theme: light ${theme.light}, dark ${theme.dark}`}
      className={`p-2 rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 hover:scale-105 ${
        isActive
          ? 'border-primary-500 bg-primary-500/20 shadow-lg shadow-primary-500/20'
          : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/30'
      }`}
    >
      {isVisible ? (
        <>
          <div
            className="grid grid-cols-2 w-full aspect-square rounded overflow-hidden shadow-md"
            aria-hidden="true"
          >
            <div style={{ backgroundColor: theme.light }} />
            <div style={{ backgroundColor: theme.dark }} />
            <div style={{ backgroundColor: theme.dark }} />
            <div style={{ backgroundColor: theme.light }} />
          </div>
          <div
            className="text-[9px] text-gray-300 mt-1.5 truncate text-center font-medium"
            aria-hidden="true"
          >
            {theme.name || themeKey}
          </div>
        </>
      ) : (
        <div
          className="w-full aspect-square bg-gray-800 rounded animate-pulse"
          aria-hidden="true"
        />
      )}
    </button>
  );
});

ThemePresetButton.displayName = 'ThemePresetButton';

const ThemeMainView = memo(({ currentLight, currentDark, onThemeApply }) => {
  const handleThemeClick = useCallback(
    (key, theme) => {
      onThemeApply(theme.light, theme.dark);
    },
    [onThemeApply]
  );

  return (
    <div className="p-3 space-y-3">
      {/* Board Preview */}
      <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <div className="text-xs text-gray-400 mb-2 font-medium">Preview</div>
        <div className="flex justify-center">
          <div
            className="grid grid-cols-8 w-64 h-64 border-2 border-gray-700 rounded shadow-lg"
            style={{ contain: 'strict' }}
          >
            {Array.from({ length: 64 }).map((_, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const isLight = (row + col) % 2 === 0;

              return (
                <div
                  key={`sq-${row}-${col}`}
                  style={{
                    backgroundColor: isLight ? currentLight : currentDark
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Current Colors */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Light Square', color: currentLight },
          { label: 'Dark Square', color: currentDark }
        ].map(({ label, color }) => (
          <div
            key={label}
            className="flex items-center gap-2 p-2.5 bg-gray-800/50 rounded-lg border border-gray-700/50"
          >
            <div
              className="w-10 h-10 rounded border-2 border-gray-600 shadow-sm"
              style={{ backgroundColor: color }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-400 mb-0.5">{label}</div>
              <div className="text-xs font-mono text-gray-200 truncate font-semibold">
                {color}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Themes Grid */}
      <div>
        <div className="text-xs text-gray-400 mb-2 font-medium">Presets</div>
        <div
          className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1"
          role="group"
          aria-label="Theme preset options"
        >
          {Object.entries(BOARD_THEMES).map(([key, theme]) => {
            const isActive =
              theme.light === currentLight && theme.dark === currentDark;
            return (
              <ThemePresetButton
                key={key}
                themeKey={key}
                theme={theme}
                isActive={isActive}
                onClick={handleThemeClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

ThemeMainView.displayName = 'ThemeMainView';
export default ThemeMainView;
