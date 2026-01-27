import React from 'react';

const RangeSlider = React.memo(
  ({ min, max, step, value, onChange, className = '' }) => {
    return (
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={`
        flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500
        ${className}
      `}
      />
    );
  }
);

RangeSlider.displayName = 'RangeSlider';

export default RangeSlider;
