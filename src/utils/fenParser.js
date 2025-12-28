/**
 * Parse FEN notation into 8x8 board array
 */
export const parseFEN = (fenString) => {
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
