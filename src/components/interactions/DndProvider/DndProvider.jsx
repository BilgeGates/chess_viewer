import React, { useEffect, useState } from 'react';
import { DndProvider as ReactDndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

const DndProvider = ({ children }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      );
    };

    setIsTouchDevice(checkTouch());
  }, []);

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
};

export default DndProvider;
