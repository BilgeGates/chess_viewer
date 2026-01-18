import { drawCoordinates, parseFEN, getCoordinateParams } from './';
import { logger } from './logger';

/**
 * Get maximum canvas size supported by browser
 */
export const getMaxCanvasSize = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

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
 * Calculate optimal quality for export
 */
export const calculateOptimalQuality = (
  boardSize,
  showCoords,
  requestedQuality = 16
) => {
  const maxCanvasSize = getMaxCanvasSize();
  const borderSize = showCoords ? getCoordinateParams(boardSize).borderSize : 0;
  const displaySize = boardSize + borderSize * 2;

  const projectedSize = displaySize * requestedQuality;

  if (projectedSize <= maxCanvasSize) {
    return requestedQuality;
  }

  const maxQuality = Math.floor(maxCanvasSize / displaySize);
  return Math.max(1, maxQuality);
};

/**
 * Calculate export size with NO QUALITY LOSS
 * Returns ACTUAL render dimensions - preserves every pixel
 */
export const calculateExportSize = (boardSize, showCoords, exportQuality) => {
  // Get exact border size (integer pixels)
  const borderSize = showCoords ? getCoordinateParams(boardSize).borderSize : 0;

  // Total display size (base size + borders)
  const displaySize = boardSize + borderSize * 2;

  // Calculate optimal quality (may be reduced if canvas size limit exceeded)
  const optimalQuality = calculateOptimalQuality(
    boardSize,
    showCoords,
    exportQuality
  );

  // Return EXACT pixel dimensions - NO ROUNDING
  // Final canvas will be displaySize * optimalQuality
  return {
    width: displaySize * optimalQuality,
    height: displaySize * optimalQuality,
    actualQuality: optimalQuality,
    displaySize: displaySize,
    baseSize: boardSize,
    borderSize: borderSize
  };
};

/**
 * Convert FEN piece notation to pieceImages key format
 */
const getPieceKey = (fenPiece) => {
  if (!fenPiece) return null;

  const isWhite = fenPiece === fenPiece.toUpperCase();
  const pieceType = fenPiece.toUpperCase();

  return (isWhite ? 'w' : 'b') + pieceType;
};

/**
 * Creates ultra high-quality chessboard canvas for export
 *
 * CRITICAL EXPORT LOGIC:
 * - boardSize = base visual size in pixels (e.g., 400px for ~10.6cm at 96 DPI)
 * - exportQuality = resolution multiplier (1x, 2x, 4x, 8x, 16x, 32x)
 * - Final canvas = displaySize × exportQuality
 * - Visual dimensions stay CONSTANT, only pixel density increases
 * - Example: 4cm board = ~151px base, 16x quality = 2,416px output (same visual size, higher DPI)
 */
export const createUltraQualityCanvas = async (config) => {
  const {
    boardSize,
    showCoords,
    lightSquare,
    darkSquare,
    flipped,
    fen,
    pieceImages,
    exportQuality = 16
  } = config;

  // Validate inputs
  if (!boardSize || boardSize < 100) {
    throw new Error('Invalid board size');
  }

  if (!lightSquare || !darkSquare) {
    throw new Error('Square colors are required');
  }

  if (!fen) {
    throw new Error('FEN string is required');
  }

  const board = parseFEN(fen);

  if (!board || !Array.isArray(board) || board.length !== 8) {
    throw new Error('Invalid FEN: Failed to parse board');
  }

  if (!pieceImages || Object.keys(pieceImages).length === 0) {
    throw new Error('Invalid board or piece images');
  }

  // Wait for all images to load
  const imageLoadPromises = Object.entries(pieceImages).map(([key, img]) => {
    if (!img) return Promise.resolve();
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();

    return new Promise((resolve) => {
      const timeout = setTimeout(resolve, 10000);
      const cleanup = () => {
        clearTimeout(timeout);
        img.onload = null;
        img.onerror = null;
      };

      img.onload = () => {
        cleanup();
        resolve();
      };

      img.onerror = () => {
        cleanup();
        resolve();
      };

      if (!img.src || img.src === '') {
        cleanup();
        resolve();
      }
    });
  });

  await Promise.all(imageLoadPromises);

  // Calculate sizes with pixel-perfect precision
  // Border size must be an integer
  const borderSize = showCoords ? getCoordinateParams(boardSize).borderSize : 0;

  // Display size is board + 2 borders (left/right or top/bottom)
  const displaySize = boardSize + borderSize * 2;

  // Calculate optimal quality (may be capped by browser limits)
  const optimalQuality = calculateOptimalQuality(
    boardSize,
    showCoords,
    exportQuality
  );

  // CRITICAL: Final canvas dimensions must be EXACT multiples
  // NO ROUNDING - displaySize * optimalQuality must be precise
  const fullResWidth = displaySize * optimalQuality;
  const fullResHeight = displaySize * optimalQuality;

  // Validate dimensions are integers (no sub-pixel rendering)
  if (!Number.isInteger(fullResWidth) || !Number.isInteger(fullResHeight)) {
    logger.warn(
      `Non-integer canvas dimensions: ${fullResWidth}x${fullResHeight}`
    );
  }

  // Create FULL RESOLUTION canvas - NO DOWNSCALING
  const canvas = document.createElement('canvas');
  canvas.width = fullResWidth;
  canvas.height = fullResHeight;

  const ctx = canvas.getContext('2d', {
    alpha: true,
    desynchronized: false,
    willReadFrequently: false
  });

  // Scale everything by quality factor for high-res rendering
  ctx.scale(optimalQuality, optimalQuality);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const squareSize = boardSize / 8;

  const getSquareBounds = (rowIndex, colIndex) => {
    const x0 = Math.round(borderSize + colIndex * squareSize);
    const x1 = Math.round(borderSize + (colIndex + 1) * squareSize);
    const y0 = Math.round(borderSize + rowIndex * squareSize);
    const y1 = Math.round(borderSize + (rowIndex + 1) * squareSize);

    return {
      x: x0,
      y: y0,
      width: x1 - x0,
      height: y1 - y0,
      centerX: Math.round((x0 + x1) / 2),
      centerY: Math.round((y0 + y1) / 2)
    };
  };

  // Clear with transparent background
  ctx.clearRect(0, 0, displaySize, displaySize);

  // Draw crisp 1px border around the board
  // Use 0.5 offset for pixel-perfect 1px line rendering
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.rect(borderSize - 0.5, borderSize - 0.5, boardSize + 1, boardSize + 1);
  ctx.stroke();

  // Draw squares with pixel-perfect alignment
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? lightSquare : darkSquare;
      const drawRow = flipped ? 7 - row : row;
      const drawCol = flipped ? 7 - col : col;
      const bounds = getSquareBounds(drawRow, drawCol);

      // Use rounded edges to ensure total board size matches exactly
      ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
  }

  // Draw pieces with pixel-perfect centering
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const fenPiece = board[row]?.[col];
      if (!fenPiece) continue;

      const pieceKey = getPieceKey(fenPiece);
      const img = pieceImages[pieceKey];

      if (!img || !img.complete || img.naturalWidth === 0) continue;

      const drawRow = flipped ? 7 - row : row;
      const drawCol = flipped ? 7 - col : col;

      const bounds = getSquareBounds(drawRow, drawCol);

      // Piece fills 100% of square for maximum clarity
      const pieceScale = 1.0;
      const pieceSize = Math.round(
        Math.min(bounds.width, bounds.height) * pieceScale
      );

      // Calculate top-left position (center - half size)
      const px = Math.round(bounds.centerX - pieceSize / 2);
      const py = Math.round(bounds.centerY - pieceSize / 2);

      try {
        ctx.drawImage(img, px, py, pieceSize, pieceSize);
      } catch (err) {
        // Skip piece on error
        logger.error(`Failed to draw piece ${pieceKey} at ${row},${col}:`, err);
      }
    }
  }

  // Draw coordinates
  if (showCoords) {
    drawCoordinates(
      ctx,
      squareSize,
      borderSize,
      flipped,
      boardSize,
      true,
      false
    );
  }

  // Return FULL RESOLUTION canvas
  return canvas;
};

/**
 * Optimize canvas for specific output format
 */
export const optimizeCanvasForFormat = (canvas, format) => {
  const optimized = document.createElement('canvas');
  optimized.width = canvas.width;
  optimized.height = canvas.height;
  const ctx = optimized.getContext('2d', { alpha: format === 'png' });

  if (format === 'jpeg' || format === 'pdf') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, optimized.width, optimized.height);
  }

  ctx.drawImage(canvas, 0, 0);
  return optimized;
};
