import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { validateFEN } from '@/utils';
import {
  archiveEntries as archiveEntriesUtil,
  clearArchive as clearArchiveUtil,
  deleteArchivedEntry as deleteArchivedEntryUtil,
  loadArchive,
  performAutoArchival,
  reactivateEntry as reactivateEntryUtil
} from '@/utils/archiveManager';
import {
  applyFilters,
  calculateStatus,
  createHistoryEntry,
  sortByMostRecent,
  touchEntry
} from '@/utils/historyUtils';
import { logger } from '@/utils/logger';
import { safeJSONParse } from '@/utils/validation';

const DRAG_INACTIVITY_TIMEOUT = 60000;
const persistHistory = (history) => {
  const jsonData = JSON.stringify(history);
  try {
    window.localStorage.setItem('fen-history', jsonData);
    if (window.storage && typeof window.storage.set === 'function') {
      window.storage.set('fen-history', jsonData).catch((err) => {
        logger.error('Failed to save to cloud storage:', err);
      });
    }
  } catch (err) {
    logger.error('Failed to save history:', err);
  }
};
/**
 * Manages FEN history, pinning, filtering, archiving, and auto-archival lifecycle.
 *
 * @param {string} fen - Current FEN string
 * @param {function(string, boolean): void} onFavoriteStatusChange - Called when a FEN's favorite status changes
 * @returns {Object} History state and actions
 */
export function useFENHistory(fen, onFavoriteStatusChange) {
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
  const fenHistoryRef = useRef(fenHistory);
  useEffect(() => {
    latestFenRef.current = fen;
  }, [fen]);
  useEffect(() => {
    fenHistoryRef.current = fenHistory;
  }, [fenHistory]);
  useEffect(() => {
    const id = setTimeout(() => {
      persistHistory(fenHistory);
    }, 300);
    return () => clearTimeout(id);
  }, [fenHistory]);
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const result = await window.storage.get('fen-history');
        if (result && typeof result.value === 'string') {
          const parsed = safeJSONParse(result.value, null);
          if (Array.isArray(parsed)) {
            setFenHistory(parsed);
            return;
          }
        }
      } catch {
        logger.log('Cloud storage not available');
      }
      try {
        const localData = window.localStorage.getItem('fen-history');
        if (localData) {
          const parsed = safeJSONParse(localData, null);
          if (Array.isArray(parsed)) {
            setFenHistory(parsed);
          }
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
  const fenIndex = useMemo(
    () => new Map(fenHistory.map((h) => [h.fen, h])),
    [fenHistory]
  );
  useEffect(() => {
    onFavoriteStatusChange?.(fenIndex.get(fen)?.isFavorite ?? false);
  }, [fen, fenIndex, onFavoriteStatusChange]);
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
        return updatedHistory;
      });
    },
    []
  );
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
  const saveExportFen = useCallback(
    (fenToSave) => {
      commitToHistory(fenToSave, 'export');
    },
    [commitToHistory]
  );
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
  const toggleFavorite = useCallback(async (id) => {
    setFenHistory((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              isFavorite: !h.isFavorite
            }
          : h
      )
    );
  }, []);
  const deleteHistory = useCallback(async (id) => {
    setFenHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);
  const clearHistory = useCallback(async () => {
    setFenHistory([]);
    try {
      window.localStorage.removeItem('fen-history');
      if (window.storage && typeof window.storage.delete === 'function') {
        await window.storage.delete('fen-history');
      }
    } catch (err) {
      logger.error('Failed to clear:', err);
    }
  }, []);
  const addCurrentToFavorites = useCallback(
    async (currentFen, onNotification) => {
      if (!validateFEN(currentFen)) {
        onNotification?.('Invalid FEN - cannot add to favorites', 'error');
        return;
      }
      const existingItem = fenHistoryRef.current.find(
        (h) => h.fen === currentFen
      );
      if (existingItem) {
        const isFav = !existingItem.isFavorite;
        onNotification?.(
          isFav ? 'Added to favorites' : 'Removed from favorites',
          'success'
        );
      } else {
        onNotification?.('Added to favorites ★', 'success');
      }
      setFenHistory((prev) => {
        const existing = prev.find((h) => h.fen === currentFen);
        if (existing) {
          return prev.map((h) =>
            h.fen === currentFen
              ? {
                  ...h,
                  isFavorite: !h.isFavorite,
                  lastActiveAt: Date.now()
                }
              : h
          );
        }
        const newEntry = createHistoryEntry(currentFen, 'manual');
        newEntry.isFavorite = true;
        return sortByMostRecent([newEntry, ...prev]);
      });
    },
    []
  );
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
  const archiveHistoryEntries = useCallback(
    async (ids) => {
      const current = fenHistoryRef.current;
      const toArchive = current.filter((entry) => ids.includes(entry.id));
      const remaining = current.filter((entry) => !ids.includes(entry.id));
      try {
        const { archive: newArchive } = await archiveEntriesUtil(
          toArchive,
          archive,
          'manual'
        );
        setFenHistory(remaining);
        setArchive(newArchive);
      } catch (err) {
        logger.error('Failed to archive entries:', err);
        throw err;
      }
    },
    [archive]
  );
  const reactivateArchivedEntry = useCallback(
    async (id) => {
      try {
        const { entry, archive: newArchive } = await reactivateEntryUtil(
          id,
          archive
        );
        setArchive(newArchive);
        setFenHistory((prev) => sortByMostRecent([entry, ...prev]));
      } catch (err) {
        logger.error('Failed to reactivate entry:', err);
        throw err;
      }
    },
    [archive]
  );
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
  const clearArchiveData = useCallback(async () => {
    try {
      await clearArchiveUtil();
      setArchive([]);
    } catch (err) {
      logger.error('Failed to clear archive:', err);
      throw err;
    }
  }, []);
  const setHistoryFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);
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
}
