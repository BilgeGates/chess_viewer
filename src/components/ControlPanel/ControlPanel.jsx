import { useState, useImperativeHandle } from "react";
import { FAMOUS_POSITIONS } from "../../constants/chessConstants";
import { FENHistoryModal } from "../";
import { useFENHistory, useTheme } from "../../hooks";
import FENInput from "./FENInput";
import PieceSelector from "./PieceSelector";
import BoardSizeControl from "./BoardSizeControl";
import DisplayOptions from "./DisplayOptions";
import ExportSettings from "./ExportSettings";
import ExportSettingsModal from "./ExportSettingsModal";
import ThemeSelector from "./ThemeSelector";
import ThemeModal from "./ThemeModal";
import { History } from "lucide-react";

const ControlPanel = (props) => {
  const {
    fen,
    setFen,
    pieceStyle,
    setPieceStyle,
    showCoords,
    setShowCoords,
    boardSize,
    setBoardSize,
    fileName,
    setFileName,
    exportQuality,
    setExportQuality,
    addToFavoritesRef,
    onFavoriteStatusChange,
    onNotification,
    lightSquare: initialLightSquare,
    darkSquare: initialDarkSquare,
    setLightSquare: parentSetLightSquare,
    setDarkSquare: parentSetDarkSquare,
  } = props;

  // Modal States
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Theme hook
  const theme = useTheme({
    onNotification,
    initialLight: initialLightSquare,
    initialDark: initialDarkSquare,
  });

  // Sync theme changes to parent
  const handleLightSquareChange = (color) => {
    theme.setLightSquare(color);
    parentSetLightSquare?.(color);
  };

  const handleDarkSquareChange = (color) => {
    theme.setDarkSquare(color);
    parentSetDarkSquare?.(color);
  };

  // Use custom hook for FEN history
  const {
    fenHistory,
    toggleFavorite,
    deleteHistory,
    clearHistory,
    addCurrentToFavorites,
  } = useFENHistory(fen, onFavoriteStatusChange);

  // Expose handleAddCurrentToFavorites via ref
  useImperativeHandle(
    addToFavoritesRef,
    () => () => addCurrentToFavorites(fen, onNotification)
  );

  const handleSelectFromHistory = (selectedFen) => {
    setFen(selectedFen);
    setIsHistoryOpen(false);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 border border-gray-700/50 space-y-4 sm:space-y-6">
        {/* FEN Input with History Button */}
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
          <FENInput fen={fen} setFen={setFen} onNotification={onNotification} />
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
        <PieceSelector pieceStyle={pieceStyle} setPieceStyle={setPieceStyle} />
        <DisplayOptions showCoords={showCoords} setShowCoords={setShowCoords} />
        <BoardSizeControl boardSize={boardSize} setBoardSize={setBoardSize} />
        <ThemeSelector
          lightSquare={theme.lightSquare}
          darkSquare={theme.darkSquare}
          onOpenModal={theme.openThemeModal}
        />
        <ExportSettings
          fileName={fileName}
          exportQuality={exportQuality}
          onOpenModal={() => setIsExportModalOpen(true)}
        />
      </div>

      <style jsx>{`
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
      `}</style>

      <FENHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={fenHistory}
        onSelect={handleSelectFromHistory}
        onDelete={deleteHistory}
        onClear={clearHistory}
        onToggleFavorite={toggleFavorite}
        lightSquare={theme.lightSquare}
        darkSquare={theme.darkSquare}
        pieceStyle={pieceStyle}
      />

      <ThemeModal
        isOpen={theme.isThemeModalOpen}
        onClose={theme.closeThemeModal}
        lightSquare={theme.lightSquare}
        setLightSquare={handleLightSquareChange}
        darkSquare={theme.darkSquare}
        setDarkSquare={handleDarkSquareChange}
        onNotification={onNotification}
      />

      <ExportSettingsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        fileName={fileName}
        setFileName={setFileName}
        exportQuality={exportQuality}
        setExportQuality={setExportQuality}
      />
    </>
  );
};

export default ControlPanel;
