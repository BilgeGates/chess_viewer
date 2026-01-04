import {
  createUltraQualityCanvas,
  calculateExportSize,
  getMaxCanvasSize,
} from "./";

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
  const pngSize = (pixels * 3) / 1024 / 1024;
  const jpegSize = pngSize * 0.1;

  return {
    png: `${pngSize.toFixed(1)} MB`,
    jpeg: `${jpegSize.toFixed(1)} MB`,
  };
}

/**
 * Validate config before export
 */
function validateExportConfig(config) {
  console.log("\n🔍 VALIDATING EXPORT CONFIG...");

  const errors = [];

  if (!config) {
    errors.push("Config is null or undefined");
  } else {
    if (!config.boardSize || config.boardSize < 100) {
      errors.push(`Invalid boardSize: ${config.boardSize}`);
    }

    if (!config.fen) {
      errors.push("FEN is missing");
    }

    if (!config.lightSquare || !config.darkSquare) {
      errors.push("Square colors are missing");
    }

    if (!config.pieceImages) {
      errors.push("pieceImages is null or undefined");
    } else if (typeof config.pieceImages !== "object") {
      errors.push(`pieceImages is not an object: ${typeof config.pieceImages}`);
    } else if (Object.keys(config.pieceImages).length === 0) {
      errors.push("pieceImages is empty");
    }
  }

  if (errors.length > 0) {
    console.error("❌ CONFIG VALIDATION FAILED:");
    errors.forEach((err) => console.error("   -", err));
    throw new Error("Invalid export config: " + errors.join(", "));
  }

  console.log("✅ Config validation passed");
  console.log("   boardSize:", config.boardSize);
  console.log("   fen:", config.fen);
  console.log("   pieceImages count:", Object.keys(config.pieceImages).length);
}

/**
 * Download PNG with comprehensive error handling
 */
export async function downloadPNG(config, fileName, onProgress) {
  resetExportState();

  try {
    console.log("\n🚀 ========== PNG EXPORT START ==========");
    console.log("📦 Input config:", {
      fileName,
      boardSize: config?.boardSize,
      exportQuality: config?.exportQuality,
      pieceImagesExists: !!config?.pieceImages,
      pieceImagesCount: Object.keys(config?.pieceImages || {}).length,
    });

    // Validate config
    validateExportConfig(config);

    onProgress?.(5);
    await simulateProgress(onProgress, 5, 15, 300);

    // Create canvas
    await waitWhilePaused();
    checkCancellation();

    console.log("\n🎨 Creating ultra quality canvas...");
    const canvas = await createUltraQualityCanvas(config);

    if (!canvas) {
      throw new Error("Canvas creation returned null");
    }

    console.log("✅ Canvas created successfully:");
    console.log("   Size:", canvas.width, "x", canvas.height);

    onProgress?.(30);
    await simulateProgress(onProgress, 30, 50, 400);

    // Create blob
    await waitWhilePaused();
    checkCancellation();

    console.log("\n💾 Creating PNG blob...");
    const blob = await new Promise((resolve, reject) => {
      try {
        canvas.toBlob(
          (blob) => {
            if (exportState.cancelled) {
              reject(new Error("Export cancelled"));
              return;
            }
            if (!blob) {
              reject(
                new Error(
                  "Canvas.toBlob returned null - browser may not support this feature"
                )
              );
              return;
            }
            console.log("✅ Blob created:");
            console.log("   Size:", (blob.size / 1024 / 1024).toFixed(2), "MB");
            console.log("   Type:", blob.type);
            resolve(blob);
          },
          "image/png",
          1.0
        );
      } catch (err) {
        console.error("❌ toBlob error:", err);
        reject(err);
      }
    });

    await simulateProgress(onProgress, 50, 80, 300);
    await waitWhilePaused();
    checkCancellation();

    // Download
    console.log("\n⬇️ Initiating download...");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();

    onProgress?.(100);
    console.log("✅ PNG download initiated successfully!");
    console.log("✅ ========== PNG EXPORT COMPLETE ==========\n");

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log("🧹 Cleanup complete");
    }, 100);
  } catch (error) {
    console.error("\n❌ ========== PNG EXPORT FAILED ==========");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("==========================================\n");

    if (error.message === "Export cancelled") {
      throw new Error("Export cancelled");
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
    console.log("\n🚀 ========== JPEG EXPORT START ==========");

    // Validate config
    validateExportConfig(config);

    // Calculate export size for cropping calculations
    const exportSize = calculateExportSize(
      config.boardSize,
      config.showCoords,
      config.exportQuality || 16
    );

    onProgress?.(5);
    await simulateProgress(onProgress, 5, 15, 300);

    // Create canvas
    await waitWhilePaused();
    checkCancellation();

    console.log("\n🎨 Creating ultra quality canvas...");
    const canvas = await createUltraQualityCanvas(config);

    if (!canvas) {
      throw new Error("Canvas creation returned null");
    }

    console.log("✅ Canvas created:", canvas.width, "x", canvas.height);

    onProgress?.(25);
    await simulateProgress(onProgress, 25, 35, 300);

    // Add white background for JPEG - only left and bottom borders
    await waitWhilePaused();
    checkCancellation();

    console.log("\n🎨 Converting to JPEG format...");

    // Calculate border size
    const borderSize = config.showCoords
      ? Math.max(20, Math.min(30, config.boardSize / 20))
      : 0;

    // New canvas dimensions (remove top and right borders)
    const newWidth = canvas.width - borderSize * exportSize.actualQuality;
    const newHeight = canvas.height - borderSize * exportSize.actualQuality;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = newWidth;
    tempCanvas.height = newHeight;
    const ctx = tempCanvas.getContext("2d", {
      alpha: false, // JPEG doesn't support transparency
      desynchronized: false,
      willReadFrequently: false,
    });

    if (!ctx) {
      throw new Error("Failed to get 2D context for JPEG conversion");
    }

    // Fill white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, newWidth, newHeight);

    // Copy canvas but crop top and right borders
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Source: skip top border (0, borderSize), crop width and height
    // Destination: draw at (0, 0)
    ctx.drawImage(
      canvas,
      0, // sx: start from left edge
      borderSize * exportSize.actualQuality, // sy: skip top border
      newWidth, // sWidth: crop right border
      newHeight, // sHeight: crop top border
      0, // dx
      0, // dy
      newWidth, // dWidth
      newHeight // dHeight
    );

    console.log("✅ JPEG canvas ready (cropped top & right borders)");

    onProgress?.(45);
    await simulateProgress(onProgress, 45, 60, 400);

    // Create JPEG blob
    await waitWhilePaused();
    checkCancellation();

    console.log("\n💾 Creating JPEG blob (quality: 1.0)...");
    const blob = await new Promise((resolve, reject) => {
      try {
        tempCanvas.toBlob(
          (blob) => {
            if (exportState.cancelled) {
              reject(new Error("Export cancelled"));
              return;
            }
            if (!blob) {
              reject(
                new Error(
                  "Canvas.toBlob returned null - browser may not support JPEG export"
                )
              );
              return;
            }
            console.log("✅ JPEG blob created:");
            console.log("   Size:", (blob.size / 1024 / 1024).toFixed(2), "MB");
            console.log("   Type:", blob.type);
            resolve(blob);
          },
          "image/jpeg",
          1.0
        );
      } catch (err) {
        console.error("❌ toBlob error:", err);
        reject(err);
      }
    });

    await simulateProgress(onProgress, 60, 85, 300);
    await waitWhilePaused();
    checkCancellation();

    // Download
    console.log("\n⬇️ Initiating download...");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.jpg`;
    document.body.appendChild(link);
    link.click();

    onProgress?.(100);
    console.log("✅ JPEG download initiated successfully!");
    console.log("✅ ========== JPEG EXPORT COMPLETE ==========\n");

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log("🧹 Cleanup complete");
    }, 100);
  } catch (error) {
    console.error("\n❌ ========== JPEG EXPORT FAILED ==========");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("===========================================\n");

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
    console.log("\n🚀 ========== CLIPBOARD COPY START ==========");

    // Validate config
    validateExportConfig(config);

    console.log("\n🎨 Creating canvas...");
    const canvas = await createUltraQualityCanvas(config);

    if (!canvas) {
      throw new Error("Canvas creation returned null");
    }

    checkCancellation();

    console.log("\n💾 Creating blob for clipboard...");
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (exportState.cancelled) {
            reject(new Error("Export cancelled"));
            return;
          }
          if (!blob) {
            reject(new Error("Failed to create blob for clipboard"));
          } else {
            resolve(blob);
          }
        },
        "image/png",
        1.0
      );
    });

    checkCancellation();

    console.log("\n📋 Writing to clipboard...");
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);

    console.log("✅ Copied to clipboard successfully!");
    console.log("✅ ========== CLIPBOARD COPY COMPLETE ==========\n");
    return true;
  } catch (error) {
    console.error("\n❌ ========== CLIPBOARD COPY FAILED ==========");
    console.error("Error:", error.message);
    console.error("=============================================\n");

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

  console.log("\n🚀 ========== BATCH EXPORT START ==========");
  console.log("Formats:", formats);

  // Validate config once for all exports
  validateExportConfig(config);

  const total = formats.length;
  const results = { success: [], failed: [] };

  for (let i = 0; i < total; i++) {
    if (exportState.cancelled) {
      console.log("❌ Batch export cancelled");
      throw new Error("Export cancelled");
    }

    const format = formats[i];
    const baseProgress = (i / total) * 100;

    console.log(
      `\n📦 Exporting format ${i + 1}/${total}: ${format.toUpperCase()}`
    );

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

      console.log(`✅ ${format.toUpperCase()} export successful`);
    } catch (error) {
      console.error(`❌ ${format.toUpperCase()} export failed:`, error.message);

      if (error.message === "Export cancelled") {
        throw error;
      }
      results.failed.push({ format, error: error.message });
    }
  }

  onProgress?.(100, null);

  console.log("\n📊 BATCH EXPORT SUMMARY:");
  console.log("   Success:", results.success.join(", "));
  if (results.failed.length > 0) {
    console.log("   Failed:", results.failed.map((f) => f.format).join(", "));
  }
  console.log("✅ ========== BATCH EXPORT COMPLETE ==========\n");

  if (results.failed.length > 0) {
    throw new Error(
      `Some exports failed: ${results.failed.map((f) => f.format).join(", ")}`
    );
  }

  return results;
}
