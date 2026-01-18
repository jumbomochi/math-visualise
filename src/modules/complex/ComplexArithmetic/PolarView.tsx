/**
 * PolarView Component
 *
 * Visualizes the polar form of a complex number.
 * Shows modulus (r) and argument (θ) clearly.
 */

import { FC, useMemo } from 'react';
import ArgandCanvas from './ArgandCanvas';
import ComplexPoint from './ComplexPoint';
import { PolarViewProps } from './types';
import { modulus, argument } from '@/math/complex/operations';

const PolarView: FC<PolarViewProps> = ({ z }) => {
  const { r, theta, arcPath } = useMemo(() => {
    const mod = modulus(z);
    const arg = argument(z);

    // Create arc path for angle visualization
    const arcRadius = Math.min(1, mod * 0.4);
    const startX = arcRadius;
    const startY = 0;
    const endX = arcRadius * Math.cos(arg);
    const endY = arcRadius * Math.sin(arg);

    // Determine if we need the large arc flag
    const largeArcFlag = Math.abs(arg) > Math.PI ? 1 : 0;
    // Sweep flag depends on sign of angle
    const sweepFlag = arg > 0 ? 1 : 0;

    const path = `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;

    return { r: mod, theta: arg, arcPath: path };
  }, [z]);

  // Colors
  const colorZ = '#f97316'; // Orange
  const colorModulus = '#10b981'; // Emerald
  const colorAngle = '#8b5cf6'; // Purple

  // Modulus label position (midpoint of vector)
  const modulusMidX = z.re / 2;
  const modulusMidY = z.im / 2;
  // Offset perpendicular to vector
  const perpAngle = Math.atan2(z.im, z.re) + Math.PI / 2;
  const modulusLabelX = modulusMidX + 0.4 * Math.cos(perpAngle);
  const modulusLabelY = modulusMidY + 0.4 * Math.sin(perpAngle);

  // Angle label position (along the arc)
  const angleLabelAngle = theta / 2;
  const angleLabelRadius = Math.min(1.4, r * 0.6);
  const angleLabelX = angleLabelRadius * Math.cos(angleLabelAngle);
  const angleLabelY = angleLabelRadius * Math.sin(angleLabelAngle);

  return (
    <div className="flex justify-center">
      <ArgandCanvas>
        {/* Unit circle for reference */}
        <circle
          cx={0}
          cy={0}
          r={1}
          fill="none"
          stroke="#d1d5db"
          strokeWidth={0.04}
          strokeDasharray="0.1 0.1"
        />

        {/* Modulus circle (|z| = r) */}
        {r > 0.1 && (
          <circle
            cx={0}
            cy={0}
            r={r}
            fill="none"
            stroke={colorModulus}
            strokeWidth={0.04}
            strokeDasharray="0.15 0.1"
            opacity={0.5}
          />
        )}

        {/* Angle arc */}
        {r > 0.1 && Math.abs(theta) > 0.01 && (
          <>
            <path
              d={arcPath}
              fill="none"
              stroke={colorAngle}
              strokeWidth={0.08}
            />
            {/* Angle label */}
            <text
              x={angleLabelX}
              y={angleLabelY}
              fill={colorAngle}
              fontSize={0.35}
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`scale(1, -1) translate(0, ${-2 * angleLabelY})`}
            >
              θ
            </text>
          </>
        )}

        {/* Real projection line */}
        {r > 0.1 && (
          <line
            x1={z.re}
            y1={0}
            x2={z.re}
            y2={z.im}
            stroke="#9ca3af"
            strokeWidth={0.04}
            strokeDasharray="0.1 0.1"
          />
        )}

        {/* Imaginary projection line */}
        {r > 0.1 && (
          <line
            x1={0}
            y1={z.im}
            x2={z.re}
            y2={z.im}
            stroke="#9ca3af"
            strokeWidth={0.04}
            strokeDasharray="0.1 0.1"
          />
        )}

        {/* The complex number */}
        <ComplexPoint z={z} color={colorZ} label="z" showVector={true} />

        {/* Modulus label (r) */}
        {r > 0.5 && (
          <text
            x={modulusLabelX}
            y={modulusLabelY}
            fill={colorModulus}
            fontSize={0.35}
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`scale(1, -1) translate(0, ${-2 * modulusLabelY})`}
          >
            r
          </text>
        )}
      </ArgandCanvas>
    </div>
  );
};

export default PolarView;
