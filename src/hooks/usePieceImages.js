import { useEffect, useState, useRef } from "react";
import { PIECE_MAP } from "../constants/chessConstants";

/**
 * Load piece images with ADVANCED CACHING and retry logic
 */
export const usePieceImages = (pieceStyle) => {
  const [pieceImages, setPieceImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);

  const loadingRef = useRef(false);
  const cacheRef = useRef({});
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Prevent concurrent loads
    if (loadingRef.current) {
      abortControllerRef.current?.abort();
    }

    const loadPieces = async () => {
      loadingRef.current = true;
      setIsLoading(true);
      setError(null);
      setLoadProgress(0);

      // Check cache first
      const cacheKey = pieceStyle;
      if (cacheRef.current[cacheKey]) {
        console.log("Loading from cache:", cacheKey);
        setPieceImages(cacheRef.current[cacheKey]);
        setIsLoading(false);
        setLoadProgress(100);
        loadingRef.current = false;
        return;
      }

      // Create abort controller for this load
      abortControllerRef.current = new AbortController();

      const images = {};
      const entries = Object.entries(PIECE_MAP);
      let loaded = 0;
      const total = entries.length;
      let hasError = false;

      console.log(`Loading ${total} pieces for style: ${pieceStyle}`);

      const loadPromises = entries.map(([key, value]) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";

          let retryCount = 0;
          const maxRetries = 3;
          let loadTimeout;

          const cleanup = () => {
            if (loadTimeout) clearTimeout(loadTimeout);
            img.onload = null;
            img.onerror = null;
          };

          const attemptLoad = () => {
            // Add timestamp only on retry to bypass cache
            const cacheBuster = retryCount > 0 ? `?v=${Date.now()}` : "";
            const url = `https://lichess1.org/assets/piece/${pieceStyle}/${value}.svg${cacheBuster}`;

            console.log(`Loading ${key}: ${url}`);

            // Set timeout for load
            loadTimeout = setTimeout(() => {
              console.warn(`Timeout loading ${key}`);
              img.onerror(new Error("Timeout"));
            }, 5000);

            img.src = url;
          };

          img.onload = () => {
            cleanup();
            console.log(`✓ Loaded ${key}`);
            images[key] = img;
            loaded++;
            setLoadProgress(Math.round((loaded / total) * 100));
            resolve();
          };

          img.onerror = (err) => {
            cleanup();
            console.error(`✗ Failed to load ${key}:`, err);

            if (retryCount < maxRetries) {
              retryCount++;
              const delay = 500 * retryCount;
              console.log(
                `Retrying ${key} in ${delay}ms... (${retryCount}/${maxRetries})`
              );
              setTimeout(attemptLoad, delay);
            } else {
              console.error(`Giving up on ${key} after ${maxRetries} retries`);
              hasError = true;
              // Create placeholder
              images[key] = createPlaceholder(key);
              loaded++;
              setLoadProgress(Math.round((loaded / total) * 100));
              resolve();
            }
          };

          attemptLoad();
        });
      });

      try {
        await Promise.all(loadPromises);

        console.log(`Loaded ${loaded}/${total} pieces`);

        if (hasError) {
          setError("Some pieces failed to load (using placeholders)");
        } else {
          // Cache successful loads
          cacheRef.current[cacheKey] = images;
          console.log("Cached pieces for:", cacheKey);
        }

        setPieceImages(images);
        setIsLoading(false);
        setLoadProgress(100);
      } catch (err) {
        console.error("Critical piece loading error:", err);
        setError("Failed to load pieces");
        setIsLoading(false);
      } finally {
        loadingRef.current = false;
        abortControllerRef.current = null;
      }
    };

    loadPieces();

    // Cleanup
    return () => {
      loadingRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, [pieceStyle]);

  return { pieceImages, isLoading, error, loadProgress };
};

/**
 * Create placeholder image for failed loads
 */
const createPlaceholder = (pieceName) => {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, 100, 100);

  // Border
  ctx.strokeStyle = "#999999";
  ctx.lineWidth = 2;
  ctx.strokeRect(5, 5, 90, 90);

  // Text
  ctx.fillStyle = "#666666";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(pieceName, 50, 50);

  const img = new Image();
  img.src = canvas.toDataURL();
  return img;
};
