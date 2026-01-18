/**
 * Vectors2D Component
 *
 * Main component for 2D vector visualization module.
 * Covers operations (add, subtract, scalar) and dot product.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import OperationsView from './OperationsView';
import DotProductView from './DotProductView';
import ControlPanel from './ControlPanel';
import MathDisplay from '@/components/ui/MathDisplay';
import { MainTab, OperationSubTab } from './types';
import { Vector2D } from '@/math/vectors/types';
import {
  add2D,
  subtract2D,
  scalarMultiply2D,
  dotProduct2D,
  magnitude2D,
  angleBetween2D,
  projectOnto2D,
  radToDeg,
  roundTo,
} from '@/math/vectors/operations';

const Vectors2D: React.FC = () => {
  const [mainTab, setMainTab] = useState<MainTab>('operations');
  const [operationTab, setOperationTab] = useState<OperationSubTab>('add');
  const [vectorA, setVectorA] = useState<Vector2D>({ x: 3, y: 2 });
  const [vectorB, setVectorB] = useState<Vector2D>({ x: 1, y: 3 });
  const [scalar, setScalar] = useState<number>(2);

  // Compute results
  const computed = useMemo(() => {
    // Operations
    const addResult = add2D(vectorA, vectorB);
    const subResult = subtract2D(vectorA, vectorB);
    const scalarResult = scalarMultiply2D(scalar, vectorA);

    // Dot product
    const dot = dotProduct2D(vectorA, vectorB);
    const angle = angleBetween2D(vectorA, vectorB);
    const projection = projectOnto2D(vectorA, vectorB);
    const magA = magnitude2D(vectorA);
    const magB = magnitude2D(vectorB);

    return {
      addResult,
      subResult,
      scalarResult,
      dot: roundTo(dot, 2),
      angle: roundTo(radToDeg(angle), 1),
      angleRad: angle,
      projection,
      magA: roundTo(magA, 2),
      magB: roundTo(magB, 2),
      isPerpendicular: Math.abs(dot) < 0.01,
      cosTheta: magA > 0 && magB > 0 ? roundTo(dot / (magA * magB), 3) : 0,
    };
  }, [vectorA, vectorB, scalar]);

  // Get current operation result
  const currentResult = useMemo(() => {
    switch (operationTab) {
      case 'add':
        return computed.addResult;
      case 'subtract':
        return computed.subResult;
      case 'scalar':
        return computed.scalarResult;
    }
  }, [operationTab, computed]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">2D Vectors</h2>
        <p className="text-gray-600 mt-1">
          Explore vector operations and dot product in 2D — the foundation before moving to 3D.
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Visualization */}
        <div className="space-y-4">
          {mainTab === 'operations' ? (
            <OperationsView
              operation={operationTab}
              vectorA={vectorA}
              vectorB={vectorB}
              scalar={scalar}
              result={currentResult.result}
            />
          ) : (
            <DotProductView
              vectorA={vectorA}
              vectorB={vectorB}
              projection={computed.projection}
              angle={computed.angleRad}
            />
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm justify-center">
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-[#f97316] rounded" /> Vector a
            </span>
            {(mainTab === 'dotProduct' || operationTab !== 'scalar') && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-1 bg-[#06b6d4] rounded" /> Vector b
              </span>
            )}
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-[#eab308] rounded" /> Result
            </span>
            {mainTab === 'dotProduct' && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-1 bg-[#a3e635] rounded" /> Projection
              </span>
            )}
          </div>
        </div>

        {/* Right: Controls and Results */}
        <div className="space-y-4">
          <ControlPanel
            mainTab={mainTab}
            operationTab={operationTab}
            vectorA={vectorA}
            vectorB={vectorB}
            scalar={scalar}
            onMainTabChange={setMainTab}
            onOperationTabChange={setOperationTab}
            onVectorAChange={setVectorA}
            onVectorBChange={setVectorB}
            onScalarChange={setScalar}
          />

          {/* Results */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {mainTab === 'operations' ? 'Calculation' : 'Results'}
            </h3>

            {mainTab === 'operations' ? (
              <div className="flex justify-center">
                <MathDisplay math={currentResult.formulaLatex} display="block" />
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Dot product:</span>
                  <span className="font-mono font-semibold">a · b = {computed.dot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Angle:</span>
                  <span className="font-mono">θ = {computed.angle}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">|a|:</span>
                  <span className="font-mono">{computed.magA}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">|b|:</span>
                  <span className="font-mono">{computed.magB}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">cos θ:</span>
                  <span className="font-mono">{computed.cosTheta}</span>
                </div>
                {computed.isPerpendicular && (
                  <div className="mt-2 p-2 bg-green-100 text-green-800 text-xs rounded">
                    Vectors are perpendicular (a · b = 0)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Educational note */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-2">
              {mainTab === 'operations'
                ? operationTab === 'add'
                  ? 'Vector Addition'
                  : operationTab === 'subtract'
                  ? 'Vector Subtraction'
                  : 'Scalar Multiplication'
                : 'Dot Product'}
            </h3>
            <p className="text-sm text-purple-900">
              {mainTab === 'operations' && operationTab === 'add' && (
                <>
                  Add corresponding components:{' '}
                  <MathDisplay math="\mathbf{a} + \mathbf{b} = \begin{pmatrix} a_1 + b_1 \\ a_2 + b_2 \end{pmatrix}" />
                  {' '}The triangle law shows <strong>b</strong> placed at the tip of <strong>a</strong>.
                </>
              )}
              {mainTab === 'operations' && operationTab === 'subtract' && (
                <>
                  Subtract corresponding components:{' '}
                  <MathDisplay math="\mathbf{a} - \mathbf{b} = \begin{pmatrix} a_1 - b_1 \\ a_2 - b_2 \end{pmatrix}" />
                  {' '}Equivalent to adding <strong>a</strong> and <strong>-b</strong>.
                </>
              )}
              {mainTab === 'operations' && operationTab === 'scalar' && (
                <>
                  Multiply each component by k:{' '}
                  <MathDisplay math="k\mathbf{a} = \begin{pmatrix} ka_1 \\ ka_2 \end{pmatrix}" />
                  {' '}Scales the vector length. Negative k reverses direction.
                </>
              )}
              {mainTab === 'dotProduct' && (
                <>
                  The dot product:{' '}
                  <MathDisplay math="\mathbf{a} \cdot \mathbf{b} = a_1b_1 + a_2b_2 = |\mathbf{a}||\mathbf{b}|\cos\theta" />
                  {' '}When a · b = 0, vectors are perpendicular.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Vectors2D;
