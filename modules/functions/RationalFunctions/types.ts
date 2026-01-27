/**
 * RationalFunctions Module Types
 */

import { MathState } from '@/lib/core/types/MathState';

export type RationalPreset = 'basic' | 'quadratic-linear' | 'linear-quadratic' | 'custom';

export interface RationalFunctionsState extends MathState {
  parameters: {
    preset: RationalPreset;
    // Numerator: ax + b
    numA: number;
    numB: number;
    // Denominator: cx + d
    denC: number;
    denD: number;
  };
}
