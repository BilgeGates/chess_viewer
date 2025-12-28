import { PIECE_MAP } from "../constants/chessConstants";

const svgToDataUrl = (svg) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export const CUSTOM_PIECES = {
  // White pieces
  K: svgToDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">...</svg>`
  ),
  Q: svgToDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">...</svg>`
  ),
  R: svgToDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">...</svg>`
  ),
  B: svgToDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">...</svg>`
  ),
  N: svgToDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">...</svg>`
  ),
  P: svgToDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">...</svg>`
  ),
  // Black pieces
  k: svgToDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">...</svg>`
  ),
  q: svgToDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">...</svg>`
  ),
  r: svgToDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">...</svg>`
  ),
  b: svgToDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">...</svg>`
  ),
  n: svgToDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">...</svg>`
  ),
  p: svgToDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">...</svg>`
  ),
};

export const getPieceUrl = (pieceCode, pieceStyle) => {
  if (pieceStyle === "custom-elegant") {
    return CUSTOM_PIECES[pieceCode];
  }

  const PIECE_MAP = {
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

  return `https://lichess1.org/assets/piece/${pieceStyle}/${PIECE_MAP[pieceCode]}.svg`;
};
