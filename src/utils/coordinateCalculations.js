/**
 * Coordinate Calculations
 *
 * These functions calculate where to draw the board coordinates
 * (the letters a-h and numbers 1-8 around the chess board edges).
 *
 * Coordinates need to be pixel-perfect — even 1px off looks sloppy
 * when exporting high-resolution chess diagrams.
 */

/**
 * Calculate the size of the coordinate border and font size.
 *
 * The border area around the board holds the rank numbers (1-8)
 * and file letters (a-h). Its size scales with the board size.
 *
 * @param {number} boardSize - The board size in pixels
 * @returns {Object} - { fontSize, borderSize, fontWeight, offset }
 */
export function getCoordinateParams(boardSize) {
  // Border size: scales with board, but clamped between 18px and 64px
  const borderSize = Math.round(Math.max(18, Math.min(64, boardSize * 0.05)));

  // Font size: 72% of the border size, clamped between 10px and 36px
  const fontSize = Math.round(Math.max(10, Math.min(36, borderSize * 0.72)));

  return {
    fontSize: fontSize,
    borderSize: borderSize,
    fontWeight: 600,
    offset: Math.round(borderSize / 2)
  };
}

/**
 * Calculate the center position of a chess square.
 *
 * @param {number} borderSize - The border size in pixels
 * @param {number} squareSize - The size of one square in pixels
 * @param {number} index - The row or column index (0-7)
 * @returns {number} - The center pixel coordinate
 */
function getCellCenter(borderSize, squareSize, index) {
  const start = Math.round(borderSize + index * squareSize);
  const end = Math.round(borderSize + (index + 1) * squareSize);
  return Math.round((start + end) / 2);
}

/**
 * Measure text dimensions for accurate positioning.
 *
 * We need to know how tall the text is to center it perfectly
 * within the coordinate border area.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas drawing context
 * @param {string} sample - A sample character to measure
 * @param {number} fontSize - The font size in pixels
 * @returns {Object} - { ascent, descent, height }
 */
function getTextMetrics(ctx, sample, fontSize) {
  const metrics = ctx.measureText(sample);

  // Use actual metrics if available, otherwise estimate
  let ascent = fontSize * 0.8;
  if (Number.isFinite(metrics.actualBoundingBoxAscent)) {
    ascent = metrics.actualBoundingBoxAscent;
  }

  let descent = fontSize * 0.2;
  if (Number.isFinite(metrics.actualBoundingBoxDescent)) {
    descent = metrics.actualBoundingBoxDescent;
  }

  const height = ascent + descent;

  return { ascent: ascent, descent: descent, height: height };
}

/**
 * Calculate the Y position (baseline) needed to vertically center text.
 *
 * Text in canvas is drawn at its "baseline" (the bottom of letters like 'a').
 * To center text, we need to shift the baseline based on the ascent and descent.
 *
 * @param {number} centerY - The desired vertical center
 * @param {Object} metrics - Text metrics from getTextMetrics()
 * @returns {number} - The baseline Y position
 */
function getBaselineFromCenter(centerY, metrics) {
  return Math.round(centerY + (metrics.ascent - metrics.descent) / 2);
}

/**
 * Draw the coordinate labels (a-h, 1-8) around the chess board.
 *
 * Rank numbers (1-8) go on the left side.
 * File letters (a-h) go on the bottom.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas drawing context
 * @param {number} squareSize - Size of each square in pixels
 * @param {number} borderSize - Size of the coordinate border in pixels
 * @param {boolean} flipped - Whether the board is flipped (black's perspective)
 * @param {number} boardSize - Total board size in pixels
 * @param {boolean} forExport - true = black text (for export), false = display text
 * @param {boolean} displayWhite - true = white text (for dark backgrounds)
 * @param {number} boardStartY - Y position where the board starts (optional)
 */
export function drawCoordinates(
  ctx,
  squareSize,
  borderSize,
  flipped,
  boardSize,
  forExport,
  displayWhite,
  boardStartY
) {
  // Set default values for optional parameters
  if (forExport === undefined) {
    forExport = false;
  }
  if (displayWhite === undefined) {
    displayWhite = true;
  }

  const coordParams = getCoordinateParams(boardSize);
  const fontSize = coordParams.fontSize;
  const fontWeight = coordParams.fontWeight;

  // Use provided borderSize, or calculate from boardSize
  let effectiveBorder = borderSize;
  if (effectiveBorder === null || effectiveBorder === undefined) {
    effectiveBorder = coordParams.borderSize;
  }

  // Determine where the board starts vertically
  let boardY;
  if (boardStartY !== null && boardStartY !== undefined) {
    boardY = boardStartY;
  } else if (forExport) {
    boardY = 0;
  } else {
    boardY = effectiveBorder;
  }

  // Save the current canvas state (so we can restore it later)
  ctx.save();

  // Set up the font
  ctx.font =
    fontWeight +
    ' ' +
    fontSize +
    'px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

  // Choose text color: black for export, white/black for display
  if (forExport) {
    ctx.fillStyle = '#000000';
  } else if (displayWhite) {
    ctx.fillStyle = '#ffffff';
  } else {
    ctx.fillStyle = '#000000';
  }

  ctx.textRendering = 'optimizeLegibility';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Measure text dimensions for accurate centering
  const rankMetrics = getTextMetrics(ctx, '8', fontSize);
  const fileMetrics = getTextMetrics(ctx, 'g', fontSize);

  // Draw rank numbers (1-8) on the left side
  for (let row = 0; row < 8; row++) {
    // Determine the rank number (depends on whether board is flipped)
    let rank;
    if (flipped) {
      rank = row + 1;
    } else {
      rank = 8 - row;
    }

    // Calculate the vertical center of this square
    const squareTop = boardY + row * squareSize;
    const squareBottom = boardY + (row + 1) * squareSize;
    const centerY = Math.round((squareTop + squareBottom) / 2);

    // Position the text centered in the left border
    const yPos = getBaselineFromCenter(centerY, rankMetrics);
    const xPos = Math.round(effectiveBorder * 0.5);

    ctx.fillText(rank.toString(), xPos, yPos);
  }

  // Draw file letters (a-h) on the bottom
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  for (let col = 0; col < 8; col++) {
    // Determine the file letter (depends on whether board is flipped)
    let fileIndex;
    if (flipped) {
      fileIndex = 7 - col;
    } else {
      fileIndex = col;
    }
    // Convert index to letter: 0='a', 1='b', ..., 7='h'
    const file = String.fromCharCode(97 + fileIndex);

    // Calculate position centered below the square
    const xPos = getCellCenter(effectiveBorder, squareSize, col);
    const bottomCenter = Math.round(
      boardY + boardSize + effectiveBorder * 0.55
    );
    const yPos = getBaselineFromCenter(bottomCenter, fileMetrics);

    ctx.fillText(file, xPos, yPos);
  }

  // Restore the canvas state
  ctx.restore();
}
