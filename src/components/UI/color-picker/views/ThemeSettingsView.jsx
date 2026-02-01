import { useState, useCallback, useEffect } from 'react';
import { Zap, Eye, Grid3X3, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'chess-viewer-settings';

const ThemeSettingsView = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : {
            reduceAnimations: false,
            lowQualityPreview: false,
            compactBoard: false
          };
    } catch {
      return {
        reduceAnimations: false,
        lowQualityPreview: false,
        compactBoard: false
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      if (onSettingsChange) onSettingsChange(settings);

      // Apply reduce animations globally
      if (settings.reduceAnimations) {
        document.documentElement.style.setProperty(
          '--animation-duration',
          '0ms'
        );
      } else {
        document.documentElement.style.setProperty(
          '--animation-duration',
          '200ms'
        );
      }
    } catch (e) {
      console.warn('Settings save failed');
    }
  }, [settings, onSettingsChange]);

  const handleToggle = useCallback((key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleReset = useCallback(() => {
    const defaults = {
      reduceAnimations: false,
      lowQualityPreview: false,
      compactBoard: false
    };
    setSettings(defaults);
  }, []);

  const items = [
    {
      key: 'reduceAnimations',
      label: 'Reduce Animations',
      desc: 'Faster UI',
      icon: Zap
    },
    {
      key: 'lowQualityPreview',
      label: 'Fast Preview',
      desc: 'Lower quality, faster',
      icon: Eye
    },
    {
      key: 'compactBoard',
      label: 'Compact Board',
      desc: 'Smaller preview',
      icon: Grid3X3
    }
  ];

  return (
    <div className="p-2 space-y-2">
      {items.map(({ key, label, desc, icon: Icon }) => (
        <button
          key={key}
          onClick={() => handleToggle(key)}
          className="w-full p-2 bg-gray-900/50 hover:bg-gray-800/50 rounded border border-gray-700/40 flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Icon className="w-4 h-4 text-gray-400 shrink-0" />
            <div className="text-left min-w-0">
              <div className="text-xs font-medium text-gray-200">{label}</div>
              <div className="text-[10px] text-gray-500">{desc}</div>
            </div>
          </div>
          <div
            className={`w-8 h-4 rounded-full transition-colors ${settings[key] ? 'bg-primary-600' : 'bg-gray-700'}`}
          >
            <div
              className={`w-3 h-3 mt-0.5 rounded-full bg-white shadow transition-transform ${settings[key] ? 'translate-x-4.5 ml-0.5' : 'translate-x-0.5'}`}
            />
          </div>
        </button>
      ))}
      <button
        onClick={handleReset}
        className="w-full p-1.5 bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 text-[10px] font-medium rounded flex items-center justify-center gap-1"
      >
        <RotateCcw className="w-3 h-3" />
        Reset
      </button>
    </div>
  );
};

export default ThemeSettingsView;
