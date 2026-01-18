# Changelog

All notable changes to **Chess Diagram Generator** are documented in this file.  
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Planned
- SVG export format
- Keyboard shortcuts

---

## [v3.5.2] - 2026-01-18

### Fixed

#### Console & Logging
- Replaced console.log/error statements with logger utility (dev-only output)

#### Memory & Performance
- Added setTimeout cleanup refs in AdvancedFENInputModal and other components
- Fixed memory leaks from timeout cleanup issues
- Fixed React memo comparisons

#### Board Coordinates
- Fixed coordinate misalignment - coordinates now display and export correctly
- Improved coordinate positioning for all board sizes

#### Export & Rendering
- Fixed export coordinate accuracy
- Removed debug code affecting export performance

#### User Interface
- Fixed clipboard paste functionality for FEN notation
- Fixed canvas overflow on mobile devices

### Added
- **Error Boundary** - ErrorBoundary component wrapping App for graceful error recovery
- **ARIA labels** - Accessibility attributes to Modal, Button, ActionButtons, ChessBoard
- **Focus trap** - Modal component traps focus with Tab key cycling
- **Logger utility** - Development-only logging (src/utils/logger.js)
- **Error handler** - Centralized errorHandler.js utility with ErrorTypes

### Changed
- Modal now has `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Button supports `aria-label` prop and `aria-disabled` attribute
- ChessBoard has `role="img"` with dynamic board description

---

## [v3.5.1] - 2026-01-04

### Fixed
- Chess pieces missing in exported images
- JPEG export background rendering
- Responsive layout on small screens

### Changed
- Increased coordinate font size and weight
- Enlarged chess pieces on board
- Added border around chessboard

### Added
- ARCHITECTURE.md documentation
- CHANGELOG.md for version tracking
- SECURITY.md with security policies
- FAQ.md
- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- MIT License

### Dependencies
- Bumped qs from 6.14.0 to 6.14.1

---

## [v3.5.0] - 2026-01-03

### Added
- Multi-FEN input (up to 10 positions)
- Pagination with live board previews
- Color picker with HSL/RGB/HEX

### Changed
- React.memo optimizations
- Faster export pipeline
- Reduced bundle size
- Better mobile responsiveness
- Improved FEN validation with error messages

### Fixed
- FEN parsing edge cases
- Export scaling on high-DPI displays
- Cross-browser UI inconsistencies
- Color picker modal z-index

---

## [v3.0.0] - 2026-01-02

### Added
- PNG and JPEG export with quality settings
- Board theme customization system
- Enhanced FEN validation

### Changed
- Refactored color picker
- Improved canvas scaling
- Internal architecture cleanup

---

## [v2.0.0] - 2025-12-29

### Added
- Custom light/dark square colors
- Pre-defined board themes
- Piece selector with previews
- Theme favorites

### Changed
- Redesigned control panel
- Responsive layout improvements

### Fixed
- Reduced unnecessary re-renders
- Optimized board redraw
- Lazy loading for piece images

---

## [v1.0.0] - 2025-12-28

### Initial Release
- FEN notation support with validation
- Canvas-based board renderer
- 23 piece sets
- Board flip and coordinate toggle
- PNG/JPEG export (400px-1600px)
- React 19.x + Tailwind CSS
- LocalStorage for preferences

---

## Version Support

| Version | Status | Security Updates |
|---------|--------|------------------|
| v3.5.x  | Active | Yes |
| v3.0.x  | Supported until 2026-06 | Yes |
| v1.x-v2.x | Deprecated | No |

---

**© 2026 Khatai Huseynzada. MIT License.**