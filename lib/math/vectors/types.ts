/**
 * Vector Types
 *
 * Type definitions for vector operations.
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export type VectorOperation = 'addition' | 'subtraction' | 'scalar';

export interface VectorOperationResult {
  result: Vector3D;
  formula: string;
  formulaLatex: string;
}

export interface Vector2DOperationResult {
  result: Vector2D;
  formula: string;
  formulaLatex: string;
}
