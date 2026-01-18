/**
 * Color Utilities
 * Functions for color manipulation, conversion, and analysis
 */

/**
 * Convert HEX to RGB
 * @param {string} hex - Hex color (e.g., '#ff0000')
 * @returns {Object|null} - {r, g, b} or null if invalid
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
};

/**
 * Convert RGB to HEX
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} - Hex color
 */
export const rgbToHex = (r, g, b) => {
  r = Math.max(0, Math.min(255, Math.round(r)));
  g = Math.max(0, Math.min(255, Math.round(g)));
  b = Math.max(0, Math.min(255, Math.round(b)));

  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
};

/**
 * Convert RGB to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {Object} - {h, s, l} where h is 0-360, s and l are 0-100
 */
export const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

/**
 * Convert HSL to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {Object} - {r, g, b}
 */
export const hslToRgb = (h, s, l) => {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

/**
 * Convert RGB to HSV
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {Object} - {h, s, v} where h is 0-360, s and v are 0-100
 */
export const rgbToHsv = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
};

/**
 * Convert HSV to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} v - Value (0-100)
 * @returns {Object} - {r, g, b}
 */
export const hsvToRgb = (h, s, v) => {
  h /= 360;
  s /= 100;
  v /= 100;

  let r, g, b;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      [r, g, b] = [v, t, p];
      break;
    case 1:
      [r, g, b] = [q, v, p];
      break;
    case 2:
      [r, g, b] = [p, v, t];
      break;
    case 3:
      [r, g, b] = [p, q, v];
      break;
    case 4:
      [r, g, b] = [t, p, v];
      break;
    case 5:
      [r, g, b] = [v, p, q];
      break;
    default:
      [r, g, b] = [v, v, v];
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

/**
 * Lighten a color
 * @param {string} hex - Hex color
 * @param {number} amount - Amount to lighten (0-100)
 * @returns {string} - Lightened hex color
 */
export const lighten = (hex, amount) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = Math.min(100, hsl.l + amount);

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

/**
 * Darken a color
 * @param {string} hex - Hex color
 * @param {number} amount - Amount to darken (0-100)
 * @returns {string} - Darkened hex color
 */
export const darken = (hex, amount) => {
  return lighten(hex, -amount);
};

/**
 * Adjust color brightness
 * @param {string} hex - Hex color
 * @param {number} percent - Percent to adjust (-100 to 100)
 * @returns {string} - Adjusted hex color
 */
export const adjustBrightness = (hex, percent) => {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0xff) + amt));
  return rgbToHex(R, G, B);
};

/**
 * Get complementary color
 * @param {string} hex - Hex color
 * @returns {string} - Complementary hex color
 */
export const getComplementary = (hex) => {
  const num = parseInt(hex.slice(1), 16);
  const r = 255 - ((num >> 16) & 0xff);
  const g = 255 - ((num >> 8) & 0xff);
  const b = 255 - (num & 0xff);
  return rgbToHex(r, g, b);
};

/**
 * Get relative luminance (for WCAG contrast calculation)
 * @param {string} hex - Hex color
 * @returns {number} - Relative luminance (0-1)
 */
export const getLuminance = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    val /= 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Get contrast ratio between two colors (WCAG)
 * @param {string} hex1 - First hex color
 * @param {string} hex2 - Second hex color
 * @returns {number} - Contrast ratio (1-21)
 */
export const getContrastRatio = (hex1, hex2) => {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Math.round(ratio * 100) / 100;
};

/**
 * Check if contrast is sufficient (WCAG AA)
 * @param {string} hex1 - First hex color
 * @param {string} hex2 - Second hex color
 * @param {string} level - 'AA' or 'AAA'
 * @returns {boolean} - Whether contrast is sufficient
 */
export const hasGoodContrast = (hex1, hex2, level = 'AA') => {
  const ratio = getContrastRatio(hex1, hex2);
  const minRatio = level === 'AAA' ? 7 : 4.5;
  return ratio >= minRatio;
};

/**
 * Generate color palette from base color
 * @param {string} baseColor - Base hex color
 * @param {number} count - Number of colors to generate
 * @returns {Array<string>} - Array of hex colors
 */
export const generatePalette = (baseColor, count = 5) => {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [baseColor];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const palette = [];
  const step = 100 / (count + 1);

  for (let i = 1; i <= count; i++) {
    const newHsl = { ...hsl, l: Math.min(95, step * i) };
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    palette.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return palette;
};

/**
 * Generate analogous colors
 * @param {string} hex - Base hex color
 * @param {number} angle - Angle difference (default 30)
 * @returns {Array<string>} - Array of 3 hex colors
 */
export const getAnalogous = (hex, angle = 30) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return [hex];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const colors = [];
  for (const offset of [-angle, 0, angle]) {
    let newHue = (hsl.h + offset + 360) % 360;
    const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return colors;
};

/**
 * Generate triadic colors
 * @param {string} hex - Base hex color
 * @returns {Array<string>} - Array of 3 hex colors
 */
export const getTriadic = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return [hex];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const colors = [];
  for (const offset of [0, 120, 240]) {
    let newHue = (hsl.h + offset) % 360;
    const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return colors;
};

/**
 * Generate random color
 * @returns {string} - Random hex color
 */
export const randomColor = () => {
  return (
    '#' +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')
  );
};

/**
 * Validate hex color
 * @param {string} hex - Hex color to validate
 * @returns {boolean} - Whether valid
 */
export const isValidHex = (hex) => {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
};

/**
 * Normalize hex color (ensure # and uppercase)
 * @param {string} color - Color string
 * @returns {string} - Normalized hex color
 */
export const normalizeHex = (color) => {
  if (!color) return '#000000';
  let hex = color.trim();
  if (!hex.startsWith('#')) hex = '#' + hex;
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return '#000000';
  return hex.toUpperCase();
};

/**
 * Mix two colors
 * @param {string} hex1 - First hex color
 * @param {string} hex2 - Second hex color
 * @param {number} ratio - Mix ratio (0-1, 0.5 = 50/50)
 * @returns {string} - Mixed hex color
 */
export const mixColors = (hex1, hex2, ratio = 0.5) => {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return hex1;

  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);

  return rgbToHex(r, g, b);
};

/**
 * Get color name (approximate)
 * @param {string} hex - Hex color
 * @returns {string} - Approximate color name
 */
export const getColorName = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'Unknown';

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  if (hsl.l < 10) return 'Black';
  if (hsl.l > 90) return 'White';
  if (hsl.s < 10) return `Gray`;

  const hue = hsl.h;
  if (hue < 15 || hue >= 345) return 'Red';
  if (hue < 45) return 'Orange';
  if (hue < 75) return 'Yellow';
  if (hue < 165) return 'Green';
  if (hue < 195) return 'Cyan';
  if (hue < 255) return 'Blue';
  if (hue < 285) return 'Purple';
  return 'Pink';

  return 'Color';
};
