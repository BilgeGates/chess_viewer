import React from 'react';

import BoardSquare from '@/components/board/BoardSquare';

// Shallow board comparison to avoid deep-equal on every render
function arePropsEqual(prevProps, nextProps) {
  if (prevProps.board === nextProps.board) {
    return (
      prevProps.lightSquare === nextProps.lightSquare &&
      prevProps.darkSquare === nextProps.darkSquare &&
      prevProps.flipped === nextProps.flipped &&
      prevProps.pieceImages === nextProps.pieceImages
    );
  }

  try {
    const prevFlat = (prevProps.board || []).flat().join(',');
    const nextFlat = (nextProps.board || []).flat().join(',');

    return (
      prevFlat === nextFlat &&
      prevProps.lightSquare === nextProps.lightSquare &&
      prevProps.darkSquare === nextProps.darkSquare &&
      prevProps.flipped === nextProps.flipped &&
      prevProps.pieceImages === nextProps.pieceImages
    );
  } catch {
    return false;
  }
}

const BoardGrid = React.memo(function BoardGrid(props) {
  const { board, lightSquare, darkSquare, pieceImages } = props;

  return (
    <div className="grid grid-cols-8 gap-0">
      {Array.from({ length: 64 }).map((_, index) => {
        const row = Math.floor(index / 8);
        const col = index % 8;
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
}, arePropsEqual);

BoardGrid.displayName = 'BoardGrid';

export default BoardGrid;
