import React, { useState, useRef } from "react";
import ChessBoard from "./components/ChessBoard";
import ControlPanel from "./components/ControlPanel";
import ActionButtons from "./components/ActionButtons";
import StatusMessage from "./components/StatusMessage";
import { createExportCanvas } from "./utils/canvasExporter";

function App() {
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [pieceStyle, setPieceStyle] = useState("cburnett");
  const [showCoords, setShowCoords] = useState(true);
  const [showBorder, setShowBorder] = useState(false);
  const [lightSquare, setLightSquare] = useState("#f0d9b5");
  const [darkSquare, setDarkSquare] = useState("#b58863");
  const [boardSize, setBoardSize] = useState(400);
  const [fileName, setFileName] = useState("chess-position");
  const [flipped, setFlipped] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "" });

  const chessBoardRef = useRef(null);

  const showStatus = (msg, type) => {
    setStatus({ message: msg, type });
    setTimeout(() => setStatus({ message: "", type: "" }), 3000);
  };

  const getExportConfig = () => ({
    boardSize,
    showBorder,
    showCoords,
    lightSquare,
    darkSquare,
    flipped,
    fen,
    board: chessBoardRef.current?.getBoardState(),
    pieceImages: chessBoardRef.current?.getPieceImages(),
  });

  const handleDownloadPNG = async () => {
    try {
      const canvas = createExportCanvas(getExportConfig());
      if (!canvas) return showStatus("Canvas error", "error");

      await new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return showStatus("Export failed", "error");
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = `${fileName}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            resolve();
          },
          "image/png",
          1.0
        );
      });

      const borderSize =
        showBorder || showCoords ? Math.max(20, boardSize / 20) : 0;
      const displaySize = boardSize + borderSize * 2;
      const pixels = displaySize * 16;
      showStatus(
        `PNG: ${displaySize}×${displaySize}px (${pixels}×${pixels} actual)`,
        "success"
      );
    } catch (err) {
      console.error("PNG error:", err);
      showStatus("PNG export failed!", "error");
    }
  };

  const handleDownloadJPEG = async () => {
    try {
      const canvas = createExportCanvas(getExportConfig());
      if (!canvas) return showStatus("Canvas error", "error");

      await new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return showStatus("Export failed", "error");
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = `${fileName}.jpg`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            resolve();
          },
          "image/jpeg",
          0.98
        );
      });

      const borderSize =
        showBorder || showCoords ? Math.max(20, boardSize / 20) : 0;
      const displaySize = boardSize + borderSize * 2;
      const pixels = displaySize * 16;
      showStatus(
        `JPEG: ${displaySize}×${displaySize}px (${pixels}×${pixels} actual)`,
        "success"
      );
    } catch (err) {
      console.error("JPEG error:", err);
      showStatus("JPEG export failed!", "error");
    }
  };

  const handleCopyImage = async () => {
    try {
      const canvas = createExportCanvas(getExportConfig());
      if (!canvas) return showStatus("Canvas error", "error");

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png", 1.0)
      );
      if (!blob) throw new Error("Blob creation failed");

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      const borderSize =
        showBorder || showCoords ? Math.max(20, boardSize / 20) : 0;
      const displaySize = boardSize + borderSize * 2;
      showStatus(`Copied: ${displaySize}×${displaySize}px`, "success");
    } catch (err) {
      console.error("Copy error:", err);
      showStatus("Copy to clipboard failed!", "error");
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
    showStatus("Board flipped", "success");
  };

  const handleCopyFEN = async () => {
    try {
      await navigator.clipboard.writeText(fen);
      showStatus("FEN copied to clipboard!", "success");
    } catch (err) {
      console.error("FEN copy error:", err);
      showStatus("FEN copy failed!", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 sm:p-6 lg:p-8">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
            Chess FEN Exporter
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Professional chess board image generator for authors & publishers
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-6 lg:gap-8">
          {/* Left Panel - Board & Actions */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl">
            <div className="flex flex-col items-center gap-6">
              <ChessBoard
                ref={chessBoardRef}
                fen={fen}
                pieceStyle={pieceStyle}
                showCoords={showCoords}
                showBorder={showBorder}
                lightSquare={lightSquare}
                darkSquare={darkSquare}
                boardSize={boardSize}
                flipped={flipped}
              />

              <ActionButtons
                onDownloadPNG={handleDownloadPNG}
                onDownloadJPEG={handleDownloadJPEG}
                onCopyImage={handleCopyImage}
                onFlip={handleFlip}
                onCopyFEN={handleCopyFEN}
              />

              {status.message && (
                <StatusMessage message={status.message} type={status.type} />
              )}
            </div>
          </div>

          {/* Right Panel - Controls */}
          <ControlPanel
            fen={fen}
            setFen={setFen}
            pieceStyle={pieceStyle}
            setPieceStyle={setPieceStyle}
            showCoords={showCoords}
            setShowCoords={setShowCoords}
            showBorder={showBorder}
            setShowBorder={setShowBorder}
            lightSquare={lightSquare}
            setLightSquare={setLightSquare}
            darkSquare={darkSquare}
            setDarkSquare={setDarkSquare}
            boardSize={boardSize}
            setBoardSize={setBoardSize}
            fileName={fileName}
            setFileName={setFileName}
          />
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>
            Export quality: 16x resolution • Maximum image quality for
            professional publications
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
