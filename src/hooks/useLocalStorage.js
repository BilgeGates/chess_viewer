import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';

export const useLocalStorage = (key, initialValue) => {
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

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
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
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
              }
            } catch (retryError) {
              logger.error(
                `Failed to save ${key} even after cleanup:`,
                retryError
              );
            }
          } else {
            throw storageError;
          }
        }
      }
    } catch (error) {
      logger.error(`Error saving ${key} to localStorage:`, error);
    }
  };

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
