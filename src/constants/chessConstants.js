// src/constants/chessConstants.js

// Piece mapping for Lichess assets
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

// Enhanced piece sets
export const PIECE_SETS = [
  { id: "cburnett", name: "Classic (CBurnett)" },
  { id: "merida", name: "Merida" },
  { id: "alpha", name: "Alpha" },
  { id: "cardinal", name: "Cardinal" },
  { id: "california", name: "California" },
  { id: "companion", name: "Companion" },
  { id: "dubrovny", name: "Dubrovny" },
  { id: "fantasy", name: "Fantasy" },
  { id: "fresca", name: "Fresca" },
  { id: "gioco", name: "Gioco" },
  { id: "governor", name: "Governor" },
  { id: "horsey", name: "Horsey" },
  { id: "icpieces", name: "IC Pieces" },
  { id: "kosal", name: "Kosal" },
  { id: "leipzig", name: "Leipzig" },
  { id: "letter", name: "Letter" },
  { id: "libra", name: "Libra" },
  { id: "maestro", name: "Maestro" },
  { id: "metro", name: "Metro" },
  { id: "pirouetti", name: "Pirouetti" },
  { id: "pixel", name: "Pixel" },
  { id: "reillycraig", name: "Reilly Craig" },
  { id: "riohacha", name: "Riohacha" },
  { id: "shapes", name: "Shapes" },
  { id: "spatial", name: "Spatial" },
  { id: "staunty", name: "Staunty" },
  { id: "tatiana", name: "Tatiana" },
];

// Professional board themes
export const BOARD_THEMES = {
  classic: {
    name: "Classic",
    light: "#f0d9b5",
    dark: "#b58863",
  },
  blue: {
    name: "Blue",
    light: "#dee3e6",
    dark: "#8ca2ad",
  },
  green: {
    name: "Green",
    light: "#ffffdd",
    dark: "#86a666",
  },
  brown: {
    name: "Brown",
    light: "#f0d9b5",
    dark: "#946f51",
  },
  purple: {
    name: "Purple",
    light: "#e8d5c7",
    dark: "#9f7ab9",
  },
  red: {
    name: "Red",
    light: "#ffe0c5",
    dark: "#c97866",
  },
  wood: {
    name: "Wood",
    light: "#d4af7a",
    dark: "#8b4513",
  },
  marble: {
    name: "Marble",
    light: "#e3e6e8",
    dark: "#6e7a8a",
  },
  ocean: {
    name: "Ocean",
    light: "#c9e4f5",
    dark: "#4a90a4",
  },
  slate: {
    name: "Slate",
    light: "#d0d0d0",
    dark: "#4a4a4a",
  },
  coral: {
    name: "Coral",
    light: "#ffebcd",
    dark: "#ff7f50",
  },
  mint: {
    name: "Mint",
    light: "#e0f5e9",
    dark: "#6fb98f",
  },
};

// Famous chess positions
export const FAMOUS_POSITIONS = {
  start: {
    name: "Starting Position",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    description: "Standard chess starting position",
  },
  empty: {
    name: "Empty Board",
    fen: "8/8/8/8/8/8/8/8 w - - 0 1",
    description: "Empty chessboard",
  },
};

// Export quality presets
export const QUALITY_PRESETS = [
  { value: 8, label: "Standard (8x)", description: "Good for web" },
  { value: 16, label: "High (16x)", description: "Recommended" },
  { value: 24, label: "Ultra (24x)", description: "Professional" },
  { value: 32, label: "Maximum (32x)", description: "Largest files" },
];

// Common board sizes
export const BOARD_SIZE_PRESETS = {
  small: 300,
  medium: 400,
  large: 500,
  xlarge: 600,
};
