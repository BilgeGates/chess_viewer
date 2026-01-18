import { useState, useEffect, useRef } from 'react';
import { ExportProgress } from '../../UI';
import { useChessBoard, usePieceImages } from '../../../hooks';
import { downloadPNG, downloadJPEG, validateFEN } from '../../../utils';
import { logger } from '../../../utils/logger';
import {
  X,
  Plus,
  Trash2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Check,
  AlertCircle,
  Star
} from 'lucide-react';

const AdvancedFENInputModal = ({
  isOpen,
  onClose,
  onApplyFEN,
  pieceStyle = 'cburnett',
  boardTheme = 'brown',
  showCoords = true,
  exportQuality = 16
}) => {
  const MAX_FENS = 10;
  const DEFAULT_FENS = ['', '', ''];

  const duplicateTimeoutRef = useRef(null);
  const pastedTimeoutRef = useRef(null);
  const slideTimeoutRef = useRef(null);
  const exportCleanupTimeoutRef = useRef(null);

  const [fens, setFens] = useState(() => {
    const saved = localStorage.getItem('advancedFENHistory');
    return saved ? JSON.parse(saved) : DEFAULT_FENS;
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('advancedFENFavorites');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const dupTimeout = duplicateTimeoutRef.current;
    const pasteTimeout = pastedTimeoutRef.current;
    const slideTimeout = slideTimeoutRef.current;
    const exportTimeout = exportCleanupTimeoutRef.current;
    return () => {
      if (dupTimeout) clearTimeout(dupTimeout);
      if (pasteTimeout) clearTimeout(pasteTimeout);
      if (slideTimeout) clearTimeout(slideTimeout);
      if (exportTimeout) clearTimeout(exportTimeout);
    };
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [interval, setIntervalTime] = useState(3);
  const [showIntervalMenu, setShowIntervalMenu] = useState(false);
  const [pastedIndex, setPastedIndex] = useState(null);
  const [fenErrors, setFenErrors] = useState({});
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  // Export states
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentFormat, setCurrentFormat] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const validFens = fens.filter((f) => f.trim() && validateFEN(f));
  const currentFen = validFens[currentIndex] || '';
  const boardState = useChessBoard(currentFen);
  const { pieceImages, isLoading: imagesLoading } = usePieceImages(pieceStyle);
  const hasValidFens = validFens.length > 0;

  // Board theme colors
  const boardThemes = {
    brown: { light: '#F0D9B5', dark: '#B58863' },
    blue: { light: '#DEE3E6', dark: '#8CA2AD' },
    green: { light: '#FFFFDD', dark: '#86A666' },
    purple: { light: '#E8E0D6', dark: '#9F90B0' }
  };
  const currentTheme = boardThemes[boardTheme] || boardThemes.brown;

  // Save FENs to localStorage
  useEffect(() => {
    localStorage.setItem('advancedFENHistory', JSON.stringify(fens));
  }, [fens]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('advancedFENFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Validate FENs
  useEffect(() => {
    const errors = {};
    fens.forEach((fen, index) => {
      if (fen.trim() && !validateFEN(fen)) {
        errors[index] = 'Invalid FEN notation';
      }
    });
    setFenErrors(errors);
  }, [fens]);

  // Auto-play slideshow
  useEffect(() => {
    let timer;
    if (isPlaying && isOpen) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => {
          const validFens = fens.filter((f) => f.trim() && validateFEN(f));
          return (prev + 1) % validFens.length;
        });
      }, interval * 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, interval, fens, isOpen]);

  const addFenInput = () => {
    if (fens.length < MAX_FENS) {
      setFens([...fens, '']);
    }
  };

  const removeFenInput = (index) => {
    if (fens.length > 1) {
      const newFens = fens.filter((_, i) => i !== index);
      setFens(newFens);
      if (currentIndex >= newFens.length) {
        setCurrentIndex(Math.max(0, newFens.length - 1));
      }
      // Remove from favorites if exists
      const newFavorites = { ...favorites };
      delete newFavorites[fens[index]];
      setFavorites(newFavorites);
    }
  };

  const updateFen = (index, value) => {
    const trimmedValue = value.trim();
    if (
      trimmedValue &&
      fens.some((f, i) => i !== index && f.trim() === trimmedValue)
    ) {
      setDuplicateWarning(index);
      if (duplicateTimeoutRef.current)
        clearTimeout(duplicateTimeoutRef.current);
      duplicateTimeoutRef.current = setTimeout(
        () => setDuplicateWarning(null),
        3000
      );
    }
    const newFens = [...fens];
    newFens[index] = value;
    setFens(newFens);
  };

  const handlePasteFEN = async (index) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        updateFen(index, text.trim());
        setPastedIndex(index);
        if (pastedTimeoutRef.current) clearTimeout(pastedTimeoutRef.current);
        pastedTimeoutRef.current = setTimeout(() => setPastedIndex(null), 2000);
      }
    } catch (err) {
      logger.error('Failed to paste:', err);
    }
  };

  const toggleFavorite = (fen) => {
    if (!fen || !validateFEN(fen)) return;
    setFavorites((prev) => ({
      ...prev,
      [fen]: !prev[fen]
    }));
  };

  const handlePrevious = () => {
    const validFens = fens.filter((f) => f.trim() && validateFEN(f));
    setCurrentIndex((prev) => (prev - 1 + validFens.length) % validFens.length);
  };

  const handleNext = () => {
    const validFens = fens.filter((f) => f.trim() && validateFEN(f));
    setCurrentIndex((prev) => (prev + 1) % validFens.length);
  };

  const handleBatchExport = async (format) => {
    if (validFens.length === 0) return;

    setIsExporting(true);
    setExportProgress(0);
    setCurrentFormat(format);
    setIsPaused(false);
    setShowProgress(true);

    try {
      for (let i = 0; i < validFens.length; i++) {
        while (isPaused) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const fen = validFens[i];
        const fileName = `chess-position-${i + 1}`;

        const exportConfig = {
          boardSize: 800,
          showCoords: showCoords, // Use from parent
          lightSquare: currentTheme.light,
          darkSquare: currentTheme.dark,
          flipped: false,
          fen: fen,
          pieceImages: pieceImages,
          exportQuality: exportQuality // Use from parent
        };

        const onProgress = (p) => {
          const totalProgress =
            (i / validFens.length) * 100 + p / validFens.length;
          setExportProgress(Math.round(totalProgress));
        };

        if (format === 'png') {
          await downloadPNG(exportConfig, fileName, onProgress);
        } else if (format === 'jpeg') {
          await downloadJPEG(exportConfig, fileName, onProgress);
        }
      }

      setExportProgress(100);
      if (exportCleanupTimeoutRef.current)
        clearTimeout(exportCleanupTimeoutRef.current);
      exportCleanupTimeoutRef.current = setTimeout(() => {
        setIsExporting(false);
        setShowProgress(false);
        setExportProgress(0);
      }, 500);
    } catch (error) {
      logger.error('Batch export failed:', error);
      setIsExporting(false);
      setShowProgress(false);
      setExportProgress(0);
    }
  };

  const handleCopyAll = async () => {
    if (validFens.length === 0) return;
    try {
      await navigator.clipboard.writeText(validFens.join('\n'));
    } catch (error) {
      logger.error('Failed to copy:', error);
    }
  };

  const intervalOptions = [
    { value: 1, label: '1s' },
    { value: 2, label: '2s' },
    { value: 3, label: '3s' },
    { value: 5, label: '5s' },
    { value: 10, label: '10s' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-gray-700 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Advanced FEN Input
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Manage multiple board positions ({validFens.length} active)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* FEN Inputs Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                FEN Positions
              </h3>
              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-400">
                  {fens.length} / {MAX_FENS} slots
                </div>
                <button
                  onClick={addFenInput}
                  disabled={fens.length >= MAX_FENS}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2 text-white text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {fens.map((fen, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2 group">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-sm font-bold text-gray-400 border border-gray-700">
                      {index + 1}
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={fen}
                        onChange={(e) => updateFen(index, e.target.value)}
                        placeholder="Enter FEN notation..."
                        className={`w-full px-4 py-2.5 pr-24 bg-gray-800/50 border rounded-lg text-sm text-white font-mono outline-none focus:border-blue-500 transition-colors ${
                          fenErrors[index]
                            ? 'border-red-500'
                            : 'border-gray-700'
                        }`}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <button
                          onClick={() => toggleFavorite(fen)}
                          disabled={!fen.trim() || !validateFEN(fen)}
                          className={`p-1.5 rounded-md transition-all ${
                            favorites[fen]
                              ? 'bg-yellow-600 text-white'
                              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          } disabled:opacity-30 disabled:cursor-not-allowed`}
                          title="Toggle favorite"
                        >
                          <Star
                            className="w-4 h-4"
                            fill={favorites[fen] ? 'currentColor' : 'none'}
                          />
                        </button>
                        <button
                          onClick={() => handlePasteFEN(index)}
                          className={`p-1.5 rounded-md transition-all ${
                            pastedIndex === index
                              ? 'bg-green-600'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                          title="Paste FEN"
                        >
                          {pastedIndex === index ? (
                            <Check className="w-4 h-4 text-white" />
                          ) : (
                            <Clipboard className="w-4 h-4 text-gray-300" />
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFenInput(index)}
                      disabled={fens.length === 1}
                      className="p-2 hover:bg-red-600/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                  {fenErrors[index] && (
                    <div className="flex items-center gap-2 text-red-400 text-xs ml-10">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{fenErrors[index]}</span>
                    </div>
                  )}
                  {duplicateWarning === index && (
                    <div className="flex items-center gap-2 text-yellow-400 text-xs ml-10">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>This FEN already exists in another position</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          {hasValidFens && (
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Live Preview
                </h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setShowIntervalMenu(!showIntervalMenu)}
                      className="flex items-center gap-2 bg-gray-900 rounded-lg px-3 py-2 border border-gray-700 hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-xs text-gray-400">Interval:</span>
                      <span className="text-sm font-semibold text-white">
                        {interval}s
                      </span>
                    </button>
                    {showIntervalMenu && (
                      <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden min-w-[100px]">
                        {intervalOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setIntervalTime(option.value);
                              setShowIntervalMenu(false);
                            }}
                            className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                              interval === option.value
                                ? 'bg-blue-600 text-white font-semibold'
                                : 'text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={validFens.length < 2}
                    className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>

              <div className="relative bg-gray-900 rounded-lg border border-gray-700 p-6">
                <div className="text-center mb-4">
                  <div className="inline-block bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                    <span className="text-sm text-gray-400">Position </span>
                    <span className="text-lg font-bold text-white">
                      {currentIndex + 1}
                    </span>
                    <span className="text-sm text-gray-400">
                      {' '}
                      of {validFens.length}
                    </span>
                  </div>
                </div>

                <div className="mx-auto aspect-square max-w-lg">
                  <div className="grid grid-cols-8 gap-0 overflow-hidden shadow-2xl">
                    {Array.from({ length: 64 }).map((_, i) => {
                      const row = Math.floor(i / 8);
                      const col = i % 8;
                      const isLight = (row + col) % 2 === 0;
                      const piece = boardState[row]?.[col] || '';
                      return (
                        <div
                          key={i}
                          className="aspect-square flex items-center justify-center relative"
                          style={{
                            backgroundColor: isLight
                              ? currentTheme.light
                              : currentTheme.dark
                          }}
                        >
                          {piece && pieceImages[piece] && !imagesLoading && (
                            <img
                              src={pieceImages[piece].src}
                              alt={piece}
                              className="w-[85%] h-[85%] object-contain"
                              draggable="false"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                    {favorites[currentFen] && (
                      <Star
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                      />
                    )}
                    <p className="text-xs font-mono text-gray-400 break-all max-w-xl">
                      {currentFen}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={handlePrevious}
                    disabled={validFens.length < 2}
                    className="p-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <div className="flex gap-2">
                    {validFens.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2.5 rounded-full transition-all ${
                          idx === currentIndex
                            ? 'bg-blue-500 w-8'
                            : 'bg-gray-600 hover:bg-gray-500 w-2.5'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleNext}
                    disabled={validFens.length < 2}
                    className="p-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Export Section */}
              <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Batch Export All Positions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleBatchExport('png')}
                    disabled={isExporting}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                  >
                    Export All as PNG
                  </button>
                  <button
                    onClick={() => handleBatchExport('jpeg')}
                    disabled={isExporting}
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                  >
                    Export All as JPEG
                  </button>
                  <button
                    onClick={handleCopyAll}
                    className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors col-span-2"
                  >
                    Copy All FENs
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gray-900/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              if (validFens.length > 0) {
                onApplyFEN(validFens[currentIndex]);
                onClose();
              }
            }}
            disabled={validFens.length === 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
          >
            Apply Current FEN
          </button>
        </div>
      </div>

      {/* Export Progress Modal */}
      {showProgress && (
        <ExportProgress
          isExporting={isExporting}
          progress={exportProgress}
          currentFormat={currentFormat}
          onPause={() => setIsPaused(true)}
          onResume={() => setIsPaused(false)}
          onCancel={() => {
            setIsExporting(false);
            setShowProgress(false);
          }}
          isPaused={isPaused}
        />
      )}
    </div>
  );
};

export default AdvancedFENInputModal;
