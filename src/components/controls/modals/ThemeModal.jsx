import { useState } from "react";
import {
  ThemeMainView,
  ThemeAdvancedPickerView,
  ThemeSettingsView,
} from "../../UI/color-picker/views";
import { Palette, Sliders, Settings, X } from "lucide-react";

const ThemeModal = ({
  isOpen,
  onClose,
  lightSquare,
  setLightSquare,
  darkSquare,
  setDarkSquare,
  onNotification,
}) => {
  const [activeTab, setActiveTab] = useState("main");
  const [activeSquare, setActiveSquare] = useState("light");

  // Handle theme application from preset themes
  const handleThemeApply = (light, dark) => {
    setLightSquare(light);
    setDarkSquare(dark);

    if (onNotification) {
      onNotification("Theme applied successfully", "success");
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: "main", label: "Main", icon: Palette },
    { id: "picker", label: "Advanced Picker", icon: Sliders },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const viewConfig = {
    main: {
      title: "Board Theme",
      gradient: "from-blue-600/10 to-purple-600/10",
    },
    picker: {
      title: "Advanced Color Picker",
      gradient: "from-purple-600/10 to-pink-600/10",
    },
    settings: {
      title: "Theme Settings",
      gradient: "from-blue-600/10 to-cyan-600/10",
    },
  };

  const currentView = viewConfig[activeTab];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl animate-fadeIn">
        {/* Header */}
        <div
          className={`flex items-center gap-3 p-4 border-b border-gray-700/50 bg-gradient-to-r ${currentView.gradient}`}
        >
          <Palette className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-bold text-gray-200 flex-1">
            {currentView.title}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800/80 rounded-lg transition-all"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700/50 bg-gray-900/50">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === id
                  ? "text-white bg-gray-800/70 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/30"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          {activeTab === "main" && (
            <ThemeMainView
              currentLight={lightSquare}
              currentDark={darkSquare}
              onThemeApply={handleThemeApply}
              onApplyToBoard={handleThemeApply} // Live sync to board
            />
          )}

          {activeTab === "picker" && (
            <ThemeAdvancedPickerView
              activeSquare={activeSquare}
              setActiveSquare={setActiveSquare}
              lightSquare={lightSquare}
              setLightSquare={setLightSquare}
              darkSquare={darkSquare}
              setDarkSquare={setDarkSquare}
            />
          )}

          {activeTab === "settings" && <ThemeSettingsView />}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50 bg-gray-900/50">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl transition-all shadow-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeModal;
