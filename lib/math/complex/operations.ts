/**
 * Complex Number Operations
 *
 * Core mathematical operations for complex numbers.
 * Following Singapore H2 Math syllabus conventions.
 */

import { Complex, PolarComplex, ComplexOperationResult, RootOfUnity } from './types';

// ============================================================================
// Basic Arithmetic
// ============================================================================

/**
 * Add two complex numbers
 */
export function add(a: Complex, b: Complex): ComplexOperationResult {
  const result = {
    re: a.re + b.re,
    im: a.im + b.im,
  };

  const formulaLatex = `(${formatComplex(a)}) + (${formatComplex(b)}) = ${formatComplex(result)}`;

  return { result, formulaLatex };
}

/**
 * Subtract two complex numbers
 */
export function subtract(a: Complex, b: Complex): ComplexOperationResult {
  const result = {
    re: a.re - b.re,
    im: a.im - b.im,
  };

  const formulaLatex = `(${formatComplex(a)}) - (${formatComplex(b)}) = ${formatComplex(result)}`;

  return { result, formulaLatex };
}

/**
 * Multiply two complex numbers
 * (a + bi)(c + di) = (ac - bd) + (ad + bc)i
 */
export function multiply(a: Complex, b: Complex): ComplexOperationResult {
  const result = {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };

  const formulaLatex = `(${formatComplex(a)})(${formatComplex(b)}) = ${formatComplex(result)}`;

  return { result, formulaLatex };
}

/**
 * Divide two complex numbers
 * (a + bi)/(c + di) = ((ac + bd) + (bc - ad)i) / (c² + d²)
 */
export function divide(a: Complex, b: Complex): ComplexOperationResult {
  const denominator = b.re * b.re + b.im * b.im;

  if (denominator === 0) {
    return {
      result: { re: NaN, im: NaN },
      formulaLatex: '\\text{Division by zero}',
    };
  }

  const result = {
    re: (a.re * b.re + a.im * b.im) / denominator,
    im: (a.im * b.re - a.re * b.im) / denominator,
  };

  const formulaLatex = `\\frac{${formatComplex(a)}}{${formatComplex(b)}} = ${formatComplex(result)}`;

  return { result, formulaLatex };
}

/**
 * Complex conjugate
 */
export function conjugate(z: Complex): Complex {
  return { re: z.re, im: -z.im };
}

// ============================================================================
// Modulus and Argument
// ============================================================================

/**
 * Calculate modulus (magnitude) of complex number
 * |z| = √(a² + b²)
 */
export function modulus(z: Complex): number {
  return Math.sqrt(z.re * z.re + z.im * z.im);
}

/**
 * Calculate argument (angle) of complex number
 * arg(z) = atan2(b, a) in radians, range (-π, π]
 */
export function argument(z: Complex): number {
  return Math.atan2(z.im, z.re);
}

/**
 * Convert Cartesian to polar form
 */
export function toPolar(z: Complex): PolarComplex {
  return {
    r: modulus(z),
    theta: argument(z),
  };
}

/**
 * Convert polar to Cartesian form
 */
export function toCartesian(p: PolarComplex): Complex {
  return {
    re: p.r * Math.cos(p.theta),
    im: p.r * Math.sin(p.theta),
  };
}

// ============================================================================
// Roots of Unity
// ============================================================================

/**
 * Calculate nth roots of a complex number
 * z^(1/n) = r^(1/n) * e^(i(θ + 2πk)/n) for k = 0, 1, ..., n-1
 */
export function nthRoots(z: Complex, n: number): RootOfUnity[] {
  if (n < 1 || !Number.isInteger(n)) {
    return [];
  }

  const polar = toPolar(z);
  const rootR = Math.pow(polar.r, 1 / n);
  const roots: RootOfUnity[] = [];

  for (let k = 0; k < n; k++) {
    const rootTheta = (polar.theta + 2 * Math.PI * k) / n;
    const value = toCartesian({ r: rootR, theta: rootTheta });

    roots.push({
      k,
      value,
      polar: { r: rootR, theta: rootTheta },
    });
  }

  return roots;
}

/**
 * Calculate nth roots of unity (roots of 1)
 * ω_k = e^(2πik/n) for k = 0, 1, ..., n-1
 */
export function rootsOfUnity(n: number): RootOfUnity[] {
  return nthRoots({ re: 1, im: 0 }, n);
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
 * Convert radians to degrees
 */
export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Convert degrees to radians
 */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Format complex number for display
 */
export function formatComplex(z: Complex, decimals: number = 2): string {
  const re = roundTo(z.re, decimals);
  const im = roundTo(z.im, decimals);

  if (im === 0) {
    return `${re}`;
  }

  if (re === 0) {
    if (im === 1) return 'i';
    if (im === -1) return '-i';
    return `${im}i`;
  }

  const imAbs = Math.abs(im);
  const imSign = im > 0 ? '+' : '-';
  const imPart = imAbs === 1 ? 'i' : `${imAbs}i`;

  return `${re} ${imSign} ${imPart}`;
}

/**
 * Format angle for display (in terms of π where appropriate)
 */
export function formatAngle(theta: number): string {
  const normalized = normalizeAngle(theta);
  const piMultiple = normalized / Math.PI;

  // Check for common fractions of π
  const fractions = [
    { num: 0, denom: 1, value: 0 },
    { num: 1, denom: 6, value: Math.PI / 6 },
    { num: 1, denom: 4, value: Math.PI / 4 },
    { num: 1, denom: 3, value: Math.PI / 3 },
    { num: 1, denom: 2, value: Math.PI / 2 },
    { num: 2, denom: 3, value: (2 * Math.PI) / 3 },
    { num: 3, denom: 4, value: (3 * Math.PI) / 4 },
    { num: 5, denom: 6, value: (5 * Math.PI) / 6 },
    { num: 1, denom: 1, value: Math.PI },
    { num: -5, denom: 6, value: (-5 * Math.PI) / 6 },
    { num: -3, denom: 4, value: (-3 * Math.PI) / 4 },
    { num: -2, denom: 3, value: (-2 * Math.PI) / 3 },
    { num: -1, denom: 2, value: -Math.PI / 2 },
    { num: -1, denom: 3, value: -Math.PI / 3 },
    { num: -1, denom: 4, value: -Math.PI / 4 },
    { num: -1, denom: 6, value: -Math.PI / 6 },
  ];

  for (const frac of fractions) {
    if (Math.abs(normalized - frac.value) < 0.001) {
      if (frac.num === 0) return '0';
      if (frac.num === 1 && frac.denom === 1) return '\\pi';
      if (frac.num === -1 && frac.denom === 1) return '-\\pi';
      if (frac.denom === 1) return `${frac.num}\\pi`;
      if (frac.num === 1) return `\\frac{\\pi}{${frac.denom}}`;
      if (frac.num === -1) return `-\\frac{\\pi}{${frac.denom}}`;
      return `\\frac{${frac.num}\\pi}{${frac.denom}}`;
    }
  }

  // Fallback to decimal
  return `${roundTo(piMultiple, 2)}\\pi`;
}

/**
 * Normalize angle to (-π, π]
 */
export function normalizeAngle(theta: number): number {
  let result = theta % (2 * Math.PI);
  if (result > Math.PI) result -= 2 * Math.PI;
  if (result <= -Math.PI) result += 2 * Math.PI;
  return result;
}
