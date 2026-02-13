// Internal utilities
import { drawCoordinates, getCoordinateParams, parseFEN } from './';
import { logger } from './logger';

// Constants
import { EXPORT_MODE_CONFIG, QUALITY_PRESETS } from '@/constants';

export const PRINT_DPI = 300;
export const CM_TO_PIXELS = PRINT_DPI / 2.54;

/**
 * Convert centimeters to pixels at 300 DPI.
 *
 * @param {number} cm - Size in centimeters
 * @returns {number} Size in pixels
 */
export function cmToPixels(cm) {
  return Math.round(cm * CM_TO_PIXELS);
}

/**
 * Convert pixels to centimeters at 300 DPI.
 *
 * @param {number} pixels - Size in pixels
 * @returns {number} Size in centimeters
 */
export function pixelsToCm(pixels) {
  return pixels / CM_TO_PIXELS;
}

/**
 * Get maximum canvas size supported by browser.
 *
 * @returns {number} Maximum width/height in pixels
 */
export function getMaxCanvasSize() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let maxSize = 16384;

  try {
    canvas.width = maxSize;
    canvas.height = maxSize;

    if (!ctx || canvas.width !== maxSize) {
      maxSize = 8192;
    }
  } catch {
    maxSize = 8192;
  }

  return maxSize;
}

/**
 * Get export mode from quality value.
 *
 * @param {number} quality - Quality multiplier (8, 16, 24, or 32)
 * @returns {string} "print" or "social"
 */
export function getExportMode(quality) {
  for (let i = 0; i < QUALITY_PRESETS.length; i++) {
    if (QUALITY_PRESETS[i].value === quality) {
      return QUALITY_PRESETS[i].mode;
    }
  }
  return 'print';
}

/**
 * Check if coordinate borders should be forced on.
 *
 * @param {number} quality - Quality multiplier
 * @returns {boolean} True if borders forced on
 */
export function shouldForceCoordinateBorder(quality) {
  for (let i = 0; i < QUALITY_PRESETS.length; i++) {
    if (QUALITY_PRESETS[i].value === quality) {
      if (QUALITY_PRESETS[i].forceCoordinateBorder) {
        return true;
      }
      return false;
    }
  }
  return false;
}

/**
 * Calculate export dimensions based on mode and quality.
 *
 * @param {number} boardSizeCm - Board size in centimeters
 * @param {boolean} showCoords - Whether to include coordinates
 * @param {number} exportQuality - Quality multiplier (8, 16, 24, 32)
 * @returns {Object} Dimensions, scale factor, and mode info
 */
export function calculateExportSize(boardSizeCm, showCoords, exportQuality) {
  const mode = getExportMode(exportQuality);
  const maxCanvasSize = getMaxCanvasSize();

  let baseBoardPixels;
  let scaleFactor;
  let physicalSizeCm;
  let actualResolutionPixels;

  if (mode === 'print') {
    // CRITICAL: Use boardSizeCm directly to ensure different sizes produce different outputs
    baseBoardPixels = cmToPixels(boardSizeCm);
    scaleFactor = 1; // Do NOT apply multiplier as scale - apply to actual pixels instead
    physicalSizeCm = boardSizeCm;
    // Apply multiplier directly to resolution
    actualResolutionPixels = baseBoardPixels * exportQuality;
  } else {
    // SOCIAL: Fixed pixel size, ignore physical dimensions
    baseBoardPixels = EXPORT_MODE_CONFIG.social.fixedBoardPixels;
    scaleFactor = exportQuality / 24; // Normalize (24x = 1.0, 32x = 1.33)
    physicalSizeCm = null;
    actualResolutionPixels = baseBoardPixels * scaleFactor;
  }

  // Get coordinate border size at BASE resolution
  const params = getCoordinateParams(actualResolutionPixels);
  let borderSize = 0;
  if (showCoords) {
    borderSize = params.borderSize;
  }

  // Canvas dimensions at ACTUAL resolution
  const finalBoardPixels = actualResolutionPixels;
  const finalWidth = Math.round(borderSize + finalBoardPixels);
  const finalHeight = Math.round(finalBoardPixels + borderSize);

  // Check if the final size exceeds browser limits
  let reducedWidth = finalWidth;
  let reducedHeight = finalHeight;
  let actualScaleFactor = 1.0;

  if (finalWidth > maxCanvasSize || finalHeight > maxCanvasSize) {
    // Reduce to fit within browser limits
    const maxDim = Math.max(finalWidth, finalHeight);
    actualScaleFactor = maxCanvasSize / maxDim;
    reducedWidth = Math.round(finalWidth * actualScaleFactor);
    reducedHeight = Math.round(finalHeight * actualScaleFactor);
    logger.warn(
      'Resolution reduced by ' +
        (actualScaleFactor * 100).toFixed(1) +
        '% for browser compatibility'
    );
  }

  return {
    width: reducedWidth,
    height: reducedHeight,
    scaleFactor: actualScaleFactor,
    baseBoardPixels: finalBoardPixels,
    baseWidth: finalWidth,
    baseHeight: finalHeight,
    borderSize: borderSize,
    physicalSizeCm: physicalSizeCm,
    effectiveDPI: mode === 'print' ? PRINT_DPI * exportQuality : null,
    mode: mode,
    exportQuality: exportQuality
  };
}

/**
 * Calculate optimal quality for export.
 *
 * @param {number} boardSizeCm - Board size in centimeters
 * @param {boolean} showCoords - Whether coordinates are shown
 * @param {number} requestedQuality - Requested quality multiplier
 * @returns {number} Actual scale factor
 */
export function calculateOptimalQuality(
  boardSizeCm,
  showCoords,
  requestedQuality
) {
  if (requestedQuality === undefined || requestedQuality === null) {
    requestedQuality = 1;
  }
  const exportSize = calculateExportSize(
    boardSizeCm,
    showCoords,
    requestedQuality
  );
  return exportSize.scaleFactor;
}

/**
 * Convert FEN piece character to pieceImages key.
 *
 * @param {string} fenPiece - FEN piece character (e.g., 'K', 'q')
 * @returns {string|null} PieceImages key (e.g., 'wK', 'bQ')
 */
function getPieceKey(fenPiece) {
  if (!fenPiece) {
    return null;
  }

  const isWhite = fenPiece === fenPiece.toUpperCase();
  const pieceType = fenPiece.toUpperCase();

  if (isWhite) {
    return 'w' + pieceType;
  }
  return 'b' + pieceType;
}

/**
 * Create ultra-high-quality canvas of chess board for export.
 *
 * This function renders a chess position to a high-resolution canvas suitable for
 * professional printing or digital display. It supports two export modes:
 * - Print mode (8x, 16x): Preserves exact physical dimensions with increased pixel density
 * - Social mode (24x, 32x): Fixed large output optimized for screen viewing
 *
 * @param {Object} config - Export configuration object
 * @param {number} config.boardSize - Board size in centimeters (4-16cm)
 * @param {boolean} config.showCoords - Whether to display coordinate labels (a-h, 1-8)
 * @param {string} config.lightSquare - Light square color (hex, rgb, or color name)
 * @param {string} config.darkSquare - Dark square color (hex, rgb, or color name)
 * @param {boolean} config.flipped - Whether to flip board (black's perspective)
 * @param {string} config.fen - FEN notation string for the position
 * @param {Object} config.pieceImages - Map of piece keys to loaded Image objects
 * @param {string} [config.format='png'] - Export format ('png' or 'jpeg')
 * @param {boolean} [config.showCoordinateBorder=true] - Whether to show borders around coordinates
 * @param {number} [config.exportQuality=8] - Quality multiplier (8, 16, 24, or 32)
 * @param {boolean} [config.showThinFrame=false] - Whether to add thin frame around board (8x/16x only)
 * @returns {Promise<HTMLCanvasElement>} Rendered canvas element
 * @throws {Error} If configuration is invalid or rendering fails
 * @example
 * const config = {
 *   boardSize: 6,
 *   showCoords: true,
 *   lightSquare: '#f0d9b5',
 *   darkSquare: '#b58863',
 *   flipped: false,
 *   fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
 *   pieceImages: loadedImages,
 *   exportQuality: 16
 * };
 * const canvas = await createUltraQualityCanvas(config);
 */
export async function createUltraQualityCanvas(config) {
  const boardSizeCm = config.boardSize;
  const showCoords = config.showCoords;
  const lightSquare = config.lightSquare;
  const darkSquare = config.darkSquare;
  const flipped = config.flipped;
  const fen = config.fen;
  const pieceImages = config.pieceImages;
  const format = config.format || 'png';

  let showCoordinateBorder = config.showCoordinateBorder;
  if (showCoordinateBorder === undefined || showCoordinateBorder === null) {
    showCoordinateBorder = true;
  }

  let exportQuality = config.exportQuality;
  if (exportQuality === undefined || exportQuality === null) {
    exportQuality = 8;
  }

  const mode = getExportMode(exportQuality);
  const forceCoordBorder = shouldForceCoordinateBorder(exportQuality);

  let effectiveCoordBorder = false;
  if (showCoords) {
    if (forceCoordBorder || showCoordinateBorder) {
      effectiveCoordBorder = true;
    }
  }

  if (!boardSizeCm || boardSizeCm < 1) {
    throw new Error('Invalid board size: ' + boardSizeCm + 'cm (minimum 1cm)');
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

  const imageKeys = Object.keys(pieceImages);
  const imagePromises = [];

  for (let i = 0; i < imageKeys.length; i++) {
    const img = pieceImages[imageKeys[i]];

    if (!img || img.complete) {
      imagePromises.push(Promise.resolve());
      continue;
    }

    const loadPromise = new Promise(function (resolve) {
      const timeout = setTimeout(resolve, 10000);
      img.onload = function () {
        clearTimeout(timeout);
        resolve();
      };
      img.onerror = function () {
        clearTimeout(timeout);
        resolve();
      };
    });
    imagePromises.push(loadPromise);
  }

  await Promise.all(imagePromises);

  // CRITICAL: Calculate actual pixel dimensions based on mode
  let finalBoardPixels;

  if (mode === 'print') {
    // Apply quality multiplier directly to pixel resolution
    const baseBoardPixels = cmToPixels(boardSizeCm);
    finalBoardPixels = baseBoardPixels * exportQuality;
  } else {
    // Social mode: fixed base scaled by normalized multiplier
    const baseBoardPixels = EXPORT_MODE_CONFIG.social.fixedBoardPixels;
    finalBoardPixels = baseBoardPixels * (exportQuality / 24);
  }

  // Calculate border and frame sizes based on final resolution
  const params = getCoordinateParams(finalBoardPixels);
  let borderSize = 0;
  if (showCoords) {
    borderSize = params.borderSize;
  }

  // Check if thin frame should be added (8x or 16x only, if enabled)
  const showThinFrame = config.showThinFrame || false;
  const shouldShowFrame =
    showThinFrame && (exportQuality === 8 || exportQuality === 16);
  const frameThickness = shouldShowFrame
    ? Math.max(2, Math.round(finalBoardPixels * 0.003))
    : 0;
  const framePadding = shouldShowFrame ? frameThickness * 2 : 0;

  // Canvas dimensions include border, board, and optional frame
  const canvasWidth = Math.round(borderSize + finalBoardPixels + framePadding);
  const canvasHeight = Math.round(finalBoardPixels + borderSize + framePadding);

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext('2d', {
    alpha: true,
    desynchronized: false,
    willReadFrequently: false
  });

  // No scaling - work at actual resolution
  const squareSize = finalBoardPixels / 8;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Calculate board position with optional frame offset
  const frameOffset = shouldShowFrame ? frameThickness : 0;
  const boardX = borderSize + frameOffset;
  const boardY = frameOffset;

  /**
   * Get pixel bounds of board square.
   *
   * @param {number} rowIndex - Row index (0 = top)
   * @param {number} colIndex - Column index (0 = left)
   * @returns {Object} Square bounds
   */
  function getSquareBounds(rowIndex, colIndex) {
    const x0 = boardX + colIndex * squareSize;
    const x1 = boardX + (colIndex + 1) * squareSize;
    const y0 = boardY + rowIndex * squareSize;
    const y1 = boardY + (rowIndex + 1) * squareSize;

    return {
      x: x0,
      y: y0,
      width: x1 - x0,
      height: y1 - y0,
      centerX: (x0 + x1) / 2,
      centerY: (y0 + y1) / 2
    };
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw thin frame if enabled (8x and 16x only)
  if (shouldShowFrame) {
    ctx.fillStyle = '#333333';
    // Top frame
    ctx.fillRect(frameOffset, 0, borderSize + finalBoardPixels, frameThickness);
    // Bottom frame
    ctx.fillRect(
      frameOffset,
      frameOffset + finalBoardPixels + borderSize,
      borderSize + finalBoardPixels,
      frameThickness
    );
    // Left frame
    ctx.fillRect(0, 0, frameThickness, canvasHeight);
    // Right frame
    ctx.fillRect(
      frameOffset + borderSize + finalBoardPixels,
      0,
      frameThickness,
      canvasHeight
    );
  }

  // Draw coordinate border backgrounds if needed (for JPEG format)
  if (effectiveCoordBorder) {
    if (format === 'jpeg' || format === 'jpg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(frameOffset, frameOffset, borderSize, finalBoardPixels);
      ctx.fillRect(
        frameOffset,
        frameOffset + finalBoardPixels,
        borderSize + finalBoardPixels,
        borderSize
      );
    }
  }

  // Draw main board border
  const boardBorderWidth = Math.max(1, finalBoardPixels * 0.002);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = boardBorderWidth;
  ctx.strokeRect(boardX, boardY, finalBoardPixels, finalBoardPixels);

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 0) {
        ctx.fillStyle = lightSquare;
      } else {
        ctx.fillStyle = darkSquare;
      }

      let drawRow = row;
      let drawCol = col;
      if (flipped) {
        drawRow = 7 - row;
        drawCol = 7 - col;
      }

      const bounds = getSquareBounds(drawRow, drawCol);
      ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
  }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      let fenPiece = null;
      if (board[row] && board[row][col]) {
        fenPiece = board[row][col];
      }

      if (!fenPiece) {
        continue;
      }

      const pieceKey = getPieceKey(fenPiece);
      const img = pieceImages[pieceKey];

      if (!img || !img.complete || img.naturalWidth === 0) {
        continue;
      }

      let drawRow = row;
      let drawCol = col;
      if (flipped) {
        drawRow = 7 - row;
        drawCol = 7 - col;
      }

      const bounds = getSquareBounds(drawRow, drawCol);

      const pieceSize = Math.min(bounds.width, bounds.height);
      const px = bounds.centerX - pieceSize / 2;
      const py = bounds.centerY - pieceSize / 2;

      try {
        ctx.drawImage(img, px, py, pieceSize, pieceSize);
      } catch (err) {
        logger.error('Failed to draw piece ' + pieceKey + ':', err);
      }
    }
  }

  if (showCoords) {
    drawCoordinates(
      ctx,
      squareSize,
      borderSize + frameOffset,
      flipped,
      finalBoardPixels,
      true,
      false,
      boardY
    );
  }

  return canvas;
}

/**
 * Optimize canvas for output format.
 *
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {string} format - Output format (png/jpeg)
 * @returns {HTMLCanvasElement} Optimized canvas
 */
export function optimizeCanvasForFormat(canvas, format) {
  const optimized = document.createElement('canvas');
  optimized.width = canvas.width;
  optimized.height = canvas.height;

  const useAlpha = format === 'png';
  const ctx = optimized.getContext('2d', { alpha: useAlpha });

  if (format === 'jpeg' || format === 'jpg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, optimized.width, optimized.height);
  }

  ctx.drawImage(canvas, 0, 0);
  return optimized;
}

/**
 * Estimate output file sizes.
 *
 * @param {number} width - Canvas width in pixels
 * @param {number} height - Canvas height in pixels
 * @param {number} exportQuality - Quality multiplier
 * @returns {Object} Size estimates
 */
export function estimateFileSizes(width, height, exportQuality) {
  const pixels = width * height;
  const mode = getExportMode(exportQuality);

  let pngFactor;
  let jpegFactor;

  if (mode === 'print') {
    pngFactor = 1.2;
    jpegFactor = 0.12;
  } else {
    pngFactor = 1.8;
    jpegFactor = 0.18;
  }

  const pngBytes = Math.round(pixels * pngFactor);
  const jpegBytes = Math.round(pixels * jpegFactor);

  return {
    png: formatFileSize(pngBytes),
    jpeg: formatFileSize(jpegBytes),
    pngBytes: pngBytes,
    jpegBytes: jpegBytes
  };
}

/**
 * Format byte count as human-readable string.
 *
 * @param {number} bytes - Byte count
 * @returns {string} Formatted size
 */
function formatFileSize(bytes) {
  if (bytes < 1024) {
    return Math.round(bytes) + ' B';
  }
  if (bytes < 1024 * 1024) {
    return Math.round(bytes / 1024) + ' KB';
  }
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}
