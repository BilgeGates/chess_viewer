import { logger } from './logger';

export const ErrorTypes = {
  VALIDATION: 'VALIDATION',
  NETWORK: 'NETWORK',
  CANVAS: 'CANVAS',
  STORAGE: 'STORAGE',
  CLIPBOARD: 'CLIPBOARD',
  EXPORT: 'EXPORT',
  UNKNOWN: 'UNKNOWN'
};

const USER_FRIENDLY_MESSAGES = {
  [ErrorTypes.VALIDATION]: 'Invalid input provided',
  [ErrorTypes.NETWORK]: 'Network error occurred. Please check your connection',
  [ErrorTypes.CANVAS]: 'Failed to render the board',
  [ErrorTypes.STORAGE]: 'Failed to save data locally',
  [ErrorTypes.CLIPBOARD]: 'Clipboard operation failed',
  [ErrorTypes.EXPORT]: 'Export operation failed',
  [ErrorTypes.UNKNOWN]: 'An unexpected error occurred'
};

/**
 * Determines error type from error message.
 *
 * @param {Error} error - Error object
 * @returns {string} Error type constant
 */
function getErrorType(error) {
  if (!error) {
    return ErrorTypes.UNKNOWN;
  }

  const message = error.message ? error.message.toLowerCase() : '';

  if (
    message.indexOf('network') !== -1 ||
    message.indexOf('fetch') !== -1 ||
    message.indexOf('timeout') !== -1
  ) {
    return ErrorTypes.NETWORK;
  }

  if (message.indexOf('canvas') !== -1 || message.indexOf('context') !== -1) {
    return ErrorTypes.CANVAS;
  }

  if (message.indexOf('storage') !== -1 || message.indexOf('quota') !== -1) {
    return ErrorTypes.STORAGE;
  }

  if (message.indexOf('clipboard') !== -1) {
    return ErrorTypes.CLIPBOARD;
  }

  if (message.indexOf('export') !== -1 || message.indexOf('download') !== -1) {
    return ErrorTypes.EXPORT;
  }

  if (
    message.indexOf('invalid') !== -1 ||
    message.indexOf('validation') !== -1
  ) {
    return ErrorTypes.VALIDATION;
  }

  return ErrorTypes.UNKNOWN;
}

/**
 * Gets user-friendly error message.
 *
 * @param {Error} error - Error object
 * @param {string} customMessage - Custom message override
 * @returns {string} User-friendly message
 */
export function getUserFriendlyMessage(error, customMessage) {
  if (customMessage) {
    return customMessage;
  }

  const errorType = getErrorType(error);
  return (
    USER_FRIENDLY_MESSAGES[errorType] ||
    USER_FRIENDLY_MESSAGES[ErrorTypes.UNKNOWN]
  );
}

/**
 * Handles error with logging and notification.
 *
 * @param {Error} error - Error object
 * @param {string} context - Error context
 * @param {Object} options - Handling options
 * @param {Function} options.onNotification - Notification callback
 * @param {string} options.customMessage - Custom message override
 * @param {boolean} options.silent - Suppress notifications
 * @returns {Object} Error info object
 */
export function handleError(error, context, options = {}) {
  const { onNotification, customMessage, silent = false } = options;

  const errorInfo = {
    message: error && error.message ? error.message : 'Unknown error',
    context: context,
    type: getErrorType(error),
    timestamp: new Date().toISOString(),
    stack: error ? error.stack : undefined
  };

  logger.error('Error in ' + context + ':', errorInfo);

  if (!silent && onNotification) {
    const userMessage = getUserFriendlyMessage(error, customMessage);
    onNotification(userMessage, 'error');
  }

  return errorInfo;
}

/**
 * Wraps async function with error handling.
 *
 * @param {Function} fn - Function to wrap
 * @param {string} context - Function context
 * @param {Object} options - Handling options
 * @returns {Function} Wrapped function
 */
export function withErrorHandling(fn, context, options = {}) {
  return async function wrappedFunction(...args) {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context, options);
      throw error;
    }
  };
}

/**
 * Tries function and returns result or error.
 *
 * @param {Function} fn - Function to try
 * @param {string} context - Function context
 * @returns {Promise<Object>} Result or error object
 */
export async function tryCatch(fn, context) {
  try {
    const result = await fn();
    return { result, error: null };
  } catch (error) {
    logger.error('Error in ' + context + ':', error);
    return { result: null, error };
  }
}

const errorHandler = {
  ErrorTypes,
  handleError,
  getUserFriendlyMessage,
  withErrorHandling,
  tryCatch
};

export default errorHandler;
