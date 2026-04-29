# FENForsty Pro — Architecture Documentation

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Routing](#routing)
- [Canvas Rendering](#canvas-rendering)
- [Export System](#export-system)

---

## Project Overview

A React-based web application that renders chess positions from FEN notation, supports interactive drag-and-drop board editing, and exports high-resolution images via HTML5 Canvas.

**Core Principles:**

- Component-based architecture with feature-domain grouping
- Functional components with React hooks exclusively
- Canvas-based board rendering and image export
- Zero-backend — all state persisted in localStorage
- Lazy-loaded pages for faster initial load
- Dual context providers for theme settings and FEN batch processing

---

## Technology Stack

### Frontend

- **React 19.x** — UI library with hooks
- **React Router DOM 7.x** — Client-side routing
- **Framer Motion 12.x** — Animations
- **React DnD 16.x** — Drag-and-drop piece interaction
- **react-window 2.x** — Virtualised list rendering for history
- **Lucide React / React Icons** — Icon libraries

### Styling

- **Tailwind CSS 3.x** — Utility-first CSS
- **PostCSS / Autoprefixer** — CSS build pipeline

### Build & Tooling

- **Vite 6.x** — Build tool and dev server
- **ESLint 9.x** with React/hooks plugins — Linting
- **Prettier** — Code formatting
- **Husky + lint-staged** — Pre-commit hooks
- **commitlint** — Conventional commit enforcement

### Browser APIs

- **HTML5 Canvas API** — Board rendering and image export
- **Blob & URL APIs** — Image download
- **localStorage** — State persistence
- **Clipboard API** — Copy image to clipboard

---

## Project Structure

```
chessviewer/
│
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── robots.txt
│   └── sitemap.xml
│
├── src/
│   ├── App.jsx                # Root component — light/dark theme & layout
│   ├── index.jsx              # Application entry point
│   ├── index.css              # Global styles
│   │
│   ├── routes/
│   │   └── Router.jsx         # React Router with lazy-loaded pages
│   │
│   ├── pages/                 # Page-level components
│   │   ├── HomePage.jsx       # Main board + controls
│   │   ├── AboutPage.jsx      # About / credits
│   │   ├── DownloadPage.jsx   # PWA install guide
│   │   ├── SupportPage.jsx    # Help & support
│   │   ├── SettingsPage.jsx   # Application settings
│   │   ├── FENHistoryPage.jsx # FEN history browser
│   │   ├── AdvancedFENInputPage.jsx # Multi-FEN batch editor
│   │   ├── ThemeCustomizerPage.jsx  # Full-page theme editor
│   │   ├── NotFoundPage.jsx   # 404 page
│   │   ├── index.js
│   │   └── settings/
│   │       ├── ExportCustomization.jsx
│   │       ├── ThemeCustomization.jsx
│   │       └── index.js
│   │
│   ├── components/
│   │   ├── index.js
│   │   │
│   │   ├── board/             # Chess board rendering components
│   │   │   ├── BoardGrid/     # Board grid layout
│   │   │   ├── BoardSquare/   # Individual square
│   │   │   ├── ChessBoard/    # Main board with canvas rendering
│   │   │   ├── MiniPreview/   # Thumbnail preview for history
│   │   │   └── index.js
│   │   │
│   │   ├── features/          # Feature-domain components
│   │   │   ├── ActionButtons/ # Export / copy action buttons
│   │   │   ├── ClipboardHistory/ # Clipboard copy history
│   │   │   ├── ColorPicker/   # Board color picker
│   │   │   │   ├── parts/     # ColorCanvas, HueSlider, ColorInput, etc.
│   │   │   │   ├── views/     # ThemeMainView, ThemeAdvancedPickerView, ThemeSettingsView
│   │   │   │   └── PickerModal.jsx
│   │   │   ├── ControlPanel/  # Board controls (flip, reset, etc.)
│   │   │   ├── DisplayOptions/ # Show/hide display options
│   │   │   ├── Export/        # Export settings, progress, size control
│   │   │   │   ├── BoardSizeControl/
│   │   │   │   ├── ExportOptionsDialog/
│   │   │   │   ├── ExportProgress/
│   │   │   │   ├── ExportSettings/
│   │   │   │   └── index.js
│   │   │   ├── Fen/           # FEN input and related components
│   │   │   │   ├── BoardPreview/
│   │   │   │   ├── FENInputField/
│   │   │   │   ├── FENInputList/
│   │   │   │   ├── PieceSelector/
│   │   │   │   └── index.js
│   │   │   ├── HelpCenter/    # In-app help panel
│   │   │   ├── History/       # FEN history UI
│   │   │   │   ├── ConfirmationModal/
│   │   │   │   ├── HistoryFilters/
│   │   │   │   ├── StatusBadge/
│   │   │   │   └── index.js
│   │   │   ├── Theme/         # Theme preset selector
│   │   │   │   └── ThemeSelector.jsx
│   │   │   ├── UserGuide/     # Onboarding user guide
│   │   │   └── index.js
│   │   │
│   │   ├── interactions/      # Drag-and-drop interaction components
│   │   │   ├── ChessEditor/   # Full interactive board editor
│   │   │   ├── CustomDragLayer/ # Custom DnD drag preview layer
│   │   │   ├── DndProvider/   # React DnD context (HTML5 + touch backends)
│   │   │   ├── DraggablePiece/ # Draggable piece wrapper
│   │   │   ├── DroppableSquare/ # Droppable board square
│   │   │   ├── InteractiveBoard/ # Board with drag-and-drop enabled
│   │   │   ├── PiecePalette/  # Piece selection palette for board editing
│   │   │   ├── TrashZone/     # Drop zone to remove pieces
│   │   │   └── index.js
│   │   │
│   │   ├── layout/            # App-level layout components
│   │   │   ├── Navbar/        # Navigation bar (hidden on tool pages)
│   │   │   └── index.js
│   │   │
│   │   └── ui/                # Reusable UI primitives
│   │       ├── Badge/
│   │       ├── Button/
│   │       ├── Card/
│   │       ├── Checkbox/
│   │       ├── CustomSelect/
│   │       ├── DatePicker/
│   │       ├── ErrorBoundary/
│   │       ├── Input/
│   │       ├── Modal/
│   │       ├── NotificationContainer/
│   │       ├── RangeSlider/
│   │       ├── SearchableSelect/
│   │       ├── Select/
│   │       └── index.js
│   │
│   ├── contexts/              # React context providers
│   │   ├── ThemeSettingsContext.jsx  # Color picker settings & recent colors
│   │   ├── FENBatchContext.jsx       # Batch FEN list with localStorage
│   │   └── index.js
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useCanvasPicker.js
│   │   ├── useChessBoard.js
│   │   ├── useColorConversion.js
│   │   ├── useColorState.js
│   │   ├── useFENHistory.js
│   │   ├── useInteractiveBoard.js
│   │   ├── useIntersectionObserver.js
│   │   ├── useLocalStorage.js
│   │   ├── useNotifications.js
│   │   ├── useOutsideClick.js
│   │   ├── usePerformance.js
│   │   ├── usePieceImages.js
│   │   ├── useScrollLock.js
│   │   ├── useTheme.js
│   │   └── index.js
│   │
│   ├── utils/                 # Pure utility functions
│   │   ├── advancedExport.js
│   │   ├── archiveManager.js
│   │   ├── boardUtils.js
│   │   ├── canvasExporter.js
│   │   ├── classNames.js
│   │   ├── colorUtils.js
│   │   ├── coordinateCalculations.js
│   │   ├── errorHandler.js
│   │   ├── eventUtils.js
│   │   ├── fenParser.js
│   │   ├── historyUtils.js
│   │   ├── imageOptimizer.js
│   │   ├── logger.js
│   │   ├── performance.js
│   │   ├── pieceImageCache.js
│   │   ├── validation.js
│   │   └── index.js
│   │
│   └── constants/
│       ├── chessConstants.js  # Piece sets, FEN defaults, board constants
│       ├── dragDropConstants.js # DnD item types
│       └── index.js
│
├── docs/                      # Documentation
├── dist/                      # Vite build output (gitignored)
├── index.html                 # HTML entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
├── jsconfig.json              # Path alias (@/ → src/)
└── eslint.config.js
```

---

## Architecture Principles

### 1. Feature-Based Component Organisation

Components are grouped by feature domain inside `src/components/features/`:

| Group              | Contents                                                    |
| ------------------ | ----------------------------------------------------------- |
| `ActionButtons`    | Primary export/copy action buttons                          |
| `ClipboardHistory` | Clipboard copy history panel                                |
| `ColorPicker`      | Board color picker with views and parts                     |
| `ControlPanel`     | Board flip, reset, and control buttons                      |
| `DisplayOptions`   | Coordinates, labels display toggles                         |
| `Export`           | Export settings, dialog, progress, size control             |
| `Fen`              | FEN input field, input list, board preview, piece selector  |
| `HelpCenter`       | In-app help content                                         |
| `History`          | FEN history list, filters, status badge, confirmation modal |
| `Theme`            | Board theme preset selector                                 |
| `UserGuide`        | First-time user onboarding guide                            |

### 2. Separation of Concerns

- **`ui/`** — Pure UI primitives (Button, Modal, Input, etc.) with no business logic
- **`board/`** — Chess board rendering components
- **`interactions/`** — Drag-and-drop board editing layer
- **`features/`** — Domain-specific feature panels
- **`layout/`** — App shell components (Navbar)
- **`hooks/`** — Stateful logic extracted into reusable hooks
- **`utils/`** — Pure, side-effect-free functions
- **`contexts/`** — React contexts for cross-tree state sharing

### 3. Barrel Exports

Every directory has an `index.js` for clean, stable imports:

```javascript
// Example
import { Button, Modal } from '@/components/ui';
import { FENInputField } from '@/components/features/Fen';
import { useChessBoard, useFENHistory } from '@/hooks';
```

### 4. Path Aliases

`jsconfig.json` defines `@/` as an alias for `src/`, used consistently throughout:

```javascript
import { parseFEN } from '@/utils';
import { ChessBoard } from '@/components/board';
```

---

## Core Components

### App.jsx

Root application component. Responsibilities:

- Manages light/dark color-scheme state (`theme`: `'light' | 'dark'`)
- Reads initial theme from `window.__INITIAL_THEME__` → localStorage → `prefers-color-scheme`
- Applies `data-theme` attribute to `<html>` via `useLayoutEffect`
- Wraps the app in `<ThemeSettingsProvider>` and `<FENBatchProvider>`
- Renders `<Navbar>` conditionally (hidden on tool pages: `/settings`, `/fen-history`, `/advanced-fen`)
- Contains skip-to-main-content link for keyboard accessibility

```javascript
const TOOL_PAGES = ['/settings', '/fen-history', '/advanced-fen'];
```

### Router.jsx

All pages are lazy-loaded with `React.lazy` and wrapped in a single `<Suspense>` boundary with a chess-themed loading spinner. Routes:

| Path            | Component              |
| --------------- | ---------------------- |
| `/`             | `HomePage`             |
| `/about`        | `AboutPage`            |
| `/download`     | `DownloadPage`         |
| `/support`      | `SupportPage`          |
| `/settings`     | `SettingsPage`         |
| `/fen-history`  | `FENHistoryPage`       |
| `/advanced-fen` | `AdvancedFENInputPage` |
| `*`             | `NotFoundPage`         |

### ChessBoard.jsx

Renders the chess board using HTML5 Canvas.

**Responsibilities:**

- Accepts a FEN string, parses it via `useChessBoard`, and draws pieces on canvas
- Draws board squares with configurable light/dark colors
- Draws piece images loaded via `usePieceImages`
- Optionally draws rank/file coordinate labels
- Handles board flipping (renders from Black's perspective)

### ChessEditor (interactions/)

Full interactive board editor combining `InteractiveBoard`, `PiecePalette`, and `TrashZone`. Uses React DnD for drag-and-drop piece movement. Driven by `useInteractiveBoard` hook which maintains an 8×8 board array and converts it to/from FEN via `boardUtils.boardToFEN`.

---

## Data Flow

```
User Input (FEN text / drag-drop)
        │
        ▼
   Validation (utils/validation.js)
        │
        ▼
   State Update (hook setState / context dispatch)
        │
        ├─────────────────────────┐
        ▼                         ▼
  Component re-render       localStorage persist
        │                         (debounced 300ms)
        ▼
  Canvas re-draw
  (ChessBoard / canvasExporter)
```

---

## State Management

See [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md) for the full guide.

**Summary:**

| Layer            | Tool         | Examples                       |
| ---------------- | ------------ | ------------------------------ |
| Component state  | `useState`   | Modal open/close, form values  |
| Derived state    | `useMemo`    | Parsed FEN → board array       |
| Cross-tree state | Context API  | Theme settings, FEN batch list |
| Persistence      | localStorage | FEN history, theme, settings   |
| Drag state       | React DnD    | Piece being dragged            |

---

## Canvas Rendering

### Display Rendering (ChessBoard)

- Canvas size determined by the `size` prop (pixels)
- Board drawn with `fillRect` per square
- Pieces drawn with `drawImage` from cached HTMLImageElements
- Coordinate labels drawn with `fillText`

### Export Rendering (canvasExporter)

- A separate off-screen canvas is created at export dimensions
- Export dimensions calculated via `calculateExportSize` from `coordinateCalculations.js`
- Supports pause/resume/cancel via module-level `exportState` object
- Progress reported via `onProgress(0–100)` callback

**Quality levels and maximum resolutions:**

| Mode   | Quality | Max Resolution                           |
| ------ | ------- | ---------------------------------------- |
| Print  | 8×      | ~3,776–7,552 px depending on board size  |
| Print  | 16×     | ~5,664–15,104 px depending on board size |
| Social | 24×     | 18,112 × 18,112 px                       |
| Social | 32×     | 24,192 × 24,192 px                       |

---

## Export System

See [EXPORT_PIPELINE.md](EXPORT_PIPELINE.md) for the full technical reference.

**Flow:**

1. User configures quality, format (PNG/JPEG), and board size in `ExportSettings`
2. `ActionButtons` triggers `exportBoardAsImage` from `canvasExporter.js`
3. `ExportProgress` displays real-time progress via callback
4. On completion the image is downloaded via `<a download>` or copied to clipboard via the Clipboard API
5. For batch export, `advancedExport.js` iterates the FEN list from `FENBatchContext`

---

**Last Updated:** March 3, 2026  
**Version:** 5.0.0
