import { useState, useEffect, useRef } from 'react';
import { ExportProgress } from '../../UI';
import { useChessBoard, usePieceImages } from '../../../hooks';
import { downloadPNG, downloadJPEG, validateFEN, logger } from '../../../utils';
import { ADVANCED_FEN_CONFIG } from '../../../constants/chessConstants';
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
  Star,
  List,
  Eye,
  Download
} from 'lucide-react';

const {
  MAX_FENS,
  DEFAULT_FENS,
  DEFAULT_INTERVAL,
  INTERVAL_OPTIONS,
  TABS,
  STORAGE_KEYS
} = ADVANCED_FEN_CONFIG;

/**
 * AdvancedFENInputModal - Multi-position FEN management modal
 * FIXED: Modal properly centered with internal scroll only
 */
const AdvancedFENInputModal = ({
  isOpen,
  onClose,
  onApplyFEN,
  pieceStyle = 'cburnett',
  lightSquare = '#F0D9B5',
  darkSquare = '#B58863',
  showCoords = true,
  exportQuality = 16
}) => {
  const duplicateTimeoutRef = useRef(null);
  const pastedTimeoutRef = useRef(null);
  const slideTimeoutRef = useRef(null);
  const exportCleanupTimeoutRef = useRef(null);

  const [fens, setFens] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : DEFAULT_FENS;
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : {};
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
  const [interval, setIntervalTime] = useState(DEFAULT_INTERVAL);
  const [showIntervalMenu, setShowIntervalMenu] = useState(false);
  const [pastedIndex, setPastedIndex] = useState(null);
  const [fenErrors, setFenErrors] = useState({});
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.POSITIONS);

  // Export states
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentFormat, setCurrentFormat] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  // Get valid FENs - memoize to prevent recalculation
  const validFens = fens.filter((f) => f.trim() && validateFEN(f));
  const hasValidFens = validFens.length > 0;

  // Ensure currentIndex is always valid
  const safeCurrentIndex = Math.min(
    currentIndex,
    Math.max(0, validFens.length - 1)
  );
  const currentFen = hasValidFens ? validFens[safeCurrentIndex] : '';

  // Initialize board and pieces with current FEN
  // Ensure we always have a valid FEN for rendering
  const renderFen = currentFen || DEFAULT_FENS[0];
  const boardState = useChessBoard(renderFen);
  const { pieceImages, isLoading: imagesLoading } = usePieceImages(pieceStyle);

  // Check if board is ready for rendering
  const isBoardReady =
    Array.isArray(boardState) &&
    boardState.length === 8 &&
    boardState[0]?.length === 8 &&
    !imagesLoading &&
    pieceImages &&
    Object.keys(pieceImages).length > 0;

  // Board theme colors - use props directly
  const currentTheme = { light: lightSquare, dark: darkSquare };

  // Save FENs to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(fens));
  }, [fens]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  // Validate FENs and ensure currentIndex is valid
  useEffect(() => {
    const errors = {};
    fens.forEach((fen, index) => {
      if (fen.trim() && !validateFEN(fen)) {
        errors[index] = 'Invalid FEN notation';
      }
    });
    setFenErrors(errors);

    // Reset currentIndex if it's out of bounds
    const validCount = fens.filter((f) => f.trim() && validateFEN(f)).length;
    if (currentIndex >= validCount && validCount > 0) {
      setCurrentIndex(0);
    }
  }, [fens, currentIndex]);

  // Auto-play slideshow
  useEffect(() => {
    let timer;
    if (isPlaying && isOpen && validFens.length > 0) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % validFens.length);
      }, interval * 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, interval, validFens.length, isOpen]);

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
    if (validFens.length > 0) {
      setCurrentIndex(
        (prev) => (prev - 1 + validFens.length) % validFens.length
      );
    }
  };

  const handleNext = () => {
    if (validFens.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % validFens.length);
    }
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
          showCoords: showCoords,
          lightSquare: currentTheme.light,
          darkSquare: currentTheme.dark,
          flipped: false,
          fen: fen,
          pieceImages: pieceImages,
          exportQuality: exportQuality
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

  if (!isOpen) return null;

  /**
   * Tab configuration for compact UI
   */
  const tabConfig = [
    {
      id: TABS.POSITIONS,
      label: 'Positions',
      icon: List,
      count: fens.filter((f) => f.trim()).length
    },
    { id: TABS.PREVIEW, label: 'Preview', icon: Eye, disabled: !hasValidFens },
    {
      id: TABS.EXPORT,
      label: 'Export',
      icon: Download,
      disabled: !hasValidFens
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in overflow-hidden">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in">
        {/* Compact Header with Tabs */}
        <div className="border-b border-gray-700 bg-gray-900/50 flex-shrink-0">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-lg font-bold text-white">Multi-Position FEN</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex px-4 gap-1" role="tablist">
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-white border-t border-x border-gray-700'
                    : tab.disabled
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-600 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content - WITH SCROLL */}
        <div className="flex-1 overflow-y-auto p-4" role="tabpanel">
          {/* POSITIONS TAB */}
          {activeTab === TABS.POSITIONS && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {fens.length}/{MAX_FENS} slots
                </span>
                <button
                  onClick={addFenInput}
                  disabled={fens.length >= MAX_FENS}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2 text-white text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <div className="space-y-2">
                {fens.map((fen, index) => (
                  <div key={fen || `empty-slot-${index}`} className="space-y-1">
                    <div className="flex items-center gap-2 group">
                      <div className="flex-shrink-0 w-7 h-7 bg-gray-800 rounded-md flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-700">
                        {index + 1}
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={fen}
                          onChange={(e) => updateFen(index, e.target.value)}
                          placeholder="Enter FEN notation..."
                          className={`w-full px-3 py-2 pr-20 bg-gray-800/50 border rounded-lg text-sm text-white font-mono outline-none focus:border-blue-500 transition-colors ${
                            fenErrors[index]
                              ? 'border-red-500'
                              : 'border-gray-700'
                          }`}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <button
                            onClick={() => toggleFavorite(fen)}
                            disabled={!fen.trim() || !validateFEN(fen)}
                            className={`p-1 rounded transition-all ${
                              favorites[fen]
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                            title="Favorite"
                          >
                            <Star
                              className="w-3.5 h-3.5"
                              fill={favorites[fen] ? 'currentColor' : 'none'}
                            />
                          </button>
                          <button
                            onClick={() => handlePasteFEN(index)}
                            className={`p-1 rounded transition-all ${
                              pastedIndex === index
                                ? 'bg-green-600'
                                : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                            title="Paste"
                          >
                            {pastedIndex === index ? (
                              <Check className="w-3.5 h-3.5 text-white" />
                            ) : (
                              <Clipboard className="w-3.5 h-3.5 text-gray-300" />
                            )}
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFenInput(index)}
                        disabled={fens.length === 1}
                        className="p-1.5 hover:bg-red-600/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                    {fenErrors[index] && (
                      <div className="flex items-center gap-1.5 text-red-400 text-xs ml-9">
                        <AlertCircle className="w-3 h-3" />
                        <span>{fenErrors[index]}</span>
                      </div>
                    )}
                    {duplicateWarning === index && (
                      <div className="flex items-center gap-1.5 text-yellow-400 text-xs ml-9">
                        <AlertCircle className="w-3 h-3" />
                        <span>Duplicate FEN</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PREVIEW TAB */}
          {activeTab === TABS.PREVIEW && hasValidFens && (
            <div className="space-y-4">
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                  <span className="text-sm text-gray-400">Position</span>
                  <span className="text-base font-bold text-white">
                    {safeCurrentIndex + 1}
                  </span>
                  <span className="text-sm text-gray-400">
                    of {validFens.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowIntervalMenu(!showIntervalMenu)}
                      className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-2.5 py-1.5 border border-gray-700 hover:bg-gray-700 transition-colors text-sm"
                    >
                      <span className="text-gray-400">{interval}s</span>
                    </button>
                    {showIntervalMenu && (
                      <div className="absolute top-full right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden">
                        {INTERVAL_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setIntervalTime(opt.value);
                              setShowIntervalMenu(false);
                            }}
                            className={`w-full px-4 py-1.5 text-sm text-left transition-colors ${
                              interval === opt.value
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            {opt.label}
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
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Board Preview */}
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
                <div className="mx-auto aspect-square max-w-sm">
                  {isBoardReady ? (
                    <div className="grid grid-cols-8 gap-0 overflow-hidden shadow-2xl border-2 border-gray-800">
                      {Array.from({ length: 64 }).map((_, i) => {
                        const row = Math.floor(i / 8);
                        const col = i % 8;
                        const isLight = (row + col) % 2 === 0;
                        const piece = boardState[row]?.[col] || '';

                        // Convert FEN piece notation to image key (e.g., 'K' -> 'wK', 'k' -> 'bK')
                        let pieceKey = '';
                        if (piece) {
                          const color =
                            piece === piece.toUpperCase() ? 'w' : 'b';
                          pieceKey = color + piece.toUpperCase();
                        }

                        const pieceImage = pieceKey
                          ? pieceImages[pieceKey]
                          : null;

                        return (
                          <div
                            key={`sq-${row}-${col}`}
                            className="aspect-square flex items-center justify-center transition-colors duration-200"
                            style={{
                              backgroundColor: isLight
                                ? lightSquare
                                : darkSquare
                            }}
                          >
                            {pieceImage && (
                              <img
                                src={pieceImage.src}
                                alt={piece}
                                className="w-[85%] h-[85%] object-contain pointer-events-none"
                                draggable="false"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg border-2 border-gray-700">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500 mx-auto mb-3"></div>
                        <p className="text-sm text-gray-400">
                          Loading board...
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* FEN display */}
                <div className="mt-3 text-center">
                  <div className="inline-flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-700">
                    {favorites[currentFen] && (
                      <Star
                        className="w-3.5 h-3.5 text-yellow-400"
                        fill="currentColor"
                      />
                    )}
                    <p className="text-xs font-mono text-gray-400 break-all max-w-md">
                      {currentFen}
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button
                    onClick={handlePrevious}
                    disabled={validFens.length < 2}
                    className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800/50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <div className="flex gap-1.5">
                    {validFens.map((fenVal, idx) => (
                      <button
                        key={fenVal}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all ${idx === safeCurrentIndex ? 'bg-blue-500 w-6' : 'bg-gray-600 hover:bg-gray-500 w-2'}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleNext}
                    disabled={validFens.length < 2}
                    className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800/50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EXPORT TAB */}
          {activeTab === TABS.EXPORT && hasValidFens && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg px-4 py-2 mb-2">
                  <Download className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-semibold text-gray-200">
                    Batch Export Ready
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Export all {validFens.length} valid position
                  {validFens.length > 1 ? 's' : ''} as high-quality images
                </p>
              </div>

              {/* Export Format Options */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Select Format
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleBatchExport('png')}
                    disabled={isExporting}
                    className="group relative overflow-hidden px-5 py-4 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/50 active:scale-95"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Download className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Export PNG</span>
                      <span className="text-xs text-blue-200 font-normal">
                        Lossless quality
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleBatchExport('jpeg')}
                    disabled={isExporting}
                    className="group relative overflow-hidden px-5 py-4 bg-gradient-to-br from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-amber-500/50 active:scale-95"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Download className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Export JPEG</span>
                      <span className="text-xs text-amber-200 font-normal">
                        Smaller files
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="pt-4 border-t border-gray-700">
                <button
                  onClick={handleCopyAll}
                  className="w-full group px-5 py-4 bg-gradient-to-br from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/50 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Clipboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Copy All FEN Notations</span>
                </button>
              </div>

              {/* Info */}
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
                <p className="text-xs text-blue-300 text-center">
                  💡 Images will be saved with sequential filenames:
                  chess-position-1, chess-position-2, etc.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Compact Footer - NO SCROLL */}
        <div className="p-3 border-t border-gray-700 bg-gray-900/50 flex gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Close
          </button>
          <button
            onClick={() => {
              if (validFens.length > 0) {
                onApplyFEN(validFens[safeCurrentIndex]);
                onClose();
              }
            }}
            disabled={validFens.length === 0}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-sm"
          >
            Apply Current
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
