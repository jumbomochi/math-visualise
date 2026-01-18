/**
 * ComplexArithmetic Component
 *
 * Main component for complex number arithmetic visualization.
 * Covers addition, subtraction, multiplication, division, and polar form.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ArithmeticView from './ArithmeticView';
import PolarView from './PolarView';
import ControlPanel from './ControlPanel';
import MathDisplay from '@/components/ui/MathDisplay';
import { MainTab, ArithmeticOperation } from './types';
import { Complex } from '@/math/complex/types';
import {
  add,
  subtract,
  multiply,
  divide,
  modulus,
  argument,
  formatComplex,
  formatAngle,
  radToDeg,
  roundTo,
} from '@/math/complex/operations';

const ComplexArithmetic: React.FC = () => {
  const [mainTab, setMainTab] = useState<MainTab>('arithmetic');
  const [operation, setOperation] = useState<ArithmeticOperation>('add');
  const [z1, setZ1] = useState<Complex>({ re: 3, im: 2 });
  const [z2, setZ2] = useState<Complex>({ re: 1, im: 3 });

  // Compute results
  const computed = useMemo(() => {
    const addResult = add(z1, z2);
    const subResult = subtract(z1, z2);
    const mulResult = multiply(z1, z2);
    const divResult = divide(z1, z2);

    // Polar form for z1
    const mod1 = modulus(z1);
    const arg1 = argument(z1);

    return {
      add: addResult,
      subtract: subResult,
      multiply: mulResult,
      divide: divResult,
      modulus: roundTo(mod1, 3),
      argument: arg1,
      argumentDeg: roundTo(radToDeg(arg1), 1),
    };
  }, [z1, z2]);

  // Get current operation result
  const currentResult = useMemo(() => {
    switch (operation) {
      case 'add':
        return computed.add;
      case 'subtract':
        return computed.subtract;
      case 'multiply':
        return computed.multiply;
      case 'divide':
        return computed.divide;
    }
  }, [operation, computed]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Complex Numbers</h2>
        <p className="text-gray-600 mt-1">
          Visualize complex arithmetic and polar form on the Argand diagram.
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Visualization */}
        <div className="space-y-4">
          {mainTab === 'arithmetic' ? (
            <ArithmeticView
              z1={z1}
              z2={z2}
              operation={operation}
              result={currentResult.result}
            />
          ) : (
            <PolarView z={z1} />
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm justify-center">
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-[#f97316] rounded" /> z₁
            </span>
            {mainTab === 'arithmetic' && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-1 bg-[#06b6d4] rounded" /> z₂
              </span>
            )}
            {mainTab === 'arithmetic' && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-1 bg-[#eab308] rounded" /> Result
              </span>
            )}
            {mainTab === 'polar' && (
              <>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#10b981] rounded" /> Modulus
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#8b5cf6] rounded" /> Argument
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Controls and Results */}
        <div className="space-y-4">
          <ControlPanel
            mainTab={mainTab}
            operation={operation}
            z1={z1}
            z2={z2}
            onMainTabChange={setMainTab}
            onOperationChange={setOperation}
            onZ1Change={setZ1}
            onZ2Change={setZ2}
          />

          {/* Results */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {mainTab === 'arithmetic' ? 'Calculation' : 'Polar Form'}
            </h3>

            {mainTab === 'arithmetic' ? (
              <div className="flex justify-center">
                <MathDisplay math={currentResult.formulaLatex} display="block" />
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cartesian:</span>
                  <span className="font-mono font-semibold">
                    z = {formatComplex(z1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Modulus:</span>
                  <span className="font-mono">|z| = {computed.modulus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Argument:</span>
                  <span className="font-mono">
                    arg(z) = {computed.argumentDeg}°
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Polar:</span>
                  <MathDisplay
                    math={`z = ${computed.modulus}e^{i(${formatAngle(computed.argument)})}`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Educational note */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-wide mb-2">
              {mainTab === 'arithmetic'
                ? operation === 'add'
                  ? 'Addition'
                  : operation === 'subtract'
                  ? 'Subtraction'
                  : operation === 'multiply'
                  ? 'Multiplication'
                  : 'Division'
                : 'Modulus-Argument Form'}
            </h3>
            <p className="text-sm text-orange-900">
              {mainTab === 'arithmetic' && operation === 'add' && (
                <>
                  Add real and imaginary parts separately:{' '}
                  <MathDisplay math="(a+bi) + (c+di) = (a+c) + (b+d)i" />
                  Geometrically, this is the parallelogram law.
                </>
              )}
              {mainTab === 'arithmetic' && operation === 'subtract' && (
                <>
                  Subtract real and imaginary parts:{' '}
                  <MathDisplay math="(a+bi) - (c+di) = (a-c) + (b-d)i" />
                  Equivalent to adding the negative of z₂.
                </>
              )}
              {mainTab === 'arithmetic' && operation === 'multiply' && (
                <>
                  Use FOIL or polar form:{' '}
                  <MathDisplay math="(a+bi)(c+di) = (ac-bd) + (ad+bc)i" />
                  In polar: moduli multiply, arguments add.
                </>
              )}
              {mainTab === 'arithmetic' && operation === 'divide' && (
                <>
                  Multiply by conjugate:{' '}
                  <MathDisplay math="\frac{a+bi}{c+di} = \frac{(a+bi)(c-di)}{c^2+d^2}" />
                  In polar: moduli divide, arguments subtract.
                </>
              )}
              {mainTab === 'polar' && (
                <>
                  Every complex number can be written as:{' '}
                  <MathDisplay math="z = re^{i\theta} = r(\cos\theta + i\sin\theta)" />
                  where r = |z| and θ = arg(z).
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComplexArithmetic;
