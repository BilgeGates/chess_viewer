import { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '@/utils/logger';

/**
 * localStorage hook with debounced writes to prevent main-thread blocking.
 *
 * @template T
 * @param {string} key - localStorage key
 * @param {T} initialValue - Default value when key is absent
 * @returns {[T, Function]} Stored value and setter function
 */
export const useLocalStorage = (key, initialValue) => {
  const debounceTimeoutRef = useRef(null);
  const pendingValueRef = useRef(null);

  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  /**
   * Write a value to localStorage after a 300 ms debounce.
   *
   * @param {string} key - localStorage key
   * @param {*} value - Value to persist
   */
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
          // Dispatch storage event to notify other components (same tab)
          window.dispatchEvent(new Event('storage'));
        } catch (storageError) {
          if (storageError.name === 'QuotaExceededError') {
            logger.warn(
              `localStorage quota exceeded for key: ${key}. Clearing old data.`
            );
            try {
              const keys = Object.keys(window.localStorage);
              if (keys.length > 0) {
                window.localStorage.removeItem(keys[0]);
                window.localStorage.setItem(key, JSON.stringify(value));
                window.dispatchEvent(new Event('storage'));
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
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
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

  /**
   * Update the stored value and persist it to localStorage.
   * Accepts a value or a function (same API as useState).
   *
   * @param {T | function(T): T} value - New value or updater function
   */
  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);
        debouncedWrite(key, valueToStore);
      } catch (error) {
        logger.error(`Error in setValue for ${key}:`, error);
      }
    },
    [storedValue, key, debouncedWrite]
  );

  return [storedValue, setValue];
};

/**
 * localStorage hook with optional cloud storage (window.storage) integration.
 *
 * @template T
 * @param {string} key - Storage key
 * @param {T} initialValue - Default value when key is absent
 * @param {boolean} [useCloudStorage=false] - Whether to also read/write window.storage
 * @returns {[T, Function, boolean]} Stored value, async setter, and loading flag
 */
export const useHybridStorage = (
  key,
  initialValue,
  useCloudStorage = false
) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);

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

  /**
   * Update the stored value and persist to localStorage and optionally cloud storage.
   *
   * @param {T | function(T): T} value - New value or updater function
   */
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
