/**
 * Statistics Module
 *
 * Barrel export for all statistics functions
 */

// General Discrete Random Variables
export {
  calculateExpectation,
  calculateVariance,
  calculateEXSquared,
  calculateMode,
  calculateMedian,
  calculateCumulativeDistribution,
  calculateTransformedExpectation,
  calculateTransformedVariance,
  calculateProbabilityQuery,
  solveDiscreteRVProblem,
  DISCRETE_RV_EXAMPLES,
  type ProbabilityDistribution,
  type DiscreteRVExample,
  type DiscreteRVResult,
} from './generalDiscreteRV';

// Binomial Distribution
export {
  binomialCoefficient,
  binomialProbability,
  binomialCumulativeProbability,
  binomialExpectation,
  binomialVariance,
  solveBinomialProblem,
  BINOMIAL_EXAMPLES,
  type DiscreteDistribution,
  type BinomialDistributionData,
  type BinomialExample,
  type BinomialResult,
} from './discreteRandomVariables';

// Normal Distribution
export {
  calculateZScore,
  standardNormalCDF,
  inverseStandardNormal,
  normalCDF,
  inverseNormal,
  solveNormalProblem,
  NORMAL_EXAMPLES,
  type NormalDistributionData,
  type NormalExample,
  type NormalResult,
} from './normalDistribution';

// Sampling and Central Limit Theorem
export {
  sampleMeanDistribution,
  unbiasedMeanEstimate,
  unbiasedVarianceEstimate,
  sampleMeanZScore,
  solveSamplingProblem,
  SAMPLING_EXAMPLES,
  type SamplingExample,
  type SamplingResult,
} from './sampling';

// Hypothesis Testing
export {
  calculateZTestStatistic,
  calculateTTestStatistic,
  calculateZCriticalValue,
  calculateZPValue,
  solveHypothesisTest,
  HYPOTHESIS_TEST_EXAMPLES,
  type HypothesisTestExample,
  type HypothesisTestResult,
} from './hypothesisTesting';

// Correlation and Regression
export {
  calculateCorrelation,
  regressionYOnX,
  regressionXOnY,
  solveCorrelationRegression,
  CORRELATION_REGRESSION_EXAMPLES,
  type DataPoint,
  type CorrelationRegressionExample,
  type CorrelationRegressionResult,
} from './correlationRegression';
