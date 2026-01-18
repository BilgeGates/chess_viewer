import React, { useEffect, useRef, useState } from 'react';
import { usePieceImages } from '../../hooks';
import { parseFEN, drawCoordinates, getCoordinateParams } from '../../utils';
import { logger } from '../../utils/logger';

const ChessBoard = React.forwardRef((props, ref) => {
  const {
    fen,
    pieceStyle,
    showCoords,
    lightSquare,
    darkSquare,
    boardSize,
    flipped
  } = props;

  const canvasRef = useRef(null);
  const { pieceImages, isLoading, error, loadProgress } =
    usePieceImages(pieceStyle);
  const [board, setBoard] = useState([]);

  useEffect(() => {
    if (fen) {
      try {
        const parsed = parseFEN(fen);
        // Validate parsed board
        if (parsed && Array.isArray(parsed) && parsed.length === 8) {
          setBoard(parsed);
        } else {
          logger.error('FEN parse returned invalid board structure');
          setBoard(
            Array(8)
              .fill(null)
              .map(() => Array(8).fill(''))
          );
        }
      } catch (err) {
        logger.error('FEN parse error:', err);
        setBoard(
          Array(8)
            .fill(null)
            .map(() => Array(8).fill(''))
        );
      }
    }
  }, [fen]);

  React.useImperativeHandle(ref, () => ({
    getPieceImages: () => pieceImages,
    getBoardState: () => board,
    getCanvas: () => canvasRef.current
  }));

  useEffect(() => {
    if (!canvasRef.current || board.length === 0 || isLoading) return;
    if (Object.keys(pieceImages).length === 0) return;

    // Validate board structure
    if (!Array.isArray(board) || board.length !== 8) {
      logger.error('Invalid board structure for rendering');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', {
      alpha: true,
      willReadFrequently: false,
      desynchronized: true
    });

    if (!ctx) {
      logger.error('Failed to get canvas context');
      return;
    }

    const borderSize = showCoords
      ? getCoordinateParams(boardSize).borderSize
      : 0;
    const totalSize = boardSize + borderSize * 2;
    const scale = 4;

    canvas.width = totalSize * scale;
    canvas.height = totalSize * scale;
    canvas.style.width = totalSize + 'px';
    canvas.style.height = totalSize + 'px';

    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const squareSize = boardSize / 8;

    const getSquareBounds = (rowIndex, colIndex) => {
      const x0 = Math.round(borderSize + colIndex * squareSize);
      const x1 = Math.round(borderSize + (colIndex + 1) * squareSize);
      const y0 = Math.round(borderSize + rowIndex * squareSize);
      const y1 = Math.round(borderSize + (rowIndex + 1) * squareSize);

      return {
        x: x0,
        y: y0,
        width: x1 - x0,
        height: y1 - y0,
        centerX: Math.round((x0 + x1) / 2),
        centerY: Math.round((y0 + y1) / 2)
      };
    };

    // Clear canvas - fully transparent background
    ctx.clearRect(0, 0, totalSize, totalSize);

    // Draw border around the entire board
    if (showCoords) {
      ctx.strokeStyle = '#666666'; // Lighter border for display
      ctx.lineWidth = 1;
      ctx.strokeRect(
        borderSize - 0.5,
        borderSize - 0.5,
        boardSize + 1,
        boardSize + 1
      );
    }

    // Draw squares
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLight = (row + col) % 2 === 0;
        ctx.fillStyle = isLight ? lightSquare : darkSquare;
        const displayRow = flipped ? 7 - row : row;
        const displayCol = flipped ? 7 - col : col;
        const bounds = getSquareBounds(displayRow, displayCol);

        // Use rounded edges to match export grid exactly
        ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      }
    }

    // Draw pieces
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const fenPiece = board[row]?.[col];
        if (fenPiece) {
          const color = fenPiece === fenPiece.toUpperCase() ? 'w' : 'b';
          const pieceKey = color + fenPiece.toUpperCase();
          const img = pieceImages[pieceKey];

          if (img && img.complete && img.naturalWidth > 0) {
            const displayRow = flipped ? 7 - row : row;
            const displayCol = flipped ? 7 - col : col;
            const bounds = getSquareBounds(displayRow, displayCol);

            // Piece fills 100% of square
            const pieceSize = Math.round(
              Math.min(bounds.width, bounds.height) * 1.0
            );
            const px = Math.round(bounds.centerX - pieceSize / 2);
            const py = Math.round(bounds.centerY - pieceSize / 2);

            ctx.drawImage(img, px, py, pieceSize, pieceSize);
          }
        }
      }
    }

    // Draw coordinates
    if (showCoords) {
      drawCoordinates(
        ctx,
        squareSize,
        borderSize,
        flipped,
        boardSize,
        false,
        true
      ); // isExport=false, displayWhite=true
    }
  }, [
    fen,
    pieceImages,
    showCoords,
    lightSquare,
    darkSquare,
    boardSize,
    flipped,
    isLoading,
    board
  ]);

  // Generate accessible description for current board position
  const getBoardDescription = () => {
    if (!fen) return 'Empty chess board';
    return `Chess board showing position: ${fen.split(' ')[0]}`;
  };

  return (
    <div
      className="relative inline-block w-full max-w-full"
      role="img"
      aria-label={getBoardDescription()}
    >
      <canvas
        ref={canvasRef}
        className="transition-all duration-300 w-full h-auto"
        style={{
          display: 'block',
          imageRendering: '-webkit-optimize-contrast',
          background: 'transparent'
        }}
        aria-hidden="true"
      />
      {isLoading && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/70 rounded-lg backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            ></div>
            <div className="text-white text-sm font-medium">
              Loading pieces... {loadProgress}%
            </div>
          </div>
        </div>
      )}
      {error && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-red-900/70 rounded-lg backdrop-blur-sm"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-white text-sm font-medium px-4 text-center">
            {error}
          </div>
        </div>
      )}
    </div>
  );
});

ChessBoard.displayName = 'ChessBoard';

export default ChessBoard;
