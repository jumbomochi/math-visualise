/**
 * RootsView Component
 *
 * Visualizes the nth roots of a complex number on the Argand diagram.
 * Shows the symmetric distribution of roots around the origin.
 */

import { FC, useMemo } from 'react';
import { RootsViewProps } from './types';
import { modulus } from '@/math/complex/operations';

// Reuse ArgandCanvas from ComplexArithmetic
import ArgandCanvas from '../ComplexArithmetic/ArgandCanvas';

// Color palette for roots
const ROOT_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
];

const RootsView: FC<RootsViewProps> = ({ roots, baseNumber, showConnections }) => {
  const { baseModulus, rootModulus } = useMemo(() => {
    const baseMod = modulus(baseNumber);
    const rootMod = roots.length > 0 ? roots[0].polar.r : 1;
    return { baseModulus: baseMod, rootModulus: rootMod };
  }, [baseNumber, roots]);

  // Determine canvas range based on root modulus
  const range = Math.max(2, Math.ceil(rootModulus + 1));

  return (
    <div className="flex justify-center">
      <ArgandCanvas range={range}>
        {/* Circle through all roots */}
        {roots.length > 0 && (
          <circle
            cx={0}
            cy={0}
            r={rootModulus}
            fill="none"
            stroke="#d1d5db"
            strokeWidth={0.04}
            strokeDasharray="0.15 0.1"
          />
        )}

        {/* Unit circle for reference (if different from root circle) */}
        {Math.abs(rootModulus - 1) > 0.01 && (
          <circle
            cx={0}
            cy={0}
            r={1}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={0.03}
            strokeDasharray="0.1 0.1"
          />
        )}

        {/* Connecting polygon between roots */}
        {showConnections && roots.length > 2 && (
          <polygon
            points={roots
              .map((root) => `${root.value.re},${root.value.im}`)
              .join(' ')}
            fill="none"
            stroke="#9ca3af"
            strokeWidth={0.04}
          />
        )}

        {/* Show base number if not 1 */}
        {baseModulus > 0.01 && (
          <>
            {/* Vector to base number */}
            <line
              x1={0}
              y1={0}
              x2={baseNumber.re}
              y2={baseNumber.im}
              stroke="#6b7280"
              strokeWidth={0.06}
              strokeDasharray="0.15 0.1"
            />
            {/* Base number point */}
            <circle
              cx={baseNumber.re}
              cy={baseNumber.im}
              r={0.12}
              fill="#6b7280"
            />
            {/* Label */}
            <text
              x={baseNumber.re + 0.3}
              y={baseNumber.im + 0.3}
              fill="#6b7280"
              fontSize={0.35}
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`scale(1, -1) translate(0, ${-2 * (baseNumber.im + 0.3)})`}
            >
              z
            </text>
          </>
        )}

        {/* Roots */}
        {roots.map((root, index) => {
          const color = ROOT_COLORS[index % ROOT_COLORS.length];
          const labelAngle = root.polar.theta;
          const labelRadius = rootModulus + 0.4;
          const labelX = labelRadius * Math.cos(labelAngle);
          const labelY = labelRadius * Math.sin(labelAngle);

          return (
            <g key={root.k}>
              {/* Vector from origin to root */}
              <line
                x1={0}
                y1={0}
                x2={root.value.re}
                y2={root.value.im}
                stroke={color}
                strokeWidth={0.06}
                opacity={0.6}
              />

              {/* Root point */}
              <circle
                cx={root.value.re}
                cy={root.value.im}
                r={0.15}
                fill={color}
                stroke="white"
                strokeWidth={0.03}
              />

              {/* Root label */}
              <text
                x={labelX}
                y={labelY}
                fill={color}
                fontSize={0.3}
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`scale(1, -1) translate(0, ${-2 * labelY})`}
              >
                ω{roots.length > 1 ? `₍${root.k}₎` : ''}
              </text>
            </g>
          );
        })}
      </ArgandCanvas>
    </div>
  );
};

export default RootsView;
