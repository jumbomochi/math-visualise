/**
 * Discrete Random Variables and Binomial Distribution
 *
 * Includes:
 * - Probability distributions
 * - Expectation and variance
 * - Binomial distribution B(n, p)
 */

import { createFraction, formatFraction, formatFractionLatex, fractionToDecimal, Fraction } from '../utils/fractions';

export interface DiscreteDistribution {
  values: number[];
  probabilities: number[];
  probabilityFractions?: Fraction[];
}

export interface BinomialDistributionData {
  n: number; // number of trials
  p: number; // probability of success
  pFraction?: Fraction;
}

export interface BinomialExample {
  id: string;
  title: string;
  context: string;
  question: string;
  n: number;
  p: number;
  pFraction?: Fraction;
  targetValue?: number; // For P(X = k)
  targetRange?: { min?: number; max?: number }; // For P(X ≤ k) or P(X ≥ k)
}

export interface BinomialResult {
  n: number;
  p: number;
  pFraction?: Fraction;
  mean: number;
  variance: number;
  standardDeviation: number;
  probabilities: number[];
  cumulativeProbabilities: number[];
  targetProbability?: number;
  targetFraction?: Fraction;
  formulaLatex: string;
  steps: string[];
  explanation: string;
}

/**
 * Calculate binomial coefficient nCr = n! / (r! * (n-r)!)
 */
export function binomialCoefficient(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;

  // Use the more efficient formula: nCr = n! / (r! * (n-r)!)
  // But calculate it iteratively to avoid overflow
  let result = 1;
  for (let i = 1; i <= r; i++) {
    result = result * (n - i + 1) / i;
  }

  return Math.round(result);
}

/**
 * Calculate binomial probability P(X = k) for X ~ B(n, p)
 */
export function binomialProbability(n: number, p: number, k: number): number {
  if (k < 0 || k > n) return 0;

  const coefficient = binomialCoefficient(n, k);
  const probability = coefficient * Math.pow(p, k) * Math.pow(1 - p, n - k);

  return probability;
}

/**
 * Calculate cumulative binomial probability P(X ≤ k)
 */
export function binomialCumulativeProbability(n: number, p: number, k: number): number {
  let cumulative = 0;
  for (let i = 0; i <= Math.min(k, n); i++) {
    cumulative += binomialProbability(n, p, i);
  }
  return cumulative;
}

/**
 * Calculate expectation (mean) of binomial distribution
 */
export function binomialExpectation(n: number, p: number): number {
  return n * p;
}

/**
 * Calculate variance of binomial distribution
 */
export function binomialVariance(n: number, p: number): number {
  return n * p * (1 - p);
}

/**
 * Solve binomial distribution problem
 */
export function solveBinomialProblem(exampleId: string): BinomialResult {
  const example = BINOMIAL_EXAMPLES.find(ex => ex.id === exampleId);
  if (!example) {
    throw new Error(`Example ${exampleId} not found`);
  }

  const { n, p, pFraction, targetValue, targetRange } = example;

  // Calculate mean and variance
  const mean = binomialExpectation(n, p);
  const variance = binomialVariance(n, p);
  const standardDeviation = Math.sqrt(variance);

  // Calculate all probabilities P(X = k) for k = 0, 1, ..., n
  const probabilities: number[] = [];
  for (let k = 0; k <= n; k++) {
    probabilities.push(binomialProbability(n, p, k));
  }

  // Calculate cumulative probabilities
  const cumulativeProbabilities: number[] = [];
  for (let k = 0; k <= n; k++) {
    cumulativeProbabilities.push(binomialCumulativeProbability(n, p, k));
  }

  const steps: string[] = [];
  let targetProbability: number | undefined;
  let targetFraction: Fraction | undefined;
  let formulaLatex = '';

  // Calculate target probability based on question type
  if (targetValue !== undefined) {
    // P(X = k)
    const k = targetValue;
    targetProbability = binomialProbability(n, p, k);

    steps.push(`Given: X ~ B(${n}, ${pFraction ? formatFraction(pFraction) : p})`);
    steps.push(`Find: P(X = ${k})`);
    steps.push('');
    steps.push(`Formula: P(X = k) = ${binomialCoefficient(n, k)}C_k × p^k × (1-p)^{n-k}`);
    steps.push(`P(X = ${k}) = ${binomialCoefficient(n, k)}C_${k} × ${pFraction ? formatFraction(pFraction) : p}^${k} × ${pFraction ? formatFraction(createFraction(pFraction.denominator - pFraction.numerator, pFraction.denominator)) : (1-p)}^${n-k}`);
    steps.push(`P(X = ${k}) = ${binomialCoefficient(n, k)} × ${Math.pow(p, k).toFixed(6)} × ${Math.pow(1-p, n-k).toFixed(6)}`);
    steps.push(`P(X = ${k}) = ${targetProbability.toFixed(6)}`);

    formulaLatex = `P(X = ${k}) = {${n} \\choose ${k}} \\times ${pFraction ? formatFractionLatex(pFraction) : p}^{${k}} \\times ${pFraction ? formatFractionLatex(createFraction(pFraction.denominator - pFraction.numerator, pFraction.denominator)) : (1-p)}^{${n-k}} = ${targetProbability.toFixed(4)}`;
  } else if (targetRange) {
    const { min, max } = targetRange;

    if (min !== undefined && max === undefined) {
      // P(X ≥ min)
      targetProbability = 1 - binomialCumulativeProbability(n, p, min - 1);

      steps.push(`Given: X ~ B(${n}, ${pFraction ? formatFraction(pFraction) : p})`);
      steps.push(`Find: P(X ≥ ${min})`);
      steps.push('');
      steps.push(`P(X ≥ ${min}) = 1 - P(X ≤ ${min - 1})`);
      steps.push(`P(X ≤ ${min - 1}) = ${binomialCumulativeProbability(n, p, min - 1).toFixed(6)}`);
      steps.push(`P(X ≥ ${min}) = 1 - ${binomialCumulativeProbability(n, p, min - 1).toFixed(6)} = ${targetProbability.toFixed(6)}`);

      formulaLatex = `P(X \\geq ${min}) = 1 - P(X \\leq ${min - 1}) = ${targetProbability.toFixed(4)}`;
    } else if (max !== undefined && min === undefined) {
      // P(X ≤ max)
      targetProbability = binomialCumulativeProbability(n, p, max);

      steps.push(`Given: X ~ B(${n}, ${pFraction ? formatFraction(pFraction) : p})`);
      steps.push(`Find: P(X ≤ ${max})`);
      steps.push('');
      steps.push(`P(X ≤ ${max}) = ∑[k=0 to ${max}] P(X = k)`);
      steps.push(`P(X ≤ ${max}) = ${targetProbability.toFixed(6)}`);

      formulaLatex = `P(X \\leq ${max}) = ${targetProbability.toFixed(4)}`;
    } else if (min !== undefined && max !== undefined) {
      // P(min ≤ X ≤ max)
      targetProbability = binomialCumulativeProbability(n, p, max) - binomialCumulativeProbability(n, p, min - 1);

      steps.push(`Given: X ~ B(${n}, ${pFraction ? formatFraction(pFraction) : p})`);
      steps.push(`Find: P(${min} ≤ X ≤ ${max})`);
      steps.push('');
      steps.push(`P(${min} ≤ X ≤ ${max}) = P(X ≤ ${max}) - P(X ≤ ${min - 1})`);
      steps.push(`= ${binomialCumulativeProbability(n, p, max).toFixed(6)} - ${binomialCumulativeProbability(n, p, min - 1).toFixed(6)}`);
      steps.push(`= ${targetProbability.toFixed(6)}`);

      formulaLatex = `P(${min} \\leq X \\leq ${max}) = ${targetProbability.toFixed(4)}`;
    }
  }

  const explanation = `X follows a binomial distribution with n = ${n} trials and success probability p = ${pFraction ? formatFraction(pFraction) : p}. Mean = ${mean.toFixed(2)}, Variance = ${variance.toFixed(2)}, SD = ${standardDeviation.toFixed(2)}.`;

  return {
    n,
    p,
    pFraction,
    mean,
    variance,
    standardDeviation,
    probabilities,
    cumulativeProbabilities,
    targetProbability,
    targetFraction,
    formulaLatex,
    steps,
    explanation,
  };
}

/**
 * Binomial Distribution Examples
 */
export const BINOMIAL_EXAMPLES: BinomialExample[] = [
  {
    id: 'coin-flips',
    title: 'Coin Flips',
    context: 'A fair coin is flipped 10 times.',
    question: 'Find the probability of getting exactly 6 heads.',
    n: 10,
    p: 0.5,
    pFraction: createFraction(1, 2),
    targetValue: 6,
  },
  {
    id: 'defective-items',
    title: 'Defective Items',
    context: 'A factory produces items with a 5% defect rate. A sample of 20 items is randomly selected.',
    question: 'Find the probability that at most 2 items are defective.',
    n: 20,
    p: 0.05,
    pFraction: createFraction(1, 20),
    targetRange: { max: 2 },
  },
  {
    id: 'multiple-choice',
    title: 'Multiple Choice Test',
    context: 'A student guesses randomly on a 12-question multiple choice test. Each question has 4 options.',
    question: 'Find the probability of getting at least 8 questions correct.',
    n: 12,
    p: 0.25,
    pFraction: createFraction(1, 4),
    targetRange: { min: 8 },
  },
  {
    id: 'free-throws',
    title: 'Basketball Free Throws',
    context: 'A basketball player has a 70% free throw success rate. She attempts 15 free throws.',
    question: 'Find the probability she makes between 10 and 12 free throws (inclusive).',
    n: 15,
    p: 0.7,
    pFraction: createFraction(7, 10),
    targetRange: { min: 10, max: 12 },
  },
  {
    id: 'dice-sixes',
    title: 'Rolling Sixes',
    context: 'A fair six-sided die is rolled 8 times.',
    question: 'Find the probability of rolling exactly three sixes.',
    n: 8,
    p: 1/6,
    pFraction: createFraction(1, 6),
    targetValue: 3,
  },
];
