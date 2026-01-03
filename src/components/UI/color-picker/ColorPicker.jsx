import { useRef, useEffect } from "react";
import ColorInput from "./parts/ColorInput";
import PickerModal from "./PickerModal";
import { useColorConversion, useColorState } from "../../../hooks";
import { Palette } from "lucide-react";

/**
 * Full-featured color picker with modal
 */
const ColorPicker = ({
  label,
  value = "#3B82F6",
  onChange,
  className = "",
}) => {
  const pickerRef = useRef(null);
  const canvasRef = useRef(null);
  const { hexToRgb, rgbToHex, rgbToHsv, hsvToRgb } = useColorConversion();

  const {
    hexInput,
    setHexInput,
    tempColor,
    setTempColor,
    copiedText,
    activePalette,
    setActivePalette,
    isOpen,
    handleColorSelect,
    handleRandom,
    handleReset,
    handleCopy,
    toggleOpen,
    closeModal,
  } = useColorState(value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal]);

  useEffect(() => {
    setHexInput(value);
    setTempColor(value);
  }, [setHexInput, setTempColor, value]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (isOpen && canvasRef.current) {
      drawColorPicker();
    }
  }, [drawColorPicker, isOpen, tempColor]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(imageData[0], imageData[1], imageData[2]);
    handleColorSelect(hex);
  };

  const handleHueChange = (e) => {
    const hue = parseFloat(e.target.value);
    const rgb = hsvToRgb(hue, 100, 100);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    handleColorSelect(hex);
  };

  const handleHexChange = (e) => {
    let hex = e.target.value.trim();
    if (!hex.startsWith("#")) hex = "#" + hex;
    setHexInput(hex);
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      setTempColor(hex);
    }
  };

  const handleApply = () => {
    onChange(tempColor);
    closeModal();
  };

  const getCurrentHue = () => {
    const rgb = hexToRgb(tempColor);
    if (!rgb) return 0;
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    return hsv.h;
  };

  const getRgbValues = () => {
    const rgb = hexToRgb(tempColor);
    return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : "0, 0, 0";
  };

  return (
    <div className={`space-y-2 ${className}`} ref={pickerRef}>
      {label && (
        <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-400" />
          {label}
        </label>
      )}
      <div className="relative">
        <ColorInput
          value={value}
          hexInput={hexInput}
          onHexChange={handleHexChange}
          onToggle={toggleOpen}
          getRgbValues={getRgbValues}
        />
        <PickerModal
          isOpen={isOpen}
          tempColor={tempColor}
          canvasRef={canvasRef}
          activePalette={activePalette}
          setActivePalette={setActivePalette}
          copiedText={copiedText}
          onClose={closeModal}
          onCanvasClick={handleCanvasClick}
          onHueChange={handleHueChange}
          onColorSelect={handleColorSelect}
          onRandom={handleRandom}
          onReset={() => handleReset(value)}
          onCopy={() => handleCopy(tempColor)}
          onApply={handleApply}
          getCurrentHue={getCurrentHue}
          getRgbValues={getRgbValues}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
