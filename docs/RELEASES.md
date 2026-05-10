# Releases

## ChessVision v5.5.0 — TypeScript Migration & Architecture Overhaul

**Latest** | Released May 09, 2026

### Highlights

This release marks a massive leap forward in codebase stability and developer experience by finalizing the TypeScript migration. We have significantly pruned legacy and redundant components to simplify the internal architecture, paving the way for safer, faster future development.

### Major Changes

- **TypeScript Foundation**: Full integration of TypeScript including `vite-env.d.ts`, `tsconfig.json`, and proper TS entry points (`src/index.tsx`, `src/App.tsx`). Added extensive type definitions for React and ReactDOM.
- **Component Simplification**: Radically cleaned the codebase by removing deprecated components: `DndProvider`, `CustomDragLayer`, `ChessEditor`, `FENInputList`, `BoardPreview`, `PieceSelector`, and `PiecePalette`.
- **Centralized Logic**: Deprecated the standalone `fenParser.js` utility in favor of unified, centralized utility functions.
- **State Management**: Introduced `LayoutProvider` and `useLayout` hook to better manage application-level states such as Navbar visibility.

---

## ChessVision v5.4.0 — Layout Enhancements & UI Polish

Released May 07, 2026

### Highlights

Version 5.4.0 brings a huge wave of visual refinements. From mobile layout fixes to sleek new transition effects, the entire application interface feels more premium, responsive, and accessible.

### UX & Styling Improvements

- **Responsive Mastery**: Enhanced grid layouts and responsive classes across `HomePage`, `ChessEditor`, and `AdvancedFENInputPage` for flawless mobile viewing.
- **Visual Polish**: Added smooth hover effects, dropdown animations in `CustomSelect`, and refined transition timings across `Toast`, `Navbar`, and `HelpCenterDrawer`.
- **Theme Settings**: Added intuitive theme edit controls with apply/cancel functionalities directly within the `SettingsPage`.
- **Accessibility**: Removed unnecessary scaling effects and improved pagination control states for better user accessibility.

---

## ChessVision v5.3.0 — Core Validations & Interaction Fixes

Released May 07, 2026

### Highlights

Focused heavily on engine stability, this release introduces rigid validation layers and critical fixes to our drag-and-drop mechanics to prevent performance crashes.

### Bug Fixes & Optimizations

- **FEN Strict Validation**: Enforced `MAX_FEN_LENGTH` limits dynamically across manual input flows and clipboard paste events.
- **Drag-and-Drop Reliability**: Fixed touch device detection to properly restore the HTML5 backend on desktop environments. Improved the offset calculations for drag previews to ensure pieces center correctly under the cursor.
- **Performance**: Integrated `useRef` optimizations for piece image handling to reduce render cycles, and added the `willReadFrequently` flag to canvas contexts for faster pixel manipulation.
- **Export Safety**: Added stringent `validateFEN` guards to the export pipeline, halting invalid PNG/JPEG creation before it crashes the canvas.

---

## ChessVision v5.2.0 — Theme Expansion & Ecosystem Stability

Released May 06, 2026

### Highlights

Expanded the customization ecosystem to allow users greater flexibility with their visual preferences while stabilizing routing and minor component behaviors.

### Added & Changed

- **Expanded Themes**: Increased `MAX_TOTAL_PRESETS` to allow users to store a much larger array of custom theme configurations without overwriting past favorites.
- **Route Formatting**: Cleaned and reformatted internal routing definitions for strict consistency.
- **Component Polish**: Minor spacing and styling adjustments applied to the `ColorPickerPanel`, `ErrorFallback`, and `PaginationDots` elements.

---

## ChessVision v5.1.0 — Architecture Prep & Cleanup

Released May 04, 2026

### Highlights

A foundational update to prepare the repository for TypeScript integration, standardizing linting patterns and resolving long-standing formatting inconsistencies across documentation.

### Improvements

- **Codebase Standardization**: Centralized code formatting, updated Markdown documentation styles, and ensured table consistencies in `ARCHITECTURE.md`, `FAQ.md`, and `KNOWN_ISSUES.md`.
- **Development Tooling**: Updated the pre-commit hooks to use `pnpm` exclusively, enforcing stricter commit message guidelines.
- **Minor Enhancements**: Updated layout structures in the `Navbar` to natively support right-slot props.

---

## Patch Releases (v5.0.1 – v5.0.15)

Released April 19, 2026 – May 04, 2026

### General Fixes

- **v5.0.10 - v5.0.15**: Routine Dependabot security and core library upgrades (`globals`, `lucide-react`, `postcss`, `@commitlint/cli`).
- **v5.0.9**: Enhanced audio playback logic to properly manage the `AudioContext` lifecycle, resolving sound distortion on continuous moves.
- **v5.0.8**: Fixed Z-index handling in `DraggablePiece` ensuring pieces stay atop the board during active drag events.
- **v5.0.4 - v5.0.7**: Minor layout tweaks and CSS refinements to enforce cleaner font stacks.
- **v5.0.1 - v5.0.3**: Reconfigured GitHub workflows and CodeQL rescans for optimized CI/CD operations.
