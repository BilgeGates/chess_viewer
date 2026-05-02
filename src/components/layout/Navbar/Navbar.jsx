import { memo, useCallback, useState } from 'react';

import { HelpCircle, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Logo from '@/assets/Logo.png';
import HelpCenter from '@/components/features/HelpCenter';

function Navbar({ theme, toggleTheme }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const navigate = useNavigate();

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
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent animate-navbarSlideDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-2 transition-colors duration-300 text-text-primary hover:text-accent"
            >
              <div className="flex items-center gap-2 animate-iconBounceIn hover:scale-105 active:scale-95 transition-transform duration-300">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
                <span className="font-display font-bold text-text-primary leading-tight transition-all duration-300 hover:text-accent">
                  FENForsty Pro
                </span>
              </div>
            </button>

            <div className="flex items-center space-x-2 animate-fadeIn stagger-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-all duration-300 text-text-secondary hover:text-text-primary hover:bg-surface-hover hover:scale-110 active:scale-90 hover:rotate-12"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={handleHelpClick}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-text-secondary hover:text-text-primary hover:bg-surface-hover hover:scale-105 active:scale-95"
              >
                <HelpCircle className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                <span className="font-medium hidden sm:inline">Help</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <HelpCenter isOpen={isHelpOpen} onClose={handleCloseHelp} theme={theme} />
    </>
  );
}

export default memo(Navbar);
