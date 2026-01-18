/**
 * Integration Component
 *
 * Visualizes Riemann sums, definite integrals, and volumes of revolution.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import MathDisplay from '@/components/ui/MathDisplay';
import { MainTab, RiemannType, FunctionId } from './types';
import {
  integrate,
  riemannSum,
  volumeOfRevolutionX,
  pointsToPath,
  plotFunction,
  roundTo,
} from '@/math/calculus/operations';
import { MathFunction } from '@/math/calculus/types';

// Function definitions
const FUNCTIONS: Record<FunctionId, { fn: MathFunction; latex: string; integral: string }> = {
  quadratic: {
    fn: (x) => x * x,
    latex: 'x^2',
    integral: '\\frac{x^3}{3}',
  },
  sqrt: {
    fn: (x) => (x >= 0 ? Math.sqrt(x) : 0),
    latex: '\\sqrt{x}',
    integral: '\\frac{2x^{3/2}}{3}',
  },
  sin: {
    fn: (x) => Math.sin(x),
    latex: '\\sin(x)',
    integral: '-\\cos(x)',
  },
  exp: {
    fn: (x) => Math.exp(x),
    latex: 'e^x',
    integral: 'e^x',
  },
  linear: {
    fn: (x) => x,
    latex: 'x',
    integral: '\\frac{x^2}{2}',
  },
};

const Integration: React.FC = () => {
  const [mainTab, setMainTab] = useState<MainTab>('riemann');
  const [functionId, setFunctionId] = useState<FunctionId>('quadratic');
  const [lowerBound, setLowerBound] = useState<number>(0);
  const [upperBound, setUpperBound] = useState<number>(2);
  const [numRectangles, setNumRectangles] = useState<number>(5);
  const [riemannType, setRiemannType] = useState<RiemannType>('left');

  const funcDef = FUNCTIONS[functionId];
  const fn = funcDef.fn;

  // Computed values
  const computed = useMemo(() => {
    const exactIntegral = integrate(fn, lowerBound, upperBound);
    const riemann = riemannSum(fn, lowerBound, upperBound, numRectangles, riemannType);
    const volume = volumeOfRevolutionX(fn, lowerBound, upperBound);

    return {
      exactIntegral: roundTo(exactIntegral, 4),
      riemannValue: roundTo(riemann.value, 4),
      riemannRectangles: riemann.rectangles,
      error: roundTo(Math.abs(exactIntegral - riemann.value), 4),
      volume: roundTo(volume, 4),
    };
  }, [fn, lowerBound, upperBound, numRectangles, riemannType]);

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
  const colorFn = '#3b82f6';
  const colorArea = '#22c55e';
  const colorRect = '#f97316';

  // Generate function path
  const fnPath = useMemo(() => pointsToPath(plotFunction(fn, -xRange, xRange)), [fn, xRange]);

  // Generate area path (filled region under curve)
  const areaPath = useMemo(() => {
    const points = plotFunction(fn, lowerBound, upperBound, 100);
    if (points.length === 0) return '';

    let path = `M ${lowerBound} 0`;
    points.forEach((p) => {
      path += ` L ${p.x} ${p.y}`;
    });
    path += ` L ${upperBound} 0 Z`;
    return path;
  }, [fn, lowerBound, upperBound]);

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

  const functionOptions: FunctionId[] = ['quadratic', 'sqrt', 'sin', 'exp', 'linear'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Integration</h2>
        <p className="text-gray-600 mt-1">
          Explore Riemann sums, definite integrals, and volumes of revolution.
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
                {/* Filled area (for area tab) */}
                {mainTab === 'area' && (
                  <path d={areaPath} fill={colorArea} fillOpacity={0.3} stroke={colorArea} strokeWidth={0.04} />
                )}

                {/* Riemann rectangles */}
                {mainTab === 'riemann' &&
                  computed.riemannRectangles.map((rect, i) => (
                    <rect
                      key={i}
                      x={rect.x}
                      y={0}
                      width={rect.width * 0.98}
                      height={Math.abs(rect.height)}
                      transform={rect.height < 0 ? `translate(0, ${rect.height})` : undefined}
                      fill={colorRect}
                      fillOpacity={0.4}
                      stroke={colorRect}
                      strokeWidth={0.03}
                    />
                  ))}

                {/* Volume visualization (disk cross-sections) */}
                {mainTab === 'volume' && (
                  <>
                    {/* Show several "disk" cross-sections */}
                    {[0.2, 0.4, 0.6, 0.8].map((t) => {
                      const x = lowerBound + t * (upperBound - lowerBound);
                      const r = Math.abs(fn(x));
                      return (
                        <g key={t}>
                          {/* Vertical line showing radius */}
                          <line x1={x} y1={0} x2={x} y2={r} stroke="#8b5cf6" strokeWidth={0.04} strokeDasharray="0.1 0.05" />
                          {/* Ellipse representing disk (simplified 2D view) */}
                          <ellipse
                            cx={x}
                            cy={0}
                            rx={0.08}
                            ry={r}
                            fill="#8b5cf6"
                            fillOpacity={0.3}
                            stroke="#8b5cf6"
                            strokeWidth={0.03}
                          />
                        </g>
                      );
                    })}
                    {/* Filled area to show the region being rotated */}
                    <path d={areaPath} fill={colorArea} fillOpacity={0.2} stroke={colorArea} strokeWidth={0.04} />
                  </>
                )}

                {/* Function curve */}
                <path d={fnPath} fill="none" stroke={colorFn} strokeWidth={0.08} />

                {/* Bound markers */}
                <line x1={lowerBound} y1={-0.2} x2={lowerBound} y2={0.2} stroke="#374151" strokeWidth={0.06} />
                <line x1={upperBound} y1={-0.2} x2={upperBound} y2={0.2} stroke="#374151" strokeWidth={0.06} />
              </g>

              {/* Axis labels */}
              <text x={width - 15} y={cy - 10} fill="#374151" fontSize={14} fontWeight="bold">x</text>
              <text x={cx + 10} y={15} fill="#374151" fontSize={14} fontWeight="bold">y</text>

              {/* Bound labels */}
              <text x={cx + lowerBound * scaleX} y={cy + 20} fill="#374151" fontSize={12} textAnchor="middle">
                a={lowerBound}
              </text>
              <text x={cx + upperBound * scaleX} y={cy + 20} fill="#374151" fontSize={12} textAnchor="middle">
                b={upperBound}
              </text>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm justify-center">
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-[#3b82f6] rounded" /> f(x)
            </span>
            {mainTab === 'riemann' && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-[#f97316] opacity-40 rounded" /> Rectangles
              </span>
            )}
            {(mainTab === 'area' || mainTab === 'volume') && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-[#22c55e] opacity-40 rounded" /> Area
              </span>
            )}
          </div>
        </div>

        {/* Right: Controls and Results */}
        <div className="space-y-4">
          {/* Tab selector */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {(['riemann', 'area', 'volume'] as MainTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setMainTab(tab)}
                className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-colors ${
                  mainTab === tab ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'riemann' ? 'Riemann' : tab === 'area' ? 'Area' : 'Volume'}
              </button>
            ))}
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
            {/* Function selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Function</label>
              <div className="flex gap-2 flex-wrap">
                {functionOptions.map((fid) => (
                  <button
                    key={fid}
                    onClick={() => setFunctionId(fid)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      functionId === fid ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {fid === 'quadratic' ? 'x²' : fid === 'sqrt' ? '√x' : fid === 'exp' ? 'eˣ' : fid}
                  </button>
                ))}
              </div>
            </div>

            {/* Bounds */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <label className="text-sm text-gray-600">Lower (a)</label>
                <input
                  type="range"
                  min={functionId === 'sqrt' ? 0 : -3}
                  max={upperBound - 0.5}
                  step={0.5}
                  value={lowerBound}
                  onChange={(e) => setLowerBound(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs font-mono">{lowerBound}</span>
              </div>
              <div>
                <label className="text-sm text-gray-600">Upper (b)</label>
                <input
                  type="range"
                  min={lowerBound + 0.5}
                  max={3}
                  step={0.5}
                  value={upperBound}
                  onChange={(e) => setUpperBound(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs font-mono">{upperBound}</span>
              </div>
            </div>

            {/* Riemann options */}
            {mainTab === 'riemann' && (
              <div className="pt-2 border-t border-gray-100 space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Rectangles: {numRectangles}</label>
                  <input
                    type="range"
                    min={2}
                    max={20}
                    step={1}
                    value={numRectangles}
                    onChange={(e) => setNumRectangles(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex gap-2">
                  {(['left', 'midpoint', 'right'] as RiemannType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setRiemannType(type)}
                      className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors capitalize ${
                        riemannType === type ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {mainTab === 'riemann' ? 'Approximation' : mainTab === 'area' ? 'Definite Integral' : 'Volume'}
            </h3>

            {mainTab === 'riemann' && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Riemann sum:</span>
                  <span className="font-mono font-semibold">{computed.riemannValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Exact integral:</span>
                  <span className="font-mono">{computed.exactIntegral}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Error:</span>
                  <span className="font-mono text-red-600">{computed.error}</span>
                </div>
              </div>
            )}

            {mainTab === 'area' && (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <MathDisplay
                    math={`\\int_{${lowerBound}}^{${upperBound}} ${funcDef.latex} \\, dx = ${computed.exactIntegral}`}
                    display="block"
                  />
                </div>
              </div>
            )}

            {mainTab === 'volume' && (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <MathDisplay
                    math={`V = \\pi \\int_{${lowerBound}}^{${upperBound}} [f(x)]^2 \\, dx`}
                    display="block"
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Volume:</span>
                  <span className="font-mono font-semibold">{computed.volume}</span>
                </div>
              </div>
            )}
          </div>

          {/* Educational note */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">
              {mainTab === 'riemann' ? 'Riemann Sums' : mainTab === 'area' ? 'Area Under Curve' : 'Volume of Revolution'}
            </h3>
            <p className="text-sm text-green-900">
              {mainTab === 'riemann' && (
                <>
                  Riemann sums approximate the integral using rectangles. As the number of
                  rectangles increases, the sum converges to the exact integral.
                </>
              )}
              {mainTab === 'area' && (
                <>
                  The definite integral <MathDisplay math="\int_a^b f(x)\,dx" /> gives the signed area
                  between f(x) and the x-axis. Areas below the axis are negative.
                </>
              )}
              {mainTab === 'volume' && (
                <>
                  Rotating the region about the x-axis creates a solid. The disk method uses
                  <MathDisplay math="V = \pi\int_a^b [f(x)]^2\,dx" />.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Integration;
