# 🏗️ Chess Diagram Generator - Architecture Documentation

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Rendering Engine](#rendering-engine)
- [Export System](#export-system)
- [Performance Optimization](#performance-optimization)
- [Browser Compatibility](#browser-compatibility)
- [Future Architecture Plans](#future-architecture-plans)

---

## 🎯 Project Overview

Chess Diagram Generator is a React-based single-page application (SPA) that renders chess positions from FEN notation and exports them as high-quality images. The architecture prioritizes performance, modularity, and extensibility.

**Core Principles:**
- Component-based architecture
- Separation of concerns
- Pure functional components with hooks
- Canvas-based rendering for high performance
- Immutable state management
- Responsive and accessible design

---

## 🛠️ Technology Stack

### Frontend Framework
- **React 18.x** - UI library with hooks
- **React Hooks** - useState, useEffect, useCallback, useMemo, useRef

### Styling
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Custom CSS** - Canvas rendering styles

### Build Tools
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting
- **Prettier** - Code formatting

### APIs & Browser Features
- **HTML5 Canvas API** - Board and piece rendering
- Blob & URL APIs - Image export and download
- **LocalStorage API** - Settings persistence (optional)

### Package Manager
- **npm** or **yarn**

---

## 📁 Project Structure

```
chess_viewer/
│
├── 📂 public/
│   ├── index.html
│
├── 📂 src/
│   │
│   ├── 📂 components/
│   │   │
│   │   ├── 📂 board/              # Chess Board Rendering
│   │   │   ├── BoardSquare.jsx    # Single square component (memoized)
│   │   │   ├── BoardGrid.jsx      # 8×8 grid layout
│   │   │   ├── ChessBoard.jsx     # Main board with Canvas rendering
│   │   │   ├── MiniChessPreview.jsx # Thumbnail for history
│   │   │   └── index.js
│   │   │
│   │   ├── 📂 controls/           # Control Panel System
│   │   │   │
│   │   │   ├── 📂 atoms/          # Atomic components
│   │   │   │   ├── FENInputField.jsx
│   │   │   │   ├── FamousPositionButton.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── 📂 modals/         # Modal dialogs
│   │   │   │   ├── AdvancedFENInputModal.jsx
│   │   │   │   ├── ExportSettingsModal.jsx
│   │   │   │   ├── FENHistoryModal.jsx
│   │   │   │   ├── ThemeModal.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── ControlPanel.jsx   # Main control container
│   │   │   ├── BoardSizeControl.jsx
│   │   │   ├── DisplayOptions.jsx
│   │   │   ├── ExportSettings.jsx
│   │   │   ├── FENInput.jsx
│   │   │   ├── PieceSelector.jsx
│   │   │   ├── ThemeSelector.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── 📂 ui/                 # Reusable UI Components
│   │   │   │
│   │   │   ├── 📂 base/           # Base components
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Checkbox.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── SearchableSelect.jsx
│   │   │   │   ├── RangeSlider.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── 📂 color-picker/   # Advanced color picker
│   │   │   │   │
│   │   │   │   ├── 📂 parts/      # Picker components
│   │   │   │   │   ├── ColorCanvas.jsx
│   │   │   │   │   ├── ColorInput.jsx
│   │   │   │   │   ├── ColorPalettes.jsx
│   │   │   │   │   ├── ColorSwatch.jsx
│   │   │   │   │   ├── HueSlider.jsx
│   │   │   │   │   ├── PrimaryActions.jsx
│   │   │   │   │   ├── SelectedPreview.jsx
│   │   │   │   │   ├── ThemePresetCard.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── 📂 views/      # Picker views
│   │   │   │   │   ├── ThemeMainView.jsx
│   │   │   │   │   ├── ThemeAdvancedPickerView.jsx
│   │   │   │   │   ├── ThemeSettingsView.jsx
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   ├── ColorPicker.jsx
│   │   │   │   ├── PickerModal.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── ActionButtons.jsx
│   │   │   ├── ExportProgress.jsx
│   │   │   ├── NotificationContainer.jsx
│   │   │   ├── UserGuide.jsx
│   │   │   └── index.js
│   │   │
│   │   └── 📂 layout/             # Layout components
│   │       ├── Navbar.jsx
│   │       ├── Footer.jsx
│   │       └── index.js
│   │
│   ├── 📂 pages/                  # Application pages
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── DownloadPage.jsx
│   │   ├── SupportPage.jsx
│   │   └── index.js
│   │
│   ├── 📂 hooks/                  # Custom React hooks
│   │   ├── useChessBoard.js       # FEN parsing & validation
│   │   ├── usePieceImages.js      # Image loading & caching
│   │   ├── useFENHistory.js       # History management
│   │   ├── useTheme.js            # Theme state
│   │   ├── useNotifications.js    # Toast system
│   │   ├── useLocalStorage.js     # Persistent storage
│   │   ├── useColorState.js       # Color picker state
│   │   ├── useColorConversion.js  # Color utilities
│   │   ├── useCanvasPicker.js     # Canvas interactions
│   │   ├── useOutsideClick.js     # Click outside detection
│   │   └── index.js
│   │
│   ├── 📂 utils/                  # Utility functions
│   │   ├── fenParser.js           # FEN validation & parsing
│   │   ├── colorUtils.js          # Color conversions
│   │   ├── coordinateCalculations.js # Board coordinates
│   │   ├── canvasExporter.js      # Export logic
│   │   ├── imageOptimizer.js      # Canvas optimization
│   │   └── index.js
│   │
│   ├── 📂 constants/              # Application constants
│   │   ├── chessConstants.js      # Piece sets, themes, positions
│   │   └── index.js
│   │
│   ├── 📂 routes/                 # Routing configuration
│   │   └── Router.jsx
│   │
│   ├── App.jsx                    # Root component
│   ├── index.js                   # Entry point
│   └── index.css                  # Global styles
│
├── 📄 .env                        # Environment variables
├── 📄 .gitignore
├── 📄 postcss.config.js
├── 📄 tailwind.config.js
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 vercel.json                 # Vercel deployment config
├── 📄 README.md
├── 📄 CONTRIBUTING.md
├── 📄 ARCHITECTURE.md
├── 📄 SECURITY.md
├── 📄 CODE_OF_CONDUCT.md
└── 📄 LICENSE
```

---

## 🧩 Core Components

### 1. **App.jsx**
Root component that orchestrates the entire application.

**Responsibilities:**
- Initialize application state
- Compose child components
- Handle global state updates
- Manage theme persistence

**Key State:**
```javascript
const [fen, setFen] = useState(STARTING_FEN);
const [boardTheme, setBoardTheme] = useState('brown');
const [pieceSet, setPieceSet] = useState('cburnett');
const [flipped, setFlipped] = useState(false);
const [showCoords, setShowCoords] = useState(true);
```

---

### 2. **ChessBoard.jsx**
The core component that renders the chess board using HTML5 Canvas.

**Responsibilities:**
- Parse FEN string
- Draw board squares
- Render pieces from image assets
- Draw coordinates (a-h, 1-8)
- Handle board flipping
- Manage canvas context

**Key Methods:**
- `drawBoard()` - Renders squares with alternating colors
- `drawPieces()` - Loads and draws piece images
- `drawCoordinates()` - Adds file/rank labels
- `clearCanvas()` - Clears canvas before redraw

**Canvas Dimensions:**
- Default: 800×800 px
- Export: Up to 12,800×12,800 px (32× scale)

---

### 3. **ControlPanel.jsx**
UI controls for board manipulation.

**Features:**
- Flip board button
- Toggle coordinates
- Reset to starting position
- Quick actions toolbar

**Props:**
```javascript
{
  onFlip: () => void,
  onToggleCoords: () => void,
  onReset: () => void,
  flipped: boolean,
  showCoords: boolean
}
```

---

### 4. **FenInput.jsx**
Input field with validation for FEN strings.

**Features:**
- Real-time FEN validation
- Error messages for invalid FEN
- Copy/paste support
- Debounced validation (300ms)

**Validation Rules:**
- Correct piece notation (prnbqkPRNBQK)
- 8 ranks separated by `/`
- Numbers for empty squares
- Valid active color (w/b)
- Valid castling rights (KQkq)

---

### 5. **ThemeSelector.jsx**
Dropdown or grid selector for board color themes.

**Included Themes:**
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

---

### 6. **PieceSelector.jsx**
Selector for chess piece styles.

**Available Sets:**
- Alpha
- CBurnett (default)
- Merida
- Leipzig
- Companion
- Fantasy
- Spatial
- Reillycraig
- Shapes
- Staunty
- Fresca
- Cardinal
- Gioco
- Tatiana
- Governor
- Horsey
- Pixel
- Maestro
- Chessnut
- Letter

---

### 7. **ExportPanel.jsx**
Control panel for exporting images.

**Features:**
- Format selection (PNG/JPEG)
- Quality/scale slider (4×–32×)
- Resolution preview
- File size estimate
- Download button

**Export Options:**
```javascript
{
  format: 'png' | 'jpeg',
  scale: 4 | 8 | 16 | 32,
  quality: 0.95 // for JPEG
}
```

---

### 8. **PresetSelector.jsx**
Quick access to famous chess positions.

**Included Positions:**
- Starting position
- Scholar's Mate
- Fool's Mate
- Immortal Game position
- Opera Game position
- Légal Trap
- Back rank mate
- Smothered mate pattern
- King and Queen endgame

---

## 🔄 Data Flow

### Typical User Interaction Flow:

```
User Action → Event Handler → State Update → Component Re-render → Canvas Redraw
```

### Example: Changing Board Theme

1. User clicks theme in `ThemeSelector`
2. `onChange` event fires
3. `setBoardTheme('blue')` updates state
4. React re-renders `ChessBoard`
5. `useEffect` detects theme change
6. Canvas is cleared and redrawn with new colors

### Example: Exporting Image

1. User clicks "Export PNG" in `ExportPanel`
2. Export handler creates temporary canvas
3. Canvas is scaled (e.g., 8× = 6400×6400 px)
4. Board and pieces are redrawn at high resolution
5. Canvas converted to blob: `canvas.toBlob()`
6. Blob downloaded via `URL.createObjectURL()`
7. Temporary canvas is disposed

---

## 🎨 State Management

### State Location Strategy

**Local Component State:**
- UI-only state (modals, dropdowns)
- Temporary input values
- Animation states

**Lifted State (App.jsx):**
- FEN string (global position)
- Board theme (affects multiple components)
- Piece set (affects rendering)
- Board orientation (flipped)
- Coordinate visibility

**No Global State Library:**
- Application is simple enough for prop drilling
- Context API not needed (only 2-3 prop levels)
- Avoids Redux/Zustand complexity

### State Update Pattern

All state updates use immutable patterns:

```javascript
// ✅ Correct
setFen(newFen);

// ❌ Wrong (mutating state)
fen = newFen;
```

---

## 🎨 Rendering Engine

### Canvas Rendering Pipeline

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

## 📤 Export System

### High-Resolution Export

The export engine creates a temporary off-screen canvas:

```javascript
const exportCanvas = document.createElement('canvas');
const scale = 8; // 8× resolution
exportCanvas.width = 800 * scale;
exportCanvas.height = 800 * scale;
const ctx = exportCanvas.getContext('2d');
ctx.scale(scale, scale);

// Draw board at high resolution
drawBoard(ctx, ...);
drawPieces(ctx, ...);

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

| Scale | Resolution | Use Case |
|-------|-----------|----------|
| 4×    | 3200×3200 | Web thumbnails |
| 8×    | 6400×6400 | Social media |
| 16×   | 12800×12800 | Print (300 DPI) |
| 32×   | 25600×25600 | Large posters |

---

## ⚡ Performance Optimization

### Techniques Used:

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

## 🌐 Browser Compatibility

### Supported Browsers:

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Required Features:

- HTML5 Canvas API
- ES6+ JavaScript
- CSS Grid/Flexbox
- Blob API
- File download API

### Progressive Enhancement:

- Graceful degradation for older browsers
- Fallback messages for unsupported features

---

## 🚀 Future Architecture Plans

### Planned Improvements:

1. **Component Library**
   - Extract components into reusable library
   - Publish as npm package

2. **WebAssembly**
   - Port rendering engine to Rust/WASM
   - 10× faster export for ultra-high resolutions

3. **Web Workers**
   - Offload export processing to background thread
   - Non-blocking UI during export

4. **IndexedDB**
   - Store custom themes and piece sets
   - Cache position history

5. **Service Worker**
   - Offline functionality
   - PWA support

6. **TypeScript Migration**
   - Add type safety
   - Better IDE support

7. **Testing**
   - Unit tests (Jest + React Testing Library)
   - E2E tests (Playwright)
   - Visual regression tests

8. **Accessibility**
   - ARIA labels for screen readers
   - Keyboard navigation
   - Focus management

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────┐
│              Browser                     │
│  ┌───────────────────────────────────┐  │
│  │         React App (SPA)           │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │       App.jsx (Root)        │  │  │
│  │  │  ┌───────────┬───────────┐  │  │  │
│  │  │  │Components │   Utils   │  │  │  │
│  │  │  ├───────────┼───────────┤  │  │  │
│  │  │  │ChessBoard │fenParser  │  │  │  │
│  │  │  │Controls   │renderer   │  │  │  │
│  │  │  │FenInput   │exporter   │  │  │  │
│  │  │  │Selectors  │themes     │  │  │  │
│  │  │  └───────────┴───────────┘  │  │  │
│  │  └─────────────────────────────┘  │  │
│  │         │                          │  │
│  │         ▼                          │  │
│  │  ┌─────────────────┐              │  │
│  │  │ Canvas API      │              │  │
│  │  │ (Rendering)     │              │  │
│  │  └─────────────────┘              │  │
│  │         │                          │  │
│  │         ▼                          │  │
│  │  ┌─────────────────┐              │  │
│  │  │ Blob/File API   │              │  │
│  │  │ (Export)        │              │  │
│  │  └─────────────────┘              │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 🤝 Contributing to Architecture

When proposing architectural changes:

1. Open an issue describing the problem
2. Discuss trade-offs and alternatives
3. Create a proof-of-concept
4. Submit PR with updated documentation
5. Update this ARCHITECTURE.md file

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Canvas API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [FEN Notation Standard](https://www.chess.com/terms/fen-chess)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Last Updated:** January 2026  
**Maintained by:** @BilgeGates
