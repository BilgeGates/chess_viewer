import { parseFEN } from "./fenParser";
import { createUltraQualityCanvas } from "./imageOptimizer";
import { CANVAS_CONFIG } from "../constants/chessConstants";

export const createExportCanvas = (config) => {
  const {
    boardSize,
    showBorder,
    showCoords,
    lightSquare,
    darkSquare,
    flipped,
    fen,
    exportQuality,
    pieceImages,
  } = config;

  if (!pieceImages || Object.keys(pieceImages).length === 0) {
    return null;
  }

  const board = parseFEN(fen);
  const borderSize = showBorder ? CANVAS_CONFIG.BORDER_SIZE : 0;

  return createUltraQualityCanvas({
    boardSize,
    showBorder,
    lightSquare,
    darkSquare,
    flipped,
    board,
    pieceImages,
    showCoords,
    borderSize,
    exportQuality,
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
      0.98 // Higher quality
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

export const getFileSize = (canvas) => {
  const bytes = canvas.width * canvas.height * 4; // RGBA
  const mb = (bytes / (1024 * 1024)).toFixed(2);
  return `${mb} MB`;
};
