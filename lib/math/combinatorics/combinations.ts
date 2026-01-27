/**
 * Combination Functions
 *
 * Pure functions for combination calculations
 */

/**
 * Calculate C(n, r) = n! / (r! × (n-r)!)
 * Number of ways to choose r items from n items (order doesn't matter)
 *
 * @param n - Total number of items
 * @param r - Number of items to choose
 * @returns Number of combinations
 */
export function nCr(n: number, r: number): number {
  if (r > n || r < 0 || n < 0) {
    return 0;
  }

  if (r === 0 || r === n) {
    return 1;
  }

  // Optimize by using smaller factorial
  // C(n,r) = C(n, n-r)
  if (r > n - r) {
    r = n - r;
  }

  let result = 1;
  for (let i = 0; i < r; i++) {
    result *= (n - i);
    result /= (i + 1);
  }

  return Math.round(result);
}

/**
 * Calculate combinations with repetition
 * C(n + r - 1, r)
 *
 * @param n - Number of types of items
 * @param r - Number of items to choose (with repetition allowed)
 * @returns Number of combinations with repetition
 */
export function combinationsWithRepetition(n: number, r: number): number {
  return nCr(n + r - 1, r);
}

/**
 * Pascal's Triangle value at row n, position r
 * Same as C(n, r)
 *
 * @param n - Row number
 * @param r - Position in row
 * @returns Pascal's triangle value
 */
export function pascalTriangle(n: number, r: number): number {
  return nCr(n, r);
}

/**
 * Binomial coefficient (same as nCr, included for clarity)
 *
 * @param n - Top number
 * @param k - Bottom number
 * @returns Binomial coefficient
 */
export function binomialCoefficient(n: number, k: number): number {
  return nCr(n, k);
}
