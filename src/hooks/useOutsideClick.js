import { useEffect } from 'react';

/**
 * Hook to detect clicks outside of a ref element
 * Useful for closing modals, dropdowns, etc.
 *
 * @param {React.RefObject} ref - Reference to the element
 * @param {Function} handler - Callback when click outside is detected
 * @param {boolean} enabled - Whether the hook is active (default: true)
 */
export const useOutsideClick = (ref, handler, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event) => {
      // Check if ref exists and click is outside
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handler(event);
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [ref, handler, enabled]);
};

export default useOutsideClick;
