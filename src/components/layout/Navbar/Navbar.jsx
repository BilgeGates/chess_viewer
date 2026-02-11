import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Moon, Sun } from 'lucide-react';
import HelpCenterDrawer from '@/components/features/HelpCenterDrawer/HelpCenterDrawer';
import Logo from '@/assets/Logo.png';

const Navbar = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleHelpClick = useCallback(() => {
    setIsHelpOpen(true);
  }, []);

  const handleCloseHelp = useCallback(() => {
    setIsHelpOpen(false);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-card shadow-lg border-b border-border/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
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
                <img src={Logo} alt="Logo" className="w-10 h-14" />
                <div className="hidden sm:block">
                  <h1 className="font-display font-bold text-text-primary leading-tight group-hover:text-accent transition-colors duration-200">
                    Chess Diagram
                  </h1>
                  <p className="text-sm text-text-muted font-medium text-left">
                    Generator
                  </p>
                </div>
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
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isDark
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">Help</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Help Center Drawer */}
      <HelpCenterDrawer
        isOpen={isHelpOpen}
        onClose={handleCloseHelp}
        theme={theme}
      />
    </>
  );
};

export default memo(Navbar);
