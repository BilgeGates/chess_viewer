import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import { validateFEN } from '@/utils';

const FENBatchContext = createContext(null);

export const useFENBatch = () => {
  const context = useContext(FENBatchContext);
  if (!context) {
    throw new Error('useFENBatch must be used within FENBatchProvider');
  }
  return context;
};

export const FENBatchProvider = ({ children }) => {
  const [batchList, setBatchList] = useState(() => {
    try {
      const saved = localStorage.getItem('fenBatchList');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('fenBatchList', JSON.stringify(batchList));
  }, [batchList]);

  const addToBatch = useCallback(
    (fen) => {
      if (!fen || !validateFEN(fen)) {
        return false;
      }

      const trimmedFen = fen.trim();

      // Check for duplicates
      if (batchList.includes(trimmedFen)) {
        return false;
      }

      setBatchList((prev) => [...prev, trimmedFen]);
      return true;
    },
    [batchList]
  );

  const removeFromBatch = useCallback((index) => {
    setBatchList((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearBatch = useCallback(() => {
    setBatchList([]);
  }, []);

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
