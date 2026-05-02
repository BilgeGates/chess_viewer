import { memo, useCallback, useEffect } from 'react';

import { RotateCcw, X } from 'lucide-react';

import {
  CustomDragLayer,
  InteractiveBoard,
  PiecePalette,
  TrashZone
} from '@/components/interactions';
import { useInteractiveBoard, usePieceImages } from '@/hooks';

const FIXED_BOARD_SIZE = 400;
const RANK_GUTTER = 24;
const CELL_SIZE = FIXED_BOARD_SIZE / 8;

const ChessEditor = memo(function ChessEditor({
  fen,
  onFenChange,
  pieceStyle,
  showCoords,
  lightSquare,
  darkSquare,
  flipped,
  onPieceImagesChange,
  className = ''
}) {
  const { pieceImages, isLoading, loadProgress } = usePieceImages(pieceStyle);

  const {
    board,
    handlePieceDrop,
    handlePieceRemove,
    clearBoard,
    resetBoard,
    syncFromFen
  } = useInteractiveBoard(fen, onFenChange);

  useEffect(() => {
    syncFromFen(fen);
  }, [fen, syncFromFen]);

  useEffect(() => {
    onPieceImagesChange?.(pieceImages);
  }, [pieceImages, onPieceImagesChange]);

  const handleTrashDrop = useCallback(
    (row, col) => {
      handlePieceRemove(row, col);
    },
    [handlePieceRemove]
  );

  const renderFileCoordinates = () => {
    const files = flipped
      ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
      : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    return (
      <div className="flex mt-1" style={{ paddingLeft: `${RANK_GUTTER}px` }}>
        {files.map((file) => (
          <div
            key={file}
            className="text-[11px] font-semibold text-text-secondary text-center select-none"
            style={{ width: `${CELL_SIZE}px` }}
          >
            {file}
          </div>
        ))}
      </div>
    );
  };

  const renderRankCoordinates = () => {
    const ranks = flipped
      ? ['1', '2', '3', '4', '5', '6', '7', '8']
      : ['8', '7', '6', '5', '4', '3', '2', '1'];

    return (
      <div
        className="flex flex-col flex-shrink-0"
        style={{ width: `${RANK_GUTTER}px` }}
      >
        {ranks.map((rank) => (
          <div
            key={rank}
            className="flex items-center justify-center text-[11px] font-bold text-text-secondary select-none"
            style={{ height: `${CELL_SIZE}px` }}
          >
            {rank}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <CustomDragLayer pieceImages={pieceImages} boardSize={FIXED_BOARD_SIZE} />

      <div className={`flex flex-col gap-4 w-full h-full ${className}`}>
        {/* Yuxarı hissə: board + palette yan-yana */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start w-full min-h-0 flex-1">
          {/* Board */}
          <div className="flex-shrink-0 flex justify-center w-full sm:w-auto">
            <div
              className="relative flex flex-col"
              style={{
                width: showCoords
                  ? `${FIXED_BOARD_SIZE + RANK_GUTTER}px`
                  : `${FIXED_BOARD_SIZE}px`
              }}
            >
              <div className="flex">
                {showCoords && renderRankCoordinates()}
                <div
                  style={{
                    width: `${FIXED_BOARD_SIZE}px`,
                    height: `${FIXED_BOARD_SIZE}px`,
                    flexShrink: 0
                  }}
                >
                  <InteractiveBoard
                    board={board}
                    lightSquare={lightSquare}
                    darkSquare={darkSquare}
                    pieceImages={pieceImages}
                    isLoading={isLoading}
                    flipped={flipped}
                    onPieceDrop={handlePieceDrop}
                    onPieceRemove={handlePieceRemove}
                  />
                </div>
              </div>

              {showCoords && renderFileCoordinates()}

              {isLoading && (
                <div
                  className="absolute flex flex-col items-center justify-center bg-surface/90 backdrop-blur-sm z-50 animate-fadeInScale"
                  style={{
                    top: 0,
                    left: showCoords ? `${RANK_GUTTER}px` : 0,
                    width: `${FIXED_BOARD_SIZE}px`,
                    height: `${FIXED_BOARD_SIZE}px`
                  }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full border-4 border-border"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
                    </div>
                    <div className="text-text-primary text-sm font-semibold animate-pulse">
                      Loading pieces {loadProgress}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Palette + düymələr */}
          <div
            className="flex flex-col justify-between gap-4 flex-1 w-full sm:w-auto min-w-0"
            style={{ minHeight: `${FIXED_BOARD_SIZE}px` }}
          >
            <div className="flex-1">
              <PiecePalette
                pieceImages={pieceImages}
                isLoading={isLoading}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-3 flex-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    resetBoard();
                  }}
                  className="
                    flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                    text-sm font-semibold text-bg
                    bg-accent hover:bg-accent-hover
                    border border-accent/20
                    rounded-lg transition-all duration-200
                    hover:scale-105 active:scale-95 shadow-sm
                    hover:shadow-md hover:shadow-accent/25
                  "
                  title="Reset to starting position"
                >
                  <RotateCcw className="w-4 h-4 transition-transform duration-300 hover:rotate-180" />
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    clearBoard();
                  }}
                  className="
                    flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                    text-sm font-semibold text-text-secondary
                    bg-surface-elevated hover:bg-surface-hover
                    border border-border hover:border-error/40
                    rounded-lg transition-all duration-200
                    hover:scale-105 active:scale-95 shadow-sm
                    hover:text-error
                  "
                  title="Clear all pieces"
                >
                  <X className="w-4 h-4 transition-transform duration-200 hover:rotate-90" />
                  <span>Clear</span>
                </button>
              </div>

              <div className="flex-shrink-0">
                <TrashZone onDrop={handleTrashDrop} className="h-full w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

ChessEditor.displayName = 'ChessEditor';

export default ChessEditor;
