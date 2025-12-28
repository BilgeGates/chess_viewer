import { PIECE_SETS } from "../data/pieces";
import { BOARD_THEMES } from "../constants/chessConstants";

const ControlPanel = (props) => {
  const {
    fen,
    setFen,
    pieceStyle,
    setPieceStyle,
    showCoords,
    setShowCoords,
    showBorder,
    setShowBorder,
    lightSquare,
    setLightSquare,
    darkSquare,
    setDarkSquare,
    boardSize,
    setBoardSize,
    fileName,
    setFileName,
  } = props;

  const applyTheme = (themeKey) => {
    const theme = BOARD_THEMES[themeKey];
    setLightSquare(theme.light);
    setDarkSquare(theme.dark);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700/50 shadow-2xl">
      <div className="space-y-6">
        {/* FEN Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">
            FEN Notation
          </label>
          <textarea
            value={fen}
            onChange={(e) => setFen(e.target.value)}
            className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-lg text-sm text-gray-200 font-mono resize-y min-h-[90px] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          />
        </div>

        {/* Piece Style */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">
            Piece Style
          </label>
          <select
            value={pieceStyle}
            onChange={(e) => setPieceStyle(e.target.value)}
            className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all cursor-pointer"
          >
            {PIECE_SETS.map((set) => (
              <option key={set.id} value={set.id}>
                {set.name}
              </option>
            ))}
          </select>
        </div>

        {/* Display Options */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Display Options
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
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
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={showBorder}
              onChange={(e) => setShowBorder(e.target.checked)}
              className="w-5 h-5 cursor-pointer accent-blue-500"
            />
            <span className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
              Show Border Frame
            </span>
          </label>
        </div>

        {/* Quick Positions */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-300">
            Quick Positions
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                setFen(
                  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                )
              }
              className="px-4 py-2.5 bg-gray-950/50 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-200 transition-all hover:border-gray-600"
            >
              Starting Position
            </button>
            <button
              onClick={() => setFen("8/8/8/8/8/8/8/8 w - - 0 1")}
              className="px-4 py-2.5 bg-gray-950/50 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-200 transition-all hover:border-gray-600"
            >
              Empty Board
            </button>
          </div>
        </div>

        {/* Board Themes */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-300">
            Board Theme
          </label>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(BOARD_THEMES).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => applyTheme(key)}
                className="px-4 py-2.5 bg-gray-950/50 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-200 transition-all hover:border-gray-600"
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-300">
            Custom Colors
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs text-gray-400 mb-2">
                Light Square
              </span>
              <div
                onClick={() => document.getElementById("lightSquare").click()}
                className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-950/50 to-gray-900 border-2 border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-lg border-2 border-white/10 shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform"
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

            <div>
              <span className="block text-xs text-gray-400 mb-2">
                Dark Square
              </span>
              <div
                onClick={() => document.getElementById("darkSquare").click()}
                className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-950/50 to-gray-900 border-2 border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-lg border-2 border-white/10 shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform"
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

        {/* Board Size */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-300">
            Board Size (200-600px)
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="range"
              min="200"
              max="600"
              step="10"
              value={boardSize}
              onChange={(e) => setBoardSize(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <input
              type="number"
              min="200"
              max="600"
              value={boardSize}
              onChange={(e) => setBoardSize(parseInt(e.target.value))}
              className="w-24 px-3 py-2 bg-gray-950/50 border border-gray-700 rounded-lg text-sm text-gray-200 text-center font-mono font-semibold focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
          </div>
        </div>

        {/* File Name */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">
            Export File Name
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            placeholder="chess-position"
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
