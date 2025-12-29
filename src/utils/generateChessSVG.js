// src/utils/generateChessSVG.js

/**
 * Generate high-quality SVG chess board
 * Perfect for printing and infinite scaling
 */
export const generateChessSVG = (config) => {
  const { fen, boardSize, showCoords, lightSquare, darkSquare, flipped } =
    config;

  const board = parseFEN(fen);
  const square = boardSize / 8;
  const border = showCoords ? Math.max(20, Math.min(30, boardSize / 20)) : 0;
  const size = boardSize + border * 2;
  const fontSize = Math.round(boardSize * 0.032);

  // SVG header
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="${size}" 
     height="${size}" 
     viewBox="0 0 ${size} ${size}">
  <defs>
    <style>
      .coord { 
        font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 700;
        font-size: ${fontSize}px;
        fill: #1a1a1a;
        text-anchor: middle;
        dominant-baseline: middle;
      }
      .piece-white {
        fill: #ffffff;
        stroke: #000000;
        stroke-width: 2;
      }
      .piece-black {
        fill: #000000;
        stroke: #ffffff;
        stroke-width: 2;
      }
    </style>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="white"/>
  
  <!-- Board Squares -->
  <g id="squares">`;

  // Draw squares
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const rr = flipped ? 7 - r : r;
      const cc = flipped ? 7 - c : c;
      const color = (r + c) % 2 === 0 ? lightSquare : darkSquare;

      svg += `
    <rect x="${cc * square + border}" y="${rr * square + border}" 
          width="${square}" height="${square}" fill="${color}"/>`;
    }
  }

  svg += `
  </g>
  
  <!-- Pieces -->
  <g id="pieces">`;

  // Unicode chess symbols
  const pieceSymbols = {
    K: "♔",
    Q: "♕",
    R: "♖",
    B: "♗",
    N: "♘",
    P: "♙",
    k: "♚",
    q: "♛",
    r: "♜",
    b: "♝",
    n: "♞",
    p: "♟",
  };

  // Draw pieces
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r]?.[c];
      if (!piece) continue;

      const rr = flipped ? 7 - r : r;
      const cc = flipped ? 7 - c : c;
      const x = cc * square + border + square / 2;
      const y = rr * square + border + square / 2;

      const isWhite = piece === piece.toUpperCase();
      const pieceSize = square * 0.75;
      const symbol = pieceSymbols[piece] || "?";

      svg += `
    <text x="${x}" y="${y}" 
          font-size="${pieceSize}" 
          text-anchor="middle" 
          dominant-baseline="central"
          class="piece-${isWhite ? "white" : "black"}">${symbol}</text>`;
    }
  }

  svg += `
  </g>`;

  // Draw coordinates
  if (showCoords) {
    svg += `
  
  <!-- Coordinates -->
  <g id="coordinates">`;

    // Ranks
    for (let i = 0; i < 8; i++) {
      const rank = flipped ? i + 1 : 8 - i;
      const y = border + i * square + square / 2;
      svg += `
    <text class="coord" x="${border * 0.5}" y="${y}">${rank}</text>`;
    }

    // Files
    for (let i = 0; i < 8; i++) {
      const file = String.fromCharCode(97 + (flipped ? 7 - i : i));
      const x = border + i * square + square / 2;
      const y = border + 8 * square + border * 0.5;
      svg += `
    <text class="coord" x="${x}" y="${y}">${file}</text>`;
    }

    svg += `
  </g>`;
  }

  svg += `
</svg>`;

  return svg;
};

/**
 * Parse FEN string
 */
const parseFEN = (fenString) => {
  try {
    const position = fenString.trim().split(/\s+/)[0];
    const rows = position.split("/");
    const board = [];

    for (let row of rows) {
      const boardRow = [];
      for (let char of row) {
        if (isNaN(char)) {
          boardRow.push(char);
        } else {
          boardRow.push(...Array(parseInt(char)).fill(""));
        }
      }
      board.push(boardRow);
    }

    return board;
  } catch {
    return Array(8)
      .fill(null)
      .map(() => Array(8).fill(""));
  }
};
