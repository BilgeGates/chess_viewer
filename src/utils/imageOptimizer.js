import { drawCoordinates, parseFEN, getCoordinateParams } from './';
import { logger } from './logger';
import {
  EXPORT_MODE_CONFIG,
  QUALITY_PRESETS
} from '@/constants/chessConstants';

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

  if (mode === 'print') {
    baseBoardPixels = cmToPixels(boardSizeCm);
    scaleFactor = exportQuality; // 8x or 16x
    physicalSizeCm = boardSizeCm;
  } else {
    // SOCIAL: Fixed pixel size, ignore physical dimensions
    baseBoardPixels = EXPORT_MODE_CONFIG.social.fixedBoardPixels;
    scaleFactor = exportQuality / 24; // Normalize (24x = 1.0, 32x = 1.33)
    physicalSizeCm = null;
  }

  // Get coordinate border size at BASE resolution
  const params = getCoordinateParams(baseBoardPixels);
  let borderSize = 0;
  if (showCoords) {
    borderSize = params.borderSize;
  }

  // Canvas dimensions at BASE resolution (before scaling)
  const baseWidth = borderSize + baseBoardPixels;
  const baseHeight = baseBoardPixels + borderSize;

  // Check if the final size exceeds browser limits
  const finalWidth = Math.round(baseWidth * scaleFactor);
  const finalHeight = Math.round(baseHeight * scaleFactor);

  if (finalWidth > maxCanvasSize || finalHeight > maxCanvasSize) {
    // Reduce the scale factor to fit within browser limits
    const maxDim = Math.max(finalWidth, finalHeight);
    scaleFactor = scaleFactor * (maxCanvasSize / maxDim);
    logger.warn(
      'Scale reduced to ' +
        scaleFactor.toFixed(2) +
        'x for browser compatibility'
    );
  }

  return {
    width: Math.round(baseWidth * scaleFactor),
    height: Math.round(baseHeight * scaleFactor),
    scaleFactor: scaleFactor,
    baseBoardPixels: baseBoardPixels,
    baseWidth: baseWidth,
    baseHeight: baseHeight,
    borderSize: borderSize,
    physicalSizeCm: physicalSizeCm,
    effectiveDPI: mode === 'print' ? PRINT_DPI * scaleFactor : null,
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
 * Create ultra-high-quality canvas of chess board.
 *
 * Print modes (8x, 16x): Physical size preserved, quality increases pixel density.
 * Social modes (24x, 32x): Fixed 4800px base, scaled up for social media.
 *
 * @param {Object} config - Export configuration
 * @returns {HTMLCanvasElement} Rendered canvas
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

  let baseBoardPixels;
  let scaleFactor;

  if (mode === 'print') {
    baseBoardPixels = cmToPixels(boardSizeCm);
    scaleFactor = exportQuality;
  } else {
    baseBoardPixels = EXPORT_MODE_CONFIG.social.fixedBoardPixels;
    scaleFactor = exportQuality / 24;
  }

  const params = getCoordinateParams(baseBoardPixels);
  let borderSize = 0;
  if (showCoords) {
    borderSize = params.borderSize;
  }

  const baseWidth = borderSize + baseBoardPixels;
  const baseHeight = baseBoardPixels + borderSize;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(baseWidth * scaleFactor);
  canvas.height = Math.round(baseHeight * scaleFactor);

  const ctx = canvas.getContext('2d', {
    alpha: true,
    desynchronized: false,
    willReadFrequently: false
  });

  ctx.scale(scaleFactor, scaleFactor);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const squareSize = baseBoardPixels / 8;
  const boardX = borderSize;
  const boardY = 0;

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

  ctx.clearRect(0, 0, baseWidth, baseHeight);

  if (effectiveCoordBorder) {
    if (format === 'jpeg' || format === 'jpg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, borderSize, baseBoardPixels);
      ctx.fillRect(0, baseBoardPixels, baseWidth, borderSize);
    }

    const borderLineWidth = Math.max(0.5, baseBoardPixels * 0.001);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = borderLineWidth;
    ctx.strokeRect(0, 0, borderSize, baseBoardPixels);
    ctx.strokeRect(borderSize, baseBoardPixels, baseBoardPixels, borderSize);
  }

  const boardBorderWidth = Math.max(1, baseBoardPixels * 0.002);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = boardBorderWidth;
  ctx.strokeRect(boardX, boardY, baseBoardPixels, baseBoardPixels);

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
      borderSize,
      flipped,
      baseBoardPixels,
      true,
      false
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
