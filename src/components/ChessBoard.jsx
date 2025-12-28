import React, { useEffect, useRef, useState } from "react";
import { usePieceImages } from "../hooks/usePieceImages";
import { parseFEN } from "../utils/fenParser";
import { drawCoordinates } from "../utils/coordinateCalculations";

/**
 * Main chess board canvas component
 */
const ChessBoard = React.forwardRef((props, ref) => {
  const {
    fen,
    pieceStyle,
    showCoords,
    showBorder,
    lightSquare,
    darkSquare,
    boardSize,
    flipped,
  } = props;

  const canvasRef = useRef(null);
  const { pieceImages, isLoading } = usePieceImages(pieceStyle);
  const [board, setBoard] = useState([]);

  // Parse FEN
  useEffect(() => {
    if (fen) setBoard(parseFEN(fen));
  }, [fen]);

  // Expose methods to parent
  React.useImperativeHandle(ref, () => ({
    getPieceImages: () => pieceImages,
    getBoardState: () => board,
  }));

  // Draw board
  useEffect(() => {
    if (!canvasRef.current || board.length === 0 || isLoading) return;
    if (Object.keys(pieceImages).length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", {
      alpha: true,
      willReadFrequently: false,
      desynchronized: true,
    });

    // Refined slim border
    const borderSize =
      showBorder || showCoords ? Math.max(20, boardSize / 20) : 0;
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

    // Draw border
    if (showBorder) {
      ctx.fillStyle = "#8b7355";
      ctx.fillRect(0, 0, totalSize, totalSize);
    }

    // Draw squares
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
      }
    }

    // Draw pieces
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row]?.[col];
        if (piece && pieceImages[piece]) {
          const img = pieceImages[piece];
          if (img.complete && img.naturalWidth > 0) {
            const drawRow = flipped ? 7 - row : row;
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
      drawCoordinates(ctx, squareSize, borderSize, flipped, boardSize);
    }
  }, [
    board,
    pieceImages,
    showCoords,
    showBorder,
    lightSquare,
    darkSquare,
    boardSize,
    flipped,
    isLoading,
  ]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-2xl transition-all duration-300"
        style={{
          imageRendering: "-webkit-optimize-contrast",
          maxWidth: "100%",
          height: "auto",
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
          <div className="text-white text-sm">Loading pieces...</div>
        </div>
      )}
    </div>
  );
});

ChessBoard.displayName = "ChessBoard";

export default ChessBoard;
