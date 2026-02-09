import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Palette,
  Wand2,
  Pencil,
  Trash2,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Settings as SettingsIcon,
  RotateCcw,
  Download,
  Upload
} from 'lucide-react';
import { BOARD_THEMES } from '@/constants/chessConstants';
import { hexToRgb, rgbToHsv, hsvToRgb, rgbToHex } from '@/utils';

const MAX_TOTAL_PRESETS = 48;
const STANDARD_PRESETS_COUNT = 19;
const PRESETS_PER_PAGE = 20;
const RANK_GUTTER = 20;
const BOARD_SIZE_EXPR = 'min(58vh, 52vw)';
const CELL_SIZE_EXPR = `calc(${BOARD_SIZE_EXPR} / 8)`;

const STORAGE_KEYS = {
  PRESETS: 'chess-diagram-presets',
  SETTINGS: 'chess-diagram-settings',
  LIGHT_SQUARE: 'chess-light-square',
  DARK_SQUARE: 'chess-dark-square'
};

const WOOD_PRESET = {
  id: 'wood-default',
  name: 'Wood',
  light: '#d4af7a',
  dark: '#8b4513',
  isDefault: true,
  isDeletable: false
};

const DEFAULT_SETTINGS = {
  defaultPreset: 'wood-default',
  rememberLastPreset: true,
  defaultOrientation: 'white',
  showCoordinates: true,
  enableEditMode: false
};

function getDefaultPresets() {
  const themes = Object.entries(BOARD_THEMES).slice(
    0,
    STANDARD_PRESETS_COUNT - 1
  );
  return [
    WOOD_PRESET,
    ...themes.map(([_key, t], i) => ({
      id: `preset-${i + 1}`,
      name: t.name,
      light: t.light,
      dark: t.dark,
      isDefault: true,
      isDeletable: true
    }))
  ];
}

function loadPresets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRESETS);
    if (raw) {
      const loaded = JSON.parse(raw);
      const hasWood = loaded.some((p) => p.id === WOOD_PRESET.id);
      if (!hasWood)
        return [WOOD_PRESET, ...loaded.filter((p) => p.id !== WOOD_PRESET.id)];
      return loaded;
    }
  } catch {
    return getDefaultPresets();
  }
  return getDefaultPresets();
}

function savePresets(presets) {
  try {
    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets));
  } catch {
    // Silence localStorage errors
  }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // Silence localStorage errors
  }
}

function readSquare(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? v.replace(/"/g, '') : fallback;
  } catch {
    return fallback;
  }
}

function validateImportedPresets(data) {
  if (!Array.isArray(data)) return false;
  return data.every(
    (p) =>
      typeof p.id === 'string' &&
      typeof p.name === 'string' &&
      typeof p.light === 'string' &&
      typeof p.dark === 'string' &&
      /^#[0-9a-fA-F]{6}$/.test(p.light) &&
      /^#[0-9a-fA-F]{6}$/.test(p.dark)
  );
}

const BoardPreview = memo(({ light, dark }) => {
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return (
    <div className="flex items-center justify-center min-h-0 h-full select-none">
      <div className="inline-flex flex-col">
        <div className="flex">
          <div
            className="flex flex-col flex-shrink-0"
            style={{ width: RANK_GUTTER }}
          >
            {ranks.map((n) => (
              <div
                key={n}
                className="flex items-center justify-center text-[12px] font-bold text-text-primary"
                style={{ height: CELL_SIZE_EXPR }}
              >
                {n}
              </div>
            ))}
          </div>
          <div
            className="grid grid-cols-8 overflow-hidden border border-border"
            style={{
              width: BOARD_SIZE_EXPR,
              height: BOARD_SIZE_EXPR,
              contain: 'strict'
            }}
          >
            {Array.from({ length: 64 }).map((_, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const isLight = (row + col) % 2 === 0;
              return (
                <div
                  key={`sq-${row}-${col}`}
                  className="transition-colors duration-200"
                  style={{ backgroundColor: isLight ? light : dark }}
                />
              );
            })}
          </div>
        </div>
        <div className="flex" style={{ paddingLeft: RANK_GUTTER }}>
          {files.map((l) => (
            <div
              key={l}
              className="text-[12px] font-bold text-text-primary text-center mt-1"
              style={{ width: CELL_SIZE_EXPR }}
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
BoardPreview.displayName = 'BoardPreview';

const PresetCard = memo(
  ({
    preset,
    isActive,
    onClick,
    editMode,
    onEdit,
    onDelete,
    onDragStart,
    onDragOver,
    onDrop
  }) => {
    const [hovered, setHovered] = useState(false);
    const isWood = preset.id === WOOD_PRESET.id;
    const canDelete = !isWood && preset.isDeletable !== false;

    return (
      <button
        onClick={() => onClick(preset)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        draggable={editMode}
        onDragStart={(e) => onDragStart?.(e, preset)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop?.(e, preset)}
        aria-label={`Apply ${preset.name} theme`}
        className={`group relative rounded-lg transition-all duration-200 overflow-hidden ${isActive ? 'ring-2 ring-accent shadow-md scale-[1.02]' : 'hover:scale-[1.03] hover:shadow-sm'} ${editMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        <div className="relative overflow-hidden rounded-lg">
          <div className="flex w-full h-12" aria-hidden="true">
            <div
              className="flex-1 transition-colors duration-300"
              style={{ backgroundColor: preset.light }}
            />
            <div
              className="flex-1 transition-colors duration-300"
              style={{ backgroundColor: preset.dark }}
            />
          </div>
          {!editMode && (
            <div
              className="absolute inset-0 bg-black/60 flex items-center justify-center transition-transform duration-300"
              style={{
                transform: hovered ? 'translateX(0)' : 'translateX(100%)'
              }}
            >
              <span className="text-white text-[10px] font-bold tracking-wide px-1 text-center">
                {preset.name}
              </span>
            </div>
          )}
          {isActive && !editMode && (
            <div className="absolute top-1 right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center shadow">
              <Check className="w-2.5 h-2.5 text-bg" strokeWidth={3} />
            </div>
          )}
        </div>
        {editMode && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(preset);
              }}
              className="p-1.5 bg-accent hover:bg-accent-hover rounded-md transition-all hover:scale-110 shadow"
              aria-label={`Edit ${preset.name}`}
            >
              <Pencil className="w-3 h-3 text-bg" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (canDelete) onDelete(preset.id);
              }}
              disabled={!canDelete}
              className={`p-1.5 rounded-md transition-all shadow ${canDelete ? 'bg-error hover:bg-red-600 hover:scale-110' : 'bg-gray-500 cursor-not-allowed opacity-50'}`}
              aria-label={
                canDelete
                  ? `Delete ${preset.name}`
                  : 'Cannot delete Wood preset'
              }
            >
              <Trash2 className="w-3 h-3 text-white" />
            </button>
          </div>
        )}
      </button>
    );
  }
);
PresetCard.displayName = 'PresetCard';

const AddPresetCard = memo(({ onClick, disabled }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Add new preset"
      className={`group relative rounded-lg transition-all duration-200 overflow-hidden border-2 border-dashed ${disabled ? 'border-border/30 opacity-50 cursor-not-allowed' : 'border-border/60 hover:border-accent/60 hover:scale-[1.03]'}`}
    >
      <div className="relative overflow-hidden rounded-md">
        <div className="flex w-full h-12 bg-surface items-center justify-center">
          <Plus className="w-4 h-4 text-text-muted/50 group-hover:text-accent transition-colors" />
        </div>
        {!disabled && (
          <div
            className="absolute inset-0 bg-black/60 flex items-center justify-center transition-transform duration-300"
            style={{
              transform: hovered ? 'translateX(0)' : 'translateX(100%)'
            }}
          >
            <Plus className="w-3 h-3 text-white mr-1" />
            <span className="text-white text-[10px] font-bold">New</span>
          </div>
        )}
      </div>
    </button>
  );
});
AddPresetCard.displayName = 'AddPresetCard';

const CustomEntryCard = memo(({ isActive, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Create custom theme"
      className={`group relative rounded-lg transition-all duration-200 overflow-hidden ${isActive ? 'ring-2 ring-accent shadow-md scale-[1.02]' : 'hover:scale-[1.03] hover:shadow-sm'}`}
    >
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex w-full h-12"
          style={{
            background:
              'linear-gradient(135deg, #f43f5e 0%, #a855f7 25%, #3b82f6 50%, #22d3ee 75%, #f59e0b 100%)'
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-black/60 flex items-center justify-center transition-transform duration-300"
          style={{ transform: hovered ? 'translateX(0)' : 'translateX(100%)' }}
        >
          <Wand2 className="w-3 h-3 text-white mr-1" />
          <span className="text-white text-[10px] font-bold">Custom</span>
        </div>
        {isActive && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center shadow">
            <Check className="w-2.5 h-2.5 text-bg" strokeWidth={3} />
          </div>
        )}
      </div>
    </button>
  );
});
CustomEntryCard.displayName = 'CustomEntryCard';

const CustomTab = memo(({ currentLight, currentDark, onColorChange }) => {
  const [activeSquare, setActiveSquare] = useState('light');
  const canvasRef = useRef(null);
  const isDragging = useRef(false);
  const currentValue = activeSquare === 'light' ? currentLight : currentDark;
  const [tempColor, setTempColor] = useState(currentValue);

  useEffect(() => {
    setTempColor(currentValue);
  }, [currentValue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width,
      h = canvas.height;
    const rgb = hexToRgb(tempColor);
    if (!rgb) return;
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const hueRgb = hsvToRgb(hsv.h, 100, 100);
    const gH = ctx.createLinearGradient(0, 0, w, 0);
    gH.addColorStop(0, 'white');
    gH.addColorStop(1, `rgb(${hueRgb.r},${hueRgb.g},${hueRgb.b})`);
    ctx.fillStyle = gH;
    ctx.fillRect(0, 0, w, h);
    const gV = ctx.createLinearGradient(0, 0, 0, h);
    gV.addColorStop(0, 'rgba(0,0,0,0)');
    gV.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = gV;
    ctx.fillRect(0, 0, w, h);
  }, [tempColor]);

  const pickColorAt = useCallback(
    (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.min(
          canvas.width - 1,
          ((e.clientX - rect.left) / rect.width) * canvas.width
        )
      );
      const y = Math.max(
        0,
        Math.min(
          canvas.height - 1,
          ((e.clientY - rect.top) / rect.height) * canvas.height
        )
      );
      const ctx = canvas.getContext('2d');
      const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
      const newColor = rgbToHex(r, g, b);
      setTempColor(newColor);
      if (activeSquare === 'light') onColorChange(newColor, currentDark);
      else onColorChange(currentLight, newColor);
    },
    [activeSquare, currentLight, currentDark, onColorChange]
  );

  const handleCanvasMouseDown = useCallback(
    (e) => {
      isDragging.current = true;
      pickColorAt(e);
    },
    [pickColorAt]
  );
  const handleCanvasMouseMove = useCallback(
    (e) => {
      if (isDragging.current) pickColorAt(e);
    },
    [pickColorAt]
  );
  const handleCanvasMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mouseup', handleCanvasMouseUp);
    return () => window.removeEventListener('mouseup', handleCanvasMouseUp);
  }, [handleCanvasMouseUp]);

  const handleHueChange = useCallback(
    (e) => {
      const hue = parseFloat(e.target.value);
      const rgb = hexToRgb(tempColor);
      if (!rgb) return;
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      const newRgb = hsvToRgb(hue, hsv.s, hsv.v);
      const newColor = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
      setTempColor(newColor);
      if (activeSquare === 'light') onColorChange(newColor, currentDark);
      else onColorChange(currentLight, newColor);
    },
    [tempColor, activeSquare, currentLight, currentDark, onColorChange]
  );

  const getCurrentHue = useCallback(() => {
    const rgb = hexToRgb(tempColor);
    return rgb ? rgbToHsv(rgb.r, rgb.g, rgb.b).h : 0;
  }, [tempColor]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 p-1 bg-surface rounded-lg border border-border">
        {['light', 'dark'].map((sq) => (
          <button
            key={sq}
            onClick={() => setActiveSquare(sq)}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${activeSquare === sq ? 'bg-accent text-bg shadow' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}
          >
            <div
              className="w-4 h-4 rounded border border-white/20 shadow-sm"
              style={{
                backgroundColor: sq === 'light' ? currentLight : currentDark
              }}
            />
            {sq.charAt(0).toUpperCase() + sq.slice(1)}
          </button>
        ))}
      </div>
      <div className="bg-surface rounded-lg p-3 border border-border">
        <canvas
          ref={canvasRef}
          width={280}
          height={180}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          className="w-full rounded-md cursor-crosshair border border-border/50"
          style={{ touchAction: 'none' }}
        />
      </div>
      <div className="bg-surface rounded-lg p-3 border border-border">
        <div className="flex justify-between text-xs text-text-muted mb-2">
          <span className="font-bold">Hue</span>
          <span className="font-mono bg-surface-elevated px-2 py-0.5 rounded text-[10px]">
            {Math.round(getCurrentHue())}°
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          value={getCurrentHue()}
          onChange={handleHueChange}
          className="w-full h-3 rounded-full cursor-pointer appearance-none"
          style={{
            background:
              'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div
          className={`flex items-center gap-2 p-2 rounded-lg border ${activeSquare === 'light' ? 'border-accent bg-accent/5' : 'border-border bg-surface'}`}
        >
          <div
            className="w-8 h-8 rounded shadow border border-white/10"
            style={{ backgroundColor: currentLight }}
          />
          <span className="text-xs font-bold text-text-secondary">Light</span>
        </div>
        <div
          className={`flex items-center gap-2 p-2 rounded-lg border ${activeSquare === 'dark' ? 'border-accent bg-accent/5' : 'border-border bg-surface'}`}
        >
          <div
            className="w-8 h-8 rounded shadow border border-white/10"
            style={{ backgroundColor: currentDark }}
          />
          <span className="text-xs font-bold text-text-secondary">Dark</span>
        </div>
      </div>
    </div>
  );
});
CustomTab.displayName = 'CustomTab';

const SettingsTab = memo(
  ({ settings, onSettingsChange, onResetPresets, onImport, onExport }) => {
    const fileInputRef = useRef(null);
    const handleImportClick = () => fileInputRef.current?.click();
    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target?.result);
          onImport(data);
        } catch {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    };
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-surface rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Enable Preset Edit Mode
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Show edit and delete buttons on preset cards
              </p>
            </div>
            <button
              onClick={() =>
                onSettingsChange({
                  ...settings,
                  enableEditMode: !settings.enableEditMode
                })
              }
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.enableEditMode ? 'bg-accent' : 'bg-border'}`}
              aria-label="Toggle edit mode"
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${settings.enableEditMode ? 'translate-x-7' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>
        <div className="bg-surface rounded-lg p-4 border border-border">
          <h3 className="text-sm font-bold text-text-primary mb-3">
            Preset Management
          </h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={onResetPresets}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border text-sm font-semibold text-text-secondary hover:text-text-primary transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onExport}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border text-sm font-semibold text-text-secondary hover:text-text-primary transition-all"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={handleImportClick}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border text-sm font-semibold text-text-secondary hover:text-text-primary transition-all"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    );
  }
);
SettingsTab.displayName = 'SettingsTab';

const Pagination = memo(({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1.5 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4 text-text-secondary" />
      </button>
      <span className="text-xs font-bold text-text-muted px-3">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4 text-text-secondary" />
      </button>
    </div>
  );
});
Pagination.displayName = 'Pagination';

const ThemeCustomizerPage = memo(() => {
  const navigate = useNavigate();
  const [savedLight, setSavedLight] = useState(() =>
    readSquare('chess-light-square', '#f0d9b5')
  );
  const [savedDark, setSavedDark] = useState(() =>
    readSquare('chess-dark-square', '#b58863')
  );
  const [previewLight, setPreviewLight] = useState(savedLight);
  const [previewDark, setPreviewDark] = useState(savedDark);
  const [presets, setPresets] = useState(loadPresets);
  const [settings, setSettings] = useState(loadSettings);
  const [presetsBackup, setPresetsBackup] = useState(null);
  const [rightTab, setRightTab] = useState('main');
  const [currentPage, setCurrentPage] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [editingPresetId, setEditingPresetId] = useState(null);
  const [draggedPreset, setDraggedPreset] = useState(null);

  const isCustomActive = !presets.some(
    (p) => p.light === previewLight && p.dark === previewDark
  );
  const hasChanges = previewLight !== savedLight || previewDark !== savedDark;
  const totalPages = Math.ceil((presets.length + 1) / PRESETS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRESETS_PER_PAGE;
  const endIndex = startIndex + PRESETS_PER_PAGE;
  const visiblePresets = presets.slice(
    startIndex,
    Math.min(endIndex - 1, presets.length)
  );
  const showCustomCard = currentPage === 1 && !editMode;
  const canAddPreset = presets.length < MAX_TOTAL_PRESETS;

  const handleBack = useCallback(() => navigate(-1), [navigate]);
  const handlePresetClick = useCallback(
    (preset) => {
      if (editMode) return;
      setPreviewLight(preset.light);
      setPreviewDark(preset.dark);
    },
    [editMode]
  );
  const handleCustomEntryClick = useCallback(() => setRightTab('custom'), []);
  const handleCustomColorChange = useCallback((light, dark) => {
    setPreviewLight(light);
    setPreviewDark(dark);
  }, []);

  const handleAddPreset = useCallback(() => {
    if (!canAddPreset) return;
    const maxId = presets.reduce((max, p) => {
      const num =
        typeof p.id === 'string' && p.id.startsWith('custom-')
          ? parseInt(p.id.split('-')[1], 10)
          : 0;
      return Math.max(max, num);
    }, 0);
    const newPreset = {
      id: `custom-${maxId + 1}`,
      name: `Custom ${maxId + 1}`,
      light: previewLight,
      dark: previewDark,
      isDefault: false,
      isDeletable: true
    };
    setPresets((prev) => [...prev, newPreset]);
    setEditingPresetId(newPreset.id);
    setRightTab('custom');
  }, [canAddPreset, presets, previewLight, previewDark]);

  const handleEnableEditMode = useCallback(() => {
    setPresetsBackup(JSON.parse(JSON.stringify(presets)));
    setEditMode(true);
  }, [presets]);

  const handleApplyChanges = useCallback(() => {
    savePresets(presets);
    localStorage.setItem('chess-light-square', previewLight);
    localStorage.setItem('chess-dark-square', previewDark);
    setSavedLight(previewLight);
    setSavedDark(previewDark);
    setPresetsBackup(null);
    setEditMode(false);
    setEditingPresetId(null);
    setRightTab('main');
  }, [presets, previewLight, previewDark]);

  const handleCancelEditMode = useCallback(() => {
    if (presetsBackup) setPresets(presetsBackup);
    setPresetsBackup(null);
    setEditMode(false);
    setEditingPresetId(null);
    setRightTab('main');
    setPreviewLight(savedLight);
    setPreviewDark(savedDark);
  }, [presetsBackup, savedLight, savedDark]);

  const handleDeletePreset = useCallback((id) => {
    if (id === WOOD_PRESET.id) return;
    setPresets((prev) => prev.filter((p) => p.id !== id));
  }, []);
  const handleEditPreset = useCallback((preset) => {
    setEditingPresetId(preset.id);
    setPreviewLight(preset.light);
    setPreviewDark(preset.dark);
    setRightTab('custom');
  }, []);

  const handleEditColorChange = useCallback(
    (light, dark) => {
      setPreviewLight(light);
      setPreviewDark(dark);
      if (editingPresetId !== null)
        setPresets((prev) =>
          prev.map((p) =>
            p.id === editingPresetId ? { ...p, light, dark } : p
          )
        );
    },
    [editingPresetId]
  );

  const handleSave = useCallback(() => {
    localStorage.setItem('chess-light-square', previewLight);
    localStorage.setItem('chess-dark-square', previewDark);
    savePresets(presets);
    setSavedLight(previewLight);
    setSavedDark(previewDark);
    navigate(-1);
  }, [previewLight, previewDark, presets, navigate]);

  const handleSettingsChange = useCallback(
    (newSettings) => {
      setSettings(newSettings);
      saveSettings(newSettings);
      if (newSettings.enableEditMode && !editMode) handleEnableEditMode();
      else if (!newSettings.enableEditMode && editMode) handleApplyChanges();
    },
    [editMode, handleEnableEditMode, handleApplyChanges]
  );

  const handleResetPresets = useCallback(() => {
    if (
      window.confirm(
        'Reset all presets to defaults? Custom presets will be lost.'
      )
    ) {
      const defaults = getDefaultPresets();
      setPresets(defaults);
      savePresets(defaults);
      setCurrentPage(1);
    }
  }, []);

  const handleExportPresets = useCallback(() => {
    const data = JSON.stringify(presets, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chess-theme-presets.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [presets]);

  const handleImportPresets = useCallback((data) => {
    if (!validateImportedPresets(data)) {
      alert('Invalid preset format');
      return;
    }
    const hasWood = data.some((p) => p.id === WOOD_PRESET.id);
    const imported = hasWood ? data : [WOOD_PRESET, ...data];
    const limited = imported.slice(0, MAX_TOTAL_PRESETS);
    setPresets(limited);
    savePresets(limited);
    setCurrentPage(1);
  }, []);

  const handleDragStart = useCallback(
    (_e, preset) => setDraggedPreset(preset),
    []
  );
  const handleDragOver = useCallback((e) => e.preventDefault(), []);
  const handleDrop = useCallback(
    (_e, targetPreset) => {
      if (!draggedPreset || draggedPreset.id === targetPreset.id) return;
      setPresets((prev) => {
        const newPresets = [...prev];
        const dragIndex = newPresets.findIndex(
          (p) => p.id === draggedPreset.id
        );
        const targetIndex = newPresets.findIndex(
          (p) => p.id === targetPreset.id
        );
        if (dragIndex === -1 || targetIndex === -1) return prev;
        const [removed] = newPresets.splice(dragIndex, 1);
        newPresets.splice(targetIndex, 0, removed);
        return newPresets;
      });
      setDraggedPreset(null);
    },
    [draggedPreset]
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (editMode) handleCancelEditMode();
        else handleBack();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [editMode, handleCancelEditMode, handleBack]);

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden">
      <header className="flex-shrink-0 bg-surface/80 backdrop-blur-md border-b border-border/50">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <button
                onClick={editMode ? handleCancelEditMode : handleBack}
                className="flex items-center gap-2 px-3 py-2 hover:bg-surface-hover rounded-lg transition-all group"
                aria-label={editMode ? 'Cancel edit mode' : 'Go back'}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-accent group-hover:text-accent-hover transition-colors" />
                <span className="text-xs sm:text-sm font-semibold text-text-secondary group-hover:text-text-primary">
                  Back
                </span>
              </button>
              <div className="hidden sm:block h-7 w-px bg-border/50" />
              <h1 className="text-lg sm:text-xl font-display font-bold text-text-primary truncate">
                {editMode ? 'Edit Themes' : 'Theme Presets'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {editMode && (
                <button
                  onClick={handleCancelEditMode}
                  className="flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 bg-surface-elevated text-text-secondary hover:bg-surface-hover border border-border/70"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
              )}
              {!editMode && (
                <button
                  onClick={handleEnableEditMode}
                  className="flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 bg-surface-elevated text-text-secondary hover:bg-surface-hover border border-border/70"
                >
                  <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              )}
              {editMode && (
                <button
                  onClick={handleApplyChanges}
                  className="flex-shrink-0 px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-bg shadow-md active:scale-95"
                >
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Apply</span>
                </button>
              )}
              {!editMode && (
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className={`flex-shrink-0 px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${hasChanges ? 'bg-accent hover:bg-accent-hover text-bg shadow-md active:scale-95' : 'bg-surface-elevated text-text-muted cursor-not-allowed opacity-50'}`}
                >
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Save</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full px-3 sm:px-4 lg:px-6 py-4 sm:py-5 max-w-7xl mx-auto">
          <div className="h-full flex flex-col bg-surface-elevated rounded-lg border border-border/50 overflow-hidden">
            <div className="flex-1 grid lg:grid-cols-[1fr,1fr] gap-0 overflow-hidden">
              <div className="p-6 border-r border-border/30 flex items-center justify-center">
                <BoardPreview light={previewLight} dark={previewDark} />
              </div>
              <div className="flex flex-col min-h-0 overflow-hidden">
                <div className="flex-shrink-0 p-4 pb-0">
                  <div className="flex gap-1 p-1 bg-surface rounded-lg border border-border/50">
                    <button
                      onClick={() => {
                        setRightTab('main');
                        setEditingPresetId(null);
                      }}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-1.5 ${rightTab === 'main' ? 'bg-accent text-bg shadow' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}
                    >
                      <Palette className="w-4 h-4" />
                      Main
                    </button>
                    <button
                      onClick={() => setRightTab('custom')}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-1.5 ${rightTab === 'custom' ? 'bg-accent text-bg shadow' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}
                    >
                      <Wand2 className="w-4 h-4" />
                      Custom
                    </button>
                    <button
                      onClick={() => setRightTab('settings')}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center gap-1.5 ${rightTab === 'settings' ? 'bg-accent text-bg shadow' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}
                    >
                      <SettingsIcon className="w-4 h-4" />
                      Settings
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 pt-3">
                  {rightTab === 'main' && (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <Palette className="w-4 h-4 text-accent" />
                        <h2 className="text-sm font-bold text-text-primary">
                          {editMode ? 'Edit Presets' : 'Theme Presets'}
                        </h2>
                        {editMode && (
                          <span className="ml-auto text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                            Edit Mode
                          </span>
                        )}
                      </div>
                      <div
                        className="grid grid-cols-4 gap-2"
                        role="group"
                        aria-label="Theme preset options"
                      >
                        {visiblePresets.map((preset) => (
                          <PresetCard
                            key={preset.id}
                            preset={preset}
                            isActive={
                              preset.light === previewLight &&
                              preset.dark === previewDark
                            }
                            onClick={handlePresetClick}
                            editMode={editMode}
                            onEdit={handleEditPreset}
                            onDelete={handleDeletePreset}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                          />
                        ))}
                        {editMode && (
                          <AddPresetCard
                            onClick={handleAddPreset}
                            disabled={!canAddPreset}
                          />
                        )}
                        {showCustomCard && (
                          <CustomEntryCard
                            isActive={isCustomActive}
                            onClick={handleCustomEntryClick}
                          />
                        )}
                      </div>
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </>
                  )}
                  {rightTab === 'custom' && (
                    <div>
                      {editingPresetId !== null && editMode && (
                        <div className="flex items-center gap-2 mb-4 p-2 bg-accent/10 rounded-lg border border-accent/20">
                          <Pencil className="w-3.5 h-3.5 text-accent" />
                          <span className="text-xs font-bold text-accent truncate">
                            Editing:{' '}
                            {presets.find((p) => p.id === editingPresetId)
                              ?.name || 'Preset'}
                          </span>
                          <button
                            onClick={() => {
                              setEditingPresetId(null);
                              setRightTab('main');
                            }}
                            className="ml-auto p-1 hover:bg-accent/15 rounded transition-colors"
                          >
                            <X className="w-3.5 h-3.5 text-accent" />
                          </button>
                        </div>
                      )}
                      <CustomTab
                        currentLight={previewLight}
                        currentDark={previewDark}
                        onColorChange={
                          editMode && editingPresetId !== null
                            ? handleEditColorChange
                            : handleCustomColorChange
                        }
                      />
                    </div>
                  )}
                  {rightTab === 'settings' && (
                    <SettingsTab
                      settings={settings}
                      onSettingsChange={handleSettingsChange}
                      onResetPresets={handleResetPresets}
                      onImport={handleImportPresets}
                      onExport={handleExportPresets}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});

ThemeCustomizerPage.displayName = 'ThemeCustomizerPage';

export default ThemeCustomizerPage;
