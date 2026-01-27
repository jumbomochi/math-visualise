/**
 * Dot & Cross Product Module Types
 */

import { MathState, Vector3D } from '@/lib/core/types';

export type ProductOperation = 'dot' | 'cross';

export interface DotCrossProductState extends MathState {
  topicId: 'vectors.dot-cross-product';
  parameters: {
    operation: ProductOperation;
    vectorA: Vector3D;
    vectorB: Vector3D;
  };
  inputs: {
    activeTab: ProductOperation;
  };
  computed: {
    dotResult: number;
    crossResult: Vector3D;
    angle: number;
    magnitudeA: number;
    magnitudeB: number;
  };
}

export interface DotProductSceneProps {
  vectorA: Vector3D;
  vectorB: Vector3D;
  projection: Vector3D;
}

export interface CrossProductSceneProps {
  vectorA: Vector3D;
  vectorB: Vector3D;
  crossResult: Vector3D;
}

export interface AngleArcProps {
  vectorA: Vector3D;
  vectorB: Vector3D;
  radius?: number;
  color?: string;
}

export interface ParallelogramProps {
  vectorA: Vector3D;
  vectorB: Vector3D;
  color?: string;
  opacity?: number;
}
