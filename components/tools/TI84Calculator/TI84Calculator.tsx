/**
 * TI-84 Plus CE Calculator Component
 * Collapsible right pane
 */

import { FC, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { INITIAL_STATE, CalculatorState } from './types';
import { Display } from './Display';
import { GraphDisplay } from './GraphDisplay';
import { Keypad } from './Keypad';
import { evaluateExpression, formatNumber, parseFunction } from './calculatorEngine';

interface TI84CalculatorProps {
  onClose: () => void;
}

export const TI84Calculator: FC<TI84CalculatorProps> = ({ onClose }) => {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const [secondMode, setSecondMode] = useState(false);

  const handleKeyPress = (key: string) => {
    console.log('Key pressed:', key); // Debug log

    setState((prev) => {
      const newState = { ...prev };

      switch (key) {
        case 'CLEAR':
          return { ...prev, input: '', display: '', mode: 'NORMAL' };

        case 'DEL':
          return { ...prev, input: prev.input.slice(0, -1) };

        case 'ENTER':
          if (prev.mode === 'NORMAL') {
            try {
              const result = evaluateExpression(prev.input, prev.angle);
              const formatted = formatNumber(result);
              return {
                ...prev,
                display: formatted,
                input: '',
                history: [...prev.history, prev.input],
                historyIndex: -1,
              };
            } catch (error) {
              return { ...prev, display: 'ERROR', input: '' };
            }
          }
          return prev;

        case 'Y=':
          return { ...prev, mode: 'NORMAL', input: '', display: 'Y1=' };

        case 'GRAPH':
          return { ...prev, mode: 'GRAPH' };

        case 'MODE':
          // Toggle angle mode
          return { ...prev, angle: prev.angle === 'DEG' ? 'RAD' : 'DEG' };

        case 'WINDOW':
          // Show window settings
          return {
            ...prev,
            display: `WINDOW\nXmin=${prev.window.xMin}\nXmax=${prev.window.xMax}\nYmin=${prev.window.yMin}\nYmax=${prev.window.yMax}`,
          };

        case 'ZOOM':
          // Standard zoom
          return {
            ...prev,
            window: { xMin: -10, xMax: 10, xScl: 1, yMin: -10, yMax: 10, yScl: 1 },
            display: 'ZStandard',
          };

        case 'ON':
          return INITIAL_STATE;

        case '2ND':
          setSecondMode(!secondMode);
          return prev;

        case 'X':
          return { ...prev, input: prev.input + 'X' };

        case 'sin(':
        case 'cos(':
        case 'tan(':
        case 'log(':
        case 'ln(':
        case '√(':
          return { ...prev, input: prev.input + key };

        case '^-1':
          return { ...prev, input: prev.input + '^(-1)' };

        case '^2':
          return { ...prev, input: prev.input + '^2' };

        case 'π':
          return { ...prev, input: prev.input + 'π' };

        case 'NEG':
        case '(-)':
          // Add negative sign
          if (prev.input === '' || /[\+\-\*\/\(\^]$/.test(prev.input)) {
            return { ...prev, input: prev.input + '(-)' };
          }
          return prev;

        case 'UP':
        case 'DOWN':
        case 'LEFT':
        case 'RIGHT':
        case 'STAT':
        case 'MATH':
        case 'APPS':
        case 'PRGM':
        case 'VARS':
        case 'TRACE':
        case 'ALPHA':
        case 'STO':
          // Buttons not yet implemented
          return prev;

        default:
          // Numbers and operators
          if (/^[0-9+\-*/\^().,]$/.test(key)) {
            return { ...prev, input: prev.input + key };
          }
          return prev;
      }
    });
  };

  // Handle function input in Y= mode
  const handleFunctionInput = (funcIndex: number, value: string) => {
    setState((prev) => {
      const newFunctions = [...prev.functions];
      try {
        newFunctions[funcIndex] = parseFunction(value);
      } catch {
        // Invalid function
      }
      return { ...prev, functions: newFunctions, activeFunction: funcIndex };
    });
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex flex-col border-l-4 border-gray-900 shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-blue-700">
        <div className="text-white font-bold">
          <div className="text-lg">TI-84 Plus CE</div>
          <div className="text-[10px] opacity-75">Texas Instruments</div>
        </div>
        <button
          onClick={onClose}
          className="bg-blue-700 hover:bg-blue-600 text-white rounded-lg p-2 transition-colors flex items-center gap-2"
          aria-label="Close calculator"
          title="Hide Calculator"
        >
          <ChevronRight size={18} />
          <span className="text-xs">Hide</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {/* Display */}
        {state.mode === 'GRAPH' ? (
          <GraphDisplay functions={state.functions} window={state.window} angleMode={state.angle} />
        ) : (
          <Display mode={state.mode} display={state.display} input={state.input} angleMode={state.angle} />
        )}

        {/* Function Editor (when in Y= mode) */}
        {state.display.includes('Y') && state.mode === 'NORMAL' && (
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-white text-sm font-mono space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <label className="text-yellow-400 w-8 text-xs">Y{i + 1}=</label>
                  <input
                    type="text"
                    value={state.functions[i]}
                    onChange={(e) => handleFunctionInput(i, e.target.value)}
                    className="flex-1 bg-gray-700 text-white px-2 py-1 rounded font-mono text-xs"
                    placeholder="Enter function (use X)"
                  />
                </div>
              ))}
              <div className="text-[10px] text-gray-400 mt-2">
                Use X for variable. Example: X^2, sin(X), 2*X+1
              </div>
            </div>
          </div>
        )}

        {/* Keypad */}
        <Keypad onKeyPress={handleKeyPress} />

        {/* Info */}
        <div className="text-center text-[10px] text-gray-300 py-2 border-t border-blue-800">
          <p className="font-semibold">Interactive TI-84 Plus CE</p>
          <p className="mt-1 opacity-75">
            Press Y= to enter functions, then GRAPH to plot
          </p>
        </div>
      </div>
    </div>
  );
};
