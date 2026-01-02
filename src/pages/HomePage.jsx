import { useState, useRef, useCallback } from "react";
import {
  ChessBoard,
  ControlPanel,
  ActionButtons,
  NotificationContainer,
  ExportProgress,
} from "../components/";
import { useNotifications, useLocalStorage } from "../hooks";
import {
  downloadPNG,
  downloadJPEG,
  copyToClipboard,
  batchExport,
  cancelExport,
  pauseExport,
  resumeExport,
} from "../utils/canvasExporter";

const HomePage = () => {
  const [fen, setFen] = useLocalStorage(
    "chess-fen",
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [pieceStyle, setPieceStyle] = useLocalStorage(
    "chess-piece-style",
    "cburnett"
  );
  const [showCoords, setShowCoords] = useLocalStorage(
    "chess-show-coords",
    true
  );
  const [lightSquare, setLightSquare] = useLocalStorage(
    "chess-light-square",
    "#f0d9b5"
  );
  const [darkSquare, setDarkSquare] = useLocalStorage(
    "chess-dark-square",
    "#b58863"
  );
  const [boardSize, setBoardSize] = useLocalStorage("chess-board-size", 400);
  const [flipped, setFlipped] = useLocalStorage("chess-flipped", false);

  // Export state - PERSISTED
  const [fileName, setFileName] = useLocalStorage(
    "chess-file-name",
    "chess-position"
  );
  const [exportQuality, setExportQuality] = useLocalStorage(
    "chess-export-quality",
    16
  );

  // Temporary state (not persisted)
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentFormat, setCurrentFormat] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showProgress, setShowProgress] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const boardRef = useRef(null);
  const addToFavoritesRef = useRef(null);

  const { notifications, success, error, info, removeNotification } =
    useNotifications();

  // Get export configuration
  const getExportConfig = () => ({
    boardSize,
    showCoords,
    lightSquare,
    darkSquare,
    flipped,
    fen,
    pieceImages: boardRef.current?.getPieceImages() || {},
    exportQuality,
  });

  // Handle PNG export
  const handleDownloadPNG = async () => {
    setIsExporting(true);
    setCurrentFormat("png");
    setExportProgress(0);
    setIsPaused(false);
    setShowProgress(true);

    try {
      await downloadPNG(getExportConfig(), fileName, (progress) => {
        setExportProgress(progress);
      });
      success("PNG exported successfully");
    } catch (err) {
      if (err.message === "Export cancelled") {
        info("Export cancelled");
      } else {
        error("PNG export failed: " + err.message);
      }
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setCurrentFormat(null);
        setExportProgress(0);
        setIsPaused(false);
      }, 300);
    }
  };

  // Handle JPEG export
  const handleDownloadJPEG = async () => {
    setIsExporting(true);
    setCurrentFormat("jpeg");
    setExportProgress(0);
    setIsPaused(false);
    setShowProgress(true);

    try {
      await downloadJPEG(getExportConfig(), fileName, (progress) => {
        setExportProgress(progress);
      });
      success("JPEG exported successfully");
    } catch (err) {
      if (err.message === "Export cancelled") {
        info("Export cancelled");
      } else {
        error("JPEG export failed: " + err.message);
      }
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setCurrentFormat(null);
        setExportProgress(0);
        setIsPaused(false);
      }, 300);
    }
  };

  // Handle copy to clipboard
  const handleCopyImage = async () => {
    try {
      await copyToClipboard(getExportConfig());
      success("Image copied to clipboard");
    } catch (err) {
      error("Copy failed: " + err.message);
      console.error(err);
    }
  };

  // Handle board flip
  const handleFlip = () => {
    setFlipped(!flipped);
    success("Board flipped");
  };

  // Handle batch export
  const handleBatchExport = async (formats) => {
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
      if (err.message === "Export cancelled") {
        info("Export cancelled");
      } else {
        error("Batch export failed: " + err.message);
      }
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setCurrentFormat(null);
        setExportProgress(0);
        setIsPaused(false);
      }, 300);
    }
  };

  // Handle cancel export
  const handleCancelExport = () => {
    cancelExport();
    setIsExporting(false);
    setCurrentFormat(null);
    setExportProgress(0);
    setIsPaused(false);
    setShowProgress(true);
    info("Export cancelled");
  };

  // Handle close modal (hide only)
  const handleCloseModal = () => {
    setShowProgress(false);
  };

  // Handle pause
  const handlePause = () => {
    pauseExport();
    setIsPaused(true);
  };

  // Handle resume
  const handleResume = () => {
    resumeExport();
    setIsPaused(false);
  };

  // Callback to handle favorite from ActionButtons
  const handleAddToFavorites = useCallback(() => {
    if (addToFavoritesRef.current) {
      addToFavoritesRef.current();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-6 sm:py-8 px-4">
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,1fr)_minmax(380px,580px)] xl:grid-cols-[minmax(320px,1fr)_minmax(420px,620px)] gap-4 sm:gap-6 lg:gap-8 items-start">
          {/* Left Side - Board & Actions */}
          <div className="flex flex-col items-center gap-4 sm:gap-6 w-full order-2 lg:order-1">
            <div className="w-full max-w-2xl">
              <ChessBoard
                ref={boardRef}
                fen={fen}
                pieceStyle={pieceStyle}
                showCoords={showCoords}
                lightSquare={lightSquare}
                darkSquare={darkSquare}
                boardSize={boardSize}
                flipped={flipped}
              />
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

          {/* Right Side - Controls */}
          <div className="w-full order-1 lg:order-2">
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
                if (type === "success") success(message);
                else if (type === "error") error(message);
                else if (type === "warning") info(message);
              }}
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Export Progress */}
      {showProgress && (
        <ExportProgress
          isExporting={isExporting}
          progress={exportProgress}
          currentFormat={currentFormat}
          config={getExportConfig()}
          isPaused={isPaused}
          onClose={handleCloseModal}
          onPause={handlePause}
          onResume={handleResume}
          onCancel={handleCancelExport}
        />
      )}
    </div>
  );
};

export default HomePage;
