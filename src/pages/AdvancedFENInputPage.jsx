import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ExportProgress,
  BoardSizeControl,
  ExportSettings,
  ExportOptionsDialog,
  DisplayOptions
} from '@/components/features';
import { PieceSelector } from '@/components/features/Fen';
import { ThemeSelector } from '@/components/features/Theme';
import { ADVANCED_FEN_CONFIG } from '@/constants';
import { useFENBatch } from '@/contexts';
import { useChessBoard, usePieceImages, useTheme } from '@/hooks';
import { validateFEN, logger } from '@/utils';
import {
  ArrowLeft,
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
  FlipVertical2,
  Save
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
    showThinFrame: initialShowThinFrame = false,
    lightSquare: initialLightSquare = '#f0d9b5',
    darkSquare: initialDarkSquare = '#b58863'
  }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { batchList, removeFromBatch, updateBatchItem } = useFENBatch();
    const duplicateTimeoutRef = useRef(null);
    const pastedTimeoutRef = useRef(null);
    const addedFenRef = useRef(false);

    // Use context batchList as source of truth, fill with empty slots if needed
    const fens = useMemo(() => {
      const arr = [...batchList];
      while (arr.length < 3) {
        arr.push(''); // Ensure minimum 3 slots
      }
      return arr;
    }, [batchList]);
    const setFens = () => {}; // Deprecated - using context now

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
    const [showThinFrame, setShowThinFrame] = useState(initialShowThinFrame);
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

    // Get valid FENs and filled slots count
    const validFens = fens.filter((f) => f.trim() && validateFEN(f));
    const hasValidFens = validFens.length > 0;
    const filledSlots = fens.filter((f) => f.trim()).length;

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

    // Note: fens are now saved automatically by FENBatchContext

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
          setPieceStyle(settings.pieceStyle ?? initialPieceStyle);
          setBoardSize(settings.boardSize ?? initialBoardSize);
          setFileName(settings.fileName ?? initialFileName);
          setExportQuality(settings.exportQuality ?? initialExportQuality);
          setShowCoordsLocal(settings.showCoords ?? initialShowCoords);
          setShowCoordinateBorder(
            settings.showCoordinateBorder ?? initialShowCoordinateBorder
          );
          setShowThinFrame(settings.showThinFrame ?? initialShowThinFrame);
          setIsFlipped(settings.isFlipped ?? false);
          setShowCoordinates(settings.showCoordinates ?? true);
          if (settings.lightSquare && settings.darkSquare) {
            theme.setLightSquare(settings.lightSquare);
            theme.setDarkSquare(settings.darkSquare);
          }
        } else {
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
            showThinFrame,
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
      showThinFrame,
      isFlipped,
      showCoordinates,
      theme.lightSquare,
      theme.darkSquare
    ]);

    useEffect(() => {
      const errors = {};
      const filledFens = [];

      fens.forEach((fen, index) => {
        const trimmedFen = fen.trim();
        if (trimmedFen) {
          if (!validateFEN(trimmedFen)) {
            errors[index] = 'Invalid FEN notation';
          } else {
            filledFens.push(trimmedFen);
          }
        }
      });

      setFenErrors(errors);

      // Auto-expand logic removed - context manages batch list
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

    // Handle incoming FEN from navigation state (Add to Batch)
    useEffect(() => {
      if (location.state?.addFen && !addedFenRef.current) {
        const fenToAdd = location.state.addFen;

        // Check if FEN already exists
        if (!fens.some((f) => f.trim() === fenToAdd)) {
          // Find first empty slot or add to end
          const emptyIndex = fens.findIndex((f) => !f.trim());

          if (emptyIndex !== -1) {
            // Fill empty slot
            const newFens = [...fens];
            newFens[emptyIndex] = fenToAdd;
            setFens(newFens);
            setPastedIndex(emptyIndex);
          } else if (fens.length < MAX_FENS) {
            // Add to end
            setFens([...fens, fenToAdd]);
            setPastedIndex(fens.length);
          }

          // Clear the pasted indicator after 2 seconds
          if (pastedTimeoutRef.current) clearTimeout(pastedTimeoutRef.current);
          pastedTimeoutRef.current = setTimeout(
            () => setPastedIndex(null),
            2000
          );
        }

        addedFenRef.current = true;

        // Clear the state to prevent re-adding on re-render
        window.history.replaceState({}, document.title);
      }
    }, [location.state, fens]);

    const handleBack = useCallback(() => {
      // Ensure all settings are saved before closing
      try {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
        localStorage.setItem(
          'advanced-fen-position-settings',
          JSON.stringify(positionSettings)
        );
      } catch (err) {
        logger.warn('Failed to save settings:', err);
      }
      navigate(-1);
    }, [navigate, favorites, positionSettings]);

    const removeFenInput = (index) => {
      // Only remove if index is within batch list
      if (index < batchList.length) {
        removeFromBatch(index);
        if (currentIndex >= batchList.length - 1) {
          setCurrentIndex(Math.max(0, batchList.length - 2));
        }
        // Remove from favorites if it exists
        const fenToRemove = batchList[index];
        if (fenToRemove) {
          const newFavorites = { ...favorites };
          delete newFavorites[fenToRemove];
          setFavorites(newFavorites);
        }
      }
    };

    const updateFen = (index, value) => {
      const trimmedValue = value.trim();

      // Check for duplicates
      if (
        trimmedValue &&
        batchList.some((f, i) => i !== index && f === trimmedValue)
      ) {
        setDuplicateWarning(index);
        if (duplicateTimeoutRef.current)
          clearTimeout(duplicateTimeoutRef.current);
        duplicateTimeoutRef.current = setTimeout(
          () => setDuplicateWarning(null),
          3000
        );
        return; // Don't update if duplicate
      }

      // If updating existing item in batch
      if (index < batchList.length && trimmedValue) {
        updateBatchItem(index, trimmedValue);
      }
      // If it's a new empty slot being filled, context handles this via addToBatch elsewhere
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
        <style>{`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(16px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes collapseWidth {
            from {
              grid-column: span 2;
              opacity: 1;
            }
            to {
              grid-column: span 1;
              opacity: 1;
            }
          }
          
          .input-enter {
            animation: slideInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          
          .layout-transition {
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          
          @keyframes pulseGlow {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
            }
            50% {
              box-shadow: 0 0 0 8px rgba(99, 102, 241, 0);
            }
          }
          
          .pulse-glow {
            animation: pulseGlow 2s ease-in-out;
          }
        `}</style>

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
                <span className="px-3 py-1 bg-surface-elevated text-accent text-sm font-semibold rounded-full">
                  {filledSlots} / {MAX_FENS}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {hasValidFens && (
                  <button
                    onClick={handleApply}
                    className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-bg rounded-xl font-semibold transition-all shadow-glow-sm flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply Current</span>
                  </button>
                )}
                <button
                  onClick={handleBack}
                  className="px-6 py-2.5 bg-warning hover:bg-warning/90 text-bg rounded-xl font-semibold transition-all shadow-glow-sm flex items-center gap-2"
                  aria-label="Save and close"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 transition-all duration-500 mt-1">
                  {fens.map((fen, idx) => {
                    const isLastOdd =
                      fens.length % 2 === 1 && idx === fens.length - 1;
                    return (
                      <div
                        key={fen ? `fen-${fen}` : `empty-${idx}`}
                        className={`bg-surface border border-border rounded-xl px-3 py-[0.5rem] space-y-2 layout-transition ${isLastOdd ? 'lg:col-span-2' : ''}`}
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
                                  fill={
                                    favorites[fen] ? 'currentColor' : 'none'
                                  }
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
                            {fens.length > 3 && idx >= 3 && (
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
                          } focus:ring-1 focus:outline-none`}
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
                    );
                  })}
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
                              <div className="inline-flex flex-col">
                                <div className="flex">
                                  {showCoordinates && (
                                    <div
                                      className="flex flex-col flex-shrink-0"
                                      style={{ width: 20 }}
                                    >
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
                                          className="flex items-center justify-center text-[12px] font-bold text-text-primary"
                                          style={{
                                            height: 'calc(min(52vh, 46vw) / 8)'
                                          }}
                                        >
                                          {rank}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <div
                                    className="grid grid-cols-8 grid-rows-8 overflow-hidden border border-border"
                                    style={{
                                      width: 'min(52vh, 46vw)',
                                      height: 'min(52vh, 46vw)',
                                      contain: 'strict'
                                    }}
                                  >
                                    {Array.from({ length: 64 }).map((_, i) => {
                                      const row = Math.floor(i / 8);
                                      const col = i % 8;

                                      const actualRowIdx = isFlipped
                                        ? 7 - row
                                        : row;
                                      const actualColIdx = isFlipped
                                        ? 7 - col
                                        : col;
                                      const isLight = (row + col) % 2 === 0;
                                      const piece =
                                        boardState[actualRowIdx]?.[
                                          actualColIdx
                                        ] || '';

                                      const color =
                                        piece === piece.toUpperCase()
                                          ? 'w'
                                          : 'b';
                                      const pieceKey = piece
                                        ? color + piece.toUpperCase()
                                        : null;

                                      return (
                                        <div
                                          key={`sq-${row}-${col}`}
                                          className="relative flex items-center justify-center"
                                          style={{
                                            backgroundColor: isLight
                                              ? theme.lightSquare
                                              : theme.darkSquare,
                                            outline: '1px solid transparent',
                                            minWidth: 0,
                                            minHeight: 0
                                          }}
                                        >
                                          {pieceKey &&
                                            pieceImages[pieceKey] && (
                                              <img
                                                src={pieceImages[pieceKey].src}
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
                                {showCoordinates && (
                                  <div
                                    className="flex"
                                    style={{ paddingLeft: 20 }}
                                  >
                                    {(isFlipped
                                      ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
                                      : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
                                    ).map((file) => (
                                      <div
                                        key={file}
                                        className="text-[12px] font-bold text-text-primary text-center mt-1"
                                        style={{
                                          width: 'calc(min(52vh, 46vw) / 8)'
                                        }}
                                      >
                                        {file}
                                      </div>
                                    ))}
                                  </div>
                                )}
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
                            showThinFrame={showThinFrame}
                            setShowThinFrame={setShowThinFrame}
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

        {/* Export Options Dialog */}
        {isExportModalOpen && (
          <ExportOptionsDialog
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
