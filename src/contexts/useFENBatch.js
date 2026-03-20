import { useContext } from 'react';

import { FENBatchContext } from './FENBatchStore';

/**
 * Returns FEN batch list state and actions from FENBatchContext.
 *
 * @returns {Object} FEN batch context value
 */
export function useFENBatch() {
  const context = useContext(FENBatchContext);
  if (!context) {
    throw new Error('useFENBatch must be used within FENBatchProvider');
  }
  return context;
}
