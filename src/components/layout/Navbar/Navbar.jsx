import { memo, useCallback, useState } from 'react';

import { HelpCircle, Menu, Moon, Sun, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Logo from '@/assets/Logo.png';
import HelpCenter from '@/components/features/HelpCenter';

function Navbar({ theme, toggleTheme }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = useCallback(() => {
    navigate('/');
    setIsMobileMenuOpen(false);
  }, [navigate]);

  const handleHelpClick = useCallback(() => {
    setIsHelpOpen(true);
    setIsMobileMenuOpen(false);
  }, []);

  const handleCloseHelp = useCallback(() => {
    setIsHelpOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-surface-primary/85 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="w-[96%] max-w-[2200px] mx-auto">
          <div className="flex justify-between items-center h-[4rem] sm:h-[5rem] lg:h-[6rem] 3xl:h-[8rem]">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 transition-colors duration-300 text-text-primary hover:text-accent"
            >
              <div className="flex items-center gap-2">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-[2rem] h-[2rem] sm:w-[2.5rem] sm:h-[2.5rem] lg:w-[3rem] lg:h-[3rem] 3xl:w-[4rem] 3xl:h-[4rem] object-contain transition-transform duration-300 ease-in-out hover:scale-105"
                />
                <span className="font-display font-bold text-2xl sm:text-3xl text-text-primary leading-tight transition-colors duration-300 ease-in-out hover:text-accent">
                  FENForsty Pro
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={toggleTheme}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors duration-200 text-text-secondary hover:text-text-primary hover:bg-surface-hover active:bg-surface-elevated"
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
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 min-h-[44px] rounded-lg transition-colors duration-200 text-text-secondary hover:text-text-primary hover:bg-surface-hover active:bg-surface-elevated"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium hidden sm:inline">Help</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex sm:hidden items-center">
              <button
                onClick={toggleMobileMenu}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-48 border-b border-border/50 bg-surface-primary/95'
              : 'max-h-0'
          }`}
        >
          <div className="px-4 py-3 space-y-2">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center space-x-3 px-3 py-3 min-h-[44px] rounded-lg transition-colors duration-200 text-text-secondary hover:text-text-primary hover:bg-surface-hover active:bg-surface-elevated"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span className="font-medium text-base">Toggle Theme</span>
            </button>
            <button
              onClick={handleHelpClick}
              className="flex w-full items-center space-x-3 px-3 py-3 min-h-[44px] rounded-lg transition-colors duration-200 text-text-secondary hover:text-text-primary hover:bg-surface-hover active:bg-surface-elevated"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium text-base">Help</span>
            </button>
          </div>
        </div>
      </nav>

      <HelpCenter isOpen={isHelpOpen} onClose={handleCloseHelp} theme={theme} />
    </>
  );
}

export default memo(Navbar);
