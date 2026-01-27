/**
 * ControlPanel Component
 *
 * Controls for the function basics visualization.
 */

import { FC } from 'react';
import { ControlPanelProps, MainTab, FunctionId } from './types';

const FUNCTION_OPTIONS: { id: FunctionId; label: string; latex: string }[] = [
  { id: 'linear', label: 'Linear', latex: 'x' },
  { id: 'quadratic', label: 'Quadratic', latex: 'x²' },
  { id: 'sqrt', label: 'Square Root', latex: '√x' },
  { id: 'reciprocal', label: 'Reciprocal', latex: '1/x' },
  { id: 'abs', label: 'Absolute', latex: '|x|' },
  { id: 'exp', label: 'Exponential', latex: 'eˣ' },
  { id: 'ln', label: 'Natural Log', latex: 'ln(x)' },
  { id: 'sin', label: 'Sine', latex: 'sin(x)' },
  { id: 'cos', label: 'Cosine', latex: 'cos(x)' },
];

const ControlPanel: FC<ControlPanelProps> = ({
  mainTab,
  functionF,
  functionG,
  domainMin,
  domainMax,
  onMainTabChange,
  onFunctionFChange,
  onFunctionGChange,
  onDomainChange,
}) => {
  const mainTabs: { id: MainTab; label: string }[] = [
    { id: 'domain-range', label: 'Domain & Range' },
    { id: 'composite', label: 'Composite' },
    { id: 'inverse', label: 'Inverse' },
  ];

  return (
    <div className="space-y-4">
      {/* Main tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
        {mainTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onMainTabChange(tab.id)}
            className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-colors ${
              mainTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
        {/* Function f selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mainTab === 'composite' ? 'Outer function f(x)' : 'Function f(x)'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {FUNCTION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onFunctionFChange(opt.id)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  functionF === opt.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {opt.latex}
              </button>
            ))}
          </div>
        </div>

        {/* Function g selector (only for composite) */}
        {mainTab === 'composite' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inner function g(x)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {FUNCTION_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onFunctionGChange(opt.id)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    functionG === opt.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {opt.latex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Domain controls (only for domain-range) */}
        {mainTab === 'domain-range' && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700">
              Domain restriction
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Min</label>
                <input
                  type="range"
                  min={-4}
                  max={domainMax - 0.5}
                  step={0.5}
                  value={domainMin}
                  onChange={(e) => onDomainChange(parseFloat(e.target.value), domainMax)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs font-mono text-gray-600">{domainMin}</span>
              </div>
              <div>
                <label className="text-xs text-gray-500">Max</label>
                <input
                  type="range"
                  min={domainMin + 0.5}
                  max={4}
                  step={0.5}
                  value={domainMax}
                  onChange={(e) => onDomainChange(domainMin, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs font-mono text-gray-600">{domainMax}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
