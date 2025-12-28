import { Canvg } from "canvg";

/**
 * Render SVG string into canvas with EXTREME MAXIMUM quality
 * Uses massive scale multiplier for supreme resolution
 */
export const svgToCanvas = async (svgString, canvas) => {
  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: false,
    willReadFrequently: false,
  });

  // EXTREME QUALITY MULTIPLIER
  // Target: 20,000px+ internal resolution
  const baseSize = canvas.width;
  let SCALE;

  if (baseSize <= 250) {
    SCALE = 90; // 200px → 18,000px+
  } else if (baseSize <= 350) {
    SCALE = 65; // 300px → 19,500px+
  } else if (baseSize <= 450) {
    SCALE = 50; // 400px → 20,000px+
  } else if (baseSize <= 550) {
    SCALE = 40; // 500px → 20,000px+
  } else {
    SCALE = 32; // 600px → 19,200px+
  }

  const cssWidth = canvas.width;
  const cssHeight = canvas.height;

  // Set MASSIVE internal resolution
  canvas.width = cssWidth * SCALE;
  canvas.height = cssHeight * SCALE;

  canvas.style.width = cssWidth + "px";
  canvas.style.height = cssHeight + "px";

  // Scale context to render at extreme resolution
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const v = await Canvg.fromString(ctx, svgString, {
    ignoreDimensions: true,
    ignoreClear: true,
    scaleWidth: cssWidth,
    scaleHeight: cssHeight,
  });

  await v.render();
};
