import { useMemo } from 'react';
import { parseFEN, logger } from '../utils';

// Create a safe empty 8x8 board (stable reference)
const createEmptyBoard = () =>
  Array.from({ length: 8 }, () => Array(8).fill(''));

/**
 * useChessBoard
 * Returns a stable, memoized 8x8 board array parsed from the provided FEN.
 * Guarantees the returned value is always an 8x8 array (never null/[]) which
 * prevents downstream render errors and makes shallow equality checks more
 * reliable for memoized components.
 *
 * @param {string} fen - FEN string
 * @returns {string[][]} 8x8 board array
 */
export const useChessBoard = (fen) => {
  const board = useMemo(() => {
    if (!fen || typeof fen !== 'string' || fen.trim() === '') {
      return createEmptyBoard();
    }

    try {
      const parsed = parseFEN(fen);
      // Ensure parser returns a valid 8x8 board; fallback to empty board
      if (!Array.isArray(parsed) || parsed.length !== 8) {
        logger.warn(
          'parseFEN returned invalid board, falling back to empty board'
        );
        return createEmptyBoard();
      }
      return parsed;
    } catch (err) {
      logger.error('Failed to parse FEN in useChessBoard:', err);
      return createEmptyBoard();
    }
    // Only recompute when fen string value changes
  }, [fen]);

  return board;
};
