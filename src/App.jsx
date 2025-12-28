import React, { useState, useRef } from "react";
import ChessBoard from "./components/ChessBoard";
import ControlPanel from "./components/ControlPanel";
import ActionButtons from "./components/ActionButtons";
import StatusMessage from "./components/StatusMessage";
import {
  createExportCanvas,
  downloadPNG,
  downloadJPEG,
  copyToClipboard,
  getExportInfo,
} from "./utils/canvasExporter";

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
    pieceImages: chessBoardRef.current?.getPieceImages(),
  });

  const handleDownloadPNG = async () => {
    try {
      const canvas = createExportCanvas(getExportConfig());
      if (!canvas) return showStatus("Canvas xətası", "error");

      await downloadPNG(canvas, fileName);

      const info = getExportInfo(boardSize, showBorder, showCoords);
      showStatus(`PNG: ${info.display} (${info.pixels})`, "success");
    } catch (err) {
      console.error("PNG error:", err);
      showStatus("PNG yükləmə xətası!", "error");
    }
  };

  const handleDownloadJPEG = async () => {
    try {
      const canvas = createExportCanvas(getExportConfig());
      if (!canvas) return showStatus("Canvas xətası", "error");

      await downloadJPEG(canvas, fileName);

      const info = getExportInfo(boardSize, showBorder, showCoords);
      showStatus(`JPEG: ${info.display} (${info.pixels})`, "success");
    } catch (err) {
      console.error("JPEG error:", err);
      showStatus("JPEG yükləmə xətası!", "error");
    }
  };

  const handleCopyImage = async () => {
    try {
      const canvas = createExportCanvas(getExportConfig());
      if (!canvas) return showStatus("Canvas xətası", "error");

      await copyToClipboard(canvas);

      const info = getExportInfo(boardSize, showBorder, showCoords);
      showStatus(`Kopyalandı: ${info.display}`, "success");
    } catch (err) {
      console.error("Copy error:", err);
      showStatus("Kopyalama xətası!", "error");
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
    showStatus("Lövhə çevrildi", "success");
  };

  const handleCopyFEN = async () => {
    try {
      await navigator.clipboard.writeText(fen);
      showStatus("FEN kopyalandı!", "success");
    } catch (err) {
      console.error("FEN copy error:", err);
      showStatus("FEN xətası!", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 lg:mb-8">
          Şahmat FEN Yükləyici
        </h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-4 lg:gap-6">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
            <div className="flex flex-col items-center gap-4">
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
      </div>
    </div>
  );
}

export default App;
