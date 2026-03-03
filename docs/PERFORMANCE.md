# Performance

Performance considerations and implemented optimisations for FENForsty Pro.

---

## Table of Contents

- [Overview](#overview)
- [Implemented Optimisations](#implemented-optimisations)
- [Code Splitting](#code-splitting)
- [Memory Usage](#memory-usage)
- [Browser Canvas Limits](#browser-canvas-limits)
- [Known Performance Issues](#known-performance-issues)
- [Performance Utilities](#performance-utilities)

---

## Overview

FENForsty Pro is a client-side only application that performs canvas-based rendering and exports high-resolution images. Performance concerns fall into two areas:

1. **Render performance** — keeping the interactive board and UI responsive during editing
2. **Export performance** — generating very large canvases (up to 24,192×24,192 px) without crashing

---

## Implemented Optimisations

### React.memo

The following components are wrapped with `React.memo` to prevent unnecessary re-renders when parent state changes:

- `ChessBoard`
- `BoardSquare`
- `MiniPreview`
- Feature panel components receiving stable props

### useMemo / useCallback

Used throughout the codebase:

- `useChessBoard` — memoises FEN → 8×8 board array conversion
- `useFENHistory` — memoises filtered history list (`filteredHistory`)
- All event handlers in context providers use `useCallback` with strict dependency arrays
- `FENBatchContext.addToBatch` uses an empty dep array + functional updater to remain stable across renders

### Debouncing

- FEN history persistence — written to localStorage with a 300 ms debounce to avoid thrashing on rapid state changes
- `performance.js` exports a generic `debounce(fn, wait)` utility used for input handlers

### Throttling

`performance.js` exports:

- `throttle(fn, limit)` — time-based throttle
- `rafThrottle(fn)` — `requestAnimationFrame`-based throttle with a `.cancel()` method, used for drag handlers to keep them in sync with the browser paint cycle

### Piece Image Caching

`pieceImageCache.js` caches loaded `HTMLImageElement` instances by piece-set key. Images are loaded once per piece-set and reused for both display rendering and export. This avoids repeated network requests and re-decoding.

### Export Pause/Resume

The export loop in `canvasExporter.js` supports pausing (`pauseExport()`) and cancellation (`cancelExport()`). Without this, a 32× export would block any interactivity for the full duration of rendering.

### History Archiving

Inactive FEN history entries are automatically moved to a separate archive (`fen-history-archive` in localStorage) by `archiveManager.js`. This keeps the active history list small and avoids performance degradation in virtualised lists with thousands of entries.

### Virtualised Lists

`react-window` is used for rendering large FEN history and batch lists to avoid mounting thousands of DOM nodes.

---

## Code Splitting

All page components are lazy-loaded via `React.lazy`:

```javascript
const HomePage = lazy(() => import('@/pages/HomePage'));
const FENHistoryPage = lazy(() => import('@/pages/FENHistoryPage'));
const AdvancedFENInputPage = lazy(() => import('@/pages/AdvancedFENInputPage'));
// etc.
```

A single `<Suspense>` boundary in `Router.jsx` shows a chess-themed loading spinner while the page chunk loads. This reduces the initial bundle size and defers loading of heavy pages until they are visited.

---

## Memory Usage

Export memory is dominated by the canvas pixel buffer (`width × height × 4 bytes RGBA`):

| Quality | Approx. Resolution | Approx. Memory |
|---|---|---|
| 8× @ 4 cm | 3,776 × 3,776 px | ~54 MB |
| 8× @ 8 cm | 7,552 × 7,552 px | ~216 MB |
| 16× @ 6 cm | 11,328 × 11,328 px | ~487 MB |
| 24× (Social) | 18,112 × 18,112 px | ~1.24 GB |
| 32× (Social) | 24,192 × 24,192 px | ~2.22 GB |

**Note:** 24× and 32× Social exports may exhaust available memory on devices with less than 4 GB RAM and are very likely to fail on iOS/Safari due to the WebKit canvas area limit.

---

## Browser Canvas Limits

| Browser | Max Dimension | Notes |
|---|---|---|
| Chrome / Edge | 32,767 px | Chromium limit |
| Firefox | 32,767 px | |
| Safari | 16,384 px | Also limited to 268 MP total area |

`getMaxCanvasSize()` in `utils/index.js` detects and returns the safe maximum for the current browser. The export system sets `willBeReduced: true` when the requested dimensions exceed this cap.

---

## Known Performance Issues

### Large Exports on Safari

Safari enforces a 16,384 px and 268 MP canvas limit. Exports at 24× or 32× Social mode will fail or produce a blank image. This is a browser limitation with no workaround other than using a Chromium-based browser.

### Canvas Full Redraw

The interactive chess board (`ChessBoard`) redraws the entire canvas on every prop change. There is no partial update or dirty-checking. For the display board this is acceptable (64 squares × one `fillRect` each is fast), but it means any prop change triggers the full draw cycle.

### No Web Worker for Export

All canvas rendering during export runs on the main thread. On slow devices, very large exports (16× and above) may cause the UI to become unresponsive despite the async progress animation. Web Worker offloading is not implemented.

### Sequential Batch Export

Batch export processes positions one at a time in sequence. There is a small `setTimeout` delay between positions to yield to the browser event loop, but large batches will still occupy the tab for an extended period.

---

## Performance Utilities

`src/utils/performance.js` exports:

| Export | Signature | Description |
|---|---|---|
| `debounce` | `(fn, wait = 300) => fn` | Returns a debounced version of `fn` |
| `throttle` | `(fn, limit = 300) => fn` | Returns a time-throttled version of `fn` |
| `rafThrottle` | `(fn) => fn & { cancel() }` | Returns an rAF-throttled version with a cancel method |
| `lazyLoadImages` | `(selector, options) => cleanup` | Sets up `IntersectionObserver` for lazy image loading |

`src/hooks/usePerformance.js` wraps `performance.mark` / `performance.measure` for timing individual operations during development.

---

**Last Updated:** March 3, 2026  
**Version:** 5.0.0
