/**
 * Differentiation Module Types
 */

import { MathState } from '@/lib/core/types/MathState';

export type MainTab = 'derivative' | 'tangent' | 'curve-sketch';
export type FunctionId = 'quadratic' | 'cubic' | 'sin' | 'cos' | 'exp' | 'ln' | 'polynomial';

export interface DifferentiationState extends MathState {
  parameters: {
    mainTab: MainTab;
    functionId: FunctionId;
    tangentX: number;
    // For polynomial: ax³ + bx² + cx + d
    coeffA: number;
    coeffB: number;
    coeffC: number;
    coeffD: number;
  };
}
