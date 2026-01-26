import { useState, useEffect } from 'react';
import { parseFEN } from '../utils';

export const useChessBoard = (fen) => {
  // Simplified: just use state with useEffect
  const [boardState, setBoardState] = useState(() => {
    if (!fen) return [];
    try {
      return parseFEN(fen);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!fen) {
      setBoardState([]);
      return;
    }
    try {
      const board = parseFEN(fen);
      setBoardState(board);
    } catch (error) {
      console.error('Failed to parse FEN:', error);
      setBoardState([]);
    }
  }, [fen]);

  return boardState;
};
