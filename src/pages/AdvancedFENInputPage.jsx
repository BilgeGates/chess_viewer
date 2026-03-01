import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ExportProgress, ExportOptionsDialog } from '@/components/features';
import { ControlPanel } from '@/components/features';
import { ADVANCED_FEN_CONFIG } from '@/constants';
import { useFENBatch } from '@/contexts';
import { useChessBoard, usePieceImages, useTheme } from '@/hooks';
import {
  validateFEN,
  logger,
  downloadPNG,
  downloadJPEG,
  batchExport
} from '@/utils';
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
    const { batchList, removeFromBatch, updateBatchItem, addToBatch } =
      useFENBatch();
    const duplicateTimeoutRef = useRef(null);
    const pastedTimeoutRef = useRef(null);
    const addedFenRef = useRef(false);

    const fens = useMemo(() => {
      const arr = [...batchList];
      while (arr.length < 3) arr.push('');
      return arr;
    }, [batchList]);

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

    const [positionSettings, setPositionSettings] = useState(() => {
      const saved = localStorage.getItem('advanced-fen-position-settings');
      return saved ? JSON.parse(saved) : {};
    });

    const [isFlipped, setIsFlipped] = useState(false);
    const [showCoordinates, setShowCoordinates] = useState(true);
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
    const [exportProgress] = useState(0);
    const [currentFormat] = useState('');
    const [isPaused, setIsPaused] = useState(false);
    const [showProgress, setShowProgress] = useState(false);

    const theme = useTheme({
      initialLight: initialLightSquare,
      initialDark: initialDarkSquare
    });

    const validFens = fens.filter((f) => f.trim() && validateFEN(f));
    const hasValidFens = validFens.length > 0;
    const filledSlots = fens.filter((f) => f.trim()).length;
    const displayFensCount = Math.max(batchList.length, 3);
    const safeCurrentIndex = Math.min(
      currentIndex,
      Math.max(0, validFens.length - 1)
    );
    const currentFen = hasValidFens ? validFens[safeCurrentIndex] : '';
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

    useEffect(() => {
      if (location.state?.restoreTab) {
        setActiveTab(location.state.restoreTab);
        window.history.replaceState({}, document.title);
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
      localStorage.setItem(
        'advanced-fen-position-settings',
        JSON.stringify(positionSettings)
      );
    }, [positionSettings]);

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
      fens.forEach((fen, index) => {
        const trimmed = fen.trim();
        if (trimmed && !validateFEN(trimmed))
          errors[index] = 'Invalid FEN notation';
      });
      setFenErrors(errors);
      const validCount = fens.filter((f) => f.trim() && validateFEN(f)).length;
      if (currentIndex >= validCount && validCount > 0) setCurrentIndex(0);
    }, [fens, currentIndex]);

    useEffect(() => {
      let timer;
      if (isPlaying && validFens.length > 0) {
        timer = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % validFens.length);
        }, interval * 1000);
      }
      return () => clearInterval(timer);
    }, [isPlaying, interval, validFens.length]);

    useEffect(() => {
      return () => {
        if (duplicateTimeoutRef.current)
          clearTimeout(duplicateTimeoutRef.current);
        if (pastedTimeoutRef.current) clearTimeout(pastedTimeoutRef.current);
      };
    }, []);

    useEffect(() => {
      if (location.state?.addFen && !addedFenRef.current) {
        const fenToAdd = location.state.addFen;
        if (!fens.some((f) => f.trim() === fenToAdd)) {
          const emptyIndex = fens.findIndex((f) => !f.trim());
          if (emptyIndex !== -1 && emptyIndex < batchList.length) {
            updateBatchItem(emptyIndex, fenToAdd);
            setPastedIndex(emptyIndex);
          } else if (batchList.length < MAX_FENS) {
            addToBatch(fenToAdd);
            setPastedIndex(batchList.length);
          }
          if (pastedTimeoutRef.current) clearTimeout(pastedTimeoutRef.current);
          pastedTimeoutRef.current = setTimeout(
            () => setPastedIndex(null),
            2000
          );
        }
        addedFenRef.current = true;
        window.history.replaceState({}, document.title);
      }
    }, [location.state, fens, batchList.length, updateBatchItem, addToBatch]);

    const handleBack = useCallback(() => {
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
      if (index < batchList.length) {
        removeFromBatch(index);
        if (currentIndex >= batchList.length - 1) {
          setCurrentIndex(Math.max(0, batchList.length - 2));
        }
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
        return;
      }
      if (index < batchList.length && trimmedValue) {
        updateBatchItem(index, trimmedValue);
      } else if (
        index >= batchList.length &&
        trimmedValue &&
        batchList.length < MAX_FENS
      ) {
        addToBatch(trimmedValue);
      }
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
      setFavorites((prev) => ({ ...prev, [fen]: !prev[fen] }));
    };

    const handlePrevious = useCallback(() => {
      if (validFens.length > 0)
        setCurrentIndex(
          (prev) => (prev - 1 + validFens.length) % validFens.length
        );
    }, [validFens.length]);

    const handleNext = useCallback(() => {
      if (validFens.length > 0)
        setCurrentIndex((prev) => (prev + 1) % validFens.length);
    }, [validFens.length]);

    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') handleBack();
        else if (e.key === 'ArrowLeft' && validFens.length > 0)
          handlePrevious();
        else if (e.key === 'ArrowRight' && validFens.length > 0) handleNext();
        else if (e.key === ' ' && validFens.length > 0) {
          e.preventDefault();
          setIsPlaying((prev) => !prev);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleBack, handleNext, handlePrevious, validFens.length]);

    const pageTabs = [
      { id: TABS.POSITIONS, icon: List, label: 'Positions' },
      { id: 'preview-export', icon: Eye, label: 'Preview / Export' }
    ];

    const exportConfig = {
      fen: currentFen,
      pieceStyle,
      boardSize,
      showCoords: showCoordsLocal,
      showCoordinateBorder,
      showThinFrame,
      lightSquare: theme.lightSquare,
      darkSquare: theme.darkSquare,
      flipped: isFlipped,
      quality: exportQuality
    };

    // ── BOARD RENDERER ──
    const renderBoard = () => {
      if (!isBoardReady) {
        return (
          <div
            className="flex items-center justify-center bg-surface-elevated rounded-lg"
            style={{ width: 'min(52vh, 46vw)', height: 'min(52vh, 46vw)' }}
          >
            <div className="text-text-muted text-sm">Loading...</div>
          </div>
        );
      }

      return (
        <div className="inline-flex flex-col">
          <div className="flex">
            {showCoordinates && (
              <div
                className="flex flex-col flex-shrink-0"
                style={{ width: 20 }}
              >
                {(isFlipped
                  ? ['1', '2', '3', '4', '5', '6', '7', '8']
                  : ['8', '7', '6', '5', '4', '3', '2', '1']
                ).map((rank) => (
                  <div
                    key={rank}
                    className="flex items-center justify-center text-[11px] font-bold text-text-secondary"
                    style={{ height: 'calc(min(52vh, 46vw) / 8)' }}
                  >
                    {rank}
                  </div>
                ))}
              </div>
            )}
            <div
              className="grid grid-cols-8 grid-rows-8 overflow-hidden rounded-sm shadow-md"
              style={{
                width: 'min(52vh, 46vw)',
                height: 'min(52vh, 46vw)'
              }}
            >
              {Array.from({ length: 64 }).map((_, i) => {
                const row = Math.floor(i / 8);
                const col = i % 8;
                const actualRow = isFlipped ? 7 - row : row;
                const actualCol = isFlipped ? 7 - col : col;
                const isLight = (row + col) % 2 === 0;
                const piece = boardState[actualRow]?.[actualCol] || '';
                const color = piece === piece.toUpperCase() ? 'w' : 'b';
                const pieceKey = piece ? color + piece.toUpperCase() : null;
                return (
                  <div
                    key={`sq-${row}-${col}`}
                    className="relative flex items-center justify-center"
                    style={{
                      backgroundColor: isLight
                        ? theme.lightSquare
                        : theme.darkSquare,
                      minWidth: 0,
                      minHeight: 0
                    }}
                  >
                    {pieceKey && pieceImages[pieceKey] && (
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
            <div className="flex" style={{ paddingLeft: 20 }}>
              {(isFlipped
                ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
                : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
              ).map((file) => (
                <div
                  key={file}
                  className="text-[11px] font-bold text-text-secondary text-center mt-1"
                  style={{ width: 'calc(min(52vh, 46vw) / 8)' }}
                >
                  {file}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="h-screen flex flex-col bg-bg overflow-hidden">
        <style>{`
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(16px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .input-enter { animation: slideInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .layout-transition { transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
          .tab-content { animation: slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        `}</style>

        {/* ── HEADER ── */}
        <header className="flex-shrink-0 bg-surface border-b border-border">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-surface-hover rounded-lg transition-colors group"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-4 h-4 text-accent group-hover:text-accent-hover transition-colors" />
                  <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary">
                    Back
                  </span>
                </button>
                <div className="h-6 w-px bg-border" />
                <h1 className="text-xl font-bold text-text-primary tracking-tight">
                  Advanced FEN Editor
                </h1>
                <span className="px-2.5 py-0.5 bg-accent/15 text-accent text-xs font-semibold rounded-full border border-accent/20">
                  {filledSlots} / {MAX_FENS}
                </span>
              </div>
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-bg rounded-lg font-semibold transition-all text-sm flex items-center gap-2 shadow-sm"
                aria-label="Save and close"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </header>

        {/* ── TABS ── */}
        <div className="flex-shrink-0 bg-surface border-b border-border">
          <div className="px-6">
            <div className="flex gap-0">
              {pageTabs.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-5 py-3 flex items-center gap-2 text-sm font-semibold transition-all border-b-2 ${
                    activeTab === id
                      ? 'text-accent border-accent bg-accent/5'
                      : 'text-text-secondary hover:text-text-primary border-transparent hover:bg-surface-hover'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            {/* ══ POSITIONS TAB ══ */}
            {activeTab === TABS.POSITIONS && (
              <div className="tab-content grid grid-cols-1 lg:grid-cols-2 max-w-[90%] gap-3 mx-auto">
                {fens.map((fen, idx) => {
                  const isLastOdd =
                    displayFensCount % 2 === 1 && idx === displayFensCount - 1;
                  const hasError = !!fenErrors[idx];
                  const hasDuplicate = duplicateWarning === idx;

                  return (
                    <div
                      key={fen ? `fen-${fen}` : `empty-${idx}`}
                      className={`bg-surface border rounded-xl p-4 space-y-3 layout-transition ${
                        isLastOdd ? 'lg:col-span-2' : ''
                      } ${
                        hasError
                          ? 'border-error/50'
                          : hasDuplicate
                            ? 'border-warning/50'
                            : 'border-border hover:border-border-hover'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-surface-elevated flex items-center justify-center text-xs font-bold text-text-secondary">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-medium text-text-secondary">
                            Position {idx + 1}
                          </span>
                          {fen && validateFEN(fen) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {fen && validateFEN(fen) && (
                            <button
                              onClick={() => toggleFavorite(fen)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                favorites[fen]
                                  ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                                  : 'text-text-muted hover:text-red-400 hover:bg-red-500/10'
                              }`}
                              aria-label="Toggle favorite"
                            >
                              <Heart
                                className="w-3.5 h-3.5"
                                fill={favorites[fen] ? 'currentColor' : 'none'}
                              />
                            </button>
                          )}
                          <button
                            onClick={() => handlePasteFEN(idx)}
                            className="p-1.5 text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                            aria-label="Paste FEN"
                            title="Paste from clipboard"
                          >
                            {pastedIndex === idx ? (
                              <Check className="w-3.5 h-3.5 text-success" />
                            ) : (
                              <Clipboard className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {fens.length > 3 && idx >= 3 && (
                            <button
                              onClick={() => removeFenInput(idx)}
                              className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                              aria-label="Remove position"
                              title="Remove this position"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* FEN Input */}
                      <input
                        type="text"
                        value={fen}
                        onChange={(e) => updateFen(idx, e.target.value)}
                        placeholder="Paste FEN notation here…"
                        className={`w-full px-3 py-2.5 bg-surface-elevated border rounded-lg font-mono text-xs transition-all placeholder:text-text-muted/50 ${
                          hasError
                            ? 'border-error/60 focus:border-error focus:ring-1 focus:ring-error/30'
                            : hasDuplicate
                              ? 'border-warning/60 focus:border-warning focus:ring-1 focus:ring-warning/30'
                              : 'border-border focus:border-accent focus:ring-1 focus:ring-accent/20'
                        } focus:outline-none`}
                      />

                      {/* Error/Warning Messages */}
                      {hasError && (
                        <div className="flex items-center gap-1.5 text-error text-xs">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{fenErrors[idx]}</span>
                        </div>
                      )}
                      {hasDuplicate && (
                        <div className="flex items-center gap-1.5 text-warning text-xs">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>
                            Duplicate FEN — already exists in another slot
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ══ PREVIEW / EXPORT TAB ══ */}
            {activeTab === 'preview-export' && (
              <div className="tab-content">
                {!hasValidFens ? (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-surface-elevated flex items-center justify-center mb-4">
                      <Eye className="w-8 h-8 text-text-muted" />
                    </div>
                    <p className="text-text-secondary font-medium mb-1">
                      No valid positions to preview
                    </p>
                    <p className="text-text-muted text-sm">
                      Add valid FEN positions in the Positions tab
                    </p>
                    <button
                      onClick={() => setActiveTab(TABS.POSITIONS)}
                      className="mt-6 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg text-sm font-medium transition-colors"
                    >
                      Go to Positions
                    </button>
                  </div>
                ) : (
                  /* ── Preview + Export layout ── */
                  <div className="flex flex-col lg:flex-row gap-5 max-w-[1600px] mx-auto">
                    {/* ── LEFT COLUMN: Board (+ controls below) + Actions ── */}
                    <div className="max-w-[1600px] mx-auto">
                      <div className="bg-surface border border-border rounded-xl p-5">
                        <div className="flex flex-col xl:flex-row gap-12">
                          {/* Chess Board + Playback Controls below */}
                          <div className="flex-shrink-0 flex flex-col items-center gap-0">
                            {/* Board */}
                            {renderBoard()}

                            {/* Playback controls — taxtanın hemen altında, taxta genişliyindəki */}
                            <div
                              className="flex items-center justify-between mt-6 bg-surface border border-border rounded-2xl p-2 text-center"
                              style={{ width: 'min(52vh, 46vw)' }}
                            >
                              {/* Play + Interval */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setIsPlaying(!isPlaying)}
                                  className="p-2 bg-warning hover:bg-warning/90 text-bg rounded-lg transition-colors"
                                  aria-label={isPlaying ? 'Pause' : 'Play'}
                                >
                                  {isPlaying ? (
                                    <Pause className="w-4 h-4" />
                                  ) : (
                                    <Play className="w-4 h-4" />
                                  )}
                                </button>
                                <div className="relative">
                                  <button
                                    onClick={() =>
                                      setShowIntervalMenu(!showIntervalMenu)
                                    }
                                    className="px-3 py-1.5 bg-surface-elevated hover:bg-surface-hover text-text-primary rounded-lg text-sm font-semibold transition-colors border border-border min-w-[52px] text-center"
                                  >
                                    {interval}s
                                  </button>
                                  {showIntervalMenu && (
                                    <div className="absolute top-full mt-1 bg-surface border border-border rounded-lg shadow-lg overflow-hidden z-20 min-w-[72px]">
                                      {INTERVAL_OPTIONS.map((opt) => (
                                        <button
                                          key={opt}
                                          onClick={() => {
                                            setIntervalTime(opt);
                                            setShowIntervalMenu(false);
                                          }}
                                          className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                                            opt === interval
                                              ? 'bg-warning/15 text-warning font-semibold'
                                              : 'hover:bg-surface-hover text-text-primary'
                                          }`}
                                        >
                                          {opt}s
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Prev / Counter / Next */}
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={handlePrevious}
                                  disabled={validFens.length <= 1}
                                  className="p-1.5 bg-surface-elevated hover:bg-surface-hover rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-border"
                                  aria-label="Previous"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="px-3 py-1 bg-surface-elevated rounded-lg text-sm font-mono border border-border min-w-[56px] text-center text-text-secondary">
                                  {safeCurrentIndex + 1} / {validFens.length}
                                </span>
                                <button
                                  onClick={handleNext}
                                  disabled={validFens.length <= 1}
                                  className="p-1.5 bg-surface-elevated hover:bg-surface-hover rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-border"
                                  aria-label="Next"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* ── Quick Actions Panel ── */}
                          <div className="flex flex-col gap-4 flex-1 min-w-[200px] max-w-[280px]">
                            {/* Quick Actions Label */}
                            <div className="space-y-2">
                              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                                Quick Actions
                              </span>
                              <button
                                onClick={() => setIsFlipped(!isFlipped)}
                                className="w-full px-3 py-2 bg-surface-elevated hover:bg-surface-hover border border-border text-text-primary rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
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
                                className="w-full px-3 py-2 bg-surface-elevated hover:bg-surface-hover border border-border text-text-primary rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
                              >
                                <Copy className="w-4 h-4" />
                                Copy FEN
                              </button>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-border" />

                            {/* Single Export */}
                            <div className="space-y-2">
                              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                                Single Export
                              </span>
                              <button
                                onClick={async () => {
                                  try {
                                    await downloadPNG(exportConfig, fileName);
                                  } catch (err) {
                                    logger.error('PNG export failed:', err);
                                  }
                                }}
                                className="w-full px-3 py-2.5 bg-warning hover:bg-warning/90 text-bg rounded-lg font-semibold transition-colors text-sm"
                              >
                                Export PNG
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    await downloadJPEG(exportConfig, fileName);
                                  } catch (err) {
                                    logger.error('JPEG export failed:', err);
                                  }
                                }}
                                className="w-full px-3 py-2.5 bg-surface-elevated hover:bg-surface-hover border border-border text-text-primary rounded-lg font-semibold transition-colors text-sm"
                              >
                                Export JPEG
                              </button>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-border" />

                            {/* Batch Export */}
                            <div className="space-y-2">
                              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                                Batch Export
                                <span className="ml-1.5 px-1.5 py-0.5 bg-surface-elevated rounded text-[10px]">
                                  {validFens.length}
                                </span>
                              </span>
                              <button
                                onClick={async () => {
                                  try {
                                    setShowProgress(true);
                                    await batchExport(
                                      { ...exportConfig, fens: validFens },
                                      ['png'],
                                      fileName
                                    );
                                    setShowProgress(false);
                                  } catch (err) {
                                    logger.error('Batch PNG failed:', err);
                                    setShowProgress(false);
                                  }
                                }}
                                className="w-full px-3 py-2.5 bg-warning/20 hover:bg-warning/30 border border-warning/30 text-warning rounded-lg font-semibold transition-colors text-sm"
                              >
                                Batch PNG
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    setShowProgress(true);
                                    await batchExport(
                                      { ...exportConfig, fens: validFens },
                                      ['jpeg'],
                                      fileName
                                    );
                                    setShowProgress(false);
                                  } catch (err) {
                                    logger.error('Batch JPEG failed:', err);
                                    setShowProgress(false);
                                  }
                                }}
                                className="w-full px-3 py-2.5 bg-surface-elevated hover:bg-surface-hover border border-border text-text-secondary rounded-lg font-semibold transition-colors text-sm"
                              >
                                Batch JPEG
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── RIGHT COLUMN: Control Panel ── */}
                    <div className="w-full lg:w-[400px] xl:w-[440px] flex-shrink-0">
                      <ControlPanel
                        fen={currentFen}
                        setFen={(newFen) => {
                          const batchIdx = batchList.indexOf(currentFen);
                          if (batchIdx !== -1) updateFen(batchIdx, newFen);
                        }}
                        pieceStyle={pieceStyle}
                        setPieceStyle={setPieceStyle}
                        showCoords={showCoordsLocal}
                        setShowCoords={setShowCoordsLocal}
                        showCoordinateBorder={showCoordinateBorder}
                        setShowCoordinateBorder={setShowCoordinateBorder}
                        showThinFrame={showThinFrame}
                        setShowThinFrame={setShowThinFrame}
                        exportQuality={exportQuality}
                        showAdvancedButton={false}
                        showHistoryButton={false}
                        onSettingsClick={() =>
                          navigate('/settings', {
                            state: {
                              returnTo: '/advanced-fen',
                              returnTab: activeTab
                            }
                          })
                        }
                        onNotification={(message, type) =>
                          logger.log(`[${type}] ${message}`)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* ── EXPORT PROGRESS OVERLAY ── */}
        {showProgress && (
          <ExportProgress
            progress={exportProgress}
            total={validFens.length}
            currentFormat={currentFormat}
            isPaused={isPaused}
            onPause={() => setIsPaused(true)}
            onResume={() => setIsPaused(false)}
            onCancel={() => setShowProgress(false)}
          />
        )}

        {/* ── EXPORT OPTIONS DIALOG ── */}
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