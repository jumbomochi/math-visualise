/**
 * Slider Component
 *
 * Range slider for numerical inputs
 */

import { FC, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
  unit?: string;
}

const Slider: FC<SliderProps> = ({
  label,
  showValue = true,
  unit = '',
  value,
  min = 0,
  max = 100,
  step = 1,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="control-label">{label}</label>
          {showValue && (
            <span className="text-sm font-mono text-gray-600">
              {value}{unit}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        className={clsx(
          'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          '[&::-webkit-slider-thumb]:appearance-none',
          '[&::-webkit-slider-thumb]:w-4',
          '[&::-webkit-slider-thumb]:h-4',
          '[&::-webkit-slider-thumb]:bg-blue-600',
          '[&::-webkit-slider-thumb]:rounded-full',
          '[&::-webkit-slider-thumb]:cursor-pointer',
          '[&::-webkit-slider-thumb]:hover:bg-blue-700',
          '[&::-webkit-slider-thumb]:transition-colors',
          '[&::-moz-range-thumb]:w-4',
          '[&::-moz-range-thumb]:h-4',
          '[&::-moz-range-thumb]:bg-blue-600',
          '[&::-moz-range-thumb]:border-0',
          '[&::-moz-range-thumb]:rounded-full',
          '[&::-moz-range-thumb]:cursor-pointer',
          '[&::-moz-range-thumb]:hover:bg-blue-700',
          '[&::-moz-range-thumb]:transition-colors',
          className
        )}
        {...props}
      />
      {(min !== undefined || max !== undefined) && (
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};

export default Slider;
