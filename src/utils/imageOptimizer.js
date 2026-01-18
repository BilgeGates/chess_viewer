import { drawCoordinates, parseFEN, getCoordinateParams } from './';
import { logger } from './logger';

/**
 * Print DPI constant - standard for high-quality printing
 * At 300 DPI: 1 cm = 300 / 2.54 ≈ 118.11 pixels
 */
export const PRINT_DPI = 300;
export const CM_TO_PIXELS = PRINT_DPI / 2.54; // ~118.11 pixels per cm

/**
 * Convert centimeters to pixels for print at 300 DPI
 * @param {number} cm - Size in centimeters
 * @returns {number} - Size in pixels at 300 DPI
 */
export const cmToPixels = (cm) => Math.round(cm * CM_TO_PIXELS);

/**
 * Convert pixels to centimeters
 * @param {number} pixels - Size in pixels
 * @returns {number} - Size in centimeters at 300 DPI
 */
export const pixelsToCm = (pixels) => pixels / CM_TO_PIXELS;

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
 *
 * @param {number} boardSizeCm - Board size in centimeters (e.g., 4 for 4cm)
 * @param {boolean} showCoords - Whether to show coordinates
 * @param {number} requestedQuality - Requested quality multiplier (default 1)
 * @returns {number} - Optimal quality that fits within browser limits
 */
export const calculateOptimalQuality = (
  boardSizeCm,
  showCoords,
  requestedQuality = 1
) => {
  const maxCanvasSize = getMaxCanvasSize();

  // Convert cm to pixels at 300 DPI for print quality
  const boardSizePixels = cmToPixels(boardSizeCm);

  const params = getCoordinateParams(boardSizePixels);
  const borderSize = showCoords ? params.borderSize : 0;

  // Total dimensions: borderSize (left) + board + borderSize (bottom)
  const maxDimension = boardSizePixels + borderSize;

  // Check if requested quality fits
  const projectedSize = maxDimension * requestedQuality;

  if (projectedSize <= maxCanvasSize) {
    return requestedQuality;
  }

  const maxQuality = Math.floor(maxCanvasSize / maxDimension);
  return Math.max(1, maxQuality);
};

/**
 * Calculate export size for print-quality output
 *
 * @param {number} boardSizeCm - Board size in centimeters (e.g., 4, 6, 8)
 * @param {boolean} showCoords - Whether to show coordinates
 * @param {number} exportQuality - Quality multiplier
 * @returns {Object} - Export dimensions and metadata
 */
export const calculateExportSize = (boardSizeCm, showCoords, exportQuality) => {
  // Convert cm to pixels at 300 DPI
  const boardSizePixels = cmToPixels(boardSizeCm);

  const params = getCoordinateParams(boardSizePixels);
  const borderSize = showCoords ? params.borderSize : 0;

  // Canvas dimensions:
  // Width: borderSize (left) + board
  // Height: board + borderSize (bottom)
  const canvasWidth = borderSize + boardSizePixels;
  const canvasHeight = boardSizePixels + borderSize;

  const optimalQuality = calculateOptimalQuality(
    boardSizeCm,
    showCoords,
    exportQuality
  );

  return {
    width: Math.round(canvasWidth * optimalQuality),
    height: Math.round(canvasHeight * optimalQuality),
    actualQuality: optimalQuality,
    displayWidth: canvasWidth,
    displayHeight: canvasHeight,
    baseSize: boardSizePixels,
    baseSizeCm: boardSizeCm,
    borderSize,
    dpi: PRINT_DPI
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
 * Creates ultra high-quality chessboard canvas for PRINT export
 *
 * CRITICAL EXPORT LOGIC for PRINT:
 * - boardSizeCm = physical size in centimeters (e.g., 4 for 4cm print)
 * - At 300 DPI: 4cm = 472 pixels, 6cm = 709 pixels, 8cm = 945 pixels
 * - exportQuality = additional resolution multiplier (default 1, already high res)
 *
 * @param {Object} config - Export configuration
 * @param {number} config.boardSize - Board size in CENTIMETERS (e.g., 4, 6, 8)
 */
export const createUltraQualityCanvas = async (config) => {
  const {
    boardSize: boardSizeCm, // This is in CENTIMETERS
    showCoords,
    lightSquare,
    darkSquare,
    flipped,
    fen,
    pieceImages,
    exportQuality = 1 // For print at 300 DPI, quality=1 is sufficient
  } = config;

  // Convert cm to pixels at 300 DPI
  const boardSizePixels = cmToPixels(boardSizeCm);

  // Validate inputs
  if (!boardSizeCm || boardSizeCm < 1) {
    throw new Error(`Invalid board size: ${boardSizeCm}cm (minimum 1cm)`);
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

  // Calculate sizes with pixel-perfect precision at 300 DPI
  const params = getCoordinateParams(boardSizePixels);
  const borderSize = showCoords ? params.borderSize : 0;

  // Canvas dimensions:
  // Width: borderSize (left for 1-8) + board
  // Height: board + borderSize (bottom for a-h)
  const canvasWidth = borderSize + boardSizePixels;
  const canvasHeight = boardSizePixels + borderSize;

  // Calculate optimal quality (may be capped by browser limits)
  const optimalQuality = calculateOptimalQuality(
    boardSizeCm,
    showCoords,
    exportQuality
  );

  // Final canvas dimensions
  const fullResWidth = Math.round(canvasWidth * optimalQuality);
  const fullResHeight = Math.round(canvasHeight * optimalQuality);

  // Create canvas
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

  const squareSize = boardSizePixels / 8;

  // Board position:
  // X: borderSize (space for 1-8 on the left)
  // Y: 0 (board starts at top, a-h coordinates below)
  const boardX = borderSize;
  const boardY = 0;

  const getSquareBounds = (rowIndex, colIndex) => {
    const x0 = Math.round(boardX + colIndex * squareSize);
    const x1 = Math.round(boardX + (colIndex + 1) * squareSize);
    const y0 = Math.round(boardY + rowIndex * squareSize);
    const y1 = Math.round(boardY + (rowIndex + 1) * squareSize);

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
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw board border (slightly thicker for visibility)
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.rect(
    boardX - 0.5,
    boardY - 0.5,
    boardSizePixels + 1,
    boardSizePixels + 1
  );
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
      boardSizePixels,
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
