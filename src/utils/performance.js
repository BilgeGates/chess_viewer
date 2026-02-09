/**
 * Debounce function execution.
 *
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
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
 * Throttle function execution.
 *
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between executions
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
 * Throttle using requestAnimationFrame.
 *
 * @param {Function} callback - Function to throttle
 * @returns {Function} Throttled function with cancel method
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
 * Lazy load images with Intersection Observer.
 *
 * @param {string} selector - CSS selector for images
 * @param {Object} options - Intersection Observer options
 * @returns {Function|undefined} Cleanup function
 */
export function lazyLoadImages(selector = 'img[data-src]', options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01
  };

  const finalOptions = {};
  finalOptions.root = options.root || defaultOptions.root;
  finalOptions.rootMargin = options.rootMargin || defaultOptions.rootMargin;
  finalOptions.threshold = options.threshold || defaultOptions.threshold;

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function (
      entries,
      observer
    ) {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      }
    }, finalOptions);

    const images = document.querySelectorAll(selector);
    for (let i = 0; i < images.length; i++) {
      imageObserver.observe(images[i]);
    }

    return function cleanup() {
      for (let i = 0; i < images.length; i++) {
        imageObserver.unobserve(images[i]);
      }
    };
  }

  const images = document.querySelectorAll(selector);
  for (let i = 0; i < images.length; i++) {
    const src = images[i].getAttribute('data-src');
    if (src) {
      images[i].src = src;
      images[i].removeAttribute('data-src');
    }
  }
}

/**
 * Preload critical resources.
 *
 * @param {string[]} urls - URLs to preload
 * @param {string} as - Resource type
 */
export function preloadResources(urls, as = 'image') {
  for (let i = 0; i < urls.length; i++) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = urls[i];
    document.head.appendChild(link);
  }
}

/**
 * Check if element is in viewport.
 *
 * @param {HTMLElement} element - DOM element
 * @returns {boolean} True if fully visible
 */
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const isVerticallyVisible = rect.top >= 0 && rect.bottom <= windowHeight;
  const isHorizontallyVisible = rect.left >= 0 && rect.right <= windowWidth;

  return isVerticallyVisible && isHorizontallyVisible;
}

/**
 * Memoize function results.
 *
 * @param {Function} fn - Function to memoize
 * @returns {Function} Memoized function
 */
export function memoize(fn) {
  const cache = new Map();

  return function memoized(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Batch DOM read/write operations.
 */
export class DOMBatcher {
  constructor() {
    this.reads = [];
    this.writes = [];
    this.scheduled = false;
  }

  /**
   * Add read operation.
   *
   * @param {Function} callback - Read callback
   */
  read(callback) {
    this.reads.push(callback);
    this.schedule();
  }

  /**
   * Add write operation.
   *
   * @param {Function} callback - Write callback
   */
  write(callback) {
    this.writes.push(callback);
    this.schedule();
  }

  /**
   * Schedule batch execution.
   */
  schedule() {
    if (this.scheduled) {
      return;
    }
    this.scheduled = true;

    const self = this;
    requestAnimationFrame(function () {
      for (let i = 0; i < self.reads.length; i++) {
        self.reads[i]();
      }
      self.reads = [];

      for (let i = 0; i < self.writes.length; i++) {
        self.writes[i]();
      }
      self.writes = [];

      self.scheduled = false;
    });
  }
}
