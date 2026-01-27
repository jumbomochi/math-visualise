/**
 * Normal Distribution
 *
 * Includes:
 * - Standard normal distribution
 * - Z-scores
 * - Finding probabilities
 * - Inverse normal calculations
 */

export interface NormalDistributionData {
  mean: number; // μ
  variance: number; // σ²
  standardDeviation: number; // σ
}

export interface NormalExample {
  id: string;
  title: string;
  context: string;
  question: string;
  mean: number;
  standardDeviation: number;
  type: 'find-probability' | 'find-value' | 'range';
  targetValue?: number; // For P(X < value)
  targetRange?: { lower?: number; upper?: number };
  targetProbability?: number; // For inverse normal
}

export interface NormalResult {
  mean: number;
  standardDeviation: number;
  variance: number;
  zScore?: number;
  probability?: number;
  value?: number; // For inverse normal
  formulaLatex: string;
  steps: string[];
  explanation: string;
}

/**
 * Calculate Z-score
 */
export function calculateZScore(x: number, mean: number, sd: number): number {
  return (x - mean) / sd;
}

/**
 * Standard normal cumulative distribution function (approximation)
 * Using error function approximation
 */
export function standardNormalCDF(z: number): number {
  // Using the error function approximation for Φ(z)
  // This is Abramowitz and Stegun approximation (accurate to about 7 decimal places)

  const sign = z < 0 ? -1 : 1;
  z = Math.abs(z);

  const t = 1 / (1 + 0.2316419 * z);
  const d = 0.3989423 * Math.exp(-z * z / 2);

  const probability =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

  return sign > 0 ? 1 - probability : probability;
}

/**
 * Inverse standard normal (find z given probability)
 * Using Beasley-Springer-Moro algorithm
 */
export function inverseStandardNormal(p: number): number {
  if (p <= 0 || p >= 1) {
    throw new Error('Probability must be between 0 and 1');
  }

  // Coefficients for rational approximation
  const a = [
    -3.969683028665376e1,
    2.209460984245205e2,
    -2.759285104469687e2,
    1.383577518672690e2,
    -3.066479806614716e1,
    2.506628277459239,
  ];

  const b = [
    -5.447609879822406e1,
    1.615858368580409e2,
    -1.556989798598866e2,
    6.680131188771972e1,
    -1.328068155288572e1,
  ];

  const c = [
    -7.784894002430293e-3,
    -3.223964580411365e-1,
    -2.400758277161838,
    -2.549732539343734,
    4.374664141464968,
    2.938163982698783,
  ];

  const d = [
    7.784695709041462e-3,
    3.224671290700398e-1,
    2.445134137142996,
    3.754408661907416,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q, r, x;

  if (p < pLow) {
    // Lower region
    q = Math.sqrt(-2 * Math.log(p));
    x =
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= pHigh) {
    // Central region
    q = p - 0.5;
    r = q * q;
    x =
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) *
        q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    // Upper region
    q = Math.sqrt(-2 * Math.log(1 - p));
    x =
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }

  return x;
}

/**
 * Calculate normal probability P(X < x)
 */
export function normalCDF(
  x: number,
  mean: number,
  standardDeviation: number
): number {
  const z = calculateZScore(x, mean, standardDeviation);
  return standardNormalCDF(z);
}

/**
 * Inverse normal - find x given P(X < x) = p
 */
export function inverseNormal(
  p: number,
  mean: number,
  standardDeviation: number
): number {
  const z = inverseStandardNormal(p);
  return mean + z * standardDeviation;
}

/**
 * Solve normal distribution problem
 */
export function solveNormalProblem(exampleId: string): NormalResult {
  const example = NORMAL_EXAMPLES.find(ex => ex.id === exampleId);
  if (!example) {
    throw new Error(`Example ${exampleId} not found`);
  }

  const { mean, standardDeviation, type, targetValue, targetRange, targetProbability } = example;
  const variance = standardDeviation ** 2;

  const steps: string[] = [];
  let zScore: number | undefined;
  let probability: number | undefined;
  let value: number | undefined;
  let formulaLatex = '';

  steps.push(`Given: X ~ N(${mean}, ${variance})`);
  steps.push(`Mean μ = ${mean}, Standard Deviation σ = ${standardDeviation}`);
  steps.push('');

  if (type === 'find-probability' && targetValue !== undefined) {
    // Find P(X < targetValue)
    zScore = calculateZScore(targetValue, mean, standardDeviation);
    probability = normalCDF(targetValue, mean, standardDeviation);

    steps.push(`Find: P(X < ${targetValue})`);
    steps.push('');
    steps.push(`Step 1: Calculate Z-score`);
    steps.push(`Z = (X - μ) / σ = (${targetValue} - ${mean}) / ${standardDeviation}`);
    steps.push(`Z = ${zScore.toFixed(4)}`);
    steps.push('');
    steps.push(`Step 2: Find P(Z < ${zScore.toFixed(4)})`);
    steps.push(`Using standard normal table or calculator:`);
    steps.push(`P(Z < ${zScore.toFixed(4)}) = ${probability.toFixed(4)}`);

    formulaLatex = `P(X < ${targetValue}) = P\\left(Z < ${zScore.toFixed(2)}\\right) = ${probability.toFixed(4)}`;
  } else if (type === 'find-value' && targetProbability !== undefined) {
    // Inverse normal: Find x such that P(X < x) = targetProbability
    zScore = inverseStandardNormal(targetProbability);
    value = inverseNormal(targetProbability, mean, standardDeviation);

    steps.push(`Find: Value of x such that P(X < x) = ${targetProbability}`);
    steps.push('');
    steps.push(`Step 1: Find Z-score from standard normal table`);
    steps.push(`P(Z < z) = ${targetProbability}`);
    steps.push(`z = ${zScore.toFixed(4)}`);
    steps.push('');
    steps.push(`Step 2: Convert to X using X = μ + zσ`);
    steps.push(`X = ${mean} + (${zScore.toFixed(4)})(${standardDeviation})`);
    steps.push(`X = ${value.toFixed(4)}`);

    formulaLatex = `x = \\mu + z\\sigma = ${mean} + ${zScore.toFixed(2)} \\times ${standardDeviation} = ${value.toFixed(2)}`;
  } else if (type === 'range' && targetRange) {
    // Find P(lower < X < upper)
    const { lower, upper } = targetRange;

    if (lower !== undefined && upper !== undefined) {
      const zLower = calculateZScore(lower, mean, standardDeviation);
      const zUpper = calculateZScore(upper, mean, standardDeviation);
      const pLower = normalCDF(lower, mean, standardDeviation);
      const pUpper = normalCDF(upper, mean, standardDeviation);
      probability = pUpper - pLower;

      steps.push(`Find: P(${lower} < X < ${upper})`);
      steps.push('');
      steps.push(`Step 1: Calculate Z-scores`);
      steps.push(`Z₁ = (${lower} - ${mean}) / ${standardDeviation} = ${zLower.toFixed(4)}`);
      steps.push(`Z₂ = (${upper} - ${mean}) / ${standardDeviation} = ${zUpper.toFixed(4)}`);
      steps.push('');
      steps.push(`Step 2: Find probabilities`);
      steps.push(`P(Z < ${zLower.toFixed(4)}) = ${pLower.toFixed(4)}`);
      steps.push(`P(Z < ${zUpper.toFixed(4)}) = ${pUpper.toFixed(4)}`);
      steps.push('');
      steps.push(`Step 3: Calculate difference`);
      steps.push(`P(${lower} < X < ${upper}) = P(Z < ${zUpper.toFixed(4)}) - P(Z < ${zLower.toFixed(4)})`);
      steps.push(`= ${pUpper.toFixed(4)} - ${pLower.toFixed(4)} = ${probability.toFixed(4)}`);

      formulaLatex = `P(${lower} < X < ${upper}) = ${probability.toFixed(4)}`;
    } else if (upper !== undefined) {
      // P(X < upper)
      const zUpper = calculateZScore(upper, mean, standardDeviation);
      probability = normalCDF(upper, mean, standardDeviation);

      steps.push(`Find: P(X < ${upper})`);
      steps.push(`Z = ${zUpper.toFixed(4)}`);
      steps.push(`P(X < ${upper}) = ${probability.toFixed(4)}`);

      formulaLatex = `P(X < ${upper}) = ${probability.toFixed(4)}`;
    } else if (lower !== undefined) {
      // P(X > lower)
      const zLower = calculateZScore(lower, mean, standardDeviation);
      probability = 1 - normalCDF(lower, mean, standardDeviation);

      steps.push(`Find: P(X > ${lower})`);
      steps.push(`Z = ${zLower.toFixed(4)}`);
      steps.push(`P(X > ${lower}) = 1 - P(X < ${lower}) = ${probability.toFixed(4)}`);

      formulaLatex = `P(X > ${lower}) = ${probability.toFixed(4)}`;
    }
  }

  const explanation = `X follows a normal distribution with mean ${mean} and standard deviation ${standardDeviation}.`;

  return {
    mean,
    standardDeviation,
    variance,
    zScore,
    probability,
    value,
    formulaLatex,
    steps,
    explanation,
  };
}

/**
 * Normal Distribution Examples
 */
export const NORMAL_EXAMPLES: NormalExample[] = [
  {
    id: 'heights',
    title: 'Heights of Students',
    context: 'The heights of students in a school follow a normal distribution with mean 165 cm and standard deviation 8 cm.',
    question: 'Find the probability that a randomly selected student has height less than 170 cm.',
    mean: 165,
    standardDeviation: 8,
    type: 'find-probability',
    targetValue: 170,
  },
  {
    id: 'exam-scores',
    title: 'Exam Scores',
    context: 'Exam scores are normally distributed with mean 70 and standard deviation 12.',
    question: 'Find the score below which 85% of students fall.',
    mean: 70,
    standardDeviation: 12,
    type: 'find-value',
    targetProbability: 0.85,
  },
  {
    id: 'reaction-time',
    title: 'Reaction Time',
    context: 'Reaction times follow a normal distribution with mean 250 ms and standard deviation 30 ms.',
    question: 'Find the probability that a reaction time is between 220 ms and 280 ms.',
    mean: 250,
    standardDeviation: 30,
    type: 'range',
    targetRange: { lower: 220, upper: 280 },
  },
  {
    id: 'iq-scores',
    title: 'IQ Scores',
    context: 'IQ scores are normally distributed with mean 100 and standard deviation 15.',
    question: 'Find the probability that a randomly selected person has an IQ greater than 130.',
    mean: 100,
    standardDeviation: 15,
    type: 'range',
    targetRange: { lower: 130 },
  },
  {
    id: 'battery-life',
    title: 'Battery Life',
    context: 'Battery life follows a normal distribution with mean 500 hours and standard deviation 50 hours.',
    question: 'Find the 10th percentile of battery life.',
    mean: 500,
    standardDeviation: 50,
    type: 'find-value',
    targetProbability: 0.10,
  },
];
