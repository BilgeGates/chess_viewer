import { createUltraQualityCanvas } from './';
import { logger } from './logger';

/**
 * Progressive export with auto-scaling for large images.
 *
 * @param {Object} config - Export configuration
 * @param {string} fileName - File name without extension
 * @param {string} format - Output format (png/jpeg)
 */
export async function progressiveExport(config, fileName, format) {
  if (format === undefined || format === null) {
    format = 'png';
  }

  const canvas = createSmartCanvas(config);

  if (canvas.width > 8192 || canvas.height > 8192) {
    return await chunkedExport(canvas, fileName, format);
  }

  return await standardExport(canvas, fileName, format);
}

/**
 * Create canvas with memory-safe size limits.
 *
 * @param {Object} config - Export configuration
 * @returns {HTMLCanvasElement} Rendered canvas
 */
function createSmartCanvas(config) {
  const maxSafeSize = 16384;

  const adjustedConfig = Object.assign({}, config);

  const projectedSize = (config.boardSize + 60) * config.exportQuality;

  if (projectedSize > maxSafeSize) {
    const safeQuality = Math.floor(maxSafeSize / (config.boardSize + 60));

    if (safeQuality < 8) {
      adjustedConfig.exportQuality = 8;
    } else {
      adjustedConfig.exportQuality = safeQuality;
    }

    logger.warn(
      'Quality adjusted to ' + adjustedConfig.exportQuality + 'x for stability'
    );
  }

  return createUltraQualityCanvas(adjustedConfig);
}

/**
 * Export large images with 50% scaling.
 *
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {string} fileName - File name without extension
 * @param {string} format - Output format (png/jpeg)
 */
async function chunkedExport(canvas, fileName, format) {
  logger.warn('Image too large, scaling down...');

  const scale = 0.5;
  const smallerCanvas = document.createElement('canvas');
  smallerCanvas.width = canvas.width * scale;
  smallerCanvas.height = canvas.height * scale;

  const ctx = smallerCanvas.getContext('2d');
  ctx.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);

  return await standardExport(smallerCanvas, fileName, format);
}

/**
 * Standard canvas-to-file download.
 *
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {string} fileName - File name without extension
 * @param {string} format - Output format (png/jpeg)
 */
async function standardExport(canvas, fileName, format) {
  let mimeType = 'image/png';
  let extension = 'png';
  let quality = 1.0;

  if (format === 'jpeg') {
    mimeType = 'image/jpeg';
    extension = 'jpg';
    quality = 0.98;
  }

  return new Promise(function (resolve, reject) {
    canvas.toBlob(
      function (blob) {
        if (!blob) {
          reject(new Error('Failed to create ' + format + ' blob'));
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName + '.' + extension;

        document.body.appendChild(link);
        link.click();

        setTimeout(function () {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          resolve();
        }, 100);
      },
      mimeType,
      quality
    );
  });
}
