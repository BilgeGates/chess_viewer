import { memo, useCallback } from 'react';
import {
  BOARD_THEMES,
  STARTING_FEN
} from '../../../../constants/chessConstants';
import {
  useChessBoard,
  usePieceImages,
  useIntersectionObserver
} from '../../../../hooks';

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
      className={`p-1 rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
        isActive
          ? 'border-primary-500 bg-primary-500/10'
          : 'border-gray-700/50 hover:border-gray-600'
      }`}
    >
      {isVisible ? (
        <>
          <div
            className="grid grid-cols-2 w-full aspect-square rounded overflow-hidden"
            aria-hidden="true"
          >
            <div style={{ backgroundColor: theme.light }} />
            <div style={{ backgroundColor: theme.dark }} />
            <div style={{ backgroundColor: theme.dark }} />
            <div style={{ backgroundColor: theme.light }} />
          </div>
          <div
            className="text-[8px] text-gray-400 mt-0.5 truncate text-center"
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

const ThemeMainView = memo(
  ({ currentLight, currentDark, onThemeApply, pieceStyle = 'cburnett' }) => {
    const boardState = useChessBoard(STARTING_FEN);
    const { pieceImages, isLoading } = usePieceImages(pieceStyle);

    const isBoardReady =
      boardState.length === 8 &&
      !isLoading &&
      Object.keys(pieceImages).length > 0;

    const handleThemeClick = useCallback(
      (key, theme) => {
        onThemeApply(theme.light, theme.dark);
      },
      [onThemeApply]
    );

    return (
      <div className="p-2 space-y-2">
        {/* Board Preview */}
        <div className="p-2 bg-gray-800/50 rounded border border-gray-700/50">
          <div className="text-[10px] text-gray-500 mb-1.5 font-medium">
            Preview
          </div>
          <div className="flex justify-center">
            {isBoardReady ? (
              <div
                className="grid grid-cols-8 w-48 h-48 border border-gray-700"
                style={{ contain: 'strict' }}
              >
                {Array.from({ length: 64 }).map((_, i) => {
                  const row = Math.floor(i / 8);
                  const col = i % 8;
                  const isLight = (row + col) % 2 === 0;
                  const piece = boardState[row]?.[col];

                  // Fix piece key mapping
                  let pieceImage = null;
                  if (piece) {
                    const color = piece === piece.toUpperCase() ? 'w' : 'b';
                    const pieceKey = color + piece.toUpperCase();
                    pieceImage = pieceImages[pieceKey];
                  }

                  return (
                    <div
                      key={`sq-${row}-${col}`}
                      className="flex items-center justify-center"
                      style={{
                        backgroundColor: isLight ? currentLight : currentDark
                      }}
                    >
                      {pieceImage && (
                        <img
                          src={pieceImage.src}
                          alt=""
                          className="w-[85%] h-[85%]"
                          draggable={false}
                          loading="lazy"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-48 h-48 bg-gray-800 flex items-center justify-center border border-gray-700">
                <div className="animate-spin w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full" />
              </div>
            )}
          </div>
        </div>

        {/* Current Colors */}
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'Light', color: currentLight },
            { label: 'Dark', color: currentDark }
          ].map(({ label, color }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 p-1.5 bg-gray-800/50 rounded border border-gray-700/50"
            >
              <div
                className="w-6 h-6 rounded border border-gray-600"
                style={{ backgroundColor: color }}
              />
              <div className="min-w-0">
                <div className="text-[9px] text-gray-500">{label}</div>
                <div className="text-[10px] font-mono text-gray-300 truncate">
                  {color}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Themes Grid */}
        <div>
          <div className="text-[10px] text-gray-500 mb-1 font-medium">
            Presets
          </div>
          <div
            className="grid grid-cols-5 gap-1 max-h-32 overflow-y-auto custom-scrollbar"
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
  }
);

ThemeMainView.displayName = 'ThemeMainView';
export default ThemeMainView;
