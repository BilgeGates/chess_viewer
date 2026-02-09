import { useState, useEffect, useCallback, memo, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { throttle, passiveEventOptions, supportsPassive } from '@/utils';

import {
  Menu,
  X,
  Sun,
  Moon,
  Home,
  Info,
  HelpCircle,
  Download,
  Crown
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/about', label: 'About', icon: Info },
  { path: '/support', label: 'Support', icon: HelpCircle },
  { path: '/download', label: 'Download', icon: Download }
];

const Navbar = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const resizeHandlerRef = useRef(null);
  const scrollHandlerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();

    const throttledResize = throttle(checkMobile, 150);
    resizeHandlerRef.current = throttledResize;

    const eventOptions = supportsPassive ? passiveEventOptions : false;
    window.addEventListener('resize', throttledResize, eventOptions);

    return () => {
      window.removeEventListener('resize', throttledResize, eventOptions);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();

    const throttledScroll = throttle(handleScroll, 100);
    scrollHandlerRef.current = throttledScroll;

    const eventOptions = supportsPassive ? passiveEventOptions : false;
    window.addEventListener('scroll', throttledScroll, eventOptions);

    return () => {
      window.removeEventListener('scroll', throttledScroll, eventOptions);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleToggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleLogoClick = useCallback(() => {
    navigate('/');
    handleClose();
  }, [navigate, handleClose]);

  const handleLogoKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleLogoClick();
      }
    },
    [handleLogoClick]
  );

  return (
    <>
      <header
        className={`fixed rounded-none top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-card shadow-lg border-b border-border/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={handleLogoClick}
              onKeyDown={handleLogoKeyDown}
              role="button"
              tabIndex={0}
              aria-label="Go to home page"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent group-hover:border-accent transition-all duration-200">
                <Crown className="w-5 h-5 text-accent group-hover:text-bg transition-colors duration-200" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-display font-bold text-text-primary leading-tight group-hover:text-accent transition-colors duration-200">
                  Chess Diagram
                </h1>
                <p className="text-xs text-text-muted font-medium">Generator</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                        isActive
                          ? 'bg-accent text-bg'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="relative p-2.5 rounded-lg text-text-secondary hover:text-accent hover:bg-surface-elevated transition-all duration-200 hover:scale-105 group"
                aria-label={
                  isDark ? 'Switch to light mode' : 'Switch to dark mode'
                }
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <div className="relative w-5 h-5">
                  <Sun
                    className={`absolute inset-0 w-5 h-5 transition-all duration-200 ${
                      isDark
                        ? 'opacity-100 rotate-0 scale-100'
                        : 'opacity-0 rotate-90 scale-0'
                    }`}
                  />
                  <Moon
                    className={`absolute inset-0 w-5 h-5 transition-all duration-200 ${
                      isDark
                        ? 'opacity-0 -rotate-90 scale-0'
                        : 'opacity-100 rotate-0 scale-100'
                    }`}
                  />
                </div>
              </button>

              <button
                onClick={handleToggle}
                className="md:hidden p-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-all duration-200"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {!isMobile && isOpen && (
        <nav
          className="fixed top-0 right-0 h-full w-80 glass-card border-l border-border z-50 animate-slideInRight"
          aria-label="Main navigation"
        >
          <div className="flex flex-col h-full p-6">
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all duration-300 hover:rotate-90"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="flex items-center gap-3 mb-10 pt-10 cursor-pointer group"
              onClick={handleLogoClick}
              onKeyDown={handleLogoKeyDown}
              role="button"
              tabIndex={0}
              aria-label="Go to home page"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                <Crown className="w-6 h-6 text-bg" />
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-text-primary group-hover:text-accent transition-colors duration-300">
                  Chess Diagram
                </h1>
                <p className="text-xs text-text-muted">Generator</p>
              </div>
            </div>

            <div className="space-y-2 flex-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleClose}
                    className={({ isActive }) =>
                      `w-full px-5 py-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-3 stagger-${index + 1} animate-fadeIn ${
                        isActive
                          ? 'bg-accent text-bg shadow-md'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated hover:translate-x-1'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-xs text-text-muted text-center font-medium">
                Crafted with precision for chess enthusiasts
              </p>
            </div>
          </div>
        </nav>
      )}

      {isMobile && (
        <nav
          className={`fixed bottom-0 left-0 right-0 glass-card border-t border-border rounded-t-3xl z-50 transform transition-transform duration-300 ${
            isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          aria-label="Main navigation"
        >
          <div className="p-6 pb-8">
            <div
              className="w-12 h-1.5 bg-border/50 rounded-full mx-auto mb-6"
              aria-hidden="true"
            />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all duration-300"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="flex items-center justify-center gap-3 mb-6 pb-6 border-b border-border cursor-pointer group"
              onClick={handleLogoClick}
              onKeyDown={handleLogoKeyDown}
              role="button"
              tabIndex={0}
              aria-label="Go to home page"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                <Crown className="w-6 h-6 text-bg" />
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-text-primary group-hover:text-accent transition-colors duration-300">
                  Chess Diagram
                </h1>
                <p className="text-xs text-text-muted">Generator</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleClose}
                    className={({ isActive }) =>
                      `px-4 py-5 rounded-2xl text-sm font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                        isActive
                          ? 'bg-accent text-bg shadow-md scale-105'
                          : 'bg-surface-elevated text-text-secondary hover:text-text-primary hover:scale-105'
                      }`
                    }
                  >
                    <Icon className="w-6 h-6" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default memo(Navbar);
