/**
 * GraphTransformations Component
 *
 * Visualizes how transformations affect function graphs.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import MathDisplay from '@/components/ui/MathDisplay';
import { TransformationType, FunctionId } from './types';
import { MathFunction } from '@/math/functions/types';

// Base functions
const BASE_FUNCTIONS: Record<FunctionId, { fn: MathFunction; latex: string; name: string }> = {
  quadratic: { fn: (x) => x * x, latex: 'x^2', name: 'Quadratic' },
  sqrt: { fn: (x) => (x >= 0 ? Math.sqrt(x) : NaN), latex: '\\sqrt{x}', name: 'Square Root' },
  reciprocal: { fn: (x) => (x !== 0 ? 1 / x : NaN), latex: '\\frac{1}{x}', name: 'Reciprocal' },
  abs: { fn: (x) => Math.abs(x), latex: '|x|', name: 'Absolute' },
  sin: { fn: (x) => Math.sin(x), latex: '\\sin(x)', name: 'Sine' },
  cos: { fn: (x) => Math.cos(x), latex: '\\cos(x)', name: 'Cosine' },
  exp: { fn: (x) => Math.exp(x), latex: 'e^x', name: 'Exponential' },
};

const FUNCTION_OPTIONS: FunctionId[] = ['quadratic', 'sqrt', 'reciprocal', 'abs', 'sin', 'cos', 'exp'];

const GraphTransformations: React.FC = () => {
  const [transformType, setTransformType] = useState<TransformationType>('translate');
  const [baseFunction, setBaseFunction] = useState<FunctionId>('quadratic');
  const [translateX, setTranslateX] = useState<number>(0);
  const [translateY, setTranslateY] = useState<number>(0);
  const [scaleX, setScaleX] = useState<number>(1);
  const [scaleY, setScaleY] = useState<number>(1);
  const [reflectX, setReflectX] = useState<boolean>(false);
  const [reflectY, setReflectY] = useState<boolean>(false);

  const baseFn = BASE_FUNCTIONS[baseFunction];

  // Create transformed function
  const transformedFn = useMemo(() => {
    let fn = baseFn.fn;

    if (transformType === 'translate') {
      // f(x - a) + b
      return (x: number) => fn(x - translateX) + translateY;
    } else if (transformType === 'scale') {
      // a * f(x / b)
      return (x: number) => scaleY * fn(x / scaleX);
    } else {
      // Reflections: f(-x), -f(x)
      return (x: number) => {
        const inputX = reflectX ? -x : x;
        const result = fn(inputX);
        return reflectY ? -result : result;
      };
    }
  }, [baseFn, transformType, translateX, translateY, scaleX, scaleY, reflectX, reflectY]);

  // Generate LaTeX for transformed function
  const transformedLatex = useMemo(() => {
    const base = baseFn.latex;

    if (transformType === 'translate') {
      let inner = 'x';
      if (translateX !== 0) {
        inner = translateX > 0 ? `(x - ${translateX})` : `(x + ${-translateX})`;
      }
      let result = base.replace('x', inner);
      if (translateY !== 0) {
        result = translateY > 0 ? `${result} + ${translateY}` : `${result} - ${-translateY}`;
      }
      return result;
    } else if (transformType === 'scale') {
      let inner = scaleX !== 1 ? `\\frac{x}{${scaleX}}` : 'x';
      let result = base.replace('x', inner);
      if (scaleY !== 1) {
        result = `${scaleY} \\cdot ${result}`;
      }
      return result;
    } else {
      let inner = reflectX ? '(-x)' : 'x';
      let result = base.replace('x', inner);
      if (reflectY) {
        result = `-${result}`;
      }
      return result;
    }
  }, [baseFn, transformType, translateX, translateY, scaleX, scaleY, reflectX, reflectY]);

  // Plot function to SVG path
  const plotToPath = (fn: MathFunction, xMin: number, xMax: number): string => {
    const points: string[] = [];
    const numPoints = 200;
    const step = (xMax - xMin) / numPoints;
    let prevValid = false;

    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      const y = fn(x);

      if (isFinite(y) && Math.abs(y) < 10) {
        if (!prevValid) {
          points.push(`M ${x} ${y}`);
        } else {
          points.push(`L ${x} ${y}`);
        }
        prevValid = true;
      } else {
        prevValid = false;
      }
    }

    return points.join(' ');
  };

  // Canvas dimensions and scale
  const width = 400;
  const height = 400;
  const xRange = 5;
  const yRange = 5;
  const scaleXCanvas = width / (2 * xRange);
  const scaleYCanvas = height / (2 * yRange);
  const cx = width / 2;
  const cy = height / 2;

  // Colors
  const colorOriginal = '#9ca3af';
  const colorTransformed = '#3b82f6';

  // Generate grid
  const gridLines = [];
  for (let i = -xRange; i <= xRange; i++) {
    if (i === 0) continue;
    gridLines.push(
      <line
        key={`v${i}`}
        x1={cx + i * scaleXCanvas}
        y1={0}
        x2={cx + i * scaleXCanvas}
        y2={height}
        stroke="#e5e7eb"
        strokeWidth={1}
      />
    );
  }
  for (let i = -yRange; i <= yRange; i++) {
    if (i === 0) continue;
    gridLines.push(
      <line
        key={`h${i}`}
        x1={0}
        y1={cy - i * scaleYCanvas}
        x2={width}
        y2={cy - i * scaleYCanvas}
        stroke="#e5e7eb"
        strokeWidth={1}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Graph Transformations</h2>
        <p className="text-gray-600 mt-1">
          Explore how translations, scaling, and reflections transform function graphs.
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Visualization */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              className="bg-white border border-gray-200 rounded-lg"
            >
              {/* Grid */}
              {gridLines}

              {/* Axes */}
              <line x1={0} y1={cy} x2={width} y2={cy} stroke="#374151" strokeWidth={2} />
              <line x1={cx} y1={0} x2={cx} y2={height} stroke="#374151" strokeWidth={2} />

              {/* Axis labels */}
              <text x={width - 15} y={cy - 10} fill="#374151" fontSize={14} fontWeight="bold">
                x
              </text>
              <text x={cx + 10} y={15} fill="#374151" fontSize={14} fontWeight="bold">
                y
              </text>

              {/* Original function (faded) */}
              <g transform={`translate(${cx}, ${cy}) scale(${scaleXCanvas}, ${-scaleYCanvas})`}>
                <path
                  d={plotToPath(baseFn.fn, -xRange, xRange)}
                  fill="none"
                  stroke={colorOriginal}
                  strokeWidth={0.06}
                  strokeDasharray="0.15 0.1"
                />
              </g>

              {/* Transformed function */}
              <g transform={`translate(${cx}, ${cy}) scale(${scaleXCanvas}, ${-scaleYCanvas})`}>
                <path
                  d={plotToPath(transformedFn, -xRange, xRange)}
                  fill="none"
                  stroke={colorTransformed}
                  strokeWidth={0.08}
                />
              </g>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm justify-center">
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-[#9ca3af] rounded" /> Original
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-[#3b82f6] rounded" /> Transformed
            </span>
          </div>
        </div>

        {/* Right: Controls and Results */}
        <div className="space-y-4">
          {/* Transform type tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {(['translate', 'scale', 'reflect'] as TransformationType[]).map((type) => (
              <button
                key={type}
                onClick={() => setTransformType(type)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors capitalize ${
                  transformType === type
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
            {/* Base function selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base function
              </label>
              <div className="grid grid-cols-4 gap-2">
                {FUNCTION_OPTIONS.map((fn) => (
                  <button
                    key={fn}
                    onClick={() => setBaseFunction(fn)}
                    className={`py-2 px-2 rounded-lg text-sm font-medium transition-colors ${
                      baseFunction === fn
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {BASE_FUNCTIONS[fn].name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Transform controls */}
            {transformType === 'translate' && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div>
                  <label className="text-sm text-gray-600">Horizontal shift (a)</label>
                  <input
                    type="range"
                    min={-3}
                    max={3}
                    step={0.5}
                    value={translateX}
                    onChange={(e) => setTranslateX(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-mono text-gray-600">a = {translateX}</span>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Vertical shift (b)</label>
                  <input
                    type="range"
                    min={-3}
                    max={3}
                    step={0.5}
                    value={translateY}
                    onChange={(e) => setTranslateY(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-mono text-gray-600">b = {translateY}</span>
                </div>
              </div>
            )}

            {transformType === 'scale' && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div>
                  <label className="text-sm text-gray-600">Horizontal scale (a)</label>
                  <input
                    type="range"
                    min={0.5}
                    max={3}
                    step={0.5}
                    value={scaleX}
                    onChange={(e) => setScaleX(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-mono text-gray-600">a = {scaleX}</span>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Vertical scale (b)</label>
                  <input
                    type="range"
                    min={0.5}
                    max={3}
                    step={0.5}
                    value={scaleY}
                    onChange={(e) => setScaleY(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-mono text-gray-600">b = {scaleY}</span>
                </div>
              </div>
            )}

            {transformType === 'reflect' && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reflectX}
                    onChange={(e) => setReflectX(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Reflect in y-axis (f(-x))</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reflectY}
                    onChange={(e) => setReflectY(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Reflect in x-axis (-f(x))</span>
                </label>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Transformed Function
            </h3>
            <div className="flex justify-center">
              <MathDisplay math={`y = ${transformedLatex}`} display="block" />
            </div>
          </div>

          {/* Educational note */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-2">
              {transformType === 'translate'
                ? 'Translations'
                : transformType === 'scale'
                ? 'Scaling'
                : 'Reflections'}
            </h3>
            <p className="text-sm text-blue-900">
              {transformType === 'translate' && (
                <>
                  <MathDisplay math="y = f(x - a) + b" /> translates the graph{' '}
                  <strong>a</strong> units right and <strong>b</strong> units up.
                  Note: inside the function, subtract to go right!
                </>
              )}
              {transformType === 'scale' && (
                <>
                  <MathDisplay math="y = b \cdot f(x/a)" /> stretches horizontally by factor{' '}
                  <strong>a</strong> and vertically by factor <strong>b</strong>.
                  Divide x to stretch horizontally.
                </>
              )}
              {transformType === 'reflect' && (
                <>
                  <MathDisplay math="y = f(-x)" /> reflects in the y-axis.
                  <MathDisplay math="y = -f(x)" /> reflects in the x-axis.
                  Both can be combined.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GraphTransformations;
