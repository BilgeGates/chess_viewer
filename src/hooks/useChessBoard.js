import { useState, useEffect } from "react";
import { parseFEN } from "../utils";

export const useChessBoard = (fen) => {
  const [boardState, setBoardState] = useState([]);

  useEffect(() => {
    if (!fen) return;
    const board = parseFEN(fen);
    setBoardState(board);
  }, [fen]);

  return boardState;
};
