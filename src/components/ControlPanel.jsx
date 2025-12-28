const ControlPanel = ({
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
  exportQuality,
  setExportQuality,
  fileName,
  setFileName,
}) => {
  const themes = {
    classic: { light: "#f0d9b5", dark: "#b58863" },
    green: { light: "#ffffdd", dark: "#86a666" },
    blue: { light: "#dee3e6", dark: "#8ca2ad" },
    purple: { light: "#e8c9d0", dark: "#b08ba2" },
    wood: { light: "#f0d0a0", dark: "#8b6f47" },
    marble: { light: "#e8e8e8", dark: "#999999" },
  };

  const applyTheme = (themeName) => {
    setLightSquare(themes[themeName].light);
    setDarkSquare(themes[themeName].dark);
  };

  const setPresetFEN = (newFen) => {
    setFen(newFen);
  };

  const themeNames = {
    classic: "Klassik",
    green: "Yaşıl",
    blue: "Mavi",
    purple: "Bənövşəyi",
    wood: "Taxta",
    marble: "Mərmər",
  };

  return (
    <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
      <div className="space-y-6">
        {/* FEN Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            FEN
          </label>
          <textarea
            value={fen}
            onChange={(e) => setFen(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-200 font-mono resize-y min-h-[90px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          />
        </div>

        {/* Piece Style */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Fiqur Stili
          </label>
          <select
            value={pieceStyle}
            onChange={(e) => setPieceStyle(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-200 cursor-pointer focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="cburnett">CBurnett (Chess.com)</option>
            <option value="merida">Merida (Lichess)</option>
            <option value="reillycraig">Reilly Craig</option>
            <option value="pirouetti">Pirouetti</option>
            <option value="chessnut">Chessnut</option>
            <option value="kosal">Kosal</option>
            <option value="fresca">Fresca</option>
            <option value="alpha">Alpha</option>
            <option value="cardinal">Cardinal</option>
          </select>
        </div>

        {/* Display Options */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Görünüş
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCoords}
                onChange={(e) => setShowCoords(e.target.checked)}
                className="w-4 h-4 cursor-pointer rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
              />
              <span className="text-sm text-gray-300">Koordinatlar</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showBorder}
                onChange={(e) => setShowBorder(e.target.checked)}
                className="w-4 h-4 cursor-pointer rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
              />
              <span className="text-sm text-gray-300">Kənar Çərçivə</span>
            </label>
          </div>
        </div>

        {/* Preset Positions */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hazır Pozisiyalar
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                setPresetFEN(
                  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                )
              }
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-md text-sm text-gray-200 transition-colors duration-150"
            >
              Başlanğıc
            </button>
            <button
              onClick={() => setPresetFEN("8/8/8/8/8/8/8/8 w - - 0 1")}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-md text-sm text-gray-200 transition-colors duration-150"
            >
              Boş Lövhə
            </button>
          </div>
        </div>

        {/* Themes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Lövhə Teması
          </label>
          <div className="grid grid-cols-3 gap-3">
            {Object.keys(themes).map((theme) => (
              <button
                key={theme}
                onClick={() => applyTheme(theme)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-md text-sm text-gray-200 transition-colors duration-150"
              >
                {themeNames[theme]}
              </button>
            ))}
          </div>
        </div>

        {/* Color Pickers */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Öz Rənglərini Seç
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Light Square */}
            <div>
              <span className="block text-xs text-gray-400 mb-2">
                Açıq Xana
              </span>
              <div
                onClick={() => document.getElementById("lightSquare").click()}
                className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-colors duration-150"
              >
                <div
                  className="w-11 h-11 rounded-lg border-2 border-white border-opacity-10 shadow-inner flex-shrink-0"
                  style={{ background: lightSquare }}
                />
                <div className="text-sm font-bold text-gray-200 font-mono uppercase tracking-wide">
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

            {/* Dark Square */}
            <div>
              <span className="block text-xs text-gray-400 mb-2">
                Tünd Xana
              </span>
              <div
                onClick={() => document.getElementById("darkSquare").click()}
                className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-colors duration-150"
              >
                <div
                  className="w-11 h-11 rounded-lg border-2 border-white border-opacity-10 shadow-inner flex-shrink-0"
                  style={{ background: darkSquare }}
                />
                <div className="text-sm font-bold text-gray-200 font-mono uppercase tracking-wide">
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
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Lövhə Ölçüsü (200-600px)
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="range"
              min="200"
              max="600"
              step="10"
              value={boardSize}
              onChange={(e) => setBoardSize(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            />
            <input
              type="number"
              min="200"
              max="600"
              value={boardSize}
              onChange={(e) => setBoardSize(parseInt(e.target.value))}
              className="w-24 px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-200 text-center font-mono font-semibold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Export Quality */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Export Keyfiyyəti
          </label>
          <select
            value={exportQuality}
            onChange={(e) => setExportQuality(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-200 cursor-pointer focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="1">Standard (1x)</option>
            <option value="2">Yüksək (2x)</option>
            <option value="3">Çox Yüksək (3x)</option>
            <option value="4">Maksimum (4x)</option>
          </select>
        </div>

        {/* File Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Şəkil Adı
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="şəkil-adı"
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
