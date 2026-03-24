/**
 * Returns a debounced version of a function.
 *
 * @param {Function} func - Function to debounce
 * @param {number} [wait=300] - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function debouncedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func(...args);
    }, wait);
  };
}
/**
 * Returns a throttled version of a function.
 *
 * @param {Function} func - Function to throttle
 * @param {number} [limit=300] - Minimum interval in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 300) {
  let inThrottle = false;
  return function throttledFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(function () {
        inThrottle = false;
      }, limit);
    }
  };
}
/**
 * Returns a requestAnimationFrame-throttled version of a callback.
 * The returned function exposes a `.cancel()` method.
 *
 * @param {Function} callback
 * @returns {Function & { cancel: Function }}
 */
export function rafThrottle(callback) {
  let requestId = null;
  let lastArgs;
  function throttled(...args) {
    lastArgs = args;
    if (requestId === null) {
      requestId = requestAnimationFrame(function () {
        requestId = null;
        callback.apply(null, lastArgs);
      });
    }
  }
  throttled.cancel = function () {
    cancelAnimationFrame(requestId);
    requestId = null;
  };
  return throttled;
}
/**
 * Returns a memoized version of a function using JSON-key caching.
 * Cache is limited to 100 entries to prevent memory leaks.
 *
 * @param {Function} fn
 * @returns {Function}
 */
export function memoize(fn) {
  const cache = new Map();
  const MAX_CACHE_SIZE = 100;
  return function memoized(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    if (cache.size >= MAX_CACHE_SIZE) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    cache.set(key, result);
    return result;
  };
}
