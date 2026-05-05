import { createContext, useContext, useState } from 'react';

const LayoutContext = createContext({
  navbarRightSlot: null,
  setNavbarRightSlot: () => {}
});

export function LayoutProvider({ children }) {
  const [navbarRightSlot, setNavbarRightSlot] = useState(null);

  return (
    <LayoutContext.Provider value={{ navbarRightSlot, setNavbarRightSlot }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
