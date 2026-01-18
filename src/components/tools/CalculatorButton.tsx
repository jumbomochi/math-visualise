/**
 * Floating Calculator Button
 * Global button to toggle TI-84 calculator side panel
 */

import { FC } from 'react';
import { Calculator, ChevronLeft } from 'lucide-react';
import { useCalculatorStore } from '@/store/calculatorStore';
import clsx from 'clsx';

export const CalculatorButton: FC = () => {
  const { isOpen, toggle } = useCalculatorStore();

  return (
    <button
      onClick={toggle}
      className={clsx(
        'fixed bottom-6 right-6 z-40 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 px-4 py-3 rounded-full',
        isOpen
          ? 'bg-gray-700 hover:bg-gray-800'
          : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'
      )}
      aria-label="Toggle TI-84 Calculator"
      title={isOpen ? 'Hide TI-84 Calculator' : 'Show TI-84 Calculator'}
    >
      {isOpen ? (
        <>
          <span className="text-white text-sm font-semibold">TI-84</span>
          <ChevronLeft size={20} className="text-white" />
        </>
      ) : (
        <>
          <Calculator size={24} className="text-white" />
          <div className="bg-green-500 rounded-full px-2 py-0.5 text-white text-xs font-bold">
            84
          </div>
        </>
      )}
    </button>
  );
};
