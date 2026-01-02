import { createUltraQualityCanvas } from "./";

/**
 * PROGRESSIVE DOWNLOAD STRATEGY
 * Breaks large canvases into chunks to prevent memory issues
 */
export const progressiveExport = async (config, fileName, format = "png") => {
  const canvas = createSmartCanvas(config);

  // For very large exports, use chunked approach
  if (canvas.width > 8192 || canvas.height > 8192) {
    return await chunkedExport(canvas, fileName, format);
  }

  // Standard export for reasonable sizes
  return await standardExport(canvas, fileName, format);
};

/**
 * Create canvas with smart memory management
 */
const createSmartCanvas = (config) => {
  const maxSafeSize = 16384;
  let adjustedConfig = { ...config };

  const projectedSize = (config.boardSize + 60) * config.exportQuality;

  if (projectedSize > maxSafeSize) {
    const safeQuality = Math.floor(maxSafeSize / (config.boardSize + 60));
    adjustedConfig.exportQuality = Math.max(8, safeQuality);
    console.warn(
      `Quality adjusted to ${adjustedConfig.exportQuality}x for stability`
    );
  }

  return createUltraQualityCanvas(adjustedConfig);
};

/**
 * Chunked export for very large images
 */
const chunkedExport = async (canvas, fileName, format) => {
  // This would split canvas into tiles and reassemble
  // For now, we'll just scale down
  console.warn("Image too large, scaling down...");

  const scale = 0.5;
  const smallerCanvas = document.createElement("canvas");
  smallerCanvas.width = canvas.width * scale;
  smallerCanvas.height = canvas.height * scale;

  const ctx = smallerCanvas.getContext("2d");
  ctx.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);

  return await standardExport(smallerCanvas, fileName, format);
};

/**
 * Standard export method
 */
const standardExport = async (canvas, fileName, format) => {
  const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
  const extension = format === "jpeg" ? "jpg" : "png";
  const quality = format === "jpeg" ? 0.98 : 1.0;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return reject(new Error(`Failed to create ${format} blob`));
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.${extension}`;

        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve();
        }, 100);
      },
      mimeType,
      quality
    );
  });
};
