import { memo } from 'react';
import { Check } from 'lucide-react';

/**
 * Clickable card for a single built-in color theme preset.
 * @param {Object} props
 * @param {Object} props.theme - Theme object with `light` and `dark` color keys
 * @param {string} props.themeKey - Unique identifier for this preset
 * @param {boolean} props.isActive - Whether this preset is currently applied
 * @param {boolean} props.isHovered - Whether this card is being hovered
 * @param {Function} props.onHover - Called with the theme object when the card is entered
 * @param {Function} props.onLeave - Called when the cursor leaves the card
 * @param {Function} props.onClick - Called with `(themeKey, theme)` when the card is selected
 * @returns {JSX.Element}
 */
const ThemePresetCard = memo(
  ({ theme, themeKey, isActive, isHovered, onHover, onLeave, onClick }) => {
    return (
      <button
        onClick={() => onClick(themeKey, theme)}
        onMouseEnter={() => onHover(theme)}
        onMouseLeave={onLeave}
        className={`
        group relative px-3 py-4 rounded-xl text-xs text-gray-300 
        transition-all duration-300 overflow-hidden
        ${
          isActive
            ? 'bg-blue-600/30 border-2 border-blue-500 scale-105'
            : 'bg-gray-900/80 border-2 border-gray-700 hover:border-blue-500/50'
        }
        ${isHovered ? 'scale-105' : ''}
      `}
      >
        <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity flex">
          <div className="w-1/2 h-full" style={{ background: theme.light }} />
          <div className="w-1/2 h-full" style={{ background: theme.dark }} />
        </div>

        <span className="relative z-10 font-semibold drop-shadow-md text-white">
          {theme.name}
        </span>

        {isActive && (
          <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </button>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isActive === nextProps.isActive &&
      prevProps.isHovered === nextProps.isHovered &&
      prevProps.themeKey === nextProps.themeKey
    );
  }
);

ThemePresetCard.displayName = 'ThemePresetCard';

export default ThemePresetCard;
