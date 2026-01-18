import { useState, useEffect, useMemo } from 'react';
import { Input } from '../UI';

const BoardSizeControl = ({ boardSize, setBoardSize }) => {
  const [boardSizeInput, setBoardSizeInput] = useState(boardSize);
  const [boardSizeError, setBoardSizeError] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);

  const presets = useMemo(
    () => [
      { label: '4×4', value: 4 },
      { label: '6×6', value: 6 },
      { label: '8×8', value: 8 }
    ],
    []
  );

  useEffect(() => {
    setBoardSizeInput(boardSize);
    // Check if current size matches a preset
    const matchingPreset = presets.find((p) => p.value === boardSize);
    setSelectedPreset(matchingPreset ? matchingPreset.value : null);
  }, [boardSize, presets]);

  const handlePresetClick = (value) => {
    setSelectedPreset(value);
    setBoardSize(value);
    setBoardSizeInput(value);
    setBoardSizeError('');
  };

  const handleCustomInputChange = (e) => {
    const value = e.target.value;
    setSelectedPreset(null);

    if (value === '') {
      setBoardSizeInput('');
      setBoardSizeError('');
      return;
    }

    // Check for non-numeric characters
    if (!/^\d*\.?\d*$/.test(value)) {
      setBoardSizeInput(value);
      setBoardSizeError('Zəhmət olmasa yalnız rəqəm daxil edin');
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setBoardSizeInput(numValue);

      if (numValue < 4) {
        setBoardSizeError('Minimum ölçü 4 sm-dir');
      } else if (numValue > 16) {
        setBoardSizeError('Maksimum ölçü 16 sm-dir');
      } else {
        setBoardSizeError('');
        setBoardSize(numValue);
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-200">Board Size</label>

      <div className="flex gap-2">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetClick(preset.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              selectedPreset === preset.value
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        <label className="text-xs text-gray-400">Custom Size</label>
        <Input
          value={boardSizeInput}
          onChange={handleCustomInputChange}
          placeholder="Ölçü daxil edin (4-16 sm)"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.target.blur();
            }
          }}
        />
        {boardSizeError && (
          <p className="text-xs text-red-400">{boardSizeError}</p>
        )}
      </div>
    </div>
  );
};

export default BoardSizeControl;
