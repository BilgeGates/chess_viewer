import { useState, useEffect, useCallback } from 'react';
import { logger } from '../utils/logger';

/**
 * useTheme - Advanced theme management hook with persistence
 * Manages board colors, themes, and provides preset theme switching
 */
export const useTheme = ({
  initialLight = '#f0d9b5',
  initialDark = '#b58863'
} = {}) => {
  const [lightSquare, setLightSquare] = useState(initialLight);
  const [darkSquare, setDarkSquare] = useState(initialDark);
  const [currentTheme, setCurrentTheme] = useState('custom');
  const [themeHistory, setThemeHistory] = useState([]);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Try cloud storage first
        if (window.storage) {
          const result = await window.storage.get('chess-theme');
          if (result && result.value) {
            const saved = JSON.parse(result.value);
            setLightSquare(saved.light || initialLight);
            setDarkSquare(saved.dark || initialDark);
            setCurrentTheme(saved.name || 'custom');
            return;
          }
        }

        // Fallback to localStorage
        const localTheme = window.localStorage.getItem('chess-theme');
        if (localTheme) {
          const saved = JSON.parse(localTheme);
          setLightSquare(saved.light || initialLight);
          setDarkSquare(saved.dark || initialDark);
          setCurrentTheme(saved.name || 'custom');
        }
      } catch (err) {
        logger.error('Failed to load theme:', err);
      }
    };

    const loadHistory = () => {
      try {
        const historyData = window.localStorage.getItem('theme-history');
        if (historyData) {
          setThemeHistory(JSON.parse(historyData));
        }
      } catch (err) {
        logger.error('Failed to load theme history:', err);
      }
    };

    loadTheme();
    loadHistory();
  }, [initialLight, initialDark]);

  // Save theme whenever it changes
  useEffect(() => {
    const saveTheme = async () => {
      const themeData = {
        light: lightSquare,
        dark: darkSquare,
        name: currentTheme,
        timestamp: Date.now()
      };

      const jsonData = JSON.stringify(themeData);

      try {
        // Save to localStorage
        window.localStorage.setItem('chess-theme', jsonData);

        // Save to cloud storage if available
        if (window.storage) {
          await window.storage.set('chess-theme', jsonData);
        }
      } catch (err) {
        logger.error('Failed to save theme:', err);
      }
    };

    const timeoutId = setTimeout(saveTheme, 500);
    return () => clearTimeout(timeoutId);
  }, [lightSquare, darkSquare, currentTheme]);

  // Modal controls
  const openThemeModal = useCallback(() => {
    setIsThemeModalOpen(true);
  }, []);

  const closeThemeModal = useCallback(() => {
    setIsThemeModalOpen(false);
  }, []);

  // Apply preset theme
  const applyTheme = useCallback(
    (themeKey, themeData) => {
      setLightSquare(themeData.light);
      setDarkSquare(themeData.dark);
      setCurrentTheme(themeKey);

      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        name: themeData.name || themeKey,
        light: themeData.light,
        dark: themeData.dark,
        timestamp: Date.now()
      };

      const updatedHistory = [
        newHistoryItem,
        ...themeHistory.filter(
          (h) => h.light !== themeData.light || h.dark !== themeData.dark
        )
      ].slice(0, 10);

      setThemeHistory(updatedHistory);

      try {
        window.localStorage.setItem(
          'theme-history',
          JSON.stringify(updatedHistory)
        );
      } catch (err) {
        logger.error('Failed to save theme history:', err);
      }
    },
    [themeHistory]
  );

  // Apply custom colors
  const applyCustomTheme = useCallback(
    (light, dark, name = 'Custom') => {
      setLightSquare(light);
      setDarkSquare(dark);
      setCurrentTheme(name);

      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        name,
        light,
        dark,
        timestamp: Date.now()
      };

      const updatedHistory = [
        newHistoryItem,
        ...themeHistory.filter((h) => h.light !== light || h.dark !== dark)
      ].slice(0, 10);

      setThemeHistory(updatedHistory);

      try {
        window.localStorage.setItem(
          'theme-history',
          JSON.stringify(updatedHistory)
        );
      } catch (err) {
        logger.error('Failed to save theme history:', err);
      }
    },
    [themeHistory]
  );

  // Reset to default theme
  const resetTheme = useCallback(() => {
    setLightSquare(initialLight);
    setDarkSquare(initialDark);
    setCurrentTheme('brown');
  }, [initialLight, initialDark]);

  // Get contrast ratio for accessibility
  const getContrastRatio = useCallback((color1, color2) => {
    const getLuminance = (hex) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = ((rgb >> 16) & 0xff) / 255;
      const g = ((rgb >> 8) & 0xff) / 255;
      const b = (rgb & 0xff) / 255;

      const [rs, gs, bs] = [r, g, b].map((c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      );

      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return ratio.toFixed(2);
  }, []);

  // Check if current colors have good contrast
  const hasGoodContrast = useCallback(() => {
    const ratio = parseFloat(getContrastRatio(lightSquare, darkSquare));
    return ratio >= 1.5; // Minimum readable contrast for chess board
  }, [lightSquare, darkSquare, getContrastRatio]);

  // Generate complementary color
  const generateComplementary = useCallback((hex) => {
    const num = parseInt(hex.slice(1), 16);
    const r = 255 - ((num >> 16) & 0xff);
    const g = 255 - ((num >> 8) & 0xff);
    const b = 255 - (num & 0xff);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }, []);

  // Lighten/Darken color
  const adjustBrightness = useCallback((hex, percent) => {
    const num = parseInt(hex.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amt));
    const G = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
    const B = Math.min(255, Math.max(0, (num & 0xff) + amt));
    return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
  }, []);

  // Clear theme history
  const clearThemeHistory = useCallback(() => {
    setThemeHistory([]);
    try {
      window.localStorage.removeItem('theme-history');
    } catch (err) {
      logger.error('Failed to clear theme history:', err);
    }
  }, []);

  // Export current theme
  const exportTheme = useCallback(() => {
    return {
      name: currentTheme,
      light: lightSquare,
      dark: darkSquare,
      contrastRatio: getContrastRatio(lightSquare, darkSquare),
      timestamp: Date.now()
    };
  }, [currentTheme, lightSquare, darkSquare, getContrastRatio]);

  // Import theme from data
  const importTheme = useCallback(
    (themeData) => {
      if (!themeData || !themeData.light || !themeData.dark) {
        throw new Error('Invalid theme data');
      }

      applyCustomTheme(
        themeData.light,
        themeData.dark,
        themeData.name || 'Imported'
      );
    },
    [applyCustomTheme]
  );

  return {
    // Current theme state
    lightSquare,
    darkSquare,
    currentTheme,
    themeHistory,

    // Modal state
    isThemeModalOpen,
    openThemeModal,
    closeThemeModal,

    // Setters
    setLightSquare,
    setDarkSquare,

    // Theme operations
    applyTheme,
    applyCustomTheme,
    resetTheme,
    clearThemeHistory,
    exportTheme,
    importTheme,

    // Utilities
    getContrastRatio,
    hasGoodContrast,
    generateComplementary,
    adjustBrightness
  };
};

/**
 * useThemePresets - Hook for managing theme presets
 */
export const useThemePresets = () => {
  const [customPresets, setCustomPresets] = useState([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('custom-theme-presets');
      if (saved) {
        setCustomPresets(JSON.parse(saved));
      }
    } catch (err) {
      logger.error('Failed to load custom presets:', err);
    }
  }, []);

  const savePreset = useCallback(
    (name, light, dark) => {
      const newPreset = {
        id: Date.now(),
        name,
        light,
        dark,
        timestamp: Date.now()
      };

      const updated = [...customPresets, newPreset];
      setCustomPresets(updated);

      try {
        window.localStorage.setItem(
          'custom-theme-presets',
          JSON.stringify(updated)
        );
      } catch (err) {
        logger.error('Failed to save preset:', err);
      }
    },
    [customPresets]
  );

  const deletePreset = useCallback(
    (id) => {
      const updated = customPresets.filter((p) => p.id !== id);
      setCustomPresets(updated);

      try {
        window.localStorage.setItem(
          'custom-theme-presets',
          JSON.stringify(updated)
        );
      } catch (err) {
        logger.error('Failed to delete preset:', err);
      }
    },
    [customPresets]
  );

  const clearPresets = useCallback(() => {
    setCustomPresets([]);
    try {
      window.localStorage.removeItem('custom-theme-presets');
    } catch (err) {
      logger.error('Failed to clear presets:', err);
    }
  }, []);

  return {
    customPresets,
    savePreset,
    deletePreset,
    clearPresets
  };
};

export default useTheme;
