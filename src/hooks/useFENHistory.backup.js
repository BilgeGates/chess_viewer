import { useState, useEffect, useCallback, useRef } from 'react';
import { validateFEN } from '@/utils';
import { logger } from '@/utils/logger';

/**
 * FEN History - Intent-based saving system
 *
 * Saves history entries only for intentional user actions:
 * manual input (on blur/paste), exports, and drag interactions (60s delay)
 *
 * @param {string} fen - Current FEN position
 * @param {Function} onFavoriteStatusChange - Callback when favorite status changes
 * @returns {Object} History state and save methods
 */

const DRAG_INACTIVITY_TIMEOUT = 60000;

/**
 * @param {Array} history - History entries to persist
 * @returns {void}
 */
const persistHistory = (history) => {
  const jsonData = JSON.stringify(history);
  try {
    window.localStorage.setItem('fen-history', jsonData);
    if (window.storage) {
      window.storage.set('fen-history', jsonData).catch((err) => {
        logger.error('Failed to save to cloud storage:', err);
      });
    }
  } catch (err) {
    logger.error('Failed to save history:', err);
  }
};

export const useFENHistory = (fen, onFavoriteStatusChange) => {
  const [fenHistory, setFenHistory] = useState([]);

  const dragTimerRef = useRef(null);
  const dragSessionIdRef = useRef(null);
  const dragSessionFenRef = useRef(null);
  const latestFenRef = useRef(fen);

  useEffect(() => {
    latestFenRef.current = fen;
  }, [fen]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const result = await window.storage.get('fen-history');
        if (result && result.value) {
          setFenHistory(JSON.parse(result.value));
          return;
        }
      } catch {
        logger.log('Cloud storage not available');
      }

      try {
        const localData = window.localStorage.getItem('fen-history');
        if (localData) {
          setFenHistory(JSON.parse(localData));
        }
      } catch (err) {
        logger.error('Failed to load history:', err);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    return () => {
      if (dragTimerRef.current) {
        clearTimeout(dragTimerRef.current);
        dragTimerRef.current = null;
      }
      dragSessionIdRef.current = null;
      dragSessionFenRef.current = null;
    };
  }, []);

  useEffect(() => {
    const currentItem = fenHistory.find((h) => h.fen === fen);
    onFavoriteStatusChange?.(currentItem?.isFavorite || false);
  }, [fen, fenHistory, onFavoriteStatusChange]);

  /**
   * @param {string} fenToSave - FEN string to save
   * @param {"manual"|"export"|"drag"} source - Save source
   * @param {string|null} dragSessionId - Optional drag session ID
   * @returns {void}
   */
  const commitToHistory = useCallback(
    (fenToSave, source, dragSessionId = null) => {
      if (!validateFEN(fenToSave)) return;

      setFenHistory((prevHistory) => {
        if (prevHistory.length > 0 && prevHistory[0].fen === fenToSave) {
          return prevHistory;
        }

        const newEntry = {
          id: Date.now(),
          fen: fenToSave,
          timestamp: Date.now(),
          isFavorite: false,
          source,
          ...(dragSessionId ? { dragSessionId } : {})
        };

        const updatedHistory = [newEntry, ...prevHistory].slice(0, 50);
        persistHistory(updatedHistory);
        return updatedHistory;
      });
    },
    []
  );

  /**
   * @param {string} fenToSave - FEN to save from manual input
   * @returns {void}
   */
  const saveManualFen = useCallback(
    (fenToSave) => {
      if (dragTimerRef.current) {
        clearTimeout(dragTimerRef.current);
        dragTimerRef.current = null;
      }
      dragSessionIdRef.current = null;
      dragSessionFenRef.current = null;

      commitToHistory(fenToSave, 'manual');
    },
    [commitToHistory]
  );

  /**
   * @param {string} fenToSave - FEN to save from export action
   * @returns {void}
   */
  const saveExportFen = useCallback(
    (fenToSave) => {
      commitToHistory(fenToSave, 'export');
    },
    [commitToHistory]
  );

  /**
   * @returns {void}
   */
  const notifyDragAction = useCallback(() => {
    if (!dragSessionIdRef.current) {
      dragSessionIdRef.current = `drag-${Date.now()}`;
    }

    dragSessionFenRef.current = latestFenRef.current;

    if (dragTimerRef.current) {
      clearTimeout(dragTimerRef.current);
    }

    const sessionId = dragSessionIdRef.current;

    dragTimerRef.current = setTimeout(() => {
      const fenToSave = latestFenRef.current;
      commitToHistory(fenToSave, 'drag', sessionId);

      dragTimerRef.current = null;
      dragSessionIdRef.current = null;
      dragSessionFenRef.current = null;
    }, DRAG_INACTIVITY_TIMEOUT);
  }, [commitToHistory]);

  const toggleFavorite = async (id) => {
    const updated = fenHistory.map((h) =>
      h.id === id ? { ...h, isFavorite: !h.isFavorite } : h
    );
    setFenHistory(updated);
    const jsonData = JSON.stringify(updated);

    try {
      window.localStorage.setItem('fen-history', jsonData);
      if (window.storage) {
        await window.storage.set('fen-history', jsonData);
      }
    } catch (err) {
      logger.error('Failed to update favorite:', err);
    }
  };

  const deleteHistory = async (id) => {
    const updated = fenHistory.filter((h) => h.id !== id);
    setFenHistory(updated);
    const jsonData = JSON.stringify(updated);

    try {
      window.localStorage.setItem('fen-history', jsonData);
      if (window.storage) {
        await window.storage.set('fen-history', jsonData);
      }
    } catch (err) {
      logger.error('Failed to delete:', err);
    }
  };

  const clearHistory = async () => {
    setFenHistory([]);
    try {
      window.localStorage.removeItem('fen-history');
      if (window.storage) {
        await window.storage.delete('fen-history');
      }
    } catch (err) {
      logger.error('Failed to clear:', err);
    }
  };

  const addCurrentToFavorites = async (currentFen, onNotification) => {
    if (!validateFEN(currentFen)) {
      onNotification?.('Invalid FEN - cannot add to favorites', 'error');
      return;
    }

    const existingItem = fenHistory.find((h) => h.fen === currentFen);

    let updatedHistory;
    if (existingItem) {
      updatedHistory = fenHistory.map((h) =>
        h.fen === currentFen
          ? { ...h, isFavorite: !h.isFavorite, timestamp: Date.now() }
          : h
      );
      const isFav = !existingItem.isFavorite;
      onNotification?.(
        isFav ? 'Added to favorites' : 'Removed from favorites',
        'success'
      );
    } else {
      const newEntry = {
        id: Date.now(),
        fen: currentFen,
        timestamp: Date.now(),
        isFavorite: true
      };
      updatedHistory = [newEntry, ...fenHistory].slice(0, 50);
      onNotification?.('Added to favorites ★', 'success');
    }

    setFenHistory(updatedHistory);
    const jsonData = JSON.stringify(updatedHistory);

    try {
      window.localStorage.setItem('fen-history', jsonData);
      if (window.storage) {
        await window.storage.set('fen-history', jsonData);
      }
    } catch (err) {
      logger.error('Failed to save favorite:', err);
    }
  };

  return {
    fenHistory,
    toggleFavorite,
    deleteHistory,
    clearHistory,
    addCurrentToFavorites,
    // Intent-based save API
    saveManualFen,
    saveExportFen,
    notifyDragAction
  };
};
