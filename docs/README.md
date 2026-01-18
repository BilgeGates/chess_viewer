# Chess Diagram Generator Documentation

Technical documentation for Chess Diagram Generator.

---

## Documentation Index

### Core Documentation
- **[Architecture](ARCHITECTURE.md)** - System design and folder structure
- **[State Management](STATE_MANAGEMENT.md)** - React state patterns
- **[Decisions](DECISIONS.md)** - Architectural decision records

### Technical References
- **[Export Pipeline](EXPORT_PIPELINE.md)** - Export system documentation
- **[Performance](PERFORMANCE.md)** - Performance considerations
- **[Accessibility](ACCESSIBILITY.md)** - Current accessibility status (limited)
- **[FEN Notation](FEN.md)** - FEN notation reference
- **[Known Issues](KNOWN_ISSUES.md)** - Tracked issues and limitations
- **[Design Errors](DESIGN_ERRORS_ANALYSIS.md)** - Identified issues and fixes

### Project Information
- **[Changelog](CHANGELOG.md)** - Version history
- **[FAQ](FAQ.md)** - Common questions
- **[Linting Setup](LINTING_SETUP.md)** - Code quality tools
- **[Roadmap](ROADMAP.md)** - Planned features

---

## Quick Reference

### For Developers
1. Read [Architecture](ARCHITECTURE.md) for system overview
2. Review [State Management](STATE_MANAGEMENT.md) for patterns
3. Check [Known Issues](KNOWN_ISSUES.md) before development

### For Contributors
1. Review [Decisions](DECISIONS.md) for context
2. Check [Design Errors](DESIGN_ERRORS_ANALYSIS.md) for open issues
3. Follow code style in existing files

---

## Current Status

### What Works
- FEN parsing and validation
- Canvas board rendering
- PNG/JPEG export (up to 12,800x12,800px)
- Multiple piece sets and themes
- Board flip and coordinate toggle
- Local storage for history/favorites

### Known Limitations
- No WCAG accessibility compliance
- Canvas not accessible to screen readers
- No keyboard shortcuts
- No offline support
- Safari has export limitations (see Known Issues)

### Recent Fixes (v3.5.2)
- Console logs replaced with logger utility
- setTimeout memory leak cleanup
- Error boundary added
- Basic ARIA labels on key components
- Centralized error handling utility

---

## Repository Links
- **Source:** [github.com/BilgeGates/chess_viewer](https://github.com/BilgeGates/chess_viewer)
- **Demo:** [chess-viewer-site.vercel.app](https://chess-viewer-site.vercel.app)
- **Issues:** [GitHub Issues](https://github.com/BilgeGates/chess_viewer/issues)

---

**Last Updated:** January 18, 2026
