const VALID_PIECES = 'pnbrqkPNBRQK';

/**
 * Creates an empty 8x8 chess board.
 *
 * @returns {Array<Array<string>>} Empty board matrix
 */
function createEmptyBoard() {
  const board = [];

  for (let row = 0; row < 8; row++) {
    const emptyRow = [];

    for (let col = 0; col < 8; col++) {
      emptyRow.push('');
    }

    board.push(emptyRow);
  }

  return board;
}

/**
 * Parses FEN string into 2D board array.
 *
 * @param {string} fenString - FEN notation string
 * @returns {Array<Array<string>>} 8x8 array of pieces or empty strings
 */
export function parseFEN(fenString) {
  try {
    if (!fenString || typeof fenString !== 'string') {
      throw new Error('Invalid FEN string');
    }

    const trimmed = fenString.trim();

    if (trimmed.length === 0) {
      throw new Error('FEN string is empty');
    }

    const parts = trimmed.split(/\s+/);
    const position = parts[0];
    const rows = position.split('/');

    if (rows.length !== 8) {
      throw new Error('Invalid FEN: expected 8 ranks, got ' + rows.length);
    }

    const board = [];

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      const boardRow = [];

      for (let charIndex = 0; charIndex < row.length; charIndex++) {
        const char = row[charIndex];

        if (isNaN(char)) {
          if (VALID_PIECES.indexOf(char) === -1) {
            throw new Error('Invalid piece character: ' + char);
          }
          boardRow.push(char);
        } else {
          const emptySquares = parseInt(char, 10);

          if (emptySquares < 1 || emptySquares > 8) {
            throw new Error('Invalid empty square count: ' + char);
          }

          for (let i = 0; i < emptySquares; i++) {
            boardRow.push('');
          }
        }
      }

      if (boardRow.length !== 8) {
        throw new Error(
          'Invalid rank length: ' + boardRow.length + ' (expected 8)'
        );
      }

      board.push(boardRow);
    }

    if (board.length !== 8) {
      throw new Error('Invalid board structure: ' + board.length + ' ranks');
    }

    return board;
  } catch {
    return createEmptyBoard();
  }
}

/**
 * Validates FEN string structure.
 *
 * @param {string} fen - FEN string to validate
 * @returns {boolean} True if valid
 */
export function validateFEN(fen) {
  try {
    if (!fen || typeof fen !== 'string') {
      return false;
    }

    const position = fen.trim().split(/\s+/)[0];
    const rows = position.split('/');

    if (rows.length !== 8) {
      return false;
    }

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      let squareCount = 0;

      for (let charIndex = 0; charIndex < row.length; charIndex++) {
        const char = row[charIndex];

        if (isNaN(char)) {
          if (VALID_PIECES.indexOf(char) === -1) {
            return false;
          }
          squareCount = squareCount + 1;
        } else {
          const num = parseInt(char, 10);

          if (num < 1 || num > 8) {
            return false;
          }

          squareCount = squareCount + num;
        }
      }

      if (squareCount !== 8) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Gets piece count statistics from FEN position.
 *
 * @param {string} fen - FEN string
 * @returns {Object|null} Piece counts for white and black
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

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];

        if (!piece) {
          continue;
        }

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
 * Checks if FEN position is empty (no pieces).
 *
 * @param {string} fen - FEN string
 * @returns {boolean} True if board is empty
 */
export function isEmptyPosition(fen) {
  try {
    const board = parseFEN(fen);

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col]) {
          return false;
        }
      }
    }

    return true;
  } catch {
    return false;
  }
}
