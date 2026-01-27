/**
 * Math Engine for Graphing Calculator
 *
 * Handles mathematical expression parsing and evaluation.
 */

/**
 * Evaluate a mathematical expression
 */
export function evaluateExpression(expr: string, angleMode: 'DEG' | 'RAD' = 'RAD'): number {
  try {
    // Normalize the expression
    let jsExpr = expr
      .replace(/\s+/g, '')
      // Constants
      .replace(/pi/gi, 'Math.PI')
      .replace(/\be\b/gi, 'Math.E')
      // Operators
      .replace(/\^/g, '**')
      // Functions
      .replace(/sqrt\(/gi, 'Math.sqrt(')
      .replace(/abs\(/gi, 'Math.abs(')
      .replace(/log\(/gi, 'Math.log10(')
      .replace(/ln\(/gi, 'Math.log(')
      .replace(/exp\(/gi, 'Math.exp(');

    // Handle trig functions with angle mode
    if (angleMode === 'DEG') {
      jsExpr = jsExpr
        .replace(/sin\(/gi, 'Math.sin(Math.PI/180*(')
        .replace(/cos\(/gi, 'Math.cos(Math.PI/180*(')
        .replace(/tan\(/gi, 'Math.tan(Math.PI/180*(')
        .replace(/asin\(/gi, '(180/Math.PI)*Math.asin(')
        .replace(/acos\(/gi, '(180/Math.PI)*Math.acos(')
        .replace(/atan\(/gi, '(180/Math.PI)*Math.atan(');
    } else {
      jsExpr = jsExpr
        .replace(/sin\(/gi, 'Math.sin(')
        .replace(/cos\(/gi, 'Math.cos(')
        .replace(/tan\(/gi, 'Math.tan(')
        .replace(/asin\(/gi, 'Math.asin(')
        .replace(/acos\(/gi, 'Math.acos(')
        .replace(/atan\(/gi, 'Math.atan(');
    }

    // Balance parentheses for DEG mode trig functions
    if (angleMode === 'DEG') {
      const opens = (jsExpr.match(/\(/g) || []).length;
      const closes = (jsExpr.match(/\)/g) || []).length;
      if (opens > closes) {
        jsExpr += ')'.repeat(opens - closes);
      }
    }

    // Evaluate using Function constructor
    const result = new Function('return ' + jsExpr)();

    if (typeof result === 'number' && !isNaN(result)) {
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
export function evaluateFunction(
  funcExpr: string,
  x: number,
  angleMode: 'DEG' | 'RAD' = 'RAD'
): number {
  // Replace X (case-insensitive) with the actual value
  const expr = funcExpr.replace(/X/gi, `(${x})`);
  return evaluateExpression(expr, angleMode);
}

/**
 * Validate a function expression
 */
export function validateExpression(expr: string): { valid: boolean; error?: string } {
  if (!expr.trim()) {
    return { valid: true }; // Empty is valid (no function)
  }

  // Check for valid characters
  const validPattern = /^[0-9X+\-*/^().sincostaqlgexp\s]+$/i;
  if (!validPattern.test(expr)) {
    return { valid: false, error: 'Invalid characters in expression' };
  }

  // Try to evaluate at x=1 to check syntax
  try {
    evaluateFunction(expr, 1, 'RAD');
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid expression syntax' };
  }
}
