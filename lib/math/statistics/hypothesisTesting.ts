/**
 * Hypothesis Testing
 *
 * Includes:
 * - Null and alternative hypotheses
 * - Test statistics (Z-test, t-test)
 * - Critical regions and critical values
 * - P-values
 * - 1-tail and 2-tail tests
 */

import { standardNormalCDF, inverseStandardNormal } from './normalDistribution';

export interface HypothesisTestExample {
  id: string;
  title: string;
  context: string;
  question: string;
  nullHypothesis: string;
  alternativeHypothesis: string;
  testType: 'z-test' | 't-test';
  tailType: '1-tail-right' | '1-tail-left' | '2-tail';
  populationMean?: number; // μ₀ (hypothesized value)
  populationSD?: number; // σ (known for Z-test)
  sampleMean: number; // x̄
  sampleSD?: number; // s (for t-test)
  sampleSize: number; // n
  significanceLevel: number; // α (e.g., 0.05, 0.01)
}

export interface HypothesisTestResult {
  nullHypothesis: string;
  alternativeHypothesis: string;
  testType: 'z-test' | 't-test';
  tailType: '1-tail-right' | '1-tail-left' | '2-tail';
  testStatistic: number; // Z or t
  criticalValue: number | { lower: number; upper: number };
  pValue: number;
  significanceLevel: number;
  reject: boolean;
  conclusion: string;
  formulaLatex: string;
  steps: string[];
  explanation: string;
}

/**
 * Calculate Z-test statistic
 */
export function calculateZTestStatistic(
  sampleMean: number,
  populationMean: number,
  populationSD: number,
  sampleSize: number
): number {
  return (sampleMean - populationMean) / (populationSD / Math.sqrt(sampleSize));
}

/**
 * Calculate t-test statistic
 */
export function calculateTTestStatistic(
  sampleMean: number,
  populationMean: number,
  sampleSD: number,
  sampleSize: number
): number {
  return (sampleMean - populationMean) / (sampleSD / Math.sqrt(sampleSize));
}

/**
 * Calculate critical value for Z-test
 */
export function calculateZCriticalValue(
  significanceLevel: number,
  tailType: '1-tail-right' | '1-tail-left' | '2-tail'
): number | { lower: number; upper: number } {
  if (tailType === '1-tail-right') {
    return inverseStandardNormal(1 - significanceLevel);
  } else if (tailType === '1-tail-left') {
    return inverseStandardNormal(significanceLevel);
  } else {
    // 2-tail
    const zCrit = inverseStandardNormal(1 - significanceLevel / 2);
    return { lower: -zCrit, upper: zCrit };
  }
}

/**
 * Calculate p-value for Z-test
 */
export function calculateZPValue(
  zStat: number,
  tailType: '1-tail-right' | '1-tail-left' | '2-tail'
): number {
  if (tailType === '1-tail-right') {
    return 1 - standardNormalCDF(zStat);
  } else if (tailType === '1-tail-left') {
    return standardNormalCDF(zStat);
  } else {
    // 2-tail
    return 2 * (1 - standardNormalCDF(Math.abs(zStat)));
  }
}

/**
 * Solve hypothesis testing problem
 */
export function solveHypothesisTest(exampleId: string): HypothesisTestResult {
  const example = HYPOTHESIS_TEST_EXAMPLES.find(ex => ex.id === exampleId);
  if (!example) {
    throw new Error(`Example ${exampleId} not found`);
  }

  const {
    nullHypothesis,
    alternativeHypothesis,
    testType,
    tailType,
    populationMean,
    populationSD,
    sampleMean,
    sampleSD,
    sampleSize,
    significanceLevel,
  } = example;

  const steps: string[] = [];
  let testStatistic: number;
  let criticalValue: number | { lower: number; upper: number };
  let pValue: number;
  let formulaLatex = '';

  steps.push(`Step 1: State the hypotheses`);
  steps.push(`H₀: ${nullHypothesis}`);
  steps.push(`H₁: ${alternativeHypothesis}`);
  steps.push(`Significance level α = ${significanceLevel}`);
  steps.push('');

  if (testType === 'z-test' && populationMean !== undefined && populationSD !== undefined) {
    // Z-test
    steps.push(`Step 2: Calculate test statistic (Z-test)`);
    steps.push(`Given: x̄ = ${sampleMean}, μ₀ = ${populationMean}, σ = ${populationSD}, n = ${sampleSize}`);
    testStatistic = calculateZTestStatistic(sampleMean, populationMean, populationSD, sampleSize);
    steps.push(`Z = (x̄ - μ₀) / (σ/√n)`);
    steps.push(`Z = (${sampleMean} - ${populationMean}) / (${populationSD}/√${sampleSize})`);
    steps.push(`Z = ${testStatistic.toFixed(4)}`);
    steps.push('');

    steps.push(`Step 3: Determine critical value(s)`);
    criticalValue = calculateZCriticalValue(significanceLevel, tailType);
    if (typeof criticalValue === 'number') {
      steps.push(`For ${tailType} test with α = ${significanceLevel}:`);
      steps.push(`Critical value = ${criticalValue.toFixed(4)}`);
    } else {
      steps.push(`For ${tailType} test with α = ${significanceLevel}:`);
      steps.push(`Critical values = ±${criticalValue.upper.toFixed(4)}`);
    }
    steps.push('');

    steps.push(`Step 4: Calculate p-value`);
    pValue = calculateZPValue(testStatistic, tailType);
    steps.push(`p-value = ${pValue.toFixed(6)}`);
    steps.push('');

    formulaLatex = `Z = \\frac{\\bar{x} - \\mu_0}{\\sigma/\\sqrt{n}} = ${testStatistic.toFixed(4)}`;
  } else if (testType === 't-test' && populationMean !== undefined && sampleSD !== undefined) {
    // t-test
    steps.push(`Step 2: Calculate test statistic (t-test)`);
    steps.push(`Given: x̄ = ${sampleMean}, μ₀ = ${populationMean}, s = ${sampleSD}, n = ${sampleSize}`);
    testStatistic = calculateTTestStatistic(sampleMean, populationMean, sampleSD, sampleSize);
    steps.push(`t = (x̄ - μ₀) / (s/√n)`);
    steps.push(`t = (${sampleMean} - ${populationMean}) / (${sampleSD}/√${sampleSize})`);
    steps.push(`t = ${testStatistic.toFixed(4)}`);
    steps.push(`Degrees of freedom: df = n - 1 = ${sampleSize - 1}`);
    steps.push('');

    steps.push(`Step 3: Determine critical value(s)`);
    // For t-test, we'll use Z approximation for large samples (n ≥ 30)
    // or provide a note for small samples
    if (sampleSize >= 30) {
      criticalValue = calculateZCriticalValue(significanceLevel, tailType);
      if (typeof criticalValue === 'number') {
        steps.push(`For large sample (n ≥ 30), use Z approximation:`);
        steps.push(`Critical value ≈ ${criticalValue.toFixed(4)}`);
      } else {
        steps.push(`For large sample (n ≥ 30), use Z approximation:`);
        steps.push(`Critical values ≈ ±${criticalValue.upper.toFixed(4)}`);
      }
    } else {
      criticalValue = calculateZCriticalValue(significanceLevel, tailType);
      if (typeof criticalValue === 'number') {
        steps.push(`For df = ${sampleSize - 1}, consult t-table:`);
        steps.push(`Critical value (approx.) = ${criticalValue.toFixed(4)}`);
      } else {
        steps.push(`For df = ${sampleSize - 1}, consult t-table:`);
        steps.push(`Critical values (approx.) = ±${criticalValue.upper.toFixed(4)}`);
      }
    }
    steps.push('');

    steps.push(`Step 4: Calculate p-value (using Z approximation)`);
    pValue = calculateZPValue(testStatistic, tailType);
    steps.push(`p-value ≈ ${pValue.toFixed(6)}`);
    steps.push('');

    formulaLatex = `t = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}} = ${testStatistic.toFixed(4)}`;
  } else {
    throw new Error('Invalid test configuration');
  }

  // Step 5: Make decision
  steps.push(`Step 5: Make decision`);
  let reject = false;

  if (typeof criticalValue === 'number') {
    if (tailType === '1-tail-right') {
      reject = testStatistic > criticalValue;
      steps.push(`Test: Z > ${criticalValue.toFixed(4)}?`);
      steps.push(`${testStatistic.toFixed(4)} > ${criticalValue.toFixed(4)}: ${reject ? 'Yes' : 'No'}`);
    } else {
      reject = testStatistic < criticalValue;
      steps.push(`Test: Z < ${criticalValue.toFixed(4)}?`);
      steps.push(`${testStatistic.toFixed(4)} < ${criticalValue.toFixed(4)}: ${reject ? 'Yes' : 'No'}`);
    }
  } else {
    reject = testStatistic < criticalValue.lower || testStatistic > criticalValue.upper;
    steps.push(`Test: |Z| > ${criticalValue.upper.toFixed(4)}?`);
    steps.push(`|${testStatistic.toFixed(4)}| > ${criticalValue.upper.toFixed(4)}: ${reject ? 'Yes' : 'No'}`);
  }

  steps.push(`Also: p-value (${pValue.toFixed(6)}) ${pValue < significanceLevel ? '<' : '≥'} α (${significanceLevel})`);
  steps.push(reject ? 'Reject H₀' : 'Do not reject H₀');
  steps.push('');

  const conclusion = reject
    ? `At ${(significanceLevel * 100).toFixed(0)}% significance level, there is sufficient evidence to reject H₀. ${alternativeHypothesis}`
    : `At ${(significanceLevel * 100).toFixed(0)}% significance level, there is insufficient evidence to reject H₀. We cannot conclude that ${alternativeHypothesis}`;

  steps.push(`Conclusion: ${conclusion}`);

  const explanation = `In hypothesis testing, we compare the test statistic to critical values or use the p-value to make decisions. If the p-value < α, we reject the null hypothesis.`;

  return {
    nullHypothesis,
    alternativeHypothesis,
    testType,
    tailType,
    testStatistic,
    criticalValue,
    pValue,
    significanceLevel,
    reject,
    conclusion,
    formulaLatex,
    steps,
    explanation,
  };
}

/**
 * Hypothesis Testing Examples
 */
export const HYPOTHESIS_TEST_EXAMPLES: HypothesisTestExample[] = [
  {
    id: 'mean-weight',
    title: 'Mean Weight Test',
    context: 'A factory claims that the mean weight of their product is 500g with a known standard deviation of 15g. A quality control sample of 36 items has a mean weight of 495g.',
    question: 'Test at 5% significance level whether the true mean weight is less than claimed.',
    nullHypothesis: 'μ = 500',
    alternativeHypothesis: 'μ < 500',
    testType: 'z-test',
    tailType: '1-tail-left',
    populationMean: 500,
    populationSD: 15,
    sampleMean: 495,
    sampleSize: 36,
    significanceLevel: 0.05,
  },
  {
    id: 'mean-score',
    title: 'Test Score Comparison',
    context: 'A teacher claims that students score an average of 70 on a test. A sample of 40 students has a mean score of 73 with standard deviation 12.',
    question: 'Test at 1% significance level whether the mean score is different from 70.',
    nullHypothesis: 'μ = 70',
    alternativeHypothesis: 'μ ≠ 70',
    testType: 't-test',
    tailType: '2-tail',
    populationMean: 70,
    sampleMean: 73,
    sampleSD: 12,
    sampleSize: 40,
    significanceLevel: 0.01,
  },
  {
    id: 'mean-height',
    title: 'Height Test',
    context: 'The average height of adults in a region is known to be 165 cm with standard deviation 8 cm. A sample of 50 adults from a specific town has mean height 167 cm.',
    question: 'Test at 5% significance level whether the town has taller average height.',
    nullHypothesis: 'μ = 165',
    alternativeHypothesis: 'μ > 165',
    testType: 'z-test',
    tailType: '1-tail-right',
    populationMean: 165,
    populationSD: 8,
    sampleMean: 167,
    sampleSize: 50,
    significanceLevel: 0.05,
  },
  {
    id: 'battery-life',
    title: 'Battery Life Test',
    context: 'A manufacturer claims that their batteries last 1000 hours on average. A sample of 30 batteries has mean lifetime 980 hours with standard deviation 60 hours.',
    question: 'Test at 5% significance level whether the true mean is less than claimed.',
    nullHypothesis: 'μ = 1000',
    alternativeHypothesis: 'μ < 1000',
    testType: 't-test',
    tailType: '1-tail-left',
    populationMean: 1000,
    sampleMean: 980,
    sampleSD: 60,
    sampleSize: 30,
    significanceLevel: 0.05,
  },
  {
    id: 'reaction-time',
    title: 'Reaction Time Test',
    context: 'Research suggests reaction time is normally distributed with mean 250ms and standard deviation 30ms. A sample of 45 athletes has mean reaction time 240ms.',
    question: 'Test at 1% significance level whether athletes have different reaction time.',
    nullHypothesis: 'μ = 250',
    alternativeHypothesis: 'μ ≠ 250',
    testType: 'z-test',
    tailType: '2-tail',
    populationMean: 250,
    populationSD: 30,
    sampleMean: 240,
    sampleSize: 45,
    significanceLevel: 0.01,
  },
];
