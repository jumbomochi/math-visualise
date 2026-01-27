/**
 * Lines & Planes Module
 *
 * Module definition and self-registration.
 */

import { VisualizationModule } from '@/lib/core/types/VisualizationModule';
import { MathState } from '@/lib/core/types/MathState';
import { moduleRegistry } from '@/lib/core/registry/ModuleRegistry';
import LinesPlanes from './LinesPlanes';
import { LinesPlanesState } from './types';

const linesPlanesModule: VisualizationModule = {
  id: 'vectors.lines-planes',

  name: 'Lines & Planes',
  description:
    'Visualize vector equations of lines and planes in 3D, their intersections, and point-to-plane distances.',

  syllabusRef: {
    strand: 'pure-math-vectors',
    topic: 'lines-planes',
    subtopic: '3d-geometry',
  },

  engine: 'three',

  Component: LinesPlanes,

  getInitialState: (): LinesPlanesState => ({
    topicId: 'vectors.lines-planes',

    parameters: {
      activeTab: 'line',
      linePoint: { x: 1, y: 2, z: 0 },
      lineDirection: { x: 2, y: 1, z: 1 },
      planePoint: { x: 0, y: 0, z: 2 },
      planeNormal: { x: 0, y: 0, z: 1 },
      distancePoint: { x: 2, y: 3, z: 5 },
    },

    inputs: {},

    computed: {},

    visualization: {
      showGrid: true,
      showAxes: true,
      showLabels: true,
      colorScheme: 'default',
      scale: 1,
    },
  }),

  validateState: (state: MathState): string[] => {
    const errors: string[] = [];
    const params = state.parameters as LinesPlanesState['parameters'];

    const validateVector = (v: { x: number; y: number; z: number }, name: string) => {
      if (Math.abs(v.x) > 5 || Math.abs(v.y) > 5 || Math.abs(v.z) > 5) {
        errors.push(`${name} components must be between -5 and 5`);
      }
    };

    if (params.linePoint) validateVector(params.linePoint, 'Line point');
    if (params.lineDirection) validateVector(params.lineDirection, 'Line direction');
    if (params.planePoint) validateVector(params.planePoint, 'Plane point');
    if (params.planeNormal) validateVector(params.planeNormal, 'Plane normal');
    if (params.distancePoint) validateVector(params.distancePoint, 'Distance point');

    return errors;
  },

  metadata: {
    version: '1.0.0',
    author: 'H2 Math Visualizer',
    tags: ['vectors', '3d', 'lines', 'planes', 'intersection', 'distance', 'geometry'],
    difficulty: 'intermediate',
    prerequisites: ['vectors.3d-operations', 'vectors.dot-cross-product'],
    estimatedTime: 25,
    learningObjectives: [
      'Write vector equation of a line given point and direction',
      'Write vector equation of a plane given point and normal',
      'Convert between vector and Cartesian forms of plane equation',
      'Find intersection point of line and plane',
      'Determine when line is parallel to plane',
      'Calculate perpendicular distance from point to plane',
    ],
  },
};

moduleRegistry.register(linesPlanesModule);

export default linesPlanesModule;
