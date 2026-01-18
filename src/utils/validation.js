/**
 * Validation and sanitization utilities
 */

/**
 * Sanitize file name to remove invalid characters
 * @param {string} fileName - Raw file name
 * @returns {string} - Sanitized file name
 */
export const sanitizeFileName = (fileName) => {
  if (!fileName || typeof fileName !== 'string') {
    return 'chess-position';
  }

  // Remove or replace invalid characters for file systems
  // Windows: \ / : * ? " < > |
  // Also trim whitespace and limit length
  let sanitized = fileName
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '_')
    .replace(/^\.+/, '') // Remove leading dots
    .replace(/\.+$/, '') // Remove trailing dots
    .trim();

  // Limit length to 100 characters
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }

  // Ensure we have a valid name
  if (!sanitized || sanitized.length === 0) {
    return 'chess-position';
  }

  return sanitized;
};

/**
 * Validate numeric input within range
 * @param {number|string} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} defaultValue - Default value if invalid
 * @returns {number} - Valid number
 */
export const validateNumber = (value, min, max, defaultValue) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num) || !isFinite(num)) {
    return defaultValue;
  }

  return Math.max(min, Math.min(max, num));
};

/**
 * Validate board size (in cm)
 * @param {number} size - Board size
 * @returns {number} - Valid board size
 */
export const validateBoardSize = (size) => {
  return validateNumber(size, 4, 100, 8); // 4cm to 100cm, default 8cm
};

/**
 * Validate export quality
 * @param {number} quality - Export quality multiplier
 * @returns {number} - Valid quality
 */
export const validateExportQuality = (quality) => {
  return validateNumber(quality, 1, 32, 16); // 1x to 32x, default 16x
};

/**
 * Validate hex color
 * @param {string} color - Hex color string
 * @returns {boolean} - True if valid hex color
 */
export const isValidHexColor = (color) => {
  if (!color || typeof color !== 'string') {
    return false;
  }
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};

/**
 * Sanitize hex color with fallback
 * @param {string} color - Color to sanitize
 * @param {string} fallback - Fallback color
 * @returns {string} - Valid hex color
 */
export const sanitizeHexColor = (color, fallback = '#ffffff') => {
  return isValidHexColor(color) ? color : fallback;
};

/**
 * Validate FEN string format (basic check)
 * @param {string} fen - FEN string
 * @returns {boolean} - True if FEN appears valid
 */
export const isValidFENFormat = (fen) => {
  if (!fen || typeof fen !== 'string') {
    return false;
  }

  const trimmed = fen.trim();

  // Basic FEN structure check
  const parts = trimmed.split(/\s+/);
  if (parts.length < 1 || parts.length > 6) {
    return false;
  }

  // Check piece placement (first part)
  const position = parts[0];
  const ranks = position.split('/');

  if (ranks.length !== 8) {
    return false;
  }

  // Check each rank
  for (const rank of ranks) {
    let count = 0;
    for (const char of rank) {
      if (/[1-8]/.test(char)) {
        count += parseInt(char, 10);
      } else if (/[pnbrqkPNBRQK]/.test(char)) {
        count++;
      } else {
        return false; // Invalid character
      }
    }
    if (count !== 8) {
      return false; // Rank doesn't have 8 squares
    }
  }

  return true;
};

/**
 * Sanitize string input to prevent XSS
 * @param {string} input - Raw input
 * @param {number} maxLength - Maximum length
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input, maxLength = 500) => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove potentially dangerous characters
  let sanitized = input
    .replace(/[<>'"]/g, '') // Remove HTML-like characters
    .trim();

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
};

/**
 * Validate and sanitize piece style name
 * @param {string} style - Piece style name
 * @param {string[]} validStyles - Array of valid style names
 * @param {string} defaultStyle - Default style
 * @returns {string} - Valid style name
 */
export const validatePieceStyle = (
  style,
  validStyles,
  defaultStyle = 'cburnett'
) => {
  if (!style || typeof style !== 'string') {
    return defaultStyle;
  }

  const sanitized = sanitizeInput(style, 50);

  return validStyles.includes(sanitized) ? sanitized : defaultStyle;
};
