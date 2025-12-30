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

  const offset = 1.9;

  // Ranks (1–8)
  for (let row = 0; row < 8; row++) {
    const rank = flipped ? row + 1 : 8 - row;
    const yPos = borderSize + row * squareSize + squareSize / 2;
    // borderSize-ın mərkəzi - offset
    ctx.fillText(rank.toString(), borderSize / 2 - offset, yPos);
  }

  // Files (a-h)
  for (let col = 0; col < 8; col++) {
    const file = String.fromCharCode(97 + (flipped ? 7 - col : col));
    const xPos = borderSize + col * squareSize + squareSize / 2;
    const yPos = borderSize + 8 * squareSize + borderSize / 2 + offset;
    ctx.fillText(file, xPos, yPos);
  }

  ctx.restore();
};
