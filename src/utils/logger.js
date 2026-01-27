/**
 * Centralized logging utility
 */

const isDev = process.env.NODE_ENV === 'development';

const noop = () => {};

export const logger = {
  log: isDev ? console.log.bind(console) : noop,
  warn: isDev ? console.warn.bind(console) : noop,
  error: console.error.bind(console)
};
