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
  pauseExport,
  resumeExport,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-6 sm:py-8 px-3 sm:px-4 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent px-2">
            Chess Diagram Generator
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg px-4">
            Create professional chess diagrams with ultra-high quality export
          </p>
        </div>

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
                isExporting={isExporting}
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
              onNotification={(message, type) => {
                if (type === "success") success(message);
                else if (type === "error") error(message);
                else if (type === "warning") info(message);
              }}
            />
          </div>
        </div>

        {/* User Guide */}
        <div className="mt-6 sm:mt-8">
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
