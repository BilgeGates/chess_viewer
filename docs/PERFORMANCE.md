# Performance

Performance considerations for Chess Diagram Generator.

---

## Overview

Canvas-based rendering with React. No performance benchmarks have been run.

---

## Implemented Optimizations

### React.memo
Used on several components:
- ChessBoard
- BoardSquare
- MiniChessPreview
- Various control components

### useMemo / useCallback
Used in hooks for:
- Parsed board state
- Theme objects
- Export callbacks

### Code Splitting
Modals use React.lazy:
- ThemeModal
- FENHistoryModal
- ExportSettingsModal
- AdvancedFENInputModal

---

## Known Performance Issues

### Large Exports
- 32x scale (12,800x12,800px) uses ~500MB memory
- Can crash low-RAM devices or Safari
- Progress not shown during processing

### Canvas Rendering
- Full redraw on any change
- No partial updates implemented
- No off-screen canvas caching

### Piece Image Loading
- Loads all pieces in selected set at startup
- No lazy loading per piece
- Cached in browser after first load

---

## Memory Usage

| Export Scale | Resolution | Approx. Memory |
|--------------|------------|----------------|
| 8x | 3,200x3,200 | ~40MB |
| 16x | 6,400x6,400 | ~160MB |
| 24x | 9,600x9,600 | ~370MB |
| 32x | 12,800x12,800 | ~660MB |

---

## Browser Limits

| Browser | Max Canvas Size |
|---------|-----------------|
| Chrome | 32,767x32,767 |
| Firefox | 32,767x32,767 |
| Safari | 16,384x16,384 (or 268MP area) |
| Edge | 32,767x32,767 |

Safari may fail on 32x exports.

---

## Not Implemented

- Performance monitoring
- Lighthouse CI in build
- Bundle size tracking
- Web Vitals reporting
- Service worker caching
- Image preloading
- Virtual scrolling for history

---

## Recommendations

1. Add Lighthouse CI to track regressions
2. Add bundle size limit checks
3. Implement off-screen canvas for caching
4. Add lazy loading for piece sets
5. Add progress reporting for exports

---

**Last Updated:** January 18, 2026
