/**
 * Graph Canvas Component
 *
 * Canvas-based graph rendering with grid, axes, and function curves.
 */

import { FC, useEffect, useRef, useCallback } from 'react';
import { FunctionEntry, GraphWindow } from './types';
import { evaluateFunction } from './mathEngine';

interface GraphCanvasProps {
  functions: FunctionEntry[];
  window: GraphWindow;
  angleMode: 'DEG' | 'RAD';
}

export const GraphCanvas: FC<GraphCanvasProps> = ({ functions, window, angleMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const rect = container.getBoundingClientRect();
    const dpr = globalThis.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Calculate scale
    const xRange = window.xMax - window.xMin;
    const yRange = window.yMax - window.yMin;
    const xScale = width / xRange;
    const yScale = height / yRange;

    // Transform functions
    const toScreenX = (x: number) => (x - window.xMin) * xScale;
    const toScreenY = (y: number) => height - (y - window.yMin) * yScale;

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Calculate grid step (aim for ~10-20 grid lines)
    const gridStepX = calculateGridStep(xRange);
    const gridStepY = calculateGridStep(yRange);

    // Vertical grid lines
    for (let x = Math.ceil(window.xMin / gridStepX) * gridStepX; x <= window.xMax; x += gridStepX) {
      const screenX = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, height);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let y = Math.ceil(window.yMin / gridStepY) * gridStepY; y <= window.yMax; y += gridStepY) {
      const screenY = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, screenY);
      ctx.lineTo(width, screenY);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;

    // X-axis
    if (window.yMin <= 0 && window.yMax >= 0) {
      const y0 = toScreenY(0);
      ctx.beginPath();
      ctx.moveTo(0, y0);
      ctx.lineTo(width, y0);
      ctx.stroke();

      // X-axis arrow
      ctx.beginPath();
      ctx.moveTo(width - 10, y0 - 5);
      ctx.lineTo(width, y0);
      ctx.lineTo(width - 10, y0 + 5);
      ctx.stroke();
    }

    // Y-axis
    if (window.xMin <= 0 && window.xMax >= 0) {
      const x0 = toScreenX(0);
      ctx.beginPath();
      ctx.moveTo(x0, height);
      ctx.lineTo(x0, 0);
      ctx.stroke();

      // Y-axis arrow
      ctx.beginPath();
      ctx.moveTo(x0 - 5, 10);
      ctx.lineTo(x0, 0);
      ctx.lineTo(x0 + 5, 10);
      ctx.stroke();
    }

    // Draw axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // X-axis labels
    for (let x = Math.ceil(window.xMin / gridStepX) * gridStepX; x <= window.xMax; x += gridStepX) {
      if (Math.abs(x) > 0.001) {
        const screenX = toScreenX(x);
        const y0 = window.yMin <= 0 && window.yMax >= 0 ? toScreenY(0) : height - 5;
        const label = formatAxisLabel(x);
        ctx.fillText(label, screenX, Math.min(y0 + 5, height - 20));
      }
    }

    // Y-axis labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = Math.ceil(window.yMin / gridStepY) * gridStepY; y <= window.yMax; y += gridStepY) {
      if (Math.abs(y) > 0.001) {
        const screenY = toScreenY(y);
        const x0 = window.xMin <= 0 && window.xMax >= 0 ? toScreenX(0) : 5;
        const label = formatAxisLabel(y);
        ctx.fillText(label, Math.max(x0 - 5, 35), screenY);
      }
    }

    // Draw origin label
    if (window.xMin <= 0 && window.xMax >= 0 && window.yMin <= 0 && window.yMax >= 0) {
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText('O', toScreenX(0) - 5, toScreenY(0) + 5);
    }

    // Axis labels
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('x', width - 20, window.yMin <= 0 && window.yMax >= 0 ? toScreenY(0) - 15 : height - 20);
    ctx.fillText('y', window.xMin <= 0 && window.xMax >= 0 ? toScreenX(0) + 10 : 10, 15);

    // Draw functions
    const numPoints = Math.max(300, width);

    functions.forEach(func => {
      if (!func.visible || !func.expression.trim()) return;

      const points = generatePoints(func.expression, window.xMin, window.xMax, numPoints, angleMode);

      ctx.strokeStyle = func.color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();

      let isDrawing = false;
      let lastY: number | null = null;

      points.forEach(point => {
        if (point === null) {
          isDrawing = false;
          lastY = null;
          return;
        }

        const { x, y } = point;

        // Check for discontinuities (large jumps)
        if (lastY !== null && Math.abs(y - lastY) > yRange * 0.5) {
          isDrawing = false;
        }

        // Check if point is within reasonable bounds
        if (y < window.yMin - yRange || y > window.yMax + yRange) {
          isDrawing = false;
          lastY = y;
          return;
        }

        const screenX = toScreenX(x);
        const screenY = toScreenY(y);

        if (!isDrawing) {
          ctx.moveTo(screenX, screenY);
          isDrawing = true;
        } else {
          ctx.lineTo(screenX, screenY);
        }

        lastY = y;
      });

      ctx.stroke();
    });

    // Draw function legend
    const visibleFunctions = functions.filter(f => f.visible && f.expression.trim());
    if (visibleFunctions.length > 0) {
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      visibleFunctions.forEach((func, index) => {
        const y = 10 + index * 20;

        // Draw color indicator
        ctx.fillStyle = func.color;
        ctx.fillRect(10, y + 2, 12, 12);

        // Draw function text
        ctx.fillStyle = '#374151';
        ctx.fillText(`Y${functions.indexOf(func) + 1} = ${func.expression}`, 28, y);
      });
    }
  }, [functions, window, angleMode]);

  // Redraw on changes
  useEffect(() => {
    draw();

    // Redraw on resize
    const handleResize = () => draw();
    globalThis.addEventListener('resize', handleResize);
    return () => globalThis.removeEventListener('resize', handleResize);
  }, [draw]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

function calculateGridStep(range: number): number {
  const rawStep = range / 10;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalized = rawStep / magnitude;

  if (normalized <= 1) return magnitude;
  if (normalized <= 2) return 2 * magnitude;
  if (normalized <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

function formatAxisLabel(value: number): string {
  if (Math.abs(value) >= 1000 || (Math.abs(value) < 0.01 && value !== 0)) {
    return value.toExponential(1);
  }
  // Remove unnecessary decimals
  const str = value.toFixed(2);
  return str.replace(/\.?0+$/, '');
}

function generatePoints(
  expr: string,
  xMin: number,
  xMax: number,
  numPoints: number,
  angleMode: 'DEG' | 'RAD'
): Array<{ x: number; y: number } | null> {
  const points: Array<{ x: number; y: number } | null> = [];
  const step = (xMax - xMin) / numPoints;

  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * step;
    try {
      const y = evaluateFunction(expr, x, angleMode);
      if (isFinite(y) && !isNaN(y)) {
        points.push({ x, y });
      } else {
        points.push(null);
      }
    } catch {
      points.push(null);
    }
  }

  return points;
}

export default GraphCanvas;
