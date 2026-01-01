import React from "react";
import { parseFEN } from "../utils/fenParser";
import { usePieceImages } from "../hooks/usePieceImages";

const MiniChessPreview = ({
  fen,
  lightSquare,
  darkSquare,
  pieceStyle = "cburnett",
}) => {
  const canvasRef = React.useRef(null);
  const [hasError, setHasError] = React.useState(false);

  // Use existing hook instead of duplicating logic
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

          // Subtle gradient overlay
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

      // Draw pieces from Lichess using the same hook as main board
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

              ctx.drawImage(img, x + offset, y + offset, pieceSize, pieceSize);
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
            : "opacity-100 scale-100 border-gray-600 group-hover:border-blue-500/50 group-hover:shadow-2xl group-hover:shadow-blue-500/20"
        }`}
        style={{
          width: "160px",
          height: "160px",
          imageRendering: "crisp-edges",
        }}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg backdrop-blur-sm">
          <div className="relative">
            <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <div
              className="absolute inset-0 w-8 h-8 border-3 border-transparent border-t-purple-500 rounded-full animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "1s" }}
            ></div>
          </div>
        </div>
      )}

      {(hasError || error) && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 rounded-lg backdrop-blur-sm border-2 border-red-500/50">
          <div className="text-center px-3">
            <svg
              className="w-8 h-8 text-red-400 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-xs text-red-400 font-medium">
              {error || "Invalid FEN"}
            </p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg"></div>
      </div>

      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg shadow-blue-500/50"></div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg shadow-purple-500/50"></div>
    </div>
  );
};

export default MiniChessPreview;
