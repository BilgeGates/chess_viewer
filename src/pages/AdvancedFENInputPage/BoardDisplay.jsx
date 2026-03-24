import { memo } from 'react';

/**
 * @param {Object} props
 * @returns {JSX.Element}
 */
const BoardDisplay = memo(function BoardDisplay({
  boardState,
  isFlipped,
  showCoordinates,
  pieceImages,
  isBoardReady,
  lightSquare,
  darkSquare
}) {
  if (!isBoardReady) {
    return (
      <div
        className="flex items-center justify-center bg-surface-elevated rounded-lg"
        style={{
          width: 'min(52vh, 46vw)',
          height: 'min(52vh, 46vw)'
        }}
      >
        <div className="text-text-muted text-sm">Loading...</div>
      </div>
    );
  }
  const ranks = isFlipped
    ? ['1', '2', '3', '4', '5', '6', '7', '8']
    : ['8', '7', '6', '5', '4', '3', '2', '1'];
  const files = isFlipped
    ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
    : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return (
    <div className="inline-flex flex-col">
      <div className="flex">
        {showCoordinates && (
          <div
            className="flex flex-col flex-shrink-0"
            style={{
              width: 20
            }}
          >
            {ranks.map((rank) => (
              <div
                key={rank}
                className="flex items-center justify-center text-[11px] font-bold text-text-secondary"
                style={{
                  height: 'calc(min(52vh, 46vw) / 8)'
                }}
              >
                {rank}
              </div>
            ))}
          </div>
        )}
        <div
          className="grid grid-cols-8 grid-rows-8 overflow-hidden shadow-md"
          style={{
            width: 'min(52vh, 46vw)',
            height: 'min(52vh, 46vw)'
          }}
        >
          {Array.from({
            length: 64
          }).map((_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const actualRow = isFlipped ? 7 - row : row;
            const actualCol = isFlipped ? 7 - col : col;
            const isLight = (row + col) % 2 === 0;
            const piece = boardState[actualRow]?.[actualCol] || '';
            const color = piece === piece.toUpperCase() ? 'w' : 'b';
            const pieceKey = piece ? color + piece.toUpperCase() : null;
            return (
              <div
                key={`sq-${row}-${col}`}
                className="relative flex items-center justify-center"
                style={{
                  backgroundColor: isLight ? lightSquare : darkSquare,
                  minWidth: 0,
                  minHeight: 0
                }}
              >
                {pieceKey && pieceImages[pieceKey] && (
                  <img
                    src={pieceImages[pieceKey].src}
                    alt={piece}
                    className="w-[85%] h-[85%] object-contain"
                    draggable="false"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {showCoordinates && (
        <div
          className="flex"
          style={{
            paddingLeft: 20
          }}
        >
          {files.map((file) => (
            <div
              key={file}
              className="text-[11px] font-bold text-text-secondary text-center mt-1"
              style={{
                width: 'calc(min(52vh, 46vw) / 8)'
              }}
            >
              {file}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
BoardDisplay.displayName = 'BoardDisplay';
export default BoardDisplay;
