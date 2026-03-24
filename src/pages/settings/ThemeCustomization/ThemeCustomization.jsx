import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import {
  Check,
  LayoutGrid,
  Palette,
  Pencil,
  Plus,
  SlidersHorizontal,
  Wand2,
  X
} from 'lucide-react';

import { MAX_TOTAL_PRESETS, STORAGE_KEYS, WOOD_PRESET } from '@/constants';
import { Button } from '@/components/ui';
import { loadPresets, readSquare, savePresets } from '@/utils';

import AddPresetCard from './AddPresetCard';
import BoardPreview from './BoardPreview';
import ColorPickerPanel from './ColorPickerPanel';
import DuplicateWarningDialog from './DuplicateWarningDialog';
import PresetCard from './PresetCard';

/**
 * @returns {JSX.Element}
 */
const ThemeCustomization = memo(function ThemeCustomization() {
  const [savedLight, setSavedLight] = useState(() =>
    readSquare(STORAGE_KEYS.LIGHT_SQUARE, '#f0d9b5')
  );
  const [savedDark, setSavedDark] = useState(() =>
    readSquare(STORAGE_KEYS.DARK_SQUARE, '#b58863')
  );
  const [previewLight, setPreviewLight] = useState(savedLight);
  const [previewDark, setPreviewDark] = useState(savedDark);
  const [presets, setPresets] = useState(loadPresets);
  const [presetsBackup, setPresetsBackup] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingPresetId, setEditingPresetId] = useState(null);
  const [draggedPreset, setDraggedPreset] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [duplicateCheck, setDuplicateCheck] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [activePanelTab, setActivePanelTab] = useState('main');

  const sortedPresets = useMemo(() => {
    const defaults = presets.filter((p) => p.isDefault);
    const customs = presets.filter((p) => !p.isDefault);
    return [...defaults, ...customs];
  }, [presets]);

  const hasChanges = previewLight !== savedLight || previewDark !== savedDark;
  const canAddPreset = sortedPresets.length < MAX_TOTAL_PRESETS;
  const customPresetCount = sortedPresets.filter((p) => !p.isDefault).length;
  const editingPreset = sortedPresets.find((p) => p.id === editingPresetId) ?? null;

  const handleEnableEditMode = useCallback(function handleEnableEditMode() {
    setPresetsBackup(JSON.parse(JSON.stringify(presets)));
    setEditMode(true);
    setEditingPresetId(null);
    setIsAddingNew(false);
    setActivePanelTab('main');
  }, [presets]);

  const handleCancelEditMode = useCallback(function handleCancelEditMode() {
    if (presetsBackup) setPresets(presetsBackup);
    setPresetsBackup(null);
    setEditMode(false);
    setEditingPresetId(null);
    setIsAddingNew(false);
    setActivePanelTab('main');
    setPreviewLight(savedLight);
    setPreviewDark(savedDark);
  }, [presetsBackup, savedLight, savedDark]);

  const handleApplyChanges = useCallback(function handleApplyChanges() {
    savePresets(presets);
    localStorage.setItem(STORAGE_KEYS.LIGHT_SQUARE, previewLight);
    localStorage.setItem(STORAGE_KEYS.DARK_SQUARE, previewDark);
    setSavedLight(previewLight);
    setSavedDark(previewDark);
    setPresetsBackup(null);
    setEditMode(false);
    setEditingPresetId(null);
    setIsAddingNew(false);
    setActivePanelTab('main');
    window.dispatchEvent(new Event('storage'));
  }, [presets, previewLight, previewDark]);

  const handlePresetClick = useCallback(
    function handlePresetClick(preset) {
      if (editMode) return;
      setPreviewLight(preset.light);
      setPreviewDark(preset.dark);
    },
    [editMode]
  );

  const handleSave = useCallback(function handleSave() {
    localStorage.setItem(STORAGE_KEYS.LIGHT_SQUARE, previewLight);
    localStorage.setItem(STORAGE_KEYS.DARK_SQUARE, previewDark);
    savePresets(presets);
    setSavedLight(previewLight);
    setSavedDark(previewDark);
    window.dispatchEvent(new Event('storage'));
  }, [previewLight, previewDark, presets]);

  const handleCustomColorChange = useCallback(function handleCustomColorChange(
    light,
    dark
  ) {
    setPreviewLight(light);
    setPreviewDark(dark);
  }, []);

  const handleEditColorChange = useCallback(
    function handleEditColorChange(light, dark) {
      setPreviewLight(light);
      setPreviewDark(dark);
      if (editingPresetId !== null) {
        setPresets((prev) =>
          prev.map((p) =>
            p.id === editingPresetId
              ? {
                  ...p,
                  light,
                  dark
                }
              : p
          )
        );
      }
    },
    [editingPresetId]
  );

  const handleEditPreset = useCallback(function handleEditPreset(preset) {
    setEditingPresetId(preset.id);
    setPreviewLight(preset.light);
    setPreviewDark(preset.dark);
    setIsAddingNew(false);
    setActivePanelTab('custom');
  }, []);

  const handleDeletePreset = useCallback(function handleDeletePreset(id) {
    if (id === WOOD_PRESET.id) return;
    setPresets((prev) => prev.filter((p) => p.id !== id));
    if (editingPresetId === id) {
      setEditingPresetId(null);
      setIsAddingNew(false);
      setActivePanelTab('main');
    }
  }, [editingPresetId]);

  const handleRenamePreset = useCallback(function handleRenamePreset(
    id,
    newName
  ) {
    setPresets((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              name: newName
            }
          : p
      )
    );
  }, []);

  const handleAddPreset = useCallback(function handleAddPreset() {
    if (!canAddPreset) return;
    setEditingPresetId(null);
    setIsAddingNew(true);
    setPreviewLight('#e8d5b5');
    setPreviewDark('#a0784c');
    setActivePanelTab('custom');
  }, [canAddPreset]);

  const handleConfirmAdd = useCallback(function handleConfirmAdd() {
    const duplicate = presets.find(
      (p) =>
        p.light.toLowerCase() === previewLight.toLowerCase() &&
        p.dark.toLowerCase() === previewDark.toLowerCase()
    );

    if (duplicate) {
      setDuplicateCheck({
        light: previewLight,
        dark: previewDark,
        existingId: duplicate.id
      });
      return;
    }

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
    setIsAddingNew(false);
    setActivePanelTab('main');
  }, [presets, previewLight, previewDark]);

  const handleDuplicateRename = useCallback(function handleDuplicateRename() {
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
    setDuplicateCheck(null);
    setIsAddingNew(false);
    setActivePanelTab('main');
  }, [presets, previewLight, previewDark]);

  const handleDuplicateMerge = useCallback(function handleDuplicateMerge() {
    setDuplicateCheck(null);
    setIsAddingNew(false);
    setActivePanelTab('main');
  }, []);

  const handleDragStart = useCallback(function handleDragStart(_e, preset) {
    setDraggedPreset(preset);
  }, []);

  const handleDragOver = useCallback(function handleDragOver(e, preset) {
    e.preventDefault();
    setDragOverId(preset.id);
  }, []);

  const handleDragEnd = useCallback(function handleDragEnd() {
    setDraggedPreset(null);
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback(
    function handleDrop(_e, targetPreset) {
      if (!draggedPreset || draggedPreset.id === targetPreset.id) return;

      setPresets((prev) => {
        const newPresets = [...prev];
        const dragIndex = newPresets.findIndex((p) => p.id === draggedPreset.id);
        const targetIndex = newPresets.findIndex((p) => p.id === targetPreset.id);
        if (dragIndex === -1 || targetIndex === -1) return prev;
        const [removed] = newPresets.splice(dragIndex, 1);
        newPresets.splice(targetIndex, 0, removed);
        return newPresets;
      });

      setDraggedPreset(null);
      setDragOverId(null);
    },
    [draggedPreset]
  );

  const handleChangePanelTab = useCallback((tabId) => {
    setActivePanelTab(tabId);
    if (tabId === 'main' && !isAddingNew) {
      setEditingPresetId(null);
    }
  }, [isAddingNew]);

  useEffect(() => {
    function handleEscapeKey(e) {
      if (e.key === 'Escape' && editMode) handleCancelEditMode();
    }

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [editMode, handleCancelEditMode]);

  return (
    <div className="h-full max-h-full min-h-0 flex flex-col xl:flex-row overflow-hidden rounded-xl border border-border/40 bg-[radial-gradient(circle_at_top_right,rgba(245,166,35,0.08),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.015),transparent)]">
      <div className="xl:basis-[52%] xl:border-r border-border/30 p-2 sm:p-3 xl:p-4 flex items-center justify-center min-h-0">
        <BoardPreview light={previewLight} dark={previewDark} />
      </div>

      <div className="xl:basis-[48%] flex flex-col min-h-0">
        <div className="flex-shrink-0 px-3 pt-3 pb-2 sm:px-4 sm:pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-text-primary">Theme Studio</h2>
              {editMode && (
                <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                  Edit Mode
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editMode ? (
                <>
                  <Button
                    onClick={handleCancelEditMode}
                    variant="outline"
                    size="sm"
                    icon={X}
                    className="px-3 py-1.5 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApplyChanges}
                    size="sm"
                    icon={Check}
                    className="px-3 py-1.5 text-xs font-bold"
                  >
                    Apply
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleEnableEditMode}
                    variant="outline"
                    size="sm"
                    icon={Pencil}
                    className="px-3 py-1.5 text-xs"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    size="sm"
                    icon={Check}
                    className={`px-3 py-1.5 text-xs font-bold ${!hasChanges ? 'bg-surface-elevated text-text-muted' : ''}`}
                  >
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mb-2 p-1 rounded-lg border border-border/60 bg-surface/60">
            <div className="grid grid-cols-2 flex-1 gap-1">
              <button
                onClick={() => handleChangePanelTab('main')}
                className={`h-9 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${activePanelTab === 'main' ? 'bg-accent/15 text-accent border border-accent/30' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Main
              </button>
              <button
                onClick={() => handleChangePanelTab('custom')}
                className={`h-9 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${activePanelTab === 'custom' ? 'bg-accent/15 text-accent border border-accent/30' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Custom
              </button>
            </div>

            {editMode && activePanelTab === 'main' && (
              <button
                onClick={handleAddPreset}
                disabled={!canAddPreset}
                className={`px-3 h-9 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${canAddPreset ? 'bg-accent hover:bg-accent-hover text-bg' : 'bg-surface-elevated text-text-muted cursor-not-allowed opacity-60'}`}
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            )}
          </div>

          <div className="text-[11px] text-text-muted flex items-center justify-between px-0.5">
            <span>{sortedPresets.length} presets loaded</span>
            <span>{customPresetCount} custom</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden px-3 pb-3 sm:px-4 sm:pb-4 min-h-0">
          {activePanelTab === 'main' ? (
            <div
              className="h-full overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-2.5 transition-all duration-300 content-start"
              role="group"
              aria-label="Theme preset options"
            >
              {sortedPresets.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  isActive={
                    preset.light === previewLight && preset.dark === previewDark
                  }
                  onClick={handlePresetClick}
                  editMode={editMode}
                  onEdit={handleEditPreset}
                  onDelete={handleDeletePreset}
                  onRename={handleRenamePreset}
                  dragOverId={dragOverId}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                />
              ))}

              {editMode && (
                <AddPresetCard onClick={handleAddPreset} disabled={!canAddPreset} />
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-border/50 bg-surface/50 p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3 p-2 rounded-lg border border-border/40 bg-surface-elevated/50">
                <div
                  className="w-5 h-5 rounded border border-border/50"
                  style={{ backgroundColor: previewLight }}
                />
                <div
                  className="w-5 h-5 rounded border border-border/50"
                  style={{ backgroundColor: previewDark }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-text-primary truncate">
                    {isAddingNew
                      ? 'Creating New Preset'
                      : editingPreset
                        ? `Editing ${editingPreset.name}`
                        : 'Custom Color Mixer'}
                  </p>
                  <p className="text-[11px] text-text-muted truncate">
                    Hue slider and canvas are active for both squares.
                  </p>
                </div>
              </div>

              <ColorPickerPanel
                currentLight={previewLight}
                currentDark={previewDark}
                onColorChange={
                  editMode && editingPresetId !== null
                    ? handleEditColorChange
                    : handleCustomColorChange
                }
              />

              {editMode && (
                <div className="mt-4 flex gap-2">
                  {isAddingNew ? (
                    <button
                      onClick={handleConfirmAdd}
                      className="flex-1 py-2.5 rounded-lg text-sm font-bold bg-accent hover:bg-accent-hover text-bg shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <Wand2 className="w-4 h-4" />
                      Add Theme
                    </button>
                  ) : (
                    <button
                      onClick={handleAddPreset}
                      disabled={!canAddPreset}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${canAddPreset ? 'bg-accent hover:bg-accent-hover text-bg shadow-md active:scale-[0.98]' : 'bg-surface-elevated text-text-muted opacity-60 cursor-not-allowed'}`}
                    >
                      <Plus className="w-4 h-4" />
                      New Theme
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingPresetId(null);
                      setActivePanelTab('main');
                    }}
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-surface-elevated hover:bg-surface-hover border border-border text-text-secondary transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {duplicateCheck && (
        <DuplicateWarningDialog
          light={duplicateCheck.light}
          dark={duplicateCheck.dark}
          onRename={handleDuplicateRename}
          onMerge={handleDuplicateMerge}
          onCancel={() => setDuplicateCheck(null)}
        />
      )}
    </div>
  );
});

ThemeCustomization.displayName = 'ThemeCustomization';
export default ThemeCustomization;
