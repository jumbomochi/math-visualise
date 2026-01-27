/**
 * Differentiation Component
 *
 * Visualizes derivatives, tangent/normal lines, and curve analysis.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import MathDisplay from '@/components/ui/MathDisplay';
import { MainTab, FunctionId } from './types';
import {
  derivative,
  derivativeFunction,
  tangentLine,
  normalLine,
  findCriticalPoints,
  pointsToPath,
  plotFunction,
  roundTo,
} from '@/lib/math/calculus/operations';
import { MathFunction } from '@/lib/math/calculus/types';

// Function definitions
const FUNCTIONS: Record<FunctionId, { fn: MathFunction; latex: string; derivLatex: string }> = {
  quadratic: {
    fn: (x) => x * x,
    latex: 'x^2',
    derivLatex: '2x',
  },
  cubic: {
    fn: (x) => x * x * x,
    latex: 'x^3',
    derivLatex: '3x^2',
  },
  sin: {
    fn: (x) => Math.sin(x),
    latex: '\\sin(x)',
    derivLatex: '\\cos(x)',
  },
  cos: {
    fn: (x) => Math.cos(x),
    latex: '\\cos(x)',
    derivLatex: '-\\sin(x)',
  },
  exp: {
    fn: (x) => Math.exp(x),
    latex: 'e^x',
    derivLatex: 'e^x',
  },
  ln: {
    fn: (x) => (x > 0 ? Math.log(x) : NaN),
    latex: '\\ln(x)',
    derivLatex: '\\frac{1}{x}',
  },
  polynomial: {
    fn: (x) => x * x * x - 3 * x, // Default, will be overridden
    latex: 'x^3 - 3x',
    derivLatex: '3x^2 - 3',
  },
};

const Differentiation: React.FC = () => {
  const [mainTab, setMainTab] = useState<MainTab>('derivative');
  const [functionId, setFunctionId] = useState<FunctionId>('quadratic');
  const [tangentX, setTangentX] = useState<number>(1);
  const [coeffA, setCoeffA] = useState<number>(1);
  const [coeffB, setCoeffB] = useState<number>(0);
  const [coeffC, setCoeffC] = useState<number>(-3);
  const [coeffD, setCoeffD] = useState<number>(0);

  // Get current function (with polynomial coefficients)
  const { fn, fnLatex, derivLatex } = useMemo(() => {
    if (functionId === 'polynomial') {
      const f: MathFunction = (x) => coeffA * x * x * x + coeffB * x * x + coeffC * x + coeffD;

      // Generate LaTeX
      const terms: string[] = [];
      if (coeffA !== 0) terms.push(coeffA === 1 ? 'x^3' : coeffA === -1 ? '-x^3' : `${coeffA}x^3`);
      if (coeffB !== 0) {
        const sign = coeffB > 0 && terms.length > 0 ? '+' : '';
        terms.push(coeffB === 1 ? `${sign}x^2` : coeffB === -1 ? '-x^2' : `${sign}${coeffB}x^2`);
      }
      if (coeffC !== 0) {
        const sign = coeffC > 0 && terms.length > 0 ? '+' : '';
        terms.push(coeffC === 1 ? `${sign}x` : coeffC === -1 ? '-x' : `${sign}${coeffC}x`);
      }
      if (coeffD !== 0 || terms.length === 0) {
        const sign = coeffD > 0 && terms.length > 0 ? '+' : '';
        terms.push(`${sign}${coeffD}`);
      }

      // Derivative LaTeX
      const dTerms: string[] = [];
      if (coeffA !== 0) dTerms.push(3 * coeffA === 1 ? 'x^2' : `${3 * coeffA}x^2`);
      if (coeffB !== 0) {
        const sign = 2 * coeffB > 0 && dTerms.length > 0 ? '+' : '';
        dTerms.push(2 * coeffB === 1 ? `${sign}x` : `${sign}${2 * coeffB}x`);
      }
      if (coeffC !== 0) {
        const sign = coeffC > 0 && dTerms.length > 0 ? '+' : '';
        dTerms.push(`${sign}${coeffC}`);
      }
      if (dTerms.length === 0) dTerms.push('0');

      return {
        fn: f,
        fnLatex: terms.join(''),
        derivLatex: dTerms.join(''),
      };
    }

    const def = FUNCTIONS[functionId];
    return { fn: def.fn, fnLatex: def.latex, derivLatex: def.derivLatex };
  }, [functionId, coeffA, coeffB, coeffC, coeffD]);

  // Compute derived values
  const computed = useMemo(() => {
    const dfn = derivativeFunction(fn);
    const tangent = tangentLine(fn, tangentX);
    const normal = normalLine(fn, tangentX);
    const criticalPoints = findCriticalPoints(fn, -4, 4);

    return {
      dfn,
      tangent,
      normal,
      criticalPoints,
      derivativeAtX: roundTo(derivative(fn, tangentX), 3),
    };
  }, [fn, tangentX]);

  // Canvas setup
  const width = 400;
  const height = 400;
  const xRange = 5;
  const yRange = 5;
  const scaleX = width / (2 * xRange);
  const scaleY = height / (2 * yRange);
  const cx = width / 2;
  const cy = height / 2;

  // Colors
  const colorFn = '#3b82f6';
  const colorDeriv = '#22c55e';
  const colorTangent = '#f97316';
  const colorNormal = '#8b5cf6';
  const colorMax = '#ef4444';
  const colorMin = '#22c55e';

  // Generate paths
  const fnPath = useMemo(() => pointsToPath(plotFunction(fn, -xRange, xRange)), [fn, xRange]);
  const derivPath = useMemo(
    () => pointsToPath(plotFunction(computed.dfn, -xRange, xRange)),
    [computed.dfn, xRange]
  );

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

  const functionOptions: FunctionId[] = ['quadratic', 'cubic', 'sin', 'cos', 'exp', 'ln', 'polynomial'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Differentiation</h2>
        <p className="text-gray-600 mt-1">
          Explore derivatives, tangent lines, and curve analysis.
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

              {/* Function and derivative curves */}
              <g transform={`translate(${cx}, ${cy}) scale(${scaleX}, ${-scaleY})`}>
                {/* Original function */}
                <path d={fnPath} fill="none" stroke={colorFn} strokeWidth={0.08} />

                {/* Derivative (only in derivative tab) */}
                {mainTab === 'derivative' && (
                  <path d={derivPath} fill="none" stroke={colorDeriv} strokeWidth={0.06} strokeDasharray="0.15 0.1" />
                )}

                {/* Tangent line */}
                {mainTab === 'tangent' && isFinite(computed.tangent.slope) && (
                  <>
                    <line
                      x1={-xRange}
                      y1={computed.tangent.slope * -xRange + computed.tangent.yIntercept}
                      x2={xRange}
                      y2={computed.tangent.slope * xRange + computed.tangent.yIntercept}
                      stroke={colorTangent}
                      strokeWidth={0.06}
                    />
                    {/* Normal line */}
                    {isFinite(computed.normal.slope) && (
                      <line
                        x1={-xRange}
                        y1={computed.normal.slope * -xRange + computed.normal.yIntercept}
                        x2={xRange}
                        y2={computed.normal.slope * xRange + computed.normal.yIntercept}
                        stroke={colorNormal}
                        strokeWidth={0.06}
                        strokeDasharray="0.15 0.1"
                      />
                    )}
                    {/* Point of tangency */}
                    <circle cx={computed.tangent.point.x} cy={computed.tangent.point.y} r={0.15} fill={colorTangent} />
                  </>
                )}

                {/* Critical points */}
                {mainTab === 'curve-sketch' &&
                  computed.criticalPoints.map((pt, i) => (
                    <g key={i}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={0.18}
                        fill={pt.type === 'maximum' ? colorMax : pt.type === 'minimum' ? colorMin : '#9ca3af'}
                        stroke="white"
                        strokeWidth={0.05}
                      />
                    </g>
                  ))}
              </g>

              {/* Axis labels */}
              <text x={width - 15} y={cy - 10} fill="#374151" fontSize={14} fontWeight="bold">x</text>
              <text x={cx + 10} y={15} fill="#374151" fontSize={14} fontWeight="bold">y</text>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm justify-center">
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-[#3b82f6] rounded" /> f(x)
            </span>
            {mainTab === 'derivative' && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-1 bg-[#22c55e] rounded" /> f'(x)
              </span>
            )}
            {mainTab === 'tangent' && (
              <>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#f97316] rounded" /> Tangent
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#8b5cf6] rounded" /> Normal
                </span>
              </>
            )}
            {mainTab === 'curve-sketch' && (
              <>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#ef4444] rounded-full" /> Maximum
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#22c55e] rounded-full" /> Minimum
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Controls and Results */}
        <div className="space-y-4">
          {/* Tab selector */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {(['derivative', 'tangent', 'curve-sketch'] as MainTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setMainTab(tab)}
                className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-colors ${
                  mainTab === tab ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'derivative' ? 'Derivative' : tab === 'tangent' ? 'Tangent' : 'Curve Sketch'}
              </button>
            ))}
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
            {/* Function selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Function</label>
              <div className="grid grid-cols-4 gap-2">
                {functionOptions.map((fid) => (
                  <button
                    key={fid}
                    onClick={() => setFunctionId(fid)}
                    className={`py-2 px-2 rounded-lg text-sm font-medium transition-colors ${
                      functionId === fid ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {fid === 'polynomial' ? 'Poly' : fid.charAt(0).toUpperCase() + fid.slice(1, 4)}
                  </button>
                ))}
              </div>
            </div>

            {/* Polynomial coefficients */}
            {functionId === 'polynomial' && (
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-100">
                {[
                  { label: 'a (x³)', value: coeffA, setter: setCoeffA },
                  { label: 'b (x²)', value: coeffB, setter: setCoeffB },
                  { label: 'c (x)', value: coeffC, setter: setCoeffC },
                  { label: 'd', value: coeffD, setter: setCoeffD },
                ].map(({ label, value, setter }) => (
                  <div key={label}>
                    <label className="text-xs text-gray-500">{label}</label>
                    <input
                      type="range"
                      min={-3}
                      max={3}
                      step={1}
                      value={value}
                      onChange={(e) => setter(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs font-mono">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tangent x-value slider */}
            {mainTab === 'tangent' && (
              <div className="pt-2 border-t border-gray-100">
                <label className="text-sm text-gray-600">Point x = {tangentX}</label>
                <input
                  type="range"
                  min={-4}
                  max={4}
                  step={0.1}
                  value={tangentX}
                  onChange={(e) => setTangentX(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Results */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {mainTab === 'derivative' ? 'Derivative' : mainTab === 'tangent' ? 'At Point' : 'Critical Points'}
            </h3>

            {mainTab === 'derivative' && (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <MathDisplay math={`f(x) = ${fnLatex}`} display="block" />
                </div>
                <div className="flex justify-center">
                  <MathDisplay math={`f'(x) = ${derivLatex}`} display="block" />
                </div>
              </div>
            )}

            {mainTab === 'tangent' && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Point:</span>
                  <span className="font-mono">({tangentX}, {roundTo(fn(tangentX), 2)})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Slope (f'(x)):</span>
                  <span className="font-mono">{computed.derivativeAtX}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tangent:</span>
                  <span className="font-mono">
                    y = {roundTo(computed.tangent.slope, 2)}x + {roundTo(computed.tangent.yIntercept, 2)}
                  </span>
                </div>
              </div>
            )}

            {mainTab === 'curve-sketch' && (
              <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
                {computed.criticalPoints.length === 0 ? (
                  <p className="text-gray-500">No critical points in range</p>
                ) : (
                  computed.criticalPoints.map((pt, i) => (
                    <div key={i} className="flex justify-between items-center py-1">
                      <span className={`text-xs font-medium ${pt.type === 'maximum' ? 'text-red-600' : 'text-green-600'}`}>
                        {pt.type.charAt(0).toUpperCase() + pt.type.slice(1)}
                      </span>
                      <span className="font-mono text-xs">({pt.x}, {pt.y})</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Educational note */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">
              {mainTab === 'derivative' ? 'The Derivative' : mainTab === 'tangent' ? 'Tangent & Normal' : 'Critical Points'}
            </h3>
            <p className="text-sm text-green-900">
              {mainTab === 'derivative' && (
                <>
                  The derivative <MathDisplay math="f'(x)" /> gives the instantaneous rate of change.
                  It represents the slope of the tangent line at each point.
                </>
              )}
              {mainTab === 'tangent' && (
                <>
                  The <strong>tangent</strong> has slope f'(x₀). The <strong>normal</strong> is
                  perpendicular with slope -1/f'(x₀). Equation: y - y₀ = m(x - x₀).
                </>
              )}
              {mainTab === 'curve-sketch' && (
                <>
                  <strong>Maxima</strong>: f'(x) = 0 and f''(x) {'<'} 0.{' '}
                  <strong>Minima</strong>: f'(x) = 0 and f''(x) {'>'} 0.
                  These help sketch the curve's shape.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Differentiation;
