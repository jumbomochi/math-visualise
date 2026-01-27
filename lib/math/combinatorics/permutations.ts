/**
 * Permutation Functions
 *
 * Pure functions for permutation calculations
 */

import { factorial } from './slotMethod';

/**
 * Calculate P(n, r) = n!/(n-r)!
 * Number of ways to arrange r items from n items
 *
 * @param n - Total number of items
 * @param r - Number of items to arrange
 * @returns Number of permutations
 */
export function nPr(n: number, r: number): number {
  if (r > n || r < 0 || n < 0) {
    return 0;
  }

  if (r === 0) {
    return 1;
  }

  return factorial(n) / factorial(n - r);
}

/**
 * Calculate permutations with repetition
 * When items can be reused: n^r
 *
 * @param n - Total number of items
 * @param r - Number of positions
 * @returns Number of arrangements with repetition
 */
export function permutationsWithRepetition(n: number, r: number): number {
  return Math.pow(n, r);
}

/**
 * Calculate circular permutations
 * Arrangements in a circle: (n-1)!
 *
 * @param n - Number of items
 * @returns Number of circular arrangements
 */
export function circularPermutations(n: number): number {
  if (n <= 0) {
    return 0;
  }
  return factorial(n - 1);
}

/**
 * Calculate permutations with identical items
 * n! / (n1! × n2! × ... × nk!)
 *
 * @param total - Total number of items
 * @param groups - Array of counts for each identical group
 * @returns Number of distinct permutations
 */
export function permutationsWithIdentical(total: number, groups: number[]): number {
  let denominator = 1;
  for (const count of groups) {
    denominator *= factorial(count);
  }
  return factorial(total) / denominator;
}
