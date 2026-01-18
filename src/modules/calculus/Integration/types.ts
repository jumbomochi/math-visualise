/**
 * Integration Module Types
 */

import { MathState } from '@/core/types/MathState';

export type MainTab = 'riemann' | 'area' | 'volume';
export type RiemannType = 'left' | 'right' | 'midpoint';
export type FunctionId = 'quadratic' | 'sqrt' | 'sin' | 'exp' | 'linear';

export interface IntegrationState extends MathState {
  parameters: {
    mainTab: MainTab;
    functionId: FunctionId;
    lowerBound: number;
    upperBound: number;
    numRectangles: number;
    riemannType: RiemannType;
  };
}
