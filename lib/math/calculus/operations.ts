/**
 * Calculus Operations
 *
 * Core mathematical operations for calculus.
 * Following Singapore H2 Math syllabus conventions.
 */

import {
  MathFunction,
  Point,
  TangentLine,
  NormalLine,
  CriticalPoint,
  RiemannSum,
  Rectangle,
  SlopeArrow,
} from './types';

// ============================================================================
// Numerical Differentiation
// ============================================================================

/**
 * Compute derivative at a point using central difference
 */
export function derivative(f: MathFunction, x: number, h: number = 0.0001): number {
  return (f(x + h) - f(x - h)) / (2 * h);
}

/**
 * Compute second derivative at a point
 */
export function secondDerivative(f: MathFunction, x: number, h: number = 0.0001): number {
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}

/**
 * Create derivative function
 */
export function derivativeFunction(f: MathFunction, h: number = 0.0001): MathFunction {
  return (x: number) => derivative(f, x, h);
}

// ============================================================================
// Tangent and Normal Lines
// ============================================================================

/**
 * Get tangent line at a point
 */
export function tangentLine(f: MathFunction, x0: number): TangentLine {
  const y0 = f(x0);
  const slope = derivative(f, x0);
  const yIntercept = y0 - slope * x0;

  return {
    point: { x: x0, y: y0 },
    slope,
    yIntercept,
  };
}

/**
 * Get normal line at a point
 */
export function normalLine(f: MathFunction, x0: number): NormalLine {
  const y0 = f(x0);
  const tangentSlope = derivative(f, x0);

  // Normal is perpendicular: slope = -1/tangent_slope
  const slope = tangentSlope !== 0 ? -1 / tangentSlope : Infinity;
  const yIntercept = isFinite(slope) ? y0 - slope * x0 : NaN;

  return {
    point: { x: x0, y: y0 },
    slope,
    yIntercept,
  };
}

/**
 * Evaluate a line at x
 */
export function evaluateLine(slope: number, yIntercept: number, x: number): number {
  return slope * x + yIntercept;
}

// ============================================================================
// Critical Points and Curve Analysis
// ============================================================================

/**
 * Find critical points (where f'(x) = 0 or undefined)
 */
export function findCriticalPoints(
  f: MathFunction,
  xMin: number,
  xMax: number,
  tolerance: number = 0.01
): CriticalPoint[] {
  const points: CriticalPoint[] = [];
  const step = 0.05;

  for (let x = xMin + step; x < xMax - step; x += step) {
    const dPrev = derivative(f, x - step);
    const dCurr = derivative(f, x);

    // Check for sign change in first derivative (local extrema)
    if (dPrev * dCurr < 0 || Math.abs(dCurr) < tolerance) {
      // Refine x using bisection
      let lo = x - step;
      let hi = x;
      for (let i = 0; i < 10; i++) {
        const mid = (lo + hi) / 2;
        if (derivative(f, lo) * derivative(f, mid) < 0) {
          hi = mid;
        } else {
          lo = mid;
        }
      }
      const critX = (lo + hi) / 2;
      const critY = f(critX);

      // Determine type using second derivative
      const d2 = secondDerivative(f, critX);
      let type: CriticalPoint['type'] = 'stationary';

      if (d2 < -tolerance) {
        type = 'maximum';
      } else if (d2 > tolerance) {
        type = 'minimum';
      }

      // Avoid duplicates
      if (!points.some((p) => Math.abs(p.x - critX) < 0.1)) {
        points.push({ x: roundTo(critX, 2), y: roundTo(critY, 2), type });
      }
    }
  }

  return points;
}

/**
 * Find inflection points (where f''(x) changes sign)
 */
export function findInflectionPoints(
  f: MathFunction,
  xMin: number,
  xMax: number
): Point[] {
  const points: Point[] = [];
  const step = 0.05;

  for (let x = xMin + step; x < xMax - step; x += step) {
    const d2Prev = secondDerivative(f, x - step);
    const d2Next = secondDerivative(f, x + step);

    // Check for sign change in second derivative
    if (d2Prev * d2Next < 0) {
      const y = f(x);
      if (isFinite(y)) {
        points.push({ x: roundTo(x, 2), y: roundTo(y, 2) });
      }
    }
  }

  return points;
}

// ============================================================================
// Numerical Integration
// ============================================================================

/**
 * Compute definite integral using Simpson's rule
 */
export function integrate(
  f: MathFunction,
  a: number,
  b: number,
  n: number = 100
): number {
  if (n % 2 !== 0) n++; // Simpson's rule requires even n

  const h = (b - a) / n;
  let sum = f(a) + f(b);

  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    const coeff = i % 2 === 0 ? 2 : 4;
    sum += coeff * f(x);
  }

  return (h / 3) * sum;
}

/**
 * Compute Riemann sum
 */
export function riemannSum(
  f: MathFunction,
  a: number,
  b: number,
  n: number,
  type: 'left' | 'right' | 'midpoint' = 'left'
): RiemannSum {
  const width = (b - a) / n;
  const rectangles: Rectangle[] = [];
  let sum = 0;

  for (let i = 0; i < n; i++) {
    const leftX = a + i * width;
    let sampleX: number;

    switch (type) {
      case 'left':
        sampleX = leftX;
        break;
      case 'right':
        sampleX = leftX + width;
        break;
      case 'midpoint':
        sampleX = leftX + width / 2;
        break;
    }

    const height = f(sampleX);
    rectangles.push({ x: leftX, width, height });
    sum += height * width;
  }

  return { value: sum, rectangles, type };
}

/**
 * Compute area between curve and x-axis (handles negative areas)
 */
export function areaBetweenCurveAndAxis(
  f: MathFunction,
  a: number,
  b: number
): number {
  // Use absolute value for total area
  const n = 200;
  const h = (b - a) / n;
  let sum = 0;

  for (let i = 0; i < n; i++) {
    const x = a + i * h;
    const y = f(x);
    if (isFinite(y)) {
      sum += Math.abs(y) * h;
    }
  }

  return sum;
}

/**
 * Compute volume of revolution about x-axis (disk method)
 */
export function volumeOfRevolutionX(
  f: MathFunction,
  a: number,
  b: number,
  n: number = 100
): number {
  const h = (b - a) / n;
  let sum = 0;

  for (let i = 0; i < n; i++) {
    const x = a + i * h + h / 2;
    const r = Math.abs(f(x));
    sum += Math.PI * r * r * h;
  }

  return sum;
}

// ============================================================================
// Differential Equations
// ============================================================================

/**
 * Generate slope field for dy/dx = f(x, y)
 */
export function generateSlopeField(
  dydx: (x: number, y: number) => number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  gridSize: number = 1
): SlopeArrow[] {
  const arrows: SlopeArrow[] = [];

  for (let x = xMin; x <= xMax; x += gridSize) {
    for (let y = yMin; y <= yMax; y += gridSize) {
      const slope = dydx(x, y);
      if (isFinite(slope)) {
        arrows.push({ x, y, slope });
      }
    }
  }

  return arrows;
}

/**
 * Solve first-order ODE using Euler's method
 * dy/dx = f(x, y), y(x0) = y0
 */
export function eulerMethod(
  dydx: (x: number, y: number) => number,
  x0: number,
  y0: number,
  xEnd: number,
  steps: number = 100
): Point[] {
  const points: Point[] = [{ x: x0, y: y0 }];
  const h = (xEnd - x0) / steps;

  let x = x0;
  let y = y0;

  for (let i = 0; i < steps; i++) {
    const slope = dydx(x, y);
    y = y + h * slope;
    x = x + h;

    if (isFinite(y) && Math.abs(y) < 100) {
      points.push({ x, y });
    } else {
      break;
    }
  }

  return points;
}

/**
 * Solve separable ODE analytically (for common cases)
 * Returns solution curve points
 */
export function solveSeparable(
  // For dy/dx = g(x) * h(y), provide the integrated forms
  intG: MathFunction, // ∫g(x)dx
  intHInv: MathFunction, // inverse of ∫(1/h(y))dy
  x0: number,
  y0: number,
  xMin: number,
  xMax: number
): Point[] {
  // General solution: ∫(1/h(y))dy = ∫g(x)dx + C
  // Find C using initial condition
  const C = y0 - intHInv(intG(x0));

  const points: Point[] = [];
  const step = 0.05;

  for (let x = xMin; x <= xMax; x += step) {
    const y = intHInv(intG(x) + C);
    if (isFinite(y) && Math.abs(y) < 50) {
      points.push({ x, y });
    }
  }

  return points;
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
 * Generate plot points for a function
 */
export function plotFunction(
  f: MathFunction,
  xMin: number,
  xMax: number,
  numPoints: number = 200
): Point[] {
  const points: Point[] = [];
  const step = (xMax - xMin) / numPoints;

  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * step;
    const y = f(x);
    if (isFinite(y) && Math.abs(y) < 100) {
      points.push({ x, y });
    }
  }

  return points;
}

/**
 * Convert points to SVG path
 */
export function pointsToPath(points: Point[]): string {
  if (points.length === 0) return '';

  let path = `M ${points[0].x} ${points[0].y}`;
  let prevPoint = points[0];

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    // Check for discontinuity
    if (Math.abs(point.y - prevPoint.y) > 10 || Math.abs(point.x - prevPoint.x) > 0.5) {
      path += ` M ${point.x} ${point.y}`;
    } else {
      path += ` L ${point.x} ${point.y}`;
    }
    prevPoint = point;
  }

  return path;
}
