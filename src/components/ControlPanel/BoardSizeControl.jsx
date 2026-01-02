import { useState, useEffect } from "react";
import { Input } from "../UI";

const BoardSizeControl = ({ boardSize, setBoardSize }) => {
  const [boardSizeInput, setBoardSizeInput] = useState(boardSize);
  const [boardSizeError, setBoardSizeError] = useState("");

  useEffect(() => {
    setBoardSizeInput(boardSize);
  }, [boardSize]);

  const handleRangeChange = (e) => {
    const numValue = parseInt(e.target.value);
    if (!isNaN(numValue)) {
      setBoardSizeInput(numValue);
      setBoardSize(numValue);
      setBoardSizeError("");
    }
  };

  const handleNumberInputChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setBoardSizeInput("");
      setBoardSizeError("");
      return;
    }

    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setBoardSizeInput(numValue);

      if (numValue < 150) {
        setBoardSizeError("Minimum size is 150px");
      } else if (numValue > 600) {
        setBoardSizeError("Maximum size is 600px");
      } else {
        setBoardSizeError("");
      }
    }
  };

  const applyBoardSize = () => {
    const numValue = parseInt(boardSizeInput);

    if (boardSizeInput === "" || isNaN(numValue)) {
      setBoardSize(400);
      setBoardSizeInput(400);
      setBoardSizeError("");
      return;
    }

    if (numValue < 150) {
      setBoardSize(150);
      setBoardSizeInput(150);
      setBoardSizeError("Minimum size is 150px");
      return;
    }

    if (numValue > 600) {
      setBoardSize(600);
      setBoardSizeInput(600);
      setBoardSizeError("Maximum size is 600px");
      return;
    }

    setBoardSize(numValue);
    setBoardSizeInput(numValue);
    setBoardSizeError("");
  };

  const getBoardSizeValidation = () => {
    if (boardSizeInput === "") return "neutral";
    const numValue = parseInt(boardSizeInput);
    if (isNaN(numValue)) return "neutral";
    if (numValue >= 150 && numValue <= 600) return "valid";
    return "invalid";
  };

  const validation = getBoardSizeValidation();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-300">
          Board Size
        </label>
      </div>
      <div className="flex gap-2 sm:gap-3 items-center">
        <input
          type="range"
          min="150"
          max="600"
          step="50"
          value={boardSize || 400}
          onChange={handleRangeChange}
          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <input
          type="number"
          min="150"
          max="600"
          step="1"
          value={boardSizeInput}
          onChange={handleNumberInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyBoardSize();
              e.target.blur();
            }
          }}
          onBlur={applyBoardSize}
          placeholder="400"
          className={`w-16 sm:w-20 px-2 py-1.5 rounded-lg text-xs sm:text-sm text-gray-200 text-center font-mono font-semibold focus:outline-none transition-all ${
            validation === "valid"
              ? "bg-green-950/50 border border-green-500 shadow-md shadow-green-500/40 focus:ring-2 focus:ring-green-500/40"
              : validation === "invalid"
              ? "bg-red-950/50 border border-red-500 shadow-md shadow-red-500/40 focus:ring-2 focus:ring-red-500/40"
              : "bg-gray-950/50 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          }`}
        />
      </div>
      {boardSizeError && <Input error={boardSizeError} className="hidden" />}
    </div>
  );
};

export default BoardSizeControl;
