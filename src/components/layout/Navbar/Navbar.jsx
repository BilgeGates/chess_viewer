import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import HelpCenter from '@/components/features/HelpCenter';
import Logo from '@/assets/Logo.png';
import { HelpCircle, Moon, Sun } from 'lucide-react';

/**
 * Fixed top navigation bar with logo, theme toggle, and help center button.
 * @param {Object} props
 * @param {'light'|'dark'} props.theme - Current theme name
 * @param {Function} props.toggleTheme - Toggles between light and dark theme
 * @returns {JSX.Element}
 */
function Navbar({ theme, toggleTheme }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  /**
   * Navigates to the home page when the logo is clicked.
   */
  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  /**
   * Opens the help center drawer.
   */
  const handleHelpClick = useCallback(() => {
    setIsHelpOpen(true);
  }, []);

  /**
   * Closes the help center drawer.
   */
  const handleCloseHelp = useCallback(() => {
    setIsHelpOpen(false);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <button
              onClick={handleLogoClick}
              className={`flex items-center space-x-2 transition-colors ${
                isDark
                  ? 'text-white hover:text-blue-400'
                  : 'text-gray-900 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-8 h-12 sm:w-10 sm:h-14"
                />
                <h1 className="font-display font-bold text-text-primary leading-tight group-hover:text-accent transition-colors duration-200">
                  FENForsty Pro
                </h1>
              </div>
            </button>

            {/* Right side buttons */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Help Button */}
              <button
                onClick={handleHelpClick}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors ${
                  isDark
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium hidden sm:inline">Help</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Help Center */}
      <HelpCenter isOpen={isHelpOpen} onClose={handleCloseHelp} theme={theme} />
    </>
  );
};

export default memo(Navbar);
