import { createUltraQualityCanvas } from "./imageOptimizer";
import { generateChessSVG } from "./generateChessSVG";

/**
 * Download PNG with proper error handling
 */
export const downloadPNG = async (config, fileName) => {
  try {
    const canvas = createUltraQualityCanvas(config);

    return new Promise((resolve, reject) => {
      // Use higher quality settings
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error("Failed to create PNG blob"));
          }

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${fileName}.png`;

          // Trigger download
          document.body.appendChild(a);
          a.click();

          // Cleanup with delay to ensure download starts
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            resolve();
          }, 100);
        },
        "image/png",
        1.0
      );
    });
  } catch (error) {
    console.error("PNG Export Error:", error);
    throw new Error(`PNG export failed: ${error.message}`);
  }
};

/**
 * Download JPEG with white background
 */
export const downloadJPEG = async (config, fileName) => {
  try {
    const canvas = createUltraQualityCanvas(config);

    // Create temporary canvas with white background
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    const ctx = tempCanvas.getContext("2d", {
      alpha: false,
      desynchronized: false,
    });

    // Fill white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw chess board on top
    ctx.drawImage(canvas, 0, 0);

    return new Promise((resolve, reject) => {
      tempCanvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error("Failed to create JPEG blob"));
          }

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${fileName}.jpg`;

          document.body.appendChild(a);
          a.click();

          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            resolve();
          }, 100);
        },
        "image/jpeg",
        0.98
      );
    });
  } catch (error) {
    console.error("JPEG Export Error:", error);
    throw new Error(`JPEG export failed: ${error.message}`);
  }
};

/**
 * Download SVG - Vector format
 */
export const downloadSVG = async (config, fileName) => {
  try {
    const svg = generateChessSVG(config);

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.svg`;

    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("SVG Export Error:", error);
    throw new Error(`SVG export failed: ${error.message}`);
  }
};

/**
 * Copy image to clipboard
 */
export const copyToClipboard = async (config) => {
  try {
    const canvas = createUltraQualityCanvas(config);

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) reject(new Error("Failed to create blob"));
          else resolve(blob);
        },
        "image/png",
        1.0
      );
    });

    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);

    return true;
  } catch (error) {
    console.error("Clipboard Error:", error);
    throw new Error(`Copy failed: ${error.message}`);
  }
};

/**
 * Batch export multiple formats
 */
export const batchExport = async (config, formats, fileName, onProgress) => {
  const total = formats.length;
  const results = { success: [], failed: [] };

  for (let i = 0; i < total; i++) {
    const format = formats[i];

    try {
      onProgress?.((i / total) * 100, format);

      if (format === "png") {
        await downloadPNG(config, fileName);
        results.success.push("PNG");
      } else if (format === "jpeg") {
        await downloadJPEG(config, fileName);
        results.success.push("JPEG");
      } else if (format === "svg") {
        await downloadSVG(config, fileName);
        results.success.push("SVG");
      }

      // Delay between downloads to prevent browser blocking
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`${format} export failed:`, error);
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
};
