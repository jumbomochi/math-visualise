/**
 * FunctionCurve Component
 *
 * Renders a function as a path on the graph canvas.
 */

import { FC, useMemo } from 'react';
import { FunctionCurveProps } from './types';

const FunctionCurve: FC<FunctionCurveProps> = ({
  fn,
  xMin,
  xMax,
  color,
  dashed = false,
  label,
}) => {
  const { pathD, labelPos } = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    const numPoints = 200;
    const step = (xMax - xMin) / numPoints;

    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      const y = fn(x);
      if (isFinite(y) && Math.abs(y) < 100) {
        points.push({ x, y });
      }
    }

    if (points.length === 0) {
      return { pathD: '', labelPos: null };
    }

    // Build path with breaks for discontinuities
    let d = '';
    let prevPoint: { x: number; y: number } | null = null;
    let labelPoint: { x: number; y: number } | null = null;

    for (const point of points) {
      if (prevPoint === null) {
        d += `M ${point.x} ${point.y}`;
      } else {
        // Check for discontinuity
        if (Math.abs(point.y - prevPoint.y) > 5) {
          d += ` M ${point.x} ${point.y}`;
        } else {
          d += ` L ${point.x} ${point.y}`;
        }
      }

      // Find a good label position (near the middle of visible range)
      if (!labelPoint && point.x > (xMin + xMax) / 2 - 0.5 && Math.abs(point.y) < 4) {
        labelPoint = point;
      }

      prevPoint = point;
    }

    return {
      pathD: d,
      labelPos: labelPoint || (points.length > 0 ? points[Math.floor(points.length / 2)] : null),
    };
  }, [fn, xMin, xMax]);

  if (!pathD) return null;

  // Stroke width in graph units (will be scaled)
  const strokeWidth = 0.06;

  return (
    <g>
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? '0.15 0.1' : undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Label */}
      {label && labelPos && (
        <text
          x={labelPos.x + 0.3}
          y={labelPos.y}
          fill={color}
          fontSize={0.4}
          fontWeight="bold"
          textAnchor="start"
          dominantBaseline="middle"
          transform={`scale(1, -1) translate(0, ${-2 * labelPos.y})`}
        >
          {label}
        </text>
      )}
    </g>
  );
};

export default FunctionCurve;
