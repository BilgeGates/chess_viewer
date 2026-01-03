import React, { useState, useEffect, useRef, useCallback } from "react";
import { hexToRgb, rgbToHsv, hsvToRgb, rgbToHex } from "../../../../utils";
import { Check, RotateCcw, Palette, Copy } from "lucide-react";
import ColorPalettes from "../parts/ColorPalettes";
import ColorCanvas from "../parts/ColorCanvas";

const ThemeAdvancedPickerView = React.memo(
  ({
    activeSquare,
    setActiveSquare,
    lightSquare,
    setLightSquare,
    darkSquare,
    setDarkSquare,
  }) => {
    const canvasRef = useRef(null);
    const [tempColor, setTempColor] = useState(
      activeSquare === "light" ? lightSquare : darkSquare
    );
    const [copiedText, setCopiedText] = useState("");
    const [showPalettes, setShowPalettes] = useState(false);
    const [activePalette, setActivePalette] = useState("basic");
    const currentValue = activeSquare === "light" ? lightSquare : darkSquare;

    useEffect(() => {
      setTempColor(currentValue);
    }, [currentValue, activeSquare]);
    useEffect(() => {
      drawColorPicker();
    }, [tempColor]);

    const drawColorPicker = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;
      const rgb = hexToRgb(tempColor);
      if (!rgb) return;
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      const hueRgb = hsvToRgb(hsv.h, 100, 100);
      const gradientH = ctx.createLinearGradient(0, 0, width, 0);
      gradientH.addColorStop(0, "white");
      gradientH.addColorStop(1, `rgb(${hueRgb.r}, ${hueRgb.g}, ${hueRgb.b})`);
      ctx.fillStyle = gradientH;
      ctx.fillRect(0, 0, width, height);
      const gradientV = ctx.createLinearGradient(0, 0, 0, height);
      gradientV.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradientV.addColorStop(1, "rgba(0, 0, 0, 1)");
      ctx.fillStyle = gradientV;
      ctx.fillRect(0, 0, width, height);
    };

    useEffect(() => {
      drawColorPicker();
    }, [tempColor]);

    const handleCanvasClick = useCallback((e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
      const ctx = canvas.getContext("2d");
      const imageData = ctx.getImageData(x, y, 1, 1).data;
      const hex = rgbToHex(imageData[0], imageData[1], imageData[2]);
      setTempColor(hex);
    }, []);

    const handleHueChange = useCallback((e) => {
      const hue = parseFloat(e.target.value);
      const rgb = hsvToRgb(hue, 100, 100);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setTempColor(hex);
    }, []);

    const getCurrentHue = useCallback(() => {
      const rgb = hexToRgb(tempColor);
      if (!rgb) return 0;
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      return hsv.h;
    }, [tempColor]);

    const getRgbValues = useCallback(() => {
      const rgb = hexToRgb(tempColor);
      return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : "0, 0, 0";
    }, [tempColor]);

    const handleApply = useCallback(() => {
      if (activeSquare === "light") {
        setLightSquare(tempColor);
      } else {
        setDarkSquare(tempColor);
      }
    }, [activeSquare, tempColor, setLightSquare, setDarkSquare]);

    const handleReset = useCallback(() => {
      setTempColor(currentValue);
    }, [currentValue]);

    const handleCopy = useCallback((text) => {
      navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(""), 2000);
    }, []);

    const handlePaletteColorSelect = useCallback((color) => {
      setTempColor(color);
      setShowPalettes(false);
    }, []);

    return (
      <div className="p-5 space-y-4">
        {/* Square Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSquare("light")}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeSquare === "light"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
            }`}
          >
            Light Square
          </button>
          <button
            onClick={() => setActiveSquare("dark")}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeSquare === "dark"
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
            }`}
          >
            Dark Square
          </button>
        </div>

        {/* Color Canvas */}
        <ColorCanvas canvasRef={canvasRef} onClick={handleCanvasClick} />

        {/* Hue Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Hue
            </label>
            <span className="text-xs text-gray-500 font-mono">
              {Math.round(getCurrentHue())}°
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={getCurrentHue()}
            onChange={handleHueChange}
            className="hue-slider w-full h-4 rounded-full appearance-none cursor-pointer"
            style={{
              background:
                "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setShowPalettes(!showPalettes)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-br from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/50 rounded-lg text-purple-300 text-xs font-semibold transition-all active:scale-95"
          >
            <Palette className="w-3.5 h-3.5" />
            {showPalettes ? "Hide" : "Palettes"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-br from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/50 rounded-lg text-amber-300 text-xs font-semibold transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={() => handleCopy(tempColor)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-br from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/50 rounded-lg text-green-300 text-xs font-semibold transition-all active:scale-95"
          >
            <Copy className="w-3.5 h-3.5" />
            {copiedText === tempColor ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Color Palettes */}
        {showPalettes && (
          <div className="p-4 bg-gradient-to-br from-gray-950/80 to-gray-900/80 rounded-xl border border-gray-700/50 backdrop-blur-sm space-y-3 animate-slideDown">
            <ColorPalettes
              activePalette={activePalette}
              setActivePalette={setActivePalette}
              tempColor={tempColor}
              onColorSelect={handlePaletteColorSelect}
            />
            <div className="text-center text-xs text-gray-500 pt-2">
              Click any color to select
            </div>
          </div>
        )}

        {/* Selected Preview */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-950/80 to-gray-900/80 rounded-xl border border-gray-700/50 backdrop-blur-sm">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-xl border-2 border-gray-700 flex-shrink-0 shadow-xl"
              style={{ background: tempColor }}
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1 font-medium">
              Selected Color
            </div>
            <div className="text-sm font-mono text-gray-200 font-bold mb-0.5">
              {tempColor.toUpperCase()}
            </div>
            <button
              onClick={() => handleCopy(getRgbValues())}
              className="text-xs text-blue-400 hover:text-blue-300 font-mono transition-colors"
            >
              RGB: {getRgbValues()}
            </button>
          </div>
          <button
            onClick={handleApply}
            className="px-5 py-3 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Apply
          </button>
        </div>

        <style jsx>{`
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
          .animate-slideDown {
            animation: slideDown 0.3s ease-out;
          }
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.activeSquare === nextProps.activeSquare &&
      prevProps.lightSquare === nextProps.lightSquare &&
      prevProps.darkSquare === nextProps.darkSquare
    );
  }
);

ThemeAdvancedPickerView.displayName = "ThemeAdvancedPickerView";

export default ThemeAdvancedPickerView;
