/**
 * Calculate coordinate parameters with pixel-perfect precision
 * @param {number} boardSize - Board size in pixels
 * @returns {object} - Coordinate display parameters
 */
export const getCoordinateParams = (boardSize) => {
  // Calculate border size as percentage of board size (5.8%)
  // Minimum 20px to ensure coordinates fit, maximum 72px
  // Use Math.round to ensure integer pixel values
  const borderSize = Math.round(Math.max(20, Math.min(72, boardSize * 0.058)));

  // Font size should be 75% of border with minimum padding
  // Use Math.round for crisp text rendering
  const fontSize = Math.round(Math.max(12, Math.min(40, borderSize * 0.75)));

  return {
    fontSize,
    borderSize,
    fontWeight: 600,
    // Center offset is exactly half the border
    offset: Math.round(borderSize / 2)
  };
};

const getCellCenter = (borderSize, squareSize, index) => {
  const start = Math.round(borderSize + index * squareSize);
  const end = Math.round(borderSize + (index + 1) * squareSize);
  return Math.round((start + end) / 2);
};

const getTextMetrics = (ctx, sample, fontSize) => {
  const metrics = ctx.measureText(sample);
  const ascent = Number.isFinite(metrics.actualBoundingBoxAscent)
    ? metrics.actualBoundingBoxAscent
    : fontSize * 0.8;
  const descent = Number.isFinite(metrics.actualBoundingBoxDescent)
    ? metrics.actualBoundingBoxDescent
    : fontSize * 0.2;
  const height = ascent + descent;

  return { ascent, descent, height };
};

const getBaselineFromCenter = (centerY, metrics) =>
  Math.round(centerY + (metrics.ascent - metrics.descent) / 2);

/**
 * Draw coordinates with pixel-perfect positioning
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} squareSize - Size of each square in pixels
 * @param {number} borderSize - Border size in pixels
 * @param {boolean} flipped - Whether board is flipped
 * @param {number} boardSize - Total board size in pixels
 * @param {boolean} forExport - True for export (black), false for display (white)
 * @param {boolean} displayWhite - True for white text, false for black
 * @param {number} boardStartY - Y position where board starts (default: borderSize for display, 0 for export)
 */
export const drawCoordinates = (
  ctx,
  squareSize,
  borderSize,
  flipped,
  boardSize,
  forExport = false,
  displayWhite = true,
  boardStartY = null
) => {
  const { fontSize, fontWeight } = getCoordinateParams(boardSize);

  // Use provided borderSize or calculate if not provided
  const effectiveBorder =
    borderSize ?? getCoordinateParams(boardSize).borderSize;

  // Board Y position: for export starts at 0, for display starts at borderSize
  const boardY =
    boardStartY !== null ? boardStartY : forExport ? 0 : effectiveBorder;

  ctx.save();

  // Use precise font rendering
  ctx.font = `${fontWeight} ${fontSize}px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`;
  ctx.fillStyle = forExport ? '#000000' : displayWhite ? '#ffffff' : '#000000';

  // Enable sub-pixel antialiasing for crisp text
  ctx.textRendering = 'optimizeLegibility';

  // Draw ranks (1-8) on the LEFT side
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  const rankMetrics = getTextMetrics(ctx, '8', fontSize);
  const fileMetrics = getTextMetrics(ctx, 'g', fontSize);

  for (let row = 0; row < 8; row++) {
    // Calculate rank number based on flip state
    const rank = flipped ? row + 1 : 8 - row;

    // Y position: center of each square (using boardY for correct positioning)
    const squareTop = boardY + row * squareSize;
    const squareBottom = boardY + (row + 1) * squareSize;
    const centerY = Math.round((squareTop + squareBottom) / 2);
    const yPos = getBaselineFromCenter(centerY, rankMetrics);

    // X position: center of left border (50% ensures horizontal centering)
    const xPos = Math.round(effectiveBorder * 0.5);

    ctx.fillText(rank.toString(), xPos, yPos);
  }

  // Draw files (a-h) on the BOTTOM side
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  for (let col = 0; col < 8; col++) {
    // Calculate file letter based on flip state
    const file = String.fromCharCode(97 + (flipped ? 7 - col : col));

    // X position: center of each square
    const xPos = getCellCenter(effectiveBorder, squareSize, col);

    // Y position: below board, using boardY for correct calculation
    // Board ends at boardY + boardSize, then center in remaining borderSize
    const bottomCenter = Math.round(
      boardY + boardSize + effectiveBorder * 0.55
    );
    const yPos = getBaselineFromCenter(bottomCenter, fileMetrics);

    ctx.fillText(file, xPos, yPos);
  }

  ctx.restore();
};
