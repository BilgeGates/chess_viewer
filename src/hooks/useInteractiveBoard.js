import { useState, useCallback, useMemo, useRef } from 'react';
import { parseFEN, validateFEN, logger } from '@/utils';

const createEmptyBoard = () =>
  Array.from({ length: 8 }, () => Array(8).fill(''));

/**
 * Convert board array to FEN position string
 * @param {string[][]} board - 8x8 board array
 * @returns {string} - FEN position string
 */
const boardToFEN = (board) => {
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
 * Hook for managing interactive chess board with drag & drop
 * @param {string} initialFen - Initial FEN string
 * @param {function} onFenChange - Callback when FEN changes
 * @returns {object} - Board state and handlers
 */
export const useInteractiveBoard = (initialFen, onFenChange) => {
  const [board, setBoard] = useState(() => {
    try {
      if (initialFen && validateFEN(initialFen)) {
        return parseFEN(initialFen);
      }
    } catch (err) {
      logger.error('Failed to parse initial FEN:', err);
    }
    return createEmptyBoard();
  });

  const [boardKey, setBoardKey] = useState(0);
  const lastGeneratedFenRef = useRef('');
  const lastExternalFenRef = useRef(initialFen);

  /**
   * Update board from external FEN changes
   */
  const syncFromFen = useCallback((fen) => {
    if (fen === lastGeneratedFenRef.current) {
      return;
    }

    if (fen === lastExternalFenRef.current) {
      return;
    }

    lastExternalFenRef.current = fen;

    try {
      if (fen && validateFEN(fen)) {
        const newBoard = parseFEN(fen);
        if (newBoard && newBoard.length === 8) {
          setBoard(newBoard);
        }
      }
    } catch (err) {
      logger.error('Failed to sync from FEN:', err);
    }
  }, []);

  /**
   * Generate FEN from current board and notify parent
   */
  const notifyFenChange = useCallback(
    (newBoard) => {
      const positionFen = boardToFEN(newBoard);
      const fullFen = `${positionFen} w - - 0 1`;

      lastGeneratedFenRef.current = fullFen;

      if (onFenChange) {
        onFenChange(fullFen);
      }
    },
    [onFenChange]
  );

  /**
   * Handle piece drop on board
   * @param {string} piece - FEN character of the piece
   * @param {number|undefined} fromRow - Source row
   * @param {number|undefined} fromCol - Source column
   * @param {number} toRow - Target row
   * @param {number} toCol - Target column
   * @param {boolean} isFromPalette - Whether piece came from palette
   */
  const handlePieceDrop = useCallback(
    (piece, fromRow, fromCol, toRow, toCol, isFromPalette) => {
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row) => [...row]);

        if (!isFromPalette && fromRow !== undefined && fromCol !== undefined) {
          newBoard[fromRow][fromCol] = '';
        }

        newBoard[toRow][toCol] = piece;

        notifyFenChange(newBoard);

        return newBoard;
      });
    },
    [notifyFenChange]
  );

  /**
   * Handle piece removal
   * @param {number} row - Row of piece to remove
   * @param {number} col - Column of piece to remove
   */
  const handlePieceRemove = useCallback(
    (row, col) => {
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((r) => [...r]);
        newBoard[row][col] = '';

        notifyFenChange(newBoard);

        return newBoard;
      });
    },
    [notifyFenChange]
  );

  /**
   * Clear all pieces from the board
   */
  const clearBoard = useCallback(() => {
    const emptyBoard = createEmptyBoard();
    const emptyFen = '8/8/8/8/8/8/8/8 w - - 0 1';

    lastGeneratedFenRef.current = emptyFen;
    lastExternalFenRef.current = emptyFen;

    setBoard(emptyBoard);
    setBoardKey((prev) => prev + 1);

    if (onFenChange) {
      onFenChange(emptyFen);
    }
  }, [onFenChange]);

  /**
   * Reset to starting position
   */
  const resetBoard = useCallback(() => {
    const startingFen =
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const startingBoard = parseFEN(startingFen);

    lastGeneratedFenRef.current = startingFen;
    lastExternalFenRef.current = startingFen;

    setBoard(startingBoard);
    setBoardKey((prev) => prev + 1);

    if (onFenChange) {
      onFenChange(startingFen);
    }
  }, [onFenChange]);

  /**
   * Set a specific piece at a position
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @param {string} piece - FEN character or empty string
   */
  const setPiece = useCallback(
    (row, col, piece) => {
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((r) => [...r]);
        newBoard[row][col] = piece;

        notifyFenChange(newBoard);

        return newBoard;
      });
    },
    [notifyFenChange]
  );

  /**
   * Get current FEN string
   */
  const currentFen = useMemo(() => {
    const positionFen = boardToFEN(board);
    return `${positionFen} w - - 0 1`;
  }, [board]);

  return {
    board,
    boardKey,
    currentFen,
    handlePieceDrop,
    handlePieceRemove,
    clearBoard,
    resetBoard,
    setPiece,
    syncFromFen
  };
};

export default useInteractiveBoard;
