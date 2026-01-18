/**
 * DifferentialEquations Component
 *
 * Visualizes slope fields and solution curves for first-order ODEs.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import MathDisplay from '@/components/ui/MathDisplay';
import { PresetDE } from './types';
import { generateSlopeField, eulerMethod, pointsToPath, roundTo } from '@/math/calculus/operations';
import { Point } from '@/math/calculus/types';

// Preset differential equations: dy/dx = f(x, y)
const DE_PRESETS: Record<
  PresetDE,
  {
    dydx: (x: number, y: number) => number;
    latex: string;
    name: string;
    description: string;
  }
> = {
  exponential: {
    dydx: (_x, y) => y,
    latex: '\\frac{dy}{dx} = y',
    name: 'Exponential Growth',
    description: 'Solution: y = Ce^x',
  },
  logistic: {
    dydx: (_x, y) => y * (1 - y / 4),
    latex: '\\frac{dy}{dx} = y(1 - \\frac{y}{4})',
    name: 'Logistic Growth',
    description: 'Carrying capacity K = 4',
  },
  harmonic: {
    dydx: (x, _y) => -x,
    latex: '\\frac{dy}{dx} = -x',
    name: 'Simple Parabola',
    description: 'Solution: y = -x²/2 + C',
  },
  custom: {
    dydx: (x, y) => x + y,
    latex: '\\frac{dy}{dx} = x + y',
    name: 'Linear',
    description: 'First-order linear ODE',
  },
};

const DifferentialEquations: React.FC = () => {
  const [preset, setPreset] = useState<PresetDE>('exponential');
  const [initialX, setInitialX] = useState<number>(0);
  const [initialY, setInitialY] = useState<number>(1);
  const [showSlopeField, setShowSlopeField] = useState<boolean>(true);
  const [showSolution, setShowSolution] = useState<boolean>(true);

  const deDef = DE_PRESETS[preset];

  // Generate slope field and solution curve
  const { slopeField, solutionForward, solutionBackward } = useMemo(() => {
    const field = generateSlopeField(deDef.dydx, -4, 4, -4, 4, 0.5);

    // Solve forward and backward from initial point
    const forward = eulerMethod(deDef.dydx, initialX, initialY, 4, 200);
    const backward = eulerMethod(
      deDef.dydx,
      initialX,
      initialY,
      -4,
      200
    ).reverse();

    return {
      slopeField: field,
      solutionForward: forward,
      solutionBackward: backward,
    };
  }, [deDef, initialX, initialY]);

  // Canvas setup
  const width = 400;
  const height = 400;
  const xRange = 4;
  const yRange = 4;
  const scaleX = width / (2 * xRange);
  const scaleY = height / (2 * yRange);
  const cx = width / 2;
  const cy = height / 2;

  // Colors
  const colorField = '#9ca3af';
  const colorSolution = '#3b82f6';
  const colorInitial = '#ef4444';

  // Combine solution curves
  const solutionPoints: Point[] = [...solutionBackward, ...solutionForward];
  const solutionPath = pointsToPath(solutionPoints);

  // Grid lines
  const gridLines = [];
  for (let i = -xRange; i <= xRange; i++) {
    if (i === 0) continue;
    gridLines.push(
      <line key={`v${i}`} x1={cx + i * scaleX} y1={0} x2={cx + i * scaleX} y2={height} stroke="#e5e7eb" strokeWidth={1} />
    );
  }
  for (let i = -yRange; i <= yRange; i++) {
    if (i === 0) continue;
    gridLines.push(
      <line key={`h${i}`} x1={0} y1={cy - i * scaleY} x2={width} y2={cy - i * scaleY} stroke="#e5e7eb" strokeWidth={1} />
    );
  }

  // Draw slope arrow at a point
  const SlopeArrow = ({ x, y, slope }: { x: number; y: number; slope: number }) => {
    const len = 0.2; // Arrow half-length in graph units
    const angle = Math.atan(slope);
    const dx = len * Math.cos(angle);
    const dy = len * Math.sin(angle);

    return (
      <line
        x1={x - dx}
        y1={y - dy}
        x2={x + dx}
        y2={y + dy}
        stroke={colorField}
        strokeWidth={0.04}
        strokeLinecap="round"
      />
    );
  };

  const presetOptions: PresetDE[] = ['exponential', 'logistic', 'harmonic', 'custom'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Differential Equations</h2>
        <p className="text-gray-600 mt-1">
          Explore slope fields and solution curves for first-order ODEs.
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Visualization */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="bg-white border border-gray-200 rounded-lg">
              {gridLines}

              {/* Axes */}
              <line x1={0} y1={cy} x2={width} y2={cy} stroke="#374151" strokeWidth={2} />
              <line x1={cx} y1={0} x2={cx} y2={height} stroke="#374151" strokeWidth={2} />

              <g transform={`translate(${cx}, ${cy}) scale(${scaleX}, ${-scaleY})`}>
                {/* Slope field */}
                {showSlopeField &&
                  slopeField.map((arrow, i) => (
                    <SlopeArrow key={i} x={arrow.x} y={arrow.y} slope={arrow.slope} />
                  ))}

                {/* Solution curve */}
                {showSolution && solutionPath && (
                  <path d={solutionPath} fill="none" stroke={colorSolution} strokeWidth={0.08} />
                )}

                {/* Initial point */}
                <circle cx={initialX} cy={initialY} r={0.15} fill={colorInitial} />
              </g>

              {/* Axis labels */}
              <text x={width - 15} y={cy - 10} fill="#374151" fontSize={14} fontWeight="bold">x</text>
              <text x={cx + 10} y={15} fill="#374151" fontSize={14} fontWeight="bold">y</text>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm justify-center">
            {showSlopeField && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-1 bg-[#9ca3af] rounded" /> Slope Field
              </span>
            )}
            {showSolution && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-1 bg-[#3b82f6] rounded" /> Solution
              </span>
            )}
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-[#ef4444] rounded-full" /> Initial Point
            </span>
          </div>
        </div>

        {/* Right: Controls and Results */}
        <div className="space-y-4">
          {/* Preset selector */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg flex-wrap">
            {presetOptions.map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-colors ${
                  preset === p ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {DE_PRESETS[p].name.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
            {/* Equation display */}
            <div className="flex justify-center py-2">
              <MathDisplay math={deDef.latex} display="block" />
            </div>

            {/* Initial conditions */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <label className="text-sm text-gray-600">Initial x₀</label>
                <input
                  type="range"
                  min={-3}
                  max={3}
                  step={0.5}
                  value={initialX}
                  onChange={(e) => setInitialX(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs font-mono">{initialX}</span>
              </div>
              <div>
                <label className="text-sm text-gray-600">Initial y₀</label>
                <input
                  type="range"
                  min={-3}
                  max={3}
                  step={0.5}
                  value={initialY}
                  onChange={(e) => setInitialY(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs font-mono">{initialY}</span>
              </div>
            </div>

            {/* Display toggles */}
            <div className="flex gap-4 pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showSlopeField}
                  onChange={(e) => setShowSlopeField(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Slope field</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showSolution}
                  onChange={(e) => setShowSolution(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Solution curve</span>
              </label>
            </div>
          </div>

          {/* Results */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {deDef.name}
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">{deDef.description}</p>
              <div className="flex justify-between">
                <span className="text-gray-600">Initial condition:</span>
                <span className="font-mono">y({initialX}) = {initialY}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Slope at initial point:</span>
                <span className="font-mono">{roundTo(deDef.dydx(initialX, initialY), 2)}</span>
              </div>
            </div>
          </div>

          {/* Educational note */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">
              Slope Fields
            </h3>
            <p className="text-sm text-green-900">
              A <strong>slope field</strong> shows the slope dy/dx at each point. Solution curves
              follow these slopes. The initial condition y(x₀) = y₀ determines which solution
              curve passes through that point.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DifferentialEquations;
