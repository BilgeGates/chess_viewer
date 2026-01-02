import { useState, useEffect } from "react";
import { validateFEN } from "../../utils";
import { Copy, CheckCircle, Clipboard, AlertCircle } from "lucide-react";

const FENInput = ({ fen, setFen, onNotification }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [fenError, setFenError] = useState("");

  useEffect(() => {
    if (fen.trim()) {
      if (!validateFEN(fen)) {
        setFenError("Invalid FEN notation");
      } else {
        setFenError("");
      }
    } else {
      setFenError("");
    }
  }, [fen]);

  const handleCopyFEN = async () => {
    try {
      await navigator.clipboard.writeText(fen);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      onNotification?.("FEN copied to clipboard", "success");
    } catch (err) {
      onNotification?.("Failed to copy FEN", "error");
    }
  };

  const handlePasteFEN = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setFen(text.trim());

        if (validateFEN(text.trim())) {
          onNotification?.("FEN pasted successfully", "success");
        } else {
          onNotification?.("Pasted text - please verify FEN", "warning");
        }
      } else {
        onNotification?.("Clipboard is empty", "error");
      }
    } catch (err) {
      onNotification?.("Failed to paste from clipboard", "error");
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <textarea
          value={fen}
          onChange={(e) => setFen(e.target.value)}
          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-20 sm:pr-24 bg-gray-950/50 rounded-lg text-xs sm:text-sm text-gray-200 font-mono resize-none min-h-[80px] sm:min-h-[90px] focus-visible:outline-none focus:outline-none outline-none focus:ring-0 transition-all ${
            fenError ? "border border-red-500" : ""
          }`}
          placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={handlePasteFEN}
            className="p-1.5 sm:p-2 rounded-md text-white transition-all bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
            title="Paste FEN"
          >
            <Clipboard className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.5} />
          </button>
          <button
            onClick={handleCopyFEN}
            className={`p-1.5 sm:p-2 rounded-md text-white transition-all ${
              copySuccess ? "bg-green-600" : "bg-blue-600/90 hover:bg-blue-500"
            }`}
            title="Copy FEN"
          >
            {copySuccess ? (
              <CheckCircle
                className="w-3 h-3 sm:w-4 sm:h-4"
                strokeWidth={2.5}
              />
            ) : (
              <Copy className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
      {fenError && (
        <div className="flex items-center gap-2 text-red-400 text-xs mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{fenError}</span>
        </div>
      )}
    </div>
  );
};

export default FENInput;
