/**
 * Deep compare two board arrays
 * @param {string[][]} board1 - First board array
 * @param {string[][]} board2 - Second board array
 * @returns {boolean} - True if boards are identical
 */
export const areBoardsEqual = (board1, board2) => {
  if (!board1 || !board2) return false;
  if (board1.length !== board2.length) return false;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board1[row]?.[col] !== board2[row]?.[col]) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Create an empty 8x8 chess board
 * @returns {string[][]} - Empty board array
 */
export const createEmptyBoard = () =>
  Array.from({ length: 8 }, () => Array(8).fill(''));

/**
 * Convert board array to FEN position string
 * @param {string[][]} board - 8x8 board array
 * @returns {string} - FEN position string
 */
export const boardToFEN = (board) => {
  if (!board || board.length !== 8) return '8/8/8/8/8/8/8/8';

  const rows = [];

  for (let row = 0; row < 8; row++) {
    let rowStr = '';
    let emptyCount = 0;

    for (let col = 0; col < 8; col++) {
      const piece = board[row]?.[col];

      if (piece) {
        if (emptyCount > 0) {
          rowStr += emptyCount;
          emptyCount = 0;
        }
        rowStr += piece;
      } else {
        emptyCount++;
      }
    }

    if (emptyCount > 0) {
      rowStr += emptyCount;
    }

    rows.push(rowStr || '8');
  }

  return rows.join('/');
};

/**
 * Check if board is empty
 * @param {string[][]} board - 8x8 board array
 * @returns {boolean} - True if board has no pieces
 */
export const isBoardEmpty = (board) => {
  if (!board || board.length !== 8) return true;
  return board.every((row) => row.every((cell) => cell === ''));
};
