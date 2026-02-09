/**
 * Global Piece Image Cache
 *
 * Chess piece images are loaded from the internet (Lichess server).
 * Loading the same images repeatedly wastes time and bandwidth.
 *
 * This cache stores loaded images so they can be reused instantly.
 * It's shared across all components — if one component loads the images,
 * all other components can use them without reloading.
 */

// The main cache: stores piece images for each style (e.g., 'cburnett', 'alpha')
const globalPieceCache = new Map();

// Tracks which styles are currently being loaded (prevents duplicate loads)
const loadingStyles = new Set();

/**
 * Get cached images for a piece style.
 *
 * @param {string} pieceStyle - The style name (e.g., 'cburnett')
 * @returns {Object|null} - The cached images, or null if not cached yet
 */
export function getCachedPieces(pieceStyle) {
  const cached = globalPieceCache.get(pieceStyle);
  if (cached) {
    return cached;
  }
  return null;
}

/**
 * Store images in the cache for a piece style.
 *
 * @param {string} pieceStyle - The style name
 * @param {Object} images - An object where keys are piece names and values are Image objects
 */
export function setCachedPieces(pieceStyle, images) {
  globalPieceCache.set(pieceStyle, images);
}

/**
 * Check if a piece style is currently being loaded by another component.
 *
 * @param {string} pieceStyle - The style name
 * @returns {boolean} - true if the style is currently loading
 */
export function isStyleLoading(pieceStyle) {
  return loadingStyles.has(pieceStyle);
}

/**
 * Mark a piece style as "currently loading".
 * This prevents other components from starting a duplicate load.
 *
 * @param {string} pieceStyle - The style name
 */
export function markStyleLoading(pieceStyle) {
  loadingStyles.add(pieceStyle);
}

/**
 * Mark a piece style as "finished loading".
 *
 * @param {string} pieceStyle - The style name
 */
export function markStyleLoaded(pieceStyle) {
  loadingStyles.delete(pieceStyle);
}

/**
 * Clear the entire cache. Use this sparingly — it forces all images
 * to be reloaded from the internet.
 */
export function clearPieceCache() {
  globalPieceCache.clear();
  loadingStyles.clear();
}

/**
 * Preload piece images for a specific style.
 * This loads all piece images ahead of time so they're ready when needed.
 *
 * @param {string} pieceStyle - The style name (e.g., 'cburnett')
 * @param {Object} PIECE_MAP - Object mapping piece keys to file names
 * @returns {Promise<Object>} - The loaded images
 */
export async function preloadPieceStyle(pieceStyle, PIECE_MAP) {
  // Check if images are already cached
  const cached = getCachedPieces(pieceStyle);
  if (cached) {
    return cached;
  }

  // If another component is already loading this style, wait for it
  if (isStyleLoading(pieceStyle)) {
    return new Promise(function (resolve) {
      const checkInterval = setInterval(function () {
        const loaded = getCachedPieces(pieceStyle);
        if (loaded) {
          clearInterval(checkInterval);
          resolve(loaded);
        }
      }, 100);
    });
  }

  // Mark this style as loading so others don't start loading it too
  markStyleLoading(pieceStyle);

  const images = {};

  // Get all the piece keys (e.g., 'wK', 'wQ', 'bP', etc.)
  const keys = Object.keys(PIECE_MAP);

  // Create a load promise for each piece
  const loadPromises = [];

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = PIECE_MAP[key];

    const promise = new Promise(function (resolve) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const url =
        'https://lichess1.org/assets/piece/' +
        pieceStyle +
        '/' +
        value +
        '.svg';

      img.onload = function () {
        images[key] = img;
        resolve();
      };

      img.onerror = function () {
        // If a piece fails to load, store null as a placeholder
        images[key] = null;
        resolve();
      };

      img.src = url;
    });

    loadPromises.push(promise);
  }

  // Wait for all pieces to finish loading
  await Promise.all(loadPromises);

  // Store the loaded images in the cache
  setCachedPieces(pieceStyle, images);
  markStyleLoaded(pieceStyle);

  return images;
}

// Preload the default piece style shortly after the page loads.
// We delay slightly so it doesn't interfere with the initial page render.
if (typeof window !== 'undefined') {
  setTimeout(function () {
    import('../constants/chessConstants').then(function (module) {
      preloadPieceStyle('cburnett', module.PIECE_MAP).catch(function () {
        // Silently fail — preloading is optional
      });
    });
  }, 1000);
}
