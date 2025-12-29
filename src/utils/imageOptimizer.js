import { parseFEN } from "./fenParser";
import { drawCoordinates } from "./coordinateCalculations";

/**
 * Creates ultra high-quality chessboard canvas for export
 * Dynamic quality scaling based on export settings
 * Optimized for both print and digital use
 *
 * @param {Object} config - Export configuration
 * @returns {HTMLCanvasElement} Final high-quality canvas
 */
export const createUltraQualityCanvas = (config) => {
  const {
    boardSize,
    showCoords,
    lightSquare,
    darkSquare,
    flipped,
    fen,
    pieceImages,
    exportQuality = 16, // Default to 16x if not specified
  } = config;

  // Parse FEN
  const board = parseFEN(fen);

  // Validate
  if (!board || !pieceImages || Object.keys(pieceImages).length === 0) {
    throw new Error("Invalid board or piece images");
  }

  // Border calculation - proportional to board size
  const borderSize = showCoords
    ? Math.max(20, Math.min(30, boardSize / 20))
    : 0;
  const displaySize = boardSize + borderSize * 2;

  // Use provided export quality (8x, 16x, 24x, or 32x)
  const QUALITY = exportQuality;

  // Create high-resolution canvas
  const canvas = document.createElement("canvas");
  canvas.width = displaySize * QUALITY;
  canvas.height = displaySize * QUALITY;

  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: false,
    willReadFrequently: false,
  });

  // Scale context
  ctx.scale(QUALITY, QUALITY);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const squareSize = boardSize / 8;

  // Clear canvas with transparency
  ctx.clearRect(0, 0, displaySize, displaySize);

  // Draw squares with anti-aliasing
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? lightSquare : darkSquare;
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

  // Draw pieces with optimal sizing
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row]?.[col];
      const img = pieceImages[piece];

      if (img?.complete && img.naturalWidth > 0) {
        const drawRow = flipped ? 7 - row : row;
        const drawCol = flipped ? 7 - col : col;
        const cx = drawCol * squareSize + borderSize + squareSize / 2;
        const cy = drawRow * squareSize + borderSize + squareSize / 2;

        // Slightly larger pieces for better visibility
        const pieceScale = 0.92;

        ctx.drawImage(
          img,
          cx - squareSize * (pieceScale / 2),
          cy - squareSize * (pieceScale / 2),
          squareSize * pieceScale,
          squareSize * pieceScale
        );
      }
    }
  }

  // Draw coordinates if enabled
  if (showCoords) {
    drawCoordinates(ctx, squareSize, borderSize, flipped, boardSize, true);
  }

  return canvas;
};

// Optimize canvas for specific output format
export const optimizeCanvasForFormat = (canvas, format) => {
  const optimized = document.createElement("canvas");
  optimized.width = canvas.width;
  optimized.height = canvas.height;
  const ctx = optimized.getContext("2d");

  if (format === "jpeg" || format === "pdf") {
    // Add white background for JPEG/PDF
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, optimized.width, optimized.height);
  }

  ctx.drawImage(canvas, 0, 0);
  return optimized;
};

// Calculate optimal export dimensions
export const calculateOptimalDimensions = (boardSize, format) => {
  const maxSizes = {
    png: 8192, // PNG max reasonable size
    jpeg: 4096, // JPEG optimal max
  };

  const maxSize = maxSizes[format] || 4096;
  return Math.min(boardSize, maxSize);
};
