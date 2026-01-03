import { useEffect, useState, useRef } from "react";
import { PIECE_MAP } from "../constants/chessConstants";

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

  useEffect(() => {
    console.log(
      "🔵 usePieceImages useEffect triggered, pieceStyle:",
      pieceStyle
    );

    if (loadingRef.current) {
      console.log("⚠️ Already loading, aborting previous...");
      abortControllerRef.current?.abort();
    }

    const loadPieces = async () => {
      loadingRef.current = true;
      setIsLoading(true);
      setError(null);
      setLoadProgress(0);

      const cacheKey = pieceStyle;
      console.log("🔍 Checking cache for:", cacheKey);
      console.log("📦 Cache contents:", Object.keys(cacheRef.current));

      if (cacheRef.current[cacheKey]) {
        console.log("✅ Loading from cache:", cacheKey);
        console.log(
          "📊 Cached images count:",
          Object.keys(cacheRef.current[cacheKey]).length
        );
        setPieceImages(cacheRef.current[cacheKey]);
        setIsLoading(false);
        setLoadProgress(100);
        loadingRef.current = false;
        return;
      }

      console.log("❌ No cache found, loading fresh...");
      abortControllerRef.current = new AbortController();

      const images = {};
      console.log("📋 PIECE_MAP:", PIECE_MAP);
      const entries = Object.entries(PIECE_MAP);
      console.log("📋 Entries to load:", entries);
      let loaded = 0;
      const total = entries.length;
      let hasError = false;

      console.log(`🚀 Loading ${total} pieces for style: ${pieceStyle}`);

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
            const cacheBuster = retryCount > 0 ? `?v=${Date.now()}` : "";
            const url = `https://lichess1.org/assets/piece/${pieceStyle}/${value}.svg${cacheBuster}`;
            console.log(`⬇️ Loading ${key}: ${url}`);

            loadTimeout = setTimeout(() => {
              console.warn(`⏰ Timeout loading ${key}`);
              img.onerror(new Error("Timeout"));
            }, 5000);

            img.src = url;
          };

          img.onload = () => {
            cleanup();
            console.log(`✅ Loaded ${key}, size: ${img.width}x${img.height}`);
            images[key] = img;
            loaded++;
            console.log(
              `📊 Progress: ${loaded}/${total} (${Math.round(
                (loaded / total) * 100
              )}%)`
            );
            console.log(
              `📦 Images object now has ${Object.keys(images).length} keys:`,
              Object.keys(images)
            );
            setLoadProgress(Math.round((loaded / total) * 100));
            resolve();
          };

          img.onerror = (err) => {
            cleanup();
            console.error(`❌ Failed to load ${key}:`, err);
            if (retryCount < maxRetries) {
              retryCount++;
              const delay = 500 * retryCount;
              console.log(
                `🔄 Retrying ${key} in ${delay}ms... (${retryCount}/${maxRetries})`
              );
              setTimeout(attemptLoad, delay);
            } else {
              console.error(
                `💀 Giving up on ${key} after ${maxRetries} retries`
              );
              hasError = true;
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
        console.log("⏳ Waiting for all promises...");
        await Promise.all(loadPromises);
        console.log(
          `✅ All promises resolved! Loaded ${loaded}/${total} pieces`
        );
        console.log("🔑 Final images object keys:", Object.keys(images));
        console.log("📦 Final images object:", images);
        console.log("🔍 Checking each image:");
        Object.entries(images).forEach(([key, img]) => {
          console.log(`  ${key}:`, {
            exists: !!img,
            complete: img?.complete,
            naturalWidth: img?.naturalWidth,
            naturalHeight: img?.naturalHeight,
          });
        });

        if (hasError) {
          console.log("⚠️ Some pieces failed, setting error");
          setError("Some pieces failed to load (using placeholders)");
        } else {
          console.log("💾 Caching pieces for:", cacheKey);
          cacheRef.current[cacheKey] = images;
        }

        console.log(
          "🎯 Calling setPieceImages with",
          Object.keys(images).length,
          "images"
        );
        setPieceImages({ ...images });
        console.log("✅ setPieceImages called");

        setIsLoading(false);
        setLoadProgress(100);
        console.log("✅ Loading complete!");
      } catch (err) {
        console.error("💥 Critical piece loading error:", err);
        setError("Failed to load pieces");
        setIsLoading(false);
      } finally {
        loadingRef.current = false;
        abortControllerRef.current = null;
        console.log("🏁 loadPieces finally block executed");
      }
    };

    loadPieces();

    return () => {
      console.log("🧹 Cleanup: usePieceImages unmounting");
      loadingRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, [pieceStyle]);

  console.log("🔄 usePieceImages render, state:", {
    pieceImagesKeys: Object.keys(pieceImages),
    pieceImagesCount: Object.keys(pieceImages).length,
    isLoading,
    error,
    loadProgress,
  });

  return { pieceImages, isLoading, error, loadProgress };
};

/**
 * Create placeholder image
 */
const createPlaceholder = (pieceName) => {
  console.log("🎨 Creating placeholder for:", pieceName);
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, 100, 100);
  ctx.strokeStyle = "#999999";
  ctx.lineWidth = 2;
  ctx.strokeRect(5, 5, 90, 90);
  ctx.fillStyle = "#666666";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(pieceName, 50, 50);
  const img = new Image();
  img.src = canvas.toDataURL();
  return img;
};
