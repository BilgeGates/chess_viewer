import { memo } from 'react';
import { Check } from 'lucide-react';

/**
 * Single Color Swatch
 * Highly optimized with React.memo
 */
const ColorSwatch = memo(
  ({ color, isSelected, onClick, size = 'md' }) => {
    const sizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12'
    };

    return (
      <button
        onClick={() => onClick(color)}
        className={`
        ${sizes[size]}
        rounded-lg border-2 transition-all
        hover:scale-105 active:scale-95 relative
        ${
          isSelected
            ? 'border-blue-500 scale-105 shadow-lg'
            : 'border-gray-700 hover:border-gray-600'
        }
      `}
        style={{ background: color }}
        aria-label={`Select color ${color}`}
      >
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          </div>
        )}
      </button>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if selection state changes
    return (
      prevProps.color === nextProps.color &&
      prevProps.isSelected === nextProps.isSelected
    );
  }
);

ColorSwatch.displayName = 'ColorSwatch';

export default ColorSwatch;
