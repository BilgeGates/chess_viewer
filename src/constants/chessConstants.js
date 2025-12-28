export const PIECE_MAP = {
  K: "wK",
  Q: "wQ",
  R: "wR",
  B: "wB",
  N: "wN",
  P: "wP",
  k: "bK",
  q: "bQ",
  r: "bR",
  b: "bB",
  n: "bN",
  p: "bP",
};

export const THEMES = {
  classic: { light: "#f0d9b5", dark: "#b58863" },
  green: { light: "#ffffdd", dark: "#86a666" },
  blue: { light: "#dee3e6", dark: "#8ca2ad" },
  purple: { light: "#e8c9d0", dark: "#b08ba2" },
  wood: { light: "#f0d0a0", dark: "#8b6f47" },
  marble: { light: "#e8e8e8", dark: "#999999" },
};

export const PIECE_STYLES = [
  "cburnett",
  "merida",
  "reillycraig",
  "pirouetti",
  "chessnut",
  "kosal",
  "fresca",
  "alpha",
  "cardinal",
];

export const CANVAS_CONFIG = {
  DISPLAY_SCALE: 4, // High quality display
  MIN_BOARD_SIZE: 200,
  MAX_BOARD_SIZE: 600,
  BORDER_SIZE: 3,
};

// PIXEL DENSITY OPTIONS
export const EXPORT_QUALITY_OPTIONS = [
  { value: 1, label: "Normal (1x)", description: "Sürətli, kiçik fayl" },
  { value: 2, label: "Yüksək (2x)", description: "Tövsiyə edilir" },
  { value: 3, label: "Ultra (3x)", description: "Professional" },
  { value: 4, label: "Maximum (4x)", description: "Print keyfiyyəti" },
];
