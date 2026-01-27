/**
 * GraphTransformations Module Types
 */

import { MathState } from '@/lib/core/types/MathState';

export type TransformationType = 'translate' | 'scale' | 'reflect';
export type FunctionId = 'quadratic' | 'sqrt' | 'reciprocal' | 'abs' | 'sin' | 'cos' | 'exp';

export interface GraphTransformationsState extends MathState {
  parameters: {
    transformType: TransformationType;
    baseFunction: FunctionId;
    translateX: number;
    translateY: number;
    scaleX: number;
    scaleY: number;
    reflectX: boolean;
    reflectY: boolean;
  };
}

export interface ControlPanelProps {
  transformType: TransformationType;
  baseFunction: FunctionId;
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
  reflectX: boolean;
  reflectY: boolean;
  onTransformTypeChange: (type: TransformationType) => void;
  onBaseFunctionChange: (fn: FunctionId) => void;
  onTranslateXChange: (value: number) => void;
  onTranslateYChange: (value: number) => void;
  onScaleXChange: (value: number) => void;
  onScaleYChange: (value: number) => void;
  onReflectXChange: (value: boolean) => void;
  onReflectYChange: (value: boolean) => void;
}
