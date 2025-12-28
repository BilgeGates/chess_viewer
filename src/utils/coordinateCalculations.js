/**
 * Calculate optimal font size, padding, and line width for coordinates
 * based on square size
 */
export const calculateCoordinateMetrics = (squareSize) => {
  let fontSize;

  // Ultra-precise breakpoints for perfect scaling
  if (squareSize < 28) {
    fontSize = 6;
  } else if (squareSize < 33) {
    fontSize = 7;
  } else if (squareSize < 38) {
    fontSize = 8;
  } else if (squareSize < 45) {
    fontSize = 9;
  } else if (squareSize < 55) {
    fontSize = 10;
  } else if (squareSize < 68) {
    fontSize = 11;
  } else if (squareSize < 82) {
    fontSize = 12;
  } else {
    fontSize = 13;
  }

  // Minimal padding to avoid piece interference
  const padding = Math.max(2.5, fontSize * 0.28);
  const lineWidth = Math.max(0.5, fontSize * 0.08);

  return { fontSize, padding, lineWidth };
};

/**
 * Draw coordinates on canvas
 */
export const drawCoordinates = (ctx, squareSize, borderSize, flipped) => {
  const { fontSize, padding, lineWidth } =
    calculateCoordinateMetrics(squareSize);

  ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;
  ctx.fillStyle = "rgba(20, 20, 20, 0.88)";

  // Draw rank numbers (1-8)
  for (let row = 0; row < 8; row++) {
    const rank = flipped ? row + 1 : 8 - row;
    const drawRow = flipped ? 7 - row : row;

    const xPos = borderSize + padding;
    const yPos = drawRow * squareSize + borderSize + padding;

    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.strokeText(rank.toString(), xPos, yPos);
    ctx.fillText(rank.toString(), xPos, yPos);
  }

  // Draw file letters (a-h)
  for (let col = 0; col < 8; col++) {
    const file = String.fromCharCode(97 + (flipped ? 7 - col : col));
    const drawCol = flipped ? 7 - col : col;

    const xPos = (drawCol + 1) * squareSize + borderSize - padding;
    const lastRowIndex = flipped ? 0 : 7;
    const yPos = (lastRowIndex + 1) * squareSize + borderSize - padding;

    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.strokeText(file, xPos, yPos);
    ctx.fillText(file, xPos, yPos);
  }
};
