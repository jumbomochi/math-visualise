/**
 * Calculus Types
 *
 * Type definitions for calculus operations and visualizations.
 */

/**
 * A mathematical function
 */
export type MathFunction = (x: number) => number;

/**
 * Point on a curve
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Tangent line information
 */
export interface TangentLine {
  point: Point;
  slope: number;
  yIntercept: number;
}

/**
 * Normal line information
 */
export interface NormalLine {
  point: Point;
  slope: number;
  yIntercept: number;
}

/**
 * Critical point (maxima, minima, inflection)
 */
export interface CriticalPoint {
  x: number;
  y: number;
  type: 'maximum' | 'minimum' | 'inflection' | 'stationary';
}

/**
 * Definite integral result
 */
export interface IntegralResult {
  value: number;
  lowerBound: number;
  upperBound: number;
}

/**
 * Riemann sum approximation
 */
export interface RiemannSum {
  value: number;
  rectangles: Rectangle[];
  type: 'left' | 'right' | 'midpoint';
}

/**
 * Rectangle for Riemann sum
 */
export interface Rectangle {
  x: number;
  width: number;
  height: number;
}

/**
 * Volume of revolution result
 */
export interface VolumeResult {
  volume: number;
  axis: 'x' | 'y';
  method: 'disk' | 'shell';
}

/**
 * Differential equation solution
 */
export interface DEsolution {
  points: Point[];
  constant: number;
}

/**
 * Slope field arrow
 */
export interface SlopeArrow {
  x: number;
  y: number;
  slope: number;
}
