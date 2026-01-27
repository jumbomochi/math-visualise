/**
 * OperationsView Component
 *
 * SVG visualization for 2D vector operations (add, subtract, scalar).
 */

import { FC } from 'react';
import Canvas2D from './Canvas2D';
import VectorArrow2D from './VectorArrow2D';
import { OperationsViewProps } from './types';
import { Vector2D } from '@/lib/math/vectors/types';

const COLORS = {
  a: '#f97316',
  b: '#06b6d4',
  result: '#eab308',
  negB: '#06b6d4',
};

const OperationsView: FC<OperationsViewProps> = ({
  operation,
  vectorA,
  vectorB,
  scalar,
  result,
}) => {
  const origin: Vector2D = { x: 0, y: 0 };

  return (
    <div className="flex justify-center">
      <Canvas2D width={400} height={400} range={6}>
        {operation === 'add' && (
          <>
            {/* Vector A from origin */}
            <VectorArrow2D
              start={origin}
              end={vectorA}
              color={COLORS.a}
              label="a"
            />
            {/* Vector B from tip of A (triangle law) */}
            <VectorArrow2D
              start={vectorA}
              end={{ x: vectorA.x + vectorB.x, y: vectorA.y + vectorB.y }}
              color={COLORS.b}
              label="b"
            />
            {/* Result from origin */}
            <VectorArrow2D
              start={origin}
              end={result}
              color={COLORS.result}
              label="a+b"
              strokeWidth={4}
            />
          </>
        )}

        {operation === 'subtract' && (
          <>
            {/* Vector A from origin */}
            <VectorArrow2D
              start={origin}
              end={vectorA}
              color={COLORS.a}
              label="a"
            />
            {/* Vector B (dashed, for reference) */}
            <VectorArrow2D
              start={origin}
              end={vectorB}
              color={COLORS.b}
              label="b"
              dashed
              strokeWidth={2}
            />
            {/* -B vector */}
            <VectorArrow2D
              start={origin}
              end={{ x: -vectorB.x, y: -vectorB.y }}
              color={COLORS.negB}
              label="-b"
            />
            {/* Result from origin */}
            <VectorArrow2D
              start={origin}
              end={result}
              color={COLORS.result}
              label="a-b"
              strokeWidth={4}
            />
          </>
        )}

        {operation === 'scalar' && (
          <>
            {/* Original vector A (dashed) */}
            <VectorArrow2D
              start={origin}
              end={vectorA}
              color={COLORS.a}
              label="a"
              dashed
              strokeWidth={2}
            />
            {/* Scaled result */}
            <VectorArrow2D
              start={origin}
              end={result}
              color={COLORS.result}
              label={`${scalar}a`}
              strokeWidth={4}
            />
          </>
        )}
      </Canvas2D>
    </div>
  );
};

export default OperationsView;
