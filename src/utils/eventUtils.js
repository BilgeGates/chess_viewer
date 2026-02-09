export { throttle, debounce, rafThrottle } from './performance';

export const passiveEventOptions = { passive: true };

/**
 * Detects browser support for passive event listeners.
 *
 * @returns {boolean} True if passive events are supported
 */
function detectPassiveSupport() {
  let supported = false;

  try {
    const testOptions = {
      get passive() {
        supported = true;
        return false;
      }
    };

    window.addEventListener('test', null, testOptions);
    window.removeEventListener('test', null, testOptions);
  } catch {
    supported = false;
  }

  return supported;
}

export const supportsPassive = detectPassiveSupport();
