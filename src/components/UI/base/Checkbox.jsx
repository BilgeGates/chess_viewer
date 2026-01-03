import { memo } from "react";

/**
 * Checkbox Component
 * Pure, memoized for performance
 */
const Checkbox = memo(({ checked, onChange, label, className = "" }) => {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer group p-2 rounded-xl transition-colors hover:bg-gray-800/30 ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer accent-emerald-500 rounded"
      />
      <span className="text-sm font-semibold text-gray-200 transition-colors select-none">
        {label}
      </span>
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
