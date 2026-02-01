import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { hexToRgb, rgbToHsv, hsvToRgb, rgbToHex } from '../../../../utils';
import { Check, RotateCcw } from 'lucide-react';

const ThemeAdvancedPickerView = memo(
  ({
    activeSquare,
    setActiveSquare,
    lightSquare,
    setLightSquare,
    darkSquare,
    setDarkSquare
  }) => {
    const canvasRef = useRef(null);
    const currentValue = activeSquare === 'light' ? lightSquare : darkSquare;
    const [tempColor, setTempColor] = useState(currentValue);

    useEffect(() => {
      setTempColor(currentValue);
    }, [currentValue, activeSquare]);

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

    const handleCanvasClick = useCallback((e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
      const ctx = canvas.getContext('2d');
      const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
      setTempColor(rgbToHex(r, g, b));
    }, []);

    const handleHueChange = useCallback((e) => {
      const rgb = hsvToRgb(parseFloat(e.target.value), 100, 100);
      setTempColor(rgbToHex(rgb.r, rgb.g, rgb.b));
    }, []);

    const getCurrentHue = useCallback(() => {
      const rgb = hexToRgb(tempColor);
      return rgb ? rgbToHsv(rgb.r, rgb.g, rgb.b).h : 0;
    }, [tempColor]);

    const handleApply = useCallback(() => {
      if (activeSquare === 'light') setLightSquare(tempColor);
      else setDarkSquare(tempColor);
    }, [activeSquare, tempColor, setLightSquare, setDarkSquare]);

    const handleReset = useCallback(() => {
      setTempColor(currentValue);
    }, [currentValue]);

    return (
      <div className="p-2 space-y-2">
        {/* Square Selector */}
        <div className="flex gap-1">
          {['light', 'dark'].map((sq) => (
            <button
              key={sq}
              onClick={() => setActiveSquare(sq)}
              className={`flex-1 py-1.5 text-xs font-medium rounded ${
                activeSquare === sq
                  ? sq === 'light'
                    ? 'bg-blue-600 text-white'
                    : 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {sq.charAt(0).toUpperCase() + sq.slice(1)}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={240}
          height={140}
          onClick={handleCanvasClick}
          className="w-full rounded cursor-crosshair border border-gray-700"
        />

        {/* Hue Slider */}
        <div>
          <div className="flex justify-between text-[9px] text-gray-500 mb-0.5">
            <span>Hue</span>
            <span>{Math.round(getCurrentHue())}deg</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={getCurrentHue()}
            onChange={handleHueChange}
            className="w-full h-2 rounded cursor-pointer"
            style={{
              background:
                'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
            }}
          />
        </div>

        {/* Preview + Apply */}
        <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded border border-gray-700/50">
          <div
            className="w-10 h-10 rounded border border-gray-600"
            style={{ backgroundColor: tempColor }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-[9px] text-gray-500">Selected</div>
            <div className="text-xs font-mono text-gray-200">
              {tempColor.toUpperCase()}
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-300" />
          </button>
          <button
            onClick={handleApply}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            Apply
          </button>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.activeSquare === next.activeSquare &&
    prev.lightSquare === next.lightSquare &&
    prev.darkSquare === next.darkSquare
);

ThemeAdvancedPickerView.displayName = 'ThemeAdvancedPickerView';
export default ThemeAdvancedPickerView;
