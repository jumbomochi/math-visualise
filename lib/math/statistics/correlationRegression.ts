/**
 * Correlation and Linear Regression
 *
 * Includes:
 * - Product-moment correlation coefficient
 * - Scatter diagrams
 * - Least squares regression line
 * - Predictions and interpolation/extrapolation
 */

export interface DataPoint {
  x: number;
  y: number;
}

export interface CorrelationRegressionExample {
  id: string;
  title: string;
  context: string;
  question: string;
  data: DataPoint[];
  xLabel: string;
  yLabel: string;
  predictX?: number; // For predicting Y from X
  predictY?: number; // For predicting X from Y
}

export interface CorrelationRegressionResult {
  data: DataPoint[];
  xLabel: string;
  yLabel: string;
  n: number;
  sumX: number;
  sumY: number;
  sumXY: number;
  sumX2: number;
  sumY2: number;
  meanX: number;
  meanY: number;
  sxx: number;
  syy: number;
  sxy: number;
  correlationCoefficient: number;
  regressionLineY: {
    slope: number;
    intercept: number;
    equation: string;
    equationLatex: string;
  };
  regressionLineX: {
    slope: number;
    intercept: number;
    equation: string;
    equationLatex: string;
  };
  predictedY?: number;
  predictedX?: number;
  formulaLatex: string;
  steps: string[];
  explanation: string;
}

/**
 * Calculate correlation coefficient (r)
 */
export function calculateCorrelation(data: DataPoint[]): {
  r: number;
  sxx: number;
  syy: number;
  sxy: number;
  meanX: number;
  meanY: number;
  sumX: number;
  sumY: number;
  sumXY: number;
  sumX2: number;
  sumY2: number;
} {
  const n = data.length;
  const sumX = data.reduce((sum, point) => sum + point.x, 0);
  const sumY = data.reduce((sum, point) => sum + point.y, 0);
  const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
  const sumX2 = data.reduce((sum, point) => sum + point.x * point.x, 0);
  const sumY2 = data.reduce((sum, point) => sum + point.y * point.y, 0);

  const meanX = sumX / n;
  const meanY = sumY / n;

  // Sxx = Σx² - (Σx)²/n
  const sxx = sumX2 - (sumX * sumX) / n;
  // Syy = Σy² - (Σy)²/n
  const syy = sumY2 - (sumY * sumY) / n;
  // Sxy = Σxy - (Σx)(Σy)/n
  const sxy = sumXY - (sumX * sumY) / n;

  // r = Sxy / √(Sxx × Syy)
  const r = sxy / Math.sqrt(sxx * syy);

  return {
    r,
    sxx,
    syy,
    sxy,
    meanX,
    meanY,
    sumX,
    sumY,
    sumXY,
    sumX2,
    sumY2,
  };
}

/**
 * Calculate least squares regression line Y on X (for predicting Y from X)
 */
export function regressionYOnX(
  sxy: number,
  sxx: number,
  meanX: number,
  meanY: number
): { slope: number; intercept: number; equation: string; equationLatex: string } {
  // b = Sxy / Sxx
  const slope = sxy / sxx;
  // a = ȳ - b·x̄
  const intercept = meanY - slope * meanX;

  const equation = `y = ${intercept.toFixed(4)} + ${slope.toFixed(4)}x`;
  const equationLatex = `y = ${intercept.toFixed(2)} + ${slope.toFixed(2)}x`;

  return { slope, intercept, equation, equationLatex };
}

/**
 * Calculate least squares regression line X on Y (for predicting X from Y)
 */
export function regressionXOnY(
  sxy: number,
  syy: number,
  meanX: number,
  meanY: number
): { slope: number; intercept: number; equation: string; equationLatex: string } {
  // b = Sxy / Syy
  const slope = sxy / syy;
  // a = x̄ - b·ȳ
  const intercept = meanX - slope * meanY;

  const equation = `x = ${intercept.toFixed(4)} + ${slope.toFixed(4)}y`;
  const equationLatex = `x = ${intercept.toFixed(2)} + ${slope.toFixed(2)}y`;

  return { slope, intercept, equation, equationLatex };
}

/**
 * Solve correlation and regression problem
 */
export function solveCorrelationRegression(exampleId: string): CorrelationRegressionResult {
  const example = CORRELATION_REGRESSION_EXAMPLES.find(ex => ex.id === exampleId);
  if (!example) {
    throw new Error(`Example ${exampleId} not found`);
  }

  const { data, xLabel, yLabel, predictX, predictY } = example;
  const n = data.length;

  const steps: string[] = [];

  steps.push(`Given data with ${n} observations:`);
  steps.push('');

  // Calculate correlation
  const { r, sxx, syy, sxy, meanX, meanY, sumX, sumY, sumXY, sumX2, sumY2 } = calculateCorrelation(data);

  steps.push(`Step 1: Calculate sums`);
  steps.push(`Σx = ${sumX.toFixed(2)}`);
  steps.push(`Σy = ${sumY.toFixed(2)}`);
  steps.push(`Σxy = ${sumXY.toFixed(2)}`);
  steps.push(`Σx² = ${sumX2.toFixed(2)}`);
  steps.push(`Σy² = ${sumY2.toFixed(2)}`);
  steps.push('');

  steps.push(`Step 2: Calculate means`);
  steps.push(`x̄ = Σx/n = ${sumX.toFixed(2)}/${n} = ${meanX.toFixed(4)}`);
  steps.push(`ȳ = Σy/n = ${sumY.toFixed(2)}/${n} = ${meanY.toFixed(4)}`);
  steps.push('');

  steps.push(`Step 3: Calculate Sxx, Syy, Sxy`);
  steps.push(`Sxx = Σx² - (Σx)²/n = ${sumX2.toFixed(2)} - ${((sumX * sumX) / n).toFixed(2)} = ${sxx.toFixed(4)}`);
  steps.push(`Syy = Σy² - (Σy)²/n = ${sumY2.toFixed(2)} - ${((sumY * sumY) / n).toFixed(2)} = ${syy.toFixed(4)}`);
  steps.push(`Sxy = Σxy - (Σx)(Σy)/n = ${sumXY.toFixed(2)} - ${((sumX * sumY) / n).toFixed(2)} = ${sxy.toFixed(4)}`);
  steps.push('');

  steps.push(`Step 4: Calculate correlation coefficient`);
  steps.push(`r = Sxy / √(Sxx × Syy)`);
  steps.push(`r = ${sxy.toFixed(4)} / √(${sxx.toFixed(4)} × ${syy.toFixed(4)})`);
  steps.push(`r = ${r.toFixed(6)}`);
  steps.push('');

  // Regression line Y on X
  const regressionLineY = regressionYOnX(sxy, sxx, meanX, meanY);
  steps.push(`Step 5: Regression line Y on X (for predicting Y)`);
  steps.push(`b = Sxy / Sxx = ${sxy.toFixed(4)} / ${sxx.toFixed(4)} = ${regressionLineY.slope.toFixed(4)}`);
  steps.push(`a = ȳ - b·x̄ = ${meanY.toFixed(4)} - ${regressionLineY.slope.toFixed(4)} × ${meanX.toFixed(4)} = ${regressionLineY.intercept.toFixed(4)}`);
  steps.push(`Regression line: ${regressionLineY.equation}`);
  steps.push('');

  // Regression line X on Y
  const regressionLineX = regressionXOnY(sxy, syy, meanX, meanY);
  steps.push(`Step 6: Regression line X on Y (for predicting X)`);
  steps.push(`b = Sxy / Syy = ${sxy.toFixed(4)} / ${syy.toFixed(4)} = ${regressionLineX.slope.toFixed(4)}`);
  steps.push(`a = x̄ - b·ȳ = ${meanX.toFixed(4)} - ${regressionLineX.slope.toFixed(4)} × ${meanY.toFixed(4)} = ${regressionLineX.intercept.toFixed(4)}`);
  steps.push(`Regression line: ${regressionLineX.equation}`);
  steps.push('');

  let predictedY: number | undefined;
  let predictedX: number | undefined;

  if (predictX !== undefined) {
    predictedY = regressionLineY.intercept + regressionLineY.slope * predictX;
    steps.push(`Prediction: For x = ${predictX}, predict y`);
    steps.push(`y = ${regressionLineY.intercept.toFixed(4)} + ${regressionLineY.slope.toFixed(4)} × ${predictX}`);
    steps.push(`y = ${predictedY.toFixed(4)}`);
    steps.push('');
  }

  if (predictY !== undefined) {
    predictedX = regressionLineX.intercept + regressionLineX.slope * predictY;
    steps.push(`Prediction: For y = ${predictY}, predict x`);
    steps.push(`x = ${regressionLineX.intercept.toFixed(4)} + ${regressionLineX.slope.toFixed(4)} × ${predictY}`);
    steps.push(`x = ${predictedX.toFixed(4)}`);
    steps.push('');
  }

  const formulaLatex = `r = ${r.toFixed(4)}, \\quad ${regressionLineY.equationLatex}`;

  // Interpret correlation
  let correlationStrength = '';
  const absR = Math.abs(r);
  if (absR >= 0.9) correlationStrength = 'very strong';
  else if (absR >= 0.7) correlationStrength = 'strong';
  else if (absR >= 0.5) correlationStrength = 'moderate';
  else if (absR >= 0.3) correlationStrength = 'weak';
  else correlationStrength = 'very weak';

  const correlationDirection = r > 0 ? 'positive' : 'negative';

  const explanation = `The correlation coefficient r = ${r.toFixed(4)} indicates a ${correlationStrength} ${correlationDirection} linear relationship. The regression line allows us to predict one variable from the other.`;

  return {
    data,
    xLabel,
    yLabel,
    n,
    sumX,
    sumY,
    sumXY,
    sumX2,
    sumY2,
    meanX,
    meanY,
    sxx,
    syy,
    sxy,
    correlationCoefficient: r,
    regressionLineY,
    regressionLineX,
    predictedY,
    predictedX,
    formulaLatex,
    steps,
    explanation,
  };
}

/**
 * Correlation and Regression Examples
 */
export const CORRELATION_REGRESSION_EXAMPLES: CorrelationRegressionExample[] = [
  {
    id: 'height-weight',
    title: 'Height vs Weight',
    context: 'A study collected height (cm) and weight (kg) data from 8 individuals.',
    question: 'Find the correlation coefficient and regression line. Predict weight for height 170 cm.',
    data: [
      { x: 160, y: 55 },
      { x: 165, y: 60 },
      { x: 170, y: 65 },
      { x: 175, y: 70 },
      { x: 155, y: 50 },
      { x: 180, y: 75 },
      { x: 162, y: 58 },
      { x: 178, y: 73 },
    ],
    xLabel: 'Height (cm)',
    yLabel: 'Weight (kg)',
    predictX: 170,
  },
  {
    id: 'study-hours-score',
    title: 'Study Hours vs Score',
    context: 'Students recorded study hours and exam scores.',
    question: 'Analyze the relationship between study hours and exam scores.',
    data: [
      { x: 2, y: 50 },
      { x: 3, y: 60 },
      { x: 4, y: 65 },
      { x: 5, y: 70 },
      { x: 6, y: 75 },
      { x: 7, y: 80 },
      { x: 8, y: 85 },
      { x: 4.5, y: 68 },
    ],
    xLabel: 'Study Hours',
    yLabel: 'Exam Score',
    predictX: 5.5,
  },
  {
    id: 'temperature-sales',
    title: 'Temperature vs Ice Cream Sales',
    context: 'Daily temperature and ice cream sales were recorded for 10 days.',
    question: 'Find the correlation and predict sales for 30°C.',
    data: [
      { x: 20, y: 120 },
      { x: 22, y: 140 },
      { x: 25, y: 160 },
      { x: 28, y: 180 },
      { x: 30, y: 200 },
      { x: 32, y: 220 },
      { x: 24, y: 150 },
      { x: 26, y: 170 },
      { x: 29, y: 190 },
      { x: 31, y: 210 },
    ],
    xLabel: 'Temperature (°C)',
    yLabel: 'Sales (units)',
    predictX: 30,
  },
  {
    id: 'age-reaction',
    title: 'Age vs Reaction Time',
    context: 'Reaction time (ms) was measured for people of different ages.',
    question: 'Determine the relationship between age and reaction time.',
    data: [
      { x: 20, y: 250 },
      { x: 30, y: 270 },
      { x: 40, y: 290 },
      { x: 50, y: 310 },
      { x: 60, y: 330 },
      { x: 25, y: 260 },
      { x: 35, y: 280 },
    ],
    xLabel: 'Age (years)',
    yLabel: 'Reaction Time (ms)',
    predictX: 45,
  },
  {
    id: 'advertising-revenue',
    title: 'Advertising vs Revenue',
    context: 'A company tracked advertising spend ($1000) and revenue ($1000) over 9 months.',
    question: 'Find the regression equation and predict revenue for $15,000 advertising.',
    data: [
      { x: 10, y: 100 },
      { x: 12, y: 115 },
      { x: 15, y: 130 },
      { x: 18, y: 145 },
      { x: 20, y: 160 },
      { x: 14, y: 125 },
      { x: 16, y: 135 },
      { x: 11, y: 110 },
      { x: 19, y: 155 },
    ],
    xLabel: 'Advertising ($1000)',
    yLabel: 'Revenue ($1000)',
    predictX: 15,
  },
];
