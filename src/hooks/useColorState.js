import { useState, useCallback, useRef, useEffect } from 'react';
import { logger } from '../utils/logger';

export const useColorState = (initialValue) => {
  const [hexInput, setHexInput] = useState(initialValue);
  const [tempColor, setTempColor] = useState(initialValue);
  const [copiedText, setCopiedText] = useState('');
  const [activePalette, setActivePalette] = useState('basic');
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleColorSelect = useCallback((color) => {
    setTempColor(color);
    setHexInput(color);
  }, []);

  const handleRandom = useCallback(() => {
    const randomColor =
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');
    setTempColor(randomColor);
    setHexInput(randomColor);
  }, []);

  const handleReset = useCallback((originalValue) => {
    setTempColor(originalValue);
    setHexInput(originalValue);
  }, []);

  const handleCopy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      logger.error('Failed to copy:', err);
    }
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    hexInput,
    setHexInput,
    tempColor,
    setTempColor,
    copiedText,
    activePalette,
    setActivePalette,
    isOpen,
    handleColorSelect,
    handleRandom,
    handleReset,
    handleCopy,
    toggleOpen,
    closeModal
  };
};
