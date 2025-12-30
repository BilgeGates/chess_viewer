import { useState } from "react";
import {
  BOARD_THEMES,
  PIECE_SETS,
  FAMOUS_POSITIONS,
  QUALITY_PRESETS,
} from "../constants/chessConstants";
import { validateFEN } from "../utils/fenParser";
import {
  Copy,
  CheckCircle2,
  ChevronDown,
  CheckCircle,
  SearchX,
} from "lucide-react";

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

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  const selectedSet = PIECE_SETS.find((p) => p.id === pieceStyle);

  let displaySets;

  if (search.trim() === "") {
    displaySets = [
      ...(selectedSet ? [selectedSet] : []),
      ...PIECE_SETS.filter((set) => set.id !== pieceStyle),
    ];
  } else {
    displaySets = PIECE_SETS.filter((set) =>
      set.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const applyTheme = (themeKey) => {
    const theme = BOARD_THEMES[themeKey];
    if (theme) {
      setLightSquare(theme.light);
      setDarkSquare(theme.dark);
      onNotification?.(`${theme.name} theme applied`, "success");
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

  const handleRangeChange = (value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setBoardSize(numValue);
    }
  };

  const handleNumberInputChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setBoardSize("");
      return;
    }

    const numValue = parseInt(value);

    if (isNaN(numValue)) {
      return;
    }

    setBoardSize(numValue);
  };

  const handleNumberInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const numValue = parseInt(boardSize);

      if (boardSize === "" || isNaN(numValue)) {
        onNotification?.("Please enter a valid number", "error");
        setBoardSize(400);
        return;
      }

      if (numValue < 150) {
        onNotification?.("Minimum board size is 150px", "error");
        e.target.blur();
        return;
      }

      if (numValue > 600) {
        onNotification?.("Maximum board size is 600px", "error");
        e.target.blur();
        return;
      }

      onNotification?.(`Board size set to ${numValue}px`, "success");
      e.target.blur();
    }
  };

  const handleNumberInputBlur = () => {
    const numValue = parseInt(boardSize);

    if (boardSize === "" || isNaN(numValue)) {
      const previousValid =
        typeof boardSize === "number" && boardSize >= 150 && boardSize <= 600
          ? boardSize
          : 400;
      setBoardSize(previousValid);
      return;
    }

    if (numValue < 150 || numValue > 600) {
      const previousValid = 400;
      setBoardSize(previousValid);
    }
  };

  const getBoardSizeValidation = () => {
    if (boardSize === "" || isNaN(boardSize)) return "neutral";
    const numValue = parseInt(boardSize);
    if (numValue >= 150 && numValue <= 600) return "valid";
    return "invalid";
  };

  const validation = getBoardSizeValidation();

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 border border-gray-700/50 space-y-4 sm:space-y-6 shadow-xl">
      {/* FEN Input */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-300">
          FEN Notation
        </label>
        <div className="relative">
          <textarea
            value={fen}
            onChange={(e) => setFen(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-16 sm:pr-20 bg-gray-950/50 border border-gray-700 rounded-lg text-xs sm:text-sm text-gray-200 font-mono resize-y min-h-[80px] sm:min-h-[90px] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={handleValidate}
              className="p-1.5 sm:p-2 bg-amber-600/90 hover:bg-amber-500 rounded-md text-white transition-all hover:scale-110 active:scale-95"
              title="Validate FEN"
            >
              <CheckCircle2
                className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                strokeWidth={2.5}
              />
            </button>
            <button
              onClick={handleCopyFEN}
              className="p-1.5 sm:p-2 bg-green-600/90 hover:bg-green-500 rounded-md text-white transition-all hover:scale-105 active:scale-95"
              title="Copy FEN"
            >
              <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Famous Positions */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">
          Famous Positions
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-40 sm:max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {Object.entries(FAMOUS_POSITIONS).map(([key, pos]) => (
            <button
              key={key}
              onClick={() => setFen(pos.fen)}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-950/50 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs text-gray-200 transition-all hover:border-gray-600 text-left hover:shadow-md"
              title={pos.description}
            >
              <div className="font-medium truncate">{pos.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Piece Style*/}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">
          Piece Style
        </label>
        <div className="piece-select-container">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            style={{
              outline: "none",
              boxShadow: "none",
              WebkitTapHighlightColor: "transparent",
            }}
            className={`relative piece-select-pro w-full px-4 py-3 pr-12 bg-gray-950/50
    text-sm text-gray-200 text-left font-medium cursor-pointer transition-all  duration-500
    ${isOpen ? "rounded-t-xl rounded-b-none" : "rounded-xl"}
      ${!isOpen ? "active:scale-[0.98]" : ""}
  `}
          >
            {!isOpen && selectedSet ? (
              <span className="font-semibold" onClick={() => setIsOpen(true)}>
                {selectedSet.name}
              </span>
            ) : (
              <input
                type="search"
                placeholder="Search piece style..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                spellCheck={false}
                className="w-full bg-transparent border-none outline-none caret-blue-400"
              />
            )}

            <ChevronDown
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen((prev) => !prev);
              }}
              className={`absolute right-3 top-1/2 -translate-y-1/2
      w-5 h-5 text-gray-400 cursor-pointer
      transition-transform duration-200
      ${isOpen ? "rotate-180" : ""}
    `}
            />
          </button>

          <ul
            className={`w-full bg-gray-950/50 rounded-b-xl
    transition-all duration-300 ease-in-out
    origin-top piece-select-pro
    ${
      isOpen
        ? "opacity-100 scale-y-100 max-h-60 overflow-y-auto rounded-t-none"
        : "opacity-0 scale-y-95 max-h-0 overflow-hidden pointer-events-none"
    }
  `}
          >
            {displaySets.length === 0 && search.trim() !== "" && (
              <li
                className="
    px-4 py-3
    flex items-center
    text-sm text-red-400
    gap-2
    select-none
  "
              >
                <SearchX className="w-5 h-5 text-red-500/70" />
                <span className="font-medium">No matching piece styles</span>
              </li>
            )}

            {displaySets.map((set, index) => {
              const isSelected = set.id === pieceStyle;

              return (
                <li
                  key={set.id}
                  onClick={() => {
                    setPieceStyle(set.id);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`group px-4 py-3 cursor-pointer flex justify-between items-center
        transition-all duration-200
        hover:bg-blue-500/20 hover:pl-5
        ${isSelected ? "text-emerald-400 font-semibold" : "text-gray-200"}
      `}
                >
                  <span>{set.name}</span>

                  {isSelected && (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `   
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  display: none;
}         


          /* Custom Scrollbar - Ultra Thin */
          .piece-select-pro::-webkit-scrollbar {
            width: 3px;
          }

          .piece-select-pro::-webkit-scrollbar-track {
            background: rgba(26, 26, 36, 0.8);
            border-radius: 10px;
            margin: 4px 0;
          }

          .piece-select-pro::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
            border-radius: 10px;
            transition: all 0.2s ease;
          }

          .piece-select-pro::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
          }

          
        `,
          }}
        />
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
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer accent-blue-500"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(BOARD_THEMES).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => applyTheme(key)}
              className="group relative px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-950/50 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs text-gray-200 transition-all hover:border-gray-600 overflow-hidden hover:shadow-md"
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
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="space-y-2">
            <span className="block text-xs text-gray-400">Light Square</span>
            <div
              onClick={() => document.getElementById("lightSquare").click()}
              className="flex items-center gap-2 p-2 sm:p-2.5 bg-gray-950/50 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-all group"
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded border-2 border-white/10 shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform"
                style={{ background: lightSquare }}
              />
              <div className="text-[10px] sm:text-xs font-bold text-gray-300 font-mono uppercase tracking-wide truncate">
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
              className="flex items-center gap-2 p-2 sm:p-2.5 bg-gray-950/50 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-all group"
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded border-2 border-white/10 shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform"
                style={{ background: darkSquare }}
              />
              <div className="text-[10px] sm:text-xs font-bold text-gray-300 font-mono uppercase tracking-wide truncate">
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

      {/* Board Size */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-gray-300">
            Board Size
          </label>
          <span className="text-xs text-blue-400 font-mono font-bold">
            {boardSize}px
          </span>
        </div>
        <div className="flex gap-2 sm:gap-3 items-center">
          <input
            type="range"
            min="150"
            max="600"
            step="50"
            value={boardSize}
            onChange={(e) => handleRangeChange(e.target.value)}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <input
            type="number"
            min="150"
            max="600"
            step="1"
            value={boardSize}
            onChange={handleNumberInputChange}
            onKeyDown={handleNumberInputKeyDown}
            onBlur={handleNumberInputBlur}
            className={`w-16 sm:w-20 px-2 py-1.5 rounded-lg text-xs sm:text-sm text-gray-200 text-center font-mono font-semibold focus:outline-none transition-all ${
              validation === "valid"
                ? "bg-green-950/50 border border-green-500 shadow-md shadow-green-500/40 focus:ring-2 focus:ring-green-500/40"
                : validation === "invalid"
                ? "bg-red-950/50 border border-red-500 shadow-md shadow-red-500/40 focus:ring-2 focus:ring-red-500/40"
                : "bg-gray-950/50 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            }`}
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
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {QUALITY_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setExportQuality(preset.value)}
              className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
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
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-950/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            placeholder="chess-position"
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
