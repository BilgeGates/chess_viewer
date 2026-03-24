import { memo, useCallback, useMemo, useRef } from 'react';

import { useDrop } from 'react-dnd';

import { DroppableSquare } from '@/components/interactions';
import { ItemTypes } from '@/constants';

/**
 * @param {Object} props
 * @returns {JSX.Element}
 */
const InteractiveBoard = memo(
  function InteractiveBoard({
    board,
    lightSquare,
    darkSquare,
    pieceImages,
    isLoading,
    flipped,
    onPieceDrop,
    onPieceRemove: _onPieceRemove
  }) {
    const boardRef = useRef(null);
    const handleDrop = useCallback(
      (piece, fromRow, fromCol, toRow, toCol, isFromPalette) => {
        if (onPieceDrop) {
          onPieceDrop(piece, fromRow, fromCol, toRow, toCol, isFromPalette);
        }
      },
      [onPieceDrop]
    );
    const [, boardDropRef] = useDrop(
      () => ({
        accept: ItemTypes.PIECE,
        collect: (monitor) => ({
          isOver: monitor.isOver({
            shallow: true
          })
        })
      }),
      []
    );
    const setRefs = useCallback(
      (node) => {
        boardRef.current = node;
        boardDropRef(node);
      },
      [boardDropRef]
    );
    const squares = useMemo(() => {
      const result = [];
      for (let displayRow = 0; displayRow < 8; displayRow++) {
        for (let displayCol = 0; displayCol < 8; displayCol++) {
          const actualRow = flipped ? 7 - displayRow : displayRow;
          const actualCol = flipped ? 7 - displayCol : displayCol;
          const isLight = (actualRow + actualCol) % 2 === 0;
          const piece = board[actualRow]?.[actualCol] || '';
          let pieceImage = null;
          if (piece) {
            const color = piece === piece.toUpperCase() ? 'w' : 'b';
            const pieceKey = color + piece.toUpperCase();
            pieceImage = pieceImages[pieceKey];
          }
          result.push(
            <DroppableSquare
              key={`square-${actualRow}-${actualCol}`}
              row={actualRow}
              col={actualCol}
              piece={piece}
              isLight={isLight}
              lightColor={lightSquare}
              darkColor={darkSquare}
              pieceImage={pieceImage}
              onDrop={handleDrop}
              isLoading={isLoading}
            />
          );
        }
      }
      return result;
    }, [
      board,
      lightSquare,
      darkSquare,
      pieceImages,
      isLoading,
      flipped,
      handleDrop
    ]);
    return (
      <div
        ref={setRefs}
        className="grid grid-cols-8 grid-rows-8 gap-0 overflow-hidden"
        style={{
          aspectRatio: '1 / 1',
          width: '100%',
          height: '100%',
          zIndex: 1,
          contain: 'layout style paint',
          borderRadius: '0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}
      >
        {squares}
      </div>
    );
  }
);
InteractiveBoard.displayName = 'InteractiveBoard';
export default InteractiveBoard;
