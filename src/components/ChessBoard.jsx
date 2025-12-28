import React, { useEffect, useRef } from "react";
import { usePieceImages } from "../hooks/usePieceImages";
import { useChessBoard } from "../hooks/useChessBoard";
import { drawCoordinates } from "../utils/coordinateCalculations";
import { CANVAS_CONFIG } from "../constants/chessConstants";

const ChessBoard = React.forwardRef(
  (
    {
      fen,
      pieceStyle,
      showCoords,
      showBorder,
      lightSquare,
      darkSquare,
      boardSize,
      flipped,
    },
    ref
  ) => {
    const canvasRef = useRef(null);
    const { pieceImages } = usePieceImages(pieceStyle);
    const boardState = useChessBoard(fen);

    // Expose pieceImages to parent via ref
    React.useImperativeHandle(ref, () => ({
      getPieceImages: () => pieceImages,
      getCanvas: () => canvasRef.current,
    }));

    useEffect(() => {
      if (!canvasRef.current || boardState.length === 0) return;
      if (Object.keys(pieceImages).length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", {
        alpha: false,
        willReadFrequently: false,
        desynchronized: true,
      });

      const borderSize = showBorder ? CANVAS_CONFIG.BORDER_SIZE : 0;
      const totalSize = boardSize + borderSize * 2;
      const scale = CANVAS_CONFIG.DISPLAY_SCALE;

      canvas.width = totalSize * scale;
      canvas.height = totalSize * scale;
      canvas.style.width = totalSize + "px";
      canvas.style.height = totalSize + "px";

      ctx.scale(scale, scale);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const squareSize = boardSize / 8;

      // Draw border
      if (showBorder) {
        ctx.fillStyle = "#1a1d29";
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
          const piece = boardState[row]?.[col];
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
        drawCoordinates(ctx, squareSize, borderSize, flipped);
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
          WebkikitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      />
    );
  }
);

ChessBoard.displayName = "ChessBoard";

export default ChessBoard;
