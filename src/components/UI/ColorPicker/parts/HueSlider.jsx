const HueSlider = ({ value, onChange, getCurrentHue }) => {
  return (
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
        onChange={onChange}
        className="hue-slider w-full h-4 rounded-full appearance-none cursor-pointer outline-none focus:outline-none"
      />

      <style jsx>{`
        .hue-slider {
          background: linear-gradient(
            to right,
            #ff0000 0%,
            #ffff00 17%,
            #00ff00 33%,
            #00ffff 50%,
            #0000ff 67%,
            #ff00ff 83%,
            #ff0000 100%
          );
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
          transition: all 0.2s ease;
        }
        .hue-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
        }
        .hue-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid #1f2937;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          transition: all 0.2s ease;
        }
        .hue-slider::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </div>
  );
};

export default HueSlider;
