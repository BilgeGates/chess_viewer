/**
 * Calculate optimal font size based on board size
 */
export const getCoordinateFontSize = (boardSize) => {
  const calculatedSize = boardSize * 0.032;
  const size = Math.round(Math.max(10, Math.min(20, calculatedSize)));

  return {
    size,
    weight: 700,
  };
};

/**
 * Draw coordinate labels on canvas
 * @param {boolean} forExport - True for export (black), false for display (white)
 */
export const drawCoordinates = (
  ctx,
  squareSize,
  borderSize,
  flipped,
  boardSize,
  forExport = false
) => {
  const { size: fontSize, weight: fontWeight } =
    getCoordinateFontSize(boardSize);

  ctx.save();
  ctx.font = `${fontWeight} ${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = forExport ? "#1a1a1a" : "#ffffff";

  // Shadow for readability
  if (forExport) {
    ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
    ctx.shadowBlur = 1.5;
  } else {
    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 2;
  }

  ctx.shadowOffsetX = 0.5;
  ctx.shadowOffsetY = 0.5;

  // Ranks (1–8)
  for (let i = 0; i < 8; i++) {
    const rank = flipped ? 8 - i : i + 1;
    const yPos = borderSize + i * squareSize + squareSize / 2;
    ctx.fillText(rank.toString(), borderSize * 0.5, yPos);
  }

  // File letters (a-h)
  for (let i = 0; i < 8; i++) {
    const file = String.fromCharCode(97 + (flipped ? 7 - i : i));
    const xPos = borderSize + i * squareSize + squareSize / 2;
    const yPos = borderSize + 8 * squareSize + borderSize * 0.5;
    ctx.fillText(file, xPos, yPos);
  }

  ctx.restore();
};
