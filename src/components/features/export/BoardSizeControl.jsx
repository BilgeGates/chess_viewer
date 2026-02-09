import { useState, useEffect, useMemo } from 'react';

import { Input } from '@/components/ui';

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

      <div className="grid grid-cols-4 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetClick(preset.value)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              selectedPreset === preset.value
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {preset.label}
          </button>
        ))}
        <div className="relative">
          <Input
            value={boardSizeInput}
            onChange={handleCustomInputChange}
            placeholder="Custom"
            className="text-sm py-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.target.blur();
              }
            }}
          />
        </div>
      </div>
      {boardSizeError && (
        <p className="text-xs text-red-400">{boardSizeError}</p>
      )}
    </div>
  );
};

export default BoardSizeControl;
