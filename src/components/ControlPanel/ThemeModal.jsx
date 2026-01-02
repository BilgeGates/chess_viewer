import { useState } from "react";
import ThemeMainView from "../UI/ColorPicker/views/ThemeMainView";
import ThemeAdvancedPickerView from "../UI/ColorPicker/views/ThemeAdvancedPickerView";
import ThemeSettingsView from "../UI/ColorPicker/views/ThemeSettingsView";
import { Palette, Sliders, Settings, X } from "lucide-react";

const ThemeModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("main");
  const [lightSquare, setLightSquare] = useState("#F0D9B5");
  const [darkSquare, setDarkSquare] = useState("#B58863");
  const [activeSquare, setActiveSquare] = useState("light");

  const handleThemeApply = (light, dark) => {
    setLightSquare(light);
    setDarkSquare(dark);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: "main", label: "Main", icon: Palette },
    { id: "picker", label: "Advanced Picker", icon: Sliders },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl animate-fadeIn">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-700/50 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <Palette className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-bold text-gray-200 flex-1">
            Board Theme
          </span>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800/80 rounded-lg transition-all"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Navbar */}
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
              {label}
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

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .hue-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid #1f2937;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        }
        .hue-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid #1f2937;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ThemeModal;
