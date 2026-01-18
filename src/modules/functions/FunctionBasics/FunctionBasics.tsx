/**
 * FunctionBasics Component
 *
 * Main component for function basics visualization.
 * Covers domain/range, composite functions, and inverse functions.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import DomainRangeView from './DomainRangeView';
import CompositeView from './CompositeView';
import InverseView from './InverseView';
import ControlPanel from './ControlPanel';
import MathDisplay from '@/components/ui/MathDisplay';
import { MainTab, FunctionId } from './types';
import { STANDARD_FUNCTIONS, findRange, compose } from '@/math/functions/operations';

const getFunctionById = (id: FunctionId) => {
  return STANDARD_FUNCTIONS.find((f) => f.id === id) || STANDARD_FUNCTIONS[0];
};

const FunctionBasics: React.FC = () => {
  const [mainTab, setMainTab] = useState<MainTab>('domain-range');
  const [functionF, setFunctionF] = useState<FunctionId>('quadratic');
  const [functionG, setFunctionG] = useState<FunctionId>('linear');
  const [domainMin, setDomainMin] = useState<number>(-2);
  const [domainMax, setDomainMax] = useState<number>(3);

  // Get function definitions
  const funcF = getFunctionById(functionF);
  const funcG = getFunctionById(functionG);

  // Compute results
  const computed = useMemo(() => {
    // Domain & Range
    const range = findRange(funcF.fn, domainMin, domainMax, 200);

    // Composite
    const composedFn = compose(funcF.fn, funcG.fn);

    return {
      rangeMin: Math.max(-10, range.min),
      rangeMax: Math.min(10, range.max),
      composedFn,
    };
  }, [funcF, funcG, domainMin, domainMax]);

  const handleDomainChange = (min: number, max: number) => {
    setDomainMin(min);
    setDomainMax(max);
  };

  // Check if inverse exists for current function
  const hasInverse = !['abs'].includes(functionF);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Functions & Graphs</h2>
        <p className="text-gray-600 mt-1">
          Explore domain, range, composition, and inverse functions.
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Visualization */}
        <div className="space-y-4">
          {mainTab === 'domain-range' && (
            <DomainRangeView
              functionId={functionF}
              domainMin={domainMin}
              domainMax={domainMax}
            />
          )}
          {mainTab === 'composite' && (
            <CompositeView functionF={functionF} functionG={functionG} />
          )}
          {mainTab === 'inverse' && <InverseView functionId={functionF} />}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm justify-center">
            {mainTab === 'domain-range' && (
              <>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#3b82f6] rounded" /> f(x)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#22c55e] rounded" /> Domain
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#f97316] rounded" /> Range
                </span>
              </>
            )}
            {mainTab === 'composite' && (
              <>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#3b82f6] rounded" /> f(x)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#22c55e] rounded" /> g(x)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#f97316] rounded" /> f(g(x))
                </span>
              </>
            )}
            {mainTab === 'inverse' && (
              <>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#3b82f6] rounded" /> f(x)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#f97316] rounded" /> f⁻¹(x)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#9ca3af] rounded" /> y = x
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Controls and Results */}
        <div className="space-y-4">
          <ControlPanel
            mainTab={mainTab}
            functionF={functionF}
            functionG={functionG}
            domainMin={domainMin}
            domainMax={domainMax}
            onMainTabChange={setMainTab}
            onFunctionFChange={setFunctionF}
            onFunctionGChange={setFunctionG}
            onDomainChange={handleDomainChange}
          />

          {/* Results */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {mainTab === 'domain-range'
                ? 'Analysis'
                : mainTab === 'composite'
                ? 'Composition'
                : 'Inverse'}
            </h3>

            {mainTab === 'domain-range' && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Function:</span>
                  <MathDisplay math={funcF.latex} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domain:</span>
                  <span className="font-mono">[{domainMin}, {domainMax}]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Range:</span>
                  <span className="font-mono">
                    [{computed.rangeMin.toFixed(2)}, {computed.rangeMax.toFixed(2)}]
                  </span>
                </div>
              </div>
            )}

            {mainTab === 'composite' && (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <MathDisplay
                    math={`(f \\circ g)(x) = f(g(x))`}
                    display="block"
                  />
                </div>
                <div className="text-sm text-center text-gray-600 mt-2">
                  <MathDisplay math={`f(x) = ${funcF.latex.replace('f(x) = ', '')}`} />
                  {', '}
                  <MathDisplay math={`g(x) = ${funcG.latex.replace('f(x) = ', '')}`} />
                </div>
              </div>
            )}

            {mainTab === 'inverse' && (
              <div className="space-y-2">
                {hasInverse ? (
                  <>
                    <div className="flex justify-center">
                      <MathDisplay
                        math={`f(f^{-1}(x)) = f^{-1}(f(x)) = x`}
                        display="block"
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      The graph of f⁻¹ is the reflection of f in the line y = x
                    </p>
                  </>
                ) : (
                  <div className="p-2 bg-yellow-100 text-yellow-800 text-sm rounded">
                    This function is not one-to-one, so no inverse exists
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Educational note */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-2">
              {mainTab === 'domain-range'
                ? 'Domain & Range'
                : mainTab === 'composite'
                ? 'Function Composition'
                : 'Inverse Functions'}
            </h3>
            <p className="text-sm text-blue-900">
              {mainTab === 'domain-range' && (
                <>
                  The <strong>domain</strong> is the set of all valid inputs (x-values).
                  The <strong>range</strong> is the set of all possible outputs (y-values).
                  Restricting the domain affects the range.
                </>
              )}
              {mainTab === 'composite' && (
                <>
                  For <MathDisplay math="(f \circ g)(x) = f(g(x))" />, first apply g to x,
                  then apply f to the result. The domain of f∘g is restricted by both functions.
                </>
              )}
              {mainTab === 'inverse' && (
                <>
                  If <MathDisplay math="f(a) = b" />, then <MathDisplay math="f^{-1}(b) = a" />.
                  A function has an inverse only if it is <strong>one-to-one</strong> (passes the horizontal line test).
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FunctionBasics;
