/**
 * RationalFunctions Component
 *
 * Visualizes rational functions with asymptotes and key features.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import MathDisplay from '@/components/ui/MathDisplay';
import { RationalPreset } from './types';

const RationalFunctions: React.FC = () => {
  const [preset, setPreset] = useState<RationalPreset>('basic');
  // Numerator: ax + b
  const [numA, setNumA] = useState<number>(1);
  const [numB, setNumB] = useState<number>(0);
  // Denominator: cx + d
  const [denC, setDenC] = useState<number>(1);
  const [denD, setDenD] = useState<number>(-1);

  // Apply presets
  const applyPreset = (p: RationalPreset) => {
    setPreset(p);
    switch (p) {
      case 'basic':
        setNumA(1);
        setNumB(0);
        setDenC(1);
        setDenD(0);
        break;
      case 'quadratic-linear':
        // Will use a different form
        setNumA(1);
        setNumB(-1);
        setDenC(1);
        setDenD(-2);
        break;
      case 'linear-quadratic':
        setNumA(2);
        setNumB(1);
        setDenC(1);
        setDenD(1);
        break;
      case 'custom':
        // Keep current values
        break;
    }
  };

  // Compute the rational function and analysis
  const computed = useMemo(() => {
    // f(x) = (ax + b) / (cx + d)
    const fn = (x: number): number => {
      const denom = denC * x + denD;
      if (Math.abs(denom) < 0.001) return NaN;
      return (numA * x + numB) / denom;
    };

    // Vertical asymptote: cx + d = 0 => x = -d/c
    const verticalAsymptote = denC !== 0 ? -denD / denC : null;

    // Horizontal asymptote: compare degrees
    // Both are degree 1, so HA = a/c
    const horizontalAsymptote = denC !== 0 ? numA / denC : null;

    // X-intercept: ax + b = 0 => x = -b/a
    const xIntercept = numA !== 0 ? -numB / numA : null;

    // Y-intercept: f(0) = b/d (if d ≠ 0)
    const yIntercept = denD !== 0 ? numB / denD : null;

    return {
      fn,
      verticalAsymptote,
      horizontalAsymptote,
      xIntercept,
      yIntercept,
    };
  }, [numA, numB, denC, denD]);

  // Generate LaTeX for the function
  const functionLatex = useMemo(() => {
    const formatTerm = (coeff: number, hasX: boolean, isFirst: boolean): string => {
      if (coeff === 0) return '';
      const sign = coeff > 0 ? (isFirst ? '' : '+') : '-';
      const absCoeff = Math.abs(coeff);
      if (hasX) {
        if (absCoeff === 1) return `${sign}x`;
        return `${sign}${absCoeff}x`;
      }
      return `${sign}${absCoeff}`;
    };

    let num = '';
    if (numA !== 0) num += formatTerm(numA, true, true);
    if (numB !== 0) num += formatTerm(numB, false, num === '');
    if (num === '') num = '0';

    let den = '';
    if (denC !== 0) den += formatTerm(denC, true, true);
    if (denD !== 0) den += formatTerm(denD, false, den === '');
    if (den === '') den = '1';

    return `f(x) = \\frac{${num}}{${den}}`;
  }, [numA, numB, denC, denD]);

  // Plot function to SVG path
  const plotToPath = (fn: (x: number) => number, xMin: number, xMax: number, va: number | null): string => {
    const points: string[] = [];
    const numPoints = 400;
    const step = (xMax - xMin) / numPoints;
    let prevValid = false;

    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;

      // Skip points very close to vertical asymptote
      if (va !== null && Math.abs(x - va) < 0.1) {
        prevValid = false;
        continue;
      }

      const y = fn(x);

      if (isFinite(y) && Math.abs(y) < 15) {
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
  const xRange = 6;
  const yRange = 6;
  const scaleX = width / (2 * xRange);
  const scaleY = height / (2 * yRange);
  const cx = width / 2;
  const cy = height / 2;

  // Colors
  const colorFunction = '#3b82f6';
  const colorVA = '#ef4444';
  const colorHA = '#22c55e';
  const colorIntercept = '#f97316';

  // Generate grid
  const gridLines = [];
  for (let i = -xRange; i <= xRange; i++) {
    if (i === 0) continue;
    gridLines.push(
      <line
        key={`v${i}`}
        x1={cx + i * scaleX}
        y1={0}
        x2={cx + i * scaleX}
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
        y1={cy - i * scaleY}
        x2={width}
        y2={cy - i * scaleY}
        stroke="#e5e7eb"
        strokeWidth={1}
      />
    );
  }

  const presetOptions: { id: RationalPreset; label: string }[] = [
    { id: 'basic', label: '1/x' },
    { id: 'quadratic-linear', label: '(x-1)/(x-2)' },
    { id: 'linear-quadratic', label: '(2x+1)/(x+1)' },
    { id: 'custom', label: 'Custom' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Rational Functions</h2>
        <p className="text-gray-600 mt-1">
          Explore rational functions, asymptotes, and key features.
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

              {/* Vertical asymptote */}
              {computed.verticalAsymptote !== null && (
                <line
                  x1={cx + computed.verticalAsymptote * scaleX}
                  y1={0}
                  x2={cx + computed.verticalAsymptote * scaleX}
                  y2={height}
                  stroke={colorVA}
                  strokeWidth={2}
                  strokeDasharray="8 4"
                />
              )}

              {/* Horizontal asymptote */}
              {computed.horizontalAsymptote !== null && (
                <line
                  x1={0}
                  y1={cy - computed.horizontalAsymptote * scaleY}
                  x2={width}
                  y2={cy - computed.horizontalAsymptote * scaleY}
                  stroke={colorHA}
                  strokeWidth={2}
                  strokeDasharray="8 4"
                />
              )}

              {/* Function curve */}
              <g transform={`translate(${cx}, ${cy}) scale(${scaleX}, ${-scaleY})`}>
                <path
                  d={plotToPath(computed.fn, -xRange, xRange, computed.verticalAsymptote)}
                  fill="none"
                  stroke={colorFunction}
                  strokeWidth={0.08}
                />
              </g>

              {/* X-intercept */}
              {computed.xIntercept !== null &&
                computed.xIntercept !== computed.verticalAsymptote &&
                Math.abs(computed.xIntercept) <= xRange && (
                  <circle
                    cx={cx + computed.xIntercept * scaleX}
                    cy={cy}
                    r={6}
                    fill={colorIntercept}
                  />
                )}

              {/* Y-intercept */}
              {computed.yIntercept !== null && Math.abs(computed.yIntercept) <= yRange && (
                <circle
                  cx={cx}
                  cy={cy - computed.yIntercept * scaleY}
                  r={6}
                  fill={colorIntercept}
                />
              )}

              {/* Axis labels */}
              <text x={width - 15} y={cy - 10} fill="#374151" fontSize={14} fontWeight="bold">
                x
              </text>
              <text x={cx + 10} y={15} fill="#374151" fontSize={14} fontWeight="bold">
                y
              </text>
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm justify-center">
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-[#3b82f6] rounded" /> f(x)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-[#ef4444] rounded" /> Vertical Asymptote
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-[#22c55e] rounded" /> Horizontal Asymptote
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-[#f97316] rounded-full" /> Intercepts
            </span>
          </div>
        </div>

        {/* Right: Controls and Results */}
        <div className="space-y-4">
          {/* Preset selector */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {presetOptions.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-colors ${
                  preset === p.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Coefficient controls */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numerator (ax + b)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">a</label>
                  <input
                    type="range"
                    min={-3}
                    max={3}
                    step={1}
                    value={numA}
                    onChange={(e) => {
                      setNumA(parseInt(e.target.value));
                      setPreset('custom');
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-mono text-gray-600">{numA}</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500">b</label>
                  <input
                    type="range"
                    min={-3}
                    max={3}
                    step={1}
                    value={numB}
                    onChange={(e) => {
                      setNumB(parseInt(e.target.value));
                      setPreset('custom');
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-mono text-gray-600">{numB}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Denominator (cx + d)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">c</label>
                  <input
                    type="range"
                    min={-3}
                    max={3}
                    step={1}
                    value={denC}
                    onChange={(e) => {
                      setDenC(parseInt(e.target.value));
                      setPreset('custom');
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-mono text-gray-600">{denC}</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500">d</label>
                  <input
                    type="range"
                    min={-3}
                    max={3}
                    step={1}
                    value={denD}
                    onChange={(e) => {
                      setDenD(parseInt(e.target.value));
                      setPreset('custom');
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-mono text-gray-600">{denD}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Analysis
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-center mb-3">
                <MathDisplay math={functionLatex} display="block" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vertical asymptote:</span>
                <span className="font-mono">
                  {computed.verticalAsymptote !== null
                    ? `x = ${computed.verticalAsymptote.toFixed(2)}`
                    : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Horizontal asymptote:</span>
                <span className="font-mono">
                  {computed.horizontalAsymptote !== null
                    ? `y = ${computed.horizontalAsymptote.toFixed(2)}`
                    : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">X-intercept:</span>
                <span className="font-mono">
                  {computed.xIntercept !== null
                    ? `(${computed.xIntercept.toFixed(2)}, 0)`
                    : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Y-intercept:</span>
                <span className="font-mono">
                  {computed.yIntercept !== null
                    ? `(0, ${computed.yIntercept.toFixed(2)})`
                    : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Educational note */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-2">
              Asymptotes
            </h3>
            <p className="text-sm text-blue-900">
              <strong>Vertical asymptotes</strong> occur where the denominator = 0.
              <strong> Horizontal asymptotes</strong> depend on the degrees:
              same degree → ratio of leading coefficients;
              numerator lower degree → y = 0.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RationalFunctions;
