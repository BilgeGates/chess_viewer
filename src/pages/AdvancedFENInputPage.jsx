import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Check,
  AlertCircle,
  List,
  Eye,
  Heart,
  Copy,
  FlipVertical2
} from 'lucide-react';

import {
  ExportProgress,
  BoardSizeControl,
  ExportSettings,
  ExportSettingsModal,
  DisplayOptions
} from '@/components/features';
import { PieceSelector } from '@/components/features/fen';
import { ThemeSelector } from '@/components/features/theme';
import { useChessBoard, usePieceImages, useTheme } from '@/hooks';
import { validateFEN, logger } from '@/utils';
import { ADVANCED_FEN_CONFIG } from '@/constants/chessConstants';

const {
  MAX_FENS,
  DEFAULT_FENS,
  DEFAULT_INTERVAL,
  INTERVAL_OPTIONS,
  TABS,
  STORAGE_KEYS
} = ADVANCED_FEN_CONFIG;

/**
 * Full-page Advanced FEN Editor
 * Replaces AdvancedFENInputModal with dedicated page experience
 */
const AdvancedFENInputPage = memo(
  ({
    pieceStyle: initialPieceStyle = 'cburnett',
    boardSize: initialBoardSize = 480,
    fileName: initialFileName = 'chess-board',
    exportQuality: initialExportQuality = 1.0,
    showCoords: initialShowCoords = true,
    showCoordinateBorder: initialShowCoordinateBorder = true,
    lightSquare: initialLightSquare = '#f0d9b5',
    darkSquare: initialDarkSquare = '#b58863'
  }) => {
    const navigate = useNavigate();
    const duplicateTimeoutRef = useRef(null);
    const pastedTimeoutRef = useRef(null);

    const [fens, setFens] = useState(() => {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : Array(10).fill(''); // Start with 10 positions
    });

    const [favorites, setFavorites] = useState(() => {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : {};
    });

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [interval, setIntervalTime] = useState(DEFAULT_INTERVAL);
    const [showIntervalMenu, setShowIntervalMenu] = useState(false);
    const [pastedIndex, setPastedIndex] = useState(null);
    const [fenErrors, setFenErrors] = useState({});
    const [duplicateWarning, setDuplicateWarning] = useState(null);
    const [activeTab, setActiveTab] = useState(TABS.POSITIONS);

    // Per-position settings storage
    const [positionSettings, setPositionSettings] = useState(() => {
      const saved = localStorage.getItem('advanced-fen-position-settings');
      return saved ? JSON.parse(saved) : {};
    });

    // Preview display options (per-position)
    const [isFlipped, setIsFlipped] = useState(false);
    const [showCoordinates, setShowCoordinates] = useState(true);

    // Control panel states (per-position)
    const [pieceStyle, setPieceStyle] = useState(initialPieceStyle);
    const [boardSize, setBoardSize] = useState(initialBoardSize);
    const [fileName, setFileName] = useState(initialFileName);
    const [exportQuality, setExportQuality] = useState(initialExportQuality);
    const [showCoordsLocal, setShowCoordsLocal] = useState(initialShowCoords);
    const [showCoordinateBorder, setShowCoordinateBorder] = useState(
      initialShowCoordinateBorder
    );
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    // Theme hook (per-position)
    const theme = useTheme({
      initialLight: initialLightSquare,
      initialDark: initialDarkSquare
    });

    // Export states
    const [exportProgress] = useState(0);
    const [currentFormat] = useState('');
    const [isPaused, setIsPaused] = useState(false);
    const [showProgress, setShowProgress] = useState(false);

    // Get valid FENs
    const validFens = fens.filter((f) => f.trim() && validateFEN(f));
    const hasValidFens = validFens.length > 0;

    // Ensure currentIndex is always valid
    const safeCurrentIndex = Math.min(
      currentIndex,
      Math.max(0, validFens.length - 1)
    );
    const currentFen = hasValidFens ? validFens[safeCurrentIndex] : '';

    // Initialize board
    const renderFen = currentFen || DEFAULT_FENS[0];
    const boardState = useChessBoard(renderFen);
    const { pieceImages, isLoading: imagesLoading } =
      usePieceImages(pieceStyle);

    const isBoardReady =
      Array.isArray(boardState) &&
      boardState.length === 8 &&
      !imagesLoading &&
      pieceImages &&
      Object.keys(pieceImages).length > 0;

    // Save to localStorage
    useEffect(() => {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(fens));
    }, [fens]);

    useEffect(() => {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }, [favorites]);

    // Save position settings to localStorage
    useEffect(() => {
      localStorage.setItem(
        'advanced-fen-position-settings',
        JSON.stringify(positionSettings)
      );
    }, [positionSettings]);

    // Load settings when position changes
    useEffect(() => {
      if (currentFen) {
        const settings = positionSettings[currentFen];
        if (settings) {
          // Load saved settings for this position
          setPieceStyle(settings.pieceStyle ?? initialPieceStyle);
          setBoardSize(settings.boardSize ?? initialBoardSize);
          setFileName(settings.fileName ?? initialFileName);
          setExportQuality(settings.exportQuality ?? initialExportQuality);
          setShowCoordsLocal(settings.showCoords ?? initialShowCoords);
          setShowCoordinateBorder(
            settings.showCoordinateBorder ?? initialShowCoordinateBorder
          );
          setIsFlipped(settings.isFlipped ?? false);
          setShowCoordinates(settings.showCoordinates ?? true);
          if (settings.lightSquare && settings.darkSquare) {
            theme.setLightSquare(settings.lightSquare);
            theme.setDarkSquare(settings.darkSquare);
          }
        } else {
          // Reset to defaults for new position
          setPieceStyle(initialPieceStyle);
          setBoardSize(initialBoardSize);
          setFileName(initialFileName);
          setExportQuality(initialExportQuality);
          setShowCoordsLocal(initialShowCoords);
          setShowCoordinateBorder(initialShowCoordinateBorder);
          setIsFlipped(false);
          setShowCoordinates(true);
          theme.setLightSquare(initialLightSquare);
          theme.setDarkSquare(initialDarkSquare);
        }
      }
    }, [currentFen, currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

    // Save current position settings when any setting changes
    useEffect(() => {
      if (currentFen) {
        setPositionSettings((prev) => ({
          ...prev,
          [currentFen]: {
            pieceStyle,
            boardSize,
            fileName,
            exportQuality,
            showCoords: showCoordsLocal,
            showCoordinateBorder,
            isFlipped,
            showCoordinates,
            lightSquare: theme.lightSquare,
            darkSquare: theme.darkSquare
          }
        }));
      }
    }, [
      currentFen,
      pieceStyle,
      boardSize,
      fileName,
      exportQuality,
      showCoordsLocal,
      showCoordinateBorder,
      isFlipped,
      showCoordinates,
      theme.lightSquare,
      theme.darkSquare
    ]);

    // Validate FENs
    useEffect(() => {
      const errors = {};
      fens.forEach((fen, index) => {
        if (fen.trim() && !validateFEN(fen)) {
          errors[index] = 'Invalid FEN notation';
        }
      });
      setFenErrors(errors);

      const validCount = fens.filter((f) => f.trim() && validateFEN(f)).length;
      if (currentIndex >= validCount && validCount > 0) {
        setCurrentIndex(0);
      }
    }, [fens, currentIndex]);

    // Auto-play slideshow
    useEffect(() => {
      let timer;
      if (isPlaying && validFens.length > 0) {
        timer = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % validFens.length);
        }, interval * 1000);
      }
      return () => clearInterval(timer);
    }, [isPlaying, interval, validFens.length]);

    // Cleanup timeouts
    useEffect(() => {
      return () => {
        if (duplicateTimeoutRef.current)
          clearTimeout(duplicateTimeoutRef.current);
        if (pastedTimeoutRef.current) clearTimeout(pastedTimeoutRef.current);
      };
    }, []);

    const handleBack = useCallback(() => {
      navigate(-1);
    }, [navigate]);

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
          pastedTimeoutRef.current = setTimeout(
            () => setPastedIndex(null),
            2000
          );
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

    const handlePrevious = useCallback(() => {
      if (validFens.length > 0) {
        setCurrentIndex(
          (prev) => (prev - 1 + validFens.length) % validFens.length
        );
      }
    }, [validFens.length]);

    const handleNext = useCallback(() => {
      if (validFens.length > 0) {
        setCurrentIndex((prev) => (prev + 1) % validFens.length);
      }
    }, [validFens.length]);

    const handleApply = () => {
      if (currentFen) {
        navigate('/', { state: { loadFEN: currentFen } });
      }
    };

    // Keyboard navigation
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          handleBack();
        } else if (e.key === 'ArrowLeft' && validFens.length > 0) {
          handlePrevious();
        } else if (e.key === 'ArrowRight' && validFens.length > 0) {
          handleNext();
        } else if (e.key === ' ' && validFens.length > 0) {
          e.preventDefault();
          setIsPlaying(!isPlaying);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleBack, handleNext, handlePrevious, validFens.length, isPlaying]);

    const tabs = [
      { id: TABS.POSITIONS, icon: List, label: 'Positions' },
      { id: 'preview-export', icon: Eye, label: 'Preview / Export' }
    ];

    return (
      <div className="h-screen flex flex-col bg-bg overflow-hidden">
        {/* Header - Prominent Back Button */}
        <header className="flex-shrink-0 bg-surface border-b border-border">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-hover rounded-xl transition-colors group"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-accent group-hover:text-accent-hover transition-colors" />
                  <span className="text-sm font-semibold text-text-secondary group-hover:text-text-primary">
                    Back
                  </span>
                </button>
                <div className="h-8 w-px bg-border" />
                <h1 className="text-2xl font-display font-bold text-text-primary">
                  Advanced FEN Editor
                </h1>
                <span className="px-3 py-1 bg-surface-elevated text-text-secondary text-sm font-semibold rounded-full">
                  {validFens.length}/{fens.length}
                </span>
              </div>

              {hasValidFens && (
                <button
                  onClick={handleApply}
                  className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-bg rounded-xl font-semibold transition-all shadow-glow-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply Current</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex-shrink-0 bg-surface-elevated border-b border-border">
          <div className="px-6">
            <div className="flex gap-1">
              {tabs.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-6 py-3 flex items-center gap-2 text-sm font-semibold transition-colors border-b-2 ${
                    activeTab === id
                      ? 'text-accent border-accent'
                      : 'text-text-secondary hover:text-text-primary border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-8">
            {activeTab === TABS.POSITIONS && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-text-secondary text-sm">
                    Add up to {MAX_FENS} FEN positions
                  </p>
                  <button
                    onClick={addFenInput}
                    disabled={fens.length >= MAX_FENS}
                    className="px-4 py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-bg rounded-lg font-semibold transition-colors flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Position
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {fens.map((fen, idx) => (
                    <div
                      key={fen || `empty-pos-${Date.now()}-${idx}`}
                      className="bg-surface border border-border rounded-xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-text-secondary">
                          Position {idx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          {fen && validateFEN(fen) && (
                            <button
                              onClick={() => toggleFavorite(fen)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                favorites[fen]
                                  ? 'bg-red-500/20 text-red-500'
                                  : 'text-text-muted hover:text-red-500 hover:bg-red-500/10'
                              }`}
                              aria-label="Toggle favorite"
                            >
                              <Heart
                                className="w-4 h-4"
                                fill={favorites[fen] ? 'currentColor' : 'none'}
                              />
                            </button>
                          )}
                          <button
                            onClick={() => handlePasteFEN(idx)}
                            className="p-1.5 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                            aria-label="Paste FEN"
                          >
                            {pastedIndex === idx ? (
                              <Check className="w-4 h-4 text-success" />
                            ) : (
                              <Clipboard className="w-4 h-4" />
                            )}
                          </button>
                          {fens.length > 1 && (
                            <button
                              onClick={() => removeFenInput(idx)}
                              className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                              aria-label="Remove position"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <input
                        type="text"
                        value={fen}
                        onChange={(e) => updateFen(idx, e.target.value)}
                        placeholder="FEN notation"
                        className={`w-full px-3 py-2 bg-surface-elevated border rounded-lg font-mono text-sm transition-colors ${
                          fenErrors[idx]
                            ? 'border-error focus:ring-error'
                            : duplicateWarning === idx
                              ? 'border-warning focus:ring-warning'
                              : 'border-border focus:border-accent focus:ring-accent'
                        } focus:ring-2 focus:outline-none`}
                      />

                      {fenErrors[idx] && (
                        <div className="flex items-center gap-2 text-error text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{fenErrors[idx]}</span>
                        </div>
                      )}
                      {duplicateWarning === idx && (
                        <div className="flex items-center gap-2 text-warning text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>Duplicate FEN detected</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'preview-export' ||
              activeTab === TABS.PREVIEW ||
              activeTab === TABS.EXPORT) && (
              <div className="space-y-6">
                {!hasValidFens ? (
                  <div className="bg-surface border border-border rounded-2xl p-12 text-center">
                    <Eye className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <p className="text-text-secondary">
                      No valid positions to preview
                    </p>
                    <p className="text-text-muted text-sm mt-2">
                      Add valid FEN positions in the Positions tab
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Preview Controls */}
                    <div className="bg-surface border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="p-2 bg-accent hover:bg-accent-hover text-bg rounded-lg transition-colors"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                          >
                            {isPlaying ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5" />
                            )}
                          </button>

                          <div className="relative">
                            <button
                              onClick={() =>
                                setShowIntervalMenu(!showIntervalMenu)
                              }
                              className="px-3 py-2 bg-surface-elevated hover:bg-surface-hover text-text-primary rounded-lg text-sm font-semibold transition-colors"
                            >
                              {interval}s
                            </button>
                            {showIntervalMenu && (
                              <div className="absolute top-full mt-2 bg-surface border border-border rounded-lg shadow-lg overflow-hidden z-10">
                                {INTERVAL_OPTIONS.map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() => {
                                      setIntervalTime(opt);
                                      setShowIntervalMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-surface-hover text-sm transition-colors"
                                  >
                                    {opt}s
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handlePrevious}
                            className="p-2 bg-surface-elevated hover:bg-surface-hover rounded-lg transition-colors"
                            aria-label="Previous"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <span className="px-3 py-1 bg-surface-elevated rounded-lg text-sm font-mono">
                            {safeCurrentIndex + 1} / {validFens.length}
                          </span>
                          <button
                            onClick={handleNext}
                            className="p-2 bg-surface-elevated hover:bg-surface-hover rounded-lg transition-colors"
                            aria-label="Next"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Board and FEN/Export Combined + Control Panel */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr,0.5fr] gap-6">
                      {/* Left - Board + Preview Actions in Same Height Container */}
                      <div className="bg-surface border border-border rounded-xl p-6">
                        <div className="grid grid-cols-[auto,300px] gap-6 h-full">
                          {/* Board with Coordinates */}
                          <div className="w-full max-w-md flex flex-col">
                            {isBoardReady && boardState && pieceImages && (
                              <div className="space-y-2 flex-1 flex flex-col">
                                <div className="flex flex-1">
                                  {showCoordinates && (
                                    <div className="w-6 flex flex-col justify-around text-xs text-text-muted font-semibold">
                                      {(isFlipped
                                        ? [
                                            '1',
                                            '2',
                                            '3',
                                            '4',
                                            '5',
                                            '6',
                                            '7',
                                            '8'
                                          ]
                                        : [
                                            '8',
                                            '7',
                                            '6',
                                            '5',
                                            '4',
                                            '3',
                                            '2',
                                            '1'
                                          ]
                                      ).map((rank) => (
                                        <div
                                          key={rank}
                                          className="h-[12.5%] flex items-center justify-center"
                                        >
                                          {rank}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <div className="aspect-square bg-surface-elevated shadow-lg">
                                      <div className="grid grid-cols-8 gap-0 w-full h-full">
                                        {(isFlipped
                                          ? [...boardState].reverse()
                                          : boardState
                                        ).map((row, rowIdx) =>
                                          (isFlipped
                                            ? [...row].reverse()
                                            : row
                                          ).map((piece, colIdx) => {
                                            const actualRowIdx = isFlipped
                                              ? 7 - rowIdx
                                              : rowIdx;
                                            const actualColIdx = isFlipped
                                              ? 7 - colIdx
                                              : colIdx;
                                            const isLight =
                                              (actualRowIdx + actualColIdx) %
                                                2 ===
                                              0;
                                            const color =
                                              piece === piece.toUpperCase()
                                                ? 'w'
                                                : 'b';
                                            const pieceKey = piece
                                              ? color + piece.toUpperCase()
                                              : null;

                                            return (
                                              <div
                                                key={`square-${actualRowIdx * 8 + actualColIdx}`}
                                                className="relative w-full h-full flex items-center justify-center"
                                                style={{
                                                  backgroundColor: isLight
                                                    ? theme.lightSquare
                                                    : theme.darkSquare,
                                                  aspectRatio: '1/1'
                                                }}
                                              >
                                                {pieceKey &&
                                                  pieceImages[pieceKey] && (
                                                    <img
                                                      src={
                                                        pieceImages[pieceKey]
                                                          .src
                                                      }
                                                      alt={piece}
                                                      className="w-[90%] h-[90%] object-contain"
                                                      draggable="false"
                                                    />
                                                  )}
                                              </div>
                                            );
                                          })
                                        )}
                                      </div>
                                    </div>
                                    {showCoordinates && (
                                      <div className="flex justify-around text-xs text-text-muted font-semibold mt-2">
                                        {(isFlipped
                                          ? [
                                              'h',
                                              'g',
                                              'f',
                                              'e',
                                              'd',
                                              'c',
                                              'b',
                                              'a'
                                            ]
                                          : [
                                              'a',
                                              'b',
                                              'c',
                                              'd',
                                              'e',
                                              'f',
                                              'g',
                                              'h'
                                            ]
                                        ).map((file) => (
                                          <div
                                            key={file}
                                            className="w-[12.5%] text-center"
                                          >
                                            {file}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Preview Actions Panel - Same Height as Board */}
                          <div className="flex flex-col justify-between space-y-3">
                            {/* Position FEN */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-text-primary">
                                  Position FEN
                                </h4>
                                <button
                                  onClick={() => {
                                    const newFavorites = { ...favorites };
                                    if (newFavorites[currentFen]) {
                                      delete newFavorites[currentFen];
                                    } else {
                                      newFavorites[currentFen] = true;
                                    }
                                    setFavorites(newFavorites);
                                  }}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    favorites[currentFen]
                                      ? 'text-red-500 hover:text-red-600'
                                      : 'text-text-muted hover:text-red-500'
                                  }`}
                                  aria-label="Toggle favorite"
                                >
                                  <Heart
                                    className="w-4 h-4"
                                    fill={
                                      favorites[currentFen]
                                        ? 'currentColor'
                                        : 'none'
                                    }
                                  />
                                </button>
                              </div>
                              <div className="bg-surface-elevated border border-border rounded-lg p-2.5">
                                <p className="font-mono text-xs text-text-secondary break-all leading-relaxed">
                                  {currentFen}
                                </p>
                              </div>
                            </div>

                            {/* Export Actions */}
                            <div className="flex-1 flex flex-col justify-center space-y-2">
                              <h4 className="text-sm font-semibold text-text-primary">
                                Quick Actions
                              </h4>

                              <button
                                onClick={() => setIsFlipped(!isFlipped)}
                                className="w-full px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
                              >
                                <FlipVertical2 className="w-4 h-4" />
                                Flip Board
                              </button>

                              <button
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(
                                      currentFen
                                    );
                                  } catch (err) {
                                    logger.error('Copy failed:', err);
                                  }
                                }}
                                className="w-full px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
                              >
                                <Copy className="w-4 h-4" />
                                Copy FEN
                              </button>

                              <div className="border-t border-border my-2" />

                              <h4 className="text-xs font-semibold text-text-primary">
                                Single Export
                              </h4>

                              <button className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-sm">
                                Export PNG
                              </button>

                              <button className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm">
                                Export JPEG
                              </button>

                              <div className="border-t border-border my-2" />

                              <h4 className="text-xs font-semibold text-text-primary">
                                Batch Export ({validFens.length})
                              </h4>

                              <button className="w-full px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium transition-colors text-sm">
                                Batch PNG
                              </button>

                              <button className="w-full px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors text-sm">
                                Batch JPEG
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right - Expanded Control Panel */}
                      <div className="space-y-3">
                        {/* Control Panel */}
                        <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
                          <h4 className="text-sm font-semibold text-text-primary border-b border-border pb-2">
                            Configure Export
                          </h4>

                          <PieceSelector
                            pieceStyle={pieceStyle}
                            setPieceStyle={setPieceStyle}
                          />

                          <DisplayOptions
                            showCoords={showCoordsLocal}
                            setShowCoords={setShowCoordsLocal}
                            showCoordinateBorder={showCoordinateBorder}
                            setShowCoordinateBorder={setShowCoordinateBorder}
                            exportQuality={exportQuality}
                          />

                          <div className="border-t border-border my-3" />

                          <BoardSizeControl
                            boardSize={boardSize}
                            setBoardSize={setBoardSize}
                          />

                          <div className="border-t border-border my-3" />

                          <ThemeSelector
                            lightSquare={theme.lightSquare}
                            darkSquare={theme.darkSquare}
                            onOpenModal={() => navigate('/settings')}
                          />

                          <ExportSettings
                            fileName={fileName}
                            exportQuality={exportQuality}
                            onOpenModal={() => setIsExportModalOpen(true)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Export Progress Overlay */}
        {showProgress && (
          <ExportProgress
            progress={exportProgress}
            total={validFens.length}
            currentFormat={currentFormat}
            isPaused={isPaused}
            onPause={() => setIsPaused(true)}
            onResume={() => setIsPaused(false)}
            onCancel={() => {
              setShowProgress(false);
            }}
          />
        )}

        {/* Export Settings Modal */}
        {isExportModalOpen && (
          <ExportSettingsModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            fileName={fileName}
            setFileName={setFileName}
            exportQuality={exportQuality}
            setExportQuality={setExportQuality}
          />
        )}
      </div>
    );
  }
);

AdvancedFENInputPage.displayName = 'AdvancedFENInputPage';

export default AdvancedFENInputPage;
