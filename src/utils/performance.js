/**
 * Performance Utilities
 * Helper functions for optimizing React components
 */

/**
 * Debounce function - delays execution until after wait time
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function - limits execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Request Animation Frame wrapper for smooth animations
 * @param {Function} callback - Function to execute
 * @returns {number} - Request ID
 */
export const rafThrottle = (callback) => {
  let requestId = null;
  let lastArgs;

  const later = (context) => () => {
    requestId = null;
    callback.apply(context, lastArgs);
  };

  const throttled = function (...args) {
    lastArgs = args;
    if (requestId === null) {
      requestId = requestAnimationFrame(later(this));
    }
  };

  throttled.cancel = () => {
    cancelAnimationFrame(requestId);
    requestId = null;
  };

  return throttled;
};

/**
 * Lazy load images with Intersection Observer
 * @param {string} selector - CSS selector for images
 * @param {object} options - Intersection Observer options
 */
export const lazyLoadImages = (selector = 'img[data-src]', options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options
  };

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    }, defaultOptions);

    const images = document.querySelectorAll(selector);
    images.forEach((img) => imageObserver.observe(img));

    return () => images.forEach((img) => imageObserver.unobserve(img));
  }

  // Fallback for browsers without Intersection Observer
  const images = document.querySelectorAll(selector);
  images.forEach((img) => {
    const src = img.getAttribute('data-src');
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
    }
  });
};

/**
 * Preload critical resources
 * @param {Array<string>} urls - Array of resource URLs
 * @param {string} as - Resource type (image, script, style, font)
 */
export const preloadResources = (urls, as = 'image') => {
  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - DOM element
 * @returns {boolean} - True if in viewport
 */
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Memoize expensive function results
 * @param {Function} fn - Function to memoize
 * @returns {Function} - Memoized function
 */
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Batch DOM reads and writes for better performance
 */
export class DOMBatcher {
  constructor() {
    this.reads = [];
    this.writes = [];
    this.scheduled = false;
  }

  read(callback) {
    this.reads.push(callback);
    this.schedule();
  }

  write(callback) {
    this.writes.push(callback);
    this.schedule();
  }

  schedule() {
    if (this.scheduled) return;
    this.scheduled = true;

    requestAnimationFrame(() => {
      // Execute all reads first
      this.reads.forEach((read) => read());
      this.reads = [];

      // Then execute all writes
      this.writes.forEach((write) => write());
      this.writes = [];

      this.scheduled = false;
    });
  }
}
