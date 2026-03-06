import { memo } from 'react';
import { getButtonClasses } from '@/utils';

/**
 * Themed button supporting multiple visual variants, sizes, and an optional icon.
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Button label
 * @param {Function} [props.onClick] - Click handler
 * @param {'primary'|'secondary'|'ghost'|'danger'} [props.variant='primary'] - Visual style
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size
 * @param {React.ElementType} [props.icon] - Optional Lucide icon component rendered before children
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.fullWidth=false] - Whether the button should span the full container width
 * @param {string} [props.className=''] - Additional Tailwind classes
 * @param {'button'|'submit'|'reset'} [props.type='button'] - HTML button type
 * @param {string} [props['aria-label']] - Accessible label for icon-only buttons
 * @returns {JSX.Element}
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
