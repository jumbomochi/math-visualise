/**
 * Sampling and Central Limit Theorem
 *
 * Includes:
 * - Sample mean distribution
 * - Central Limit Theorem
 * - Unbiased estimates
 */

export interface SamplingExample {
  id: string;
  title: string;
  context: string;
  question: string;
  populationMean: number;
  populationSD: number;
  sampleSize: number;
  type: 'sample-mean-prob' | 'sample-mean-value' | 'unbiased-estimate';
  targetValue?: number;
  targetProbability?: number;
  sampleData?: number[]; // For unbiased estimate problems
}

export interface SamplingResult {
  populationMean: number;
  populationSD: number;
  sampleSize: number;
  sampleMeanExpectation: number;
  sampleMeanVariance: number;
  sampleMeanSD: number;
  zScore?: number;
  probability?: number;
  value?: number;
  unbiasedMean?: number;
  unbiasedVariance?: number;
  formulaLatex: string;
  steps: string[];
  explanation: string;
}

/**
 * Calculate sample mean distribution parameters
 */
export function sampleMeanDistribution(
  populationMean: number,
  populationVariance: number,
  sampleSize: number
) {
  return {
    mean: populationMean,
    variance: populationVariance / sampleSize,
    standardDeviation: Math.sqrt(populationVariance / sampleSize),
  };
}

/**
 * Calculate unbiased estimate of population mean
 */
export function unbiasedMeanEstimate(sample: number[]): number {
  return sample.reduce((sum, x) => sum + x, 0) / sample.length;
}

/**
 * Calculate unbiased estimate of population variance
 */
export function unbiasedVarianceEstimate(sample: number[]): number {
  const n = sample.length;
  const mean = unbiasedMeanEstimate(sample);
  const sumSquaredDeviations = sample.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0);
  return sumSquaredDeviations / (n - 1); // Note: divide by n-1 for unbiased estimate
}

/**
 * Calculate Z-score for sample mean
 */
export function sampleMeanZScore(
  sampleMean: number,
  populationMean: number,
  populationSD: number,
  sampleSize: number
): number {
  const sampleMeanSD = populationSD / Math.sqrt(sampleSize);
  return (sampleMean - populationMean) / sampleMeanSD;
}

/**
 * Standard normal CDF (reuse from normalDistribution)
 */
function standardNormalCDF(z: number): number {
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
 * Inverse standard normal
 */
function inverseStandardNormal(p: number): number {
  if (p <= 0 || p >= 1) {
    throw new Error('Probability must be between 0 and 1');
  }

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
    q = Math.sqrt(-2 * Math.log(p));
    x =
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    x =
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) *
        q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    x =
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }

  return x;
}

/**
 * Solve sampling problem
 */
export function solveSamplingProblem(exampleId: string): SamplingResult {
  const example = SAMPLING_EXAMPLES.find(ex => ex.id === exampleId);
  if (!example) {
    throw new Error(`Example ${exampleId} not found`);
  }

  const { populationMean, populationSD, sampleSize, type, targetValue, targetProbability, sampleData } = example;

  const populationVariance = populationSD ** 2;
  const sampleMeanDist = sampleMeanDistribution(populationMean, populationVariance, sampleSize);

  const steps: string[] = [];
  let zScore: number | undefined;
  let probability: number | undefined;
  let value: number | undefined;
  let unbiasedMean: number | undefined;
  let unbiasedVariance: number | undefined;
  let formulaLatex = '';

  steps.push(`Given: Population μ = ${populationMean}, σ = ${populationSD}`);
  steps.push(`Sample size n = ${sampleSize}`);
  steps.push('');

  if (type === 'sample-mean-prob' && targetValue !== undefined) {
    // Find P(X̄ < targetValue)
    steps.push(`Find: P(X̄ < ${targetValue})`);
    steps.push('');
    steps.push(`Step 1: Sample mean distribution`);
    steps.push(`By Central Limit Theorem (n ≥ 30), X̄ ~ N(μ, σ²/n)`);
    steps.push(`E(X̄) = μ = ${populationMean}`);
    steps.push(`Var(X̄) = σ²/n = ${populationVariance}/${sampleSize} = ${sampleMeanDist.variance.toFixed(4)}`);
    steps.push(`SD(X̄) = σ/√n = ${populationSD}/√${sampleSize} = ${sampleMeanDist.standardDeviation.toFixed(4)}`);
    steps.push('');
    steps.push(`Step 2: Calculate Z-score`);
    zScore = sampleMeanZScore(targetValue, populationMean, populationSD, sampleSize);
    steps.push(`Z = (X̄ - μ)/(σ/√n) = (${targetValue} - ${populationMean})/${sampleMeanDist.standardDeviation.toFixed(4)}`);
    steps.push(`Z = ${zScore.toFixed(4)}`);
    steps.push('');
    steps.push(`Step 3: Find probability`);
    probability = standardNormalCDF(zScore);
    steps.push(`P(Z < ${zScore.toFixed(4)}) = ${probability.toFixed(4)}`);

    formulaLatex = `P(\\bar{X} < ${targetValue}) = P\\left(Z < ${zScore.toFixed(2)}\\right) = ${probability.toFixed(4)}`;
  } else if (type === 'sample-mean-value' && targetProbability !== undefined) {
    // Find x̄ such that P(X̄ < x̄) = targetProbability
    steps.push(`Find: Value of x̄ such that P(X̄ < x̄) = ${targetProbability}`);
    steps.push('');
    steps.push(`Step 1: Sample mean distribution`);
    steps.push(`E(X̄) = ${populationMean}`);
    steps.push(`SD(X̄) = ${populationSD}/√${sampleSize} = ${sampleMeanDist.standardDeviation.toFixed(4)}`);
    steps.push('');
    steps.push(`Step 2: Find Z-score`);
    zScore = inverseStandardNormal(targetProbability);
    steps.push(`P(Z < z) = ${targetProbability}`);
    steps.push(`z = ${zScore.toFixed(4)}`);
    steps.push('');
    steps.push(`Step 3: Convert to X̄`);
    value = populationMean + zScore * sampleMeanDist.standardDeviation;
    steps.push(`X̄ = μ + z(σ/√n) = ${populationMean} + ${zScore.toFixed(4)} × ${sampleMeanDist.standardDeviation.toFixed(4)}`);
    steps.push(`X̄ = ${value.toFixed(4)}`);

    formulaLatex = `\\bar{x} = \\mu + z\\left(\\frac{\\sigma}{\\sqrt{n}}\\right) = ${value.toFixed(2)}`;
  } else if (type === 'unbiased-estimate' && sampleData) {
    // Calculate unbiased estimates
    unbiasedMean = unbiasedMeanEstimate(sampleData);
    unbiasedVariance = unbiasedVarianceEstimate(sampleData);

    steps.push(`Given sample data: ${sampleData.join(', ')}`);
    steps.push(`Sample size n = ${sampleData.length}`);
    steps.push('');
    steps.push(`Step 1: Calculate sample mean (unbiased estimate of μ)`);
    steps.push(`x̄ = Σx/n = ${sampleData.reduce((sum, x) => sum + x, 0)}/${sampleData.length} = ${unbiasedMean.toFixed(4)}`);
    steps.push('');
    steps.push(`Step 2: Calculate unbiased estimate of σ²`);
    steps.push(`s² = Σ(x - x̄)²/(n - 1)`);
    const deviations = sampleData.map(x => `(${x} - ${unbiasedMean.toFixed(2)})²`).join(' + ');
    steps.push(`Note: Divide by (n-1) for unbiased estimate`);
    steps.push(`s² = ${unbiasedVariance.toFixed(4)}`);
    steps.push(`s = ${Math.sqrt(unbiasedVariance).toFixed(4)}`);

    formulaLatex = `\\bar{x} = ${unbiasedMean.toFixed(2)}, \\quad s^2 = ${unbiasedVariance.toFixed(2)}`;
  }

  const explanation = `By the Central Limit Theorem, for large samples (n ≥ 30), the sampling distribution of the sample mean is approximately normal with mean μ and variance σ²/n.`;

  return {
    populationMean,
    populationSD,
    sampleSize,
    sampleMeanExpectation: sampleMeanDist.mean,
    sampleMeanVariance: sampleMeanDist.variance,
    sampleMeanSD: sampleMeanDist.standardDeviation,
    zScore,
    probability,
    value,
    unbiasedMean,
    unbiasedVariance,
    formulaLatex,
    steps,
    explanation,
  };
}

/**
 * Sampling Examples
 */
export const SAMPLING_EXAMPLES: SamplingExample[] = [
  {
    id: 'bottles',
    title: 'Bottle Volumes',
    context: 'A bottling company fills bottles with a mean volume of 500 ml and standard deviation 8 ml. A sample of 40 bottles is randomly selected.',
    question: 'Find the probability that the sample mean volume is less than 498 ml.',
    populationMean: 500,
    populationSD: 8,
    sampleSize: 40,
    type: 'sample-mean-prob',
    targetValue: 498,
  },
  {
    id: 'test-scores',
    title: 'Test Scores',
    context: 'Test scores have mean 75 and standard deviation 10. A random sample of 50 students is selected.',
    question: 'Find the sample mean score below which 10% of samples fall.',
    populationMean: 75,
    populationSD: 10,
    sampleSize: 50,
    type: 'sample-mean-value',
    targetProbability: 0.10,
  },
  {
    id: 'light-bulbs',
    title: 'Light Bulb Lifetimes',
    context: 'The lifetimes of light bulbs have mean 1000 hours and standard deviation 100 hours. A sample of 36 bulbs is tested.',
    question: 'Find the probability that the sample mean lifetime exceeds 1020 hours.',
    populationMean: 1000,
    populationSD: 100,
    sampleSize: 36,
    type: 'sample-mean-prob',
    targetValue: 1020,
  },
  {
    id: 'unbiased-sample',
    title: 'Unbiased Estimates',
    context: 'A sample of 8 measurements is collected: 12, 15, 11, 14, 13, 16, 12, 15.',
    question: 'Calculate unbiased estimates of the population mean and variance.',
    populationMean: 0, // Not used for this type
    populationSD: 0, // Not used for this type
    sampleSize: 8,
    type: 'unbiased-estimate',
    sampleData: [12, 15, 11, 14, 13, 16, 12, 15],
  },
  {
    id: 'factory-weights',
    title: 'Factory Package Weights',
    context: 'Packages from a factory have mean weight 250g with standard deviation 15g. A quality control sample of 30 packages is taken.',
    question: 'Find the 95th percentile of sample mean weights.',
    populationMean: 250,
    populationSD: 15,
    sampleSize: 30,
    type: 'sample-mean-value',
    targetProbability: 0.95,
  },
];
