import { parseFEN } from "./fenParser";
/**
 * Create ultra high-quality canvas with MEMORY OPTIMIZATION
 */
export const createUltraQualityCanvas = (config) => {
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

  // Validate inputs
  if (!pieceImages || Object.keys(pieceImages).length === 0) {
    throw new Error("Piece images not loaded");
  }

  const board = parseFEN(fen);

  if (!board || board.length !== 8) {
    throw new Error("Invalid FEN notation");
  }

  // Calculate dimensions
  const borderSize = showCoords
    ? Math.max(20, Math.min(30, boardSize / 20))
    : 0;
  const displaySize = boardSize + borderSize * 2;

  // SMART QUALITY SCALING - Prevent memory issues
  let actualQuality = exportQuality;
  const maxCanvasSize = 16384; // Browser limit
  const projectedSize = displaySize * exportQuality;

  if (projectedSize > maxCanvasSize) {
    actualQuality = Math.floor(maxCanvasSize / displaySize);
    console.warn(
      `Quality reduced to ${actualQuality}x to prevent memory issues`
    );
  }

  // Create canvas with optimized settings
  const canvas = document.createElement("canvas");
  const finalSize = displaySize * actualQuality;

  canvas.width = finalSize;
  canvas.height = finalSize;

  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: false,
    willReadFrequently: false,
  });

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Apply scaling
  ctx.scale(actualQuality, actualQuality);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const squareSize = boardSize / 8;

  // Clear canvas
  ctx.clearRect(0, 0, displaySize, displaySize);

  // Draw squares with perfect alignment
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

  // Draw pieces with error checking
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row]?.[col];
      if (!piece) continue;

      const img = pieceImages[piece];

      if (!img) {
        console.warn(`Missing image for piece: ${piece}`);
        continue;
      }

      if (!img.complete || img.naturalWidth === 0) {
        console.warn(`Image not loaded for piece: ${piece}`);
        continue;
      }

      const drawRow = flipped ? 7 - row : row;
      const drawCol = flipped ? 7 - col : col;
      const cx = drawCol * squareSize + borderSize + squareSize / 2;
      const cy = drawRow * squareSize + borderSize + squareSize / 2;

      const pieceScale = 0.9;
      const pieceSize = squareSize * pieceScale;

      try {
        ctx.drawImage(
          img,
          cx - pieceSize / 2,
          cy - pieceSize / 2,
          pieceSize,
          pieceSize
        );
      } catch (err) {
        console.error(`Failed to draw piece ${piece}:`, err);
      }
    }
  }

  // Draw coordinates
  if (showCoords) {
    const fontSize = Math.round(Math.max(10, Math.min(20, boardSize * 0.032)));

    ctx.save();
    ctx.font = `700 ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // EXPORT ÜÇÜN QARA RƏNG
    ctx.fillStyle = "#1a1a1a";

    // Shadow for readability on white paper
    ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
    ctx.shadowBlur = 1.5;
    ctx.shadowOffsetX = 0.5;
    ctx.shadowOffsetY = 0.5;

    // Ranks
    for (let i = 0; i < 8; i++) {
      const rank = flipped ? i + 1 : 8 - i;
      const yPos = borderSize + i * squareSize + squareSize / 2;
      ctx.fillText(rank.toString(), borderSize * 0.5, yPos);
    }

    // Files
    for (let i = 0; i < 8; i++) {
      const file = String.fromCharCode(97 + (flipped ? 7 - i : i));
      const xPos = borderSize + i * squareSize + squareSize / 2;
      const yPos = borderSize + 8 * squareSize + borderSize * 0.5;
      ctx.fillText(file, xPos, yPos);
    }

    ctx.restore();
  }

  return canvas;
};
