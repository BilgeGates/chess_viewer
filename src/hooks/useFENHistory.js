import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { validateFEN } from '@/utils';
import { logger } from '@/utils/logger';
import {
  createHistoryEntry,
  touchEntry,
  sortByMostRecent,
  applyFilters,
  calculateStatus
} from '@/utils/historyUtils';
import {
  loadArchive,
  performAutoArchival,
  archiveEntries as archiveEntriesUtil,
  reactivateEntry as reactivateEntryUtil,
  deleteArchivedEntry as deleteArchivedEntryUtil,
  clearArchive as clearArchiveUtil
} from '@/utils/archiveManager';

/**
 * @typedef {import('@/utils/historyUtils').HistoryEntry} HistoryEntry
 * @typedef {import('@/utils/historyUtils').ArchivedEntry} ArchivedEntry
 * @typedef {import('@/utils/historyUtils').FilterOptions} FilterOptions
 */

const DRAG_INACTIVITY_TIMEOUT = 60000;

/**
 * @param {HistoryEntry[]} history - History array to persist
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

/**
 * @param {string} fen - Current FEN string
 * @param {function(boolean):void} [onFavoriteStatusChange] - Callback for favorite status changes
 * @returns {Object}
 */
export const useFENHistory = (fen, onFavoriteStatusChange) => {
  const [fenHistory, setFenHistory] = useState([]);
  const [archive, setArchive] = useState([]);
  const [filters, setFilters] = useState({});
  const [archiveFilters, setArchiveFilters] = useState({});
  const [isLoadingArchive, setIsLoadingArchive] = useState(false);

  const dragTimerRef = useRef(null);
  const dragSessionIdRef = useRef(null);
  const dragSessionFenRef = useRef(null);
  const latestFenRef = useRef(fen);
  const autoArchiveTimerRef = useRef(null);

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

      if (autoArchiveTimerRef.current) {
        clearInterval(autoArchiveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const currentItem = fenHistory.find((h) => h.fen === fen);
    onFavoriteStatusChange?.(currentItem?.isFavorite || false);
  }, [fen, fenHistory, onFavoriteStatusChange]);

  useEffect(() => {
    const performAutoArchive = async () => {
      try {
        const result = await performAutoArchival();
        if (result.archivedCount > 0) {
          setFenHistory(result.entries);
          setArchive(result.archive);
          logger.log(`Auto-archived ${result.archivedCount} entries`);
        }
      } catch (err) {
        logger.error('Auto-archival failed:', err);
      }
    };

    performAutoArchive();

    autoArchiveTimerRef.current = setInterval(
      performAutoArchive,
      60 * 60 * 1000
    );

    return () => {
      if (autoArchiveTimerRef.current) {
        clearInterval(autoArchiveTimerRef.current);
      }
    };
  }, []);

  const filteredHistory = useMemo(() => {
    return applyFilters(fenHistory, filters);
  }, [fenHistory, filters]);

  const filteredArchive = useMemo(() => {
    return applyFilters(archive, archiveFilters);
  }, [archive, archiveFilters]);

  /**
   * @param {string} fenToSave - FEN string to save
   * @param {'manual'|'export'|'drag'} source - Entry source
   * @param {string|null} [dragSessionId] - Drag session ID if applicable
   * @returns {void}
   */
  const commitToHistory = useCallback(
    (fenToSave, source, dragSessionId = null) => {
      if (!validateFEN(fenToSave)) return;

      setFenHistory((prevHistory) => {
        if (prevHistory.length > 0 && prevHistory[0].fen === fenToSave) {
          return prevHistory.map((entry, index) =>
            index === 0 ? touchEntry(entry) : entry
          );
        }

        const newEntry = createHistoryEntry(fenToSave, source, dragSessionId);
        const updatedHistory = sortByMostRecent([newEntry, ...prevHistory]);

        persistHistory(updatedHistory);
        return updatedHistory;
      });
    },
    []
  );

  /**
   * @param {string} fenToSave - FEN string to save
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
   * @param {string} fenToSave - FEN string to save
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

  /**
   * @param {number} id - Entry ID to toggle
   * @returns {Promise<void>}
   */
  const toggleFavorite = useCallback(
    async (id) => {
      const updated = fenHistory.map((h) =>
        h.id === id ? { ...h, isFavorite: !h.isFavorite } : h
      );
      setFenHistory(updated);
      persistHistory(updated);
    },
    [fenHistory]
  );

  /**
   * @param {number} id - Entry ID to delete
   * @returns {Promise<void>}
   */
  const deleteHistory = useCallback(
    async (id) => {
      const updated = fenHistory.filter((h) => h.id !== id);
      setFenHistory(updated);
      persistHistory(updated);
    },
    [fenHistory]
  );

  /**
   * @returns {Promise<void>}
   */
  const clearHistory = useCallback(async () => {
    setFenHistory([]);
    try {
      window.localStorage.removeItem('fen-history');
      if (window.storage) {
        await window.storage.delete('fen-history');
      }
    } catch (err) {
      logger.error('Failed to clear:', err);
    }
  }, []);

  /**
   * @param {string} currentFen - Current FEN string
   * @param {function(string, string):void} [onNotification] - Notification callback
   * @returns {Promise<void>}
   */
  const addCurrentToFavorites = useCallback(
    async (currentFen, onNotification) => {
      if (!validateFEN(currentFen)) {
        onNotification?.('Invalid FEN - cannot add to favorites', 'error');
        return;
      }

      const existingItem = fenHistory.find((h) => h.fen === currentFen);

      let updatedHistory;
      if (existingItem) {
        updatedHistory = fenHistory.map((h) =>
          h.fen === currentFen
            ? { ...h, isFavorite: !h.isFavorite, lastActiveAt: Date.now() }
            : h
        );
        const isFav = !existingItem.isFavorite;
        onNotification?.(
          isFav ? 'Added to favorites' : 'Removed from favorites',
          'success'
        );
      } else {
        const newEntry = createHistoryEntry(currentFen, 'manual');
        newEntry.isFavorite = true;
        updatedHistory = sortByMostRecent([newEntry, ...fenHistory]);
        onNotification?.('Added to favorites ★', 'success');
      }

      setFenHistory(updatedHistory);
      persistHistory(updatedHistory);
    },
    [fenHistory]
  );

  /**
   * @returns {Promise<void>}
   */
  const loadArchiveData = useCallback(async () => {
    setIsLoadingArchive(true);
    try {
      const archiveData = await loadArchive();
      setArchive(archiveData);
    } catch (err) {
      logger.error('Failed to load archive:', err);
    } finally {
      setIsLoadingArchive(false);
    }
  }, []);

  /**
   * @param {number[]} ids - Entry IDs to archive
   * @returns {Promise<void>}
   */
  const archiveHistoryEntries = useCallback(
    async (ids) => {
      const toArchive = fenHistory.filter((entry) => ids.includes(entry.id));
      const remaining = fenHistory.filter((entry) => !ids.includes(entry.id));

      try {
        const { archive: newArchive } = await archiveEntriesUtil(
          toArchive,
          archive,
          'manual'
        );

        setFenHistory(remaining);
        setArchive(newArchive);
        persistHistory(remaining);
      } catch (err) {
        logger.error('Failed to archive entries:', err);
        throw err;
      }
    },
    [fenHistory, archive]
  );

  /**
   * @param {number} id - Archived entry ID to reactivate
   * @returns {Promise<void>}
   */
  const reactivateArchivedEntry = useCallback(
    async (id) => {
      try {
        const { entry, archive: newArchive } = await reactivateEntryUtil(
          id,
          archive
        );

        setArchive(newArchive);
        setFenHistory((prev) => sortByMostRecent([entry, ...prev]));
        persistHistory([entry, ...fenHistory]);
      } catch (err) {
        logger.error('Failed to reactivate entry:', err);
        throw err;
      }
    },
    [archive, fenHistory]
  );

  /**
   * @param {number} id - Archived entry ID to delete
   * @returns {Promise<void>}
   */
  const deleteFromArchive = useCallback(
    async (id) => {
      try {
        const newArchive = await deleteArchivedEntryUtil(id, archive);
        setArchive(newArchive);
      } catch (err) {
        logger.error('Failed to delete from archive:', err);
        throw err;
      }
    },
    [archive]
  );

  /**
   * @returns {Promise<void>}
   */
  const clearArchiveData = useCallback(async () => {
    try {
      await clearArchiveUtil();
      setArchive([]);
    } catch (err) {
      logger.error('Failed to clear archive:', err);
      throw err;
    }
  }, []);

  /**
   * @param {FilterOptions} newFilters - New filter options
   * @returns {void}
   */
  const setHistoryFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  /**
   * @param {FilterOptions} newFilters - New archive filter options
   * @returns {void}
   */
  const setArchiveFiltersState = useCallback((newFilters) => {
    setArchiveFilters(newFilters);
  }, []);

  return {
    fenHistory: filteredHistory,
    rawHistory: fenHistory,
    archive: filteredArchive,
    rawArchive: archive,
    isLoadingArchive,
    toggleFavorite,
    deleteHistory,
    clearHistory,
    addCurrentToFavorites,
    saveManualFen,
    saveExportFen,
    notifyDragAction,
    loadArchiveData,
    archiveHistoryEntries,
    reactivateArchivedEntry,
    deleteFromArchive,
    clearArchiveData,
    setHistoryFilters,
    setArchiveFilters: setArchiveFiltersState,
    calculateStatus
  };
};
