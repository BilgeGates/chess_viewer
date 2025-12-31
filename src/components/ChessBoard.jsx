import React, { useEffect, useRef, useState } from "react";
import { usePieceImages } from "../hooks/usePieceImages";
import { parseFEN } from "../utils/fenParser";
import {
  drawCoordinates,
  getCoordinateParams,
} from "../utils/coordinateCalculations";

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

    const coordParams = showCoords
      ? getCoordinateParams(boardSize)
      : { borderSize: 0 };
    const borderSize = showCoords ? coordParams.borderSize : 0;
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

        const displayRow = flipped ? 7 - row : row;
        const displayCol = flipped ? 7 - col : col;

        ctx.fillRect(
          displayCol * squareSize + borderSize,
          displayRow * squareSize + borderSize,
          squareSize,
          squareSize
        );
      }
    }

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row]?.[col];
        if (piece && pieceImages[piece]) {
          const img = pieceImages[piece];
          if (img.complete && img.naturalWidth > 0) {
            const displayRow = flipped ? 7 - row : row;
            const displayCol = flipped ? 7 - col : col;

            const cx = displayCol * squareSize + borderSize + squareSize / 2;
            const cy = displayRow * squareSize + borderSize + squareSize / 2;

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

    if (showCoords) {
      drawCoordinates(ctx, squareSize, coordParams, flipped, boardSize, false);
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
