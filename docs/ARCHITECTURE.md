# Chess Diagram Generator - Architecture Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Canvas Rendering](#canvas-rendering)
- [Export System](#export-system)

---

## Project Overview

A React-based web application that renders chess positions from FEN notation and exports them as images using HTML5 Canvas.

**Core Principles:**
- Component-based architecture
- Functional components with hooks
- Canvas-based rendering
- Immutable state management

---

## Technology Stack

### Frontend
- **React 19.x** - UI library
- **React Hooks** - useState, useEffect, useCallback, useMemo, useRef

### Styling
- **Tailwind CSS** - Utility classes

### Browser APIs
- **HTML5 Canvas API** - Board and piece rendering
- **Blob & URL APIs** - Image export and download

---

## Project Structure
```
chess_viewer/
│
├── public/
│   └── index.html
│
├── src/
│   │
│   ├── components/
│   │   │
│   │   ├── board/
│   │   │   ├── BoardSquare.jsx
│   │   │   ├── BoardGrid.jsx
│   │   │   ├── ChessBoard.jsx
│   │   │   └── MiniChessPreview.jsx
│   │   │
│   │   ├── controls/
│   │   │   ├── atoms/
│   │   │   │   ├── FENInputField.jsx
│   │   │   │   └── FamousPositionButton.jsx
│   │   │   │
│   │   │   ├── modals/
│   │   │   │   ├── AdvancedFENInputModal.jsx
│   │   │   │   ├── ExportSettingsModal.jsx
│   │   │   │   ├── FENHistoryModal.jsx
│   │   │   │   └── ThemeModal.jsx
│   │   │   │
│   │   │   ├── ControlPanel.jsx
│   │   │   ├── BoardSizeControl.jsx
│   │   │   ├── DisplayOptions.jsx
│   │   │   ├── ExportSettings.jsx
│   │   │   ├── FENInput.jsx
│   │   │   ├── PieceSelector.jsx
│   │   │   └── ThemeSelector.jsx
│   │   │
│   │   ├── ui/
│   │   │   ├── base/
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Checkbox.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── SearchableSelect.jsx
│   │   │   │   └── RangeSlider.jsx
│   │   │   │
│   │   │   ├── color-picker/
│   │   │   │   ├── parts/
│   │   │   │   │   ├── ColorCanvas.jsx
│   │   │   │   │   ├── ColorInput.jsx
│   │   │   │   │   ├── ColorPalettes.jsx
│   │   │   │   │   ├── ColorSwatch.jsx
│   │   │   │   │   └── HueSlider.jsx
│   │   │   │   │
│   │   │   │   ├── views/
│   │   │   │   │   ├── ThemeMainView.jsx
│   │   │   │   │   ├── ThemeAdvancedPickerView.jsx
│   │   │   │   │   └── ThemeSettingsView.jsx
│   │   │   │   │
│   │   │   │   └── ColorPicker.jsx
│   │   │   │
│   │   │   ├── ActionButtons.jsx
│   │   │   ├── ExportProgress.jsx
│   │   │   ├── NotificationContainer.jsx
│   │   │   └── UserGuide.jsx
│   │   │
│   │   └── layout/
│   │       ├── Navbar.jsx
│   │       └── Footer.jsx
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── DownloadPage.jsx
│   │   └── SupportPage.jsx
│   │
│   ├── hooks/
│   │   ├── useChessBoard.js
│   │   ├── usePieceImages.js
│   │   ├── useFENHistory.js
│   │   ├── useTheme.js
│   │   ├── useNotifications.js
│   │   ├── useColorState.js
│   │   ├── useColorConversion.js
│   │   ├── useCanvasPicker.js
│   │   └── useOutsideClick.js
│   │
│   ├── utils/
│   │   ├── fenParser.js
│   │   ├── colorUtils.js
│   │   ├── coordinateCalculations.js
│   │   ├── canvasExporter.js
│   │   └── imageOptimizer.js
│   │
│   ├── constants/
│   │   └── chessConstants.js
│   │
│   ├── routes/
│   │   └── Router.jsx
│   │
│   ├── App.jsx
│   ├── index.js
│   └── index.css
│
├── package.json
└── README.md
```

---

## Core Components

### App.jsx
Root component that manages global state.

**Key State:**
```javascript
const [fen, setFen] = useState(STARTING_FEN);
const [boardTheme, setBoardTheme] = useState('brown');
const [pieceSet, setPieceSet] = useState('cburnett');
const [flipped, setFlipped] = useState(false);
const [showCoords, setShowCoords] = useState(true);
```

### ChessBoard.jsx
Renders the chess board using HTML5 Canvas.

**Responsibilities:**
- Parse FEN string
- Draw board squares
- Render pieces from images
- Draw coordinates (a-h, 1-8)
- Handle board flipping

**Key Methods:**
- `drawBoard()` - Renders squares
- `drawPieces()` - Draws piece images
- `drawCoordinates()` - Adds labels
- `clearCanvas()` - Clears before redraw

**Canvas Dimensions:**
- Default: 400×400 px
- Export: Up to 12,800×12,800 px (32× scale)

### ControlPanel.jsx
UI controls for board manipulation.

**Features:**
- Flip board
- Toggle coordinates
- Reset position
- Quick actions

### FenInput.jsx
Input field with FEN validation.

**Features:**
- Real-time validation
- Error messages
- Copy/paste support
- Debounced validation (300ms)

**Validation Rules:**
- Correct piece notation (prnbqkPRNBQK)
- 8 ranks separated by `/`
- Numbers for empty squares
- Valid active color (w/b)
- Valid castling rights (KQkq)

### ThemeSelector.jsx
Board color theme selector.

**Available Themes:**
- Brown (classic)
- Blue
- Green
- Wood
- Grey
- Purple
- Red
- Orange
- Pink
- Marble
- Neon
- High Contrast

**Theme Structure:**
```javascript
{
  name: 'Brown',
  light: '#f0d9b5',
  dark: '#b58863'
}
```

### PieceSelector.jsx
Chess piece style selector.

**Available Sets:**
- Alpha
- CBurnett (default)
- Merida
- Leipzig
- Companion
- Fantasy
- Spatial
- Shapes
- Pixel
- Maestro
- Governor
- Cardinal
- And more...

### ExportPanel.jsx
Image export controls.

**Features:**
- Format selection (PNG/JPEG)
- Scale slider (8×–32×)
- Resolution preview
- File size estimate
- Download button

**Export Options:**
```javascript
{
  format: 'png' | 'jpeg',
  scale: 8 | 16 | 24 | 32,
  quality: 0.95 // for JPEG
}
```

---

## Data Flow

### User Interaction Flow:
```
User Action → Event Handler → State Update → Component Re-render → Canvas Redraw
```

### Example: Changing Theme

1. User selects theme
2. `setBoardTheme('blue')` updates state
3. React re-renders `ChessBoard`
4. `useEffect` detects change
5. Canvas redraws with new colors

### Example: Exporting Image

1. User clicks "Export PNG"
2. Create temporary canvas
3. Scale canvas (e.g., 16× = 6,400×6,400 px)
4. Redraw at high resolution
5. Convert to blob: `canvas.toBlob()`
6. Download via `URL.createObjectURL()`
7. Temporary canvas is disposed

---

## State Management

### State Location

**Local Component State:**
- UI state (modals, dropdowns)
- Temporary values
- Animation states

**Lifted State (App.jsx):**
- FEN string
- Board theme
- Piece set
- Board orientation
- Coordinate visibility

**Pattern:**
- Simple prop drilling (2-3 levels)
- No global state library needed
- Immutable updates only

### State Update Pattern

All state updates use immutable patterns:
```javascript
// ✅ Correct
setFen(newFen);

// ❌ Wrong (mutating state)
fen = newFen;
```

---

## Canvas Rendering

### Rendering Pipeline

The board is rendered in layers:

1. **Background Layer** - Board squares
2. **Coordinate Layer** - File/rank labels
3. **Piece Layer** - Chess pieces

### Drawing Board Squares
```javascript
for (let rank = 0; rank < 8; rank++) {
  for (let file = 0; file < 8; file++) {
    const isLight = (rank + file) % 2 === 0;
    ctx.fillStyle = isLight ? theme.light : theme.dark;
    ctx.fillRect(file * squareSize, rank * squareSize, squareSize, squareSize);
  }
}
```

### Drawing Pieces
```javascript
const pieceImage = new Image();
pieceImage.src = `/pieces/${pieceSet}/${pieceName}.png`;
pieceImage.onload = () => {
  ctx.drawImage(pieceImage, x, y, size, size);
};
```

### Coordinate System

- **Files**: a-h (left to right)
- **Ranks**: 8-1 (top to bottom in FEN, bottom to top visually)
- **Flipped board**: Reverses both axes

---

## Export System

### High-Resolution Export

The export engine creates a temporary off-screen canvas:
```javascript
const exportCanvas = document.createElement('canvas');
const scale = 16; // 8×, 16×, 24×, or 32×
exportCanvas.width = 400 * scale;
exportCanvas.height = 400 * scale;
const ctx = exportCanvas.getContext('2d');
ctx.scale(scale, scale);

// Draw board at high resolution
drawBoard(ctx);
drawPieces(ctx);

// Export
exportCanvas.toBlob((blob) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'chess-position.png';
  link.click();
}, 'image/png');
```

### Resolution Scaling

| Scale | Resolution      | Use Case        |
|-------|-----------------|-----------------|
| 8×    | 3,200×3,200     | Web/Social      |
| 16×   | 6,400×6,400     | HD/Presentations|
| 24×   | 9,600×9,600     | Print (300 DPI) |
| 32×   | 12,800×12,800   | Large Posters   |

---

## Performance

### Optimization Techniques:

1. **Memoization**
   - `useMemo` for expensive calculations
   - `useCallback` for event handlers

2. **Canvas Optimization**
   - Only redraw when state changes
   - Use `requestAnimationFrame` for smooth updates
   - Clear canvas efficiently: `clearRect()`

3. **Image Preloading**
   - Preload all piece images on mount
   - Cache loaded images in memory

4. **Debouncing**
   - FEN validation debounced (300ms)
   - Export button disabled during processing

5. **Lazy Rendering**
   - Coordinates only drawn when enabled
   - Hidden UI elements not rendered

### Memory Management

- Dispose of temporary canvases after export
- Revoke blob URLs: `URL.revokeObjectURL()`
- Remove event listeners on unmount

---

## Browser Compatibility

Modern browsers with Canvas API support should work. Application uses standard HTML5 features.

---

**Last Updated:** January 2026