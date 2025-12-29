import { useState, useRef } from "react";
import ChessBoard from "./components/ChessBoard";
import ControlPanel from "./components/ControlPanel";
import ActionButtons from "./components/ActionButtons";
import UserGuide from "./components/UserGuide";
import NotificationContainer from "./components/NotificationContainer";
import { ExportProgress } from "./components/ExportProgress";
import { useNotifications } from "./hooks/useNotifications";
import {
  downloadPNG,
  downloadJPEG,
  copyToClipboard,
  batchExport,
  cancelExport,
  resetCancellation,
} from "./utils/canvasExporter";

const App = () => {
  // Board state
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [pieceStyle, setPieceStyle] = useState("cburnett");
  const [showCoords, setShowCoords] = useState(true);
  const [lightSquare, setLightSquare] = useState("#f0d9b5");
  const [darkSquare, setDarkSquare] = useState("#b58863");
  const [boardSize, setBoardSize] = useState(400);
  const [flipped, setFlipped] = useState(false);

  // Export state
  const [fileName, setFileName] = useState("chess-position");
  const [exportQuality, setExportQuality] = useState(16);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentFormat, setCurrentFormat] = useState(null);
  const [realFileSize, setRealFileSize] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showProgress, setShowProgress] = useState(true);

  const boardRef = useRef(null);
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
    setRealFileSize(null);
    setIsPaused(false);
    setShowProgress(true);
    resetCancellation();

    try {
      await downloadPNG(getExportConfig(), fileName, (progress, size) => {
        if (!isPaused) {
          setExportProgress(progress);
        }
        if (size) setRealFileSize(size);
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
        setRealFileSize(null);
        setIsPaused(false);
      }, 300);
    }
  };

  // Handle JPEG export
  const handleDownloadJPEG = async () => {
    setIsExporting(true);
    setCurrentFormat("jpeg");
    setExportProgress(0);
    setRealFileSize(null);
    setIsPaused(false);
    setShowProgress(true);
    resetCancellation();

    try {
      await downloadJPEG(getExportConfig(), fileName, (progress, size) => {
        if (!isPaused) {
          setExportProgress(progress);
        }
        if (size) setRealFileSize(size);
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
        setRealFileSize(null);
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
      error("Batch export failed: " + err.message);
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setCurrentFormat(null);
        setExportProgress(0);
      }, 300);
    }
  };

  // Handle cancel export
  const handleCancelExport = () => {
    cancelExport();
    setIsExporting(false);
    setCurrentFormat(null);
    setExportProgress(0);
    setRealFileSize(null);
    setIsPaused(false);
    setShowProgress(true);
  };

  // Handle close modal (hide only)
  const handleCloseModal = () => {
    setShowProgress(false);
  };

  // Handle pause
  const handlePause = () => {
    setIsPaused(true);
    info("Export paused");
  };

  // Handle resume
  const handleResume = () => {
    setIsPaused(false);
    info("Export resumed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Chess Diagram Generator
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Create professional chess diagrams with ultra-high quality export
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,1fr)_minmax(400px,600px)] gap-8 items-start">
          {/* Left Side - Board & Actions */}
          <div className="flex flex-col items-center gap-6 w-full">
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
                isExporting={isExporting}
              />
            </div>
          </div>

          {/* Right Side - Controls */}
          <div className="w-full">
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
              onNotification={(message, type) => {
                if (type === "success") success(message);
                else if (type === "error") error(message);
                else if (type === "warning") info(message);
              }}
            />
          </div>
        </div>

        {/* User Guide */}
        <div className="mt-8">
          <UserGuide />
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
          realFileSize={realFileSize}
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

export default App;
