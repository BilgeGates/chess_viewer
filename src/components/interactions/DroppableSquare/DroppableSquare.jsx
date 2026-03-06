import { memo, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '@/constants';
import { DraggablePiece } from '@/components/interactions';

/**
 * A single interactive chess square that accepts piece drops via react-dnd.
 * @param {Object} props
 * @param {number} props.row - 0-based board row
 * @param {number} props.col - 0-based board column
 * @param {string} props.piece - FEN character of the occupying piece, or empty string
 * @param {boolean} props.isLight - Whether this is a light-colored square
 * @param {string} props.lightColor - Hex color for light squares
 * @param {string} props.darkColor - Hex color for dark squares
 * @param {HTMLImageElement|null} props.pieceImage - Preloaded image for the piece, or null
 * @param {Function} [props.onDrop] - Called with `(piece, fromRow, fromCol, toRow, toCol, isFromPalette)`
 * @param {boolean} [props.isLoading] - Whether piece images are still loading
 * @returns {JSX.Element}
 */
const DroppableSquare = memo(
  ({
    row,
    col,
    piece, // FEN character or empty string
    isLight,
    lightColor,
    darkColor,
    pieceImage,
    onDrop, // Callback: (piece, fromRow, fromCol, toRow, toCol, isFromPalette) => void
    isLoading
  }) => {
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
          isOver: monitor.isOver({ shallow: true })
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
