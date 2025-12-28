import { createUltraQualityCanvas } from "./imageOptimizer";

export const createExportCanvas = (config) => {
  return createUltraQualityCanvas(config);
};

export const downloadPNG = (canvas, fileName) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("PNG blob creation failed"));
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.png`;
        a.click();
        URL.revokeObjectURL(url);
        resolve();
      },
      "image/png",
      1.0
    );
  });

export const downloadJPEG = (canvas, fileName) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("JPEG blob creation failed"));
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
        resolve();
      },
      "image/jpeg",
      1.0
    );
  });

export const copyToClipboard = async (canvas) => {
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png", 1.0)
  );
  if (!blob) throw new Error("Clipboard blob creation failed");
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
};
