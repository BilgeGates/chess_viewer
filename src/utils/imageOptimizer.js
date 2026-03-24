import { QUALITY_PRESETS } from '@/constants';

import { getCoordinateParams } from './coordinateCalculations';
import { logger } from './logger';

export const PRINT_DPI = 300;
export const CM_TO_PIXELS = PRINT_DPI / 2.54;
/**
 * Converts centimetres to pixels at PRINT_DPI.
 *
 * @param {number} cm
 * @returns {number} Pixel count
 */
export function cmToPixels(cm) {
  return Math.round(cm * CM_TO_PIXELS);
}
/**
 * Converts pixels to centimetres at PRINT_DPI.
 *
 * @param {number} pixels
 * @returns {number}
 */
export function pixelsToCm(pixels) {
  return pixels / CM_TO_PIXELS;
}
let _cachedMaxCanvasSize = null;

/**
 * Returns the maximum canvas dimension supported by the current browser.
 *
 * @returns {number} Max canvas size in pixels
 */
export function getMaxCanvasSize() {
  if (_cachedMaxCanvasSize !== null) return _cachedMaxCanvasSize;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let maxSize = 16384;
  try {
    canvas.width = 1;
    canvas.height = 1;
    if (!ctx) {
      maxSize = 8192;
    }
  } catch {
    maxSize = 8192;
  }
  _cachedMaxCanvasSize = maxSize;
  return maxSize;
}
/**
 * Returns the export mode ('print' or 'social') for a given quality multiplier.
 *
 * @param {number} quality - Export quality value
 * @returns {string}
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
 * @param {number} quality
 * @returns {boolean} True if the quality preset forces a coordinate border
 */
export function shouldForceCoordinateBorder(quality) {
  for (let i = 0; i < QUALITY_PRESETS.length; i++) {
    if (QUALITY_PRESETS[i].value === quality) {
      return !!QUALITY_PRESETS[i].forceCoordinateBorder;
    }
  }
  return false;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return Math.round(bytes) + ' B';
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}
/**
 * Calculates the final canvas dimensions for an export operation.
 *
 * @param {number} boardSizeCm - Physical board size in centimetres
 * @param {boolean} showCoords - Whether to include coordinate border
 * @param {number} exportQuality - Quality multiplier
 * @returns {Object} Export size details including width, height, borderSize, mode, etc.
 */
export function calculateExportSize(boardSizeCm, showCoords, exportQuality) {
  const mode = getExportMode(exportQuality);
  const maxCanvasSize = getMaxCanvasSize();
  let actualResolutionPixels;
  let physicalSizeCm;
  let scaleFactor;
  if (mode === 'print') {
    const baseBoardPixels = cmToPixels(boardSizeCm);
    actualResolutionPixels = baseBoardPixels * exportQuality;
    physicalSizeCm = boardSizeCm;
    scaleFactor = 1;
  } else {
    const baseBoardPixels = 2400;
    scaleFactor = exportQuality / 24;
    actualResolutionPixels = baseBoardPixels * scaleFactor;
    physicalSizeCm = null;
  }
  const params = getCoordinateParams(actualResolutionPixels);
  const borderSize = showCoords ? params.borderSize : 0;
  const finalWidth = Math.round(borderSize + actualResolutionPixels);
  const finalHeight = Math.round(actualResolutionPixels + borderSize);
  let reducedWidth = finalWidth;
  let reducedHeight = finalHeight;
  let actualScaleFactor = 1.0;
  if (finalWidth > maxCanvasSize || finalHeight > maxCanvasSize) {
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
    baseBoardPixels: actualResolutionPixels,
    baseWidth: finalWidth,
    baseHeight: finalHeight,
    borderSize,
    physicalSizeCm,
    effectiveDPI: mode === 'print' ? PRINT_DPI * exportQuality : null,
    mode,
    exportQuality
  };
}

/**
 * Returns the effective scale factor after applying quality constraints.
 *
 * @param {number} boardSizeCm
 * @param {boolean} showCoords
 * @param {number} [requestedQuality]
 * @returns {number} Scale factor (1.0 = no reduction)
 */
export function calculateOptimalQuality(
  boardSizeCm,
  showCoords,
  requestedQuality
) {
  const quality = requestedQuality ?? 1;
  const exportSize = calculateExportSize(boardSizeCm, showCoords, quality);
  return exportSize.scaleFactor;
}
/**
 * Estimates PNG and JPEG file sizes for given canvas dimensions.
 *
 * @param {number} width
 * @param {number} height
 * @param {number} exportQuality
 * @returns {{ png: string, jpeg: string, pngBytes: number, jpegBytes: number }}
 */
export function estimateFileSizes(width, height, exportQuality) {
  const pixels = width * height;
  const mode = getExportMode(exportQuality);
  const pngFactor = mode === 'print' ? 1.2 : 1.8;
  const jpegFactor = mode === 'print' ? 0.12 : 0.18;
  const pngBytes = Math.round(pixels * pngFactor);
  const jpegBytes = Math.round(pixels * jpegFactor);
  return {
    png: formatFileSize(pngBytes),
    jpeg: formatFileSize(jpegBytes),
    pngBytes,
    jpegBytes
  };
}
