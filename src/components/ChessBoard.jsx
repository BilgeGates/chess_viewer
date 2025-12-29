import React, { useEffect, useRef, useState } from "react";
import { usePieceImages } from "../hooks/usePieceImages";
import { parseFEN } from "../utils/fenParser";

const ChessBoard = React.forwardRef((props, ref) => {
  const {
    fen,
    pieceStyle,
    showCoords,
    lightSquare,
    darkSquare,
    boardSize,
    flipped,
  } = props;

  const canvasRef = useRef(null);
  const { pieceImages, isLoading, error, loadProgress } =
    usePieceImages(pieceStyle);
  const [board, setBoard] = useState([]);

  useEffect(() => {
    if (fen) {
      try {
        const parsed = parseFEN(fen);
        setBoard(parsed);
      } catch (err) {
        console.error("FEN parse error:", err);
        setBoard(
          Array(8)
            .fill(null)
            .map(() => Array(8).fill(""))
        );
      }
    }
  }, [fen]);

  React.useImperativeHandle(ref, () => ({
    getPieceImages: () => pieceImages,
    getBoardState: () => board,
    getCanvas: () => canvasRef.current,
  }));

  useEffect(() => {
    if (!canvasRef.current || board.length === 0 || isLoading) return;
    if (Object.keys(pieceImages).length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", {
      alpha: true,
      willReadFrequently: false,
      desynchronized: true,
    });

    const borderSize = showCoords
      ? Math.max(12, Math.min(18, boardSize / 30))
      : 0;
    const totalSize = boardSize + borderSize * 2;
    const scale = 4;

    canvas.width = totalSize * scale;
    canvas.height = totalSize * scale;
    canvas.style.width = totalSize + "px";
    canvas.style.height = totalSize + "px";

    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const squareSize = boardSize / 8;
    ctx.clearRect(0, 0, totalSize, totalSize);

    // Draw squares
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLight = (row + col) % 2 === 0;
        ctx.fillStyle = isLight ? lightSquare : darkSquare;
        const drawRow = flipped ? row : 7 - row;
        const drawCol = flipped ? 7 - col : col;

        ctx.fillRect(
          drawCol * squareSize + borderSize,
          drawRow * squareSize + borderSize,
          squareSize,
          squareSize
        );
      }
    }

    // Draw pieces
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row]?.[col];
        if (piece && pieceImages[piece]) {
          const img = pieceImages[piece];
          if (img.complete && img.naturalWidth > 0) {
            const drawRow = flipped ? row : 7 - row;
            const drawCol = flipped ? 7 - col : col;

            const cx = drawCol * squareSize + borderSize + squareSize / 2;
            const cy = drawRow * squareSize + borderSize + squareSize / 2;

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

    // Draw coordinates
    if (showCoords) {
      const fontSize = Math.round(Math.max(8, Math.min(14, boardSize * 0.028)));

      ctx.save();
      ctx.font = `700 ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
      ctx.shadowBlur = 2.5;
      ctx.shadowOffsetX = 0.5;
      ctx.shadowOffsetY = 0.5;

      // Ranks (1-8 solda)
      for (let row = 0; row < 8; row++) {
        const rank = flipped ? row + 1 : 8 - row;
        const drawRow = flipped ? row : 7 - row;
        const yPos = borderSize + drawRow * squareSize + squareSize / 2;
        ctx.fillText(rank.toString(), borderSize * 0.5, yPos);
      }

      // Files (a-h aşağıda)
      for (let col = 0; col < 8; col++) {
        const file = String.fromCharCode(97 + (flipped ? 7 - col : col));
        const drawCol = flipped ? 7 - col : col;
        const xPos = borderSize + drawCol * squareSize + squareSize / 2;
        const yPos = borderSize + 8 * squareSize + borderSize * 0.5;
        ctx.fillText(file, xPos, yPos);
      }

      ctx.restore();
    }
  }, [
    board,
    pieceImages,
    showCoords,
    lightSquare,
    darkSquare,
    boardSize,
    flipped,
    isLoading,
  ]);

  return (
    <div className="relative inline-block w-full max-w-full">
      <canvas
        ref={canvasRef}
        className="transition-all duration-300 w-full h-auto"
        style={{
          display: "block",
          imageRendering: "-webkit-optimize-contrast",
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/70 rounded-lg backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-white text-sm font-medium">
              Loading pieces... {loadProgress}%
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/70 rounded-lg backdrop-blur-sm">
          <div className="text-white text-sm font-medium px-4 text-center">
            {error}
          </div>
        </div>
      )}
    </div>
  );
});

ChessBoard.displayName = "ChessBoard";

export default ChessBoard;
