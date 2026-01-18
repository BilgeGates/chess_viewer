import { memo } from 'react';

/**
 * Button Component
 * Pure, reusable, optimized with React.memo
 * Supports aria-label for accessibility
 */
const Button = memo(
  ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    disabled = false,
    fullWidth = false,
    className = '',
    type = 'button',
    'aria-label': ariaLabel
  }) => {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-500 text-white',
      secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
      success: 'bg-green-600 hover:bg-green-500 text-white',
      danger: 'bg-red-600 hover:bg-red-500 text-white',
      outline:
        'bg-transparent hover:bg-gray-800 text-gray-300 border border-gray-600',
      ghost: 'bg-transparent hover:bg-gray-800 text-gray-300',
      gradient:
        'bg-gradient-to-br from-blue-600/20 to-purple-600/20 text-blue-300 hover:text-blue-400 border border-blue-500/50'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg font-semibold transition-all duration-200
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
        ${className}
      `}
      >
        {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
