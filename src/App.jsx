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
  getFileSize,
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
  const [exportQuality, setExportQuality] = useState(2);
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
    exportQuality,
    pieceImages: chessBoardRef.current?.getPieceImages(),
  });

  const handleDownloadPNG = async () => {
    try {
      const canvas = createExportCanvas(getExportConfig());
      if (!canvas) return showStatus("Canvas xətası", "error");

      await downloadPNG(canvas, fileName);
      const size = getFileSize(canvas);
      showStatus(
        `PNG: ${boardSize}×${boardSize}px, ${exportQuality}x, ${size}`,
        "success"
      );
    } catch (err) {
      showStatus("Yükləmə xətası!", "error");
    }
  };

  const handleDownloadJPEG = async () => {
    try {
      const canvas = createExportCanvas(getExportConfig());
      if (!canvas) return showStatus("Canvas xətası", "error");

      await downloadJPEG(canvas, fileName);
      const size = getFileSize(canvas);
      showStatus(
        `JPEG: ${boardSize}×${boardSize}px, ${exportQuality}x, ${size}`,
        "success"
      );
    } catch (err) {
      showStatus("Yükləmə xətası!", "error");
    }
  };

  const handleCopyImage = async () => {
    try {
      const canvas = createExportCanvas(getExportConfig());
      if (!canvas) return showStatus("Canvas xətası", "error");

      await copyToClipboard(canvas);
      showStatus(
        `Kopyalandı: ${boardSize}×${boardSize}px, ${exportQuality}x`,
        "success"
      );
    } catch (err) {
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
      showStatus("FEN xətası!", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold text-white mb-8 tracking-tight">
          Şahmat FEN Yükləyici
        </h1>

        <div className="grid lg:grid-cols-[1fr_420px] gap-5">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 flex flex-col items-center gap-3">
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

            <StatusMessage message={status.message} type={status.type} />
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
            exportQuality={exportQuality}
            setExportQuality={setExportQuality}
            fileName={fileName}
            setFileName={setFileName}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
