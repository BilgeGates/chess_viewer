import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { useLocation } from 'react-router-dom';

import {
  ActionButtons,
  ControlPanel,
  ExportProgress
} from '@/components/features';
import { ChessEditor } from '@/components/interactions';
import { NotificationContainer } from '@/components/ui';
import { useFENHistory, useLocalStorage, useNotifications } from '@/hooks';
import {
  batchExport,
  cancelExport,
  copyToClipboard,
  downloadJPEG,
  downloadPNG,
  pauseExport,
  resumeExport,
  shouldForceCoordinateBorder
} from '@/utils';
import { safeJSONParse, sanitizeHexColor } from '@/utils/validation';

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
function HomePage() {
  const location = useLocation();

  const [fen, setFen] = useLocalStorage(
    'chess-fen',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  );

  useEffect(() => {
    if (location.state?.loadFEN) {
      setFen(location.state.loadFEN);
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
  const [showThinFrame, setShowThinFrame] = useLocalStorage(
    'chess-show-thin-frame',
    false
  );
  const [lightSquare, setLightSquare] = useLocalStorage(
    'chess-light-square',
    '#f0d9b5'
  );
  const [darkSquare, setDarkSquare] = useLocalStorage(
    'chess-dark-square',
    '#b58863'
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const light = localStorage.getItem('chess-light-square');
      const dark = localStorage.getItem('chess-dark-square');

      if (light) {
        try {
          const parsed = safeJSONParse(light, null);
          const color = typeof parsed === 'string' ? parsed : light;
          setLightSquare(sanitizeHexColor(color, '#f0d9b5'));
        } catch {
          setLightSquare(sanitizeHexColor(light, '#f0d9b5'));
        }
      }
      if (dark) {
        try {
          const parsed = safeJSONParse(dark, null);
          const color = typeof parsed === 'string' ? parsed : dark;
          setDarkSquare(sanitizeHexColor(color, '#b58863'));
        } catch {
          setDarkSquare(sanitizeHexColor(dark, '#b58863'));
        }
      }
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleStorageChange();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setLightSquare, setDarkSquare]);
  const [boardSize] = useLocalStorage('chess-board-size', 4);
  const [flipped, setFlipped] = useLocalStorage('chess-flipped', false);
  const [fileName] = useLocalStorage('chess-file-name', 'chess-position');
  const [exportQuality] = useLocalStorage('chess-export-quality', 16);

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

  const addToFavoritesRef = useRef(null);
  const [pieceImages, setPieceImages] = useState({});

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
      showThinFrame: showThinFrame,
      lightSquare,
      darkSquare,
      flipped,
      fen,
      pieceImages,
      exportQuality
    };
  }, [
    boardSize,
    showCoords,
    showCoordinateBorder,
    showThinFrame,
    lightSquare,
    darkSquare,
    flipped,
    fen,
    pieceImages,
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
    <div className="h-full max-h-full overflow-y-auto 2xl:overflow-hidden pt-16 sm:pt-20 px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4">
      <div className="max-w-[1720px] mx-auto w-full min-h-full 2xl:min-h-0">
        <div className="flex flex-col 2xl:flex-row gap-4 lg:gap-6 items-stretch 2xl:min-h-0 2xl:h-[calc(100dvh-6.75rem)]">
          <div className="w-full 2xl:flex-1 2xl:h-full space-y-3 sm:space-y-4 animate-pageEnter min-h-0 min-w-0 flex flex-col">
            <div className="relative glass-card rounded-xl p-3 sm:p-4 2xl:flex-1 2xl:min-h-0 animate-revealUp stagger-1">
              <div className="h-full">
                <ChessEditor
                  fen={fen}
                  onFenChange={handleEditorFenChange}
                  pieceStyle={pieceStyle}
                  showCoords={showCoords}
                  lightSquare={lightSquare}
                  darkSquare={darkSquare}
                  flipped={flipped}
                  onPieceImagesChange={setPieceImages}
                  className="2xl:h-full"
                />
              </div>
            </div>

            <div className="glass-card rounded-xl p-3 sm:p-4 lg:p-5 animate-revealUp stagger-3">
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

          <div className="w-full 2xl:w-[500px] 2xl:flex-shrink-0 2xl:min-h-0 2xl:h-full animate-slideInRight stagger-2">
            <ControlPanel
              fen={fen}
              setFen={setFen}
              pieceStyle={pieceStyle}
              setPieceStyle={setPieceStyle}
              showCoords={showCoords}
              setShowCoords={setShowCoords}
              showCoordinateBorder={showCoordinateBorder}
              setShowCoordinateBorder={setShowCoordinateBorder}
              showThinFrame={showThinFrame}
              setShowThinFrame={setShowThinFrame}
              exportQuality={exportQuality}
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
}

export default HomePage;
