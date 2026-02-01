import { memo, useId } from 'react';

/**
 * Checkbox Component
 * Pure, memoized for performance with proper accessibility
 */
const Checkbox = memo(
  ({ checked, onChange, label, className = '', id: providedId }) => {
    const generatedId = useId();
    const checkboxId = providedId || generatedId;

    return (
      <label
        htmlFor={checkboxId}
        className={`flex items-center gap-3 cursor-pointer group p-2 rounded-xl transition-colors hover:bg-gray-800/30 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 ${className}`}
      >
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer accent-emerald-500 rounded focus:outline-none"
        />
        <span className="text-sm font-semibold text-gray-200 transition-colors select-none">
          {label}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
