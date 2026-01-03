# ♟️ Chess Diagram Generator

> **Professional chess position visualizer with ultra-HD export capabilities**

A modern, browser-based chess diagram generator designed for chess enthusiasts, coaches, authors, and content creators. Generate publication-quality chess diagrams with full FEN support, 20+ piece styles, and export up to 32x quality (12,800px × 12,800px).

[![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🎯 **Key Features**

### 🖼️ **Ultra-HD Export**
- **4x to 32x quality** export (up to 12,800px × 12,800px)
- **PNG & JPEG** formats with optimized compression
- **Batch export** multiple formats simultaneously
- **Copy to clipboard** for instant sharing

### ♟️ **Chess Features**
- **Full FEN support** - Forsyth-Edwards Notation compatible
- **20+ piece styles** - Professional sets from Lichess
- **Board customization** - Custom colors with advanced color picker
- **Coordinates** - Toggle file/rank labels (a-h, 1-8)
- **Board flip** - View from black's perspective
- **Famous positions** - Pre-loaded classical positions

### 🎨 **Advanced Customization**
- **12 preset board themes** (Brown, Blue, Green, Wood, etc.)
- **Custom color picker** with HSL/RGB/HEX support
- **8 color palettes** (Basic, Grays, Warm, Cool, Nature, etc.)
- **Live preview** - Real-time board updates
- **Responsive design** - Works on all devices

### 💾 **Smart Storage**
- **FEN history** - Auto-save recent positions
- **Favorites system** - Star important positions
- **Cloud sync** - Persistent storage across sessions
- **Local-first** - Privacy-focused, no server uploads

---

## 🚀 **Quick Start**

### Prerequisites
```bash
Node.js >= 16.x
npm >= 8.x
```

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/chess-diagram-generator.git

# Navigate to project directory
cd chess-diagram-generator

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
```

---

## 📁 **Project Structure**

```
chessviewer/
│
├── src/
│   │
│   ├── components/                  
│   │   │
│   │   ├── board/                              
│   │   │   ├── BoardSquare.jsx                 
│   │   │   ├── BoardGrid.jsx                  
│   │   │   ├── ChessBoard.jsx                
│   │   │   ├── MiniChessPreview.jsx            
│   │   │   └── index.js
│   │   │
│   │   ├── controls/                           
│   │   │   ├── atoms/
│   │   │   │   ├── FENInputField.jsx           
│   │   │   │   ├── FamousPositionButton.jsx    
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── ControlPanel.jsx                
│   │   │   ├── BoardSizeControl.jsx          
│   │   │   ├── DisplayOptions.jsx              
│   │   │   ├── ExportSettings.jsx             
│   │   │   ├── FENInput.jsx                   
│   │   │   ├── PieceSelector.jsx               
│   │   │   ├── ThemeSelector.jsx            
│   │   │   │
│   │   │   ├── modals/
│   │   │   │   ├── AdvancedFENInputModal.jsx  
│   │   │   │   ├── ExportSettingsModal.jsx     
│   │   │   │   ├── FENHistoryModal.jsx         
│   │   │   │   ├── ThemeModal.jsx          
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   ├── ui/                                
│   │   │   │
│   │   │   ├── base/                          
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
│   │   │   ├── color-picker/                  
│   │   │   │   ├── ColorPicker.jsx             
│   │   │   │   ├── PickerModal.jsx            
│   │   │   │   │
│   │   │   │   ├── parts/                    
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
│   │   │   │   ├── views/                     
│   │   │   │   │   ├── ThemeMainView.jsx      
│   │   │   │   │   ├── ThemeAdvancedPickerView.jsx  
│   │   │   │   │   ├── ThemeSettingsView.jsx   
│   │   │   │   │   └── index.js
│   │   │   │   │
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── ActionButtons.jsx               
│   │   │   ├── ExportProgress.jsx              
│   │   │   ├── NotificationContainer.jsx       
│   │   │   ├── UserGuide.jsx                  
│   │   │   └── index.js
│   │   │
│   │   └── layout/                           
│   │       ├── Navbar.jsx                      
│   │       ├── Footer.jsx                      
│   │       └── index.js
│   │
│   ├── pages/                                
│   │   ├── HomePage.jsx                       
│   │   ├── AboutPage.jsx                      
│   │   ├── DownloadPage.jsx                    
│   │   ├── SupportPage.jsx                   
│   │   └── index.js
│   │
│   ├── hooks/                                  
│   │   ├── useChessBoard.js                   
│   │   ├── usePieceImages.js                   
│   │   ├── useFENHistory.js                    
│   │   ├── useTheme.js                         
│   │   ├── useNotifications.js                
│   │   ├── useLocalStorage.js                  
│   │   ├── useColorState.js                    
│   │   ├── useColorConversion.js               
│   │   ├── useCanvasPicker.js                  
│   │   ├── useOutsideClick.js                  
│   │   └── index.js
│   │
│   ├── utils/                                 
│   │   ├── fenParser.js                        
│   │   ├── colorUtils.js                       
│   │   ├── coordinateCalculations.js           
│   │   ├── canvasExporter.js                   
│   │   ├── imageOptimizer.js                  
│   │   └── index.js
│   │
│   ├── constants/                              
│   │   └── chessConstants.js                   
│   │
│   ├── routes/                                 
│   │   └── Router.jsx                         
│   │
│   ├── App.jsx                                 
│   ├── index.css                               
│   └── index.js                                
│
├── .env
├── .gitignore
├── postcss.config.js
├── tailwind.config.js
├── package.json
├── package-lock.json
├── vercel.json
└── README.md
```

---

## 📂 **Detailed Folder Descriptions**

### **📁 components/** - React Component Library

#### **♟️ board/** - Chess Board Components
- `BoardSquare.jsx` - Single memoized square (re-renders only when piece/color changes)
- `BoardGrid.jsx` - 64-square grid renderer with optimized rendering
- `ChessBoard.jsx` - Main board with HTML5 Canvas, handles FEN parsing and piece rendering
- `MiniChessPreview.jsx` - Thumbnail preview for FEN history modal

#### **🎛️ controls/** - Control Panel System
- `ControlPanel.jsx` - Main container orchestrating all controls
- `FENInput.jsx` - FEN textarea with paste/copy buttons and validation
- `BoardSizeControl.jsx` - Slider (150-600px) + numeric input with live validation
- `DisplayOptions.jsx` - Checkbox group for coordinates toggle
- `PieceSelector.jsx` - Searchable dropdown with 20+ piece styles
- `ThemeSelector.jsx` - Opens theme modal for color customization
- `ExportSettings.jsx` - Opens export quality modal (4x-32x)

**controls/atoms/** - Atomic building blocks
- `FENInputField.jsx` - Pure textarea component
- `FamousPositionButton.jsx` - Single position button (memoized)

**controls/modals/** - Modal dialogs
- `AdvancedFENInputModal.jsx` - Batch FEN processor (up to 10 positions)
- `FENHistoryModal.jsx` - Browse, favorite, and delete saved positions
- `ThemeModal.jsx` - 3-tab theme editor (Main/Advanced/Settings)
- `ExportSettingsModal.jsx` - Export quality and filename configuration

#### **🎨 ui/** - Reusable UI Library

**ui/base/** - Atomic design system
- All components memoized with `React.memo`
- `SearchableSelect.jsx` - Dropdown with search + keyboard navigation
- Consistent API across all components

**ui/color-picker/** - Advanced color picker system
- `ColorPicker.jsx` - Main component with HEX/RGB input
- `PickerModal.jsx` - Multi-view modal (Main/Palettes/Settings)

**ui/color-picker/parts/** - Picker building blocks
- `ColorCanvas.jsx` - HSV 2D gradient canvas
- `ColorSwatch.jsx` - Single color button (memoized)
- `ColorPalettes.jsx` - 8 pre-defined palettes (Basic, Warm, Cool, etc.)
- `HueSlider.jsx` - 360° hue selector with live preview
- `ThemePresetCard.jsx` - Theme card with hover preview

**ui/color-picker/views/** - Picker views
- `ThemeMainView.jsx` - Preset themes + current colors display
- `ThemeAdvancedPickerView.jsx` - Full picker with canvas + palettes
- `ThemeSettingsView.jsx` - 10 toggleable settings

**Other UI Components:**
- `ActionButtons.jsx` - Export buttons (PNG/JPEG/Batch/Copy/Flip)
- `ExportProgress.jsx` - Progress modal with pause/resume/cancel
- `NotificationContainer.jsx` - Toast notification system
- `UserGuide.jsx` - Collapsible help guide

#### **🏗️ layout/** - Layout Components
- `Navbar.jsx` - Responsive navigation (desktop: sidebar, mobile: bottom sheet)
- `Footer.jsx` - Footer with links

---

### **📁 pages/** - Application Pages
- `HomePage.jsx` - Main diagram creator with board + controls
- `AboutPage.jsx` - Features, technology, and use cases
- `DownloadPage.jsx` - Web app vs desktop options
- `SupportPage.jsx` - FAQ + contact information

---

### **📁 hooks/** - Custom React Hooks

| Hook | Purpose | Features |
|------|---------|----------|
| `useChessBoard.js` | Parse FEN → 8x8 board array | Validates FEN, memoized parsing |
| `usePieceImages.js` | Load & cache piece images | Progressive loading, retry logic, caching |
| `useFENHistory.js` | Manage FEN history | Auto-save, favorites, cloud sync |
| `useTheme.js` | Theme state management | Preset themes, custom colors, persistence |
| `useNotifications.js` | Toast notifications | 4 types (success/error/warning/info), auto-dismiss |
| `useLocalStorage.js` | Persistent storage | localStorage wrapper with JSON parsing |
| `useColorState.js` | Color picker state | HSL/RGB/HEX conversions, palette state |
| `useColorConversion.js` | Color utilities | HEX ↔ RGB ↔ HSL ↔ HSV conversions |
| `useCanvasPicker.js` | Canvas picker logic | Click detection, color extraction |
| `useOutsideClick.js` | Click outside handler | Close modals on outside click |

---

### **📁 utils/** - Utility Functions

| File | Purpose | Key Functions |
|------|---------|---------------|
| `fenParser.js` | FEN operations | `validateFEN()`, `parseFEN()`, `getPositionStats()` |
| `colorUtils.js` | Color conversions | `hexToRgb()`, `rgbToHsl()`, `getContrastRatio()` |
| `coordinateCalculations.js` | Board coordinates | `drawCoordinates()`, `getCoordinateParams()` |
| `canvasExporter.js` | Export logic | `downloadPNG()`, `downloadJPEG()`, `copyToClipboard()` |
| `imageOptimizer.js` | Canvas optimization | `createUltraQualityCanvas()`, `calculateExportSize()` |

---

### **📁 constants/** - Application Constants
- `chessConstants.js` - Piece sets (20+), board themes (12), famous positions, quality presets

---

### **📁 routes/** - Routing
- `Router.jsx` - React Router v6 configuration (4 routes: /, /about, /download, /support)

---

## 🏗️ **Architecture**

### **Atomic Design Pattern**

This project follows **Atomic Design** principles for component architecture:

| Level | Symbol | Description | Examples |
|-------|--------|-------------|----------|
| **Atoms** | ⚛️ | Pure, reusable components | `Button`, `Input`, `ColorSwatch` |
| **Molecules** | 🧬 | Atom combinations | `SearchableSelect`, `ColorPalettes` |
| **Organisms** | 🔬 | Complex components | `ChessBoard`, `ThemeModal`, `ControlPanel` |
| **Templates** | 🏗️ | Page layouts | `Navbar`, `Footer` |
| **Pages** | 📄 | Full pages | `HomePage`, `AboutPage` |

### **State Management**

- **Local State**: React `useState` for component-level state
- **Persistent State**: Custom `useLocalStorage` hook
- **Cloud Storage**: `window.storage` API for cross-session sync
- **Global State**: Context-free architecture with prop drilling optimization

### **Performance Optimizations**

✅ **React.memo** - All atoms/molecules memoized  
✅ **useCallback** - Event handlers optimized  
✅ **useMemo** - Expensive calculations cached  
✅ **Code splitting** - Dynamic imports ready  
✅ **Image caching** - Piece images cached in memory  
✅ **Canvas optimization** - High-DPI rendering with quality scaling  

---

## 🎨 **Color Picker System**

Advanced color picker with **8 palettes** and **HSL/RGB/HEX** support:

### Features:
- 🎨 **8 Color Palettes**: Basic, Grays, Warm, Cool, Nature, Sunset, Ocean, Royal
- 🌈 **HSV Canvas Picker**: 2D saturation/lightness selector
- 🔄 **Hue Slider**: 360° color wheel
- 📋 **Quick Actions**: Random, Reset, Copy
- 💾 **Preset Themes**: 12 pre-configured board themes
- ⚙️ **Settings**: Animation toggles, display options

---

## 🖼️ **Export System**

### Quality Levels:
| Quality | Resolution | File Size | Use Case |
|---------|-----------|-----------|----------|
| **8x** | 3,200px × 3,200px | ~86KB - 1MB | Web & Social Media |
| **16x** | 6,400px × 6,400px | ~255KB - 3MB | Print & Presentations ⭐ |
| **24x** | 9,600px × 9,600px | ~506KB - 6MB | Professional Print |
| **32x** | 12,800px × 12,800px | ~837KB - 6MB+ | Maximum Quality |

### Export Features:
- ✅ **PNG** - Lossless, transparent background
- ✅ **JPEG** - Compressed, smaller file size
- ✅ **Batch Export** - Multiple formats at once
- ✅ **Copy to Clipboard** - Instant sharing
- ✅ **Progress Tracking** - Pause/Resume/Cancel support

---

## 🧩 **FEN Notation Support**

Full **Forsyth-Edwards Notation (FEN)** compatibility:

### Features:
- ✅ **Validation** - Real-time FEN syntax checking
- ✅ **History** - Auto-save recent positions
- ✅ **Favorites** - Star important positions
- ✅ **Batch Input** - Advanced FEN modal (up to 10 positions)
- ✅ **Famous Positions** - Pre-loaded classical games

### Example FEN:
```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

---

## 🎮 **Usage Guide**

### Basic Workflow:
1. **Enter FEN** - Type or paste FEN notation
2. **Customize** - Choose piece style, colors, size
3. **Preview** - Real-time board updates
4. **Export** - Download PNG/JPEG or copy to clipboard

### Advanced Features:
- **Batch FEN Input** - Process multiple positions
- **Custom Themes** - Create unique color schemes
- **History Browser** - Review and reuse past positions
- **Quality Presets** - Optimize for web or print

---

## 🔧 **Technologies Used**

### Core:
- **React 18.x** - UI framework
- **React Router 6.x** - Client-side routing
- **Tailwind CSS 3.x** - Utility-first styling

### Libraries:
- **Lucide React** - Icon library
- **HTML5 Canvas** - Board rendering
- **localStorage API** - Persistent storage
- **Clipboard API** - Copy functionality

### Tools:
- **PostCSS** - CSS processing
- **Vercel** - Deployment platform
- **ESLint** - Code linting

---

## 📊 **Performance Metrics**

### Optimization Results:
- ⚡ **Initial Load**: < 2s
- 🖼️ **Image Loading**: Progressive with caching
- 🎨 **Re-render Optimization**: Only changed components update
- 💾 **Bundle Size**: Optimized code splitting
- 🚀 **Lighthouse Score**: 90+ Performance

---

## 🌐 **Browser Support**

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Opera | 76+ | ✅ Full |

---

## 🔒 **Privacy & Security**

### Privacy-First Design:
- ✅ **No Server Uploads** - All processing happens locally
- ✅ **No Tracking** - No analytics or user tracking
- ✅ **Local Storage Only** - Data stays in your browser
- ✅ **Open Source** - Transparent codebase

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards:
- ✅ Follow **Atomic Design** principles
- ✅ Use **React.memo** for performance
- ✅ Write **descriptive comments**
- ✅ Follow **Tailwind CSS** conventions
- ✅ Test on **multiple browsers**

---

## 📝 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Author**

Created with ❤️ by [Khatai Huseynzada]

- GitHub: [BilgeGates](https://github.com/BilgeGatese)

---

## 🙏 **Acknowledgments**

- **Lichess** - Piece images and piece sets
- **React Community** - Amazing ecosystem
- **Tailwind CSS** - Beautiful utility classes
- **Lucide Icons** - Clean icon library

---

## 📧 **Support**

Need help? Have questions?

- 🐛 Issues: [GitHub Issues](https://github.com/BilgeGates/chess-viewer/issues)

---

## 🗺️ **Roadmap**

### Planned Features:
- [ ] **Animation** - Animate piece movements
- [ ] **Dark Mode** - Full dark theme support
- [ ] **Multi-language** - i18n support

