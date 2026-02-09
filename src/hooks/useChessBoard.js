import { useMemo } from 'react';

import { parseFEN, logger } from '@/utils';

/**
 * Creates an empty 8x8 chess board.
 *
 * @returns {Array<Array<string>>} Empty board matrix
 */
function createEmptyBoard() {
  return Array.from({ length: 8 }, () => Array(8).fill(''));
}

/**
 * Parses FEN string into a stable board array.
 * Returns memoized board to prevent unnecessary re-renders.
 *
 * @param {string} fen - FEN notation string
 * @returns {Array<Array<string>>} 8x8 board matrix
 */
export function useChessBoard(fen) {
  const board = useMemo(() => {
    if (!fen || typeof fen !== 'string' || fen.trim() === '') {
      return createEmptyBoard();
    }

    try {
      const parsed = parseFEN(fen);
      if (!Array.isArray(parsed) || parsed.length !== 8) {
        logger.warn(
          'parseFEN returned invalid board, falling back to empty board'
        );
        return createEmptyBoard();
      }
      return parsed;
    } catch (error) {
      logger.error('Failed to parse FEN in useChessBoard:', error);
      return createEmptyBoard();
    }
  }, [fen]);

  return board;
}
