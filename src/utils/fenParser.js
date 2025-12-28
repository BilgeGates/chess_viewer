/**
 * Parse FEN string into board state array
 */
export const parseFEN = (fenString) => {
  try {
    const parts = fenString.trim().split(/\s+/);
    const position = parts[0];
    const rows = position.split("/");
    const board = [];

    for (let row of rows) {
      let boardRow = [];
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
  } catch (e) {
    console.error("FEN parse error:", e);
    return [];
  }
};
