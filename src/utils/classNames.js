/**
 * Tailwind CSS class name utilities.
 * Provides reusable class combinations and helper functions.
 */

export const classNames = {
  button: {
    base: 'rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 focus-ring',
    primary:
      'bg-accent hover:bg-accent/90 text-text-inverse shadow-glow-sm hover:shadow-glow',
    secondary:
      'bg-accent-secondary hover:bg-accent-secondary/90 text-text-inverse',
    success: 'bg-success hover:bg-success/90 text-text-inverse',
    danger: 'bg-error hover:bg-error/90 text-text-inverse',
    outline:
      'bg-transparent hover:bg-surface-hover text-text-primary border border-border',
    ghost:
      'bg-transparent hover:bg-surface-hover text-text-secondary hover:text-text-primary',
    gradient:
      'bg-gradient-to-r from-accent to-accent-secondary text-text-inverse shadow-glow-sm hover:shadow-glow',
    size: {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base'
    }
  },

  card: {
    base: 'rounded-2xl shadow-elevated',
    gradient: 'bg-gradient-to-br from-bg-secondary to-bg-primary',
    glass: 'glass',
    border: 'border border-border/50 bg-bg-secondary',
    padding: {
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8'
    }
  },

  input: {
    base: 'w-full px-4 py-2.5 bg-surface-hover/50 border border-border rounded-xl text-text-primary placeholder-text-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
    error: 'border-error focus:ring-error/50 focus:border-error',
    success: 'border-success focus:ring-success/50 focus:border-success'
  },

  modal: {
    overlay: 'fixed inset-0 z-50 flex items-center justify-center p-4',
    container:
      'card-elevated rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto relative z-10',
    header:
      'sticky top-0 bg-bg-secondary/95 backdrop-blur-lg border-b border-border p-4 flex items-center justify-between z-10',
    content: 'p-6'
  },

  text: {
    heading: {
      h1: 'text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text-primary',
      h2: 'text-2xl sm:text-3xl font-display font-bold text-text-primary',
      h3: 'text-xl sm:text-2xl font-display font-bold text-text-primary',
      h4: 'text-lg sm:text-xl font-display font-semibold text-text-primary'
    },
    body: {
      base: 'text-text-secondary',
      sm: 'text-sm text-text-muted',
      xs: 'text-xs text-text-muted'
    },
    label: 'text-sm font-semibold text-text-secondary'
  },

  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    page: 'min-h-screen bg-bg-primary',
    section: 'py-12 sm:py-16 lg:py-24'
  },

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
 * Combines multiple CSS class names into a single string.
 * Filters out falsy values automatically.
 *
 * @param {...string} classes - Class names to combine
 * @returns {string} Combined class string
 */
export function cn(...classes) {
  const result = [];

  for (let i = 0; i < classes.length; i++) {
    if (classes[i]) {
      result.push(classes[i]);
    }
  }

  return result.join(' ');
}

/**
 * Gets CSS classes for a button component.
 *
 * @param {string} variant - Button variant (primary, secondary, danger, etc.)
 * @param {string} size - Button size (sm, md, lg)
 * @param {string} className - Additional CSS classes
 * @returns {string} Combined button classes
 */
export function getButtonClasses(
  variant = 'primary',
  size = 'md',
  className = ''
) {
  return cn(
    classNames.button.base,
    classNames.button[variant],
    classNames.button.size[size],
    className
  );
}

/**
 * Gets CSS classes for a card component.
 *
 * @param {boolean} gradient - Use gradient background
 * @param {boolean} glass - Use frosted glass effect
 * @param {string} padding - Padding size (sm, md, lg)
 * @param {string} className - Additional CSS classes
 * @returns {string} Combined card classes
 */
export function getCardClasses(
  gradient = false,
  glass = false,
  padding = 'md',
  className = ''
) {
  const gradientClass = gradient ? classNames.card.gradient : '';
  const backgroundClass = glass
    ? classNames.card.glass
    : classNames.card.border;

  return cn(
    classNames.card.base,
    gradientClass,
    backgroundClass,
    classNames.card.padding[padding],
    className
  );
}

/**
 * Gets CSS classes for an input field.
 *
 * @param {string} state - Input state (normal, error, success)
 * @param {string} className - Additional CSS classes
 * @returns {string} Combined input classes
 */
export function getInputClasses(state = 'normal', className = '') {
  let stateClass = '';

  if (state === 'error') {
    stateClass = classNames.input.error;
  } else if (state === 'success') {
    stateClass = classNames.input.success;
  }

  return cn(classNames.input.base, stateClass, className);
}
