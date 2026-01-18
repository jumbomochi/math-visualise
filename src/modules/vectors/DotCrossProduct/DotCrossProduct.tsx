/**
 * DotCrossProduct Component
 *
 * Main component for the dot and cross product visualization module.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import DotProductScene from './DotProductScene';
import CrossProductScene from './CrossProductScene';
import ControlPanel from './ControlPanel';
import MathDisplay from '@/components/ui/MathDisplay';
import { ProductOperation } from './types';
import { Vector3D } from '@/core/types';
import {
  dotProduct,
  crossProduct,
  magnitude,
  angleBetween,
  projectOnto,
  radToDeg,
  roundTo,
} from '@/math/vectors/operations';

const DotCrossProduct: React.FC = () => {
  const [operation, setOperation] = useState<ProductOperation>('dot');
  const [vectorA, setVectorA] = useState<Vector3D>({ x: 2, y: 3, z: 1 });
  const [vectorB, setVectorB] = useState<Vector3D>({ x: 1, y: 2, z: 0 });

  // Compute results
  const computed = useMemo(() => {
    const dot = dotProduct(vectorA, vectorB);
    const cross = crossProduct(vectorA, vectorB);
    const angle = angleBetween(vectorA, vectorB);
    const angleDeg = radToDeg(angle);
    const magA = magnitude(vectorA);
    const magB = magnitude(vectorB);
    const crossMag = magnitude(cross);
    const projection = projectOnto(vectorA, vectorB);

    return {
      dot: roundTo(dot, 2),
      cross,
      angle: roundTo(angleDeg, 1),
      magA: roundTo(magA, 2),
      magB: roundTo(magB, 2),
      crossMag: roundTo(crossMag, 2),
      projection,
      isPerpendicular: Math.abs(dot) < 0.01,
      isParallel: crossMag < 0.01 && magA > 0.01 && magB > 0.01,
      cosTheta: magA > 0 && magB > 0 ? roundTo(dot / (magA * magB), 3) : 0,
    };
  }, [vectorA, vectorB]);

  // Generate LaTeX formulas
  const dotFormulaLatex = useMemo(() => {
    const { x: a1, y: a2, z: a3 } = vectorA;
    const { x: b1, y: b2, z: b3 } = vectorB;
    return `\\mathbf{a} \\cdot \\mathbf{b} = (${a1})(${b1}) + (${a2})(${b2}) + (${a3})(${b3}) = ${computed.dot}`;
  }, [vectorA, vectorB, computed.dot]);

  const crossFormulaLatex = useMemo(() => {
    const { x: a1, y: a2, z: a3 } = vectorA;
    const { x: b1, y: b2, z: b3 } = vectorB;
    const { x: r1, y: r2, z: r3 } = computed.cross;
    return `\\mathbf{a} \\times \\mathbf{b} = \\begin{pmatrix} (${a2})(${b3}) - (${a3})(${b2}) \\\\ (${a3})(${b1}) - (${a1})(${b3}) \\\\ (${a1})(${b2}) - (${a2})(${b1}) \\end{pmatrix} = \\begin{pmatrix} ${roundTo(r1, 2)} \\\\ ${roundTo(r2, 2)} \\\\ ${roundTo(r3, 2)} \\end{pmatrix}`;
  }, [vectorA, vectorB, computed.cross]);

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
          Dot & Cross Product
        </h2>
        <p className="text-gray-600 mt-1">
          Explore the dot product (scalar result) and cross product (vector result) of 3D vectors.
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: 3D Scene */}
        <div className="space-y-4">
          {operation === 'dot' ? (
            <DotProductScene
              vectorA={vectorA}
              vectorB={vectorB}
              projection={computed.projection}
            />
          ) : (
            <CrossProductScene
              vectorA={vectorA}
              vectorB={vectorB}
              crossResult={computed.cross}
            />
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-[#f97316] rounded" />
              <span>Vector a</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-[#06b6d4] rounded" />
              <span>Vector b</span>
            </div>
            {operation === 'dot' && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-[#a3e635] rounded" />
                <span>Projection</span>
              </div>
            )}
            {operation === 'cross' && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-[#eab308] rounded" />
                <span>a × b</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Controls and Results */}
        <div className="space-y-6">
          <ControlPanel
            operation={operation}
            vectorA={vectorA}
            vectorB={vectorB}
            onOperationChange={setOperation}
            onVectorAChange={setVectorA}
            onVectorBChange={setVectorB}
          />

          {/* Results display */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Results
            </h3>

            {operation === 'dot' ? (
              <div className="space-y-2">
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
                  <div className="mt-2 p-2 bg-green-100 text-green-800 text-sm rounded">
                    Vectors are perpendicular (a · b = 0)
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cross product:</span>
                  <span className="font-mono font-semibold">
                    ({roundTo(computed.cross.x, 2)}, {roundTo(computed.cross.y, 2)}, {roundTo(computed.cross.z, 2)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">|a × b| (Area):</span>
                  <span className="font-mono">{computed.crossMag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">|a|:</span>
                  <span className="font-mono">{computed.magA}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">|b|:</span>
                  <span className="font-mono">{computed.magB}</span>
                </div>
                {computed.isParallel && (
                  <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 text-sm rounded">
                    Vectors are parallel (a × b = 0)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Formula display */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Calculation
            </h3>
            <div className="flex justify-center py-2 overflow-x-auto">
              <MathDisplay
                math={operation === 'dot' ? dotFormulaLatex : crossFormulaLatex}
                display="block"
              />
            </div>
          </div>

          {/* Educational note */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-2">
              {operation === 'dot' ? 'Dot Product' : 'Cross Product'}
            </h3>
            <p className="text-sm text-purple-900">
              {operation === 'dot' ? (
                <>
                  The dot product gives a <strong>scalar</strong> result:{' '}
                  <MathDisplay math="\mathbf{a} \cdot \mathbf{b} = |\mathbf{a}||\mathbf{b}|\cos\theta" />
                  {' '}When <strong>a · b = 0</strong>, the vectors are perpendicular.
                  The projection shows how much of <strong>a</strong> lies in the direction of <strong>b</strong>.
                </>
              ) : (
                <>
                  The cross product gives a <strong>vector</strong> perpendicular to both inputs:{' '}
                  <MathDisplay math="|\mathbf{a} \times \mathbf{b}| = |\mathbf{a}||\mathbf{b}|\sin\theta" />
                  {' '}The magnitude equals the area of the parallelogram formed by <strong>a</strong> and <strong>b</strong>.
                  Direction follows the right-hand rule.
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

export default DotCrossProduct;
