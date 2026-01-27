/**
 * GraphCanvas Component
 *
 * SVG canvas for plotting functions with coordinate grid.
 */

import { FC } from 'react';
import { GraphCanvasProps } from './types';

const GraphCanvas: FC<GraphCanvasProps> = ({
  width = 400,
  height = 400,
  xRange = [-5, 5],
  yRange = [-5, 5],
  children,
}) => {
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;
  const xSpan = xMax - xMin;
  const ySpan = yMax - yMin;

  // Compute scale and center
  const scaleX = width / xSpan;
  const scaleY = height / ySpan;
  const cx = -xMin * scaleX;
  const cy = yMax * scaleY;

  // Generate grid lines
  const gridLines = [];
  const step = 1;

  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x += step) {
    if (x === 0) continue;
    const px = cx + x * scaleX;
    gridLines.push(
      <line
        key={`v${x}`}
        x1={px}
        y1={0}
        x2={px}
        y2={height}
        stroke="#e5e7eb"
        strokeWidth={1}
      />
    );
  }

  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += step) {
    if (y === 0) continue;
    const py = cy - y * scaleY;
    gridLines.push(
      <line
        key={`h${y}`}
        x1={0}
        y1={py}
        x2={width}
        y2={py}
        stroke="#e5e7eb"
        strokeWidth={1}
      />
    );
  }

  // Axis tick marks and labels
  const ticks = [];
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x += step) {
    if (x === 0) continue;
    const px = cx + x * scaleX;
    ticks.push(
      <g key={`tx${x}`}>
        <line x1={px} y1={cy - 5} x2={px} y2={cy + 5} stroke="#374151" strokeWidth={1} />
        <text x={px} y={cy + 18} fill="#6b7280" fontSize={12} textAnchor="middle">
          {x}
        </text>
      </g>
    );
  }

  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += step) {
    if (y === 0) continue;
    const py = cy - y * scaleY;
    ticks.push(
      <g key={`ty${y}`}>
        <line x1={cx - 5} y1={py} x2={cx + 5} y2={py} stroke="#374151" strokeWidth={1} />
        <text x={cx - 10} y={py + 4} fill="#6b7280" fontSize={12} textAnchor="end">
          {y}
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
      {/* Grid */}
      {gridLines}

      {/* X-axis */}
      <line x1={0} y1={cy} x2={width} y2={cy} stroke="#374151" strokeWidth={2} />
      {/* Y-axis */}
      <line x1={cx} y1={0} x2={cx} y2={height} stroke="#374151" strokeWidth={2} />

      {/* Tick marks and labels */}
      {ticks}

      {/* Axis labels */}
      <text x={width - 15} y={cy - 10} fill="#374151" fontSize={14} fontWeight="bold">
        x
      </text>
      <text x={cx + 10} y={15} fill="#374151" fontSize={14} fontWeight="bold">
        y
      </text>

      {/* Origin label */}
      <text x={cx - 12} y={cy + 18} fill="#6b7280" fontSize={12}>
        O
      </text>

      {/* Children rendered in graph coordinate space */}
      <g transform={`translate(${cx}, ${cy}) scale(${scaleX}, ${-scaleY})`}>
        {children}
      </g>
    </svg>
  );
};

export default GraphCanvas;
