# Changelog

All notable changes to **Chess Diagram Generator** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [v3.5.1] – 2026-01-04

### 🐛 Bug Fixes
- Fixed an issue where chess pieces were missing or incorrectly rendered in exported images (PNG/JPEG).

### 🎨 UI / Visual Improvements
- Increased coordinate font size and applied a bolder font weight for better readability.
- Enlarged chess pieces on the board for improved visual clarity.
- Added a subtle border around the chessboard to improve separation and contrast.

## [v3.5.0] - 2026-01-03

### Improvements

* Performance- and stability-focused refinement release
* Faster export pipeline
* Smoother UI interactions
* Improved color picker accuracy
* Better mobile responsiveness

### Internal

* Extensive use of `React.memo`
* Optimized hooks and utility functions
* Cleaner folder structure
* Reduced bundle size

### Fixed

* FEN parsing edge cases
* Export scaling issues
* Cross-browser UI inconsistencies

---

## [v3.0.0] - 2026-01-02

### Added

* PNG and JPEG export support
* Advanced board theme customization
* Enhanced FEN validation logic

### Changed

* Major refactor of the color picker and unified theme system
* Improved canvas scaling logic
* Internal architecture cleanup

---

## [v2.0.0] - 2025-12-29

### Added

* Major customization and UX upgrade
* Custom light and dark square colors
* Multiple board themes
* Improved piece selector

### Improved

* Better FEN validation
* Enhanced control panel UX
* Responsive layout improvements

### Performance

* Reduced unnecessary re-renders
* Optimized board redraw logic

---

## [v1.0.0] - 2025-12-28

### Added

* Initial stable public release
* Full FEN notation support
* Interactive chessboard renderer
* Multiple piece styles
* Board flip and coordinate toggle
* Real-time board updates

### Export

* PNG and JPEG export
* High-quality canvas rendering
* Custom board size control

---

> Versions earlier than **v3.0.0** are no longer supported. Please upgrade to the latest release for security updates.
