/**
 * ControlPanel Component
 *
 * Controls for the roots of unity visualization.
 */

import { FC } from 'react';
import { ControlPanelProps } from './types';

const ControlPanel: FC<ControlPanelProps> = ({
  n,
  baseNumber,
  showUnityRoots,
  onNChange,
  onBaseNumberChange,
  onShowUnityRootsChange,
}) => {
  const handleComplexChange = (field: 're' | 'im', value: number) => {
    onBaseNumberChange({
      ...baseNumber,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      {/* Toggle: Unity vs Custom */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => onShowUnityRootsChange(true)}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            showUnityRoots
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Roots of Unity
        </button>
        <button
          onClick={() => onShowUnityRootsChange(false)}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            !showUnityRoots
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Custom z
        </button>
      </div>

      <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
        {/* n selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            n (degree of root)
          </label>
          <div className="flex gap-2 flex-wrap">
            {[2, 3, 4, 5, 6, 7, 8].map((value) => (
              <button
                key={value}
                onClick={() => onNChange(value)}
                className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                  n === value
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Finding {n}{n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'} roots
          </p>
        </div>

        {/* Custom base number (when not showing unity roots) */}
        {!showUnityRoots && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700">
              Base number z
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Re</label>
                <input
                  type="range"
                  min={-4}
                  max={4}
                  step={0.5}
                  value={baseNumber.re}
                  onChange={(e) => handleComplexChange('re', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs font-mono text-gray-600">{baseNumber.re}</span>
              </div>
              <div>
                <label className="text-xs text-gray-500">Im</label>
                <input
                  type="range"
                  min={-4}
                  max={4}
                  step={0.5}
                  value={baseNumber.im}
                  onChange={(e) => handleComplexChange('im', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs font-mono text-gray-600">{baseNumber.im}i</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
