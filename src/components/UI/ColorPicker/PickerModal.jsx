import { useState } from "react";
import MainView from "./views/ThemeMainView";
import PalettesView from "./views/ThemeAdvancedPickerView";
import SettingsView from "./views/ThemeSettingsView";
import { X, ArrowLeft } from "lucide-react";

const PickerModal = ({
  isOpen,
  tempColor,
  canvasRef,
  activePalette,
  setActivePalette,
  copiedText,
  onClose,
  onCanvasClick,
  onHueChange,
  onColorSelect,
  onRandom,
  onReset,
  onCopy,
  onApply,
  getCurrentHue,
  getRgbValues,
}) => {
  const [activeView, setActiveView] = useState("main");

  if (!isOpen) return null;

  const viewConfig = {
    main: {
      title: "Advanced Color Picker",
      gradient: "from-blue-600/10 to-purple-600/10",
    },
    palettes: {
      title: "Color Palettes",
      gradient: "from-purple-600/10 to-pink-600/10",
    },
    settings: {
      title: "Settings",
      gradient: "from-blue-600/10 to-cyan-600/10",
    },
  };

  const currentView = viewConfig[activeView];

  return (
    <div className="absolute z-50 mt-2 w-[380px] bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
      <div
        className={`flex items-center gap-3 p-4 border-b border-gray-700/50 bg-gradient-to-r ${currentView.gradient}`}
      >
        {activeView !== "main" && (
          <button
            onClick={() => setActiveView("main")}
            className="p-1.5 hover:bg-gray-800/80 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </button>
        )}
        <div className="flex items-center gap-2 flex-1">
          {activeView === "main" && (
            <div
              className="w-8 h-8 rounded-lg border-2 border-gray-700 shadow-lg"
              style={{ background: tempColor }}
            />
          )}
          <span className="text-sm font-bold text-gray-200">
            {currentView.title}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-800/80 rounded-lg transition-all"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {activeView === "main" && (
        <MainView
          canvasRef={canvasRef}
          onCanvasClick={onCanvasClick}
          onHueChange={onHueChange}
          getCurrentHue={getCurrentHue}
          tempColor={tempColor}
          copiedText={copiedText}
          onRandom={onRandom}
          onReset={onReset}
          onCopy={onCopy}
          getRgbValues={getRgbValues}
          onApply={onApply}
          onOpenPalettes={() => setActiveView("palettes")}
          onOpenSettings={() => setActiveView("settings")}
        />
      )}

      {activeView === "palettes" && (
        <PalettesView
          activePalette={activePalette}
          setActivePalette={setActivePalette}
          tempColor={tempColor}
          onColorSelect={onColorSelect}
        />
      )}

      {activeView === "settings" && <SettingsView />}
    </div>
  );
};

export default PickerModal;
