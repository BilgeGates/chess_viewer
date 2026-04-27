import { useEffect, useRef, useState } from 'react';

import { PIECE_MAP } from '@/constants';
import { logger } from '@/utils/logger';
import { preloadPieceStyle, setCachedPieces } from '@/utils/pieceImageCache';

/**
 * Loads and caches piece image elements for the given `pieceStyle`.
 *
 * @param {string} pieceStyle - Piece style identifier (e.g. 'cburnett')
 * @returns {{ pieceImages: Object, isLoading: boolean, error: string|null }}
 */
export function usePieceImages(pieceStyle) {
  const [pieceImages, setPieceImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const currentStyleRef = useRef(pieceStyle);
  useEffect(() => {
    currentStyleRef.current = pieceStyle;
    let cancelled = false;
    const loadPieces = async () => {
      const styleToLoad = pieceStyle;
      setIsLoading(true);
      setError(null);
      setLoadProgress(0);
      try {
        const loadedImages = await preloadPieceStyle(
          styleToLoad,
          PIECE_MAP,
          (progress) => {
            if (!cancelled && currentStyleRef.current === styleToLoad) {
              setLoadProgress(progress);
            }
          }
        );
        if (!cancelled && currentStyleRef.current === styleToLoad) {
          const images = {};
          let hasError = false;
          Object.keys(PIECE_MAP).forEach((key) => {
            images[key] = loadedImages[key] || createPlaceholderImage(key);
            if (!loadedImages[key]) hasError = true;
          });
          if (hasError) {
            setError('Some pieces failed to load');
            setCachedPieces(styleToLoad, images);
          }
          setPieceImages({
            ...images
          });
          setIsLoading(false);
          setLoadProgress(100);
        }
      } catch (err) {
        if (!cancelled && currentStyleRef.current === styleToLoad) {
          logger.error('Critical piece loading error:', err);
          setError('Failed to load pieces');
          setIsLoading(false);
        }
      }
    };
    loadPieces();
    return () => {
      cancelled = true;
    };
  }, [pieceStyle]);
  return {
    pieceImages,
    isLoading,
    error,
    loadProgress
  };
}

/**
 * Creates a fallback image for a chess piece key.
 *
 * @param {string} pieceName
 * @returns {HTMLImageElement}
 */
function createPlaceholderImage(pieceName) {
  logger.log('Creating placeholder for:', pieceName);
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, 100, 100);
  ctx.strokeStyle = '#999999';
  ctx.lineWidth = 2;
  ctx.strokeRect(5, 5, 90, 90);
  ctx.fillStyle = '#666666';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(pieceName, 50, 50);
  const img = new Image();
  img.src = canvas.toDataURL();
  return img;
}
