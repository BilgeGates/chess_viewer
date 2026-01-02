import { drawCoordinates, parseFEN } from "./";

/**
 * Brauzerin maksimum canvas ölçüsünü hesablayır
 */
export const getMaxCanvasSize = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  let maxSize = 16384;

  try {
    canvas.width = maxSize;
    canvas.height = maxSize;
    if (!ctx || canvas.width !== maxSize) {
      maxSize = 8192;
    }
  } catch (e) {
    maxSize = 8192;
  }

  return maxSize;
};

/**
 * For export optimize quantify calculate
 */
export const calculateOptimalQuality = (
  boardSize,
  showCoords,
  requestedQuality = 16
) => {
  const maxCanvasSize = getMaxCanvasSize();
  const borderSize = showCoords
    ? Math.max(20, Math.min(30, boardSize / 20))
    : 0;
  const displaySize = boardSize + borderSize * 2;

  const projectedSize = displaySize * requestedQuality;

  if (projectedSize <= maxCanvasSize) {
    return requestedQuality;
  }

  const maxQuality = Math.floor(maxCanvasSize / displaySize);
  return Math.max(1, maxQuality);
};

/**
 * Calculate export size
 */
export const calculateExportSize = (boardSize, showCoords, exportQuality) => {
  const optimalQuality = calculateOptimalQuality(
    boardSize,
    showCoords,
    exportQuality
  );
  const borderSize = showCoords
    ? Math.max(20, Math.min(30, boardSize / 20))
    : 0;
  const displaySize = boardSize + borderSize * 2;

  return {
    width: displaySize * optimalQuality,
    height: displaySize * optimalQuality,
    actualQuality: optimalQuality,
    displaySize: displaySize,
  };
};

/**
 * Creates ultra high-quality chessboard canvas for export
 *
 * ÖNƏMLİ: exportQuality yalnız keyfiyyəti artırır, taxta ölçüsünü dəyişmir
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
    exportQuality = 16,
  } = config;

  // Parse FEN
  const board = parseFEN(fen);

  // Validate
  if (!board || !pieceImages || Object.keys(pieceImages).length === 0) {
    throw new Error("Invalid board or piece images");
  }

  // Border calculation
  const borderSize = showCoords
    ? Math.max(20, Math.min(30, boardSize / 20))
    : 0;
  const displaySize = boardSize + borderSize * 2;

  const optimalQuality = calculateOptimalQuality(
    boardSize,
    showCoords,
    exportQuality
  );

  if (optimalQuality < exportQuality) {
    console.warn(
      `Quality reduced from ${exportQuality}x to ${optimalQuality}x due to browser canvas size limit`
    );
  }

  // Create high-resolution canvas
  const canvas = document.createElement("canvas");
  canvas.width = displaySize * optimalQuality;
  canvas.height = displaySize * optimalQuality;

  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: false,
    willReadFrequently: false,
  });

  ctx.scale(optimalQuality, optimalQuality);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const squareSize = boardSize / 8;

  // Clear canvas
  ctx.clearRect(0, 0, displaySize, displaySize);

  // Draw squares
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

  // Draw pieces
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row]?.[col];
      const img = pieceImages[piece];

      if (img?.complete && img.naturalWidth > 0) {
        const drawRow = flipped ? 7 - row : row;
        const drawCol = flipped ? 7 - col : col;
        const cx = drawCol * squareSize + borderSize + squareSize / 2;
        const cy = drawRow * squareSize + borderSize + squareSize / 2;

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

  // Draw coordinates
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
  const ctx = optimized.getContext("2d", { alpha: format === "png" });

  if (format === "jpeg" || format === "pdf") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, optimized.width, optimized.height);
  }

  ctx.drawImage(canvas, 0, 0);
  return optimized;
};
