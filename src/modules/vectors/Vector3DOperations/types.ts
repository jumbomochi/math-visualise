/**
 * Vector 3D Operations Types
 *
 * Type definitions for the 3D vector operations module.
 */

import { MathState, Vector3D } from '@/core/types';

export type VectorOperation = 'addition' | 'subtraction' | 'scalar';

export interface Vector3DOperationsState extends MathState {
  topicId: 'vectors.3d-operations';
  parameters: {
    operation: VectorOperation;
    vectorA: Vector3D;
    vectorB: Vector3D;
    scalar: number;
  };
  inputs: {
    activeTab: VectorOperation;
  };
  computed: {
    result: Vector3D;
    formulaLatex: string;
  };
}

export interface VectorArrowProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  label?: string;
  dashed?: boolean;
  lineWidth?: number;
}

export interface ControlPanelProps {
  operation: VectorOperation;
  vectorA: Vector3D;
  vectorB: Vector3D;
  scalar: number;
  onOperationChange: (op: VectorOperation) => void;
  onVectorAChange: (v: Vector3D) => void;
  onVectorBChange: (v: Vector3D) => void;
  onScalarChange: (k: number) => void;
}

export interface Scene3DProps {
  operation: VectorOperation;
  vectorA: Vector3D;
  vectorB: Vector3D;
  scalar: number;
  result: Vector3D;
}
