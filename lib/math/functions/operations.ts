/**
 * Functions Operations
 *
 * Core mathematical operations for functions.
 * Following Singapore H2 Math syllabus conventions.
 */

import {
  MathFunction,
  NamedFunction,
  Point,
  Transformation,
  PlotData,
  RationalAnalysis,
} from './types';

// ============================================================================
// Standard Functions Library
// ============================================================================

export const STANDARD_FUNCTIONS: NamedFunction[] = [
  {
    id: 'linear',
    name: 'Linear',
    latex: 'f(x) = x',
    fn: (x) => x,
  },
  {
    id: 'quadratic',
    name: 'Quadratic',
    latex: 'f(x) = x^2',
    fn: (x) => x * x,
  },
  {
    id: 'cubic',
    name: 'Cubic',
    latex: 'f(x) = x^3',
    fn: (x) => x * x * x,
  },
  {
    id: 'sqrt',
    name: 'Square Root',
    latex: 'f(x) = \\sqrt{x}',
    fn: (x) => (x >= 0 ? Math.sqrt(x) : NaN),
  },
  {
    id: 'reciprocal',
    name: 'Reciprocal',
    latex: 'f(x) = \\frac{1}{x}',
    fn: (x) => (x !== 0 ? 1 / x : NaN),
  },
  {
    id: 'abs',
    name: 'Absolute Value',
    latex: 'f(x) = |x|',
    fn: (x) => Math.abs(x),
  },
  {
    id: 'exp',
    name: 'Exponential',
    latex: 'f(x) = e^x',
    fn: (x) => Math.exp(x),
  },
  {
    id: 'ln',
    name: 'Natural Log',
    latex: 'f(x) = \\ln(x)',
    fn: (x) => (x > 0 ? Math.log(x) : NaN),
  },
  {
    id: 'sin',
    name: 'Sine',
    latex: 'f(x) = \\sin(x)',
    fn: (x) => Math.sin(x),
  },
  {
    id: 'cos',
    name: 'Cosine',
    latex: 'f(x) = \\cos(x)',
    fn: (x) => Math.cos(x),
  },
];

// ============================================================================
// Function Composition
// ============================================================================

/**
 * Compose two functions: (f ∘ g)(x) = f(g(x))
 */
export function compose(f: MathFunction, g: MathFunction): MathFunction {
  return (x: number) => f(g(x));
}

/**
 * Create inverse function (numerical approximation)
 * Only works for monotonic functions in the given domain
 */
export function numericalInverse(
  f: MathFunction,
  xMin: number,
  xMax: number,
  tolerance: number = 0.0001
): MathFunction {
  return (y: number) => {
    // Binary search for x such that f(x) = y
    let lo = xMin;
    let hi = xMax;
    const increasing = f(xMax) > f(xMin);

    for (let i = 0; i < 50; i++) {
      const mid = (lo + hi) / 2;
      const fMid = f(mid);

      if (Math.abs(fMid - y) < tolerance) {
        return mid;
      }

      if ((fMid < y) === increasing) {
        lo = mid;
      } else {
        hi = mid;
      }
    }

    return (lo + hi) / 2;
  };
}

// ============================================================================
// Transformations
// ============================================================================

/**
 * Apply a transformation to a function
 */
export function applyTransformation(
  f: MathFunction,
  transform: Transformation
): MathFunction {
  switch (transform.type) {
    case 'translate-x':
      // f(x - a) shifts right by a
      return (x) => f(x - transform.value);

    case 'translate-y':
      // f(x) + a shifts up by a
      return (x) => f(x) + transform.value;

    case 'scale-x':
      // f(x/a) stretches horizontally by factor a
      return (x) => f(x / transform.value);

    case 'scale-y':
      // a * f(x) stretches vertically by factor a
      return (x) => transform.value * f(x);

    case 'reflect-x':
      // f(-x) reflects in y-axis
      return (x) => f(-x);

    case 'reflect-y':
      // -f(x) reflects in x-axis
      return (x) => -f(x);

    default:
      return f;
  }
}

/**
 * Apply multiple transformations in sequence
 */
export function applyTransformations(
  f: MathFunction,
  transforms: Transformation[]
): MathFunction {
  return transforms.reduce((fn, t) => applyTransformation(fn, t), f);
}

/**
 * Generate transformation description
 */
export function describeTransformation(transform: Transformation): string {
  const v = transform.value;
  switch (transform.type) {
    case 'translate-x':
      return v > 0 ? `Translate ${v} units right` : `Translate ${-v} units left`;
    case 'translate-y':
      return v > 0 ? `Translate ${v} units up` : `Translate ${-v} units down`;
    case 'scale-x':
      return v > 1 ? `Stretch horizontally by factor ${v}` : `Compress horizontally by factor ${1/v}`;
    case 'scale-y':
      return v > 1 ? `Stretch vertically by factor ${v}` : `Compress vertically by factor ${1/v}`;
    case 'reflect-x':
      return 'Reflect in y-axis';
    case 'reflect-y':
      return 'Reflect in x-axis';
    default:
      return '';
  }
}

// ============================================================================
// Plotting
// ============================================================================

/**
 * Generate plot data for a function
 */
export function plotFunction(
  f: MathFunction,
  xMin: number,
  xMax: number,
  numPoints: number = 200
): PlotData {
  const points: Point[] = [];
  const discontinuities: number[] = [];
  const step = (xMax - xMin) / numPoints;

  let prevY: number | null = null;

  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * step;
    const y = f(x);

    if (isFinite(y)) {
      // Check for discontinuity (large jump)
      if (prevY !== null && Math.abs(y - prevY) > 10) {
        discontinuities.push(x);
        points.push({ x, y: NaN }); // Break the line
      }
      points.push({ x, y });
      prevY = y;
    } else {
      if (prevY !== null) {
        discontinuities.push(x);
      }
      prevY = null;
    }
  }

  return { points, discontinuities };
}

// ============================================================================
// Rational Function Analysis
// ============================================================================

/**
 * Create a rational function from numerator and denominator coefficients
 * Coefficients are in descending order of power: [a_n, a_{n-1}, ..., a_1, a_0]
 */
export function createRationalFunction(
  numeratorCoeffs: number[],
  denominatorCoeffs: number[]
): MathFunction {
  const evalPoly = (coeffs: number[], x: number): number => {
    return coeffs.reduce((sum, coeff, i) => sum + coeff * Math.pow(x, coeffs.length - 1 - i), 0);
  };

  return (x: number) => {
    const denom = evalPoly(denominatorCoeffs, x);
    if (Math.abs(denom) < 1e-10) return NaN;
    return evalPoly(numeratorCoeffs, x) / denom;
  };
}

/**
 * Find roots of a polynomial (numerical, for low-degree polynomials)
 */
export function findPolynomialRoots(coeffs: number[], xMin: number = -10, xMax: number = 10): number[] {
  const roots: number[] = [];
  const step = 0.1;
  const tolerance = 0.001;

  const evalPoly = (x: number): number => {
    return coeffs.reduce((sum, coeff, i) => sum + coeff * Math.pow(x, coeffs.length - 1 - i), 0);
  };

  let prevSign = Math.sign(evalPoly(xMin));

  for (let x = xMin + step; x <= xMax; x += step) {
    const val = evalPoly(x);
    const sign = Math.sign(val);

    if (sign !== prevSign && prevSign !== 0) {
      // Root between x - step and x, use bisection
      let lo = x - step;
      let hi = x;
      for (let i = 0; i < 20; i++) {
        const mid = (lo + hi) / 2;
        if (evalPoly(mid) * evalPoly(lo) < 0) {
          hi = mid;
        } else {
          lo = mid;
        }
      }
      const root = (lo + hi) / 2;
      // Avoid duplicates
      if (!roots.some(r => Math.abs(r - root) < tolerance)) {
        roots.push(roundTo(root, 3));
      }
    }

    prevSign = sign;
  }

  return roots;
}

/**
 * Analyze a rational function
 */
export function analyzeRational(
  numeratorCoeffs: number[],
  denominatorCoeffs: number[]
): RationalAnalysis {
  // Vertical asymptotes: roots of denominator (excluding holes)
  const denomRoots = findPolynomialRoots(denominatorCoeffs);
  const numRoots = findPolynomialRoots(numeratorCoeffs);

  // Check for holes (common roots)
  const holes: Point[] = [];
  const verticalAsymptotes: number[] = [];

  for (const root of denomRoots) {
    if (numRoots.some(r => Math.abs(r - root) < 0.01)) {
      // This is a hole, not an asymptote
      // Would need L'Hopital or simplification to find y-value
      holes.push({ x: root, y: NaN });
    } else {
      verticalAsymptotes.push(root);
    }
  }

  // Horizontal asymptote: compare degrees
  const numDegree = numeratorCoeffs.length - 1;
  const denomDegree = denominatorCoeffs.length - 1;
  let horizontalAsymptote: number | null = null;

  if (numDegree < denomDegree) {
    horizontalAsymptote = 0;
  } else if (numDegree === denomDegree) {
    horizontalAsymptote = numeratorCoeffs[0] / denominatorCoeffs[0];
  }
  // If numDegree > denomDegree, there's an oblique asymptote (not handled here)

  // X-intercepts: roots of numerator that aren't holes
  const xIntercepts = numRoots.filter(r => !holes.some(h => Math.abs(h.x - r) < 0.01));

  // Y-intercept: f(0) if defined
  const f = createRationalFunction(numeratorCoeffs, denominatorCoeffs);
  const yIntercept = isFinite(f(0)) ? f(0) : null;

  return {
    verticalAsymptotes,
    horizontalAsymptote,
    xIntercepts,
    yIntercept,
    holes,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Check if a function is defined at a point
 */
export function isDefined(f: MathFunction, x: number): boolean {
  const y = f(x);
  return isFinite(y);
}

/**
 * Find approximate range of function over interval
 */
export function findRange(
  f: MathFunction,
  xMin: number,
  xMax: number,
  numSamples: number = 100
): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  const step = (xMax - xMin) / numSamples;

  for (let x = xMin; x <= xMax; x += step) {
    const y = f(x);
    if (isFinite(y)) {
      min = Math.min(min, y);
      max = Math.max(max, y);
    }
  }

  return { min, max };
}
