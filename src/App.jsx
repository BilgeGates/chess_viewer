import { useState, useRef } from "react";
import ChessBoard from "./components/ChessBoard";
import ControlPanel from "./components/ControlPanel";
import ActionButtons from "./components/ActionButtons";
import UserGuide from "./components/UserGuide";
import { NotificationContainer } from "./components/NotificationContainer";
import { ExportProgress } from "./components/LoadingComponents";
import { useNotifications } from "./hooks/useNotifications";
import {
  downloadPNG,
  downloadJPEG,
  downloadSVG,
  copyToClipboard,
  batchExport,
} from "./utils/canvasExporter";
import { generateRandomPosition } from "./utils/fenParser";

const App = () => {
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [pieceStyle, setPieceStyle] = useState("cburnett");
  const [showCoords, setShowCoords] = useState(true);
  const [lightSquare, setLightSquare] = useState("#f0d9b5");
  const [darkSquare, setDarkSquare] = useState("#b58863");
  const [boardSize, setBoardSize] = useState(400);
  const [fileName, setFileName] = useState("chess-position");
  const [flipped, setFlipped] = useState(false);
  const [exportQuality, setExportQuality] = useState(16);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentFormat, setCurrentFormat] = useState(null);

  const boardRef = useRef(null);
  const { notifications, success, error, removeNotification } =
    useNotifications();

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

  const handleDownloadPNG = async () => {
    setIsExporting(true);
    setCurrentFormat("png");
    setExportProgress(0);

    try {
      setExportProgress(50);
      await downloadPNG(getExportConfig(), fileName);
      setExportProgress(100);
      success("PNG exported successfully!");
    } catch (err) {
      error("PNG export failed: " + err.message);
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setCurrentFormat(null);
        setExportProgress(0);
      }, 500);
    }
  };

  const handleDownloadJPEG = async () => {
    setIsExporting(true);
    setCurrentFormat("jpeg");
    setExportProgress(0);

    try {
      setExportProgress(50);
      await downloadJPEG(getExportConfig(), fileName);
      setExportProgress(100);
      success("JPEG exported successfully!");
    } catch (err) {
      error("JPEG export failed: " + err.message);
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setCurrentFormat(null);
        setExportProgress(0);
      }, 500);
    }
  };

  const handleDownloadSVG = async () => {
    setIsExporting(true);
    setCurrentFormat("svg");
    setExportProgress(0);

    try {
      setExportProgress(50);
      await downloadSVG(getExportConfig(), fileName);
      setExportProgress(100);
      success("SVG exported successfully!");
    } catch (err) {
      error("SVG export failed: " + err.message);
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setCurrentFormat(null);
        setExportProgress(0);
      }, 500);
    }
  };

  const handleCopyImage = async () => {
    try {
      await copyToClipboard(getExportConfig());
      success("Image copied to clipboard!");
    } catch (err) {
      error("Copy failed: " + err.message);
      console.error(err);
    }
  };

  const handleCopyFEN = async () => {
    try {
      await navigator.clipboard.writeText(fen);
      success("FEN copied to clipboard!");
    } catch (err) {
      error("Failed to copy FEN");
      console.error(err);
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
    success("Board flipped!");
  };

  const handleRandomPosition = () => {
    try {
      const randomFen = generateRandomPosition();
      setFen(randomFen);
      success("Random position generated!");
    } catch (err) {
      error("Failed to generate random position");
      console.error(err);
    }
  };

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
      success(`Exported ${formats.length} formats successfully!`);
    } catch (err) {
      error("Batch export failed: " + err.message);
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setCurrentFormat(null);
        setExportProgress(0);
      }, 500);
    }
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
          {/* Left Side */}
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
                onDownloadSVG={handleDownloadSVG}
                onCopyImage={handleCopyImage}
                onFlip={handleFlip}
                onCopyFEN={handleCopyFEN}
                onRandomPosition={handleRandomPosition}
                onBatchExport={handleBatchExport}
                isExporting={isExporting}
              />
            </div>
          </div>

          {/* Right Side */}
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
            />
          </div>
        </div>

        {/* User Guide - Yeni */}
        <div className="mt-8">
          <UserGuide />
        </div>
      </div>

      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />

      <ExportProgress
        isExporting={isExporting}
        progress={exportProgress}
        currentFormat={currentFormat}
      />
    </div>
  );
};

export default App;
