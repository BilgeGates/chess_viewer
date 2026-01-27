import { useEffect, useCallback } from 'react';
import { hexToRgb, rgbToHsv, hsvToRgb, rgbToHex } from '../utils';

/**
 * Hook for canvas-based color picker
 * Draws a saturation/value gradient canvas for color selection
 *
 * @param {React.RefObject} canvasRef - Reference to canvas element
 * @param {string} currentColor - Current hex color
 * @returns {Object} Canvas interaction handlers
 */
export const useCanvasPicker = (canvasRef, currentColor) => {
  // Draw color picker canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const rgb = hexToRgb(currentColor);
    if (!rgb) return;

    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const hueRgb = hsvToRgb(hsv.h, 100, 100);

    // Horizontal gradient (white to hue)
    const gradientH = ctx.createLinearGradient(0, 0, width, 0);
    gradientH.addColorStop(0, 'white');
    gradientH.addColorStop(1, `rgb(${hueRgb.r}, ${hueRgb.g}, ${hueRgb.b})`);
    ctx.fillStyle = gradientH;
    ctx.fillRect(0, 0, width, height);

    // Vertical gradient (transparent to black)
    const gradientV = ctx.createLinearGradient(0, 0, 0, height);
    gradientV.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradientV.addColorStop(1, 'rgba(0, 0, 0, 1)');
    ctx.fillStyle = gradientV;
    ctx.fillRect(0, 0, width, height);
  }, [canvasRef, currentColor]);

  // Redraw when color changes
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle canvas click
  const handleCanvasClick = useCallback(
    (e, onColorSelect) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(x, y, 1, 1).data;

      const hex = rgbToHex(imageData[0], imageData[1], imageData[2]);
      if (onColorSelect) {
        onColorSelect(hex);
      }
    },
    [canvasRef]
  );

  return {
    drawCanvas,
    handleCanvasClick
  };
};

export default useCanvasPicker;
