import {
  createUltraQualityCanvas,
  calculateExportSize,
  getMaxCanvasSize,
} from "./imageOptimizer";

/**
 * Export state management
 */
let exportState = {
  cancelled: false,
  paused: false,
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
    paused: false,
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
    throw new Error("Export cancelled");
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
    fileSizeEstimate: estimateFileSize(exportSize.width, exportSize.height),
  };
}

function estimateFileSize(width, height) {
  const pixels = width * height;
  const pngSize = (pixels * 3) / 1024 / 1024; // ~3 bytes per pixel for PNG
  const jpegSize = pngSize * 0.15; // JPEG ~15% of PNG

  return {
    png: `${pngSize.toFixed(1)} MB`,
    jpeg: `${jpegSize.toFixed(1)} MB`,
  };
}

/**
 * Download PNG with proper cancellation and pause
 */
export async function downloadPNG(config, fileName, onProgress) {
  resetExportState();

  try {
    onProgress?.(5);
    await simulateProgress(onProgress, 5, 15, 300);

    // Create canvas
    await waitWhilePaused();
    checkCancellation();
    const canvas = createUltraQualityCanvas(config);

    onProgress?.(30);
    await simulateProgress(onProgress, 30, 50, 400);

    // Create blob
    await waitWhilePaused();
    checkCancellation();

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (exportState.cancelled) {
            reject(new Error("Export cancelled"));
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

    await simulateProgress(onProgress, 50, 80, 300);
    await waitWhilePaused();
    checkCancellation();

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
    if (error.message === "Export cancelled") {
      throw new Error("Export cancelled");
    }
    throw new Error(`PNG export failed: ${error.message}`);
  }
}

/**
 * Download JPEG with proper cancellation and pause
 */
export async function downloadJPEG(config, fileName, onProgress) {
  resetExportState();

  try {
    onProgress?.(5);
    await simulateProgress(onProgress, 5, 15, 300);

    // Create canvas
    await waitWhilePaused();
    checkCancellation();
    const canvas = createUltraQualityCanvas(config);

    onProgress?.(25);
    await simulateProgress(onProgress, 25, 35, 300);

    // Add white background
    await waitWhilePaused();
    checkCancellation();

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const ctx = tempCanvas.getContext("2d", { alpha: false });
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    ctx.drawImage(canvas, 0, 0);

    onProgress?.(45);
    await simulateProgress(onProgress, 45, 60, 400);

    // Create blob
    await waitWhilePaused();
    checkCancellation();

    const blob = await new Promise((resolve, reject) => {
      tempCanvas.toBlob(
        (blob) => {
          if (exportState.cancelled) {
            reject(new Error("Export cancelled"));
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

    await simulateProgress(onProgress, 60, 85, 300);
    await waitWhilePaused();
    checkCancellation();

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
    if (error.message === "Export cancelled") {
      throw new Error("Export cancelled");
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
    const canvas = createUltraQualityCanvas(config);
    checkCancellation();

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (exportState.cancelled) {
            reject(new Error("Export cancelled"));
            return;
          }
          if (!blob) reject(new Error("Failed to create blob"));
          else resolve(blob);
        },
        "image/png",
        1.0
      );
    });

    checkCancellation();
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);

    return true;
  } catch (error) {
    if (error.message === "Export cancelled") {
      throw new Error("Export cancelled");
    }
    throw new Error(`Copy failed: ${error.message}`);
  }
}

/**
 * Batch export
 */
export async function batchExport(config, formats, fileName, onProgress) {
  resetExportState();
  const total = formats.length;
  const results = { success: [], failed: [] };

  for (let i = 0; i < total; i++) {
    if (exportState.cancelled) throw new Error("Export cancelled");

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
