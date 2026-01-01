import { useState, useEffect, useImperativeHandle } from "react";
import {
  BOARD_THEMES,
  PIECE_SETS,
  FAMOUS_POSITIONS,
  QUALITY_PRESETS,
} from "../constants/chessConstants";
import { validateFEN } from "../utils/fenParser";
import {
  Copy,
  CheckCircle,
  ChevronDown,
  SearchX,
  History,
  Clipboard,
  AlertCircle,
} from "lucide-react";
import FENHistoryModal from "./FENHistoryModal";

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
    addToFavoritesRef,
    onFavoriteStatusChange,
    onNotification,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [boardSizeInput, setBoardSizeInput] = useState(boardSize);
  const [copySuccess, setCopySuccess] = useState(false);

  // Error states
  const [fenError, setFenError] = useState("");
  const [boardSizeError, setBoardSizeError] = useState("");

  // History state
  const [fenHistory, setFenHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Validate FEN on change
  useEffect(() => {
    if (fen.trim()) {
      if (!validateFEN(fen)) {
        setFenError("Invalid FEN notation");
      } else {
        setFenError("");
      }
    } else {
      setFenError("");
    }
  }, [fen]);

  // Load history from storage
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const result = await window.storage.get("fen-history");
        if (result && result.value) {
          setFenHistory(JSON.parse(result.value));
          return;
        }
      } catch (err) {
        console.log("Cloud storage not available");
      }

      try {
        const localData = window.localStorage.getItem("fen-history");
        if (localData) {
          setFenHistory(JSON.parse(localData));
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };
    loadHistory();
  }, []);

  // Save to history whenever FEN changes (debounced)
  useEffect(() => {
    const saveToHistory = async () => {
      if (!validateFEN(fen)) return;

      const existingItem = fenHistory.find((h) => h.fen === fen);

      let updatedHistory;
      if (existingItem) {
        updatedHistory = [
          { ...existingItem, timestamp: Date.now() },
          ...fenHistory.filter((h) => h.fen !== fen),
        ].slice(0, 50);
      } else {
        const newEntry = {
          id: Date.now(),
          fen: fen,
          timestamp: Date.now(),
          isFavorite: false,
        };
        updatedHistory = [newEntry, ...fenHistory].slice(0, 50);
      }

      setFenHistory(updatedHistory);
      const jsonData = JSON.stringify(updatedHistory);

      try {
        window.localStorage.setItem("fen-history", jsonData);
        if (window.storage) {
          await window.storage.set("fen-history", jsonData);
        }
      } catch (err) {
        console.error("Failed to save history:", err);
      }
    };

    const timeoutId = setTimeout(saveToHistory, 1000);
    return () => clearTimeout(timeoutId);
  }, [fen, fenHistory]);

  // Check if current FEN is favorite
  useEffect(() => {
    const currentItem = fenHistory.find((h) => h.fen === fen);
    onFavoriteStatusChange?.(currentItem?.isFavorite || false);
  }, [fen, fenHistory, onFavoriteStatusChange]);

  // Expose handleAddCurrentToFavorites via ref
  useImperativeHandle(addToFavoritesRef, () => handleAddCurrentToFavorites);

  const handleAddCurrentToFavorites = async () => {
    if (!validateFEN(fen)) {
      onNotification?.("Invalid FEN - cannot add to favorites", "error");
      return;
    }

    const existingItem = fenHistory.find((h) => h.fen === fen);

    let updatedHistory;
    if (existingItem) {
      updatedHistory = fenHistory.map((h) =>
        h.fen === fen
          ? { ...h, isFavorite: !h.isFavorite, timestamp: Date.now() }
          : h
      );
      const isFav = !existingItem.isFavorite;
      onNotification?.(
        isFav ? "Added to favorites" : "Removed from favorites",
        "success"
      );
    } else {
      const newEntry = {
        id: Date.now(),
        fen: fen,
        timestamp: Date.now(),
        isFavorite: true,
      };
      updatedHistory = [newEntry, ...fenHistory].slice(0, 50);
      onNotification?.("Added to favorites ★", "success");
    }

    setFenHistory(updatedHistory);
    const jsonData = JSON.stringify(updatedHistory);

    try {
      window.localStorage.setItem("fen-history", jsonData);
      if (window.storage) {
        await window.storage.set("fen-history", jsonData);
      }
    } catch (err) {
      console.error("Failed to save favorite:", err);
    }
  };

  const handleToggleFavorite = async (id) => {
    const updated = fenHistory.map((h) =>
      h.id === id ? { ...h, isFavorite: !h.isFavorite } : h
    );
    setFenHistory(updated);
    const jsonData = JSON.stringify(updated);

    try {
      window.localStorage.setItem("fen-history", jsonData);
      if (window.storage) {
        await window.storage.set("fen-history", jsonData);
      }
    } catch (err) {
      console.error("Failed to update favorite:", err);
    }
  };

  const handleDeleteHistory = async (id) => {
    const updated = fenHistory.filter((h) => h.id !== id);
    setFenHistory(updated);
    const jsonData = JSON.stringify(updated);

    try {
      window.localStorage.setItem("fen-history", jsonData);
      if (window.storage) {
        await window.storage.set("fen-history", jsonData);
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleClearHistory = async () => {
    setFenHistory([]);
    try {
      window.localStorage.removeItem("fen-history");
      if (window.storage) {
        await window.storage.delete("fen-history");
      }
    } catch (err) {
      console.error("Failed to clear:", err);
    }
  };

  const handleSelectFromHistory = (selectedFen) => {
    setFen(selectedFen);
    setIsHistoryOpen(false);
  };

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

  const handleCopyFEN = async () => {
    try {
      await navigator.clipboard.writeText(fen);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      onNotification?.("FEN copied to clipboard", "success");
    } catch (err) {
      onNotification?.("Failed to copy FEN", "error");
    }
  };

  const handlePasteFEN = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setFen(text.trim());

        if (validateFEN(text.trim())) {
          onNotification?.("FEN pasted successfully", "success");
        } else {
          onNotification?.("Pasted text - please verify FEN", "warning");
        }
      } else {
        onNotification?.("Clipboard is empty", "error");
      }
    } catch (err) {
      onNotification?.("Failed to paste from clipboard", "error");
    }
  };

  const handleRangeChange = (value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setBoardSizeInput(numValue);
      setBoardSize(numValue);
      setBoardSizeError("");
    }
  };

  const handleNumberInputChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setBoardSizeInput("");
      setBoardSizeError("");
      return;
    }

    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setBoardSizeInput(numValue);

      if (numValue < 150) {
        setBoardSizeError("Minimum size is 150px");
      } else if (numValue > 600) {
        setBoardSizeError("Maximum size is 600px");
      } else {
        setBoardSizeError("");
      }
    }
  };

  const handleNumberInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyBoardSize();
      e.target.blur();
    }
  };

  const applyBoardSize = () => {
    const numValue = parseInt(boardSizeInput);

    if (boardSizeInput === "" || isNaN(numValue)) {
      setBoardSize(400);
      setBoardSizeInput(400);
      setBoardSizeError("");
      return;
    }

    if (numValue < 150) {
      setBoardSize(150);
      setBoardSizeInput(150);
      setBoardSizeError("Minimum size is 150px");
      return;
    }

    if (numValue > 600) {
      setBoardSize(600);
      setBoardSizeInput(600);
      setBoardSizeError("Maximum size is 600px");
      return;
    }

    setBoardSize(numValue);
    setBoardSizeInput(numValue);
    setBoardSizeError("");
  };

  const handleNumberInputBlur = () => {
    applyBoardSize();
  };

  const getBoardSizeValidation = () => {
    if (boardSizeInput === "") return "neutral";
    const numValue = parseInt(boardSizeInput);
    if (isNaN(numValue)) return "neutral";
    if (numValue >= 150 && numValue <= 600) return "valid";
    return "invalid";
  };

  const validation = getBoardSizeValidation();

  return (
    <>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 border border-gray-700/50 space-y-4 sm:space-y-6 shadow-xl">
        {/* FEN Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-300">
              FEN Notation
            </label>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-lg text-blue-400 text-xs sm:text-sm font-semibold transition-all"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
          <div className="relative">
            <textarea
              value={fen}
              onChange={(e) => setFen(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-20 sm:pr-24 bg-gray-950/50 rounded-lg text-xs sm:text-sm text-gray-200 font-mono resize-none min-h-[80px] sm:min-h-[90px] focus-visible:outline-none focus:outline-none outline-none focus:ring-0 transition-all ${
                fenError ? "border border-red-500" : ""
              }`}
              placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <button
                onClick={handlePasteFEN}
                className="p-1.5 sm:p-2 rounded-md text-white transition-all bg-emerald-500 hover:bg-emerald-500/80"
                title="Paste FEN"
              >
                <Clipboard
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  strokeWidth={2.5}
                />
              </button>
              <button
                onClick={handleCopyFEN}
                className={`p-1.5 sm:p-2 rounded-md text-white transition-all ${
                  copySuccess
                    ? "bg-green-600"
                    : "bg-blue-600/90 hover:bg-blue-500"
                }`}
                title="Copy FEN"
              >
                {copySuccess ? (
                  <CheckCircle
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    strokeWidth={2.5}
                  />
                ) : (
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
          {fenError && (
            <div className="flex items-center gap-2 text-red-400 text-xs mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{fenError}</span>
            </div>
          )}
        </div>

        {/* Famous Positions */}
        <div className="space-y-3">
          <div className="block text-sm font-semibold text-gray-300">
            Famous Positions
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-40 sm:max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {Object.entries(FAMOUS_POSITIONS).map(([key, pos]) => (
              <button
                key={key}
                onClick={() => setFen(pos.fen)}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-950/50 outline-none rounded-lg text-gray-200 transition-colors duration-300 ease-in-out text-left hover:text-blue-400 text-sm"
                title={pos.description}
              >
                <span className="font-semibold">{pos.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Piece Style */}
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
              className={`relative piece-select-pro w-full px-4 py-3 pr-12 bg-gray-950/50 text-sm text-gray-200 text-left font-medium cursor-pointer transition-all duration-500 ${
                isOpen ? "rounded-t-xl rounded-b-none" : "rounded-xl"
              } ${!isOpen ? "active:scale-[0.98]" : ""}`}
            >
              {!isOpen && selectedSet ? (
                <span
                  className="font-semibold hover:text-blue-400"
                  onClick={() => setIsOpen(true)}
                >
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
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <ul
              className={`w-full bg-gray-950/50 rounded-b-xl transition-all duration-300 ease-in-out origin-top piece-select-pro ${
                isOpen
                  ? "opacity-100 scale-y-100 max-h-60 overflow-y-auto rounded-t-none"
                  : "opacity-0 scale-y-95 max-h-0 overflow-hidden pointer-events-none"
              }`}
            >
              {displaySets.length === 0 && search.trim() !== "" && (
                <li className="px-4 py-3 flex items-center text-sm text-red-400 gap-2 select-none">
                  <SearchX className="w-5 h-5 text-red-500/70" />
                  <span className="font-medium">No matching piece styles</span>
                </li>
              )}

              {displaySets.map((set) => {
                const isSelected = set.id === pieceStyle;

                return (
                  <li
                    key={set.id}
                    onClick={() => {
                      setPieceStyle(set.id);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`group px-4 py-3 cursor-pointer flex justify-between items-center transition-all duration-200 hover:bg-blue-500/20 hover:pl-5 ${
                      isSelected
                        ? "text-emerald-400 font-semibold"
                        : "text-gray-200"
                    }`}
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

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(26, 26, 36, 0.8);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
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
          <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl transition-colors">
            <input
              type="checkbox"
              checked={showCoords}
              onChange={(e) => setShowCoords(e.target.checked)}
              className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer accent-emerald-500"
            />
            <span className="text-sm font-semibold text-gray-200 transition-colors">
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
                className="group relative px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-950/50 rounded-lg text-xs text-gray-200 transition-all overflow-hidden"
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
              value={boardSize || 400}
              onChange={(e) => handleRangeChange(e.target.value)}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <input
              type="number"
              min="150"
              max="600"
              step="1"
              value={boardSizeInput}
              onChange={handleNumberInputChange}
              onKeyDown={handleNumberInputKeyDown}
              onBlur={handleNumberInputBlur}
              placeholder="400"
              className={`w-16 sm:w-20 px-2 py-1.5 rounded-lg text-xs sm:text-sm text-gray-200 text-center font-mono font-semibold focus:outline-none transition-all ${
                validation === "valid"
                  ? "bg-green-950/50 border border-green-500 shadow-md shadow-green-500/40 focus:ring-2 focus:ring-green-500/40"
                  : validation === "invalid"
                  ? "bg-red-950/50 border border-red-500 shadow-md shadow-red-500/40 focus:ring-2 focus:ring-red-500/40"
                  : "bg-gray-950/50 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              }`}
            />
          </div>
          {boardSizeError && (
            <div className="flex items-center gap-2 text-red-400 text-xs mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{boardSizeError}</span>
            </div>
          )}
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

      {/* History Modal */}
      <FENHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={fenHistory}
        onSelect={handleSelectFromHistory}
        onDelete={handleDeleteHistory}
        onClear={handleClearHistory}
        onToggleFavorite={handleToggleFavorite}
        lightSquare={lightSquare}
        darkSquare={darkSquare}
        pieceStyle={pieceStyle}
      />
    </>
  );
};

export default ControlPanel;
