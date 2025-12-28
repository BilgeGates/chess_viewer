import React, { useState } from "react";
import ChessBoard from "./components/ChessBoard";
import ControlPanel from "./components/ControlPanel";
import ActionButtons from "./components/ActionButtons";
import StatusMessage from "./components/StatusMessage";

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

  const showStatus = (message, type) => {
    setStatus({ message, type });
    setTimeout(() => setStatus({ message: "", type: "" }), 3000);
  };

  const createExportCanvas = () => {
    const mainCanvas = document.querySelector("canvas");
    if (!mainCanvas) return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
      willReadFrequently: true,
    });

    const borderSize = showBorder ? 8 : 0;
    const totalSize = boardSize + borderSize * 2;

    // Export with higher quality multiplier
    const effectiveQuality = exportQuality * 2;

    canvas.width = totalSize * effectiveQuality;
    canvas.height = totalSize * effectiveQuality;

    ctx.scale(effectiveQuality, effectiveQuality);

    // High quality settings
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const squareSize = boardSize / 8;

    // Redraw everything on export canvas
    if (showBorder) {
      ctx.fillStyle = "#1e212e";
      ctx.fillRect(0, 0, totalSize, totalSize);
    }

    // Parse FEN and get board state
    const parts = fen.trim().split(/\s+/);
    const position = parts[0];
    const rows = position.split("/");
    const board = [];

    for (let row of rows) {
      let boardRow = [];
      for (let char of row) {
        if (isNaN(char)) {
          boardRow.push(char);
        } else {
          boardRow.push(...Array(parseInt(char)).fill(""));
        }
      }
      board.push(boardRow);
    }

    // Draw squares
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isLight = (row + col) % 2 === 0;
        ctx.fillStyle = isLight ? lightSquare : darkSquare;
        const drawRow = flipped ? 7 - row : row;
        const drawCol = flipped ? 7 - col : col;

        ctx.fillRect(
          drawCol * squareSize + borderSize,
          drawRow * squareSize + borderSize,
          squareSize,
          squareSize
        );
      }
    }

    // Draw pieces from main canvas
    ctx.drawImage(mainCanvas, 0, 0, totalSize, totalSize);

    // Redraw coordinates for export - Chess.com style
    if (showCoords) {
      const fontSize = Math.round(boardSize / 35);
      const minFontSize = 8;
      const maxFontSize = 18;
      const finalFontSize = Math.max(
        minFontSize,
        Math.min(maxFontSize, fontSize)
      );
      const padding = finalFontSize * 0.35;

      ctx.font = `bold ${finalFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
      ctx.fillStyle = "rgba(0, 0, 0, 0.85)";

      // Draw rank numbers (1-8) on LEFT-TOP corner
      for (let i = 0; i < 8; i++) {
        const rank = flipped ? i + 1 : 8 - i;
        const drawRow = flipped ? 7 - i : i;
        const yPos = drawRow * squareSize + padding + borderSize;

        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(rank.toString(), padding + borderSize, yPos);
      }

      // Draw file letters (a-h) on RIGHT-BOTTOM corner
      for (let i = 0; i < 8; i++) {
        const file = String.fromCharCode(97 + (flipped ? 7 - i : i));
        const drawCol = flipped ? 7 - i : i;
        const xPos = (drawCol + 1) * squareSize - padding + borderSize;

        const lastRow = flipped ? 0 : 7;
        const yPos = (lastRow + 1) * squareSize - padding + borderSize;

        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText(file, xPos, yPos);
      }
    }

    return canvas;
  };

  const handleDownloadPNG = () => {
    const exportCanvas = createExportCanvas();
    if (!exportCanvas) {
      showStatus("Canvas yüklənmədi", "error");
      return;
    }

    exportCanvas.toBlob(
      (blob) => {
        if (!blob) {
          showStatus("Şəkil yaradılmadı", "error");
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${fileName}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        showStatus("PNG yüksək keyfiyyətlə yükləndi", "success");
      },
      "image/png",
      1.0
    );
  };

  const handleDownloadJPEG = () => {
    const exportCanvas = createExportCanvas();
    if (!exportCanvas) {
      showStatus("Canvas yüklənmədi", "error");
      return;
    }

    exportCanvas.toBlob(
      (blob) => {
        if (!blob) {
          showStatus("Şəkil yaradılmadı", "error");
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${fileName}.jpg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        showStatus("JPEG yüksək keyfiyyətlə yükləndi", "success");
      },
      "image/jpeg",
      0.95
    );
  };

  const handleCopyImage = async () => {
    try {
      const exportCanvas = createExportCanvas();
      if (!exportCanvas) {
        showStatus("Canvas yüklənmədi", "error");
        return;
      }

      const blob = await new Promise((resolve) =>
        exportCanvas.toBlob(resolve, "image/png", 1.0)
      );

      if (!blob) {
        showStatus("Şəkil yaradılmadı", "error");
        return;
      }

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      showStatus("Şəkil kopyalandı!", "success");
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
      console.error("Copy FEN error:", err);
      showStatus("FEN kopyalama xətası!", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold text-white mb-8 tracking-tight">
          Şahmat FEN Yükləyici
        </h1>

        <div className="grid lg:grid-cols-[1fr_420px] gap-5">
          {/* Left Panel - Board and Actions */}
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 flex flex-col items-center gap-3">
            <ChessBoard
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
