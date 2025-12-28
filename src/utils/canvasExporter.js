import { parseFEN } from "./fenParser";
import { createUltraQualityCanvas } from "./imageOptimizer";

/**
 * Create export canvas from configuration
 */
export const createExportCanvas = (config) => {
  const { fen, pieceImages } = config;

  if (!pieceImages || Object.keys(pieceImages).length === 0) {
    return null;
  }

  const board = parseFEN(fen);

  return createUltraQualityCanvas({
    ...config,
    board,
    pieceImages,
  });
};

/**
 * Download canvas as PNG
 */
export const downloadPNG = (canvas, fileName) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Blob creation failed"));
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${fileName}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        resolve();
      },
      "image/png",
      1.0
    );
  });
};

/**
 * Download canvas as JPEG
 */
export const downloadJPEG = (canvas, fileName) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Blob creation failed"));
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${fileName}.jpg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        resolve();
      },
      "image/jpeg",
      0.98
    );
  });
};

/**
 * Copy canvas image to clipboard
 */
export const copyToClipboard = async (canvas) => {
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png", 1.0)
  );
  if (!blob) throw new Error("Blob creation failed");
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
};

/**
 * Get export information
 */
export const getExportInfo = (boardSize, showBorder, showCoords) => {
  const baseBorderSize = boardSize / 28;
  const borderSize =
    showBorder || showCoords ? Math.max(12, Math.min(16, baseBorderSize)) : 0;
  const displaySize = boardSize + borderSize * 2;
  const actualPixels = displaySize * 8;

  return {
    display: `${displaySize}×${displaySize}px`,
    pixels: `${actualPixels}×${actualPixels} pixels`,
  };
};
