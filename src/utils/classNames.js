/**
 * Common Tailwind Class Utilities
 * Reusable class combinations for consistency
 */

export const classNames = {
  // ===== BUTTON VARIANTS =====
  button: {
    base: 'rounded-lg font-semibold transition-smooth-fast flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
    primary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-md',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white shadow-md',
    success: 'bg-success-600 hover:bg-success-500 text-white shadow-md',
    danger: 'bg-danger-600 hover:bg-danger-500 text-white shadow-md',
    outline:
      'bg-transparent hover:bg-gray-800 text-gray-300 border border-gray-600',
    ghost: 'bg-transparent hover:bg-gray-800 text-gray-300',
    gradient: 'gradient-primary text-white shadow-glow-md hover:shadow-glow-lg',
    size: {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base'
    }
  },

  // ===== CARD VARIANTS =====
  card: {
    base: 'rounded-xl shadow-xl',
    gradient: 'gradient-dark',
    glass: 'glass',
    border: 'border border-gray-700/50',
    padding: {
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8'
    }
  },

  // ===== INPUT VARIANTS =====
  input: {
    base: 'w-full px-4 py-2.5 bg-gray-950/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 transition-smooth-fast focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    error: 'border-danger-500 focus:ring-danger-500 focus:border-danger-500',
    success:
      'border-success-500 focus:ring-success-500 focus:border-success-500'
  },

  // ===== MODAL VARIANTS =====
  modal: {
    overlay:
      'fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4',
    container:
      'gradient-card rounded-2xl border border-gray-700 shadow-2xl w-full max-h-[90vh] overflow-y-auto',
    header:
      'sticky top-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-700 p-4 flex items-center justify-between z-10',
    content: 'p-6'
  },

  // ===== TEXT VARIANTS =====
  text: {
    heading: {
      h1: 'text-3xl sm:text-4xl lg:text-5xl font-bold text-white',
      h2: 'text-2xl sm:text-3xl font-bold text-white',
      h3: 'text-xl sm:text-2xl font-bold text-white',
      h4: 'text-lg sm:text-xl font-semibold text-white'
    },
    body: {
      base: 'text-gray-300',
      sm: 'text-sm text-gray-400',
      xs: 'text-xs text-gray-500'
    },
    label: 'text-sm font-semibold text-gray-300'
  },

  // ===== LAYOUT =====
  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    page: 'min-h-screen bg-gray-900',
    section: 'py-12 sm:py-16 lg:py-24'
  },

  // ===== ANIMATION =====
  animation: {
    fadeIn: 'animate-fade-in',
    fadeInUp: 'animate-fade-in-up',
    fadeInDown: 'animate-fade-in-down',
    slideInLeft: 'animate-slide-in-left',
    slideInRight: 'animate-slide-in-right',
    scaleIn: 'animate-scale-in'
  }
};

/**
 * Utility function to combine class names
 * @param {...string} classes - Class names to combine
 * @returns {string} - Combined class string
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Get button classes
 * @param {string} variant - Button variant
 * @param {string} size - Button size
 * @param {string} className - Additional classes
 * @returns {string} - Combined button classes
 */
export const getButtonClasses = (
  variant = 'primary',
  size = 'md',
  className = ''
) => {
  return cn(
    classNames.button.base,
    classNames.button[variant],
    classNames.button.size[size],
    className
  );
};

/**
 * Get card classes
 * @param {boolean} gradient - Use gradient background
 * @param {boolean} glass - Use glass morphism effect
 * @param {string} padding - Padding size
 * @param {string} className - Additional classes
 * @returns {string} - Combined card classes
 */
export const getCardClasses = (
  gradient = false,
  glass = false,
  padding = 'md',
  className = ''
) => {
  return cn(
    classNames.card.base,
    gradient && classNames.card.gradient,
    glass && classNames.card.glass,
    !glass && classNames.card.border,
    classNames.card.padding[padding],
    className
  );
};

/**
 * Get input classes
 * @param {string} state - Input state (normal, error, success)
 * @param {string} className - Additional classes
 * @returns {string} - Combined input classes
 */
export const getInputClasses = (state = 'normal', className = '') => {
  return cn(
    classNames.input.base,
    state === 'error' && classNames.input.error,
    state === 'success' && classNames.input.success,
    className
  );
};
