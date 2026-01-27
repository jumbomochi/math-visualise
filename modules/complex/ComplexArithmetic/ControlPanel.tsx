/**
 * ControlPanel Component
 *
 * Controls for the complex arithmetic visualization.
 */

import { FC } from 'react';
import { ControlPanelProps, MainTab, ArithmeticOperation } from './types';
import { Complex } from '@/lib/math/complex/types';

const ControlPanel: FC<ControlPanelProps> = ({
  mainTab,
  operation,
  z1,
  z2,
  onMainTabChange,
  onOperationChange,
  onZ1Change,
  onZ2Change,
}) => {
  const mainTabs: { id: MainTab; label: string }[] = [
    { id: 'arithmetic', label: 'Arithmetic' },
    { id: 'polar', label: 'Polar Form' },
  ];

  const operations: { id: ArithmeticOperation; label: string; symbol: string }[] = [
    { id: 'add', label: 'Add', symbol: '+' },
    { id: 'subtract', label: 'Subtract', symbol: '−' },
    { id: 'multiply', label: 'Multiply', symbol: '×' },
    { id: 'divide', label: 'Divide', symbol: '÷' },
  ];

  const handleComplexChange = (
    current: Complex,
    field: 're' | 'im',
    value: number,
    onChange: (z: Complex) => void
  ) => {
    onChange({
      ...current,
      [field]: value,
    });
  };

  const ComplexSlider = ({
    label,
    value,
    onChange,
    color,
  }: {
    label: string;
    value: Complex;
    onChange: (z: Complex) => void;
    color: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${color}`} />
        <span className="font-medium text-gray-700">{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500">Re</label>
          <input
            type="range"
            min={-4}
            max={4}
            step={0.5}
            value={value.re}
            onChange={(e) =>
              handleComplexChange(value, 're', parseFloat(e.target.value), onChange)
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs font-mono text-gray-600">{value.re}</span>
        </div>
        <div>
          <label className="text-xs text-gray-500">Im</label>
          <input
            type="range"
            min={-4}
            max={4}
            step={0.5}
            value={value.im}
            onChange={(e) =>
              handleComplexChange(value, 'im', parseFloat(e.target.value), onChange)
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs font-mono text-gray-600">{value.im}i</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Main tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        {mainTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onMainTabChange(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mainTab === tab.id
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Operation tabs (only for arithmetic) */}
      {mainTab === 'arithmetic' && (
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          {operations.map((op) => (
            <button
              key={op.id}
              onClick={() => onOperationChange(op.id)}
              className={`flex-1 py-1.5 px-2 rounded-md text-sm font-medium transition-colors ${
                operation === op.id
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{op.symbol}</span>
            </button>
          ))}
        </div>
      )}

      {/* Complex number inputs */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
        <ComplexSlider
          label="z₁"
          value={z1}
          onChange={onZ1Change}
          color="bg-orange-500"
        />

        {mainTab === 'arithmetic' && (
          <ComplexSlider
            label="z₂"
            value={z2}
            onChange={onZ2Change}
            color="bg-cyan-500"
          />
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
