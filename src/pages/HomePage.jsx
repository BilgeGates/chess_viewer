import {
  useState,
  useRef,
  useCallback,
  useMemo,
  useReducer,
  useEffect
} from 'react';
import { useLocation } from 'react-router-dom';

import { ChessBoard } from '@/components/board';
import { ChessEditor } from '@/components/interactions';
import {
  ControlPanel,
  ActionButtons,
  ExportProgress
} from '@/components/features';
import { NotificationContainer } from '@/components/ui';
import { useNotifications, useLocalStorage, useFENHistory } from '@/hooks';
import {
  downloadPNG,
  downloadJPEG,
  copyToClipboard,
  batchExport,
  cancelExport,
  pauseExport,
  resumeExport
} from '@/utils/canvasExporter';
import { shouldForceCoordinateBorder } from '@/utils/imageOptimizer';

/**
 * Export state reducer - PERFORMANCE OPTIMIZED
 * Batches export-related state updates to prevent cascading renders
 */
const exportReducer = (state, action) => {
  switch (action.type) {
    case 'START_EXPORT':
      return {
        ...state,
        isExporting: true,
        currentFormat: action.format,
        exportProgress: 0,
        isPaused: false,
        showProgress: true
      };
    case 'UPDATE_PROGRESS':
      return { ...state, exportProgress: action.progress };
    case 'PAUSE':
      return { ...state, isPaused: true };
    case 'RESUME':
      return { ...state, isPaused: false };
    case 'COMPLETE':
      return {
        ...state,
        isExporting: false,
        currentFormat: null,
        exportProgress: 0,
        isPaused: false
      };
    case 'TOGGLE_PROGRESS':
      return { ...state, showProgress: !state.showProgress };
    default:
      return state;
  }
};

/**
 * Home Page
 * PERFORMANCE OPTIMIZED: Prevents unnecessary re-renders with useCallback, useMemo, and useReducer
 */
const HomePage = () => {
  const location = useLocation();

  // Persistent state
  const [fen, setFen] = useLocalStorage(
    'chess-fen',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  );

  // Handle FEN loading from navigation state (when coming back from pages)
  useEffect(() => {
    if (location.state?.loadFEN) {
      setFen(location.state.loadFEN);
      // Clear the state so it doesn't reload on navigation back/forward
      window.history.replaceState({}, document.title);
    }
  }, [location, setFen]);
  const [pieceStyle, setPieceStyle] = useLocalStorage(
    'chess-piece-style',
    'cburnett'
  );
  const [showCoords, setShowCoords] = useLocalStorage(
    'chess-show-coords',
    true
  );
  const [showCoordinateBorder, setShowCoordinateBorder] = useLocalStorage(
    'chess-show-coordinate-border',
    true
  );
  const [lightSquare, setLightSquare] = useLocalStorage(
    'chess-light-square',
    '#f0d9b5'
  );
  const [darkSquare, setDarkSquare] = useLocalStorage(
    'chess-dark-square',
    '#b58863'
  );
  const [boardSize, setBoardSize] = useLocalStorage('chess-board-size', 4);
  const [flipped, setFlipped] = useLocalStorage('chess-flipped', false);
  const [fileName, setFileName] = useLocalStorage(
    'chess-file-name',
    'chess-position'
  );
  const [exportQuality, setExportQuality] = useLocalStorage(
    'chess-export-quality',
    16
  );

  // Export state with useReducer for better performance
  const [exportState, dispatchExport] = useReducer(exportReducer, {
    isExporting: false,
    exportProgress: 0,
    currentFormat: null,
    isPaused: false,
    showProgress: true
  });

  const [isFavorite, setIsFavorite] = useState(false);

  const {
    saveManualFen,
    saveExportFen,
    notifyDragAction,
    addCurrentToFavorites
  } = useFENHistory(fen, setIsFavorite);

  const boardRef = useRef(null);
  const addToFavoritesRef = useRef(null);

  const { notifications, success, error, info, removeNotification } =
    useNotifications();

  /**
   * @returns {Object} Export configuration object
   */
  const getExportConfig = useCallback(() => {
    const forceCoordBorder = shouldForceCoordinateBorder(exportQuality);
    const effectiveCoordBorder = forceCoordBorder || showCoordinateBorder;

    return {
      boardSize: boardSize,
      showCoords,
      showCoordinateBorder: effectiveCoordBorder,
      lightSquare,
      darkSquare,
      flipped,
      fen,
      pieceImages: boardRef.current?.getPieceImages() || {},
      exportQuality
    };
  }, [
    boardSize,
    showCoords,
    showCoordinateBorder,
    lightSquare,
    darkSquare,
    flipped,
    fen,
    exportQuality
  ]);

  /**
   * @returns {Promise<void>}
   */
  const handleDownloadPNG = useCallback(async () => {
    dispatchExport({ type: 'START_EXPORT', format: 'png' });
    saveExportFen(fen);

    try {
      await downloadPNG(getExportConfig(), fileName, (progress) => {
        dispatchExport({ type: 'UPDATE_PROGRESS', progress });
      });
      success('PNG exported successfully');
    } catch (err) {
      if (err.message === 'Export cancelled') {
        info('Export cancelled');
      } else {
        error('PNG export failed: ' + err.message);
      }
    } finally {
      setTimeout(() => {
        dispatchExport({ type: 'COMPLETE' });
      }, 300);
    }
  }, [getExportConfig, fileName, fen, saveExportFen, success, error, info]);

  /**
   * @returns {Promise<void>}
   */
  const handleDownloadJPEG = useCallback(async () => {
    dispatchExport({ type: 'START_EXPORT', format: 'jpeg' });
    saveExportFen(fen);

    try {
      await downloadJPEG(getExportConfig(), fileName, (progress) => {
        dispatchExport({ type: 'UPDATE_PROGRESS', progress });
      });
      success('JPEG exported successfully');
    } catch (err) {
      if (err.message === 'Export cancelled') {
        info('Export cancelled');
      } else {
        error('JPEG export failed: ' + err.message);
      }
    } finally {
      setTimeout(() => {
        dispatchExport({ type: 'COMPLETE' });
      }, 300);
    }
  }, [getExportConfig, fileName, fen, saveExportFen, success, error, info]);

  /**
   * @returns {Promise<void>}
   */
  const handleCopyImage = useCallback(async () => {
    try {
      await copyToClipboard(getExportConfig());
      saveExportFen(fen);
      success('Image copied to clipboard');
    } catch (err) {
      error('Copy failed: ' + err.message);
    }
  }, [getExportConfig, fen, saveExportFen, success, error]);

  /**
   * @returns {void}
   */
  const handleFlip = useCallback(() => {
    setFlipped((prev) => !prev);
    success('Board flipped');
  }, [setFlipped, success]);

  /**
   * @param {Array<string>} formats - Export format array (e.g., ['png', 'svg'])
   * @returns {Promise<void>}
   */
  const handleBatchExport = useCallback(
    async (formats) => {
      dispatchExport({ type: 'START_EXPORT', format: formats[0] });
      saveExportFen(fen);

      try {
        await batchExport(
          getExportConfig(),
          formats,
          fileName,
          (progress, format) => {
            dispatchExport({ type: 'UPDATE_PROGRESS', progress });
            // Update format separately if needed
            if (format !== exportState.currentFormat) {
              dispatchExport({ type: 'START_EXPORT', format });
            }
          }
        );
        success(`Exported ${formats.length} formats successfully`);
      } catch (err) {
        if (err.message === 'Export cancelled') {
          info('Export cancelled');
        } else {
          error('Batch export failed: ' + err.message);
        }
      } finally {
        setTimeout(() => {
          dispatchExport({ type: 'COMPLETE' });
        }, 300);
      }
    },
    [
      getExportConfig,
      fileName,
      fen,
      saveExportFen,
      success,
      error,
      info,
      exportState.currentFormat
    ]
  );

  const handleCancelExport = useCallback(() => {
    cancelExport();
    dispatchExport({ type: 'COMPLETE' });
    info('Export cancelled');
  }, [info]);

  const handlePause = useCallback(() => {
    pauseExport();
    dispatchExport({ type: 'PAUSE' });
  }, []);

  const handleResume = useCallback(() => {
    resumeExport();
    dispatchExport({ type: 'RESUME' });
  }, []);

  const handleAddToFavorites = useCallback(() => {
    if (addToFavoritesRef.current) {
      addToFavoritesRef.current();
    }
  }, []);

  const boardProps = useMemo(
    () => ({
      fen,
      pieceStyle,
      showCoords,
      boardSize: 400,
      lightSquare,
      darkSquare,
      flipped
    }),
    [fen, pieceStyle, showCoords, lightSquare, darkSquare, flipped]
  );

  /**
   * @param {string} newFen - Updated FEN from editor
   * @returns {void}
   */
  const handleEditorFenChange = useCallback(
    (newFen) => {
      setFen(newFen);
      notifyDragAction();
    },
    [setFen, notifyDragAction]
  );

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-12 px-3 sm:px-4 lg:px-6">
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Main Content Grid - Responsive */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Board Section - Left/Center */}
          <div className="w-full lg:flex-1 space-y-4 sm:space-y-5 animate-fadeIn">
            {/* Interactive Chess Editor */}
            <div className="relative">
              <div className="glass-card p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-lg">
                <ChessEditor
                  fen={fen}
                  onFenChange={handleEditorFenChange}
                  pieceStyle={pieceStyle}
                  showCoords={showCoords}
                  lightSquare={lightSquare}
                  darkSquare={darkSquare}
                  flipped={flipped}
                />
              </div>
            </div>

            {/* Hidden canvas board for export (not visible but used by export functions) */}
            <div className="sr-only" aria-hidden="true">
              <ChessBoard ref={boardRef} {...boardProps} />
            </div>

            {/* Action Buttons */}
            <div>
              <ActionButtons
                onDownloadPNG={handleDownloadPNG}
                onDownloadJPEG={handleDownloadJPEG}
                onCopyImage={handleCopyImage}
                onFlip={handleFlip}
                onBatchExport={handleBatchExport}
                onAddToFavorites={handleAddToFavorites}
                isExporting={exportState.isExporting}
                currentFen={fen}
                isFavorite={isFavorite}
              />
            </div>
          </div>

          {/* Control Panel - Right Sidebar (Responsive) */}
          <div className="w-full lg:w-[420px] xl:w-[480px] lg:flex-shrink-0 animate-fadeIn">
            <ControlPanel
              fen={fen}
              setFen={setFen}
              pieceStyle={pieceStyle}
              setPieceStyle={setPieceStyle}
              showCoords={showCoords}
              setShowCoords={setShowCoords}
              showCoordinateBorder={showCoordinateBorder}
              setShowCoordinateBorder={setShowCoordinateBorder}
              lightSquare={lightSquare}
              setLightSquare={setLightSquare}
              darkSquare={darkSquare}
              setDarkSquare={setDarkSquare}
              boardSize={boardSize}
              setBoardSize={setBoardSize}
              fileName={fileName}
              setFileName={setFileName}
              exportQuality={exportQuality}
              setExportQuality={setExportQuality}
              addToFavoritesRef={addToFavoritesRef}
              onFavoriteStatusChange={setIsFavorite}
              saveManualFen={saveManualFen}
              saveExportFen={saveExportFen}
              addCurrentToFavorites={addCurrentToFavorites}
              onNotification={(message, type) => {
                if (type === 'success') success(message);
                else if (type === 'error') error(message);
                else if (type === 'warning') info(message);
              }}
            />
          </div>
        </div>
      </div>

      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />

      {exportState.showProgress && (
        <ExportProgress
          isExporting={exportState.isExporting}
          progress={exportState.exportProgress}
          currentFormat={exportState.currentFormat}
          config={getExportConfig()}
          isPaused={exportState.isPaused}
          onClose={() => dispatchExport({ type: 'TOGGLE_PROGRESS' })}
          onPause={handlePause}
          onResume={handleResume}
          onCancel={handleCancelExport}
        />
      )}
    </div>
  );
};

export default HomePage;
