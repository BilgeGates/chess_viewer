# 📤 Export Pipeline Documentation

Complete technical documentation for the Chess Diagram Generator export system.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Export Formats](#-export-formats)
- [Export Pipeline Architecture](#-export-pipeline-architecture)
- [Quality Settings](#-quality-settings)
- [Resolution Scaling](#-resolution-scaling)
- [Canvas Rendering](#-canvas-rendering)
- [Image Optimization](#-image-optimization)
- [Batch Export](#-batch-export)
- [Error Handling](#-error-handling)
- [Performance Considerations](#-performance-considerations)
- [Browser Compatibility](#-browser-compatibility)
- [API Reference](#-api-reference)

---

## Overview

The export system is responsible for converting the interactive chess board into high-quality static images. It supports multiple formats, resolutions, and quality settings while maintaining optimal performance.

### Key Features
- ✅ PNG and JPEG export formats
- ✅ Ultra-HD export up to 12,800×12,800px (32× scale)
- ✅ Quality presets (Low, Medium, High, Ultra)
- ✅ Batch export for multiple positions
- ✅ Clipboard copy support
- ✅ Real-time progress tracking
- ✅ Memory-efficient rendering

---

## Export Formats

### PNG (Portable Network Graphics)
**Recommended for:** Print, web, transparency needs

| Property | Value |
|----------|-------|
| Format | PNG-24 (24-bit color) |
| Compression | Lossless |
| Transparency | Supported |
| Best for | High-quality prints, web graphics |
| File size | Larger (~2-5 MB for HD) |

**Advantages:**
- Lossless compression maintains perfect quality
- Supports transparency (alpha channel)
- No compression artifacts
- Best for diagrams and illustrations

**Use Cases:**
- Book publishing and print materials
- High-quality web content
- Educational materials requiring perfect clarity
- When transparency is needed for overlays

### JPEG (Joint Photographic Experts Group)
**Recommended for:** Web sharing, smaller file sizes

| Property | Value |
|----------|-------|
| Format | JPEG/JPG |
| Compression | Lossy (configurable quality) |
| Transparency | Not supported |
| Best for | Web sharing, email |
| File size | Smaller (~500 KB - 1.5 MB for HD) |

**Advantages:**
- Smaller file sizes (60-80% smaller than PNG)
- Faster upload and download
- Widely supported across all platforms
- Adjustable quality vs. file size trade-off

**Use Cases:**
- Social media sharing
- Email attachments
- Web forums and blogs
- When file size is a priority

---

## Export Pipeline Architecture

### High-Level Flow

```
┌─────────────────┐
│  User Triggers  │
│     Export      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Validate Settings      │
│  - Format (PNG/JPEG)    │
│  - Quality Level        │
│  - Resolution Scale     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Create Export Canvas   │
│  - Calculate dimensions │
│  - Set DPI/scaling      │
│  - Initialize context   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Render Board           │
│  ├─ Draw squares        │
│  ├─ Draw coordinates    │
│  ├─ Draw pieces         │
│  └─ Apply styling       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Optimize & Compress    │
│  - Apply quality preset │
│  - Compress if needed   │
│  - Validate output      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Generate Blob/File     │
│  - Convert to format    │
│  - Create download link │
│  - Trigger download     │
└─────────────────────────┘
```

### Component Breakdown

#### 1. Input Validation
**File:** `../src/utils/canvasExporter.js`

```javascript
// Validates export settings before processing
validateExportSettings(settings) {
  - Check format (PNG/JPEG)
  - Validate quality (0-100)
  - Verify resolution scale (1-32×)
  - Ensure canvas size within browser limits
  - Check memory availability
}
```

#### 2. Canvas Creation
**File:** `../src/utils/canvasExporter.js`

```javascript
// Creates optimized canvas for export
createExportCanvas(baseSize, scale, dpi) {
  const canvas = document.createElement('canvas');
  const targetSize = baseSize * scale;
  
  // Set physical dimensions
  canvas.width = targetSize;
  canvas.height = targetSize;
  
  // Set DPI for print quality
  const ctx = canvas.getContext('2d', {
    alpha: format === 'PNG',
    willReadFrequently: false
  });
  
  return { canvas, ctx };
}
```

#### 3. Board Rendering
**File:** `../src/components/board/ChessBoard.jsx`

```javascript
// Renders board to canvas
renderToCanvas(canvas, ctx, options) {
  // Step 1: Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Step 2: Draw board background
  drawBoardSquares(ctx, options);
  
  // Step 3: Draw coordinates (if enabled)
  if (options.showCoordinates) {
    drawCoordinates(ctx, options);
  }
  
  // Step 4: Draw pieces
  drawPieces(ctx, options);
  
  // Step 5: Draw border (if enabled)
  if (options.showBorder) {
    drawBorder(ctx, options);
  }
}
```

#### 4. Image Optimization
**File:** `../src/utils/imageOptimizer.js`

```javascript
// Optimizes canvas output
optimizeCanvas(canvas, format, quality) {
  if (format === 'PNG') {
    return canvas.toBlob(blob => blob, 'image/png');
  }
  
  if (format === 'JPEG') {
    const qualityValue = quality / 100;
    return canvas.toBlob(
      blob => blob, 
      'image/jpeg', 
      qualityValue
    );
  }
}
```

---

## Quality Settings

### Quality Presets

| Preset | Resolution | DPI | File Size | Use Case |
|--------|-----------|-----|-----------|----------|
| **Low** | 3200×3200px | 72 | ~200 KB | Quick preview, web thumbnail |
| **Medium** | 6400×6400px | 150 | ~2 MB | Standard web display |
| **High** | 9600×9600px | 300 | ~4 MB | Print quality, presentations |
| **Ultra** | 12800×12800px | 600 | ~6+ MB | Professional printing |

### Quality Parameters

#### PNG Quality Settings
```javascript
const PNG_SETTINGS = {
  LOW: {
    scale: 8,
    compression: 'default'
  },
  MEDIUM: {
    scale: 16,
    compression: 'default'
  },
  HIGH: {
    scale: 24,
    compression: 'none'
  },
  ULTRA: {
    scale: 32,
    compression: 'none'
  }
};
```

#### JPEG Quality Settings
```javascript
const JPEG_SETTINGS = {
  LOW: {
    scale: 8,
    quality: 0.7  // 70%
  },
  MEDIUM: {
    scale: 16,
    quality: 0.85 // 85%
  },
  HIGH: {
    scale: 24,
    quality: 0.92 // 92%
  },
  ULTRA: {
    scale: 32,
    quality: 0.95 // 95%
  }
};
```

---

## Resolution Scaling

### Scale Factors

The export system uses a **base size** of 400px and applies scale factors:

| Scale | Output Size | DPI | Memory Usage |
|-------|-------------|-----|--------------|
| 8× | 3,200×3,200px | 576 | ~32 MB |
| 16× | 6,400×6,400px | 1152 | ~128 MB |
| 24× | 9,600×9,600px | 1152 | ~128 MB |
| 32× | 12,800×12,800px | 2304 | ~512 MB |

### Calculation Formula

```javascript
const calculateDimensions = (baseSize, scale) => {
  const width = baseSize * scale;
  const height = baseSize * scale;
  const dpi = 72 * scale;
  const memoryEstimate = (width * height * 4) / (1024 * 1024); // MB
  
  return { width, height, dpi, memoryEstimate };
};
```

### Browser Limitations

Different browsers have maximum canvas size limits:

| Browser | Max Dimension | Max Area |
|---------|--------------|----------|
| Chrome | 32,767px | 268 MP |
| Firefox | 32,767px | 472 MP |
| Safari | 16,384px | 67 MP |
| Edge | 32,767px | 268 MP |

**Safety Check:**
```javascript
const isCanvasSizeSupported = (width, height) => {
  const maxDimension = 16384; // Safe for all browsers
  const maxArea = width * height;
  const safeArea = 67000000; // 67 MP (Safari limit)
  
  return width <= maxDimension && 
         height <= maxDimension && 
         maxArea <= safeArea;
};
```

---

## Canvas Rendering

### Rendering Steps

#### 1. Square Drawing
```javascript
drawSquares(ctx, squareSize, theme) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isLight = (row + col) % 2 === 0;
      const color = isLight ? theme.lightSquare : theme.darkSquare;
      
      ctx.fillStyle = color;
      ctx.fillRect(
        col * squareSize,
        row * squareSize,
        squareSize,
        squareSize
      );
    }
  }
}
```

#### 2. Coordinate Drawing
```javascript
drawCoordinates(ctx, squareSize, fontSize) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw file letters (a-h)
  files.forEach((file, i) => {
    const x = i * squareSize + squareSize / 2;
    const y = 8 * squareSize + fontSize;
    ctx.fillText(file, x, y);
  });
  
  // Draw rank numbers (1-8)
  ranks.forEach((rank, i) => {
    const x = -fontSize;
    const y = i * squareSize + squareSize / 2;
    ctx.fillText(rank, x, y);
  });
}
```

#### 3. Piece Drawing
```javascript
drawPieces(ctx, board, squareSize, pieceImages) {
  board.forEach((row, rowIndex) => {
    row.forEach((piece, colIndex) => {
      if (piece) {
        const img = pieceImages[piece];
        const x = colIndex * squareSize;
        const y = rowIndex * squareSize;
        
        ctx.drawImage(img, x, y, squareSize, squareSize);
      }
    });
  });
}
```

### Anti-Aliasing

```javascript
// Enable smooth rendering
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

// For crisp edges (coordinates, borders)
ctx.imageSmoothingEnabled = false; // When drawing text
```

---

## Image Optimization

### PNG Optimization
```javascript
const optimizePNG = async (canvas) => {
  // Use maximum compression
  const blob = await canvas.toBlob('image/png');
  
  // Optional: Further compress with pngquant (client-side)
  // Not implemented to avoid additional dependencies
  
  return blob;
};
```

### JPEG Optimization
```javascript
const optimizeJPEG = async (canvas, quality) => {
  // Convert with specified quality
  const blob = await canvas.toBlob(
    'image/jpeg',
    quality
  );
  
  return blob;
};
```

### File Size Comparison

For a 3200×3200px chess board:

| Format | Quality | File Size | Export Time |
|--------|---------|-----------|-------------|
| PNG | Default | 2.5 MB | 1.2s |
| JPEG | 70% | 450 KB | 0.8s |
| JPEG | 85% | 800 KB | 0.9s |
| JPEG | 92% | 1.2 MB | 1.0s |
| JPEG | 95% | 1.5 MB | 1.1s |

---

## Batch Export

### Multi-Position Export

```javascript
const batchExport = async (positions, settings) => {
  const results = [];
  const total = positions.length;
  
  for (let i = 0; i < total; i++) {
    // Update progress
    updateProgress(i + 1, total);
    
    // Export single position
    const blob = await exportPosition(positions[i], settings);
    results.push(blob);
    
    // Prevent UI blocking
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
};
```

### Progress Tracking

```javascript
const ExportProgress = ({ current, total }) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className="export-progress">
      <div className="progress-bar" style={{ width: `${percentage}%` }} />
      <span>{current} / {total}</span>
    </div>
  );
};
```

---

## Error Handling

### Common Errors

#### 1. Canvas Size Exceeded
```javascript
try {
  const canvas = createCanvas(width, height);
} catch (error) {
  if (error.name === 'RangeError') {
    throw new Error(
      `Canvas size (${width}×${height}) exceeds browser limits. ` +
      `Please use a smaller resolution.`
    );
  }
}
```

#### 2. Out of Memory
```javascript
const estimateMemory = (width, height) => {
  const bytes = width * height * 4; // RGBA
  const mb = bytes / (1024 * 1024);
  
  if (mb > 500) {
    console.warn(
      `Export requires ~${mb.toFixed(0)}MB of memory. ` +
      `This may cause performance issues.`
    );
  }
};
```

#### 3. Blob Creation Failed
```javascript
const safeToBlob = async (canvas, format, quality) => {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        format,
        quality
      );
    } catch (error) {
      reject(error);
    }
  });
};
```

---

## Performance Considerations

### Memory Management

```javascript
// Clean up after export
const cleanupCanvas = (canvas) => {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 0;
  canvas.height = 0;
};
```

### Async Processing

```javascript
// Prevent UI blocking during export
const asyncExport = async (canvas, format) => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      const blob = canvas.toBlob(format);
      resolve(blob);
    });
  });
};
```

### Optimization Tips

1. **Reuse Canvas** - Don't create new canvas for each export
2. **Batch Processing** - Export multiple positions in sequence
3. **Progressive Loading** - Load piece images once and cache
4. **Memory Monitoring** - Check available memory before large exports
5. **Worker Threads** - Consider Web Workers for heavy processing (future)

---

## Browser Compatibility

### Supported Features

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Canvas API | ✅ | ✅ | ✅ | ✅ |
| toBlob() | ✅ | ✅ | ✅ | ✅ |
| High-res export | ✅ | ✅ | ⚠️ Limited | ✅ |
| Clipboard API | ✅ | ✅ | ⚠️ Limited | ✅ |

### Browser-Specific Issues

#### Safari
- Max canvas size: 16,384×16,384px (lower than others)
- Clipboard API requires user gesture
- May have memory limitations on iOS

#### Firefox
- Excellent canvas support
- Best performance for high-resolution exports

#### Chrome/Edge
- Best overall compatibility
- Chromium-based, consistent behavior

---

## API Reference

### Export Functions

#### `exportToPNG(canvas, filename, quality)`
Exports canvas as PNG file.

**Parameters:**
- `canvas` (HTMLCanvasElement) - Source canvas
- `filename` (string) - Output filename
- `quality` (number) - Quality preset (1-4)

**Returns:** `Promise<Blob>`

#### `exportToJPEG(canvas, filename, quality)`
Exports canvas as JPEG file.

**Parameters:**
- `canvas` (HTMLCanvasElement) - Source canvas
- `filename` (string) - Output filename
- `quality` (number) - JPEG quality (0-100)

**Returns:** `Promise<Blob>`

#### `copyToClipboard(canvas)`
Copies canvas image to clipboard.

**Parameters:**
- `canvas` (HTMLCanvasElement) - Source canvas

**Returns:** `Promise<void>`

### Utility Functions

#### `calculateExportDimensions(baseSize, scale)`
Calculates final export dimensions.

#### `validateExportSettings(settings)`
Validates export configuration.

#### `estimateFileSize(width, height, format)`
Estimates output file size.

---

## Future Improvements

### Planned Features
- 🔄 SVG export format (v4.0.0)
- 📁 Batch export to folder (v4.1.0)
- ⚡ Web Worker processing
- 🎨 Custom watermark support
- 📊 Export analytics
- 🔧 Advanced compression options

---

**Last Updated:** January 15, 2026  
**Version:** 3.5.1