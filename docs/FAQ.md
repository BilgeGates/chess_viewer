# Chess Diagram Generator - Frequently Asked Questions (FAQ)

## Table of Contents
- [General Questions](#general-questions)
- [FEN Notation](#fen-notation)
- [Board Customization](#board-customization)
- [Piece Sets](#piece-sets)
- [Export & Image Quality](#export--image-quality)
- [Technical Issues](#technical-issues)
- [Browser Support](#browser-support)
- [Features & Functionality](#features--functionality)
- [Pricing & Licensing](#pricing--licensing)
- [Contributing & Development](#contributing--development)

---

## General Questions

### What is Chess Diagram Generator?

Chess Diagram Generator is a free, browser-based tool that creates high-quality images of chess positions using FEN notation. Perfect for coaches, content creators, authors, and players who need professional chess diagrams.

### Do I need to install anything?

No! Chess Diagram Generator runs entirely in your web browser. Just visit the website and start creating diagrams immediately. No downloads, no installations, no sign-ups required.

### Is Chess Diagram Generator free?

Yes, completely free and open-source. You can use it for personal or commercial projects without any restrictions.

### Can I use Chess Diagram Generator offline?

Currently requires an internet connection to load piece images and assets.

### What browsers are supported?

Chess Diagram Generator works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

### Does it work on mobile devices?

Yes! Chess Diagram Generator is fully responsive and works on smartphones and tablets. However, high-resolution exports work best on desktop browsers due to memory requirements.

---

## FEN Notation

### What is FEN notation?

FEN (Forsyth-Edwards Notation) is a standard notation for describing chess positions. It's a compact text string that represents the entire board state.

**Example:**
```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

This represents the starting position of a chess game.

### How do I write FEN notation?

FEN consists of 6 fields separated by spaces:

1. **Piece placement** - From rank 8 to rank 1, separated by `/`
   - Uppercase = White pieces (K, Q, R, B, N, P)
   - Lowercase = Black pieces (k, q, r, b, n, p)
   - Numbers = Empty squares (1-8)

2. **Active color** - `w` (white) or `b` (black) to move

3. **Castling rights** - `K` (white kingside), `Q` (white queenside), `k` (black kingside), `q` (black queenside), or `-` if none

4. **En passant target** - Square notation (e.g., `e3`) or `-` if none

5. **Halfmove clock** - Number of moves since last capture or pawn move

6. **Fullmove number** - Current move number

### Can I use partial FEN notation?

Yes! Chess Diagram Generator accepts just the piece placement field:
```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
```

The other fields are optional and default to standard values.

### What happens if my FEN is invalid?

Chess Diagram Generator will show an error message and highlight what's wrong. Common errors:
- Wrong number of ranks (must be 8)
- Invalid piece letters
- Sum of squares in a rank doesn't equal 8

### Where can I learn more about FEN?

- [Wikipedia - Forsyth-Edwards Notation](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation)
- [Chess.com FEN Guide](https://www.chess.com/terms/fen-chess)
- Use chess engines like Lichess or Chess.com to generate FEN from positions

### Can I convert PGN to FEN?

Not yet. Currently, Chess Diagram Generator only accepts FEN notation. PGN import is planned for a future update. For now, use chess platforms like Lichess to navigate to a position and copy its FEN.

---

## Board Customization

### How many board themes are available?

Chess Diagram Generator includes **12+ preset themes**:
- Brown (classic tournament style)
- Blue
- Green
- Wood grain
- Grey
- Purple
- Red
- Orange
- Pink
- Marble
- Neon
- High Contrast (for accessibility)

### Can I create custom colors?

Yes! You can manually set light and dark square colors using:
- HEX codes (e.g., `#f0d9b5`)
- RGB values
- Color picker tool

### Can I save my custom theme?

Not yet. Custom themes are session-based. Saving custom themes to your browser is planned for a future update.

### What's the "High Contrast" theme for?

The High Contrast theme uses maximum color difference between light and dark squares, making it ideal for:
- Visually impaired users
- Black and white printing
- Presentations with poor projector quality
- Educational materials

### Can I remove board coordinates?

Yes! Click the "Toggle Coordinates" button in the control panel. This removes the file (a-h) and rank (1-8) labels from the edges.

---

## Piece Sets

### How many piece sets are available?

Chess Diagram Generator includes **20+ professional piece sets**, including:
- CBurnett (default, most popular)
- Alpha
- Merida
- Leipzig
- Companion
- Fantasy
- Spatial
- Shapes
- Pixel
- Maestro
- Governor
- Cardinal
- Gioco
- Tatiana
- Horsey
- Fresca
- Chessnut
- Letter
- And many more!

### Which piece set should I use?

**For most users:** CBurnett (clear, modern, widely recognized)

**For print materials:** Merida or Staunty (high contrast)

**For modern designs:** Alpha or Spatial

**For retro/fun projects:** Pixel or Shapes

**For classical look:** Leipzig or Governor

### Can I upload my own piece set?

Not yet. Custom piece set upload is planned for a future release. Currently, you must choose from the built-in sets.

### Why do piece images take time to load?

Piece images are loaded from external files on first render. They're cached by your browser afterward, so subsequent uses will be instant.

### Are the piece sets licensed?

All included piece sets are either:
- Open-source (Creative Commons or similar)
- Created specifically for Chess Diagram Generator
- Used with permission

You can use exported images commercially without attribution (though attribution is appreciated!).

---

## Export & Image Quality

### What image formats can I export?

Chess Diagram Generator supports two formats:
- **PNG** - Lossless, transparent background, best for web
- **JPEG** - Smaller file size, best for social media

### What's the maximum resolution?

You can export images from **3,200 × 3,200 pixels** (8× scale) up to **12,800 × 12,800 pixels** (32× scale).

**Available scales:**
- 8× (3,200×3,200px) - Web thumbnails, blog posts
- 16× (6,400×6,400px) - Social media, presentations
- 24× (9,600×9,600px) - Print materials at 300 DPI
- 32× (12,800×12,800px) - Large posters, banners

### Can I export multiple positions at once?

Yes! Using **Advanced FEN Input**, you can export up to 10 positions simultaneously. Enter multiple FEN strings (one per line) and export them all in your chosen format.

### Can I export in both PNG and JPEG formats at the same time?

Yes! Using the **Batch Export** feature, you can export the same position(s) in both PNG and JPEG formats simultaneously. This is useful when you need multiple formats for different use cases.

### How do I choose the right export quality?

| Use Case | Format | Scale | Resolution |
|----------|--------|-------|------------|
| Website thumbnail | PNG | 8× | 3,200×3,200 |
| Twitter/Instagram post | JPEG | 16× | 6,400×6,400 |
| YouTube thumbnail | JPEG | 16× | 6,400×6,400 |
| Chess book (print) | PNG | 24× | 9,600×9,600 |
| Poster | PNG | 32× | 12,800×12,800 |
| Email/document | PNG | 8× | 3,200×3,200 |

### Why is my export taking a long time?

Large exports (24×, 32×) require significant memory and processing power. Your browser needs to:
1. Create a large canvas (up to 164 million pixels)
2. Redraw the entire board at high resolution
3. Compress the image
4. Generate a downloadable file

**Tips for faster exports:**
- Close other browser tabs
- Use a desktop browser (not mobile)
- Reduce export scale if possible
- Use JPEG instead of PNG for faster processing

### My browser crashes during export. What should I do?

This happens when your browser runs out of memory for ultra-high-resolution exports. Try:
- Use a lower scale (8× or 16× instead of 32×)
- Close other applications
- Use a 64-bit browser
- Export on a computer with more RAM

### Can I export with a transparent background?

Yes, when exporting as PNG, the background is automatically transparent. This is perfect for overlaying diagrams on custom backgrounds.

### Can I export as SVG?

Not yet. SVG export is planned for a future update, which will allow infinite scaling without quality loss.

---

## Technical Issues

### The board is not displaying correctly. What should I do?

Try these steps:
1. Refresh the page (Ctrl+F5 or Cmd+Shift+R)
2. Clear your browser cache
3. Check your internet connection
4. Try a different browser
5. Disable browser extensions (especially ad blockers)

### Piece images are missing or broken

This usually happens when:
- Your internet connection is slow or interrupted
- A piece set failed to load
- Browser cache is corrupted

**Solution:**
1. Hard refresh the page
2. Try a different piece set
3. Clear browser cache and reload

### My custom FEN won't load

Check for these common errors:
- **Wrong number of ranks:** Must have exactly 8 ranks separated by `/`
- **Invalid piece letters:** Use only `prnbqkPRNBQK`
- **Square count mismatch:** Each rank must sum to 8 squares
- **Spaces in piece placement:** Don't use spaces in the first FEN field

### The export button isn't working

Make sure:
- Your browser supports Canvas API
- You're not running out of memory (reduce scale)
- Popup blockers aren't interfering
- You've allowed downloads in browser settings

### Colors look different after export

This can happen due to:
- Color space conversion (sRGB vs Display P3)
- JPEG compression artifacts
- Monitor calibration differences

**Solution:** Use PNG for color-accurate exports.

---

## Browser Support

### Does Chess Diagram Generator work in Internet Explorer?

No. Internet Explorer is not supported. Please use a modern browser like Chrome, Firefox, Safari, or Edge.

### Why doesn't it work in my old browser?

Chess Diagram Generator uses modern web technologies:
- HTML5 Canvas API
- ES6+ JavaScript
- CSS Grid and Flexbox
- Blob API

These are not available in older browsers. Please update to a recent browser version.

### Does it work on iPad/iPhone?

Yes! Chess Diagram Generator works on iOS devices with Safari 14+. However, high-resolution exports (24×+) may be limited by mobile device memory.

### Does it work on Android?

Yes! Chess Diagram Generator works on Android with Chrome or Firefox. Exports work best on tablets or phones with at least 4GB RAM.

---

## Features & Functionality

### Can I flip the board to view from Black's perspective?

Yes! Click the "Flip Board" button in the control panel. This rotates the board 180° and updates coordinates accordingly.

### Can I add arrows and highlights to the board?

Not yet. Annotation tools (arrows, circles, highlights) are planned for a future release.

### Can I animate moves?

No. Chess Diagram Generator is designed for static position diagrams. Move animation is not planned.

### Can I input moves instead of FEN?

Not yet. PGN/move import is planned. For now, use a chess platform to reach the position and copy the FEN.

### Can I save my diagrams?

You can export diagrams as images. Position saving/history is planned for a future update using browser storage.

### Can I share a link to my position?

Not yet. URL-based position sharing is planned (e.g., `chessviewer.com/?fen=...`).

### Is there a dark mode?

The interface has a light theme by default. A dark mode toggle is planned for a future release.

### Can I print diagrams directly?

For best results, export as PNG and print from your image viewer. Direct browser printing may not preserve quality.

---

## Pricing & Licensing

### Is Chess Diagram Generator really free?

Yes! 100% free with no hidden costs, subscriptions, or premium tiers.

### Can I use it for commercial projects?

Yes! You can use Chess Diagram Generator and exported images for:
- Books and ebooks
- Online courses
- YouTube videos
- Commercial websites
- Printed materials
- Client work

No attribution required (though appreciated!).

### What license is the project under?

Chess Diagram Generator is licensed under the **MIT License**, which allows:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

### Can I self-host Chess Diagram Generator?

Yes! The project is open-source. You can:
1. Clone the GitHub repository
2. Host it on your own server
3. Modify it for your needs
4. Integrate it into your application

### Can I remove the branding?

Yes, if you self-host. The MIT License allows you to modify and rebrand the application.

---

## Contributing & Development

### How can I report a bug?

1. Go to the [GitHub Issues page](https://github.com/BilgeGates/chess_viewer/issues)
2. Click "New Issue"
3. Select "Bug Report"
4. Provide details (browser, steps to reproduce, screenshots)

### How can I request a feature?

1. Check if the feature is already requested in Issues
2. If not, create a new "Feature Request" issue
3. Describe the feature and its use case
4. Add mockups or examples if possible

### Can I contribute code?

Absolutely! Contributions are welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
5. Wait for review

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.

### What features are planned for the future?

**Roadmap:**
- ✅ Basic FEN rendering (done)
- ✅ Theme customization (done)
- ✅ High-res export (done)
- ✅ Batch export (done)
- 🔜 URL sharing
- 🔜 PWA / offline mode
- 🔜 Dark mode
- 🔜 Custom piece set upload

### How can I stay updated on new features?

- ⭐ Star the [GitHub repository](https://github.com/BilgeGates/chess_viewer)
- 👁️ Watch the repo for releases
- 📢 Share with other chess enthusiasts

### Can I donate or sponsor the project?

The project is currently free with no monetization. If you'd like to support development:
- ⭐ Star the GitHub repository
- 🐛 Report bugs and suggest features
- 💻 Contribute code
- 📢 Share with other chess enthusiasts

---

## Still Have Questions?

If your question isn't answered here:

1. **Check the documentation:**
   - [README.md](../README.md) - Getting started guide
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical details
   - [CONTRIBUTING.md](../CONTRIBUTING.md) - Development guide

2. **Search existing issues:**
   - [GitHub Issues](https://github.com/BilgeGates/chess_viewer/issues)

3. **Ask the community:**
   - Create a new GitHub issue
   - Tag it with "question"

4. **Contact the developer:**
   - Via GitHub profile
   - Email: darkdeveloperassistant@gmail.com

---

**Last Updated:** January 2026  
**Maintained by:** Khatai Huseynzada

---

## Quick Links

- 🌐 [Live Demo](https://chess-viewer-site.vercel.app/)
- 📂 [GitHub Repository](https://github.com/BilgeGates/chess_viewer)
- 📖 [Documentation](../README.md)
- 🏗️ [Architecture Guide](./ARCHITECTURE.md)
- 🤝 [Contributing Guide](../CONTRIBUTING.md)
- 📜 [License](../LICENSE)

---

**Happy chess diagramming! ♟️**