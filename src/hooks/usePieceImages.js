import { useEffect, useState, useRef } from 'react';
import { PIECE_MAP } from '../constants/chessConstants';
import { logger } from '../utils/logger';

/**
 * Load piece images with caching and retry logic
 */
export const usePieceImages = (pieceStyle) => {
  const [pieceImages, setPieceImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const loadingRef = useRef(false);
  const cacheRef = useRef({});
  const abortControllerRef = useRef(null);
  const currentStyleRef = useRef(pieceStyle);

  useEffect(() => {
    // Update current style ref
    currentStyleRef.current = pieceStyle;

    // Abort previous loading if still in progress
    if (loadingRef.current && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const loadPieces = async () => {
      const styleToLoad = pieceStyle;
      loadingRef.current = true;
      setIsLoading(true);
      setError(null);
      setLoadProgress(0);

      const cacheKey = styleToLoad;

      // Check cache
      if (cacheRef.current[cacheKey]) {
        // Only update state if this is still the current style
        if (currentStyleRef.current === styleToLoad) {
          setPieceImages(cacheRef.current[cacheKey]);
          setIsLoading(false);
          setLoadProgress(100);
        }
        loadingRef.current = false;
        return;
      }

      // Create new abort controller for this load operation
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const images = {};
      const entries = Object.entries(PIECE_MAP);
      let loaded = 0;
      const total = entries.length;
      let hasError = false;

      const loadPromises = entries.map(([key, value]) => {
        return new Promise((resolve) => {
          // Check if aborted before starting
          if (abortController.signal.aborted) {
            resolve();
            return;
          }

          const img = new Image();
          img.crossOrigin = 'anonymous';
          let retryCount = 0;
          const maxRetries = 3;
          let loadTimeout;

          const cleanup = () => {
            if (loadTimeout) clearTimeout(loadTimeout);
            img.onload = null;
            img.onerror = null;
          };

          const attemptLoad = () => {
            // Check if aborted before each attempt
            if (abortController.signal.aborted) {
              cleanup();
              resolve();
              return;
            }

            const cacheBuster = retryCount > 0 ? `?v=${Date.now()}` : '';
            const url = `https://lichess1.org/assets/piece/${styleToLoad}/${value}.svg${cacheBuster}`;

            loadTimeout = setTimeout(() => {
              if (!abortController.signal.aborted) {
                img.onerror(new Error('Timeout'));
              }
            }, 5000);

            img.src = url;
          };

          img.onload = () => {
            cleanup();
            if (!abortController.signal.aborted) {
              images[key] = img;
              loaded++;
              if (currentStyleRef.current === styleToLoad) {
                setLoadProgress(Math.round((loaded / total) * 100));
              }
            }
            resolve();
          };

          img.onerror = (err) => {
            cleanup();
            if (abortController.signal.aborted) {
              resolve();
              return;
            }

            logger.error(`Failed to load piece ${key}:`, err);
            if (retryCount < maxRetries) {
              retryCount++;
              const delay = 500 * retryCount;
              setTimeout(attemptLoad, delay);
            } else {
              logger.error(`Failed to load ${key} after ${maxRetries} retries`);
              hasError = true;
              images[key] = createPlaceholder(key);
              loaded++;
              if (currentStyleRef.current === styleToLoad) {
                setLoadProgress(Math.round((loaded / total) * 100));
              }
              resolve();
            }
          };

          attemptLoad();
        });
      });

      try {
        await Promise.all(loadPromises);

        // Only update state if this is still the current style
        if (
          !abortController.signal.aborted &&
          currentStyleRef.current === styleToLoad
        ) {
          if (hasError) {
            setError('Some pieces failed to load (using placeholders)');
          } else {
            cacheRef.current[cacheKey] = images;
          }

          setPieceImages({ ...images });
          setIsLoading(false);
          setLoadProgress(100);
        }
      } catch (err) {
        if (
          !abortController.signal.aborted &&
          currentStyleRef.current === styleToLoad
        ) {
          logger.error('Critical piece loading error:', err);
          setError('Failed to load pieces');
          setIsLoading(false);
        }
      } finally {
        loadingRef.current = false;
        if (abortControllerRef.current === abortController) {
          abortControllerRef.current = null;
        }
      }
    };

    loadPieces();

    return () => {
      // Cleanup on unmount or style change
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      loadingRef.current = false;
    };
  }, [pieceStyle]);

  return { pieceImages, isLoading, error, loadProgress };
};

/**
 * Create placeholder image
 */
const createPlaceholder = (pieceName) => {
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
};
