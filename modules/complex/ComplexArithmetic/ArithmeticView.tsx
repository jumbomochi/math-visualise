/**
 * ArithmeticView Component
 *
 * Visualizes complex arithmetic operations on the Argand diagram.
 * Shows z1, z2, and the result with appropriate visual cues.
 */

import { FC } from 'react';
import ArgandCanvas from './ArgandCanvas';
import ComplexPoint from './ComplexPoint';
import { ArithmeticViewProps } from './types';

const ArithmeticView: FC<ArithmeticViewProps> = ({
  z1,
  z2,
  operation,
  result,
}) => {
  // Colors
  const colorZ1 = '#f97316'; // Orange
  const colorZ2 = '#06b6d4'; // Cyan
  const colorResult = '#eab308'; // Yellow

  // For addition, show the parallelogram law
  const showParallelogram = operation === 'add';

  // For subtraction, show z2 negated
  const showNegatedZ2 = operation === 'subtract';

  return (
    <div className="flex justify-center">
      <ArgandCanvas>
        {/* For addition: show parallelogram construction */}
        {showParallelogram && (
          <>
            {/* Dashed line from z1 tip to result (parallel to z2) */}
            <line
              x1={z1.re}
              y1={z1.im}
              x2={result.re}
              y2={result.im}
              stroke={colorZ2}
              strokeWidth={0.06}
              strokeDasharray="0.15 0.1"
              opacity={0.6}
            />
            {/* Dashed line from z2 tip to result (parallel to z1) */}
            <line
              x1={z2.re}
              y1={z2.im}
              x2={result.re}
              y2={result.im}
              stroke={colorZ1}
              strokeWidth={0.06}
              strokeDasharray="0.15 0.1"
              opacity={0.6}
            />
          </>
        )}

        {/* For subtraction: show -z2 */}
        {showNegatedZ2 && (
          <ComplexPoint
            z={{ re: -z2.re, im: -z2.im }}
            color={colorZ2}
            label="-z₂"
            showVector={true}
            dashed={true}
          />
        )}

        {/* z1 */}
        <ComplexPoint z={z1} color={colorZ1} label="z₁" showVector={true} />

        {/* z2 (not shown for multiply/divide as the geometric interpretation differs) */}
        {(operation === 'add' || operation === 'subtract') && (
          <ComplexPoint z={z2} color={colorZ2} label="z₂" showVector={true} />
        )}

        {/* For multiply/divide, show both operands */}
        {(operation === 'multiply' || operation === 'divide') && (
          <ComplexPoint z={z2} color={colorZ2} label="z₂" showVector={true} />
        )}

        {/* Result */}
        {!isNaN(result.re) && !isNaN(result.im) && (
          <ComplexPoint
            z={result}
            color={colorResult}
            label={operation === 'add' ? 'z₁+z₂' : operation === 'subtract' ? 'z₁-z₂' : operation === 'multiply' ? 'z₁z₂' : 'z₁/z₂'}
            showVector={true}
          />
        )}
      </ArgandCanvas>
    </div>
  );
};

export default ArithmeticView;
