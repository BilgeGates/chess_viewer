import { memo, useCallback } from 'react';
import { PALETTE_PIECES, getPieceImageKey } from '@/constants';
import { DraggablePiece } from '@/components/interactions';

/**
 * Sidebar palette of all 12 draggable chess pieces (6 white, 6 black).
 * @param {Object} props
 * @param {Object} props.pieceImages - Map of piece keys to preloaded Image elements
 * @param {boolean} props.isLoading - Whether piece images are still loading
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element}
 */
const PiecePalette = memo(function PiecePalette({ pieceImages, isLoading, className = '' }) {
  const whitePieces = PALETTE_PIECES.filter((p) => p.color === 'w');
  const blackPieces = PALETTE_PIECES.filter((p) => p.color === 'b');

  const renderPieceGroup = useCallback(
    (pieces, label) => (
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-center py-1.5 rounded-md text-white bg-accent border border-accent-hover">
          {label}
        </h3>
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {pieces.map((p) => {
            const imageKey = getPieceImageKey(p.piece);
            const pieceImage = pieceImages[imageKey];

            return (
              <div
                key={p.id}
                className={`
                  aspect-square rounded-md sm:rounded-lg
                  bg-surface-elevated hover:bg-surface-hover
                  border border-border/50 hover:border-accent/50
                  flex items-center justify-center
                  transition-all duration-150
                  hover:scale-[1.04]
                  ${isLoading ? 'opacity-50' : ''}
                `}
                title={p.name}
              >
                <DraggablePiece
                  piece={p.piece}
                  pieceImage={pieceImage}
                  isFromPalette={true}
                  size="60%"
                  disabled={isLoading || !pieceImage}
                />
              </div>
            );
          })}
        </div>
      </div>
    ),
    [pieceImages, isLoading]
  );

  return (
    <div className={`flex flex-col gap-3 sm:gap-4 ${className}`}>
      <div className="text-xs sm:text-sm font-semibold text-text-primary flex items-center gap-2 px-1">
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
        <span className="hidden sm:inline">Drag pieces to board</span>
        <span className="sm:hidden">Pieces</span>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        {renderPieceGroup(whitePieces, 'White')}
        {renderPieceGroup(blackPieces, 'Black')}
      </div>

    </div>
  );
});

PiecePalette.displayName = 'PiecePalette';

export default PiecePalette;
