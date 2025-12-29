import { createUltraQualityCanvas } from "./imageOptimizer";

/**
 * Cancellation flag
 */
let isCancelled = false;

/**
 * Cancel current export
 */
export function cancelExport() {
  isCancelled = true;
}

/**
 * Reset cancellation
 */
export function resetCancellation() {
  isCancelled = false;
}

/**
 * Download PNG with proper cancellation
 */
export async function downloadPNG(config, fileName, onProgress) {
  isCancelled = false;

  try {
    onProgress?.(10);

    // Create canvas
    const canvas = createUltraQualityCanvas(config);
    if (isCancelled) throw new Error("Cancelled");

    onProgress?.(30);

    // Create blob - this is the actual work
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (isCancelled) {
            reject(new Error("Cancelled"));
            return;
          }
          if (!blob) {
            reject(new Error("Failed to create PNG blob"));
            return;
          }
          resolve(blob);
        },
        "image/png",
        1.0
      );
    });

    if (isCancelled) throw new Error("Cancelled");

    onProgress?.(70);

    // Download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();

    onProgress?.(100);

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    if (error.message === "Cancelled") {
      throw new Error("Export cancelled");
    }
    throw new Error(`PNG export failed: ${error.message}`);
  }
}

/**
 * Download JPEG with proper cancellation
 */
export async function downloadJPEG(config, fileName, onProgress) {
  isCancelled = false;

  try {
    onProgress?.(10);

    // Create canvas
    const canvas = createUltraQualityCanvas(config);
    if (isCancelled) throw new Error("Cancelled");

    onProgress?.(20);

    // Add white background
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const ctx = tempCanvas.getContext("2d", { alpha: false });
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    ctx.drawImage(canvas, 0, 0);

    if (isCancelled) throw new Error("Cancelled");
    onProgress?.(40);

    // Create blob
    const blob = await new Promise((resolve, reject) => {
      tempCanvas.toBlob(
        (blob) => {
          if (isCancelled) {
            reject(new Error("Cancelled"));
            return;
          }
          if (!blob) {
            reject(new Error("Failed to create JPEG blob"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.98
      );
    });

    if (isCancelled) throw new Error("Cancelled");

    onProgress?.(70);

    // Download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.jpg`;
    document.body.appendChild(link);
    link.click();

    onProgress?.(100);

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    if (error.message === "Cancelled") {
      throw new Error("Export cancelled");
    }
    throw new Error(`JPEG export failed: ${error.message}`);
  }
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(config) {
  isCancelled = false;

  try {
    const canvas = createUltraQualityCanvas(config);
    if (isCancelled) throw new Error("Cancelled");

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (isCancelled) {
            reject(new Error("Cancelled"));
            return;
          }
          if (!blob) reject(new Error("Failed to create blob"));
          else resolve(blob);
        },
        "image/png",
        1.0
      );
    });

    if (isCancelled) throw new Error("Cancelled");
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);

    return true;
  } catch (error) {
    if (error.message === "Cancelled") {
      throw new Error("Export cancelled");
    }
    throw new Error(`Copy failed: ${error.message}`);
  }
}

/**
 * Batch export
 */
export async function batchExport(config, formats, fileName, onProgress) {
  isCancelled = false;
  const total = formats.length;
  const results = { success: [], failed: [] };

  for (let i = 0; i < total; i++) {
    if (isCancelled) throw new Error("Export cancelled");

    const format = formats[i];
    const baseProgress = (i / total) * 100;

    try {
      const updateProgress = (p) => {
        const totalProgress = baseProgress + p / total;
        onProgress?.(totalProgress, format);
      };

      if (format === "png") {
        await downloadPNG(config, fileName, updateProgress);
        results.success.push("PNG");
      } else if (format === "jpeg") {
        await downloadJPEG(config, fileName, updateProgress);
        results.success.push("JPEG");
      }
    } catch (error) {
      if (error.message === "Export cancelled") {
        throw error;
      }
      results.failed.push({ format, error: error.message });
    }
  }

  onProgress?.(100, null);

  if (results.failed.length > 0) {
    throw new Error(
      `Some exports failed: ${results.failed.map((f) => f.format).join(", ")}`
    );
  }

  return results;
}
