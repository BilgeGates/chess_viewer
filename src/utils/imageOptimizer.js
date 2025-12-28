/**
 * Create ultra high-quality export canvas
 * Uses proper scaling and rerendering for maximum quality
 */
export const createUltraQualityCanvas = ({
  boardSize,
  showBorder,
  lightSquare,
  darkSquare,
  flipped,
  board,
  pieceImages,
  showCoords,
  borderSize,
  exportQuality,
}) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", {
    alpha: false,
    desynchronized: true,
    willReadFrequently: false,
  });

  // CRITICAL: High multiplier for quality
  const qualityMultiplier = 4 * exportQuality; // 4x base * user choice
  const totalSize = boardSize + borderSize * 2;

  canvas.width = totalSize * qualityMultiplier;
  canvas.height = totalSize * qualityMultiplier;

  ctx.scale(qualityMultiplier, qualityMultiplier);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const squareSize = boardSize / 8;

  // Border
  if (showBorder) {
    ctx.fillStyle = "#1a1d29";
    ctx.fillRect(0, 0, totalSize, totalSize);
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

  // Pieces - High quality redraw
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
    const { drawCoordinates } = require("./coordinateCalculations");
    drawCoordinates(ctx, squareSize, borderSize, flipped);
  }

  return canvas;
};
