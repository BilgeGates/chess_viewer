import React, { useEffect, useRef } from "react";
import { usePieceImages } from "../hooks/usePieceImages";
import { useChessBoard } from "../hooks/useChessBoard";
import { drawCoordinatesOutside } from "../utils/coordinateCalculations";

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

    React.useImperativeHandle(ref, () => ({
      getPieceImages: () => pieceImages,
      getCanvas: () => canvasRef.current,
      getBoardState: () => boardState,
    }));

    useEffect(() => {
      if (!canvasRef.current || boardState.length === 0) return;
      if (Object.keys(pieceImages).length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", {
        alpha: true,
        willReadFrequently: false,
        desynchronized: true,
      });

      const baseBorderSize = boardSize / 20;
      const borderSize =
        showBorder || showCoords
          ? Math.max(12, Math.min(15, baseBorderSize))
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

      if (showBorder) {
        ctx.fillStyle = "#a67c52";
        ctx.fillRect(0, 0, totalSize, totalSize);
      }

      // Squares
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

      // Pieces
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

      // Coordinates
      if (showCoords) {
        drawCoordinatesOutside(ctx, squareSize, borderSize, flipped, boardSize);
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
        style={{
          imageRendering: "-webkit-optimize-contrast",
          maxWidth: "100%",
          height: "auto",
        }}
      />
    );
  }
);

ChessBoard.displayName = "ChessBoard";

export default ChessBoard;
