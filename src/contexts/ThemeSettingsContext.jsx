import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext
} from 'react';

const ThemeSettingsContext = createContext(null);

// Singleton AudioContext — created once on first use, reused on every playSound call.
// Creating a new AudioContext per call exhausts the browser's ~6-context limit.
let _sharedAudioCtx = null;
function getAudioCtx() {
  if (!_sharedAudioCtx) {
    _sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return _sharedAudioCtx;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeSettings = () => {
  const context = useContext(ThemeSettingsContext);
  if (!context) {
    throw new Error(
      'useThemeSettings must be used within ThemeSettingsProvider'
    );
  }
  return context;
};

const defaultSettings = {
  autoApply: false,
  showRGB: true,
  enableAnimations: true,
  showColorNames: false,
  enableKeyboardShortcuts: true,
  showHexValues: true,
  enableSoundEffects: false,
  compactMode: false,
  showRecentColors: true,
  enableColorBlindMode: false
};

export const ThemeSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('themeSettings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [recentColors, setRecentColors] = useState(() => {
    try {
      const saved = localStorage.getItem('recentColors');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Merge all DOM-class/style mutations into a single effect keyed on the
  // three settings that affect the document root. Avoids 3 separate effect
  // evaluations on every settings change.
  useEffect(() => {
    // Animations
    if (settings.enableAnimations) {
      document.documentElement.style.setProperty('--transition-speed', '0.2s');
      document.documentElement.classList.remove('no-animations');
    } else {
      document.documentElement.style.setProperty('--transition-speed', '0s');
      document.documentElement.classList.add('no-animations');
    }

    // Compact mode
    document.documentElement.classList.toggle(
      'compact-mode',
      Boolean(settings.compactMode)
    );

    // Color-blind mode
    document.documentElement.classList.toggle(
      'color-blind-mode',
      Boolean(settings.enableColorBlindMode)
    );
  }, [settings.enableAnimations, settings.compactMode, settings.enableColorBlindMode]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('themeSettings', JSON.stringify(settings));
  }, [settings]);

  // Save recent colors to localStorage
  useEffect(() => {
    localStorage.setItem('recentColors', JSON.stringify(recentColors));
  }, [recentColors]);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(newSettings);
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const addRecentColor = useCallback((color) => {
    if (!color) return;
    setRecentColors((prev) => {
      const filtered = prev.filter((c) => c !== color);
      return [color, ...filtered].slice(0, 12); // Keep max 12 recent colors
    });
  }, []);

  const clearRecentColors = useCallback(() => {
    setRecentColors([]);
  }, []);

  // Play sound effect if enabled
  const playSound = useCallback(
    (type = 'click') => {
      if (!settings.enableSoundEffects) return;

      try {
        const audioCtx = getAudioCtx();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const frequencies = {
          click: 800,
          success: 1200,
          error: 400
        };

        oscillator.frequency.value = frequencies[type] || 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
      } catch {
        // Audio not supported, ignore
      }
    },
    [settings.enableSoundEffects]
  );

  const value = {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
    recentColors,
    addRecentColor,
    clearRecentColors,
    playSound,
    defaultSettings
  };

  return (
    <ThemeSettingsContext.Provider value={value}>
      {children}
    </ThemeSettingsContext.Provider>
  );
};

export default ThemeSettingsContext;
