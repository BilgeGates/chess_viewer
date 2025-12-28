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
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm text-gray-300">Koordinatlar</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showBorder}
                onChange={(e) => setShowBorder(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm text-gray-300">Kənar çərçivə</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hazır Pozisiyalar
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                setFen(
                  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                )
              }
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-md text-sm text-gray-200 transition"
            >
              Başlanğıc
            </button>
            <button
              onClick={() => setFen("8/8/8/8/8/8/8/8 w - - 0 1")}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-md text-sm text-gray-200 transition"
            >
              Boş Lövhə
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Lövhə Teması
          </label>
          <div className="grid grid-cols-3 gap-3">
            {Object.keys(themes).map((theme) => (
              <button
                key={theme}
                onClick={() => applyTheme(theme)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-md text-sm text-gray-200 transition"
              >
                {themeNames[theme]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Öz Rənglərini Seç
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="block text-xs text-gray-400 mb-2">
                Açıq Xana
              </span>
              <div
                onClick={() => document.getElementById("lightSquare").click()}
                className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition"
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

            <div>
              <span className="block text-xs text-gray-400 mb-2">
                Tünd Xana
              </span>
              <div
                onClick={() => document.getElementById("darkSquare").click()}
                className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition"
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
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              min="200"
              max="600"
              value={boardSize}
              onChange={(e) => setBoardSize(parseInt(e.target.value))}
              className="w-24 px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-200 text-center font-mono font-semibold focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Şəkil Adı
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-sm text-gray-200 focus:border-blue-500 focus:outline-none"
            placeholder="chess-position"
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
