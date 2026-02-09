import { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '@/utils/logger';

/**
 * PERFORMANCE OPTIMIZED: useLocalStorage with debounced writes
 * Prevents main thread blocking from excessive localStorage writes
 */
export const useLocalStorage = (key, initialValue) => {
  // Debounce timeout ref
  const debounceTimeoutRef = useRef(null);
  const pendingValueRef = useRef(null);

  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Debounced write to localStorage - prevents blocking main thread
  const debouncedWrite = useCallback((key, value) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    pendingValueRef.current = value;

    debounceTimeoutRef.current = setTimeout(() => {
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
          pendingValueRef.current = null;
        } catch (storageError) {
          // Handle quota exceeded error gracefully
          if (storageError.name === 'QuotaExceededError') {
            logger.warn(
              `localStorage quota exceeded for key: ${key}. Clearing old data.`
            );
            // Try to clear some space by removing old items
            try {
              const keys = Object.keys(window.localStorage);
              if (keys.length > 0) {
                window.localStorage.removeItem(keys[0]);
                // Retry once after clearing
                window.localStorage.setItem(key, JSON.stringify(value));
              }
            } catch (retryError) {
              logger.error(
                `Failed to save ${key} even after cleanup:`,
                retryError
              );
            }
          } else {
            logger.error(`Error saving ${key} to localStorage:`, storageError);
          }
        }
      }
    }, 300); // 300ms debounce - balances responsiveness with performance
  }, []);

  // Cleanup effect to flush pending writes on unmount
  useEffect(() => {
    return () => {
      // Flush any pending write immediately on unmount
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        if (pendingValueRef.current !== null && typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(
              key,
              JSON.stringify(pendingValueRef.current)
            );
          } catch (error) {
            logger.error(`Error flushing ${key} on unmount:`, error);
          }
        }
      }
    };
  }, [key]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage (debounced).
  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save state immediately (instant UI update)
        setStoredValue(valueToStore);

        // Write to localStorage with debounce (prevents main thread blocking)
        debouncedWrite(key, valueToStore);
      } catch (error) {
        logger.error(`Error in setValue for ${key}:`, error);
      }
    },
    [storedValue, key, debouncedWrite]
  );

  return [storedValue, setValue];
};

// Advanced hook with window.storage API integration
export const useHybridStorage = (
  key,
  initialValue,
  useCloudStorage = false
) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Load from storage on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        if (useCloudStorage && window.storage) {
          // Try cloud storage first
          const result = await window.storage.get(key);
          if (result && result.value) {
            setStoredValue(JSON.parse(result.value));
            setIsLoading(false);
            return;
          }
        }

        // Fallback to localStorage
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        logger.error(`Error loading ${key}:`, error);
      }

      setIsLoading(false);
    };

    loadData();
  }, [key, useCloudStorage]);

  // Save to storage
  const setValue = async (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      const jsonValue = JSON.stringify(valueToStore);

      // Save to localStorage with quota handling
      try {
        window.localStorage.setItem(key, jsonValue);
      } catch (storageError) {
        if (storageError.name === 'QuotaExceededError') {
          logger.warn(`localStorage quota exceeded for key: ${key}`);
          // Try to clear some space
          const keys = Object.keys(window.localStorage);
          if (keys.length > 0) {
            window.localStorage.removeItem(keys[0]);
            window.localStorage.setItem(key, jsonValue);
          }
        } else {
          throw storageError;
        }
      }

      if (useCloudStorage && window.storage) {
        try {
          await window.storage.set(key, jsonValue);
        } catch (cloudError) {
          logger.warn(`Cloud storage failed for key: ${key}`, cloudError);
        }
      }
    } catch (error) {
      logger.error(`Error saving ${key}:`, error);
    }
  };

  return [storedValue, setValue, isLoading];
};
