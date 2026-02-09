import {
  createUltraQualityCanvas,
  calculateExportSize,
  getMaxCanvasSize,
  sanitizeFileName,
  getExportMode,
  shouldForceCoordinateBorder,
  estimateFileSizes
} from './';

let exportState = {
  cancelled: false,
  paused: false
};

export function cancelExport() {
  exportState.cancelled = true;
  exportState.paused = false;
}

export function pauseExport() {
  exportState.paused = true;
}

export function resumeExport() {
  exportState.paused = false;
}

export function resetExportState() {
  exportState = {
    cancelled: false,
    paused: false
  };
}

/**
 * Wait while export is paused.
 */
async function waitWhilePaused() {
  while (exportState.paused && !exportState.cancelled) {
    await new Promise(function (resolve) {
      setTimeout(resolve, 100);
    });
  }
}

/**
 * Throw error if export was cancelled.
 */
function checkCancellation() {
  if (exportState.cancelled) {
    throw new Error('Export cancelled');
  }
}

/**
 * Animate progress bar smoothly across a range.
 *
 * @param {Function} onProgress - Progress callback (0-100)
 * @param {number} start - Starting progress value
 * @param {number} end - Ending progress value
 * @param {number} duration - Duration in milliseconds
 */
async function simulateProgress(onProgress, start, end, duration) {
  const steps = 20;
  const stepSize = (end - start) / steps;
  const stepDuration = duration / steps;

  for (let i = 0; i < steps; i++) {
    await waitWhilePaused();
    checkCancellation();

    const progress = start + stepSize * (i + 1);
    const clampedProgress = Math.min(progress, end);
    if (onProgress) {
      onProgress(clampedProgress);
    }

    await new Promise(function (resolve) {
      setTimeout(resolve, stepDuration);
    });
  }
}

/**
 * Get export information before starting export.
 *
 * @param {Object} config - Export configuration
 * @returns {Object} Dimensions, file size estimates, and mode info
 */
export function getExportInfo(config) {
  const boardSize = config.boardSize;
  const showCoords = config.showCoords;
  const exportQuality = config.exportQuality;

  const exportSize = calculateExportSize(boardSize, showCoords, exportQuality);
  const maxSize = getMaxCanvasSize();
  const mode = getExportMode(exportQuality);
  const fileSizes = estimateFileSizes(
    exportSize.width,
    exportSize.height,
    exportQuality
  );

  return {
    displaySize: exportSize.width + ' × ' + exportSize.height,
    exportWidth: exportSize.width,
    exportHeight: exportSize.height,
    requestedQuality: exportQuality,
    actualQuality: exportSize.actualQuality,
    maxCanvasSize: maxSize,
    willBeReduced: exportSize.width > maxSize || exportSize.height > maxSize,
    fileSizeEstimate: fileSizes,
    mode: mode,
    physicalSizeCm: exportSize.baseSizeCm,
    effectiveDPI: exportSize.dpi,
    forceCoordinateBorder: shouldForceCoordinateBorder(exportQuality)
  };
}

/**
 * Validate export configuration.
 *
 * @param {Object} config - Export configuration
 * @throws {Error} If configuration is invalid
 */
function validateExportConfig(config) {
  const errors = [];

  if (!config) {
    errors.push('Config is null or undefined');
  } else {
    if (!config.boardSize || config.boardSize < 1) {
      errors.push(
        'Invalid boardSize: ' + config.boardSize + 'cm (minimum 1cm)'
      );
    }

    if (!config.fen) {
      errors.push('FEN is missing');
    }

    if (!config.lightSquare || !config.darkSquare) {
      errors.push('Square colors are missing');
    }

    if (!config.pieceImages) {
      errors.push('pieceImages is null or undefined');
    } else if (typeof config.pieceImages !== 'object') {
      errors.push('pieceImages is not an object: ' + typeof config.pieceImages);
    } else if (Object.keys(config.pieceImages).length === 0) {
      errors.push('pieceImages is empty');
    }
  }

  if (errors.length > 0) {
    throw new Error('Invalid export config: ' + errors.join(', '));
  }
}

/**
 * Export board as PNG file with transparent background.
 *
 * @param {Object} config - Export configuration
 * @param {string} fileName - File name without extension
 * @param {Function} onProgress - Progress callback (0-100)
 */
export async function downloadPNG(config, fileName, onProgress) {
  resetExportState();

  try {
    validateExportConfig(config);
    const safeFileName = sanitizeFileName(fileName);

    if (onProgress) {
      onProgress(5);
    }
    await simulateProgress(onProgress, 5, 15, 300);

    await waitWhilePaused();
    checkCancellation();

    const pngConfig = Object.assign({}, config, { format: 'png' });
    const canvas = await createUltraQualityCanvas(pngConfig);

    if (!canvas) {
      throw new Error('Canvas creation returned null');
    }

    if (onProgress) {
      onProgress(30);
    }
    await simulateProgress(onProgress, 30, 50, 400);

    await waitWhilePaused();
    checkCancellation();

    const blob = await new Promise(function (resolve, reject) {
      try {
        canvas.toBlob(
          function (blob) {
            if (exportState.cancelled) {
              reject(new Error('Export cancelled'));
              return;
            }
            if (!blob) {
              reject(
                new Error(
                  'Canvas.toBlob returned null - browser may not support this feature'
                )
              );
              return;
            }
            resolve(blob);
          },
          'image/png',
          1.0
        );
      } catch (err) {
        reject(err);
      }
    });

    await simulateProgress(onProgress, 50, 80, 300);
    await waitWhilePaused();
    checkCancellation();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = safeFileName + '.png';
    document.body.appendChild(link);
    link.click();

    if (onProgress) {
      onProgress(100);
    }

    setTimeout(function () {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    if (error.message === 'Export cancelled') {
      throw new Error('Export cancelled', { cause: error });
    }
    throw new Error('PNG export failed: ' + error.message, { cause: error });
  } finally {
    resetExportState();
  }
}

/**
 * Export board as JPEG file with white background.
 *
 * @param {Object} config - Export configuration
 * @param {string} fileName - File name without extension
 * @param {Function} onProgress - Progress callback (0-100)
 */
export async function downloadJPEG(config, fileName, onProgress) {
  resetExportState();

  try {
    validateExportConfig(config);
    const safeFileName = sanitizeFileName(fileName);

    if (onProgress) {
      onProgress(5);
    }
    await simulateProgress(onProgress, 5, 15, 300);

    await waitWhilePaused();
    checkCancellation();

    const jpegConfig = Object.assign({}, config, { format: 'jpeg' });
    const canvas = await createUltraQualityCanvas(jpegConfig);

    if (!canvas) {
      throw new Error('Canvas creation returned null');
    }

    if (onProgress) {
      onProgress(25);
    }
    await simulateProgress(onProgress, 25, 35, 300);

    await waitWhilePaused();
    checkCancellation();

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    const ctx = tempCanvas.getContext('2d', {
      alpha: false,
      desynchronized: false,
      willReadFrequently: false
    });

    if (!ctx) {
      throw new Error('Failed to get 2D context for JPEG conversion');
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(canvas, 0, 0);

    if (onProgress) {
      onProgress(45);
    }
    await simulateProgress(onProgress, 45, 60, 400);

    await waitWhilePaused();
    checkCancellation();

    const jpegQuality = 0.92;

    const blob = await new Promise(function (resolve, reject) {
      try {
        tempCanvas.toBlob(
          function (blob) {
            if (exportState.cancelled) {
              reject(new Error('Export cancelled'));
              return;
            }
            if (!blob) {
              reject(
                new Error(
                  'Canvas.toBlob returned null - browser may not support JPEG export'
                )
              );
              return;
            }
            resolve(blob);
          },
          'image/jpeg',
          jpegQuality
        );
      } catch (err) {
        reject(err);
      }
    });

    await simulateProgress(onProgress, 60, 85, 300);
    await waitWhilePaused();
    checkCancellation();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = safeFileName + '.jpg';
    document.body.appendChild(link);
    link.click();

    if (onProgress) {
      onProgress(100);
    }

    setTimeout(function () {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
      tempCanvas.width = 0;
      tempCanvas.height = 0;
    }, 100);
  } catch (error) {
    if (error.message === 'Export cancelled') {
      throw new Error('Export cancelled', { cause: error });
    }
    throw new Error('JPEG export failed: ' + error.message, { cause: error });
  } finally {
    resetExportState();
  }
}

/**
 * Copy board image to clipboard.
 *
 * @param {Object} config - Export configuration
 * @returns {boolean} True if successful
 */
export async function copyToClipboard(config) {
  resetExportState();
  let canvas = null;

  try {
    validateExportConfig(config);

    canvas = await createUltraQualityCanvas(config);

    if (!canvas) {
      throw new Error('Canvas creation returned null');
    }

    checkCancellation();

    const blob = await new Promise(function (resolve, reject) {
      canvas.toBlob(
        function (blob) {
          if (exportState.cancelled) {
            reject(new Error('Export cancelled'));
            return;
          }
          if (!blob) {
            reject(new Error('Failed to create blob for clipboard'));
          } else {
            resolve(blob);
          }
        },
        'image/png',
        1.0
      );
    });

    checkCancellation();

    const clipboardItem = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([clipboardItem]);

    return true;
  } catch (error) {
    if (error.message === 'Export cancelled') {
      throw new Error('Export cancelled', { cause: error });
    }
    throw new Error('Copy failed: ' + error.message, { cause: error });
  } finally {
    if (canvas) {
      canvas.width = 0;
      canvas.height = 0;
    }
    resetExportState();
  }
}

/**
 * Export board in multiple formats.
 *
 * @param {Object} config - Export configuration
 * @param {string[]} formats - Array of format names (e.g., ['png', 'jpeg'])
 * @param {string} fileName - File name without extension
 * @param {Function} onProgress - Progress callback (progress, currentFormat)
 * @returns {Object} { success: [...], failed: [...] }
 */
export async function batchExport(config, formats, fileName, onProgress) {
  resetExportState();
  validateExportConfig(config);

  const total = formats.length;
  const results = { success: [], failed: [] };

  for (let i = 0; i < total; i++) {
    if (exportState.cancelled) {
      throw new Error('Export cancelled');
    }

    const format = formats[i];
    const baseProgress = (i / total) * 100;

    try {
      function updateProgress(p) {
        const totalProgress = baseProgress + p / total;
        if (onProgress) {
          onProgress(totalProgress, format);
        }
      }

      if (format === 'png') {
        await downloadPNG(config, fileName, updateProgress);
        results.success.push('PNG');
      } else if (format === 'jpeg') {
        await downloadJPEG(config, fileName, updateProgress);
        results.success.push('JPEG');
      }
    } catch (error) {
      if (error.message === 'Export cancelled') {
        throw error;
      }
      results.failed.push({ format: format, error: error.message });
    }
  }

  if (onProgress) {
    onProgress(100, null);
  }

  if (results.failed.length > 0) {
    const failedNames = [];
    for (let i = 0; i < results.failed.length; i++) {
      failedNames.push(results.failed[i].format);
    }
    throw new Error('Some exports failed: ' + failedNames.join(', '));
  }

  return results;
}
