/**
 * 2D Vectors Module Types
 */

import { MathState } from '@/lib/core/types';
import { Vector2D } from '@/lib/math/vectors/types';

export type MainTab = 'operations' | 'dotProduct';
export type OperationSubTab = 'add' | 'subtract' | 'scalar';

export interface Vectors2DState extends MathState {
  topicId: 'vectors.2d-vectors';
  parameters: {
    mainTab: MainTab;
    operationTab: OperationSubTab;
    vectorA: Vector2D;
    vectorB: Vector2D;
    scalar: number;
  };
  inputs: Record<string, unknown>;
  computed: Record<string, unknown>;
}

export interface Canvas2DProps {
  width?: number;
  height?: number;
  range?: number;
  children: React.ReactNode;
}

export interface VectorArrow2DProps {
  start: Vector2D;
  end: Vector2D;
  color: string;
  label?: string;
  dashed?: boolean;
  strokeWidth?: number;
}

export interface OperationsViewProps {
  operation: OperationSubTab;
  vectorA: Vector2D;
  vectorB: Vector2D;
  scalar: number;
  result: Vector2D;
}

export interface DotProductViewProps {
  vectorA: Vector2D;
  vectorB: Vector2D;
  projection: Vector2D;
  angle: number;
}
