/**
 * Vector3DOperations Component
 *
 * Main component for the 3D vector operations visualization module.
 * Allows students to explore vector addition, subtraction, and scalar multiplication.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Scene3D from './Scene3D';
import ControlPanel from './ControlPanel';
import MathDisplay from '@/components/ui/MathDisplay';
import { VectorOperation } from './types';
import { Vector3D } from '@/core/types';
import {
  addVectors,
  subtractVectors,
  scalarMultiply,
} from '@/math/vectors/operations';

const Vector3DOperations: React.FC = () => {
  // State for current operation
  const [operation, setOperation] = useState<VectorOperation>('addition');

  // State for vectors (preserved across tab switches)
  const [vectorA, setVectorA] = useState<Vector3D>({ x: 2, y: 1, z: 1 });
  const [vectorB, setVectorB] = useState<Vector3D>({ x: 1, y: 2, z: -1 });
  const [scalar, setScalar] = useState<number>(2);

  // Compute result based on operation
  const { result, formulaLatex } = useMemo(() => {
    switch (operation) {
      case 'addition':
        return addVectors(vectorA, vectorB);
      case 'subtraction':
        return subtractVectors(vectorA, vectorB);
      case 'scalar':
        return scalarMultiply(scalar, vectorA);
      default:
        return { result: { x: 0, y: 0, z: 0 }, formulaLatex: '' };
    }
  }, [operation, vectorA, vectorB, scalar]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          3D Vector Operations
        </h2>
        <p className="text-gray-600 mt-1">
          Explore vector addition, subtraction, and scalar multiplication in 3D space.
          Use the sliders to adjust vectors and observe how the operations work.
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: 3D Scene */}
        <div className="space-y-4">
          <Scene3D
            operation={operation}
            vectorA={vectorA}
            vectorB={vectorB}
            scalar={scalar}
            result={result}
          />

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-[#f97316] rounded" />
              <span>Vector a</span>
            </div>
            {operation !== 'scalar' && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-[#06b6d4] rounded" />
                <span>Vector b</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-[#eab308] rounded" />
              <span>Result</span>
            </div>
            <div className="flex items-center gap-2 ml-auto text-gray-500">
              <span className="text-[#ef4444]">x</span>
              <span className="text-[#22c55e]">y</span>
              <span className="text-[#3b82f6]">z</span>
              <span>axes</span>
            </div>
          </div>
        </div>

        {/* Right: Controls and Formula */}
        <div className="space-y-6">
          {/* Controls */}
          <ControlPanel
            operation={operation}
            vectorA={vectorA}
            vectorB={vectorB}
            scalar={scalar}
            onOperationChange={setOperation}
            onVectorAChange={setVectorA}
            onVectorBChange={setVectorB}
            onScalarChange={setScalar}
          />

          {/* Formula display */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Calculation
            </h3>
            <div className="flex justify-center py-2">
              <MathDisplay
                math={formulaLatex}
                display="block"
              />
            </div>
          </div>

          {/* Operation explanation */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-2">
              {operation === 'addition' && 'Vector Addition'}
              {operation === 'subtraction' && 'Vector Subtraction'}
              {operation === 'scalar' && 'Scalar Multiplication'}
            </h3>
            <p className="text-sm text-purple-900">
              {operation === 'addition' && (
                <>
                  To add vectors, add the corresponding components:{' '}
                  <MathDisplay
                    math="\\mathbf{a} + \\mathbf{b} = \\begin{pmatrix} a_1 + b_1 \\\\ a_2 + b_2 \\\\ a_3 + b_3 \\end{pmatrix}"
                  />
                  {' '}The parallelogram law shows that <strong>b</strong> starts from the tip of <strong>a</strong>.
                </>
              )}
              {operation === 'subtraction' && (
                <>
                  To subtract vectors, subtract the corresponding components:{' '}
                  <MathDisplay
                    math="\\mathbf{a} - \\mathbf{b} = \\begin{pmatrix} a_1 - b_1 \\\\ a_2 - b_2 \\\\ a_3 - b_3 \\end{pmatrix}"
                  />
                  {' '}This is equivalent to adding <strong>a</strong> and <strong>-b</strong>.
                </>
              )}
              {operation === 'scalar' && (
                <>
                  To multiply a vector by a scalar, multiply each component:{' '}
                  <MathDisplay
                    math="k\\mathbf{a} = \\begin{pmatrix} ka_1 \\\\ ka_2 \\\\ ka_3 \\end{pmatrix}"
                  />
                  {' '}The result is parallel to <strong>a</strong>, scaled by k (reversed if k &lt; 0).
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <span className="font-medium">Tip:</span>
        <span>Click and drag to rotate the 3D view. Scroll to zoom. Right-click to pan.</span>
      </div>
    </motion.div>
  );
};

export default Vector3DOperations;
