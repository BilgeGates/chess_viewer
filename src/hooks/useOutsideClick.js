import { useEffect, useRef } from 'react';

/**
 * Fires `handler` when a click event occurs outside the given `ref` element.
 *
 * @param {React.RefObject} ref - Target element ref
 * @param {function(MouseEvent): void} handler - Click outside handler
 * @param {boolean} [enabled=true] - Whether the listener is active
 * @returns {void}
 */
export function useOutsideClick(ref, handler, enabled = true) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handlerRef.current(event);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handlerRef.current(event);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [ref, enabled]);
}
export default useOutsideClick;
