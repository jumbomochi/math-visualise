/**
 * Lines & Planes Module Types
 */

import { MathState, Vector3D } from '@/lib/core/types';

export type LinesPlanesTab = 'line' | 'plane' | 'intersection' | 'distance';

export interface LinesPlanesState extends MathState {
  topicId: 'vectors.lines-planes';
  parameters: {
    activeTab: LinesPlanesTab;
    // Line parameters
    linePoint: Vector3D;
    lineDirection: Vector3D;
    // Plane parameters
    planePoint: Vector3D;
    planeNormal: Vector3D;
    // Distance tab - extra point
    distancePoint: Vector3D;
  };
  inputs: Record<string, unknown>;
  computed: Record<string, unknown>;
}

export interface InfiniteLineProps {
  point: Vector3D;
  direction: Vector3D;
  color?: string;
  lineWidth?: number;
  range?: number;
}

export interface PlaneGridProps {
  point: Vector3D;
  normal: Vector3D;
  color?: string;
  opacity?: number;
  size?: number;
}

export interface LineSceneProps {
  point: Vector3D;
  direction: Vector3D;
}

export interface PlaneSceneProps {
  point: Vector3D;
  normal: Vector3D;
}

export interface IntersectionSceneProps {
  linePoint: Vector3D;
  lineDirection: Vector3D;
  planePoint: Vector3D;
  planeNormal: Vector3D;
}

export interface DistanceSceneProps {
  point: Vector3D;
  planePoint: Vector3D;
  planeNormal: Vector3D;
}
