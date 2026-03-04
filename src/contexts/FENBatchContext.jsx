import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext
} from 'react';
import { validateFEN } from '@/utils';

const FENBatchContext = createContext(null);

/**
 * Access the nearest FENBatchContext value.
 *
 * @returns {Object} Batch context with list and mutation helpers
 * @throws {Error} If used outside a FENBatchProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useFENBatch = () => {
  const context = useContext(FENBatchContext);
  if (!context) {
    throw new Error('useFENBatch must be used within FENBatchProvider');
  }
  return context;
};

/**
 * Manages a list of FEN strings for batch export operations with localStorage persistence.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export const FENBatchProvider = ({ children }) => {
  const [batchList, setBatchList] = useState(() => {
    try {
      const saved = localStorage.getItem('fenBatchList');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('fenBatchList', JSON.stringify(batchList));
  }, [batchList]);

  /**
   * Add a validated FEN string to the batch list.
   * Uses a functional updater to maintain a stable callback reference.
   *
   * @param {string} fen - FEN string to add
   * @returns {boolean} True if the FEN was added, false if invalid or duplicate
   */
  const addToBatch = useCallback(
    (fen) => {
      if (!fen || !validateFEN(fen)) {
        return false;
      }
      const trimmedFen = fen.trim();

      // Use functional updater so this callback never closes over stale batchList,
      // giving it a stable reference that doesn't cause child re-renders.
      let added = false;
      setBatchList((prev) => {
        if (prev.includes(trimmedFen)) return prev;
        added = true;
        return [...prev, trimmedFen];
      });
      return added;
    },
    [] // stable — no batchList dependency
  );

  /**
   * Remove an entry from the batch list by index.
   *
   * @param {number} index - Index of the entry to remove
   */
  const removeFromBatch = useCallback((index) => {
    setBatchList((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Remove all entries from the batch list.
   */
  const clearBatch = useCallback(() => {
    setBatchList([]);
  }, []);

  /**
   * Replace an entry in the batch list at the given index with a new validated FEN.
   *
   * @param {number} index - Index of the entry to update
   * @param {string} newFen - Replacement FEN string
   * @returns {boolean} True if updated, false if newFen is invalid
   */
  const updateBatchItem = useCallback((index, newFen) => {
    if (!newFen || !validateFEN(newFen)) {
      return false;
    }
    setBatchList((prev) => {
      const updated = [...prev];
      updated[index] = newFen.trim();
      return updated;
    });
    return true;
  }, []);

  const value = {
    batchList,
    addToBatch,
    removeFromBatch,
    clearBatch,
    updateBatchItem
  };

  return (
    <FENBatchContext.Provider value={value}>
      {children}
    </FENBatchContext.Provider>
  );
};
