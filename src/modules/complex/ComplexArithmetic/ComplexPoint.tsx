/**
 * ComplexPoint Component
 *
 * Renders a complex number as a point and/or vector on the Argand diagram.
 */

import { FC, useMemo } from 'react';
import { ComplexPointProps } from './types';
import { modulus } from '@/math/complex/operations';

const ComplexPoint: FC<ComplexPointProps> = ({
  z,
  color,
  label,
  showVector = true,
  dashed = false,
}) => {
  const { length, arrowSize } = useMemo(() => {
    const len = modulus(z);
    const arrowLen = Math.min(0.3, len * 0.15);
    return { length: len, arrowSize: arrowLen };
  }, [z]);

  if (length < 0.01 && !label) return null;

  // Arrow head calculation
  const arrowAngle = 25;
  const arrowRad = (arrowAngle * Math.PI) / 180;
  const mainAngle = Math.atan2(z.im, z.re);

  const arrowPoint1 = {
    x: z.re - arrowSize * Math.cos(mainAngle - arrowRad),
    y: z.im - arrowSize * Math.sin(mainAngle - arrowRad),
  };
  const arrowPoint2 = {
    x: z.re - arrowSize * Math.cos(mainAngle + arrowRad),
    y: z.im - arrowSize * Math.sin(mainAngle + arrowRad),
  };

  // Label position offset
  const labelOffset = 0.4;
  const labelX = z.re + labelOffset * Math.cos(mainAngle + Math.PI / 4);
  const labelY = z.im + labelOffset * Math.sin(mainAngle + Math.PI / 4);

  return (
    <g>
      {/* Vector line from origin */}
      {showVector && length >= 0.01 && (
        <>
          <line
            x1={0}
            y1={0}
            x2={z.re}
            y2={z.im}
            stroke={color}
            strokeWidth={0.08}
            strokeDasharray={dashed ? '0.2 0.1' : undefined}
            strokeLinecap="round"
          />
          {/* Arrowhead */}
          {!dashed && (
            <polygon
              points={`${z.re},${z.im} ${arrowPoint1.x},${arrowPoint1.y} ${arrowPoint2.x},${arrowPoint2.y}`}
              fill={color}
            />
          )}
        </>
      )}

      {/* Point */}
      <circle cx={z.re} cy={z.im} r={0.12} fill={color} />

      {/* Label */}
      {label && (
        <text
          x={labelX}
          y={labelY}
          fill={color}
          fontSize={0.4}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`scale(1, -1) translate(0, ${-2 * labelY})`}
        >
          {label}
        </text>
      )}
    </g>
  );
};

export default ComplexPoint;
