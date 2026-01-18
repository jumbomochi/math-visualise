/**
 * TI-84 Graph Display Component
 */

import { FC, useEffect, useRef } from 'react';
import { GraphWindow } from './types';
import { generateGraphPoints } from './calculatorEngine';

interface GraphDisplayProps {
  functions: string[];
  window: GraphWindow;
  angleMode: 'DEG' | 'RAD';
}

const COLORS = ['#0000FF', '#FF0000', '#00AA00', '#FF00FF'];

export const GraphDisplay: FC<GraphDisplayProps> = ({ functions, window, angleMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 360;
    const height = 270;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Calculate scale
    const xRange = window.xMax - window.xMin;
    const yRange = window.yMax - window.yMin;
    const xScale = width / xRange;
    const yScale = height / yRange;

    // Transform coordinate system
    const toScreenX = (x: number) => ((x - window.xMin) * xScale);
    const toScreenY = (y: number) => (height - (y - window.yMin) * yScale);

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;

    // Vertical grid lines
    for (let x = Math.ceil(window.xMin / window.xScl) * window.xScl; x <= window.xMax; x += window.xScl) {
      const screenX = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, height);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let y = Math.ceil(window.yMin / window.yScl) * window.yScl; y <= window.yMax; y += window.yScl) {
      const screenY = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, screenY);
      ctx.lineTo(width, screenY);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;

    // X-axis
    if (window.yMin <= 0 && window.yMax >= 0) {
      const y0 = toScreenY(0);
      ctx.beginPath();
      ctx.moveTo(0, y0);
      ctx.lineTo(width, y0);
      ctx.stroke();
    }

    // Y-axis
    if (window.xMin <= 0 && window.xMax >= 0) {
      const x0 = toScreenX(0);
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0, height);
      ctx.stroke();
    }

    // Draw axis labels
    ctx.fillStyle = '#000000';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // X-axis labels
    for (let x = Math.ceil(window.xMin / window.xScl) * window.xScl; x <= window.xMax; x += window.xScl) {
      if (Math.abs(x) > 0.001) {
        const screenX = toScreenX(x);
        const y0 = Math.max(10, Math.min(height - 10, toScreenY(0)));
        ctx.fillText(x.toFixed(0), screenX, y0 + 2);
      }
    }

    // Y-axis labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = Math.ceil(window.yMin / window.yScl) * window.yScl; y <= window.yMax; y += window.yScl) {
      if (Math.abs(y) > 0.001) {
        const x0 = Math.max(25, Math.min(width - 5, toScreenX(0)));
        const screenY = toScreenY(y);
        ctx.fillText(y.toFixed(0), x0 - 2, screenY);
      }
    }

    // Draw functions
    functions.forEach((func, index) => {
      if (!func || func.trim() === '') return;

      const points = generateGraphPoints(func, window.xMin, window.xMax, 300, angleMode);

      ctx.strokeStyle = COLORS[index % COLORS.length];
      ctx.lineWidth = 2;
      ctx.beginPath();

      let isDrawing = false;

      points.forEach((point) => {
        if (point === null) {
          isDrawing = false;
          return;
        }

        const { x, y } = point;

        // Check if point is within bounds
        if (y < window.yMin - yRange || y > window.yMax + yRange) {
          isDrawing = false;
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
      });

      ctx.stroke();
    });

    // Draw function labels
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    functions.forEach((func, index) => {
      if (func && func.trim() !== '') {
        ctx.fillStyle = COLORS[index % COLORS.length];
        ctx.fillText(`Y${index + 1}=${func}`, 5, 5 + index * 15);
      }
    });

  }, [functions, window, angleMode]);

  return (
    <div className="bg-white border-3 border-gray-800 rounded-lg p-2">
      <canvas
        ref={canvasRef}
        width={360}
        height={270}
        className="bg-[#9db89d] rounded w-full"
      />
    </div>
  );
};
