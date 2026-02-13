import { memo, useCallback, useEffect } from 'react';
import {
  DndProvider,
  InteractiveBoard,
  PiecePalette,
  TrashZone,
  CustomDragLayer
} from '@/components/interactions';
import { usePieceImages, useInteractiveBoard } from '@/hooks';
import { RotateCcw, X } from 'lucide-react';

const FIXED_BOARD_SIZE = 400;
const RANK_GUTTER = 20;
const BOARD_SIZE_EXPR = 'min(52vh, 46vw)';
const CELL_SIZE_EXPR = `calc(${BOARD_SIZE_EXPR} / 8)`;

const ChessEditor = memo(
  ({
    fen,
    onFenChange,
    pieceStyle,
    showCoords,
    lightSquare,
    darkSquare,
    flipped,
    boardSize = FIXED_BOARD_SIZE,
    className = ''
  }) => {
    const { pieceImages, isLoading, loadProgress } = usePieceImages(pieceStyle);

    const {
      board,
      boardKey,
      handlePieceDrop,
      handlePieceRemove,
      clearBoard,
      resetBoard,
      syncFromFen
    } = useInteractiveBoard(fen, onFenChange);

    useEffect(() => {
      syncFromFen(fen);
    }, [fen, syncFromFen]);

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
        <div className="flex" style={{ paddingLeft: RANK_GUTTER }}>
          {files.map((file) => (
            <div
              key={file}
              className="text-[12px] font-bold text-text-primary text-center mt-1"
              style={{ width: CELL_SIZE_EXPR }}
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
          style={{ width: RANK_GUTTER }}
        >
          {ranks.map((rank) => (
            <div
              key={rank}
              className="flex items-center justify-center text-[12px] font-bold text-text-primary"
              style={{ height: CELL_SIZE_EXPR }}
            >
              {rank}
            </div>
          ))}
        </div>
      );
    };

    return (
      <DndProvider>
        <CustomDragLayer pieceImages={pieceImages} boardSize={boardSize} />

        <div
          className={`flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 ${className}`}
        >
          <div className="flex-shrink-0 w-full lg:w-auto mx-auto lg:mx-0">
            <div className="inline-flex flex-col relative">
              <div className="flex">
                {showCoords && renderRankCoordinates()}
                <div
                  style={{
                    width: BOARD_SIZE_EXPR,
                    height: BOARD_SIZE_EXPR
                  }}
                >
                  <InteractiveBoard
                    key={boardKey}
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
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/90 backdrop-blur-sm rounded-lg z-50">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                      <div className="absolute inset-0 rounded-full border-4 border-border"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
                    </div>
                    <div className="text-text-primary text-sm font-semibold">
                      Loading pieces {loadProgress}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <PiecePalette pieceImages={pieceImages} isLoading={isLoading} />

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center sm:justify-between">
              <div className="flex gap-2 sm:gap-3 flex-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    resetBoard();
                  }}
                  className="
                  flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5
                  text-sm font-semibold text-bg
                  bg-accent hover:bg-accent-hover
                  border border-accent/20
                  rounded-lg transition-all duration-200
                  hover:scale-105 active:scale-95 shadow-sm
                "
                  title="Reset to starting position"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden xs:inline">Reset</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    clearBoard();
                  }}
                  className="
                  flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5
                  text-sm font-semibold text-text-secondary
                  bg-surface-elevated hover:bg-surface-hover
                  border border-border
                  rounded-lg transition-all duration-200
                  hover:scale-105 active:scale-95 shadow-sm
                "
                  title="Clear all pieces"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden xs:inline">Clear</span>
                </button>
              </div>

              <div className="flex-shrink-0 sm:self-auto">
                <TrashZone onDrop={handleTrashDrop} />
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
    );
  }
);

ChessEditor.displayName = 'ChessEditor';

export default ChessEditor;
