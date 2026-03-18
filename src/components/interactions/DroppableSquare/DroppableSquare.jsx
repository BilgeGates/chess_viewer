import { memo, useCallback } from 'react';

import { useDrop } from 'react-dnd';

import { DraggablePiece } from '@/components/interactions';
import { ItemTypes } from '@/constants';

/**
 * @param {Object} props
 * @returns {JSX.Element}
 */
const DroppableSquare = memo(
  function DroppableSquare({
    row,
    col,
    piece,
    isLight,
    lightColor,
    darkColor,
    pieceImage,
    onDrop,
    isLoading
  }) {
    const bgColor = isLight ? lightColor : darkColor;
    const handleDrop = useCallback(
      (item) => {
        if (onDrop) {
          onDrop(
            item.piece,
            item.fromRow,
            item.fromCol,
            row,
            col,
            item.isFromPalette
          );
        }
      },
      [onDrop, row, col]
    );
    const [{ isOver }, drop] = useDrop(
      () => ({
        accept: ItemTypes.PIECE,
        drop: handleDrop,
        canDrop: () => true,
        collect: (monitor) => ({
          isOver: monitor.isOver({
            shallow: true
          })
        })
      }),
      [handleDrop]
    );
    return (
      <div
        ref={drop}
        className="w-full h-full flex items-center justify-center relative"
        style={{
          backgroundColor: bgColor,
          zIndex: 0,
          boxShadow: isOver
            ? 'inset 0 0 0 3px rgba(255, 255, 255, 0.5)'
            : 'none',
          contain: 'layout style',
          minWidth: 0,
          minHeight: 0
        }}
        data-row={row}
        data-col={col}
      >
        {piece && pieceImage && !isLoading && (
          <DraggablePiece
            piece={piece}
            pieceImage={pieceImage}
            row={row}
            col={col}
            isFromPalette={false}
            size="85%"
          />
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.piece === nextProps.piece &&
      prevProps.isLight === nextProps.isLight &&
      prevProps.lightColor === nextProps.lightColor &&
      prevProps.darkColor === nextProps.darkColor &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.row === nextProps.row &&
      prevProps.col === nextProps.col &&
      prevProps.onDrop === nextProps.onDrop &&
      prevProps.pieceImage === nextProps.pieceImage
    );
  }
);
DroppableSquare.displayName = 'DroppableSquare';
export default DroppableSquare;
