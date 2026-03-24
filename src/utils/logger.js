const isDevelopment = import.meta.env.DEV;

/**
 * @param {...*} args
 */
function log(...args) {
  if (isDevelopment) console.log(...args);
}

/**
 * @param {...*} args
 */
function warn(...args) {
  if (isDevelopment) console.warn(...args);
}

/**
 * @param {...*} args
 */
function error(...args) {
  if (isDevelopment) console.error(...args);
}

/** Dev-only logger. All methods are no-ops in production. */
export const logger = { log, warn, error };
