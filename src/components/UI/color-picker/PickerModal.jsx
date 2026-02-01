import { useState } from 'react';
import { ThemeSettingsView } from './views';
import { X, ArrowLeft } from 'lucide-react';

/**
 * Multi-view modal with navigation
 */
const PickerModal = ({
  isOpen,
  tempColor,
  canvasRef,
  activePalette: _activePalette,
  setActivePalette: _setActivePalette,
  copiedText,
  onClose,
  onCanvasClick,
  onHueChange,
  onColorSelect: _onColorSelect,
  onRandom,
  onReset,
  onCopy,
  onApply,
  getCurrentHue,
  getRgbValues
}) => {
  const [activeView, setActiveView] = useState('main');

  if (!isOpen) return null;

  const viewConfig = {
    main: {
      title: 'Advanced Color Picker',
      gradient: 'from-blue-600/10 to-purple-600/10'
    },
    palettes: {
      title: 'Color Palettes',
      gradient: 'from-purple-600/10 to-pink-600/10'
    },
    settings: {
      title: 'Settings',
      gradient: 'from-blue-600/10 to-cyan-600/10'
    }
  };

  const currentView = viewConfig[activeView];

  return (
    <div
      className="absolute z-50 mt-2 w-[380px] bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="color-picker-title"
    >
      <div
        className={`flex items-center gap-3 p-4 border-b border-gray-700/50 bg-gradient-to-r ${currentView.gradient}`}
      >
        {activeView !== 'main' && (
          <button
            onClick={() => setActiveView('main')}
            className="p-1.5 hover:bg-gray-800/80 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Go back to main view"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300" aria-hidden="true" />
          </button>
        )}
        <div className="flex items-center gap-2 flex-1">
          {activeView === 'main' && (
            <div
              className="w-8 h-8 rounded-lg border-2 border-gray-700 shadow-lg"
              style={{ background: tempColor }}
              aria-label={`Current color: ${tempColor}`}
            />
          )}
          <span
            id="color-picker-title"
            className="text-sm font-bold text-gray-200"
          >
            {currentView.title}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-800/80 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label="Close color picker"
        >
          <X className="w-4 h-4 text-gray-400" aria-hidden="true" />
        </button>
      </div>

      {/* Main View - kept as is from your original code */}
      {activeView === 'main' && (
        <div className="p-5 space-y-4">
          {/* Canvas */}
          <div className="relative group">
            <canvas
              ref={canvasRef}
              width={348}
              height={200}
              onClick={onCanvasClick}
              className="w-full rounded-xl cursor-crosshair border-2 border-gray-700/50 hover:border-blue-500/50 transition-all shadow-lg"
              role="img"
              aria-label="Color gradient picker canvas. Click to select a color."
            />
            <div
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            >
              <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-semibold">
                Click to pick
              </div>
            </div>
          </div>

          {/* Hue Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="hue-slider"
                className="text-xs text-gray-400 font-semibold uppercase tracking-wider"
              >
                Hue
              </label>
              <span
                className="text-xs text-gray-500 font-mono"
                aria-live="polite"
              >
                {Math.round(getCurrentHue())}°
              </span>
            </div>
            <input
              id="hue-slider"
              type="range"
              min="0"
              max="360"
              step="1"
              value={getCurrentHue()}
              onChange={onHueChange}
              className="hue-slider w-full h-4 rounded-full appearance-none cursor-pointer"
              style={{
                background:
                  'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
              }}
              aria-label={`Hue value: ${Math.round(getCurrentHue())} degrees`}
            />
          </div>

          {/* Actions */}
          <div
            className="grid grid-cols-3 gap-2"
            role="group"
            aria-label="Color actions"
          >
            <button
              onClick={onRandom}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-br from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/50 rounded-lg text-purple-300 text-xs font-semibold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              type="button"
            >
              Random
            </button>
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-br from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/50 rounded-lg text-amber-300 text-xs font-semibold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              type="button"
            >
              Reset
            </button>
            <button
              onClick={onCopy}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-br from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/50 rounded-lg text-green-300 text-xs font-semibold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              type="button"
              aria-live="polite"
            >
              {copiedText === tempColor ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-950/80 to-gray-900/80 rounded-xl border border-gray-700/50">
            <div
              className="w-16 h-16 rounded-xl border-2 border-gray-700"
              style={{ background: tempColor }}
              role="img"
              aria-label={`Color preview: ${tempColor}`}
            />
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">Selected Color</div>
              <div className="text-sm font-mono text-gray-200 font-bold">
                {tempColor.toUpperCase()}
              </div>
              <div className="text-xs text-gray-500 font-mono">
                RGB: {getRgbValues()}
              </div>
            </div>
            <button
              onClick={onApply}
              className="px-5 py-3 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
              type="button"
              aria-label={`Apply color ${tempColor}`}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {activeView === 'palettes' && <div className="p-5">Palettes View</div>}
      {activeView === 'settings' && <ThemeSettingsView />}
    </div>
  );
};

export default PickerModal;
