import React from "react";
import { parseFEN } from "../../utils";
import { usePieceImages } from "../../hooks";

const MiniChessPreview = React.memo(
  ({ fen, lightSquare, darkSquare, pieceStyle = "cburnett" }) => {
    const canvasRef = React.useRef(null);
    const [hasError, setHasError] = React.useState(false);
    const { pieceImages, isLoading, error } = usePieceImages(pieceStyle);

    React.useEffect(() => {
      if (!canvasRef.current || !fen || Object.keys(pieceImages).length === 0)
        return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const size = 160;
      const squareSize = size / 8;
      const scale = 2;

      setHasError(false);

      canvas.width = size * scale;
      canvas.height = size * scale;
      canvas.style.width = size + "px";
      canvas.style.height = size + "px";

      ctx.scale(scale, scale);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      try {
        const board = parseFEN(fen);

        // Draw squares
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const isLight = (row + col) % 2 === 0;
            const x = col * squareSize;
            const y = row * squareSize;
            ctx.fillStyle = isLight ? lightSquare : darkSquare;
            ctx.fillRect(x, y, squareSize, squareSize);

            // Subtle gradient
            const gradient = ctx.createLinearGradient(
              x,
              y,
              x + squareSize,
              y + squareSize
            );
            if (isLight) {
              gradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
              gradient.addColorStop(1, "rgba(0, 0, 0, 0.05)");
            } else {
              gradient.addColorStop(0, "rgba(255, 255, 255, 0.05)");
              gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, squareSize, squareSize);
          }
        }

        // Draw pieces
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const piece = board[row]?.[col];
            if (piece && pieceImages[piece]) {
              const img = pieceImages[piece];
              if (img.complete && img.naturalWidth > 0) {
                const x = col * squareSize;
                const y = row * squareSize;
                const pieceSize = squareSize * 0.9;
                const offset = (squareSize - pieceSize) / 2;
                ctx.drawImage(
                  img,
                  x + offset,
                  y + offset,
                  pieceSize,
                  pieceSize
                );
              }
            }
          }
        }

        // Border
        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, size - 2, size - 2);
      } catch (err) {
        console.error("Preview error:", err);
        setHasError(true);
      }
    }, [fen, lightSquare, darkSquare, pieceImages]);

    return (
      <div className="relative group">
        <canvas
          ref={canvasRef}
          className={`rounded-lg border-2 shadow-xl transition-all duration-300 ${
            isLoading
              ? "opacity-0 scale-95 border-gray-600"
              : "opacity-100 scale-100 border-gray-600 group-hover:border-blue-500/50"
          }`}
          style={{
            width: "160px",
            height: "160px",
            imageRendering: "crisp-edges",
          }}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg backdrop-blur-sm">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {(hasError || error) && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 rounded-lg backdrop-blur-sm border-2 border-red-500/50">
            <div className="text-center px-3">
              <p className="text-xs text-red-400 font-medium">
                {error || "Invalid FEN"}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

MiniChessPreview.displayName = "MiniChessPreview";

export default MiniChessPreview;
