/**
 * Sanitize file name by removing invalid characters.
 *
 * @param {string} fileName - Raw file name
 * @returns {string} Safe file name
 */
export function sanitizeFileName(fileName) {
  if (!fileName || typeof fileName !== 'string') {
    return 'chess-position';
  }

  let sanitized = fileName.replace(/[\\/:*?"<>|]/g, '-');
  sanitized = sanitized.replace(/\s+/g, '_');
  sanitized = sanitized.replace(/^\.+/, '');
  sanitized = sanitized.replace(/\.+$/, '');
  sanitized = sanitized.trim();

  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }

  if (!sanitized || sanitized.length === 0) {
    return 'chess-position';
  }

  return sanitized;
}

/**
 * Validate and clamp number within range.
 *
 * @param {*} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} defaultValue - Default if invalid
 * @returns {number} Valid number
 */
export function validateNumber(value, min, max, defaultValue) {
  const num = parseFloat(value);

  if (isNaN(num) || !isFinite(num)) {
    return defaultValue;
  }

  if (num < min) {
    return min;
  }
  if (num > max) {
    return max;
  }

  return num;
}

/**
 * Validate board size in centimeters.
 *
 * @param {number} size - Board size in cm
 * @returns {number} Valid board size (4-100cm)
 */
export function validateBoardSize(size) {
  return validateNumber(size, 4, 100, 8);
}

/**
 * Validate export quality multiplier.
 *
 * @param {number} quality - Quality multiplier
 * @returns {number} Valid quality (1-32x)
 */
export function validateExportQuality(quality) {
  return validateNumber(quality, 1, 32, 16);
}

/**
 * Check if string is valid hex color.
 *
 * @param {string} color - Color string
 * @returns {boolean} True if valid hex color
 */
export function isValidHexColor(color) {
  if (!color || typeof color !== 'string') {
    return false;
  }

  const hexPattern = /^#[0-9A-Fa-f]{6}$/;
  return hexPattern.test(color);
}

/**
 * Sanitize hex color with fallback.
 *
 * @param {string} color - Color to check
 * @param {string} fallback - Fallback color
 * @returns {string} Valid hex color
 */
export function sanitizeHexColor(color, fallback = '#ffffff') {
  if (isValidHexColor(color)) {
    return color;
  }
  return fallback;
}

/**
 * Validate FEN string format.
 *
 * @param {string} fen - FEN string
 * @returns {boolean} True if valid format
 */
export function isValidFENFormat(fen) {
  if (!fen || typeof fen !== 'string') {
    return false;
  }

  const trimmed = fen.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length < 1 || parts.length > 6) {
    return false;
  }

  const position = parts[0];
  const ranks = position.split('/');

  if (ranks.length !== 8) {
    return false;
  }

  for (let rankIndex = 0; rankIndex < ranks.length; rankIndex++) {
    const rank = ranks[rankIndex];
    let squareCount = 0;

    for (let charIndex = 0; charIndex < rank.length; charIndex++) {
      const char = rank[charIndex];

      if (/[1-8]/.test(char)) {
        squareCount = squareCount + parseInt(char, 10);
      } else if (/[pnbrqkPNBRQK]/.test(char)) {
        squareCount = squareCount + 1;
      } else {
        return false;
      }
    }

    if (squareCount !== 8) {
      return false;
    }
  }

  return true;
}

/**
 * Sanitize user input.
 *
 * @param {string} input - Raw user input
 * @param {number} maxLength - Maximum length
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input, maxLength = 500) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input.replace(/[<>'"]/g, '');
  sanitized = sanitized.trim();

  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Validate piece style name.
 *
 * @param {string} style - Style name
 * @param {string[]} validStyles - Array of valid styles
 * @param {string} defaultStyle - Default style
 * @returns {string} Valid style name
 */
export function validatePieceStyle(
  style,
  validStyles,
  defaultStyle = 'cburnett'
) {
  if (!style || typeof style !== 'string') {
    return defaultStyle;
  }

  const sanitized = sanitizeInput(style, 50);

  let isValid = false;
  for (let i = 0; i < validStyles.length; i++) {
    if (validStyles[i] === sanitized) {
      isValid = true;
      break;
    }
  }

  if (isValid) {
    return sanitized;
  }

  return defaultStyle;
}
