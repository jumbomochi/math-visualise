/**
 * TI-84 Plus CE Display Component
 */

import { FC } from 'react';
import { CalculatorMode } from './types';

interface DisplayProps {
  mode: CalculatorMode;
  display: string;
  input: string;
  angleMode: 'DEG' | 'RAD';
}

export const Display: FC<DisplayProps> = ({ mode, display, input, angleMode }) => {
  return (
    <div className="bg-white border-3 border-gray-800 rounded-lg p-2">
      {/* Status bar */}
      <div className="flex justify-between items-center text-[10px] font-mono mb-1 text-gray-600">
        <div className="flex gap-2">
          <span className={mode === 'GRAPH' ? 'font-bold' : ''}>
            {mode === 'GRAPH' ? '▶' : ''} {mode}
          </span>
        </div>
        <div className="flex gap-2">
          <span className={angleMode === 'RAD' ? 'font-bold' : ''}>RAD</span>
          <span className={angleMode === 'DEG' ? 'font-bold' : ''}>DEG</span>
        </div>
      </div>

      {/* Main display */}
      <div className="bg-[#9db89d] h-32 rounded p-2 font-mono text-xs overflow-hidden">
        <div className="flex flex-col justify-end h-full text-black">
          {/* Previous result/display */}
          {display && (
            <div className="text-right mb-1 opacity-70 text-[11px]">
              {display}
            </div>
          )}

          {/* Current input */}
          <div className="text-right font-bold flex items-center justify-end text-sm">
            {input || '0'}
            <span className="inline-block w-1.5 h-3 bg-black ml-1 animate-pulse"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
