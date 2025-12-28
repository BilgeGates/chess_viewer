/**
 * Calculate optimal font size and weight based on square size
 * Ensures coordinates are crisp and readable at any board size
 */
export const getCoordinateFontSize = (squareSize) => {
  if (squareSize < 30) return { size: 10, weight: 700 };
  if (squareSize < 40) return { size: 11, weight: 700 };
  if (squareSize < 50) return { size: 13, weight: 700 };
  if (squareSize < 60) return { size: 15, weight: 700 };
  if (squareSize < 75) return { size: 17, weight: 700 };
  return { size: 20, weight: 700 };
};

/**
 * Draw coordinate labels with professional styling
 * Optimized for maximum clarity in print and digital formats
 */
export const drawCoordinates = (
  ctx,
  squareSize,
  borderSize,
  flipped,
  boardSize
) => {
  const { size: fontSize, weight: fontWeight } =
    getCoordinateFontSize(squareSize);

  ctx.save();

  // Professional font stack for maximum rendering quality
  ctx.font = `${fontWeight} ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // High-contrast color for professional appearance
  ctx.fillStyle = "#e2e8f0";

  // Subtle shadow for depth and readability on any background
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 0.5;
  ctx.shadowOffsetY = 0.5;

  // Rank numbers (1-8) - left side
  for (let i = 0; i < 8; i++) {
    const rank = flipped ? i + 1 : 8 - i;
    const yPos = borderSize + i * squareSize + squareSize / 2;
    ctx.fillText(rank.toString(), borderSize * 0.5, yPos);
  }

  // File letters (a-h) - bottom side
  for (let i = 0; i < 8; i++) {
    const file = String.fromCharCode(97 + (flipped ? 7 - i : i));
    const xPos = borderSize + i * squareSize + squareSize / 2;
    const yPos = borderSize + 8 * squareSize + borderSize * 0.5;
    ctx.fillText(file, xPos, yPos);
  }

  ctx.restore();
};
