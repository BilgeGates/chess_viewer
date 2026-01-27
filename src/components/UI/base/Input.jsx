import React from 'react';
import { AlertCircle } from 'lucide-react';

const Input = React.memo(
  ({
    type = 'text',
    value,
    onChange,
    placeholder,
    label,
    error,
    disabled = false,
    icon: Icon,
    className = '',
    ...props
  }) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`
            w-full px-4 py-2.5
            ${Icon ? 'pl-10' : ''}
            bg-gray-950/50 rounded-lg
            text-sm text-gray-200
            outline-none focus:outline-none focus-visible:outline-none focus:ring-0
            transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border border-red-500' : 'border-gray-700'}
            ${className}
          `}
            {...props}
          />
        </div>
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
