import { useState, useEffect } from 'react';
import { parseFEN, logger } from '../utils';

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
      logger.error('Failed to parse FEN:', error);
      setBoardState([]);
    }
  }, [fen]);

  return boardState;
};
