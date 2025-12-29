// src/utils/fenParser.js

/**
 * Parse FEN string into 2D board array
 * @param {string} fenString - FEN notation
 * @returns {Array} 2D array representing the board
 */
export function parseFEN(fenString) {
  try {
    if (!fenString || typeof fenString !== "string") {
      throw new Error("Invalid FEN string");
    }

    const position = fenString.trim().split(/\s+/)[0];
    const rows = position.split("/");

    if (rows.length !== 8) {
      throw new Error(`Invalid FEN: expected 8 ranks, got ${rows.length}`);
    }

    const board = [];

    for (let row of rows) {
      const boardRow = [];

      for (let char of row) {
        if (isNaN(char)) {
          if (!"pnbrqkPNBRQK".includes(char)) {
            throw new Error(`Invalid piece character: ${char}`);
          }
          boardRow.push(char);
        } else {
          const emptySquares = parseInt(char);
          if (emptySquares < 1 || emptySquares > 8) {
            throw new Error(`Invalid empty square count: ${char}`);
          }
          boardRow.push(...Array(emptySquares).fill(""));
        }
      }

      if (boardRow.length !== 8) {
        throw new Error(`Invalid rank length: ${boardRow.length} (expected 8)`);
      }

      board.push(boardRow);
    }

    return board;
  } catch (error) {
    console.error("FEN parsing error:", error);
    return Array(8)
      .fill(null)
      .map(() => Array(8).fill(""));
  }
}

/**
 * Validate FEN notation
 * @param {string} fen - FEN string to validate
 * @returns {boolean} Whether FEN is valid
 */
export function validateFEN(fen) {
  try {
    if (!fen || typeof fen !== "string") return false;

    const parts = fen.trim().split(/\s+/);
    if (parts.length < 1) return false;

    const position = parts[0];
    const rows = position.split("/");

    if (rows.length !== 8) return false;

    for (let row of rows) {
      let count = 0;
      for (let char of row) {
        if (isNaN(char)) {
          if (!"pnbrqkPNBRQK".includes(char)) return false;
          count++;
        } else {
          count += parseInt(char);
        }
      }
      if (count !== 8) return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Generate random chess position
 * @returns {string} Random valid FEN
 */
export function generateRandomPosition() {
  const pieces = ["r", "n", "b", "q", "k", "p", "R", "N", "B", "Q", "K", "P"];
  const rows = [];

  for (let i = 0; i < 8; i++) {
    let row = "";
    let emptyCount = 0;

    for (let j = 0; j < 8; j++) {
      if (Math.random() > 0.6) {
        if (emptyCount > 0) {
          row += emptyCount;
          emptyCount = 0;
        }
        row += pieces[Math.floor(Math.random() * pieces.length)];
      } else {
        emptyCount++;
      }
    }

    if (emptyCount > 0) {
      row += emptyCount;
    }

    rows.push(row);
  }

  return rows.join("/") + " w KQkq - 0 1";
}

// Default export for backward compatibility
export default {
  parseFEN,
  validateFEN,
  generateRandomPosition,
};
