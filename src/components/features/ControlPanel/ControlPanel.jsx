import {
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';

import { History, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import DisplayOptions from '@/components/features/DisplayOptions';
import { FENInputField, PieceSelector } from '@/components/features/Fen';
import { useFENHistory } from '@/hooks';

/**
 * @param {Object} props
 * @returns {JSX.Element}
 */
const ControlPanel = memo(function ControlPanel(props) {
  const navigate = useNavigate();
  const {
    fen,
    setFen,
    pieceStyle,
    setPieceStyle,
    showCoords,
    setShowCoords,
    showCoordinateBorder,
    setShowCoordinateBorder,
    showThinFrame,
    setShowThinFrame,
    exportQuality,
    addToFavoritesRef,
    onFavoriteStatusChange,
    onNotification,
    saveManualFen: externalSaveManualFen,
    saveExportFen: externalSaveExportFen,
    addCurrentToFavorites: externalAddCurrentToFavorites
  } = props;
  const [copySuccess, setCopySuccess] = useState(false);
  const fenError = '';
  const copyTimeoutRef = useRef(null);
  useEffect(() => {
    const timeout = copyTimeoutRef.current;
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);
  const localHistory = useFENHistory(fen, onFavoriteStatusChange);
  const addCurrentToFavorites =
    externalAddCurrentToFavorites || localHistory.addCurrentToFavorites;
  const handleFenChange = useCallback(
    (e) => {
      setFen(e.target.value);
    },
    [setFen]
  );
  const handleFenBlur = useCallback(() => {
    if (externalSaveManualFen && fen && fen.trim()) {
      externalSaveManualFen(fen.trim());
    }
  }, [fen, externalSaveManualFen]);
  const handleCopyFEN = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fen);
      if (externalSaveExportFen) {
        externalSaveExportFen(fen);
      }
      setCopySuccess(true);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => setCopySuccess(false), 2000);
      onNotification?.('FEN copied to clipboard', 'success');
    } catch {
      onNotification?.('Failed to copy FEN', 'error');
    }
  }, [fen, externalSaveExportFen, onNotification]);
  const handlePasteFEN = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        const pastedFen = text.trim();
        setFen(pastedFen);
        if (externalSaveManualFen) {
          externalSaveManualFen(pastedFen);
        }
        onNotification?.('FEN pasted successfully', 'success');
      }
    } catch {
      onNotification?.('Failed to paste from clipboard', 'error');
    }
  }, [setFen, externalSaveManualFen, onNotification]);
  useImperativeHandle(
    addToFavoritesRef,
    () => () => addCurrentToFavorites(fen, onNotification)
  );
  return (
    <>
      <div className="glass-card rounded-xl p-4 sm:p-5 lg:p-6 space-y-5 sm:space-y-6 h-full 2xl:overflow-y-auto">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-semibold text-text-primary">
              FEN Notation
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/fen-history')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-accent text-xs sm:text-sm font-medium transition-colors duration-150 border border-accent/20 bg-accent/5 hover:bg-accent/10"
              >
                <History className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-accent text-xs sm:text-sm font-medium transition-colors duration-150 border border-accent/20 bg-accent/5 hover:bg-accent/10"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <FENInputField
            fen={fen}
            onChange={handleFenChange}
            onBlur={handleFenBlur}
            error={fenError}
            onCopy={handleCopyFEN}
            onPaste={handlePasteFEN}
            copySuccess={copySuccess}
            onAdvancedClick={() => navigate('/advanced-fen')}
            onNotification={onNotification}
          />
        </div>

        <div className="h-px bg-border/50" />
        <PieceSelector pieceStyle={pieceStyle} setPieceStyle={setPieceStyle} />
        <DisplayOptions
          showCoords={showCoords}
          setShowCoords={setShowCoords}
          showCoordinateBorder={showCoordinateBorder}
          setShowCoordinateBorder={setShowCoordinateBorder}
          showThinFrame={showThinFrame}
          setShowThinFrame={setShowThinFrame}
          exportQuality={exportQuality}
        />
      </div>
    </>
  );
});
ControlPanel.displayName = 'ControlPanel';
export default ControlPanel;
