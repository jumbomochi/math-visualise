/**
 * Window Settings Component
 *
 * Controls for adjusting the graph viewing window and angle mode.
 */

import { FC } from 'react';
import { RotateCcw } from 'lucide-react';
import { GraphWindow } from './types';

interface WindowSettingsProps {
  window: GraphWindow;
  onWindowChange: (window: GraphWindow) => void;
  angleMode: 'DEG' | 'RAD';
  onAngleModeChange: (mode: 'DEG' | 'RAD') => void;
  onReset: () => void;
}

export const WindowSettings: FC<WindowSettingsProps> = ({
  window,
  onWindowChange,
  angleMode,
  onAngleModeChange,
  onReset,
}) => {
  const updateWindow = (key: keyof GraphWindow, value: number) => {
    onWindowChange({ ...window, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 space-y-4">
      {/* Axis Ranges */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">X Min</label>
          <input
            type="number"
            value={window.xMin}
            onChange={e => updateWindow('xMin', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">X Max</label>
          <input
            type="number"
            value={window.xMax}
            onChange={e => updateWindow('xMax', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Y Min</label>
          <input
            type="number"
            value={window.yMin}
            onChange={e => updateWindow('yMin', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Y Max</label>
          <input
            type="number"
            value={window.yMax}
            onChange={e => updateWindow('yMax', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
        </div>
      </div>

      {/* Angle Mode */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Angle Mode</label>
        <div className="flex gap-2">
          <button
            onClick={() => onAngleModeChange('RAD')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              angleMode === 'RAD'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Radians
          </button>
          <button
            onClick={() => onAngleModeChange('DEG')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              angleMode === 'DEG'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Degrees
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onWindowChange({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 })}
            className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Standard
          </button>
          <button
            onClick={() => onWindowChange({ xMin: -2 * Math.PI, xMax: 2 * Math.PI, yMin: -2, yMax: 2 })}
            className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Trig
          </button>
          <button
            onClick={() => onWindowChange({ xMin: -1, xMax: 5, yMin: -1, yMax: 10 })}
            className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Exponential
          </button>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Reset to Default
      </button>
    </div>
  );
};

export default WindowSettings;
