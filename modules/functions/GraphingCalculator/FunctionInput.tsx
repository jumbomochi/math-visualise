/**
 * Function Input Component
 *
 * Input field for mathematical function expressions with validation.
 */

import { FC, useState, useEffect } from 'react';
import { validateExpression } from './mathEngine';

interface FunctionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const FunctionInput: FC<FunctionInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter function...',
}) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const result = validateExpression(value);
    setError(result.valid ? null : result.error || 'Invalid expression');
  }, [value]);

  return (
    <div className="flex-1 relative">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 text-sm font-mono border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
          error
            ? 'border-red-300 focus:ring-red-200 bg-red-50'
            : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
        }`}
      />
      {error && value && (
        <div className="absolute -bottom-5 left-0 text-xs text-red-500">{error}</div>
      )}
    </div>
  );
};

export default FunctionInput;
