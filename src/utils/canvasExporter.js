import {
  createUltraQualityCanvas,
  calculateExportSize,
  getMaxCanvasSize
} from './';

/**
 * Export state management
 */
let exportState = {
  cancelled: false,
  paused: false
};

/**
 * Cancel current export
 */
export function cancelExport() {
  exportState.cancelled = true;
  exportState.paused = false;
}

/**
 * Pause current export
 */
export function pauseExport() {
  exportState.paused = true;
}

/**
 * Resume current export
 */
export function resumeExport() {
  exportState.paused = false;
}

/**
 * Reset export state
 */
export function resetExportState() {
  exportState = {
    cancelled: false,
    paused: false
  };
}

/**
 * Wait while paused
 */
async function waitWhilePaused() {
  while (exportState.paused && !exportState.cancelled) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

/**
 * Check if cancelled
 */
function checkCancellation() {
  if (exportState.cancelled) {
    throw new Error('Export cancelled');
  }
}

/**
 * Simulate progress with pause support
 */
async function simulateProgress(onProgress, start, end, duration) {
  const steps = 20;
  const stepSize = (end - start) / steps;
  const stepDuration = duration / steps;

  for (let i = 0; i < steps; i++) {
    await waitWhilePaused();
    checkCancellation();

    const progress = start + stepSize * (i + 1);
    onProgress?.(Math.min(progress, end));

    await new Promise((resolve) => setTimeout(resolve, stepDuration));
  }
}

export function getExportInfo(config) {
  const { boardSize, showCoords, exportQuality } = config;
  const exportSize = calculateExportSize(boardSize, showCoords, exportQuality);
  const maxSize = getMaxCanvasSize();

  return {
    displaySize: exportSize.displaySize,
    exportWidth: exportSize.width,
    exportHeight: exportSize.height,
    requestedQuality: exportQuality,
    actualQuality: exportSize.actualQuality,
    maxCanvasSize: maxSize,
    willBeReduced: exportSize.actualQuality < exportQuality,
    fileSizeEstimate: estimateFileSize(exportSize.width, exportSize.height)
  };
}

function estimateFileSize(width, height) {
  const pixels = width * height;
  const pngSize = (pixels * 3) / 1024 / 1024;
  const jpegSize = pngSize * 0.1;

  return {
    png: `${pngSize.toFixed(1)} MB`,
    jpeg: `${jpegSize.toFixed(1)} MB`
  };
}

/**
 * Validate config before export
 */
function validateExportConfig(config) {
  const errors = [];

  if (!config) {
    errors.push('Config is null or undefined');
  } else {
    if (!config.boardSize || config.boardSize < 100) {
      errors.push(
        `Invalid boardSize: ${config.boardSize} (minimum 100px for 4cm)`
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
      errors.push(`pieceImages is not an object: ${typeof config.pieceImages}`);
    } else if (Object.keys(config.pieceImages).length === 0) {
      errors.push('pieceImages is empty');
    }
  }

  if (errors.length > 0) {
    throw new Error('Invalid export config: ' + errors.join(', '));
  }
}

/**
 * Download PNG with comprehensive error handling
 */
export async function downloadPNG(config, fileName, onProgress) {
  resetExportState();

  try {
    validateExportConfig(config);

    onProgress?.(5);
    await simulateProgress(onProgress, 5, 15, 300);

    await waitWhilePaused();
    checkCancellation();

    const canvas = await createUltraQualityCanvas(config);

    if (!canvas) {
      throw new Error('Canvas creation returned null');
    }

    onProgress?.(30);
    await simulateProgress(onProgress, 30, 50, 400);

    await waitWhilePaused();
    checkCancellation();

    const blob = await new Promise((resolve, reject) => {
      try {
        canvas.toBlob(
          (blob) => {
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
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();

    onProgress?.(100);

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    if (error.message === 'Export cancelled') {
      throw new Error('Export cancelled');
    }
    throw new Error(`PNG export failed: ${error.message}`);
  }
}

/**
 * Download JPEG with comprehensive error handling
 */
export async function downloadJPEG(config, fileName, onProgress) {
  resetExportState();

  try {
    validateExportConfig(config);

    onProgress?.(5);
    await simulateProgress(onProgress, 5, 15, 300);

    await waitWhilePaused();
    checkCancellation();

    const canvas = await createUltraQualityCanvas(config);

    if (!canvas) {
      throw new Error('Canvas creation returned null');
    }

    onProgress?.(25);
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

    // Fill white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Copy full canvas (no crop) to preserve borders and exact dimensions
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(canvas, 0, 0);

    onProgress?.(45);
    await simulateProgress(onProgress, 45, 60, 400);

    await waitWhilePaused();
    checkCancellation();

    const blob = await new Promise((resolve, reject) => {
      try {
        tempCanvas.toBlob(
          (blob) => {
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
          0.85
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
    link.download = `${fileName}.jpg`;
    document.body.appendChild(link);
    link.click();

    onProgress?.(100);

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    if (error.message === 'Export cancelled') {
      throw new Error('Export cancelled');
    }
    throw new Error(`JPEG export failed: ${error.message}`);
  }
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(config) {
  resetExportState();

  try {
    validateExportConfig(config);

    const canvas = await createUltraQualityCanvas(config);

    if (!canvas) {
      throw new Error('Canvas creation returned null');
    }

    checkCancellation();

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
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

    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);

    return true;
  } catch (error) {
    if (error.message === 'Export cancelled') {
      throw new Error('Export cancelled');
    }
    throw new Error(`Copy failed: ${error.message}`);
  }
}

/**
 * Batch export
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
      const updateProgress = (p) => {
        const totalProgress = baseProgress + p / total;
        onProgress?.(totalProgress, format);
      };

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
      results.failed.push({ format, error: error.message });
    }
  }

  onProgress?.(100, null);

  if (results.failed.length > 0) {
    throw new Error(
      `Some exports failed: ${results.failed.map((f) => f.format).join(', ')}`
    );
  }

  return results;
}
