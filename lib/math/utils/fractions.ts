/**
 * Fraction Utilities
 *
 * Helper functions for working with fractions in probability calculations
 */

export interface Fraction {
  numerator: number;
  denominator: number;
}

/**
 * Greatest Common Divisor using Euclidean algorithm
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.floor(a));
  b = Math.abs(Math.floor(b));

  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a;
}

/**
 * Simplify a fraction to lowest terms
 */
export function simplifyFraction(numerator: number, denominator: number): Fraction {
  if (denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }

  const divisor = gcd(numerator, denominator);

  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

/**
 * Convert decimal to fraction with tolerance
 */
export function decimalToFraction(decimal: number, maxDenominator: number = 10000): Fraction {
  if (decimal === 0) return { numerator: 0, denominator: 1 };
  if (decimal === 1) return { numerator: 1, denominator: 1 };

  const sign = decimal < 0 ? -1 : 1;
  decimal = Math.abs(decimal);

  let bestNumerator = 1;
  let bestDenominator = 1;
  let bestError = Math.abs(decimal - 1);

  for (let denominator = 1; denominator <= maxDenominator; denominator++) {
    const numerator = Math.round(decimal * denominator);
    const error = Math.abs(decimal - numerator / denominator);

    if (error < bestError) {
      bestNumerator = numerator;
      bestDenominator = denominator;
      bestError = error;

      if (error < 0.0000001) break; // Close enough
    }
  }

  const simplified = simplifyFraction(bestNumerator * sign, bestDenominator);
  return simplified;
}

/**
 * Add two fractions
 */
export function addFractions(f1: Fraction, f2: Fraction): Fraction {
  const numerator = f1.numerator * f2.denominator + f2.numerator * f1.denominator;
  const denominator = f1.denominator * f2.denominator;
  return simplifyFraction(numerator, denominator);
}

/**
 * Subtract two fractions
 */
export function subtractFractions(f1: Fraction, f2: Fraction): Fraction {
  const numerator = f1.numerator * f2.denominator - f2.numerator * f1.denominator;
  const denominator = f1.denominator * f2.denominator;
  return simplifyFraction(numerator, denominator);
}

/**
 * Multiply two fractions
 */
export function multiplyFractions(f1: Fraction, f2: Fraction): Fraction {
  const numerator = f1.numerator * f2.numerator;
  const denominator = f1.denominator * f2.denominator;
  return simplifyFraction(numerator, denominator);
}

/**
 * Divide two fractions
 */
export function divideFractions(f1: Fraction, f2: Fraction): Fraction {
  if (f2.numerator === 0) {
    throw new Error('Cannot divide by zero');
  }
  const numerator = f1.numerator * f2.denominator;
  const denominator = f1.denominator * f2.numerator;
  return simplifyFraction(numerator, denominator);
}

/**
 * Convert fraction to decimal
 */
export function fractionToDecimal(fraction: Fraction): number {
  return fraction.numerator / fraction.denominator;
}

/**
 * Format fraction as string
 */
export function formatFraction(fraction: Fraction): string {
  if (fraction.denominator === 1) {
    return fraction.numerator.toString();
  }
  return `${fraction.numerator}/${fraction.denominator}`;
}

/**
 * Format fraction as LaTeX
 */
export function formatFractionLatex(fraction: Fraction): string {
  if (fraction.denominator === 1) {
    return fraction.numerator.toString();
  }
  return `\\frac{${fraction.numerator}}{${fraction.denominator}}`;
}

/**
 * Format probability with both fraction and decimal
 */
export function formatProbability(value: number, maxDenominator: number = 10000): string {
  const fraction = decimalToFraction(value, maxDenominator);
  const decimal = value.toFixed(4);

  // If fraction is exact (error < 0.0001), show both
  if (Math.abs(fractionToDecimal(fraction) - value) < 0.0001) {
    return `${formatFraction(fraction)} = ${decimal}`;
  }

  // Otherwise just show decimal
  return decimal;
}

/**
 * Format probability as LaTeX with both fraction and decimal
 */
export function formatProbabilityLatex(value: number, maxDenominator: number = 10000): string {
  const fraction = decimalToFraction(value, maxDenominator);
  const decimal = value.toFixed(4);

  // If fraction is exact (error < 0.0001), show both
  if (Math.abs(fractionToDecimal(fraction) - value) < 0.0001) {
    return `${formatFractionLatex(fraction)} = ${decimal}`;
  }

  // Otherwise just show decimal
  return decimal;
}

/**
 * Create a fraction from numerator and denominator
 */
export function createFraction(numerator: number, denominator: number): Fraction {
  return simplifyFraction(numerator, denominator);
}
