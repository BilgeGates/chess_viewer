/**
 * Calculate optimal font size based on board size
 * Pure adaptive scaling without border dependency
 */
export const getCoordinateFontSize = (boardSize) => {
  // Professional formula: 3% of total board size
  // Ensures perfect readability at any dimension
  const calculatedSize = boardSize * 0.03;

  // Refined boundaries for professional appearance
  const size = Math.round(Math.max(8, Math.min(17, calculatedSize)));

  return {
    size,
    weight: 700, // Bold for maximum clarity
  };
};

/**
 * Draw coordinate labels outside the board
 * Professional placement with optimal spacing
 */
export const drawCoordinates = (
  ctx,
  squareSize,
  borderSize,
  flipped,
  boardSize
) => {
  const { size: fontSize, weight: fontWeight } =
    getCoordinateFontSize(boardSize);

  ctx.save();

  // Professional font stack for maximum rendering quality
  ctx.font = `${fontWeight} ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // High-contrast color for professional appearance
  ctx.fillStyle = "#fffff";

  // Strong shadow for maximum readability
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 0.5;
  ctx.shadowOffsetY = 0.5;

  // Rank numbers (1-8) - left side, centered in border space
  for (let i = 0; i < 8; i++) {
    const rank = flipped ? i + 1 : 8 - i;
    const yPos = borderSize + i * squareSize + squareSize / 2;
    ctx.fillText(rank.toString(), borderSize * 0.5, yPos);
  }

  // File letters (a-h) - bottom side, centered in border space
  for (let i = 0; i < 8; i++) {
    const file = String.fromCharCode(97 + (flipped ? 7 - i : i));
    const xPos = borderSize + i * squareSize + squareSize / 2;
    const yPos = borderSize + 8 * squareSize + borderSize * 0.5;
    ctx.fillText(file, xPos, yPos);
  }

  ctx.restore();
};
