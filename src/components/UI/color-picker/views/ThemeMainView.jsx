import { useCallback, useState } from 'react';
import {
  BOARD_THEMES,
  STARTING_FEN
} from '../../../../constants/chessConstants';
import { useChessBoard, usePieceImages } from '../../../../hooks';
import ThemePresetCard from '../parts/ThemePresetCard';

/**
 * Displays preset themes and current custom colors (read-only)
 */

const ThemeMainView = ({
  currentLight,
  currentDark,
  onThemeApply,
  pieceStyle = 'cburnett'
}) => {
  const [hoveredKey, setHoveredKey] = useState(null);

  // Get starting position for preview
  const boardState = useChessBoard(STARTING_FEN);
  const { pieceImages, isLoading: imagesLoading } = usePieceImages(pieceStyle);

  // Check if board is ready
  const isBoardReady =
    boardState.length === 8 &&
    !imagesLoading &&
    Object.keys(pieceImages).length > 0;

  const handleThemeClick = useCallback(
    (_key, theme) => {
      onThemeApply(theme.light, theme.dark);
    },
    [onThemeApply]
  );

  return (
    <div className="p-4 space-y-4">
      {/* Board Preview with Pieces */}
      <div className="rounded-xl bg-gradient-to-br from-gray-900/70 via-gray-900/60 to-gray-900/70 p-4 border border-gray-700/60 backdrop-blur-sm">
        <h4 className="text-sm font-bold text-gray-400 mb-3">Live Preview</h4>
        <div className="flex items-center justify-center">
          {isBoardReady ? (
            <div className="grid grid-cols-8 gap-0 overflow-hidden rounded-lg shadow-2xl w-full max-w-[240px] aspect-square">
              {Array.from({ length: 64 }).map((_, i) => {
                const row = Math.floor(i / 8);
                const col = i % 8;
                const isLight = (row + col) % 2 === 0;
                const piece = boardState[row]?.[col] || '';
                const pieceImage = piece && pieceImages[piece];
                return (
                  <div
                    key={`preview-${row}-${col}`}
                    className="aspect-square flex items-center justify-center relative transition-colors duration-300"
                    style={{ background: isLight ? currentLight : currentDark }}
                  >
                    {pieceImage && (
                      <img
                        src={pieceImage.src}
                        alt={piece}
                        className="w-[85%] h-[85%] object-contain"
                        draggable="false"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full max-w-[240px] aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500 mx-auto mb-2"></div>
                <p className="text-xs text-gray-400">Loading board...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Colors */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-3 bg-gray-950/50 rounded-lg border border-gray-700/50">
          <div
            className="w-10 h-10 rounded-lg border-2 border-gray-700 flex-shrink-0 shadow-inner"
            style={{ background: currentLight }}
          />
          <div className="min-w-0">
            <div className="text-xs text-gray-500">Light Square</div>
            <div className="text-xs font-mono text-gray-200 font-bold truncate">
              {currentLight}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-gray-950/50 rounded-lg border border-gray-700/50">
          <div
            className="w-10 h-10 rounded-lg border-2 border-gray-700 flex-shrink-0 shadow-inner"
            style={{ background: currentDark }}
          />
          <div className="min-w-0">
            <div className="text-xs text-gray-500">Dark Square</div>
            <div className="text-xs font-mono text-gray-200 font-bold truncate">
              {currentDark}
            </div>
          </div>
        </div>
      </div>

      {/* Preset Themes */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-400 tracking-wider">
          Preset Themes
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
          {Object.entries(BOARD_THEMES).map(([key, theme]) => {
            const isActive =
              theme.light === currentLight && theme.dark === currentDark;

            return (
              <ThemePresetCard
                key={key}
                theme={theme}
                themeKey={key}
                isActive={isActive}
                isHovered={hoveredKey === key}
                onHover={() => setHoveredKey(key)}
                onLeave={() => setHoveredKey(null)}
                onClick={handleThemeClick}
              />
            );
          })}
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-700/50">
        Use <span className="text-blue-400 font-semibold">Advanced Picker</span>{' '}
        tab for custom colors
      </div>
    </div>
  );
};

ThemeMainView.displayName = 'ThemeMainView';

export default ThemeMainView;
