/**
 * InverseView Component
 *
 * Visualizes a function and its inverse with the line y = x.
 */

import { FC, useMemo } from 'react';
import GraphCanvas from './GraphCanvas';
import FunctionCurve from './FunctionCurve';
import { InverseViewProps, FunctionId } from './types';
import { STANDARD_FUNCTIONS } from '@/math/functions/operations';
import { MathFunction } from '@/math/functions/types';

const getFunctionById = (id: FunctionId) => {
  return STANDARD_FUNCTIONS.find((f) => f.id === id) || STANDARD_FUNCTIONS[0];
};

// Get the inverse function with appropriate domain
const getInverse = (id: FunctionId): { fn: MathFunction; xMin: number; xMax: number } | null => {
  switch (id) {
    case 'linear':
      return { fn: (x) => x, xMin: -5, xMax: 5 };
    case 'quadratic':
      // Only defined for x >= 0, inverse is sqrt
      return { fn: (y) => Math.sqrt(Math.max(0, y)), xMin: 0, xMax: 5 };
    case 'sqrt':
      // Inverse is x^2 for x >= 0
      return { fn: (x) => x * x, xMin: 0, xMax: 5 };
    case 'reciprocal':
      // Self-inverse: 1/x
      return { fn: (x) => (x !== 0 ? 1 / x : NaN), xMin: -5, xMax: 5 };
    case 'exp':
      // Inverse is ln
      return { fn: (x) => (x > 0 ? Math.log(x) : NaN), xMin: 0.01, xMax: 5 };
    case 'ln':
      // Inverse is exp
      return { fn: (x) => Math.exp(x), xMin: -5, xMax: 2 };
    case 'abs':
      // Not invertible (not one-to-one)
      return null;
    case 'sin':
      // Inverse is arcsin, restricted domain
      return { fn: (x) => Math.asin(Math.max(-1, Math.min(1, x))), xMin: -1, xMax: 1 };
    case 'cos':
      // Inverse is arccos, restricted domain
      return { fn: (x) => Math.acos(Math.max(-1, Math.min(1, x))), xMin: -1, xMax: 1 };
    default:
      return null;
  }
};

const InverseView: FC<InverseViewProps> = ({ functionId }) => {
  const funcDef = getFunctionById(functionId);
  const inverseDef = useMemo(() => getInverse(functionId), [functionId]);

  // Colors
  const colorF = '#3b82f6'; // Blue for f
  const colorInverse = '#f97316'; // Orange for f^(-1)
  const colorLine = '#9ca3af'; // Gray for y = x

  // Determine domain for f based on inverse availability
  const fDomain = useMemo(() => {
    switch (functionId) {
      case 'quadratic':
        return { xMin: 0, xMax: 5 }; // Restrict to make it one-to-one
      case 'sin':
        return { xMin: -Math.PI / 2, xMax: Math.PI / 2 };
      case 'cos':
        return { xMin: 0, xMax: Math.PI };
      default:
        return { xMin: -5, xMax: 5 };
    }
  }, [functionId]);

  return (
    <div className="flex justify-center">
      <GraphCanvas xRange={[-5, 5]} yRange={[-5, 5]}>
        {/* Line y = x (reflection line) */}
        <line
          x1={-5}
          y1={-5}
          x2={5}
          y2={5}
          stroke={colorLine}
          strokeWidth={0.04}
          strokeDasharray="0.15 0.1"
        />

        {/* f(x) */}
        <FunctionCurve
          fn={funcDef.fn}
          xMin={fDomain.xMin}
          xMax={fDomain.xMax}
          color={colorF}
          label="f"
        />

        {/* f^(-1)(x) if it exists */}
        {inverseDef && (
          <FunctionCurve
            fn={inverseDef.fn}
            xMin={inverseDef.xMin}
            xMax={inverseDef.xMax}
            color={colorInverse}
            label="f⁻¹"
          />
        )}

        {/* If no inverse, show message would be handled in parent */}
      </GraphCanvas>
    </div>
  );
};

export default InverseView;
