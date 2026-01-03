import { useState, useEffect } from "react";
import {
  Zap,
  Palette,
  Hash,
  Tag,
  Sparkles,
  Package,
  Keyboard,
  Volume2,
  Clock,
  Eye,
} from "lucide-react";

const ThemeSettingsView = () => {
  const defaultSettings = {
    autoApply: false,
    showRGB: true,
    enableAnimations: true,
    showColorNames: false,
    enableKeyboardShortcuts: true,
    showHexValues: true,
    enableSoundEffects: false,
    compactMode: false,
    showRecentColors: true,
    enableColorBlindMode: false,
  };

  const [savedSettings, setSavedSettings] = useState(() => {
    const saved = localStorage.getItem("themeSettings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [currentSettings, setCurrentSettings] = useState(savedSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed =
      JSON.stringify(currentSettings) !== JSON.stringify(savedSettings);
    setHasChanges(changed);
  }, [currentSettings, savedSettings]);

  const handleToggle = (key) => {
    setCurrentSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    localStorage.setItem("themeSettings", JSON.stringify(currentSettings));
    setSavedSettings(currentSettings);
    setHasChanges(false);
    if (currentSettings.enableAnimations) {
      document.documentElement.style.setProperty("--transition-speed", "0.2s");
    } else {
      document.documentElement.style.setProperty("--transition-speed", "0s");
    }
  };

  const handleCancel = () => {
    setCurrentSettings(savedSettings);
    setHasChanges(false);
  };

  const handleReset = () => {
    setCurrentSettings(defaultSettings);
  };

  const settingsConfig = [
    {
      key: "autoApply",
      label: "Auto Apply Colors",
      description: "Apply theme changes immediately when selected",
      icon: Zap,
      category: "Behavior",
    },
    {
      key: "showRGB",
      label: "Show RGB Values",
      description: "Display RGB color values in color picker",
      icon: Palette,
      category: "Display",
    },
    {
      key: "showHexValues",
      label: "Show HEX Values",
      description: "Display hexadecimal color codes",
      icon: Hash,
      category: "Display",
    },
    {
      key: "showColorNames",
      label: "Show Color Names",
      description: "Display human-readable color names",
      icon: Tag,
      category: "Display",
    },
    {
      key: "enableAnimations",
      label: "Enable Animations",
      description: "Smooth transitions and animated effects",
      icon: Sparkles,
      category: "Visual",
    },
    {
      key: "compactMode",
      label: "Compact Mode",
      description: "Reduce spacing and show more content",
      icon: Package,
      category: "Layout",
    },
    {
      key: "enableKeyboardShortcuts",
      label: "Keyboard Shortcuts",
      description: "Enable hotkeys for quick actions (Ctrl+S to save)",
      icon: Keyboard,
      category: "Behavior",
    },
    {
      key: "enableSoundEffects",
      label: "Sound Effects",
      description: "Play audio feedback for actions",
      icon: Volume2,
      category: "Feedback",
    },
    {
      key: "showRecentColors",
      label: "Recent Colors History",
      description: "Keep track of recently used colors",
      icon: Clock,
      category: "Features",
    },
    {
      key: "enableColorBlindMode",
      label: "Color Blind Assistance",
      description: "Enhanced contrast and pattern indicators",
      icon: Eye,
      category: "Accessibility",
    },
  ];

  const categories = [...new Set(settingsConfig.map((s) => s.category))];

  return (
    <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
      {/* Header Stats */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Active Settings</div>
          <div className="text-2xl font-bold text-white">
            {Object.values(currentSettings).filter(Boolean).length}
            <span className="text-sm text-gray-400 font-normal ml-1">/ 10</span>
          </div>
        </div>
        <div className="flex-1 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Status</div>
          <div className="text-sm font-semibold">
            {hasChanges ? (
              <span className="text-yellow-400">⚠️ Unsaved Changes</span>
            ) : (
              <span className="text-green-400">✓ All Saved</span>
            )}
          </div>
        </div>
      </div>

      {/* Settings by Category */}
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-700"></div>
              {category}
              <div className="h-px flex-1 bg-gray-700"></div>
            </h3>
            <div className="space-y-2">
              {settingsConfig
                .filter((s) => s.category === category)
                .map(({ key, label, description, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => handleToggle(key)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                      currentSettings[key]
                        ? "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/15"
                        : "bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        currentSettings[key] ? "text-blue-400" : "text-gray-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">
                        {label}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {description}
                      </div>
                    </div>
                    <div
                      className={`w-10 h-6 rounded-full relative transition-all ${
                        currentSettings[key] ? "bg-blue-600" : "bg-gray-600"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                          currentSettings[key] ? "left-5" : "left-1"
                        }`}
                      ></div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 mt-6 pt-4 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent">
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold rounded-lg transition-all border border-gray-700"
          >
            Reset to Default
          </button>
          <button
            onClick={handleCancel}
            disabled={!hasChanges}
            className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:text-gray-500 text-white text-sm font-semibold rounded-lg transition-all border border-gray-700 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg disabled:shadow-none disabled:cursor-not-allowed"
          >
            {hasChanges ? "Save Changes" : "Saved ✓"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettingsView;
