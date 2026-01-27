import { memo } from 'react';

/**
 * Single Board Square
 * Only re-renders if piece or color changes
 */
const BoardSquare = memo(
  ({ isLight, lightColor, darkColor, piece, pieceImage, isLoading }) => {
    const bgColor = isLight ? lightColor : darkColor;

    return (
      <div
        className="aspect-square flex items-center justify-center relative"
        style={{ backgroundColor: bgColor }}
      >
        {piece && pieceImage && !isLoading && (
          <img
            src={pieceImage.src}
            alt={piece}
            className="w-[85%] h-[85%] object-contain pointer-events-none"
            draggable="false"
          />
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison - only re-render if these change
    return (
      prevProps.piece === nextProps.piece &&
      prevProps.isLight === nextProps.isLight &&
      prevProps.lightColor === nextProps.lightColor &&
      prevProps.darkColor === nextProps.darkColor &&
      prevProps.isLoading === nextProps.isLoading
    );
  }
);

BoardSquare.displayName = 'BoardSquare';

export default BoardSquare;
