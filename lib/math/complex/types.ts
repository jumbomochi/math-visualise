/**
 * Complex Number Types
 *
 * Type definitions for complex number operations and visualizations.
 */

/**
 * Complex number in Cartesian form (a + bi)
 */
export interface Complex {
  re: number; // Real part
  im: number; // Imaginary part
}

/**
 * Complex number in polar form (r * e^(iθ))
 */
export interface PolarComplex {
  r: number; // Modulus (magnitude)
  theta: number; // Argument (angle in radians)
}

/**
 * Result of a complex arithmetic operation with formula
 */
export interface ComplexOperationResult {
  result: Complex;
  formulaLatex: string;
}

/**
 * Root of unity result
 */
export interface RootOfUnity {
  k: number; // Which root (0 to n-1)
  value: Complex;
  polar: PolarComplex;
}
