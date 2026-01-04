import { drawCoordinates, parseFEN } from "./";

/**
 * Get maximum canvas size supported by browser
 */
export const getMaxCanvasSize = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  let maxSize = 16384;

  try {
    canvas.width = maxSize;
    canvas.height = maxSize;
    if (!ctx || canvas.width !== maxSize) {
      maxSize = 8192;
    }
  } catch (e) {
    maxSize = 8192;
  }

  return maxSize;
};

/**
 * Calculate optimal quality for export
 */
export const calculateOptimalQuality = (
  boardSize,
  showCoords,
  requestedQuality = 16
) => {
  const maxCanvasSize = getMaxCanvasSize();
  const borderSize = showCoords
    ? Math.max(20, Math.min(30, boardSize / 20))
    : 0;
  const displaySize = boardSize + borderSize * 2;

  const projectedSize = displaySize * requestedQuality;

  if (projectedSize <= maxCanvasSize) {
    return requestedQuality;
  }

  const maxQuality = Math.floor(maxCanvasSize / displaySize);
  return Math.max(1, maxQuality);
};

/**
 * Calculate export size
 */
export const calculateExportSize = (boardSize, showCoords, exportQuality) => {
  const optimalQuality = calculateOptimalQuality(
    boardSize,
    showCoords,
    exportQuality
  );
  const borderSize = showCoords
    ? Math.max(20, Math.min(30, boardSize / 20))
    : 0;
  const displaySize = boardSize + borderSize * 2;

  return {
    width: displaySize * optimalQuality,
    height: displaySize * optimalQuality,
    actualQuality: optimalQuality,
    displaySize: displaySize,
  };
};

/**
 * Convert FEN piece notation to pieceImages key format
 * FEN: r,n,b,q,k,p (black), R,N,B,Q,K,P (white)
 * pieceImages: bR,bN,bB,bQ,bK,bP (black), wR,wN,wB,wQ,wK,wP (white)
 */
const getPieceKey = (fenPiece) => {
  if (!fenPiece) return null;

  const isWhite = fenPiece === fenPiece.toUpperCase();
  const pieceType = fenPiece.toUpperCase();

  return (isWhite ? "w" : "b") + pieceType;
};

/**
 * Creates ultra high-quality chessboard canvas for export
 */
export const createUltraQualityCanvas = async (config) => {
  const {
    boardSize,
    showCoords,
    lightSquare,
    darkSquare,
    flipped,
    fen,
    pieceImages,
    exportQuality = 16,
  } = config;

  console.log("createUltraQualityCanvas started");
  console.log("Config:", {
    boardSize,
    showCoords,
    exportQuality,
    flipped,
    fen,
  });

  // Parse FEN
  const board = parseFEN(fen);
  console.log("Board parsed");

  // Validate
  if (!board || !pieceImages || Object.keys(pieceImages).length === 0) {
    console.error("Validation failed:", {
      board: !!board,
      pieceImages: !!pieceImages,
      count: Object.keys(pieceImages || {}).length,
    });
    throw new Error("Invalid board or piece images");
  }

  console.log("Checking piece images before render...");
  console.log("pieceImages keys:", Object.keys(pieceImages));
  console.log("pieceImages count:", Object.keys(pieceImages).length);

  // Wait for all images to load
  const imageLoadPromises = Object.entries(pieceImages).map(([key, img]) => {
    console.log(`Checking ${key}:`, {
      exists: !!img,
      complete: img?.complete,
      naturalWidth: img?.naturalWidth,
      src: img?.src?.substring(0, 100),
    });

    if (!img) {
      console.warn(`Missing image for ${key}`);
      return Promise.resolve();
    }

    if (img.complete && img.naturalWidth > 0) {
      console.log(`${key} already loaded`);
      return Promise.resolve();
    }

    console.log(`Waiting for ${key} to load...`);
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.error(`${key} load timeout after 10s`);
        resolve();
      }, 10000);

      const cleanup = () => {
        clearTimeout(timeout);
        img.onload = null;
        img.onerror = null;
      };

      img.onload = () => {
        cleanup();
        console.log(`${key} loaded: ${img.naturalWidth}x${img.naturalHeight}`);
        resolve();
      };

      img.onerror = (err) => {
        cleanup();
        console.error(`${key} load error:`, err);
        resolve();
      };

      if (!img.src || img.src === "") {
        cleanup();
        console.warn(`${key} has no src`);
        resolve();
      }
    });
  });

  console.log("Waiting for all images...");
  try {
    await Promise.all(imageLoadPromises);
    console.log("All image checks complete");
  } catch (err) {
    console.error("Image loading error:", err);
  }

  // Border calculation
  const borderSize = showCoords
    ? Math.max(20, Math.min(30, boardSize / 20))
    : 0;
  const displaySize = boardSize + borderSize * 2;

  const optimalQuality = calculateOptimalQuality(
    boardSize,
    showCoords,
    exportQuality
  );

  if (optimalQuality < exportQuality) {
    console.warn(
      `Quality reduced from ${exportQuality}x to ${optimalQuality}x due to browser canvas size limit`
    );
  }

  console.log(
    "Creating canvas:",
    displaySize * optimalQuality,
    "x",
    displaySize * optimalQuality
  );

  // Create high-resolution canvas
  const canvas = document.createElement("canvas");
  canvas.width = displaySize * optimalQuality;
  canvas.height = displaySize * optimalQuality;

  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: false,
    willReadFrequently: false,
  });

  ctx.scale(optimalQuality, optimalQuality);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const squareSize = boardSize / 8;

  // Clear canvas - fully transparent background
  ctx.clearRect(0, 0, displaySize, displaySize);
  console.log("Canvas cleared with transparent background");

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(borderSize - 1, borderSize - 1, boardSize + 2, boardSize + 2);

  // Draw squares
  console.log("Drawing squares...");
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? lightSquare : darkSquare;
      const drawRow = flipped ? 7 - row : row;
      const drawCol = flipped ? 7 - col : col;

      ctx.fillRect(
        drawCol * squareSize + borderSize,
        drawRow * squareSize + borderSize,
        squareSize,
        squareSize
      );
    }
  }
  console.log("Squares drawn");

  // Draw pieces
  console.log("Drawing pieces...");
  console.log("Available pieceImages keys:", Object.keys(pieceImages));
  console.log("Board first row sample:", board[0]);

  let drawnCount = 0;
  let skippedCount = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const fenPiece = board[row]?.[col];

      if (!fenPiece) continue;

      // Convert FEN notation to pieceImages key format
      const pieceKey = getPieceKey(fenPiece);
      const img = pieceImages[pieceKey];

      if (!img) {
        console.warn(
          `No image for FEN piece '${fenPiece}' (key: ${pieceKey}) at [${row},${col}]`
        );
        console.warn(`Available keys:`, Object.keys(pieceImages).join(", "));
        skippedCount++;
        continue;
      }

      if (!img.complete || img.naturalWidth === 0) {
        console.warn(
          `Image not ready for ${pieceKey}: complete=${img.complete}, width=${img.naturalWidth}`
        );
        skippedCount++;
        continue;
      }

      const drawRow = flipped ? 7 - row : row;
      const drawCol = flipped ? 7 - col : col;
      const cx = drawCol * squareSize + borderSize + squareSize / 2;
      const cy = drawRow * squareSize + borderSize + squareSize / 2;

      const pieceScale = 1.0;

      try {
        ctx.drawImage(
          img,
          cx - squareSize * (pieceScale / 2),
          cy - squareSize * (pieceScale / 2),
          squareSize * pieceScale,
          squareSize * pieceScale
        );
        drawnCount++;
      } catch (err) {
        console.error(`Failed to draw ${pieceKey}:`, err);
        skippedCount++;
      }
    }
  }

  console.log(`Pieces drawn: ${drawnCount}, skipped: ${skippedCount}`);

  // Draw coordinates - black color for export
  if (showCoords) {
    console.log("Drawing coordinates...");
    drawCoordinates(
      ctx,
      squareSize,
      borderSize,
      flipped,
      boardSize,
      true,
      false
    );
    console.log("Coordinates drawn");
  }

  console.log("Canvas creation complete");
  return canvas;
};

/**
 * Optimize canvas for specific output format
 */
export const optimizeCanvasForFormat = (canvas, format) => {
  const optimized = document.createElement("canvas");
  optimized.width = canvas.width;
  optimized.height = canvas.height;
  const ctx = optimized.getContext("2d", { alpha: format === "png" });

  if (format === "jpeg" || format === "pdf") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, optimized.width, optimized.height);
  }

  ctx.drawImage(canvas, 0, 0);
  return optimized;
};
