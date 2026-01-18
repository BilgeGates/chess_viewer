import { useState, useRef, useCallback, useMemo } from 'react';
import ChessBoard from '../components/board/ChessBoard';
import ControlPanel from '../components/controls/ControlPanel';
import {
  ActionButtons,
  NotificationContainer,
  ExportProgress
} from '../components/UI';
import { useNotifications, useLocalStorage } from '../hooks';
import {
  downloadPNG,
  downloadJPEG,
  copyToClipboard,
  batchExport,
  cancelExport,
  pauseExport,
  resumeExport
} from '../utils/canvasExporter';

/**
 * Home Page
 * Prevents unnecessary re-renders with useCallback and useMemo
 */
const HomePage = () => {
  // Persistent state
  const [fen, setFen] = useLocalStorage(
    'chess-fen',
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  );
  const [pieceStyle, setPieceStyle] = useLocalStorage(
    'chess-piece-style',
    'cburnett'
  );
  const [showCoords, setShowCoords] = useLocalStorage(
    'chess-show-coords',
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

  // Temporary state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentFormat, setCurrentFormat] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showProgress, setShowProgress] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Refs
  const boardRef = useRef(null);
  const addToFavoritesRef = useRef(null);

  // Notifications
  const { notifications, success, error, info, removeNotification } =
    useNotifications();

  // Memoized export config
  const getExportConfig = useCallback(() => {
    // Base size for display/export (in pixels at 1x)
    // Convert cm to pixels at standard web resolution (96 DPI = 37.795 px/cm)
    // This gives us the BASE visual size, exportQuality handles resolution
    const baseDisplayPx = Math.round(boardSize * 37.795); // 96 DPI web standard

    return {
      boardSize: baseDisplayPx, // Base pixel size for visual dimensions
      showCoords,
      lightSquare,
      darkSquare,
      flipped,
      fen,
      pieceImages: boardRef.current?.getPieceImages() || {},
      exportQuality: exportQuality // Multiplier for resolution (DPI), not visual size
    };
  }, [
    boardSize,
    showCoords,
    lightSquare,
    darkSquare,
    flipped,
    fen,
    exportQuality
  ]);

  // Export handlers
  const handleDownloadPNG = useCallback(async () => {
    setIsExporting(true);
    setCurrentFormat('png');
    setExportProgress(0);
    setIsPaused(false);
    setShowProgress(true);

    try {
      await downloadPNG(getExportConfig(), fileName, setExportProgress);
      success('PNG exported successfully');
    } catch (err) {
      if (err.message === 'Export cancelled') {
        info('Export cancelled');
      } else {
        error('PNG export failed: ' + err.message);
      }
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setCurrentFormat(null);
        setExportProgress(0);
        setIsPaused(false);
      }, 300);
    }
  }, [getExportConfig, fileName, success, error, info]);

  const handleDownloadJPEG = useCallback(async () => {
    setIsExporting(true);
    setCurrentFormat('jpeg');
    setExportProgress(0);
    setIsPaused(false);
    setShowProgress(true);

    try {
      await downloadJPEG(getExportConfig(), fileName, setExportProgress);
      success('JPEG exported successfully');
    } catch (err) {
      if (err.message === 'Export cancelled') {
        info('Export cancelled');
      } else {
        error('JPEG export failed: ' + err.message);
      }
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setCurrentFormat(null);
        setExportProgress(0);
        setIsPaused(false);
      }, 300);
    }
  }, [getExportConfig, fileName, success, error, info]);

  const handleCopyImage = useCallback(async () => {
    try {
      await copyToClipboard(getExportConfig());
      success('Image copied to clipboard');
    } catch (err) {
      error('Copy failed: ' + err.message);
    }
  }, [getExportConfig, success, error]);

  const handleFlip = useCallback(() => {
    setFlipped((prev) => !prev);
    success('Board flipped');
  }, [setFlipped, success]);

  const handleBatchExport = useCallback(
    async (formats) => {
      setIsExporting(true);
      setExportProgress(0);
      setIsPaused(false);
      setShowProgress(true);

      try {
        await batchExport(
          getExportConfig(),
          formats,
          fileName,
          (progress, format) => {
            setExportProgress(progress);
            setCurrentFormat(format);
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
          setIsExporting(false);
          setCurrentFormat(null);
          setExportProgress(0);
          setIsPaused(false);
        }, 300);
      }
    },
    [getExportConfig, fileName, success, error, info]
  );

  const handleCancelExport = useCallback(() => {
    cancelExport();
    setIsExporting(false);
    setCurrentFormat(null);
    setExportProgress(0);
    setIsPaused(false);
    setShowProgress(true);
    info('Export cancelled');
  }, [info]);

  const handlePause = useCallback(() => {
    pauseExport();
    setIsPaused(true);
  }, []);

  const handleResume = useCallback(() => {
    resumeExport();
    setIsPaused(false);
  }, []);

  const handleAddToFavorites = useCallback(() => {
    if (addToFavoritesRef.current) {
      addToFavoritesRef.current();
    }
  }, []);

  // Memoized board props - DÜZƏLDİLMİŞ
  const boardProps = useMemo(
    () => ({
      fen,
      pieceStyle,
      showCoords,
      boardSize: 400, // Fixed display size for website
      lightSquare,
      darkSquare,
      flipped
    }),
    [fen, pieceStyle, showCoords, lightSquare, darkSquare, flipped]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-start">
          {/* Control Panel - Mobile First, Desktop Right */}
          <div className="w-full lg:w-[380px] xl:w-[520px] order-1 lg:order-2">
            <ControlPanel
              fen={fen}
              setFen={setFen}
              pieceStyle={pieceStyle}
              setPieceStyle={setPieceStyle}
              showCoords={showCoords}
              setShowCoords={setShowCoords}
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
              onNotification={(message, type) => {
                if (type === 'success') success(message);
                else if (type === 'error') error(message);
                else if (type === 'warning') info(message);
              }}
            />
          </div>

          {/* Board & Actions - Mobile Second, Desktop Left */}
          <div className="flex-1 w-full flex flex-col items-center gap-4 sm:gap-6 order-2 lg:order-1">
            <div className="w-full max-w-2xl">
              <ChessBoard ref={boardRef} {...boardProps} />
            </div>

            <div className="w-full max-w-2xl">
              <ActionButtons
                onDownloadPNG={handleDownloadPNG}
                onDownloadJPEG={handleDownloadJPEG}
                onCopyImage={handleCopyImage}
                onFlip={handleFlip}
                onBatchExport={handleBatchExport}
                onAddToFavorites={handleAddToFavorites}
                isExporting={isExporting}
                currentFen={fen}
                isFavorite={isFavorite}
              />
            </div>
          </div>
        </div>
      </div>

      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />

      {showProgress && (
        <ExportProgress
          isExporting={isExporting}
          progress={exportProgress}
          currentFormat={currentFormat}
          config={getExportConfig()}
          isPaused={isPaused}
          onClose={() => setShowProgress(false)}
          onPause={handlePause}
          onResume={handleResume}
          onCancel={handleCancelExport}
        />
      )}
    </div>
  );
};

export default HomePage;
