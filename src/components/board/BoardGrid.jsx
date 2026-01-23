import React from 'react';
import BoardSquare from './BoardSquare';

/**
 * Renders 64 BoardSquare atoms
 */
const BoardGrid = React.memo(
  ({ board, lightSquare, darkSquare, pieceImages, flipped: _flipped }) => {
    return (
      <div className="grid grid-cols-8 gap-0">
        {Array.from({ length: 64 }).map((_, i) => {
          const row = Math.floor(i / 8);
          const col = i % 8;
          const isLight = (row + col) % 2 === 0;
          const piece = board[row]?.[col] || '';

          return (
            <BoardSquare
              key={`square-${row}-${col}`}
              piece={piece}
              isLight={isLight}
              lightSquare={lightSquare}
              darkSquare={darkSquare}
              pieceImages={pieceImages}
              row={row}
              col={col}
            />
          );
        })}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.board === nextProps.board &&
      prevProps.lightSquare === nextProps.lightSquare &&
      prevProps.darkSquare === nextProps.darkSquare &&
      prevProps.flipped === nextProps.flipped &&
      prevProps.pieceImages === nextProps.pieceImages
    );
  }
);

BoardGrid.displayName = 'BoardGrid';

export default BoardGrid;
