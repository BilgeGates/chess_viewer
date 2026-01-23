import {
  memo,
  useImperativeHandle,
  useState,
  useCallback,
  useRef,
  useEffect
} from 'react';
import { FAMOUS_POSITIONS } from '../../constants/chessConstants';
import { useFENHistory, useTheme } from '../../hooks';
import { FENInputField, FamousPositionButton } from './atoms';
import PieceSelector from './PieceSelector';
import BoardSizeControl from './BoardSizeControl';
import DisplayOptions from './DisplayOptions';
import ExportSettings from './ExportSettings';
import ThemeSelector from './ThemeSelector';
import {
  FENHistoryModal,
  ThemeModal,
  ExportSettingsModal,
  AdvancedFENInputModal
} from './modals';
import { History } from 'lucide-react';

/**
 * Control Panel
 * Each section is memoized separately
 */
const ControlPanel = memo((props) => {
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
    setDarkSquare: parentSetDarkSquare
  } = props;

  // Local state for modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [fenError] = useState('');
  const copyTimeoutRef = useRef(null);

  useEffect(() => {
    const timeout = copyTimeoutRef.current;
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  // Theme hook
  const theme = useTheme({
    onNotification,
    initialLight: initialLightSquare,
    initialDark: initialDarkSquare
  });

  // FEN history hook
  const {
    fenHistory,
    toggleFavorite,
    deleteHistory,
    clearHistory,
    addCurrentToFavorites
  } = useFENHistory(fen, onFavoriteStatusChange);

  // Callbacks
  const handleLightSquareChange = useCallback(
    (color) => {
      theme.setLightSquare(color);
      parentSetLightSquare?.(color);
    },
    [theme, parentSetLightSquare]
  );

  const handleDarkSquareChange = useCallback(
    (color) => {
      theme.setDarkSquare(color);
      parentSetDarkSquare?.(color);
    },
    [theme, parentSetDarkSquare]
  );

  const handleFenChange = useCallback(
    (e) => {
      setFen(e.target.value);
    },
    [setFen]
  );

  const handleCopyFEN = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fen);
      setCopySuccess(true);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => setCopySuccess(false), 2000);
      onNotification?.('FEN copied to clipboard', 'success');
    } catch (err) {
      onNotification?.('Failed to copy FEN', 'error');
    }
  }, [fen, onNotification]);

  const handlePasteFEN = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setFen(text.trim());
        onNotification?.('FEN pasted successfully', 'success');
      }
    } catch (err) {
      onNotification?.('Failed to paste from clipboard', 'error');
    }
  }, [setFen, onNotification]);

  const handleSelectFromHistory = useCallback(
    (selectedFen) => {
      setFen(selectedFen);
      setIsHistoryOpen(false);
    },
    [setFen]
  );

  // Expose favorites via ref
  useImperativeHandle(
    addToFavoritesRef,
    () => () => addCurrentToFavorites(fen, onNotification)
  );

  return (
    <>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 border border-gray-700/50 space-y-4 sm:space-y-6">
        {/* FEN Input Section */}
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

          <FENInputField
            fen={fen}
            onChange={handleFenChange}
            error={fenError}
            onCopy={handleCopyFEN}
            onPaste={handlePasteFEN}
            copySuccess={copySuccess}
            onAdvancedClick={() => setShowAdvancedModal(true)}
          />
        </div>

        {/* Famous Positions */}
        <div className="space-y-3">
          <div className="block text-sm font-semibold text-gray-300">
            Famous Positions
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-40 sm:max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {Object.entries(FAMOUS_POSITIONS).map(([key, pos]) => (
              <FamousPositionButton
                key={key}
                positionKey={key}
                position={pos}
                onClick={setFen}
              />
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

      {/* Custom Scrollbar Styles */}
      <style>
        {`
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
      `}
      </style>

      {/* Modals - Only render when open */}
      {isHistoryOpen && (
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
      )}

      {theme.isThemeModalOpen && (
        <ThemeModal
          isOpen={theme.isThemeModalOpen}
          onClose={theme.closeThemeModal}
          lightSquare={theme.lightSquare}
          setLightSquare={handleLightSquareChange}
          darkSquare={theme.darkSquare}
          setDarkSquare={handleDarkSquareChange}
          pieceStyle={pieceStyle}
          onNotification={onNotification}
        />
      )}

      {isExportModalOpen && (
        <ExportSettingsModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          fileName={fileName}
          setFileName={setFileName}
          exportQuality={exportQuality}
          setExportQuality={setExportQuality}
        />
      )}

      {showAdvancedModal && (
        <AdvancedFENInputModal
          isOpen={showAdvancedModal}
          onClose={() => setShowAdvancedModal(false)}
          onApplyFEN={setFen}
          pieceStyle={pieceStyle}
          lightSquare={theme.lightSquare}
          darkSquare={theme.darkSquare}
          showCoords={showCoords}
          exportQuality={exportQuality}
        />
      )}
    </>
  );
});

ControlPanel.displayName = 'ControlPanel';

export default ControlPanel;
