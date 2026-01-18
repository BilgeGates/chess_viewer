# State Management Documentation

Guide to state management architecture in Chess Diagram Generator.

---

## Table of Contents

- [Overview](#-overview)
- [State Architecture](#-state-architecture)
- [Global State](#-global-state)
- [Component State](#-component-state)
- [Derived State](#-derived-state)
- [State Persistence](#-state-persistence)
- [State Updates](#-state-updates)
- [Performance Optimization](#-performance-optimization)
- [Best Practices](#-best-practices)
- [Common Patterns](#-common-patterns)

---

## Overview

### Philosophy
Chess Diagram Generator uses **React Hooks only** for state management - no external libraries (Redux, MobX, Zustand, etc.).

**Reasons:**
- Application state is relatively simple
- React's built-in tools are sufficient
- Smaller bundle size
- Less complexity for contributors

### State Categories

```
State Types
│
├── Component State (useState)
│   ├── UI state (modals, dropdowns)
│   ├── Form inputs
│   └── Temporary values
│
├── Global State (Context API)
│   ├── Board configuration
│   ├── User preferences
│   └── Application settings
│
├── Persisted State (localStorage)
│   ├── History
│   ├── Favorites
│   └── Settings
│
└── Derived State (useMemo)
    ├── Parsed FEN
    ├── Board array
    └── Computed values
```

---

## State Architecture

### High-Level State Flow

```
┌─────────────────────────────────────────┐
│           User Interactions             │
│  (clicks, types, selects options)       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         Event Handlers                  │
│  (onClick, onChange, onSubmit)          │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│      State Update Functions             │
│  (setState, setters from hooks)         │
└──────────────────┬──────────────────────┘
                   │
                   ├──────────────────────┐
                   │                      │
                   ▼                      ▼
         ┌─────────────────┐    ┌──────────────────┐
         │  Component      │    │  localStorage    │
         │  Re-render      │    │  Persistence     │
         └────────┬────────┘    └──────────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │  Canvas         │
         │  Re-draw        │
         └─────────────────┘
```

---

## Global State

### Board Configuration State

Located in `src/hooks/useChessBoard.js`

```javascript
const useChessBoard = () => {
  // Core board state
  const [fen, setFen] = useState(DEFAULT_FEN);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [boardSize, setBoardSize] = useState(800);
  
  // Parse FEN into board array (derived state)
  const board = useMemo(() => parseFEN(fen), [fen]);
  
  // Validation state
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  return {
    fen,
    setFen,
    board,
    isFlipped,
    setIsFlipped,
    showCoordinates,
    setShowCoordinates,
    boardSize,
    setBoardSize,
    isValid,
    errorMessage
  };
};
```

**State Properties:**

| Property | Type | Default | Purpose |
|----------|------|---------|---------|
| `fen` | string | Starting position | Current board position |
| `isFlipped` | boolean | false | Board orientation |
| `showCoordinates` | boolean | true | Show rank/file labels |
| `boardSize` | number | 800 | Display size in pixels |
| `board` | Array[8][8] | - | Parsed board array |
| `isValid` | boolean | true | FEN validity |
| `errorMessage` | string | '' | Validation error |

---

### Theme State

Located in `src/hooks/useTheme.js`

```javascript
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Load from localStorage or use default
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  });
  
  const [pieceSet, setPieceSet] = useState(() => {
    const saved = localStorage.getItem('pieceSet');
    return saved || 'alpha';
  });
  
  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('pieceSet', pieceSet);
  }, [pieceSet]);
  
  return {
    theme,
    setTheme,
    pieceSet,
    setPieceSet
  };
};
```

**Theme Structure:**

```javascript
const theme = {
  id: 'classic',
  name: 'Classic',
  lightSquare: '#f0d9b5',
  darkSquare: '#b58863',
  coordinateColor: '#000000',
  backgroundColor: '#312e2b',
  showBorder: true,
  borderColor: '#000000'
};
```

---

### History State

Located in `src/hooks/useFENHistory.js`

```javascript
const useFENHistory = () => {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('fenHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('fenFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Add to history (limit to 50 items)
  const addToHistory = useCallback((fen) => {
    setHistory(prev => {
      const newHistory = [fen, ...prev.filter(f => f !== fen)];
      const limited = newHistory.slice(0, 50);
      localStorage.setItem('fenHistory', JSON.stringify(limited));
      return limited;
    });
  }, []);
  
  // Toggle favorite
  const toggleFavorite = useCallback((fen) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(fen)
        ? prev.filter(f => f !== fen)
        : [...prev, fen];
      localStorage.setItem('fenFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);
  
  return {
    history,
    favorites,
    addToHistory,
    toggleFavorite,
    clearHistory: () => {
      setHistory([]);
      localStorage.removeItem('fenHistory');
    },
    clearFavorites: () => {
      setFavorites([]);
      localStorage.removeItem('fenFavorites');
    }
  };
};
```

---

## Component State

### Modal State Pattern

```javascript
const ControlPanel = () => {
  // Each modal has its own state
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowThemeModal(true)}>
        Themes
      </button>
      
      {showThemeModal && (
        <ThemeModal 
          isOpen={showThemeModal}
          onClose={() => setShowThemeModal(false)}
        />
      )}
    </>
  );
};
```

**Why component state for modals?**
- Modals are UI-only state
- No need to share across components
- Simpler than global state
- Automatically cleaned up on unmount

---

### Form Input State

```javascript
const FENInput = ({ value, onChange }) => {
  // Local input state for immediate feedback
  const [localValue, setLocalValue] = useState(value);
  const [isValid, setIsValid] = useState(true);
  
  // Debounce updates to parent
  const debouncedOnChange = useMemo(
    () => debounce(onChange, 300),
    [onChange]
  );
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Validate
    const valid = validateFEN(newValue);
    setIsValid(valid);
    
    // Update parent if valid
    if (valid) {
      debouncedOnChange(newValue);
    }
  };
  
  return (
    <input
      value={localValue}
      onChange={handleChange}
      className={isValid ? 'valid' : 'invalid'}
    />
  );
};
```

---

### Loading State Pattern

```javascript
const ExportButton = ({ format, quality, onExport }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);
    
    try {
      await onExport(format, quality, (p) => setProgress(p));
      // Success notification
    } catch (error) {
      // Error handling
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };
  
  return (
    <button 
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? `Exporting... ${progress}%` : 'Export'}
    </button>
  );
};
```

---

## Derived State

### What is Derived State?
State that can be **computed** from other state - should not be stored separately.

### Board Array from FEN

```javascript
// ❌ Bad: Storing both FEN and board array
const [fen, setFen] = useState(DEFAULT_FEN);
const [board, setBoard] = useState(parseFEN(DEFAULT_FEN));

// Need to sync manually
const updateFEN = (newFen) => {
  setFen(newFen);
  setBoard(parseFEN(newFen)); // Easy to forget!
};

// ✅ Good: Derive board from FEN
const [fen, setFen] = useState(DEFAULT_FEN);
const board = useMemo(() => parseFEN(fen), [fen]);
```

### Piece Count

```javascript
// Derive piece counts from board
const pieceCounts = useMemo(() => {
  const counts = {};
  
  board.forEach(row => {
    row.forEach(piece => {
      if (piece) {
        counts[piece] = (counts[piece] || 0) + 1;
      }
    });
  });
  
  return counts;
}, [board]);
```

### Export Filename

```javascript
// Derive filename from state
const exportFilename = useMemo(() => {
  const date = new Date().toISOString().split('T')[0];
  const position = fen.split(' ')[0].replace(/\//g, '-');
  return `chess-${date}-${position}.png`;
}, [fen]);
```

---

## State Persistence

### localStorage Pattern

```javascript
// Custom hook for persisted state
const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return defaultValue;
    }
  });
  
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  }, [key, value]);
  
  return [value, setValue];
};

// Usage
const [theme, setTheme] = useLocalStorage('theme', DEFAULT_THEME);
```

### What to Persist

**DO persist:**
- ✅ User preferences (theme, piece set)
- ✅ History and favorites
- ✅ Display settings (coordinates, flipped)
- ✅ Last used FEN

**DON'T persist:**
- ❌ Modal open/closed states
- ❌ Loading states
- ❌ Temporary form inputs
- ❌ Derived state

---

## State Updates

### Immutable Updates

```javascript
// ❌ Bad: Mutating state
const addToHistory = (fen) => {
  history.push(fen); // Mutates array!
  setHistory(history);
};

// ✅ Good: Creating new array
const addToHistory = (fen) => {
  setHistory(prev => [...prev, fen]);
};

// ✅ Good: Functional updates
const addToHistory = (fen) => {
  setHistory(prev => {
    const newHistory = [fen, ...prev.filter(f => f !== fen)];
    return newHistory.slice(0, 50);
  });
};
```

### Batch Updates

```javascript
// Multiple state updates in same event handler
const handleExport = async () => {
  // These will batch automatically in React 18+
  setIsExporting(true);
  setProgress(0);
  setError(null);
  
  // Only one re-render!
};
```

### Async Updates

```javascript
const loadFENFromFile = async (file) => {
  setLoading(true);
  
  try {
    const text = await file.text();
    const fen = extractFEN(text);
    
    if (validateFEN(fen)) {
      setFen(fen);
      addToHistory(fen);
      showNotification('Position loaded successfully');
    } else {
      setError('Invalid FEN in file');
    }
  } catch (error) {
    setError('Failed to read file');
  } finally {
    setLoading(false);
  }
};
```

---

## Performance Optimization

### Memoization

```javascript
// Memoize expensive computations
const parsedBoard = useMemo(() => {
  console.log('Parsing FEN...');
  return parseFEN(fen);
}, [fen]); // Only recompute when FEN changes

// Memoize callbacks
const handleThemeChange = useCallback((newTheme) => {
  setTheme(newTheme);
  localStorage.setItem('theme', JSON.stringify(newTheme));
}, []); // Stable function reference
```

### Component Memoization

```javascript
// Prevent unnecessary re-renders
const ChessBoard = React.memo(
  ({ fen, theme, pieceSet }) => {
    // Heavy canvas rendering
    return <canvas ref={canvasRef} />;
  },
  (prevProps, nextProps) => {
    // Custom comparison
    return (
      prevProps.fen === nextProps.fen &&
      prevProps.theme.id === nextProps.theme.id &&
      prevProps.pieceSet === nextProps.pieceSet
    );
  }
);
```

### Lazy State Initialization

```javascript
// ❌ Bad: Expensive initialization runs every render
const [theme, setTheme] = useState(
  JSON.parse(localStorage.getItem('theme')) || DEFAULT_THEME
);

// ✅ Good: Function only runs once
const [theme, setTheme] = useState(() => {
  const saved = localStorage.getItem('theme');
  return saved ? JSON.parse(saved) : DEFAULT_THEME;
});
```

---

## Best Practices

### 1. Keep State Minimal

```javascript
// ❌ Bad: Storing redundant state
const [fen, setFen] = useState('...');
const [board, setBoard] = useState([...]);
const [pieceCount, setPieceCount] = useState(32);

// ✅ Good: Derive what you can
const [fen, setFen] = useState('...');
const board = useMemo(() => parseFEN(fen), [fen]);
const pieceCount = useMemo(() => countPieces(board), [board]);
```

### 2. Co-locate State

```javascript
// Keep state close to where it's used
const ThemeSelector = () => {
  // Only ThemeSelector needs this
  const [selectedTheme, setSelectedTheme] = useState(null);
  
  return (
    <div>
      {/* Theme selection UI */}
    </div>
  );
};
```

### 3. Lift State When Needed

```javascript
// If multiple components need same state, lift it up
const App = () => {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  
  return (
    <>
      <ChessBoard theme={theme} />
      <ThemeSelector theme={theme} onChange={setTheme} />
    </>
  );
};
```

### 4. Use Proper Data Structures

```javascript
// ❌ Bad: Array for favorites (O(n) lookup)
const [favorites, setFavorites] = useState([]);
const isFavorite = (fen) => favorites.includes(fen);

// ✅ Good: Set for favorites (O(1) lookup)
const [favorites, setFavorites] = useState(new Set());
const isFavorite = (fen) => favorites.has(fen);
```

---

## Common Patterns

### Toggle Pattern

```javascript
const [isOpen, setIsOpen] = useState(false);

// Simple toggle
const toggle = () => setIsOpen(prev => !prev);

// Toggle with callback
const toggleModal = useCallback(() => {
  setIsOpen(prev => !prev);
}, []);
```

### Multi-Field Form Pattern

```javascript
const [formData, setFormData] = useState({
  lightSquare: '#f0d9b5',
  darkSquare: '#b58863',
  coordinateColor: '#000000'
});

// Update single field
const updateField = (field, value) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
};

// Update multiple fields
const updateTheme = (newTheme) => {
  setFormData(prev => ({
    ...prev,
    ...newTheme
  }));
};
```

### List Management Pattern

```javascript
const [items, setItems] = useState([]);

// Add item
const addItem = (item) => {
  setItems(prev => [...prev, item]);
};

// Remove item
const removeItem = (id) => {
  setItems(prev => prev.filter(item => item.id !== id));
};

// Update item
const updateItem = (id, updates) => {
  setItems(prev =>
    prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    )
  );
};
```

### Async State Pattern

```javascript
const [state, setState] = useState({
  data: null,
  loading: false,
  error: null
});

const fetchData = async () => {
  setState({ data: null, loading: true, error: null });
  
  try {
    const data = await api.fetch();
    setState({ data, loading: false, error: null });
  } catch (error) {
    setState({ data: null, loading: false, error });
  }
};
```

---

## State Flow Diagram

```
User Action
    │
    ▼
Event Handler
    │
    ├─→ setState (component state)
    │       │
    │       ▼
    │   Re-render
    │       │
    │       ▼
    │   Canvas redraw
    │
    ├─→ localStorage.setItem (persist)
    │
    └─→ Context.update (global state)
            │
            ▼
        All consumers re-render
```

---

## Debugging State

### React DevTools

```javascript
// Name your hooks for better debugging
const useChessBoard = () => {
  useDebugValue('ChessBoard State');
  // ...
};
```

### State Logging

```javascript
// Log state changes
useEffect(() => {
  console.log('FEN changed:', fen);
}, [fen]);

// Log render count
const renderCount = useRef(0);
useEffect(() => {
  renderCount.current++;
  console.log(`Component rendered ${renderCount.current} times`);
});
```

---

## Testing State

### Unit Testing

```javascript
import { renderHook, act } from '@testing-library/react-hooks';

test('useChessBoard updates FEN', () => {
  const { result } = renderHook(() => useChessBoard());
  
  act(() => {
    result.current.setFen(NEW_FEN);
  });
  
  expect(result.current.fen).toBe(NEW_FEN);
  expect(result.current.board).toEqual(parseFEN(NEW_FEN));
});
```

---

## Migration Guide

### From Class Components

```javascript
// Before (class component)
class ChessBoard extends React.Component {
  state = {
    fen: DEFAULT_FEN,
    isFlipped: false
  };
  
  updateFEN = (fen) => {
    this.setState({ fen });
  };
}

// After (functional component with hooks)
const ChessBoard = () => {
  const [fen, setFen] = useState(DEFAULT_FEN);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const updateFEN = (fen) => {
    setFen(fen);
  };
};
```

---

**Last Updated:** January 5, 2026  
**Version:** 3.5.2  
**Maintainer:** [@BilgeGates](https://github.com/BilgeGates)