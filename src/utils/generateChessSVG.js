import { parseFEN } from "./fenParser";

export const generateChessSVG = (config) => {
  const {
    fen,
    boardSize,
    showCoords,
    lightSquare,
    darkSquare,
    flipped,
    pieceImages,
  } = config;

  const board = parseFEN(fen);
  const square = boardSize / 8;
  const border = showCoords ? Math.max(16, Math.min(22, boardSize / 25)) : 0;
  const size = boardSize + border * 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;

  /* -------- BOARD SQUARES -------- */
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const rr = flipped ? 7 - r : r;
      const cc = flipped ? 7 - c : c;
      const color = (r + c) % 2 === 0 ? lightSquare : darkSquare;

      svg += `<rect x="${cc * square + border}" y="${
        rr * square + border
      }" width="${square}" height="${square}" fill="${color}" />`;
    }
  }

  /* -------- PIECES -------- */
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r]?.[c];
      const img = pieceImages[piece];
      if (!img) continue;

      const rr = flipped ? 7 - r : r;
      const cc = flipped ? 7 - c : c;

      // Center piece in square with 90% sizing
      const pieceSize = square * 0.9;
      const offset = square * 0.05;

      svg += `<image href="${img.src}" x="${
        cc * square + border + offset
      }" y="${
        rr * square + border + offset
      }" width="${pieceSize}" height="${pieceSize}" />`;
    }
  }

  /* -------- COORDINATES -------- */
  if (showCoords) {
    const fontSize = boardSize * 0.03;
    const fontSizePx = Math.round(Math.max(8, Math.min(17, fontSize)));

    svg += `<style>
      .coord { 
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
        font-weight: 700;
        font-size: ${fontSizePx}px;
        fill: #e2e8f0;
        text-anchor: middle;
        dominant-baseline: middle;
      }
    </style>`;

    // Rank numbers (1-8)
    for (let i = 0; i < 8; i++) {
      const rank = flipped ? i + 1 : 8 - i;
      const yPos = border + i * square + square / 2;
      svg += `<text class="coord" x="${
        border * 0.5
      }" y="${yPos}">${rank}</text>`;
    }

    // File letters (a-h)
    for (let i = 0; i < 8; i++) {
      const file = String.fromCharCode(97 + (flipped ? 7 - i : i));
      const xPos = border + i * square + square / 2;
      const yPos = border + 8 * square + border * 0.5;
      svg += `<text class="coord" x="${xPos}" y="${yPos}">${file}</text>`;
    }
  }

  svg += "</svg>";
  return svg;
};
