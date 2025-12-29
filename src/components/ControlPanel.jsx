import {
  BOARD_THEMES,
  PIECE_SETS,
  FAMOUS_POSITIONS,
  QUALITY_PRESETS,
} from "../constants/chessConstants";
import { validateFEN } from "../utils/fenParser";
import { Copy, CheckCircle2 } from "lucide-react";

const ControlPanel = (props) => {
  const {
    fen,
    setFen,
    pieceStyle,
    setPieceStyle,
    showCoords,
    setShowCoords,
    lightSquare,
    setLightSquare,
    darkSquare,
    setDarkSquare,
    boardSize,
    setBoardSize,
    fileName,
    setFileName,
    exportQuality,
    setExportQuality,
    onNotification,
  } = props;

  const applyTheme = (themeKey) => {
    const theme = BOARD_THEMES[themeKey];
    if (theme) {
      setLightSquare(theme.light);
      setDarkSquare(theme.dark);
    }
  };

  const handleValidate = () => {
    try {
      const isValid = validateFEN(fen);
      if (onNotification) {
        if (isValid) {
          onNotification("Valid FEN", "success");
        } else {
          onNotification("Invalid FEN", "error");
        }
      } else {
        alert(isValid ? "Valid FEN" : "Invalid FEN");
      }
    } catch (err) {
      if (onNotification) {
        onNotification("Invalid FEN: " + err.message, "error");
      } else {
        alert("Invalid FEN: " + err.message);
      }
    }
  };

  const handleCopyFEN = async () => {
    try {
      await navigator.clipboard.writeText(fen);
      if (onNotification) {
        onNotification("FEN copied to clipboard", "success");
      } else {
        alert("FEN copied to clipboard!");
      }
    } catch (err) {
      if (onNotification) {
        onNotification("Failed to copy FEN", "error");
      } else {
        alert("Failed to copy FEN");
      }
    }
  };

  // Range slider handler - 50px steps
  const handleRangeChange = (value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setBoardSize(numValue);
    }
  };

  // Number input handler - free input with validation
  const handleNumberInputChange = (value) => {
    const numValue = parseInt(value);

    // Allow empty input for editing
    if (value === "") {
      return;
    }

    if (isNaN(numValue)) {
      if (onNotification) {
        onNotification("Please enter a valid number", "warning");
      }
      return;
    }

    // Apply limits
    if (numValue < 150) {
      if (onNotification) {
        onNotification("Minimum board size is 150px", "warning");
      }
      setBoardSize(150);
    } else if (numValue > 600) {
      if (onNotification) {
        onNotification("Maximum board size is 600px", "warning");
      }
      setBoardSize(600);
    } else {
      setBoardSize(numValue);
    }
  };

  // Blur handler for number input
  const handleNumberInputBlur = (value) => {
    const numValue = parseInt(value);

    // If empty or invalid on blur, reset to current or default
    if (value === "" || isNaN(numValue)) {
      if (boardSize < 150 || boardSize > 600) {
        setBoardSize(400); // Reset to default
      }
      return;
    }

    // Ensure valid range
    if (numValue < 150) {
      setBoardSize(150);
    } else if (numValue > 600) {
      setBoardSize(600);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50  space-y-6">
      {/* FEN Input */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-300">
          FEN Notation
        </label>
        <div className="relative">
          <textarea
            value={fen}
            onChange={(e) => setFen(e.target.value)}
            className="w-full px-4 py-3 pr-20 bg-gray-950/50 border border-gray-700 rounded-lg text-sm text-gray-200 font-mono resize-y min-h-[90px] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={handleValidate}
              className="p-2 bg-amber-600/90 hover:bg-amber-500 rounded-md text-white transition-all hover:scale-110 active:scale-95"
              title="Validate FEN"
            >
              <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
            </button>
            <button
              onClick={handleCopyFEN}
              className="p-2 bg-green-600/90 hover:bg-green-500 rounded-md text-white transition-all hover:scale-105 active:scale-95"
              title="Copy FEN"
            >
              <Copy className="w-3 h-3" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Famous Positions */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">
          Famous Positions
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {Object.entries(FAMOUS_POSITIONS).map(([key, pos]) => (
            <button
              key={key}
              onClick={() => setFen(pos.fen)}
              className="px-3 py-2 bg-gray-950/50 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs text-gray-200 transition-all hover:border-gray-600 text-left hover:shadow-md"
              title={pos.description}
            >
              <div className="font-medium">{pos.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Piece Style */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-300">
          Piece Style
        </label>
        <select
          value={pieceStyle}
          onChange={(e) => setPieceStyle(e.target.value)}
          className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all cursor-pointer hover:border-gray-600"
        >
          {PIECE_SETS.map((set) => (
            <option key={set.id} value={set.id}>
              {set.name}
            </option>
          ))}
        </select>
      </div>

      {/* Display Options */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Display Options
        </label>
        <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-700/30 transition-colors">
          <input
            type="checkbox"
            checked={showCoords}
            onChange={(e) => setShowCoords(e.target.checked)}
            className="w-5 h-5 cursor-pointer accent-blue-500"
          />
          <span className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
            Show Coordinates
          </span>
        </label>
      </div>

      {/* Board Themes */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">
          Board Theme
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(BOARD_THEMES).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => applyTheme(key)}
              className="group relative px-3 py-2 bg-gray-950/50 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs text-gray-200 transition-all hover:border-gray-600 overflow-hidden hover:shadow-md"
            >
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity flex">
                <div
                  className="w-1/2 h-full"
                  style={{ background: theme.light }}
                />
                <div
                  className="w-1/2 h-full"
                  style={{ background: theme.dark }}
                />
              </div>
              <span className="relative z-10 font-medium">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">
          Custom Colors
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <span className="block text-xs text-gray-400">Light Square</span>
            <div
              onClick={() => document.getElementById("lightSquare").click()}
              className="flex items-center gap-2 p-2.5 bg-gray-950/50 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-all group"
            >
              <div
                className="w-8 h-8 rounded border-2 border-white/10 shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform"
                style={{ background: lightSquare }}
              />
              <div className="text-xs font-bold text-gray-300 font-mono uppercase tracking-wide">
                {lightSquare.toUpperCase()}
              </div>
            </div>
            <input
              id="lightSquare"
              type="color"
              value={lightSquare}
              onChange={(e) => setLightSquare(e.target.value)}
              className="sr-only"
            />
          </div>

          <div className="space-y-2">
            <span className="block text-xs text-gray-400">Dark Square</span>
            <div
              onClick={() => document.getElementById("darkSquare").click()}
              className="flex items-center gap-2 p-2.5 bg-gray-950/50 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-all group"
            >
              <div
                className="w-8 h-8 rounded border-2 border-white/10 shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform"
                style={{ background: darkSquare }}
              />
              <div className="text-xs font-bold text-gray-300 font-mono uppercase tracking-wide">
                {darkSquare.toUpperCase()}
              </div>
            </div>
            <input
              id="darkSquare"
              type="color"
              value={darkSquare}
              onChange={(e) => setDarkSquare(e.target.value)}
              className="sr-only"
            />
          </div>
        </div>
      </div>

      {/* Board Size - Range 50px steps, Input free */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-gray-300">
            Board Size
          </label>
          <span className="text-xs text-blue-400 font-mono font-bold">
            {boardSize}px
          </span>
        </div>
        <div className="flex gap-3 items-center">
          <input
            type="range"
            min="150"
            max="600"
            step="50"
            value={boardSize}
            onChange={(e) => handleRangeChange(e.target.value)}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          {/* Number Input: Free input 200-600 */}
          <input
            type="number"
            min="150"
            max="600"
            step="1"
            value={boardSize}
            onChange={(e) => handleNumberInputChange(e.target.value)}
            onBlur={(e) => handleNumberInputBlur(e.target.value)}
            className="w-20 px-2 py-1.5 bg-gray-950/50 border border-gray-700 rounded-lg text-sm text-gray-200 text-center font-mono font-semibold focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          />
        </div>
      </div>

      {/* Export Quality */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-gray-300">
            Export Quality
          </label>
          <span className="text-xs text-purple-400 font-mono font-bold">
            {exportQuality}x
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {QUALITY_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setExportQuality(preset.value)}
              className={`px-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                exportQuality === preset.value
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-gray-950/50 text-gray-300 hover:bg-gray-700 border border-gray-700"
              }`}
              title={preset.description}
            >
              {preset.value}x
            </button>
          ))}
        </div>
      </div>

      {/* File Name */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-300">
          Export File Name
        </label>
        <div className="relative">
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all pr-16"
            placeholder="chess-position"
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
