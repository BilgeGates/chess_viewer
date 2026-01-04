# Changelog

All notable changes to **Chess Diagram Generator** are documented in this file.  
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### 🔮 Planned Features
- SVG export format support (v4.0.0)
- Open folder support for batch exports (v4.1.0)
- Design and visual refinements (v4.1.5)

---

## [v3.5.1] - 2026-01-04

### 🐛 Bug Fixes
- Fixed an issue where chess pieces were missing or incorrectly rendered in exported images (PNG/JPEG)
- Resolved piece rendering edge cases in high-resolution exports
- Fixed various rendering and display issues

### 🎨 UI / Visual Improvements
- Increased coordinate font size and applied a bolder font weight for better readability
- Enlarged chess pieces on the board for improved visual clarity
- Added a subtle border around the chessboard to improve separation and contrast
- Enhanced overall board aesthetics

### 📚 Documentation
- Created comprehensive `ARCHITECTURE.md` documenting project structure
- Created `CHANGELOG.md` for version tracking
- Enhanced `SECURITY.md` with detailed security policies
- Created `FAQ.md` answering common user questions
- Added Contributor Covenant Code of Conduct
- Updated `README.md` with improved structure and content
- Added `CONTRIBUTING.md` guide to enhance community collaboration
- Fixed author attribution in documentation
- Added MIT License to the project

### 🏗️ Project Structure
- Added `.github` folder for GitHub workflows and templates
- Improved folder organization and code structure
- Enhanced project metadata and configuration files

### 🔧 Dependencies
- Bumped `qs` dependency from 6.14.0 to 6.14.1 (security update)

### 🔄 Internal Changes
- Multiple corrections and refinements
- Resolved merge conflicts and cleaned up codebase
- Updated app version to 3.5.1

---

## [v3.5.0] - 2026-01-03

### ✨ Major Features
- Multi-FEN input support (up to 10 positions)
- Pagination with live board previews
- Advanced color picker with HSL/RGB/HEX support
- Extended theme customization options

### 🚀 Performance Improvements
- Extensive use of `React.memo` for component optimization
- Faster export pipeline with reduced processing time
- Smoother UI interactions across all controls
- Reduced bundle size through code optimization
- Optimized hooks and utility functions

### 🎯 Enhancements
- Enhanced color picker accuracy and responsiveness
- Better mobile responsiveness across all screen sizes
- Improved FEN validation with detailed error messages
- More intuitive theme selection interface

### 🐛 Bug Fixes
- Fixed FEN parsing edge cases for unusual positions
- Resolved export scaling issues on high-DPI displays
- Fixed cross-browser UI inconsistencies (Safari, Firefox, Edge)
- Corrected color picker modal z-index conflicts

### 🏗️ Internal Architecture
- Complete folder structure reorganization
- Cleaner component organization and separation of concerns
- Improved code documentation
- Enhanced error handling throughout the application
- Better state management patterns

---

## [v3.0.0] - 2026-01-02

### ✨ Major Release - Advanced Customization
- PNG and JPEG export support with quality settings
- Advanced board theme customization system
- Enhanced FEN validation logic with real-time feedback

### 🔄 Breaking Changes
- Major refactor of color picker and unified theme system
- Improved canvas scaling logic
- Internal architecture cleanup and modernization

### 🛠️ Technical Improvements
- Refactored export system for better performance
- Optimized image rendering pipeline
- Improved memory management for large exports
- Complete theme architecture overhaul

---

## [v2.2.0] - 2026-01-01

### 🎯 Improvements
- Enhanced various functions across the application
- Removed unnecessary features for better performance
- Code optimization and cleanup

### 🐛 Bug Fixes
- Fixed coordinate calculation issues
- Improved board size handling
- General stability improvements

---

## [v2.1.0] - 2025-12-31

### ✨ Features
- Added download functionality
- Enhanced coordinate calculations

### 🐛 Known Issues
- Coordinate display errors identified (fixed in v2.2)

### 🔧 Fixes
- Various corrections and refinements
- Improved board rendering logic

---

## [v2.0.0] - 2025-12-29

### ✨ Major Release - Customization & UX Upgrade
- Custom light and dark square color selection
- Multiple pre-defined board themes (Classic, Wood, Blue, Green, etc.)
- Improved piece selector with visual previews
- Theme favorites system
- Real-time theme preview

### 🎯 Improvements
- Enhanced FEN validation with descriptive error messages
- Redesigned control panel for better UX
- Responsive layout improvements for tablets and mobile
- Better accessibility features (keyboard navigation, ARIA labels)

### 🚀 Performance
- Reduced unnecessary re-renders through React optimization
- Optimized board redraw logic for smoother updates
- Lazy loading for piece images
- Improved initial load time

### 🔧 Technical
- Removed unused piece sets from PIECE_SETS
- Streamlined piece management

---

## [v1.0.0] - 2025-12-28

### 🎉 Initial Stable Public Release

#### ✨ Core Features
- Full FEN notation support with validation
- Interactive chessboard renderer using HTML5 Canvas
- Multiple piece styles (27+ sets available)
- Board flip functionality
- Coordinate toggle (show/hide)
- Real-time board updates

#### 📤 Export Capabilities
- PNG export with customizable dimensions
- JPEG export with quality control
- High-quality canvas rendering
- Custom board size control (400px - 1600px)
- Ultra-quality canvas creation with enhanced rendering

#### 🎨 User Interface
- Clean, modern interface design
- Intuitive control panel
- Responsive layout for all devices
- Enhanced styling and layout for action buttons
- Improved StatusMessage component

#### 🏗️ Technical Foundation
- React 18+ architecture (built with React 19.x)
- Tailwind CSS for styling
- HTML5 Canvas for rendering
- LocalStorage for user preferences
- Comprehensive error handling
- Enhanced FEN parsing logic

#### 🔧 Major Refactors (Pre-release)
- Reorganized chessConstants for improved structure
- Consolidated coordinate metrics calculation
- Simplified createExportCanvas function
- Streamlined image loading logic in usePieceImages hook
- Enhanced ChessBoard component with improved rendering
- Improved ControlPanel with theme management
- Reorganized custom piece exports
- Updated dependencies and SVG rendering

---

## [Pre-v1.0.0] - Development Phase (2025-12-27 to 2025-12-28)

### Development Milestones
- Initial Create React App setup
- Vercel deployment configuration
- Custom pieces implementation
- Fixed design problems and rendering issues
- Enhanced image export functionality
- Added flip board button
- Project initialization and core architecture

---

## Version Support Policy

| Version | Status | Support End Date | Security Updates |
|---------|--------|------------------|------------------|
| v3.5.x  | ✅ Active | Current | ✅ Yes |
| v3.0.x  | ✅ Supported | 2026-06-30 | ✅ Yes |
| v2.x.x  | ⚠️ Limited | 2026-03-31 | ⚠️ Critical Only |
| v1.x.x  | ❌ Deprecated | 2026-01-31 | ❌ No |

> **Note:** Versions earlier than **v3.0.0** no longer receive security updates. Please upgrade to the latest release.

---

## Migration Guides

### Upgrading from v3.0.x to v3.5.x
- ✅ No breaking changes
- ✅ New features available immediately
- ✅ All previous configurations remain compatible
- 📝 New documentation available (ARCHITECTURE.md, FAQ.md)

### Upgrading from v2.x to v3.x
- ⚠️ Custom themes need to be reconfigured due to new color system
- ⚠️ Export settings have new quality options
- ✅ LocalStorage keys have changed (automatic migration on first load)
- 📝 Review new theme customization options

### Upgrading from v1.x to v2.x
- ⚠️ Piece set names have been standardized
- ⚠️ Theme structure has changed significantly
- ✅ Board size range expanded (400px - 1600px)
- 📝 Update any custom configurations

---

## Development Timeline

```
2025-12-27  │  Project initialization
2025-12-28  │  v1.0.0 - Initial stable release
2025-12-29  │  v2.0.0 - Major customization update
2025-12-31  │  v2.1.0 - Download & coordinates
2026-01-01  │  v2.2.0 - Performance improvements
2026-01-02  │  v3.0.0 - Advanced features
2026-01-03  │  v3.5.0 - Multi-FEN & optimization
2026-01-04  │  v3.5.1 - Bug fixes & documentation
            │  
    Future  │  v4.0.0 - SVG export (planned)
            │  v4.1.0 - Folder support (planned)
```

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Quick Links
- 🐛 [Report a Bug](https://github.com/BilgeGates/chess_viewer/issues)
- 💡 [Request a Feature](https://github.com/BilgeGates/chess_viewer/issues)
- 📖 [Read the Docs](https://github.com/BilgeGates/chess_viewer)

---

**© 2026 Khatai Huseynzada. Licensed under MIT.**