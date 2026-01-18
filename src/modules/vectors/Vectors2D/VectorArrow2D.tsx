/**
 * VectorArrow2D Component
 *
 * Renders a 2D vector arrow in SVG coordinate space.
 * Note: This component is used inside Canvas2D's transformed group,
 * so coordinates are in math space (y-up).
 */

import { FC, useMemo } from 'react';
import { VectorArrow2DProps } from './types';
import { magnitude2D } from '@/math/vectors/operations';

const VectorArrow2D: FC<VectorArrow2DProps> = ({
  start,
  end,
  color,
  label,
  dashed = false,
  strokeWidth = 3,
}) => {
  const { dx, dy, length, arrowSize } = useMemo(() => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const len = magnitude2D({ x: deltaX, y: deltaY });
    const arrowLen = Math.min(0.3, len * 0.15);

    return {
      dx: deltaX,
      dy: deltaY,
      length: len,
      arrowSize: arrowLen,
    };
  }, [start, end]);

  if (length < 0.01) return null;

  // Calculate arrowhead points
  const arrowAngle = 25;
  const arrowRad = (arrowAngle * Math.PI) / 180;
  const mainAngle = Math.atan2(dy, dx);

  const arrowPoint1 = {
    x: end.x - arrowSize * Math.cos(mainAngle - arrowRad),
    y: end.y - arrowSize * Math.sin(mainAngle - arrowRad),
  };
  const arrowPoint2 = {
    x: end.x - arrowSize * Math.cos(mainAngle + arrowRad),
    y: end.y - arrowSize * Math.sin(mainAngle + arrowRad),
  };

  // Label position (offset from midpoint)
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  // Offset perpendicular to vector direction
  const perpX = -dy / length * 0.4;
  const perpY = dx / length * 0.4;

  return (
    <g>
      {/* Vector line */}
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={color}
        strokeWidth={strokeWidth / 35}
        strokeDasharray={dashed ? '0.2 0.1' : undefined}
        strokeLinecap="round"
      />

      {/* Arrowhead */}
      <polygon
        points={`${end.x},${end.y} ${arrowPoint1.x},${arrowPoint1.y} ${arrowPoint2.x},${arrowPoint2.y}`}
        fill={color}
      />

      {/* Label */}
      {label && (
        <text
          x={midX + perpX}
          y={midY + perpY}
          fill={color}
          fontSize={0.4}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`scale(1, -1) translate(0, ${-2 * (midY + perpY)})`}
        >
          {label}
        </text>
      )}
    </g>
  );
};

export default VectorArrow2D;
