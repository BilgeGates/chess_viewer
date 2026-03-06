import { memo } from 'react';

/**
 * Custom memo comparator — re-renders only when visually relevant props change.
 * @param {Object} prevProps - Previous props
 * @param {Object} nextProps - Next props
 * @returns {boolean} True if the component should NOT re-render
 */
function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.piece === nextProps.piece &&
    prevProps.isLight === nextProps.isLight &&
    prevProps.lightSquare === nextProps.lightSquare &&
    prevProps.darkSquare === nextProps.darkSquare &&
    prevProps.isLoading === nextProps.isLoading
  );
}

/**
 * Renders a single chess board square with its piece image.
 * @param {Object} props
 * @param {boolean} props.isLight - Whether this is a light-colored square
 * @param {string} props.lightSquare - Hex color for light squares
 * @param {string} props.darkSquare - Hex color for dark squares
 * @param {string} props.piece - FEN piece character, or empty string for an empty square
 * @param {Object} props.pieceImages - Map of piece keys to preloaded Image elements
 * @param {boolean} props.isLoading - Whether piece images are still loading
 * @returns {JSX.Element}
 */
const BoardSquare = memo(function BoardSquare(props) {
  const { isLight, lightSquare, darkSquare, piece, pieceImages, isLoading } =
    props;

  const backgroundColor = isLight ? lightSquare : darkSquare;

  const color = piece === piece.toUpperCase() ? 'w' : 'b';
  const pieceKey = color + piece.toUpperCase();
  const pieceImage = pieceImages[pieceKey];

  return (
    <div
      className="w-full h-full flex items-center justify-center relative"
      style={{ backgroundColor, minWidth: 0, minHeight: 0 }}
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
}, arePropsEqual);

BoardSquare.displayName = 'BoardSquare';

export default BoardSquare;
