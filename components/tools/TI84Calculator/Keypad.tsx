/**
 * TI-84 Plus CE Keypad Component
 * Full keyboard layout matching the actual calculator
 */

import { FC } from 'react';
import clsx from 'clsx';

interface KeypadProps {
  onKeyPress: (key: string) => void;
}

interface ButtonProps {
  primary: string;
  secondary?: string;
  alpha?: string;
  color?: 'blue' | 'dark' | 'light' | 'green' | 'yellow';
  className?: string;
  onClick: () => void;
  wide?: boolean;
}

const CalcButton: FC<ButtonProps> = ({ primary, secondary, alpha, color = 'light', onClick, className, wide }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'rounded px-1.5 py-2.5 text-[11px] font-bold transition-all active:scale-95 shadow-md flex flex-col items-center justify-center min-h-[42px] relative',
        color === 'blue' && 'bg-blue-600 text-white hover:bg-blue-700',
        color === 'dark' && 'bg-gray-800 text-white hover:bg-gray-900',
        color === 'light' && 'bg-gray-100 text-black hover:bg-gray-200 border border-gray-300',
        color === 'green' && 'bg-green-600 text-white hover:bg-green-700',
        color === 'yellow' && 'bg-yellow-500 text-black hover:bg-yellow-600',
        wide && 'col-span-2',
        className
      )}
    >
      {secondary && <span className="text-[8px] text-yellow-500 font-normal absolute top-0.5 left-1">{secondary}</span>}
      {alpha && <span className="text-[8px] text-green-500 font-normal absolute top-0.5 right-1">{alpha}</span>}
      <span className="text-xs mt-2">{primary}</span>
    </button>
  );
};

export const Keypad: FC<KeypadProps> = ({ onKeyPress }) => {
  return (
    <div className="grid grid-cols-5 gap-1 p-2 bg-gray-700 rounded-lg">
      {/* Row 1 - Y=, WINDOW, ZOOM, TRACE, GRAPH */}
      <CalcButton primary="Y=" secondary="STAT PLOT" color="blue" onClick={() => onKeyPress('Y=')} />
      <CalcButton primary="WINDOW" secondary="TBLSET" color="blue" onClick={() => onKeyPress('WINDOW')} />
      <CalcButton primary="ZOOM" secondary="FORMAT" color="blue" onClick={() => onKeyPress('ZOOM')} />
      <CalcButton primary="TRACE" secondary="CALC" color="blue" onClick={() => onKeyPress('TRACE')} />
      <CalcButton primary="GRAPH" secondary="TABLE" color="blue" onClick={() => onKeyPress('GRAPH')} />

      {/* Row 2 - 2ND, MODE, DEL, ←, → */}
      <CalcButton primary="2nd" color="yellow" onClick={() => onKeyPress('2ND')} />
      <CalcButton primary="MODE" secondary="QUIT" color="dark" onClick={() => onKeyPress('MODE')} />
      <CalcButton primary="DEL" secondary="INS" color="dark" onClick={() => onKeyPress('DEL')} />
      <CalcButton primary="◀" secondary="▲" color="dark" onClick={() => onKeyPress('LEFT')} />
      <CalcButton primary="▶" secondary="▼" color="dark" onClick={() => onKeyPress('RIGHT')} />

      {/* Row 3 - ALPHA, X,T,θ,n, STAT, ↑, ↓ */}
      <CalcButton primary="ALPHA" color="green" onClick={() => onKeyPress('ALPHA')} />
      <CalcButton primary="X,T,θ,n" secondary="LINK" alpha="A" onClick={() => onKeyPress('X')} />
      <CalcButton primary="STAT" secondary="LIST" alpha="B" onClick={() => onKeyPress('STAT')} />
      <CalcButton primary="↑" alpha="C" onClick={() => onKeyPress('UP')} />
      <CalcButton primary="↓" alpha="D" onClick={() => onKeyPress('DOWN')} />

      {/* Row 4 - MATH, APPS, PRGM, VARS, CLEAR */}
      <CalcButton primary="MATH" secondary="TEST" alpha="E" color="blue" onClick={() => onKeyPress('MATH')} />
      <CalcButton primary="APPS" secondary="ANGLE" alpha="F" color="blue" onClick={() => onKeyPress('APPS')} />
      <CalcButton primary="PRGM" secondary="DRAW" alpha="G" color="blue" onClick={() => onKeyPress('PRGM')} />
      <CalcButton primary="VARS" secondary="DISTR" alpha="H" color="blue" onClick={() => onKeyPress('VARS')} />
      <CalcButton primary="CLEAR" color="dark" onClick={() => onKeyPress('CLEAR')} />

      {/* Row 5 - x⁻¹, SIN, COS, TAN, ^ */}
      <CalcButton primary="x⁻¹" secondary="x²" alpha="I" onClick={() => onKeyPress('^-1')} />
      <CalcButton primary="SIN" secondary="SIN⁻¹" alpha="J" onClick={() => onKeyPress('sin(')} />
      <CalcButton primary="COS" secondary="COS⁻¹" alpha="K" onClick={() => onKeyPress('cos(')} />
      <CalcButton primary="TAN" secondary="TAN⁻¹" alpha="L" onClick={() => onKeyPress('tan(')} />
      <CalcButton primary="^" secondary="π" alpha="M" onClick={() => onKeyPress('^')} />

      {/* Row 6 - x², 0, ., (−), ENTER */}
      <CalcButton primary="x²" secondary="√" alpha="N" onClick={() => onKeyPress('^2')} />
      <CalcButton primary="0" secondary="CATALOG" alpha="O" onClick={() => onKeyPress('0')} />
      <CalcButton primary="." secondary="i" alpha=":" onClick={() => onKeyPress('.')} />
      <CalcButton primary="(−)" secondary="ANS" alpha="?" onClick={() => onKeyPress('NEG')} />
      <CalcButton primary="ENTER" secondary="ENTRY" color="blue" onClick={() => onKeyPress('ENTER')} />

      {/* Row 7 - LOG, 7, 8, 9, ÷ */}
      <CalcButton primary="LOG" secondary="10ˣ" alpha="P" onClick={() => onKeyPress('log(')} />
      <CalcButton primary="7" secondary="u" alpha="Q" onClick={() => onKeyPress('7')} />
      <CalcButton primary="8" secondary="v" alpha="R" onClick={() => onKeyPress('8')} />
      <CalcButton primary="9" secondary="w" alpha="S" onClick={() => onKeyPress('9')} />
      <CalcButton primary="÷" secondary="e" alpha="T" onClick={() => onKeyPress('/')} />

      {/* Row 8 - LN, 4, 5, 6, × */}
      <CalcButton primary="LN" secondary="eˣ" alpha="U" onClick={() => onKeyPress('ln(')} />
      <CalcButton primary="4" alpha="V" onClick={() => onKeyPress('4')} />
      <CalcButton primary="5" alpha="W" onClick={() => onKeyPress('5')} />
      <CalcButton primary="6" alpha="X" onClick={() => onKeyPress('6')} />
      <CalcButton primary="×" secondary="[" alpha="Y" onClick={() => onKeyPress('*')} />

      {/* Row 9 - STO→, 1, 2, 3, − */}
      <CalcButton primary="STO→" secondary="RCL" alpha="Z" onClick={() => onKeyPress('STO')} />
      <CalcButton primary="1" secondary="L₁" alpha="" onClick={() => onKeyPress('1')} />
      <CalcButton primary="2" secondary="L₂" alpha="θ" onClick={() => onKeyPress('2')} />
      <CalcButton primary="3" secondary="L₃" alpha="" onClick={() => onKeyPress('3')} />
      <CalcButton primary="−" secondary="]" alpha='"' onClick={() => onKeyPress('-')} />

      {/* Row 10 - ON, ., (−), +, (empty) */}
      <CalcButton primary="ON" color="dark" onClick={() => onKeyPress('ON')} />
      <CalcButton primary="," secondary="EE" alpha="" onClick={() => onKeyPress(',')} />
      <CalcButton primary="(" secondary="{" alpha="" onClick={() => onKeyPress('(')} />
      <CalcButton primary=")" secondary="}" alpha="" onClick={() => onKeyPress(')')} />
      <CalcButton primary="+" onClick={() => onKeyPress('+')} />
    </div>
  );
};
