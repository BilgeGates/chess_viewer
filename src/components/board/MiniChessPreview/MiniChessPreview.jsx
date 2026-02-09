import React, { useRef, useState, useEffect, memo } from 'react';

import { usePieceImages } from '@/hooks';
import { parseFEN, logger } from '@/utils';

const MiniChessPreview = memo(
  ({
    fen,
    lightSquare = '#f0d9b5',
    darkSquare = '#b58863',
    pieceStyle = 'cburnett',
    size = 160 // Base size for preview
  }) => {
    const canvasRef = useRef(null);
    const [hasError, setHasError] = useState(false);
    const { pieceImages, isLoading, error } = usePieceImages(pieceStyle);

    useEffect(() => {
      if (!canvasRef.current || !fen || Object.keys(pieceImages).length === 0) {
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', {
        alpha: false,
        desynchronized: true
      });

      if (!ctx) {
        setHasError(true);
        return;
      }

      const squareSize = size / 8;
      const scale = 2;

      setHasError(false);

      canvas.width = size * scale;
      canvas.height = size * scale;
      canvas.style.width = '100%';
      canvas.style.height = '100%';

      ctx.scale(scale, scale);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      try {
        const board = parseFEN(fen);

        if (!board || !Array.isArray(board) || board.length !== 8) {
          throw new Error('Invalid board structure');
        }

        // Draw squares
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const isLight = (row + col) % 2 === 0;
            const x = col * squareSize;
            const y = row * squareSize;
            ctx.fillStyle = isLight ? lightSquare : darkSquare;
            ctx.fillRect(x, y, squareSize, squareSize);
          }
        }

        // Draw pieces
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const fenChar = board[row]?.[col];
            if (fenChar) {
              const color = fenChar === fenChar.toUpperCase() ? 'w' : 'b';
              const pieceType = fenChar.toUpperCase();
              const pieceKey = color + pieceType;

              const img = pieceImages[pieceKey];
              if (img && img.complete && img.naturalWidth > 0) {
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
      } catch (err) {
        logger.error('Preview render error:', err);
        setHasError(true);
      }
    }, [fen, lightSquare, darkSquare, pieceImages, size]);

    return (
      <div className="relative w-full h-full" style={{ aspectRatio: '1 / 1' }}>
        <canvas
          ref={canvasRef}
          className={`w-full h-full transition-opacity duration-200 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            imageRendering: 'auto',
            display: 'block',
            borderRadius: '0'
          }}
        />

        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/60">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error state */}
        {(hasError || error) && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-error/10 border border-error/30">
            <div className="text-center px-2">
              <p className="text-[10px] text-error font-medium">
                {error || 'Invalid FEN'}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.fen === nextProps.fen &&
      prevProps.lightSquare === nextProps.lightSquare &&
      prevProps.darkSquare === nextProps.darkSquare &&
      prevProps.pieceStyle === nextProps.pieceStyle &&
      prevProps.size === nextProps.size
    );
  }
);

MiniChessPreview.displayName = 'MiniChessPreview';

export default MiniChessPreview;
