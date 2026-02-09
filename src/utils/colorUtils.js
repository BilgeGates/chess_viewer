/**
 * Convert HEX color string to RGB values.
 *
 * @param {string} hex - Hex color (e.g., '#ff0000')
 * @returns {Object|null} RGB object or null if invalid
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) {
    return null;
  }

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return { r: r, g: g, b: b };
}

/**
 * Convert RGB values to HEX color string.
 *
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color string
 */
export function rgbToHex(r, g, b) {
  r = Math.max(0, Math.min(255, Math.round(r)));
  g = Math.max(0, Math.min(255, Math.round(g)));
  b = Math.max(0, Math.min(255, Math.round(b)));

  let hexR = r.toString(16);
  let hexG = g.toString(16);
  let hexB = b.toString(16);

  if (hexR.length === 1) {
    hexR = '0' + hexR;
  }
  if (hexG.length === 1) {
    hexG = '0' + hexG;
  }
  if (hexB.length === 1) {
    hexB = '0' + hexB;
  }

  return '#' + hexR + hexG + hexB;
}

/**
 * Convert RGB to HSL (Hue, Saturation, Lightness).
 *
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {Object} HSL values
 */
export function rgbToHsl(r, g, b) {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;

    if (l > 0.5) {
      s = d / (2 - max - min);
    } else {
      s = d / (max + min);
    }

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
    h = h / 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Convert hue channel to RGB channel value.
 *
 * @param {number} p - Base value
 * @param {number} q - Peak value
 * @param {number} t - Hue offset
 * @returns {number} RGB channel value
 */
function hueToRgbChannel(p, q, t) {
  if (t < 0) {
    t = t + 1;
  }
  if (t > 1) {
    t = t - 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
}

/**
 * Convert HSL to RGB.
 *
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {Object} RGB values
 */
export function hslToRgb(h, s, l) {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  let r, g, b;

  if (s === 0) {
    r = l;
    g = l;
    b = l;
  } else {
    let q;
    if (l < 0.5) {
      q = l * (1 + s);
    } else {
      q = l + s - l * s;
    }
    const p = 2 * l - q;

    r = hueToRgbChannel(p, q, h + 1 / 3);
    g = hueToRgbChannel(p, q, h);
    b = hueToRgbChannel(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Convert RGB to HSV (Hue, Saturation, Value).
 *
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {Object} HSV values
 */
export function rgbToHsv(r, g, b) {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const v = max;
  const d = max - min;

  let s = 0;
  if (max !== 0) {
    s = d / max;
  }

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
    h = h / 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

/**
 * Convert HSV to RGB.
 *
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} v - Value (0-100)
 * @returns {Object} RGB values
 */
export function hsvToRgb(h, s, v) {
  h = h / 360;
  s = s / 100;
  v = v / 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r, g, b;

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
    default:
      r = v;
      g = v;
      b = v;
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Lighten color by increasing lightness.
 *
 * @param {string} hex - Hex color string
 * @param {number} amount - Amount to lighten (0-100)
 * @returns {string} Lightened hex color
 */
export function lighten(hex, amount) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return hex;
  }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = Math.min(100, hsl.l + amount);

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Darken color by decreasing lightness.
 *
 * @param {string} hex - Hex color string
 * @param {number} amount - Amount to darken (0-100)
 * @returns {string} Darkened hex color
 */
export function darken(hex, amount) {
  return lighten(hex, -amount);
}

/**
 * Adjust color brightness by percentage.
 *
 * @param {string} hex - Hex color string
 * @param {number} percent - Percentage adjustment (-100 to 100)
 * @returns {string} Adjusted hex color
 */
export function adjustBrightness(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);

  const R = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0xff) + amt));

  return rgbToHex(R, G, B);
}

/**
 * Get complementary color.
 *
 * @param {string} hex - Hex color string
 * @returns {string} Complementary hex color
 */
export function getComplementary(hex) {
  const num = parseInt(hex.slice(1), 16);

  const r = 255 - ((num >> 16) & 0xff);
  const g = 255 - ((num >> 8) & 0xff);
  const b = 255 - (num & 0xff);

  return rgbToHex(r, g, b);
}

/**
 * Calculate relative luminance of color.
 *
 * @param {string} hex - Hex color string
 * @returns {number} Relative luminance (0-1)
 */
export function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return 0;
  }

  const channels = [rgb.r, rgb.g, rgb.b];
  const linearChannels = [];

  for (let i = 0; i < channels.length; i++) {
    let val = channels[i] / 255;
    if (val <= 0.03928) {
      val = val / 12.92;
    } else {
      val = Math.pow((val + 0.055) / 1.055, 2.4);
    }
    linearChannels.push(val);
  }

  return (
    0.2126 * linearChannels[0] +
    0.7152 * linearChannels[1] +
    0.0722 * linearChannels[2]
  );
}

/**
 * Calculate contrast ratio between two colors.
 *
 * @param {string} hex1 - First hex color
 * @param {string} hex2 - Second hex color
 * @returns {number} Contrast ratio (1-21)
 */
export function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Check if colors have sufficient contrast for accessibility.
 *
 * @param {string} hex1 - First hex color
 * @param {string} hex2 - Second hex color
 * @param {string} level - WCAG level ('AA' or 'AAA')
 * @returns {boolean} True if contrast is sufficient
 */
export function hasGoodContrast(hex1, hex2, level = 'AA') {
  const ratio = getContrastRatio(hex1, hex2);

  let minimumRatio = 4.5;
  if (level === 'AAA') {
    minimumRatio = 7;
  }

  return ratio >= minimumRatio;
}

/**
 * Generate color palette from base color.
 *
 * @param {string} baseColor - Base hex color
 * @param {number} count - Number of colors to generate
 * @returns {string[]} Array of hex colors
 */
export function generatePalette(baseColor, count = 5) {
  const rgb = hexToRgb(baseColor);
  if (!rgb) {
    return [baseColor];
  }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const palette = [];
  const step = 100 / (count + 1);

  for (let i = 1; i <= count; i++) {
    const newLightness = Math.min(95, step * i);
    const newRgb = hslToRgb(hsl.h, hsl.s, newLightness);
    palette.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return palette;
}

/**
 * Generate analogous colors.
 *
 * @param {string} hex - Base hex color
 * @param {number} angle - Separation angle in degrees
 * @returns {string[]} Array of 3 hex colors
 */
export function getAnalogous(hex, angle = 30) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return [hex];
  }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const offsets = [-angle, 0, angle];
  const colors = [];

  for (let i = 0; i < offsets.length; i++) {
    const newHue = (hsl.h + offsets[i] + 360) % 360;
    const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return colors;
}

/**
 * Generate triadic colors.
 *
 * @param {string} hex - Base hex color
 * @returns {string[]} Array of 3 hex colors
 */
export function getTriadic(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return [hex];
  }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const offsets = [0, 120, 240];
  const colors = [];

  for (let i = 0; i < offsets.length; i++) {
    const newHue = (hsl.h + offsets[i]) % 360;
    const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return colors;
}

/**
 * Generate random hex color.
 *
 * @returns {string} Random hex color
 */
export function randomColor() {
  const randomNum = Math.floor(Math.random() * 16777215);

  let hexString = randomNum.toString(16);
  while (hexString.length < 6) {
    hexString = '0' + hexString;
  }

  return '#' + hexString;
}

/**
 * Check if string is valid hex color.
 *
 * @param {string} hex - String to check
 * @returns {boolean} True if valid hex color
 */
export function isValidHex(hex) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

/**
 * Normalize hex color string.
 *
 * @param {string} color - Color string
 * @returns {string} Normalized hex color
 */
export function normalizeHex(color) {
  if (!color) {
    return '#000000';
  }

  let hex = color.trim();

  if (hex.charAt(0) !== '#') {
    hex = '#' + hex;
  }

  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    return '#000000';
  }

  return hex.toUpperCase();
}

/**
 * Mix two colors together.
 *
 * @param {string} hex1 - First hex color
 * @param {string} hex2 - Second hex color
 * @param {number} ratio - Mix ratio (0-1)
 * @returns {string} Mixed hex color
 */
export function mixColors(hex1, hex2, ratio = 0.5) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) {
    return hex1;
  }

  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);

  return rgbToHex(r, g, b);
}

/**
 * Get approximate color name.
 *
 * @param {string} hex - Hex color
 * @returns {string} Approximate color name
 */
export function getColorName(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return 'Unknown';
  }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  if (hsl.l < 10) {
    return 'Black';
  }
  if (hsl.l > 90) {
    return 'White';
  }
  if (hsl.s < 10) {
    return 'Gray';
  }

  const hue = hsl.h;
  if (hue < 15 || hue >= 345) {
    return 'Red';
  }
  if (hue < 45) {
    return 'Orange';
  }
  if (hue < 75) {
    return 'Yellow';
  }
  if (hue < 165) {
    return 'Green';
  }
  if (hue < 195) {
    return 'Cyan';
  }
  if (hue < 255) {
    return 'Blue';
  }
  if (hue < 285) {
    return 'Purple';
  }
  return 'Pink';
}
