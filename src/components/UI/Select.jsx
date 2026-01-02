import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";

const Select = ({
  value,
  onChange,
  options,
  label,
  placeholder = "Select...",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 bg-gray-950/50 border border-gray-700 rounded-lg
            text-sm text-gray-200 text-left
            flex items-center justify-between
            transition-all
            ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-gray-600"
            }
          `}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <ul className="absolute top-full left-0 right-0 mt-1 bg-gray-950/95 backdrop-blur-lg border border-gray-700 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    px-4 py-2.5 cursor-pointer transition-all
                    flex items-center justify-between
                    ${
                      option.value === value
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }
                  `}
                >
                  <span>{option.label}</span>
                  {option.value === value && <Check className="w-4 h-4" />}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Select;
