import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

const ThemeSettingsContext = createContext(null);

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

  // Apply animation setting to CSS
  useEffect(() => {
    if (settings.enableAnimations) {
      document.documentElement.style.setProperty('--transition-speed', '0.2s');
      document.documentElement.classList.remove('no-animations');
    } else {
      document.documentElement.style.setProperty('--transition-speed', '0s');
      document.documentElement.classList.add('no-animations');
    }
  }, [settings.enableAnimations]);

  // Apply compact mode
  useEffect(() => {
    if (settings.compactMode) {
      document.documentElement.classList.add('compact-mode');
    } else {
      document.documentElement.classList.remove('compact-mode');
    }
  }, [settings.compactMode]);

  // Apply color blind mode
  useEffect(() => {
    if (settings.enableColorBlindMode) {
      document.documentElement.classList.add('color-blind-mode');
    } else {
      document.documentElement.classList.remove('color-blind-mode');
    }
  }, [settings.enableColorBlindMode]);

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

      // Create simple beep sounds using Web Audio API
      try {
        const audioCtx = new (
          window.AudioContext || window.webkitAudioContext
        )();
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

export const useThemeSettings = () => {
  const context = useContext(ThemeSettingsContext);
  if (!context) {
    throw new Error(
      'useThemeSettings must be used within a ThemeSettingsProvider'
    );
  }
  return context;
};

export default ThemeSettingsContext;
