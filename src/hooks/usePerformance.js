import { useEffect, useRef, useCallback } from 'react';

/**
 * useDebounce - Debounce a callback function
 *
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const useDebounce = (callback, delay = 300) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * useIdleCallback - Execute callback during browser idle time
 *
 * @param {Function} callback - Function to execute during idle
 * @param {Array} deps - Dependencies array
 */
export const useIdleCallback = (callback, deps = []) => {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const idleCallbackId = requestIdleCallback(() => {
        callback();
      });

      return () => {
        cancelIdleCallback(idleCallbackId);
      };
    } else {
      // Fallback for browsers without requestIdleCallback
      const timeoutId = setTimeout(callback, 100);
      return () => clearTimeout(timeoutId);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useDebounce;
