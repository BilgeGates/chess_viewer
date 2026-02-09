const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Logs informational messages in development mode.
 *
 * @param {...any} args - Arguments to log
 */
function log(...args) {
  if (isDevelopment) {
    console.log(...args);
  }
}

/**
 * Logs warning messages in development mode.
 *
 * @param {...any} args - Arguments to log
 */
function warn(...args) {
  if (isDevelopment) {
    console.warn(...args);
  }
}

/**
 * Logs error messages in development mode.
 *
 * @param {...any} args - Arguments to log
 */
function error(...args) {
  if (isDevelopment) {
    console.error(...args);
  }
}

export const logger = {
  log,
  warn,
  error
};
