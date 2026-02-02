import { useState, useEffect, useCallback, memo } from 'react';
import {
  ThemeMainView,
  ThemeAdvancedPickerView,
  ThemeSettingsView
} from '../../UI/color-picker/views';
import { Palette, Sliders, Settings, X, Check } from 'lucide-react';

const ThemeModal = memo(
  ({
    isOpen,
    onClose,
    lightSquare,
    setLightSquare,
    darkSquare,
    setDarkSquare,
    pieceStyle = 'cburnett',
    onNotification
  }) => {
    const [activeTab, setActiveTab] = useState('main');
    const [activeSquare, setActiveSquare] = useState('light');
    const [previewLight, setPreviewLight] = useState(lightSquare);
    const [previewDark, setPreviewDark] = useState(darkSquare);

    useEffect(() => {
      if (isOpen) {
        setPreviewLight(lightSquare);
        setPreviewDark(darkSquare);
      }
    }, [isOpen, lightSquare, darkSquare]);

    const hasChanges =
      previewLight !== lightSquare || previewDark !== darkSquare;

    const handleThemeApply = useCallback((light, dark) => {
      setPreviewLight(light);
      setPreviewDark(dark);
    }, []);

    const handleSave = useCallback(() => {
      setLightSquare(previewLight);
      setDarkSquare(previewDark);
      onNotification?.('Theme applied', 'success');
      onClose();
    }, [
      previewLight,
      previewDark,
      setLightSquare,
      setDarkSquare,
      onNotification,
      onClose
    ]);

    const handleCancel = useCallback(() => {
      onClose();
    }, [onClose]);

    if (!isOpen) return null;

    const tabs = [
      { id: 'main', icon: Palette },
      { id: 'picker', icon: Sliders },
      { id: 'settings', icon: Settings }
    ];

    return (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm modal-backdrop flex items-center justify-center z-50 p-3"
        onClick={handleCancel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-modal-title"
      >
        <div
          className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl modal-content"
          onClick={(e) => e.stopPropagation()}
          style={{ contain: 'layout style paint' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
            <div className="flex items-center gap-2">
              <Palette
                className="w-4 h-4 text-primary-400"
                aria-hidden="true"
              />
              <span
                id="theme-modal-title"
                className="text-sm font-bold text-gray-200"
              >
                Board Theme
              </span>
            </div>
            <button
              onClick={handleCancel}
              className="p-1.5 hover:bg-gray-800 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="Close theme modal"
            >
              <X className="w-4 h-4 text-gray-400" aria-hidden="true" />
            </button>
          </div>

          {/* Tabs */}
          <div
            className="flex border-b border-gray-800 bg-gray-800/30"
            role="tablist"
            aria-label="Theme options"
          >
            {tabs.map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                role="tab"
                aria-selected={activeTab === id}
                aria-controls={`theme-panel-${id}`}
                className={`flex-1 p-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset ${
                  activeTab === id
                    ? 'text-white bg-gray-800/70 border-b-2 border-primary-500'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/40'
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>

          {/* Content with custom scrollbar */}
          <div className="max-h-[65vh] overflow-y-auto custom-scrollbar">
            {activeTab === 'main' && (
              <div
                role="tabpanel"
                id="theme-panel-main"
                aria-labelledby="tab-main"
              >
                <ThemeMainView
                  currentLight={previewLight}
                  currentDark={previewDark}
                  onThemeApply={handleThemeApply}
                  pieceStyle={pieceStyle}
                />
              </div>
            )}
            {activeTab === 'picker' && (
              <div
                role="tabpanel"
                id="theme-panel-picker"
                aria-labelledby="tab-picker"
              >
                <ThemeAdvancedPickerView
                  activeSquare={activeSquare}
                  setActiveSquare={setActiveSquare}
                  lightSquare={previewLight}
                  setLightSquare={setPreviewLight}
                  darkSquare={previewDark}
                  setDarkSquare={setPreviewDark}
                />
              </div>
            )}
            {activeTab === 'settings' && (
              <div
                role="tabpanel"
                id="theme-panel-settings"
                aria-labelledby="tab-settings"
              >
                <ThemeSettingsView />
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="p-2 border-t border-gray-800 flex gap-2"
            role="group"
            aria-label="Modal actions"
          >
            <button
              onClick={handleCancel}
              className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex-1 py-2 text-xs font-medium rounded flex items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                hasChanges
                  ? 'bg-primary-600 hover:bg-primary-500 text-white'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
              type="button"
              aria-disabled={!hasChanges}
            >
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ThemeModal.displayName = 'ThemeModal';
export default ThemeModal;
