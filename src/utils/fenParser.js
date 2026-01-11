/**
 * Parse FEN string into 2D board array
 *
 * FEN reads from rank 8 down to rank 1
 * This matches the natural board representation
 *
 * @param {string} fenString - FEN notation
 * @returns {string[][]} 8x8 board array
 */
export function parseFEN(fenString) {
  try {
    if (!fenString || typeof fenString !== 'string') {
      throw new Error('Invalid FEN string');
    }

    const position = fenString.trim().split(/\s+/)[0];
    const rows = position.split('/');

    if (rows.length !== 8) {
      throw new Error(`Invalid FEN: expected 8 ranks, got ${rows.length}`);
    }

    const board = [];

    // FEN gives ranks from 8 -> 1 (top -> bottom)
    // Keep this natural order - DO NOT REVERSE
    for (const row of rows) {
      const boardRow = [];

      for (const char of row) {
        if (isNaN(char)) {
          if (!'pnbrqkPNBRQK'.includes(char)) {
            throw new Error(`Invalid piece character: ${char}`);
          }
          boardRow.push(char);
        } else {
          const emptySquares = parseInt(char, 10);
          if (emptySquares < 1 || emptySquares > 8) {
            throw new Error(`Invalid empty square count: ${char}`);
          }
          boardRow.push(...Array(emptySquares).fill(''));
        }
      }

      if (boardRow.length !== 8) {
        throw new Error(`Invalid rank length: ${boardRow.length} (expected 8)`);
      }

      board.push(boardRow);
    }

    // Return in natural FEN order: board[0] = rank 8, board[7] = rank 1
    return board;
  } catch (error) {
    console.error('FEN parsing error:', error);

    // Safe empty board fallback
    return Array.from({ length: 8 }, () => Array(8).fill(''));
  }
}

/**
 * Validate FEN notation
 * @param {string} fen - FEN string to validate
 * @returns {boolean}
 */
export function validateFEN(fen) {
  try {
    if (!fen || typeof fen !== 'string') return false;

    const position = fen.trim().split(/\s+/)[0];
    const rows = position.split('/');

    if (rows.length !== 8) return false;

    for (const row of rows) {
      let count = 0;

      for (const char of row) {
        if (isNaN(char)) {
          if (!'pnbrqkPNBRQK'.includes(char)) return false;
          count++;
        } else {
          const num = parseInt(char, 10);
          if (num < 1 || num > 8) return false;
          count += num;
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
 * Get material statistics from FEN
 * @param {string} fen
 * @returns {object|null}
 */
export function getPositionStats(fen) {
  try {
    const board = parseFEN(fen);

    const stats = {
      white: {
        pawns: 0,
        knights: 0,
        bishops: 0,
        rooks: 0,
        queens: 0,
        kings: 0
      },
      black: {
        pawns: 0,
        knights: 0,
        bishops: 0,
        rooks: 0,
        queens: 0,
        kings: 0
      }
    };

    for (const row of board) {
      for (const piece of row) {
        if (!piece) continue;

        const color = piece === piece.toUpperCase() ? 'white' : 'black';
        const type = piece.toLowerCase();

        switch (type) {
          case 'p':
            stats[color].pawns++;
            break;
          case 'n':
            stats[color].knights++;
            break;
          case 'b':
            stats[color].bishops++;
            break;
          case 'r':
            stats[color].rooks++;
            break;
          case 'q':
            stats[color].queens++;
            break;
          case 'k':
            stats[color].kings++;
            break;
          default:
            break;
        }
      }
    }

    return stats;
  } catch {
    return null;
  }
}

/**
 * Check if FEN position is empty
 * @param {string} fen
 * @returns {boolean}
 */
export function isEmptyPosition(fen) {
  try {
    const board = parseFEN(fen);

    for (const row of board) {
      for (const piece of row) {
        if (piece) return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}
