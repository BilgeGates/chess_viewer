import React, { useState, useId, useCallback, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const Select = React.memo(
  ({
    value,
    onChange,
    options,
    label,
    placeholder = 'Select...',
    disabled = false,
    id: providedId
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const generatedId = useId();
    const selectId = providedId || generatedId;
    const listboxId = `${selectId}-listbox`;
    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape' && isOpen) {
          setIsOpen(false);
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const handleKeyDown = useCallback(
      (e, optionValue) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onChange(optionValue);
          setIsOpen(false);
        }
      },
      [onChange]
    );

    return (
      <div className="space-y-2">
        {label && (
          <label
            id={`${selectId}-label`}
            className="block text-sm font-semibold text-text-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            id={selectId}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={label ? `${selectId}-label` : undefined}
            aria-controls={isOpen ? listboxId : undefined}
            className={`
            w-full px-4 py-2.5 bg-surface-hover/50 border border-border rounded-xl
            text-sm text-text-primary text-left
            flex items-center justify-between
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
            ${
              disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-border hover:bg-surface-hover'
            }
          `}
          >
            <span
              className={
                selectedOption ? 'text-text-primary' : 'text-text-muted'
              }
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-text-muted transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />
              <ul
                id={listboxId}
                role="listbox"
                aria-labelledby={label ? `${selectId}-label` : undefined}
                className="absolute top-full left-0 right-0 mt-1 bg-bg-secondary/95 backdrop-blur-lg border border-border rounded-xl shadow-elevated z-20 max-h-60 overflow-y-auto animate-scale-in"
              >
                {options.map((option) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={option.value === value}
                    tabIndex={0}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, option.value)}
                    className={`
                    px-4 py-2.5 cursor-pointer transition-all duration-150
                    flex items-center justify-between
                    focus:outline-none focus:bg-surface-hover
                    ${
                      option.value === value
                        ? 'bg-accent text-text-inverse'
                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                    }
                  `}
                  >
                    <span>{option.label}</span>
                    {option.value === value && (
                      <Check className="w-4 h-4" aria-hidden="true" />
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
