/**
 * ComplexArithmetic Module Types
 *
 * Type definitions for the complex arithmetic visualization module.
 */

import { MathState } from '@/lib/core/types/MathState';
import { Complex } from '@/lib/math/complex/types';

/**
 * Main tab options
 */
export type MainTab = 'arithmetic' | 'polar';

/**
 * Arithmetic operation options
 */
export type ArithmeticOperation = 'add' | 'subtract' | 'multiply' | 'divide';

/**
 * Module state
 */
export interface ComplexArithmeticState extends MathState {
  parameters: {
    mainTab: MainTab;
    operation: ArithmeticOperation;
    z1: Complex;
    z2: Complex;
  };
}

/**
 * Props for ArgandCanvas
 */
export interface ArgandCanvasProps {
  width?: number;
  height?: number;
  range?: number;
  children: React.ReactNode;
}

/**
 * Props for ComplexPoint
 */
export interface ComplexPointProps {
  z: Complex;
  color: string;
  label?: string;
  showVector?: boolean;
  dashed?: boolean;
}

/**
 * Props for ArithmeticView
 */
export interface ArithmeticViewProps {
  z1: Complex;
  z2: Complex;
  operation: ArithmeticOperation;
  result: Complex;
}

/**
 * Props for PolarView
 */
export interface PolarViewProps {
  z: Complex;
}

/**
 * Props for ControlPanel
 */
export interface ControlPanelProps {
  mainTab: MainTab;
  operation: ArithmeticOperation;
  z1: Complex;
  z2: Complex;
  onMainTabChange: (tab: MainTab) => void;
  onOperationChange: (op: ArithmeticOperation) => void;
  onZ1Change: (z: Complex) => void;
  onZ2Change: (z: Complex) => void;
}
