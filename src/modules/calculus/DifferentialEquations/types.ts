/**
 * DifferentialEquations Module Types
 */

import { MathState } from '@/core/types/MathState';

export type DEType = 'slope-field' | 'separable' | 'linear';
export type PresetDE = 'exponential' | 'logistic' | 'harmonic' | 'custom';

export interface DifferentialEquationsState extends MathState {
  parameters: {
    preset: PresetDE;
    initialX: number;
    initialY: number;
    showSlopeField: boolean;
    showSolution: boolean;
  };
}
