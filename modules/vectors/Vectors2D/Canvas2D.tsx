/**
 * Canvas2D Component
 *
 * SVG canvas with coordinate grid and axes for 2D vector visualization.
 */

import { FC, useMemo } from 'react';
import { Canvas2DProps } from './types';

const Canvas2D: FC<Canvas2DProps> = ({
  width = 400,
  height = 400,
  range = 5,
  children,
}) => {
  // Scale factor: map coordinate range to pixel space
  const scale = useMemo(() => {
    const padding = 40;
    return (Math.min(width, height) - padding * 2) / (range * 2);
  }, [width, height, range]);

  // Center of canvas
  const cx = width / 2;
  const cy = height / 2;

  // Convert coordinate to pixel
  const toPixel = (coord: number) => coord * scale;

  // Grid lines
  const gridLines = useMemo(() => {
    const lines = [];
    for (let i = -range; i <= range; i++) {
      // Vertical lines
      lines.push(
        <line
          key={`v${i}`}
          x1={cx + toPixel(i)}
          y1={cy - toPixel(range)}
          x2={cx + toPixel(i)}
          y2={cy + toPixel(range)}
          stroke={i === 0 ? '#6b7280' : '#e5e7eb'}
          strokeWidth={i === 0 ? 1.5 : 1}
        />
      );
      // Horizontal lines
      lines.push(
        <line
          key={`h${i}`}
          x1={cx - toPixel(range)}
          y1={cy - toPixel(i)}
          x2={cx + toPixel(range)}
          y2={cy - toPixel(i)}
          stroke={i === 0 ? '#6b7280' : '#e5e7eb'}
          strokeWidth={i === 0 ? 1.5 : 1}
        />
      );
    }
    return lines;
  }, [cx, cy, range, scale]);

  // Axis labels
  const axisLabels = useMemo(() => (
    <>
      <text
        x={cx + toPixel(range) + 10}
        y={cy + 5}
        fill="#ef4444"
        fontSize={14}
        fontWeight="bold"
      >
        x
      </text>
      <text
        x={cx - 5}
        y={cy - toPixel(range) - 10}
        fill="#22c55e"
        fontSize={14}
        fontWeight="bold"
        textAnchor="middle"
      >
        y
      </text>
    </>
  ), [cx, cy, range, scale]);

  // Tick labels
  const tickLabels = useMemo(() => {
    const labels = [];
    for (let i = -range; i <= range; i++) {
      if (i !== 0) {
        // X axis ticks
        labels.push(
          <text
            key={`tx${i}`}
            x={cx + toPixel(i)}
            y={cy + 20}
            fill="#9ca3af"
            fontSize={10}
            textAnchor="middle"
          >
            {i}
          </text>
        );
        // Y axis ticks
        labels.push(
          <text
            key={`ty${i}`}
            x={cx - 20}
            y={cy - toPixel(i) + 4}
            fill="#9ca3af"
            fontSize={10}
            textAnchor="middle"
          >
            {i}
          </text>
        );
      }
    }
    return labels;
  }, [cx, cy, range, scale]);

  return (
    <svg
      width={width}
      height={height}
      className="bg-white rounded-lg border border-gray-200"
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Grid */}
      {gridLines}

      {/* Axis arrows */}
      <defs>
        <marker
          id="arrowhead-x"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
        </marker>
        <marker
          id="arrowhead-y"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
        </marker>
      </defs>

      {/* X axis arrow */}
      <line
        x1={cx - toPixel(range)}
        y1={cy}
        x2={cx + toPixel(range)}
        y2={cy}
        stroke="#ef4444"
        strokeWidth={2}
        markerEnd="url(#arrowhead-x)"
      />

      {/* Y axis arrow */}
      <line
        x1={cx}
        y1={cy + toPixel(range)}
        x2={cx}
        y2={cy - toPixel(range)}
        stroke="#22c55e"
        strokeWidth={2}
        markerEnd="url(#arrowhead-y)"
      />

      {/* Labels */}
      {axisLabels}
      {tickLabels}

      {/* Origin label */}
      <text
        x={cx - 15}
        y={cy + 20}
        fill="#6b7280"
        fontSize={10}
      >
        O
      </text>

      {/* Children (vectors) with transform for coordinate system */}
      <g transform={`translate(${cx}, ${cy}) scale(${scale}, ${-scale})`}>
        {children}
      </g>
    </svg>
  );
};

export default Canvas2D;
