/**
 * Centralized error handling utility
 * Provides consistent error handling patterns across the application
 */

import { logger } from './logger';

/**
 * Error types for categorization
 */
export const ErrorTypes = {
  VALIDATION: 'VALIDATION',
  NETWORK: 'NETWORK',
  CANVAS: 'CANVAS',
  STORAGE: 'STORAGE',
  CLIPBOARD: 'CLIPBOARD',
  EXPORT: 'EXPORT',
  UNKNOWN: 'UNKNOWN'
};

/**
 * User-friendly error messages
 */
const userFriendlyMessages = {
  [ErrorTypes.VALIDATION]: 'Invalid input provided',
  [ErrorTypes.NETWORK]: 'Network error occurred. Please check your connection',
  [ErrorTypes.CANVAS]: 'Failed to render the board',
  [ErrorTypes.STORAGE]: 'Failed to save data locally',
  [ErrorTypes.CLIPBOARD]: 'Clipboard operation failed',
  [ErrorTypes.EXPORT]: 'Export operation failed',
  [ErrorTypes.UNKNOWN]: 'An unexpected error occurred'
};

/**
 * Determine error type from error object
 * @param {Error} error - The error object
 * @returns {string} Error type
 */
const getErrorType = (error) => {
  if (!error) return ErrorTypes.UNKNOWN;

  const message = error.message?.toLowerCase() || '';

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('timeout')
  ) {
    return ErrorTypes.NETWORK;
  }
  if (message.includes('canvas') || message.includes('context')) {
    return ErrorTypes.CANVAS;
  }
  if (message.includes('storage') || message.includes('quota')) {
    return ErrorTypes.STORAGE;
  }
  if (message.includes('clipboard')) {
    return ErrorTypes.CLIPBOARD;
  }
  if (message.includes('export') || message.includes('download')) {
    return ErrorTypes.EXPORT;
  }
  if (message.includes('invalid') || message.includes('validation')) {
    return ErrorTypes.VALIDATION;
  }

  return ErrorTypes.UNKNOWN;
};

/**
 * Get user-friendly message for an error
 * @param {Error} error - The error object
 * @param {string} [customMessage] - Optional custom message
 * @returns {string} User-friendly message
 */
export const getUserFriendlyMessage = (error, customMessage) => {
  if (customMessage) return customMessage;

  const errorType = getErrorType(error);
  return (
    userFriendlyMessages[errorType] || userFriendlyMessages[ErrorTypes.UNKNOWN]
  );
};

/**
 * Handle error with logging and optional notification
 * @param {Error} error - The error object
 * @param {string} context - Context where error occurred
 * @param {Object} options - Options
 * @param {Function} [options.onNotification] - Notification callback
 * @param {string} [options.customMessage] - Custom user message
 * @param {boolean} [options.silent] - Don't show notification
 * @returns {Object} Error info object
 */
export const handleError = (error, context, options = {}) => {
  const { onNotification, customMessage, silent = false } = options;

  const errorInfo = {
    message: error?.message || 'Unknown error',
    context,
    type: getErrorType(error),
    timestamp: new Date().toISOString(),
    stack: error?.stack
  };

  // Log error (development only via logger)
  logger.error(`Error in ${context}:`, errorInfo);

  // Show user notification if callback provided
  if (!silent && onNotification) {
    const userMessage = getUserFriendlyMessage(error, customMessage);
    onNotification(userMessage, 'error');
  }

  return errorInfo;
};

/**
 * Wrap async function with error handling
 * @param {Function} fn - Async function to wrap
 * @param {string} context - Context for error logging
 * @param {Object} options - Error handling options
 * @returns {Function} Wrapped function
 */
export const withErrorHandling = (fn, context, options = {}) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context, options);
      throw error;
    }
  };
};

/**
 * Try-catch wrapper that returns result or error
 * @param {Function} fn - Function to execute
 * @param {string} context - Context for error logging
 * @returns {Object} { result, error }
 */
export const tryCatch = async (fn, context) => {
  try {
    const result = await fn();
    return { result, error: null };
  } catch (error) {
    logger.error(`Error in ${context}:`, error);
    return { result: null, error };
  }
};

const errorHandler = {
  ErrorTypes,
  handleError,
  getUserFriendlyMessage,
  withErrorHandling,
  tryCatch
};

export default errorHandler;
