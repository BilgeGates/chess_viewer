import { memo } from 'react';

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
 * @param {Object} props
 * @returns {JSX.Element}
 */
const BoardSquare = memo(function BoardSquare(props) {
  const { isLight, lightSquare, darkSquare, piece, pieceImages, isLoading } =
    props;
  const backgroundColor = isLight ? lightSquare : darkSquare;
  const color = piece && piece === piece.toUpperCase() ? 'w' : 'b';
  const pieceKey = piece ? color + piece.toUpperCase() : '';
  const pieceImage = piece ? pieceImages[pieceKey] : null;
  return (
    <div
      className="w-full h-full flex items-center justify-center relative"
      style={{
        backgroundColor,
        minWidth: 0,
        minHeight: 0
      }}
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
