# Chess Diagram Generator - Roadmap

Potential future features. No timeline commitments.

---

## Implemented (v3.5.2)
- FEN parsing and validation
- Canvas board rendering
- PNG/JPEG export (up to 12,800x12,800px)
- Multiple piece sets (20+)
- Multiple themes (12+)
- Custom color picker
- Board flip
- Coordinate toggle
- FEN history (localStorage)
- Batch export (multiple FEN)
- Error boundary
- Basic ARIA labels
- Logger utility (dev-only)
- Centralized error handling

---

## Not Yet Implemented

### Low Effort
- [ ] Dark mode toggle
- [ ] URL-based position sharing (?fen=...)
- [ ] Keyboard shortcuts

### Medium Effort
- [ ] SVG export
- [ ] Custom piece set upload
- [ ] Undo/redo for board edits
- [ ] Arrow/highlight annotations
- [ ] PGN import

### High Effort
- [ ] Screen reader accessibility
- [ ] Offline mode (PWA)
- [ ] Position database
- [ ] Collaboration features
- [ ] Native mobile apps

---

## Known Technical Debt
- Canvas not accessible to screen readers
- No unit test coverage
- Export memory issues on Safari/iOS
- Limited error messages for users
- No i18n support

---

## Not Planned
- Move animation
- Game analysis
- Backend/database
- User accounts

---

**Last Updated:** January 18, 2026
