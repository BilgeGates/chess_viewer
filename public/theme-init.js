(function () {
  /**
   * Reads and validates the persisted theme preference from localStorage.
   * Returns only the string literals 'light' or 'dark' — nothing else.
   *
   * @returns {'light'|'dark'} Resolved theme value
   */
  const ALLOWED_THEMES = { light: true, dark: true };

  function getInitialTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem('chess-theme');
    } catch {
      saved = null;
    }

    if (saved && Object.prototype.hasOwnProperty.call(ALLOWED_THEMES, saved)) {
      return saved;
    }

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      return 'light';
    }

    return 'dark';
  }

  const theme = getInitialTheme();
  document.documentElement.setAttribute('data-theme', theme);
  window.__INITIAL_THEME__ = theme;
})();
