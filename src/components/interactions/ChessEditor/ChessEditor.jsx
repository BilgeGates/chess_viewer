import React, { memo, useCallback, useEffect } from 'react';

import { usePieceImages, useInteractiveBoard } from '@/hooks';
import DndProvider from '@/components/interactions/DndProvider';
import InteractiveBoard from '@/components/interactions/InteractiveBoard';
import PiecePalette from '@/components/interactions/PiecePalette';
import TrashZone from '@/components/interactions/TrashZone';
import CustomDragLayer from '@/components/interactions/CustomDragLayer';

const FIXED_BOARD_SIZE = 400;

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
        <div className="flex justify-around mt-4">
          {files.map((file) => (
            <span
              key={file}
              className="text-xs sm:text-sm font-semibold text-text-muted flex-1 flex items-center justify-center"
            >
              {file}
            </span>
          ))}
        </div>
      );
    };

    const renderRankCoordinates = () => {
      const ranks = flipped
        ? ['1', '2', '3', '4', '5', '6', '7', '8']
        : ['8', '7', '6', '5', '4', '3', '2', '1'];

      return (
        <div className="flex flex-col justify-around mr-2">
          {ranks.map((rank) => (
            <span
              key={rank}
              className="text-xs sm:text-sm font-semibold text-text-muted flex-1 flex items-center justify-center"
            >
              {rank}
            </span>
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
          <div
            className="flex-shrink-0 w-full lg:w-auto mx-auto lg:mx-0"
            style={{
              flexShrink: 0,
              maxWidth: `${boardSize}px`
            }}
          >
            <div
              className="relative w-full"
              style={{
                aspectRatio: '1 / 1',
                maxWidth: `${boardSize}px`,
                margin: '0 auto'
              }}
            >
              <div className="flex w-full h-full">
                {showCoords && renderRankCoordinates()}
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex-1 min-h-0">
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
                  {showCoords && renderFileCoordinates()}
                </div>
              </div>

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
                  text-sm font-semibold text-white
                  bg-blue-600 hover:bg-blue-700
                  border border-blue-500/20
                  rounded-lg transition-all duration-200
                  hover:scale-105 active:scale-95 shadow-sm
                "
                  title="Reset to starting position"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
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
                  text-sm font-semibold text-white
                  bg-gray-600 hover:bg-gray-700
                  border border-gray-500/20
                  rounded-lg transition-all duration-200
                  hover:scale-105 active:scale-95 shadow-sm
                "
                  title="Clear all pieces"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
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
