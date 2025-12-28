/**
 * Creates ultra high-quality chessboard canvas for export
 * FIXED 16x QUALITY - Reliable and powerful
 * Dark coordinates for print on white paper
 *
 * @param {Object} config - Export configuration
 * @returns {HTMLCanvasElement} Final high-quality canvas
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
  } = config;

  // Parse FEN
  const board = parseFEN(fen);

  // Validate
  if (!board || !pieceImages || Object.keys(pieceImages).length === 0) {
    throw new Error("Invalid board or piece images");
  }

  // Border calculation
  const borderSize = showCoords
    ? Math.max(16, Math.min(22, boardSize / 25))
    : 0;
  const displaySize = boardSize + borderSize * 2;

  // FIXED 16x QUALITY - Reliable supreme quality
  const QUALITY = 16;

  // Create high-resolution canvas
  const canvas = document.createElement("canvas");
  canvas.width = displaySize * QUALITY;
  canvas.height = displaySize * QUALITY;

  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: false,
    willReadFrequently: false,
  });

  ctx.scale(QUALITY, QUALITY);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const squareSize = boardSize / 8;

  // Clear canvas
  ctx.clearRect(0, 0, displaySize, displaySize);

  // Draw squares
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

  // Draw pieces
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row]?.[col];
      const img = pieceImages[piece];

      if (img?.complete && img.naturalWidth > 0) {
        const drawRow = flipped ? 7 - row : row;
        const drawCol = flipped ? 7 - col : col;
        const cx = drawCol * squareSize + borderSize + squareSize / 2;
        const cy = drawRow * squareSize + borderSize + squareSize / 2;

        ctx.drawImage(
          img,
          cx - squareSize * 0.45,
          cy - squareSize * 0.45,
          squareSize * 0.9,
          squareSize * 0.9
        );
      }
    }
  }

  // Draw coordinates - DARK for print visibility
  if (showCoords) {
    const fontSize = boardSize * 0.03;
    const fontSizePx = Math.round(Math.max(8, Math.min(17, fontSize)));

    ctx.save();
    ctx.font = `700 ${fontSizePx}px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // DARK coordinates for white paper/print visibility
    ctx.fillStyle = "#fffff"; // Dark slate - visible on white

    // Strong shadow for depth
    ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
    ctx.shadowBlur = 1;
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

  // Return full resolution canvas
  return canvas;
};

// parseFEN helper
const parseFEN = (fenString) => {
  try {
    const position = fenString.trim().split(/\s+/)[0];
    const rows = position.split("/");
    const board = [];

    for (let row of rows) {
      const boardRow = [];
      for (let char of row) {
        if (isNaN(char)) {
          boardRow.push(char);
        } else {
          boardRow.push(...Array(parseInt(char)).fill(""));
        }
      }
      board.push(boardRow);
    }
    return board;
  } catch {
    return Array(8)
      .fill(null)
      .map(() => Array(8).fill(""));
  }
};
