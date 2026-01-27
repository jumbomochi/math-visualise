/**
 * Graphing Calculator Module
 *
 * Interactive graphing calculator for visualizing mathematical functions.
 * Supports multiple simultaneous functions with real-time updates.
 */

import { FC, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Eye, EyeOff, Settings } from 'lucide-react';
import { FunctionEntry, GraphWindow } from './types';
import { GraphCanvas } from './GraphCanvas';
import { FunctionInput } from './FunctionInput';
import { WindowSettings } from './WindowSettings';

const FUNCTION_COLORS = ['#2563eb', '#dc2626', '#16a34a', '#9333ea'];

const DEFAULT_WINDOW: GraphWindow = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
};

const createEmptyFunction = (index: number): FunctionEntry => ({
  id: crypto.randomUUID(),
  expression: '',
  color: FUNCTION_COLORS[index % FUNCTION_COLORS.length],
  visible: true,
});

export const GraphingCalculator: FC = () => {
  const [functions, setFunctions] = useState<FunctionEntry[]>([
    createEmptyFunction(0),
  ]);
  const [window, setWindow] = useState<GraphWindow>(DEFAULT_WINDOW);
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('RAD');
  const [showSettings, setShowSettings] = useState(false);

  const updateFunction = useCallback((id: string, expression: string) => {
    setFunctions(prev =>
      prev.map(f => (f.id === id ? { ...f, expression } : f))
    );
  }, []);

  const toggleFunctionVisibility = useCallback((id: string) => {
    setFunctions(prev =>
      prev.map(f => (f.id === id ? { ...f, visible: !f.visible } : f))
    );
  }, []);

  const addFunction = useCallback(() => {
    if (functions.length < 4) {
      setFunctions(prev => [...prev, createEmptyFunction(prev.length)]);
    }
  }, [functions.length]);

  const removeFunction = useCallback((id: string) => {
    if (functions.length > 1) {
      setFunctions(prev => prev.filter(f => f.id !== id));
    }
  }, [functions.length]);

  const resetWindow = useCallback(() => {
    setWindow(DEFAULT_WINDOW);
  }, []);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-6">
      {/* Graph Canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 min-h-[400px] lg:min-h-0"
      >
        <div className="bg-white rounded-xl shadow-lg h-full overflow-hidden">
          <GraphCanvas
            functions={functions}
            window={window}
            angleMode={angleMode}
          />
        </div>
      </motion.div>

      {/* Controls Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full lg:w-96 space-y-4"
      >
        {/* Function Inputs */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Functions</h3>
            <button
              onClick={addFunction}
              disabled={functions.length >= 4}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {functions.map((func, index) => (
              <div key={func.id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: func.color }}
                />
                <span className="text-sm font-mono text-gray-500 w-8">
                  Y{index + 1}=
                </span>
                <FunctionInput
                  value={func.expression}
                  onChange={expr => updateFunction(func.id, expr)}
                  placeholder="e.g., X^2, sin(X), 2*X+1"
                />
                <button
                  onClick={() => toggleFunctionVisibility(func.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                  title={func.visible ? 'Hide function' : 'Show function'}
                >
                  {func.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => removeFunction(func.id)}
                  disabled={functions.length <= 1}
                  className="p-1.5 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Remove function"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">
              <strong>Syntax:</strong> Use X for variable. Supports +, -, *, /, ^ (power),
              sin, cos, tan, log, ln, sqrt, pi, e
            </p>
          </div>
        </div>

        {/* Window Settings Toggle */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Window Settings</span>
          </div>
          <motion.div
            animate={{ rotate: showSettings ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </button>

        {/* Window Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <WindowSettings
              window={window}
              onWindowChange={setWindow}
              angleMode={angleMode}
              onAngleModeChange={setAngleMode}
              onReset={resetWindow}
            />
          </motion.div>
        )}

        {/* Quick Examples */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Examples</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Quadratic', expr: 'X^2' },
              { label: 'Cubic', expr: 'X^3' },
              { label: 'Sine', expr: 'sin(X)' },
              { label: 'Cosine', expr: 'cos(X)' },
              { label: 'Exponential', expr: 'e^X' },
              { label: 'Logarithm', expr: 'ln(X)' },
            ].map(({ label, expr }) => (
              <button
                key={expr}
                onClick={() => {
                  const emptyFunc = functions.find(f => !f.expression);
                  if (emptyFunc) {
                    updateFunction(emptyFunc.id, expr);
                  } else if (functions.length < 4) {
                    const newFunc = createEmptyFunction(functions.length);
                    newFunc.expression = expr;
                    setFunctions(prev => [...prev, newFunc]);
                  }
                }}
                className="px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GraphingCalculator;
