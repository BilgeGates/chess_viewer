import { memo, useEffect, useRef, useState } from 'react';

import { Check, ChevronDown } from 'lucide-react';

/**
 * @param {Object} props
 * @returns {JSX.Element}
 */
const CustomSelect = memo(function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  label,
  icon
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);
  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };
  const selectedOption = options.find((opt) => opt.value === value);
  const displayIcon = selectedOption?.icon || icon;
  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-text-secondary mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent flex items-center justify-between gap-2 hover:bg-surface-hover transition-colors"
      >
        <div className="flex items-center gap-2">
          {displayIcon && <span className="flex-shrink-0">{displayIcon}</span>}
          <span className={value ? 'text-text-primary' : 'text-text-muted'}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-surface-elevated border border-border rounded-lg shadow-2xl overflow-hidden animate-scaleIn origin-top">
          <div className="py-1 max-h-64 overflow-y-auto">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full px-3 py-2 text-sm flex items-center justify-between gap-2 transition-colors
                    ${isSelected ? 'bg-accent/10 text-accent' : 'text-text-primary hover:bg-surface-hover'}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {option.icon && (
                      <span className="flex-shrink-0">{option.icon}</span>
                    )}
                    <span>{option.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-accent" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});
CustomSelect.displayName = 'CustomSelect';
export default CustomSelect;
