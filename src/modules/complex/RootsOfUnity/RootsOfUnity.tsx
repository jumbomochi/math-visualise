/**
 * RootsOfUnity Component
 *
 * Main component for visualizing nth roots of unity and complex numbers.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import RootsView from './RootsView';
import ControlPanel from './ControlPanel';
import MathDisplay from '@/components/ui/MathDisplay';
import { Complex } from '@/math/complex/types';
import {
  rootsOfUnity,
  nthRoots,
  formatComplex,
} from '@/math/complex/operations';

const RootsOfUnity: React.FC = () => {
  const [n, setN] = useState<number>(4);
  const [baseNumber, setBaseNumber] = useState<Complex>({ re: 1, im: 0 });
  const [showUnityRoots, setShowUnityRoots] = useState<boolean>(true);

  // Compute roots
  const computed = useMemo(() => {
    const effectiveBase = showUnityRoots ? { re: 1, im: 0 } : baseNumber;
    const roots = showUnityRoots ? rootsOfUnity(n) : nthRoots(baseNumber, n);

    return {
      roots,
      baseNumber: effectiveBase,
    };
  }, [n, baseNumber, showUnityRoots]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Roots of Unity</h2>
        <p className="text-gray-600 mt-1">
          Visualize the nth roots of complex numbers and their symmetric distribution.
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Visualization */}
        <div className="space-y-4">
          <RootsView
            roots={computed.roots}
            baseNumber={computed.baseNumber}
            showConnections={true}
          />

          {/* Legend */}
          <div className="flex flex-wrap gap-2 text-sm justify-center">
            {computed.roots.slice(0, 8).map((_, index) => (
              <span key={index} className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: [
                      '#ef4444',
                      '#f97316',
                      '#eab308',
                      '#22c55e',
                      '#06b6d4',
                      '#3b82f6',
                      '#8b5cf6',
                      '#ec4899',
                    ][index % 8],
                  }}
                />
                <span className="text-xs text-gray-600">ω₍{index}₎</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right: Controls and Results */}
        <div className="space-y-4">
          <ControlPanel
            n={n}
            baseNumber={baseNumber}
            showUnityRoots={showUnityRoots}
            onNChange={setN}
            onBaseNumberChange={setBaseNumber}
            onShowUnityRootsChange={setShowUnityRoots}
          />

          {/* Results */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              The {n} Roots
            </h3>

            <div className="space-y-1 text-sm max-h-48 overflow-y-auto">
              {computed.roots.map((root, index) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <span className="text-gray-600 font-mono">ω₍{index}₎</span>
                  <span className="font-mono text-xs">
                    {formatComplex(root.value)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-center">
                <MathDisplay
                  math={
                    showUnityRoots
                      ? `\\omega_k = e^{\\frac{2\\pi i k}{${n}}}, \\quad k = 0, 1, ..., ${n - 1}`
                      : `\\omega_k = \\sqrt[${n}]{|z|} \\cdot e^{\\frac{i(\\theta + 2\\pi k)}{${n}}}`
                  }
                  display="block"
                />
              </div>
            </div>
          </div>

          {/* Educational note */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-wide mb-2">
              {showUnityRoots ? 'Roots of Unity' : 'nth Roots'}
            </h3>
            <p className="text-sm text-orange-900">
              {showUnityRoots ? (
                <>
                  The nth roots of unity are the n solutions to{' '}
                  <MathDisplay math="z^n = 1" />
                  They are evenly spaced on the unit circle, with angular separation{' '}
                  <MathDisplay math={`\\frac{2\\pi}{${n}}`} /> radians.
                  The primitive root is{' '}
                  <MathDisplay math={`\\omega = e^{\\frac{2\\pi i}{${n}}}`} />.
                </>
              ) : (
                <>
                  For any complex number z, there are exactly n distinct nth roots.
                  They lie on a circle of radius{' '}
                  <MathDisplay math="|z|^{1/n}" /> and are separated by{' '}
                  <MathDisplay math={`\\frac{2\\pi}{${n}}`} /> radians.
                  Each root ω satisfies <MathDisplay math={`\\omega^{${n}} = z`} />.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RootsOfUnity;
