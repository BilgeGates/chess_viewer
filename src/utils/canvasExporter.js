import { parseFEN } from "./fenParser";
import { createUltraQualityCanvas } from "./imageOptimizer";

export const createExportCanvas = (config) => {
  const {
    boardSize,
    showBorder,
    showCoords,
    lightSquare,
    darkSquare,
    flipped,
    fen,
    pieceImages,
  } = config;

  if (!pieceImages || Object.keys(pieceImages).length === 0) {
    return null;
  }

  const board = parseFEN(fen);

  return createUltraQualityCanvas({
    boardSize,
    showBorder,
    lightSquare,
    darkSquare,
    flipped,
    board,
    pieceImages,
    showCoords,
  });
};

export const downloadPNG = (canvas, fileName) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Blob yaradılmadı"));
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

export const downloadJPEG = (canvas, fileName) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Blob yaradılmadı"));
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

export const copyToClipboard = async (canvas) => {
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png", 1.0)
  );
  if (!blob) throw new Error("Blob yaradılmadı");
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
};

export const getExportInfo = (boardSize, showBorder, showCoords) => {
  const baseBorderSize = boardSize / 25;
  const borderSize =
    showBorder || showCoords ? Math.max(12, Math.min(20, baseBorderSize)) : 0;
  const displaySize = boardSize + borderSize * 2;
  const actualPixels = displaySize * 4;

  return {
    display: `${displaySize}×${displaySize}px`,
    pixels: `${actualPixels}×${actualPixels} pixels`,
  };
};
