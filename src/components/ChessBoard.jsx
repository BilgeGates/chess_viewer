import React, { useState, useEffect, useRef } from "react";

const ChessBoard = ({
  fen,
  pieceStyle,
  showCoords,
  showBorder,
  lightSquare,
  darkSquare,
  boardSize,
  flipped,
}) => {
  const canvasRef = useRef(null);
  const [pieceImages, setPieceImages] = useState({});
  const [boardState, setBoardState] = useState([]);

  const pieceMap = {
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

  // Load piece images
  useEffect(() => {
    const loadPieces = () => {
      const baseUrl = `https://lichess1.org/assets/piece/${pieceStyle}/`;
      const images = {};
      let loaded = 0;
      const total = Object.keys(pieceMap).length;

      Object.keys(pieceMap).forEach((key) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          loaded++;
          if (loaded === total) {
            setPieceImages({ ...images });
          }
        };
        img.onerror = () => {
          loaded++;
          if (loaded === total) {
            setPieceImages({ ...images });
          }
        };
        img.src = `${baseUrl}${pieceMap[key]}.svg`;
        images[key] = img;
      });
    };

    loadPieces();
  }, [pieceStyle]);

  // Parse FEN
  useEffect(() => {
    if (!fen) return;
    try {
      const parts = fen.trim().split(/\s+/);
      const position = parts[0];
      const rows = position.split("/");
      const board = [];

      for (let row of rows) {
        let boardRow = [];
        for (let char of row) {
          if (isNaN(char)) {
            boardRow.push(char);
          } else {
            boardRow.push(...Array(parseInt(char)).fill(""));
          }
        }
        board.push(boardRow);
      }
      setBoardState(board);
    } catch (e) {
      console.error("FEN parse error:", e);
    }
  }, [fen]);

  // Draw board with high quality
  useEffect(() => {
    if (!canvasRef.current || boardState.length === 0) return;
    if (Object.keys(pieceImages).length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", {
      alpha: false,
      willReadFrequently: true,
      desynchronized: true,
    });

    const borderSize = showBorder ? 8 : 0;
    const totalSize = boardSize + borderSize * 2;

    // High DPI support - use 2x for better quality
    const scale = 2;

    canvas.width = totalSize * scale;
    canvas.height = totalSize * scale;
    canvas.style.width = totalSize + "px";
    canvas.style.height = totalSize + "px";

    ctx.scale(scale, scale);

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const squareSize = boardSize / 8;

    // Draw border
    if (showBorder) {
      ctx.fillStyle = "#1e212e";
      ctx.fillRect(0, 0, totalSize, totalSize);
    }

    // Draw squares and pieces
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLight = (row + col) % 2 === 0;
        ctx.fillStyle = isLight ? lightSquare : darkSquare;
        const drawRow = flipped ? 7 - row : row;
        const drawCol = flipped ? 7 - col : col;

        ctx.fillRect(
          drawCol * squareSize + borderSize,
          drawRow * squareSize + borderSize,
          squareSize,
          squareSize
        );

        const piece = boardState[row]?.[col];
        if (piece && pieceImages[piece]) {
          const img = pieceImages[piece];
          if (img.complete && img.naturalWidth > 0) {
            const cx = drawCol * squareSize + borderSize + squareSize / 2;
            const cy = drawRow * squareSize + borderSize + squareSize / 2;

            // Draw pieces with better quality
            ctx.drawImage(
              img,
              cx - squareSize * 0.45,
              cy - squareSize * 0.45,
              squareSize * 0.9,
              squareSize * 0.9
            );
          }
        }
      }
    }

    // Draw coordinates - Chess.com style
    if (showCoords) {
      // Font size scales with board size
      const fontSize = Math.round(boardSize / 35); // Daha optimal nisbət
      const minFontSize = 8;
      const maxFontSize = 18;
      const finalFontSize = Math.max(
        minFontSize,
        Math.min(maxFontSize, fontSize)
      );

      // Padding from corner
      const padding = finalFontSize * 0.35;

      ctx.font = `bold ${finalFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
      ctx.fillStyle = "rgba(0, 0, 0, 0.85)";

      // Draw rank numbers (1-8) on LEFT-TOP corner of each square
      for (let i = 0; i < 8; i++) {
        const rank = flipped ? i + 1 : 8 - i;
        const drawRow = flipped ? 7 - i : i;
        const yPos = drawRow * squareSize + padding + borderSize;

        // Only draw on the first column (a-file)
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(rank.toString(), padding + borderSize, yPos);
      }

      // Draw file letters (a-h) on RIGHT-BOTTOM corner of each square
      for (let i = 0; i < 8; i++) {
        const file = String.fromCharCode(97 + (flipped ? 7 - i : i));
        const drawCol = flipped ? 7 - i : i;
        const xPos = (drawCol + 1) * squareSize - padding + borderSize;

        // Only draw on the last row (rank 1)
        const lastRow = flipped ? 0 : 7;
        const yPos = (lastRow + 1) * squareSize - padding + borderSize;

        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText(file, xPos, yPos);
      }
    }
  }, [
    boardState,
    pieceImages,
    showCoords,
    showBorder,
    lightSquare,
    darkSquare,
    boardSize,
    flipped,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded shadow-lg"
      style={{
        imageRendering: "-webkit-optimize-contrast",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    />
  );
};

export default ChessBoard;
