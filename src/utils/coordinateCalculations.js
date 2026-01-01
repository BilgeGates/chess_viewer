export const getCoordinateParams = (boardSize, exportQuality = 1) => {
  const fontSize = Math.max(10, Math.min(20, Math.round(boardSize * 0.035)));
  const borderSize = Math.max(20, Math.min(35, Math.round(boardSize * 0.06)));

  return {
    fontSize,
    borderSize,
    fontWeight: 600,
    offset: borderSize * 0.4,
  };
};

/**
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
  const fontSize = Math.max(10, Math.min(20, Math.round(boardSize * 0.035)));
  const fontWeight = 600;
  const offset = borderSize * 0.4;

  ctx.save();
  ctx.font = `${fontWeight} ${fontSize}px Inter, system-ui, sans-serif`;
  ctx.fillStyle = forExport ? "#1a1a1a" : "#e8e8e8";

  // Ranks (1-8)
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let row = 0; row < 8; row++) {
    const rank = flipped ? row + 1 : 8 - row;
    const yPos = borderSize + row * squareSize + squareSize / 2;
    const xPos = offset;

    ctx.fillText(rank.toString(), xPos, yPos);
  }

  // Files (a-h)
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let col = 0; col < 8; col++) {
    const file = String.fromCharCode(97 + (flipped ? 7 - col : col));
    const xPos = borderSize + col * squareSize + squareSize / 2;
    const yPos = boardSize + borderSize + offset * (3 / 2);

    ctx.fillText(file, xPos, yPos);
  }

  ctx.restore();
};
