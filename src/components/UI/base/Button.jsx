import { memo } from 'react';
import { getButtonClasses } from '../../../utils';

/**
 * Button Component
 * Pure, reusable, optimized with React.memo
 * Uses centralized class utilities for consistency
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
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        className={getButtonClasses(
          variant,
          size,
          `${fullWidth ? 'w-full' : ''} ${className}`
        )}
      >
        {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
