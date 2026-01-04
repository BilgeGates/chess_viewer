# Contributing Guide

Thank you for considering contributing to **Chess Diagram Generator**!  
We appreciate all contributions — bug reports, feature requests, documentation improvements, and code contributions.

---

## 📌 Ways to Contribute

You can contribute by:

- **Reporting bugs** — Help us identify and fix issues
- **Suggesting features** — Share ideas for new functionality
- **Improving code** — Fix bugs, optimize performance, or refactor
- **Enhancing UI/UX** — Make the interface more intuitive and visually appealing
- **Writing documentation** — Improve guides, comments, and examples
- **Reviewing pull requests** — Provide feedback on proposed changes

---

## 🐞 Reporting Bugs

Before creating a new issue:

1. **Search existing issues** to avoid duplicates
2. **Verify the bug** on the latest version
3. **Open a new issue** with the following information:
   - **Clear description** of the problem
   - **Steps to reproduce** the issue
   - **Expected behavior** vs **actual behavior**
   - **Screenshots or GIFs** (if applicable)
   - **Environment details**:
     - Browser (name and version)
     - Operating system
     - Chess Diagram Generator version (if applicable)

➡️ **Submit bug reports here:**  
[GitHub Issues](https://github.com/BilgeGates/chess_viewer/issues)

---

## ✨ Feature Requests

We welcome feature requests that improve Chess Diagram Generator!

When submitting a feature request, please include:

- **Clear description** of the proposed feature
- **Use case** — Explain why it would be useful
- **Expected behavior** — How should it work?
- **Examples or mockups** (optional but helpful)
- **Potential implementation** (if you have ideas)

Feature discussions help us prioritize development and ensure we're building what users need.

---

## 🧑‍💻 Development Setup

### Prerequisites

Before you begin, ensure you have:

- **Node.js** (LTS version recommended — v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
```bash
git clone https://github.com/YOUR_USERNAME/chess_viewer.git
cd chess_viewer
```

3. **Install dependencies:**
```bash
npm install
# or
yarn install
```

4. **Start the development server:**
```bash
npm start
# or
yarn start
```

5. **Open your browser** and navigate to the local development URL (typically `http://localhost:3000`)

### Project Structure
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
└── 📄 LICENSE
```

---

## 🔧 Making Changes

### Workflow

1. **Create a new branch** for your changes:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

2. **Make your changes** with clear, focused commits:
```bash
git add .
git commit -m "Add: brief description of changes"
```

3. **Follow coding standards:**
   - Use consistent formatting (Prettier/ESLint if configured)
   - Write clear, descriptive variable and function names
   - Add comments for complex logic
   - Keep functions small and focused

4. **Test your changes** thoroughly:
   - Verify functionality works as expected
   - Check for console errors
   - Test on different browsers if possible

5. **Push to your fork:**
```bash
git push origin feature/your-feature-name
```

### Commit Message Guidelines

Use clear, descriptive commit messages:

- **Add:** for new features
- **Fix:** for bug fixes
- **Update:** for modifications to existing features
- **Refactor:** for code improvements without changing functionality
- **Docs:** for documentation changes

**Example:**
```
Add: board flip functionality
Fix: piece drag-and-drop on mobile devices
Update: improve move validation performance
```

---

## 🚀 Submitting a Pull Request

1. **Push your changes** to your forked repository
2. **Open a pull request** on the main repository
3. **Provide a clear description:**
   - What changes were made
   - Why the changes are necessary
   - Any related issues (use `Fixes #123` to auto-close issues)
   - Screenshots (for UI changes)

4. **Wait for review** — maintainers will review your PR and may request changes
5. **Address feedback** — make requested changes and push updates
6. **Celebrate!** 🎉 Once approved, your contribution will be merged

### Pull Request Checklist

Before submitting, ensure:

- [ ] Code follows project style and conventions
- [ ] Changes have been tested locally
- [ ] No console errors or warnings
- [ ] Documentation updated (if needed)
- [ ] Commit messages are clear and descriptive
- [ ] Branch is up to date with main branch

---

## 📝 Documentation

Good documentation helps everyone! You can contribute by:

- Improving README clarity
- Adding code comments
- Creating usage examples
- Writing tutorials or guides
- Fixing typos or formatting issues

---

## 💬 Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- Be respectful and considerate
- Provide constructive feedback
- Focus on what is best for the project and community
- Show empathy towards other contributors

Unacceptable behavior will not be tolerated.

---

## ❓ Questions or Need Help?

If you have questions or need assistance:

- **Open a discussion** on GitHub Discussions (if enabled)
- **Ask in the issues** with the `question` label
- **Reach out** via email or project contact methods

---

## 🙏 Thank You!

Your contributions make Chess Diagram Generator better for everyone. We appreciate your time, effort, and dedication to improving this project!

Happy coding! ♟️

---

**Project Repository:**  
https://github.com/BilgeGates/chess_viewer

**Report Issues:**  
https://github.com/BilgeGates/chess_viewer/issues