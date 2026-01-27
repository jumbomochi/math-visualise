/**
 * General Discrete Random Variables - Probability Distributions
 *
 * Includes:
 * - Probability distribution tables
 * - Expected value E(X)
 * - Variance Var(X) and Standard Deviation
 * - Properties: E(aX + b), Var(aX + b)
 * - Mode and median
 * - Cumulative distribution function
 */

import { Fraction, decimalToFraction, formatFraction, createFraction } from '../utils/fractions';

export interface ProbabilityDistribution {
  values: number[];
  probabilities: number[];
  probabilityFractions?: Fraction[];
}

export interface DiscreteRVExample {
  id: string;
  title: string;
  context: string;
  question: string;
  distribution: ProbabilityDistribution;
  type: 'expectation' | 'variance' | 'transformation' | 'mode-median' | 'probability' | 'cumulative';
  transformation?: {
    a: number;
    b: number;
    description: string;
  };
  probabilityQuery?: {
    type: 'less-than' | 'greater-than' | 'equal' | 'between' | 'at-most' | 'at-least';
    value1?: number;
    value2?: number;
  };
}

export interface DiscreteRVResult {
  distribution: ProbabilityDistribution;
  expectation: number;
  variance: number;
  standardDeviation: number;
  mode?: number[];
  median?: number;
  transformedExpectation?: number;
  transformedVariance?: number;
  transformedSD?: number;
  probability?: number;
  cumulativeProbs?: number[];
  formulaLatex: string;
  steps: string[];
  explanation: string;
}

/**
 * Calculate expected value E(X)
 */
export function calculateExpectation(distribution: ProbabilityDistribution): number {
  const { values, probabilities } = distribution;
  return values.reduce((sum, value, i) => sum + value * probabilities[i], 0);
}

/**
 * Calculate E(X²)
 */
export function calculateEXSquared(distribution: ProbabilityDistribution): number {
  const { values, probabilities } = distribution;
  return values.reduce((sum, value, i) => sum + value * value * probabilities[i], 0);
}

/**
 * Calculate variance Var(X) = E(X²) - [E(X)]²
 */
export function calculateVariance(distribution: ProbabilityDistribution): number {
  const ex = calculateExpectation(distribution);
  const ex2 = calculateEXSquared(distribution);
  return ex2 - ex * ex;
}

/**
 * Calculate mode (most likely value(s))
 */
export function calculateMode(distribution: ProbabilityDistribution): number[] {
  const { values, probabilities } = distribution;
  const maxProb = Math.max(...probabilities);
  return values.filter((_, i) => probabilities[i] === maxProb);
}

/**
 * Calculate median
 */
export function calculateMedian(distribution: ProbabilityDistribution): number {
  const { values, probabilities } = distribution;
  let cumulative = 0;
  for (let i = 0; i < values.length; i++) {
    cumulative += probabilities[i];
    if (cumulative >= 0.5) {
      return values[i];
    }
  }
  return values[values.length - 1];
}

/**
 * Calculate cumulative distribution function
 */
export function calculateCumulativeDistribution(distribution: ProbabilityDistribution): number[] {
  const { probabilities } = distribution;
  const cumulative: number[] = [];
  let sum = 0;
  for (let i = 0; i < probabilities.length; i++) {
    sum += probabilities[i];
    cumulative.push(sum);
  }
  return cumulative;
}

/**
 * Calculate E(aX + b)
 */
export function calculateTransformedExpectation(ex: number, a: number, b: number): number {
  return a * ex + b;
}

/**
 * Calculate Var(aX + b) = a² Var(X)
 */
export function calculateTransformedVariance(varX: number, a: number): number {
  return a * a * varX;
}

/**
 * Calculate probability for specific queries
 */
export function calculateProbabilityQuery(
  distribution: ProbabilityDistribution,
  query: { type: string; value1?: number; value2?: number }
): number {
  const { values, probabilities } = distribution;

  switch (query.type) {
    case 'less-than':
      return values.reduce((sum, val, i) => sum + (val < query.value1! ? probabilities[i] : 0), 0);
    case 'at-most':
      return values.reduce((sum, val, i) => sum + (val <= query.value1! ? probabilities[i] : 0), 0);
    case 'greater-than':
      return values.reduce((sum, val, i) => sum + (val > query.value1! ? probabilities[i] : 0), 0);
    case 'at-least':
      return values.reduce((sum, val, i) => sum + (val >= query.value1! ? probabilities[i] : 0), 0);
    case 'equal':
      const idx = values.indexOf(query.value1!);
      return idx >= 0 ? probabilities[idx] : 0;
    case 'between':
      return values.reduce((sum, val, i) =>
        sum + (val >= query.value1! && val <= query.value2! ? probabilities[i] : 0), 0);
    default:
      return 0;
  }
}

/**
 * Solve discrete random variable problem
 */
export function solveDiscreteRVProblem(exampleId: string): DiscreteRVResult {
  const example = DISCRETE_RV_EXAMPLES.find(ex => ex.id === exampleId);
  if (!example) {
    throw new Error(`Example ${exampleId} not found`);
  }

  const { distribution, type, transformation, probabilityQuery } = example;
  const steps: string[] = [];

  // Calculate basic statistics
  const expectation = calculateExpectation(distribution);
  const variance = calculateVariance(distribution);
  const standardDeviation = Math.sqrt(variance);
  const ex2 = calculateEXSquared(distribution);

  steps.push('Probability Distribution:');
  steps.push('');

  // Display distribution table
  let tableStr = 'x:    ';
  distribution.values.forEach(v => {
    tableStr += `${v}`.padEnd(8);
  });
  steps.push(tableStr);

  tableStr = 'P(X=x): ';
  distribution.probabilities.forEach((p, i) => {
    if (distribution.probabilityFractions && distribution.probabilityFractions[i]) {
      tableStr += formatFraction(distribution.probabilityFractions[i]).padEnd(8);
    } else {
      tableStr += p.toFixed(4).padEnd(8);
    }
  });
  steps.push(tableStr);
  steps.push('');

  // Calculate expectation
  steps.push('Step 1: Calculate E(X)');
  steps.push('E(X) = Σ x·P(X=x)');
  const exCalc = distribution.values.map((v, i) => {
    if (distribution.probabilityFractions && distribution.probabilityFractions[i]) {
      return `${v}×${formatFraction(distribution.probabilityFractions[i])}`;
    }
    return `${v}×${distribution.probabilities[i]}`;
  }).join(' + ');
  steps.push(`E(X) = ${exCalc}`);
  steps.push(`E(X) = ${expectation.toFixed(4)}`);
  steps.push('');

  // Calculate variance
  steps.push('Step 2: Calculate Var(X)');
  steps.push('Var(X) = E(X²) - [E(X)]²');
  steps.push('');
  steps.push('First, find E(X²):');
  steps.push('E(X²) = Σ x²·P(X=x)');
  const ex2Calc = distribution.values.map((v, i) => {
    if (distribution.probabilityFractions && distribution.probabilityFractions[i]) {
      return `${v}²×${formatFraction(distribution.probabilityFractions[i])}`;
    }
    return `${v}²×${distribution.probabilities[i]}`;
  }).join(' + ');
  steps.push(`E(X²) = ${ex2Calc}`);
  steps.push(`E(X²) = ${ex2.toFixed(4)}`);
  steps.push('');
  steps.push(`Var(X) = ${ex2.toFixed(4)} - (${expectation.toFixed(4)})²`);
  steps.push(`Var(X) = ${ex2.toFixed(4)} - ${(expectation * expectation).toFixed(4)}`);
  steps.push(`Var(X) = ${variance.toFixed(4)}`);
  steps.push(`SD(X) = √${variance.toFixed(4)} = ${standardDeviation.toFixed(4)}`);
  steps.push('');

  let formulaLatex = `E(X) = ${expectation.toFixed(4)}, \\quad \\text{Var}(X) = ${variance.toFixed(4)}`;

  let transformedExpectation: number | undefined;
  let transformedVariance: number | undefined;
  let transformedSD: number | undefined;

  if (type === 'transformation' && transformation) {
    const { a, b, description } = transformation;
    transformedExpectation = calculateTransformedExpectation(expectation, a, b);
    transformedVariance = calculateTransformedVariance(variance, a);
    transformedSD = Math.sqrt(transformedVariance);

    steps.push(`Step 3: Transform to ${description}`);
    steps.push('');
    steps.push(`E(${description}) = ${a}×E(X) + ${b}`);
    steps.push(`E(${description}) = ${a}×${expectation.toFixed(4)} + ${b}`);
    steps.push(`E(${description}) = ${transformedExpectation.toFixed(4)}`);
    steps.push('');
    steps.push(`Var(${description}) = ${a}²×Var(X)`);
    steps.push(`Var(${description}) = ${a}²×${variance.toFixed(4)}`);
    steps.push(`Var(${description}) = ${transformedVariance.toFixed(4)}`);
    steps.push(`SD(${description}) = ${transformedSD.toFixed(4)}`);

    formulaLatex = `E(${description}) = ${transformedExpectation.toFixed(2)}, \\quad \\text{Var}(${description}) = ${transformedVariance.toFixed(2)}`;
  }

  let mode: number[] | undefined;
  let median: number | undefined;

  if (type === 'mode-median') {
    mode = calculateMode(distribution);
    median = calculateMedian(distribution);

    steps.push('Step 3: Find Mode and Median');
    steps.push('');
    steps.push('Mode: Value(s) with highest probability');
    steps.push(`Mode = ${mode.join(', ')}`);
    steps.push('');
    steps.push('Median: Value where cumulative probability ≥ 0.5');
    const cumulative = calculateCumulativeDistribution(distribution);
    distribution.values.forEach((v, i) => {
      steps.push(`P(X ≤ ${v}) = ${cumulative[i].toFixed(4)}`);
    });
    steps.push(`Median = ${median}`);

    formulaLatex = `\\text{Mode} = ${mode.join(', ')}, \\quad \\text{Median} = ${median}`;
  }

  let probability: number | undefined;
  let cumulativeProbs: number[] | undefined;

  if (type === 'probability' && probabilityQuery) {
    probability = calculateProbabilityQuery(distribution, probabilityQuery);

    steps.push('Step 3: Calculate Probability');
    steps.push('');

    if (probabilityQuery.type === 'less-than') {
      steps.push(`P(X < ${probabilityQuery.value1}) = ${probability.toFixed(4)}`);
      formulaLatex = `P(X < ${probabilityQuery.value1}) = ${probability.toFixed(4)}`;
    } else if (probabilityQuery.type === 'at-most') {
      steps.push(`P(X ≤ ${probabilityQuery.value1}) = ${probability.toFixed(4)}`);
      formulaLatex = `P(X \\leq ${probabilityQuery.value1}) = ${probability.toFixed(4)}`;
    } else if (probabilityQuery.type === 'greater-than') {
      steps.push(`P(X > ${probabilityQuery.value1}) = ${probability.toFixed(4)}`);
      formulaLatex = `P(X > ${probabilityQuery.value1}) = ${probability.toFixed(4)}`;
    } else if (probabilityQuery.type === 'at-least') {
      steps.push(`P(X ≥ ${probabilityQuery.value1}) = ${probability.toFixed(4)}`);
      formulaLatex = `P(X \\geq ${probabilityQuery.value1}) = ${probability.toFixed(4)}`;
    } else if (probabilityQuery.type === 'between') {
      steps.push(`P(${probabilityQuery.value1} ≤ X ≤ ${probabilityQuery.value2}) = ${probability.toFixed(4)}`);
      formulaLatex = `P(${probabilityQuery.value1} \\leq X \\leq ${probabilityQuery.value2}) = ${probability.toFixed(4)}`;
    }
  }

  if (type === 'cumulative') {
    cumulativeProbs = calculateCumulativeDistribution(distribution);

    steps.push('Step 3: Cumulative Distribution Function');
    steps.push('');
    distribution.values.forEach((v, i) => {
      steps.push(`F(${v}) = P(X ≤ ${v}) = ${cumulativeProbs![i].toFixed(4)}`);
    });
  }

  const explanation = 'A discrete random variable takes specific values with given probabilities. E(X) is the long-run average value, and Var(X) measures the spread.';

  return {
    distribution,
    expectation,
    variance,
    standardDeviation,
    mode,
    median,
    transformedExpectation,
    transformedVariance,
    transformedSD,
    probability,
    cumulativeProbs,
    formulaLatex,
    steps,
    explanation,
  };
}

/**
 * Discrete Random Variable Examples
 */
export const DISCRETE_RV_EXAMPLES: DiscreteRVExample[] = [
  {
    id: 'dice-game',
    title: 'Dice Game Winnings',
    context: 'A fair die is rolled. You win $X where X is the number shown.',
    question: 'Find the expected winnings E(X) and variance Var(X).',
    distribution: {
      values: [1, 2, 3, 4, 5, 6],
      probabilities: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6],
      probabilityFractions: [
        createFraction(1, 6),
        createFraction(1, 6),
        createFraction(1, 6),
        createFraction(1, 6),
        createFraction(1, 6),
        createFraction(1, 6),
      ],
    },
    type: 'expectation',
  },
  {
    id: 'spinner',
    title: 'Spinner Game',
    context: 'A spinner has 4 sections. The random variable X represents the score obtained.',
    question: 'Find E(X), Var(X), and if Y = 2X + 3, find E(Y) and Var(Y).',
    distribution: {
      values: [0, 1, 2, 3],
      probabilities: [0.1, 0.3, 0.4, 0.2],
      probabilityFractions: [
        createFraction(1, 10),
        createFraction(3, 10),
        createFraction(2, 5),
        createFraction(1, 5),
      ],
    },
    type: 'transformation',
    transformation: {
      a: 2,
      b: 3,
      description: 'Y = 2X + 3',
    },
  },
  {
    id: 'raffle',
    title: 'Raffle Tickets',
    context: 'In a raffle, there are prizes of $100, $50, and $10. The discrete random variable X represents the prize won.',
    question: 'Find the mode and median of X.',
    distribution: {
      values: [0, 10, 50, 100],
      probabilities: [0.85, 0.10, 0.04, 0.01],
    },
    type: 'mode-median',
  },
  {
    id: 'cards',
    title: 'Card Drawing',
    context: 'A card is drawn from a standard deck. X is the value (Ace=1, Jack/Queen/King=10, others face value).',
    question: 'Find P(X ≤ 5).',
    distribution: {
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      probabilities: [1/13, 1/13, 1/13, 1/13, 1/13, 1/13, 1/13, 1/13, 1/13, 4/13],
      probabilityFractions: [
        createFraction(1, 13),
        createFraction(1, 13),
        createFraction(1, 13),
        createFraction(1, 13),
        createFraction(1, 13),
        createFraction(1, 13),
        createFraction(1, 13),
        createFraction(1, 13),
        createFraction(1, 13),
        createFraction(4, 13),
      ],
    },
    type: 'probability',
    probabilityQuery: {
      type: 'at-most',
      value1: 5,
    },
  },
  {
    id: 'insurance',
    title: 'Insurance Claims',
    context: 'An insurance company models the number of claims per month. X represents the number of claims.',
    question: 'Find the cumulative distribution function.',
    distribution: {
      values: [0, 1, 2, 3, 4],
      probabilities: [0.4, 0.3, 0.2, 0.08, 0.02],
      probabilityFractions: [
        createFraction(2, 5),
        createFraction(3, 10),
        createFraction(1, 5),
        createFraction(2, 25),
        createFraction(1, 50),
      ],
    },
    type: 'cumulative',
  },
];
