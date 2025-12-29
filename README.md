# ♟️ Professional Chess Diagram Generator

Ultra-high quality chess diagram generator with advanced export capabilities.

## 🚀 Features

- **27 Piece Sets** - Professional Lichess piece styles
- **12 Board Themes** - Beautiful color schemes
- **12 Famous Positions** - Historical chess games
- **4 Export Quality Levels** - 8x, 16x, 24x, 32x
- **Multiple Formats** - PNG, JPEG, SVG
- **Batch Export** - Export multiple formats at once
- **Smart Memory Management** - Prevents browser crashes
- **Advanced Caching** - Fast piece loading
- **Copy to Clipboard** - Quick sharing
- **FEN Validation** - Error checking
- **Random Positions** - Testing & fun
- **Flip Board** - Black/White perspective
- **Responsive Design** - Mobile friendly

## 📦 Installation
```bash
# Clone repository
git clone <repository-url>
cd chess-diagram-generator

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🎯 Usage

### Basic Setup

1. Select piece style from dropdown
2. Choose board theme or custom colors
3. Enter FEN notation or use famous positions
4. Adjust board size (200-800px)
5. Set export quality (8x-32x)
6. Export or copy to clipboard

### Export Quality Guide

| Quality | Resolution | Use Case | File Size |
|---------|-----------|----------|-----------|
| 8x | 3200px | Web display | Small |
| 16x | 6400px | Print (300 DPI) | Medium |
| 24x | 9600px | Professional print | Large |
| 32x | 12800px | Maximum quality | Very Large |

### Memory Considerations

- **Browser Limit**: 16,384px maximum canvas size
- **Recommended**: Use 16x for most cases
- **Large Boards**: System auto-adjusts quality
- **Batch Export**: Adds delays to prevent crashes

## 🛠️ Technical Details

### Technologies

- React 18
- Vite
- TailwindCSS
- Canvas API
- SVG

### Key Components
```
src/
├── components/
│   ├── ChessBoard.jsx              # Main board renderer
│   ├── ControlPanel.jsx            # Settings panel
│   ├── ActionButtons.jsx           # Export buttons
│   ├── LoadingComponents.jsx       # Progress UI
│   └── NotificationContainer.jsx   # Toast messages
├── hooks/
│   ├── usePieceImages.js           # Image loading with cache
│   └── useNotifications.js         # Toast system
├── utils/
│   ├── exportUtils.js              # Export handlers
│   ├── imageOptimizer.js           # Canvas optimization
│   ├── generateChessSVG.js         # SVG generator
│   ├── advancedExport.js           # Progressive export
│   ├── fenParser.js                # FEN validation
│   └── coordinateCalculations.js   # Coordinates
└── constants/
    └── chessConstants.js           # Config & data
```

### Export Process

1. **Validation**: Check FEN and piece images
2. **Canvas Creation**: Generate high-res canvas
3. **Memory Check**: Validate against browser limits
4. **Quality Adjustment**: Auto-scale if needed
5. **Rendering**: Draw board, pieces, coordinates
6. **Blob Creation**: Convert to image format
7. **Download**: Trigger browser download

### Caching Strategy

- **Piece Images**: Cached per style
- **Retry Logic**: 3 attempts with delays
- **Placeholder Fallback**: Shows on failure
- **Memory Cleanup**: Automatic garbage collection

## 🐛 Troubleshooting

### Pieces Not Loading
```javascript
// Check console for errors
// Common fixes:
1. Clear browser cache
2. Try different piece style
3. Check internet connection
4. Disable ad blockers
```

### Export Fails
```javascript
// Solutions:
1. Reduce export quality
2. Reduce board size
3. Close other tabs
4. Try different format (SVG is lightest)
```

### Memory Issues
```javascript
// Best practices:
1. Use recommended quality (16x)
2. Export one at a time
3. Close unused browser tabs
4. Restart browser if needed
```

## 📊 Performance Tips

1. **Cache**: Keep same piece style for speed
2. **Quality**: Start with 16x, adjust if needed
3. **Size**: 400px is optimal for most uses
4. **Format**: PNG for quality, JPEG for size
5. **Batch**: Export 2-3 formats maximum

## 🔧 Development
```bash
# Development mode
npm start
```
## 🙏 Credits

- Lichess.org for piece images
- Chess community for testing