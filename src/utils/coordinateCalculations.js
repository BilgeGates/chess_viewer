export const calculateCoordinateMetrics = (squareSize, borderSize) => {
  let fontSize;

  // Font size dinamik - square size-a görə
  if (squareSize < 26) fontSize = 7;
  else if (squareSize < 32) fontSize = 8;
  else if (squareSize < 38) fontSize = 9;
  else if (squareSize < 45) fontSize = 10;
  else if (squareSize < 55) fontSize = 11;
  else if (squareSize < 70) fontSize = 12;
  else fontSize = 13;

  return { fontSize };
};

// Coordinates OUTSIDE board
export const drawCoordinatesOutside = (
  ctx,
  squareSize,
  borderSize,
  flipped,
  boardSize
) => {
  const { fontSize } = calculateCoordinateMetrics(squareSize, borderSize);

  // Padding dinamik - border size-ın yarısı
  const coordPadding = borderSize / 2;

  ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
  ctx.fillStyle = "#cbd5e1"; // Daha yumşaq rəng
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Rank numbers (1-8) - LEFT side
  for (let i = 0; i < 8; i++) {
    const rank = flipped ? i + 1 : 8 - i;
    const yPos = borderSize + i * squareSize + squareSize / 2;
    ctx.fillText(rank.toString(), coordPadding, yPos);
  }

  // File letters (a-h) - BOTTOM
  for (let i = 0; i < 8; i++) {
    const file = String.fromCharCode(97 + (flipped ? 7 - i : i));
    const xPos = borderSize + i * squareSize + squareSize / 2;
    const yPos = borderSize + boardSize + coordPadding;
    ctx.fillText(file, xPos, yPos);
  }
};
