import { drawCoordinates } from "./coordinateCalculations";

/**
 * Create ultra high-quality export canvas optimized for professional publishing
 * Uses 16x resolution multiplier for crystal-clear images suitable for print
 * @param {Object} config - Export configuration object
 * @returns {HTMLCanvasElement} High-resolution canvas ready for export
 */
export const createUltraQualityCanvas = (config) => {
  const {
    boardSize,
    showBorder,
    showCoords,
    lightSquare,
    darkSquare,
    flipped,
    board,
    pieceImages,
  } = config;

  // Validate input
  if (!board || !pieceImages || Object.keys(pieceImages).length === 0) {
    return null;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: false,
    willReadFrequently: false,
  });

  // Calculate refined slim border (adaptive to board size)
  const borderSize =
    showBorder || showCoords ? Math.max(20, Math.min(30, boardSize / 18)) : 0;
  const displaySize = boardSize + borderSize * 2;

  // Ultra quality 16x multiplier for professional book-quality exports
  // Example: 400px board → 6400x6400px actual resolution
  const EXPORT_QUALITY = 16;

  canvas.width = displaySize * EXPORT_QUALITY;
  canvas.height = displaySize * EXPORT_QUALITY;

  // Scale context for easier coordinate calculations
  ctx.scale(EXPORT_QUALITY, EXPORT_QUALITY);

  // Enable maximum quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const squareSize = boardSize / 8;

  // Clear canvas with transparency
  ctx.clearRect(0, 0, displaySize, displaySize);

  // Draw elegant wooden border frame if enabled
  if (showBorder) {
    ctx.fillStyle = "#8b7355"; // Professional wood texture color
    ctx.fillRect(0, 0, displaySize, displaySize);
  }

  // Draw chess board squares
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isLight = (row + col) % 2 === 0;
      ctx.fillStyle = isLight ? lightSquare : darkSquare;

      // Apply board flip transformation
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

  // Draw chess pieces with maximum quality
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row]?.[col];

      if (piece && pieceImages[piece]) {
        const img = pieceImages[piece];

        // Ensure image is fully loaded and valid
        if (img.complete && img.naturalWidth > 0) {
          const drawRow = flipped ? 7 - row : row;
          const drawCol = flipped ? 7 - col : col;

          // Calculate centered position for piece
          const cx = drawCol * squareSize + borderSize + squareSize / 2;
          const cy = drawRow * squareSize + borderSize + squareSize / 2;

          // Draw piece at 90% of square size for optimal visual balance
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

  // Draw coordinate labels if enabled
  if (showCoords) {
    drawCoordinates(ctx, squareSize, borderSize, flipped, boardSize);
  }

  return canvas;
};
