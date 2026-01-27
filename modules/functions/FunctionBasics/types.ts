/**
 * FunctionBasics Module Types
 *
 * Type definitions for the function basics visualization module.
 */

import { MathState } from '@/lib/core/types/MathState';

/**
 * Main tab options
 */
export type MainTab = 'domain-range' | 'composite' | 'inverse';

/**
 * Available base functions
 */
export type FunctionId = 'linear' | 'quadratic' | 'sqrt' | 'reciprocal' | 'abs' | 'exp' | 'ln' | 'sin' | 'cos';

/**
 * Module state
 */
export interface FunctionBasicsState extends MathState {
  parameters: {
    mainTab: MainTab;
    functionF: FunctionId;
    functionG: FunctionId;
    domainMin: number;
    domainMax: number;
  };
}

/**
 * Props for GraphCanvas
 */
export interface GraphCanvasProps {
  width?: number;
  height?: number;
  xRange?: [number, number];
  yRange?: [number, number];
  children: React.ReactNode;
}

/**
 * Props for FunctionCurve
 */
export interface FunctionCurveProps {
  fn: (x: number) => number;
  xMin: number;
  xMax: number;
  color: string;
  dashed?: boolean;
  label?: string;
}

/**
 * Props for DomainRangeView
 */
export interface DomainRangeViewProps {
  functionId: FunctionId;
  domainMin: number;
  domainMax: number;
}

/**
 * Props for CompositeView
 */
export interface CompositeViewProps {
  functionF: FunctionId;
  functionG: FunctionId;
}

/**
 * Props for InverseView
 */
export interface InverseViewProps {
  functionId: FunctionId;
}

/**
 * Props for ControlPanel
 */
export interface ControlPanelProps {
  mainTab: MainTab;
  functionF: FunctionId;
  functionG: FunctionId;
  domainMin: number;
  domainMax: number;
  onMainTabChange: (tab: MainTab) => void;
  onFunctionFChange: (fn: FunctionId) => void;
  onFunctionGChange: (fn: FunctionId) => void;
  onDomainChange: (min: number, max: number) => void;
}
