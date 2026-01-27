/**
 * Functions Types
 *
 * Type definitions for function operations and visualizations.
 */

/**
 * A mathematical function that maps x to y
 */
export type MathFunction = (x: number) => number;

/**
 * Named function with metadata
 */
export interface NamedFunction {
  id: string;
  name: string;
  latex: string;
  fn: MathFunction;
  domain?: Domain;
  range?: Range;
}

/**
 * Domain specification
 */
export interface Domain {
  type: 'all' | 'interval' | 'union' | 'exclude';
  intervals?: Interval[];
  excludePoints?: number[];
}

/**
 * Range specification
 */
export interface Range {
  type: 'all' | 'interval' | 'union';
  intervals?: Interval[];
}

/**
 * Interval (open, closed, or half-open)
 */
export interface Interval {
  min: number;
  max: number;
  minInclusive: boolean;
  maxInclusive: boolean;
}

/**
 * Point on a graph
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Transformation parameters
 */
export interface Transformation {
  type: 'translate-x' | 'translate-y' | 'scale-x' | 'scale-y' | 'reflect-x' | 'reflect-y';
  value: number;
}

/**
 * Asymptote information
 */
export interface Asymptote {
  type: 'vertical' | 'horizontal' | 'oblique';
  value: number; // x-value for vertical, y-value for horizontal
  equation?: string; // For oblique: "y = mx + c"
}

/**
 * Rational function analysis result
 */
export interface RationalAnalysis {
  verticalAsymptotes: number[];
  horizontalAsymptote: number | null;
  xIntercepts: number[];
  yIntercept: number | null;
  holes: Point[];
}

/**
 * Graph plot data
 */
export interface PlotData {
  points: Point[];
  discontinuities: number[];
}
