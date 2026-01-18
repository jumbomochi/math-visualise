/**
 * TI-84 Calculator Engine
 * Handles mathematical evaluation and function parsing
 */

/**
 * Evaluate a mathematical expression
 */
export function evaluateExpression(expr: string, angleMode: 'DEG' | 'RAD' = 'DEG'): number {
  try {
    // Replace calculator syntax with JavaScript syntax
    let jsExpr = expr
      .replace(/π/g, 'Math.PI')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\^/g, '**')
      .replace(/√\(/g, 'Math.sqrt(')
      // Trig functions
      .replace(/sin\(/g, angleMode === 'DEG' ? 'Math.sin(Math.PI/180*' : 'Math.sin(')
      .replace(/cos\(/g, angleMode === 'DEG' ? 'Math.cos(Math.PI/180*' : 'Math.cos(')
      .replace(/tan\(/g, angleMode === 'DEG' ? 'Math.tan(Math.PI/180*' : 'Math.tan(')
      // Inverse trig
      .replace(/sin⁻¹\(/g, angleMode === 'DEG' ? '(180/Math.PI*Math.asin(' : 'Math.asin(')
      .replace(/cos⁻¹\(/g, angleMode === 'DEG' ? '(180/Math.PI*Math.acos(' : 'Math.acos(')
      .replace(/tan⁻¹\(/g, angleMode === 'DEG' ? '(180/Math.PI*Math.atan(' : 'Math.atan(')
      // Log functions
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      // Constants
      .replace(/e(?![a-z])/gi, 'Math.E');

    // Add closing parentheses for trig functions if needed
    if (angleMode === 'DEG' && (expr.includes('sin') || expr.includes('cos') || expr.includes('tan'))) {
      const opens = (jsExpr.match(/\(/g) || []).length;
      const closes = (jsExpr.match(/\)/g) || []).length;
      if (opens > closes) {
        jsExpr += ')'.repeat(opens - closes);
      }
    }

    // Evaluate using Function constructor (safer than eval)
    const result = new Function('return ' + jsExpr)();

    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      return result;
    }
    throw new Error('Invalid result');
  } catch (error) {
    throw new Error('SYNTAX ERROR');
  }
}

/**
 * Evaluate a function at a given x value
 */
export function evaluateFunction(funcExpr: string, x: number, angleMode: 'DEG' | 'RAD' = 'DEG'): number {
  // Replace X with the actual value
  const expr = funcExpr.replace(/X/g, `(${x})`);
  return evaluateExpression(expr, angleMode);
}

/**
 * Parse and validate a function expression
 */
export function parseFunction(expr: string): string {
  // Basic validation - ensure it has valid characters
  const validChars = /^[0-9X+\-*/^().,\s√πsincotan⁻¹loge]+$/i;
  if (!validChars.test(expr)) {
    throw new Error('INVALID FUNCTION');
  }
  return expr;
}

/**
 * Generate points for graphing a function
 */
export function generateGraphPoints(
  funcExpr: string,
  xMin: number,
  xMax: number,
  numPoints: number = 200,
  angleMode: 'DEG' | 'RAD' = 'DEG'
): Array<{ x: number; y: number } | null> {
  if (!funcExpr || funcExpr.trim() === '') {
    return [];
  }

  const points: Array<{ x: number; y: number } | null> = [];
  const step = (xMax - xMin) / numPoints;

  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * step;
    try {
      const y = evaluateFunction(funcExpr, x, angleMode);
      if (isFinite(y) && !isNaN(y)) {
        points.push({ x, y });
      } else {
        points.push(null); // Discontinuity
      }
    } catch {
      points.push(null); // Error at this point
    }
  }

  return points;
}

/**
 * Format a number for display (like TI-84)
 */
export function formatNumber(num: number, maxDigits: number = 10): string {
  if (!isFinite(num)) {
    return 'ERROR';
  }

  // Scientific notation for very large/small numbers
  if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-3 && num !== 0)) {
    return num.toExponential(maxDigits - 5);
  }

  // Round to avoid floating point errors
  const rounded = Math.round(num * 1e10) / 1e10;

  // Convert to string and limit length
  let str = rounded.toString();
  if (str.length > maxDigits) {
    str = rounded.toPrecision(maxDigits);
  }

  return str;
}
