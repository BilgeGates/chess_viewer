import { DndProvider as ReactDndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

/**
 * @param {Object} props
 * @returns {JSX.Element}
 */
function DndProvider({ children }) {
  const isTouchDevice =
    typeof window !== 'undefined' &&
    (('ontouchstart' in window && navigator.maxTouchPoints > 0) ||
      !window.matchMedia('(pointer: fine)').matches);

  const touchBackendOptions = {
    enableMouseEvents: true,
    enableTouchEvents: true,
    delayTouchStart: 150,
    ignoreContextMenu: true
  };

  const Backend = isTouchDevice ? TouchBackend : HTML5Backend;
  const backendOptions = isTouchDevice ? touchBackendOptions : undefined;

  return (
    <ReactDndProvider backend={Backend} options={backendOptions}>
      {children}
    </ReactDndProvider>
  );
}
export default DndProvider;
