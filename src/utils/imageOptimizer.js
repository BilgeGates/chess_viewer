export const createUltraQualityCanvas = ({
  boardSize,
  showBorder,
  lightSquare,
  darkSquare,
  flipped,
  board,
  pieceImages,
  showCoords,
}) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", {
    alpha: true, // Transparent background
    desynchronized: true,
    willReadFrequently: false,
  });

  // Dinamik border
  const baseBorderSize = boardSize / 25;
  const borderSize =
    showBorder || showCoords ? Math.max(12, Math.min(20, baseBorderSize)) : 0;
  const displaySize = boardSize + borderSize * 2;

  const MAX_QUALITY = 4;

  canvas.width = displaySize * MAX_QUALITY;
  canvas.height = displaySize * MAX_QUALITY;

  ctx.scale(MAX_QUALITY, MAX_QUALITY);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const squareSize = boardSize / 8;

  // Clear for transparency
  ctx.clearRect(0, 0, displaySize, displaySize);

  // Border
  if (showBorder) {
    ctx.fillStyle = "#a67c52";
    ctx.fillRect(0, 0, displaySize, displaySize);
  }

  // Squares
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isLight = (row + col) % 2 === 0;
      ctx.fillStyle = isLight ? lightSquare : darkSquare;
      const drawRow = flipped ? 7 - row : row;
      const drawCol = flipped ? 7 - col : col;

      ctx.fillRect(
        drawCol * squareSize + borderSize,
        drawRow * squareSize + borderSize,
        squareSize,
        squareSize
      );
    }
  }

  // Pieces
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row]?.[col];
      if (piece && pieceImages[piece]) {
        const img = pieceImages[piece];
        if (img.complete && img.naturalWidth > 0) {
          const drawRow = flipped ? 7 - row : row;
          const drawCol = flipped ? 7 - col : col;
          const cx = drawCol * squareSize + borderSize + squareSize / 2;
          const cy = drawRow * squareSize + borderSize + squareSize / 2;

          ctx.drawImage(
            img,
            cx - squareSize * 0.45,
            cy - squareSize * 0.45,
            squareSize * 0.9,
            squareSize * 0.9
          );
        }
      }
    }
  }

  // Coordinates
  if (showCoords) {
    const { drawCoordinatesOutside } = require("./coordinateCalculations");
    drawCoordinatesOutside(ctx, squareSize, borderSize, flipped, boardSize);
  }

  return canvas;
};
