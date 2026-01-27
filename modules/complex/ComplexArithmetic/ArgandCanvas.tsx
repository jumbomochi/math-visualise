/**
 * ArgandCanvas Component
 *
 * SVG canvas for the Argand diagram (complex plane).
 * Handles coordinate transformation from math space to SVG space.
 */

import { FC } from 'react';
import { ArgandCanvasProps } from './types';

const ArgandCanvas: FC<ArgandCanvasProps> = ({
  width = 400,
  height = 400,
  range = 5,
  children,
}) => {
  const cx = width / 2;
  const cy = height / 2;
  const scale = width / (2 * range);

  // Generate grid lines
  const gridLines = [];
  for (let i = -range; i <= range; i++) {
    if (i === 0) continue;
    // Vertical lines (parallel to imaginary axis)
    gridLines.push(
      <line
        key={`v${i}`}
        x1={i}
        y1={-range}
        x2={i}
        y2={range}
        stroke="#e5e7eb"
        strokeWidth={1 / scale}
      />
    );
    // Horizontal lines (parallel to real axis)
    gridLines.push(
      <line
        key={`h${i}`}
        x1={-range}
        y1={i}
        x2={range}
        y2={i}
        stroke="#e5e7eb"
        strokeWidth={1 / scale}
      />
    );
  }

  // Axis tick marks and labels
  const ticks = [];
  for (let i = -range; i <= range; i++) {
    if (i === 0) continue;
    // Real axis ticks
    ticks.push(
      <g key={`re${i}`}>
        <line
          x1={i}
          y1={-0.1}
          x2={i}
          y2={0.1}
          stroke="#374151"
          strokeWidth={2 / scale}
        />
        <text
          x={i}
          y={-0.3}
          fill="#6b7280"
          fontSize={0.3}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`scale(1, -1) translate(0, ${0.6})`}
        >
          {i}
        </text>
      </g>
    );
    // Imaginary axis ticks
    ticks.push(
      <g key={`im${i}`}>
        <line
          x1={-0.1}
          y1={i}
          x2={0.1}
          y2={i}
          stroke="#374151"
          strokeWidth={2 / scale}
        />
        <text
          x={-0.4}
          y={i}
          fill="#6b7280"
          fontSize={0.3}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`scale(1, -1) translate(0, ${-2 * i})`}
        >
          {i}i
        </text>
      </g>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="bg-white border border-gray-200 rounded-lg"
    >
      {/* Transform to math coordinates (y-up, origin at center) */}
      <g transform={`translate(${cx}, ${cy}) scale(${scale}, ${-scale})`}>
        {/* Grid */}
        {gridLines}

        {/* Real axis (horizontal) */}
        <line
          x1={-range}
          y1={0}
          x2={range}
          y2={0}
          stroke="#374151"
          strokeWidth={2 / scale}
        />
        {/* Imaginary axis (vertical) */}
        <line
          x1={0}
          y1={-range}
          x2={0}
          y2={range}
          stroke="#374151"
          strokeWidth={2 / scale}
        />

        {/* Tick marks and labels */}
        {ticks}

        {/* Axis labels */}
        <text
          x={range - 0.3}
          y={-0.5}
          fill="#374151"
          fontSize={0.4}
          fontWeight="bold"
          textAnchor="middle"
          transform={`scale(1, -1) translate(0, ${1})`}
        >
          Re
        </text>
        <text
          x={0.5}
          y={range - 0.3}
          fill="#374151"
          fontSize={0.4}
          fontWeight="bold"
          textAnchor="middle"
          transform={`scale(1, -1) translate(0, ${-2 * (range - 0.3)})`}
        >
          Im
        </text>

        {/* Children (points, vectors, etc.) */}
        {children}
      </g>
    </svg>
  );
};

export default ArgandCanvas;
