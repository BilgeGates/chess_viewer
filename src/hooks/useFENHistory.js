// src/hooks/useFENHistory.js
import { useState, useEffect } from 'react';
import { validateFEN } from '../utils';
import { logger } from '../utils/logger';

export const useFENHistory = (fen, onFavoriteStatusChange) => {
  const [fenHistory, setFenHistory] = useState([]);

  // Load history from storage
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const result = await window.storage.get('fen-history');
        if (result && result.value) {
          setFenHistory(JSON.parse(result.value));
          return;
        }
      } catch (err) {
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

  // Save to history whenever FEN changes (debounced)
  useEffect(() => {
    const saveToHistory = async () => {
      if (!validateFEN(fen)) return;

      setFenHistory((prevHistory) => {
        const existingItem = prevHistory.find((h) => h.fen === fen);

        let updatedHistory;
        if (existingItem) {
          updatedHistory = [
            { ...existingItem, timestamp: Date.now() },
            ...prevHistory.filter((h) => h.fen !== fen)
          ].slice(0, 50);
        } else {
          const newEntry = {
            id: Date.now(),
            fen: fen,
            timestamp: Date.now(),
            isFavorite: false
          };
          updatedHistory = [newEntry, ...prevHistory].slice(0, 50);
        }

        // Save to storage asynchronously
        const jsonData = JSON.stringify(updatedHistory);
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

        return updatedHistory;
      });
    };

    const timeoutId = setTimeout(saveToHistory, 1000);
    return () => clearTimeout(timeoutId);
  }, [fen]);

  // Check if current FEN is favorite
  useEffect(() => {
    const currentItem = fenHistory.find((h) => h.fen === fen);
    onFavoriteStatusChange?.(currentItem?.isFavorite || false);
  }, [fen, fenHistory, onFavoriteStatusChange]);

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
    addCurrentToFavorites
  };
};
