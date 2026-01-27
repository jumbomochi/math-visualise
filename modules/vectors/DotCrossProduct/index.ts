/**
 * Dot & Cross Product Module
 *
 * Module definition and self-registration.
 */

import { VisualizationModule } from '@/lib/core/types/VisualizationModule';
import { MathState } from '@/lib/core/types/MathState';
import { moduleRegistry } from '@/lib/core/registry/ModuleRegistry';
import DotCrossProduct from './DotCrossProduct';
import { DotCrossProductState } from './types';

const dotCrossProductModule: VisualizationModule = {
  id: 'vectors.dot-cross-product',

  name: 'Dot & Cross Product',
  description:
    'Visualize dot product (scalar result with projection) and cross product (vector result with parallelogram area) in 3D.',

  syllabusRef: {
    strand: 'pure-math-vectors',
    topic: 'dot-cross-product',
    subtopic: 'products',
  },

  engine: 'three',

  Component: DotCrossProduct,

  getInitialState: (): DotCrossProductState => ({
    topicId: 'vectors.dot-cross-product',

    parameters: {
      operation: 'dot',
      vectorA: { x: 2, y: 3, z: 1 },
      vectorB: { x: 1, y: 2, z: 0 },
    },

    inputs: {
      activeTab: 'dot',
    },

    computed: {
      dotResult: 8,
      crossResult: { x: -2, y: 1, z: 1 },
      angle: 32.5,
      magnitudeA: 3.74,
      magnitudeB: 2.24,
    },

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
    const params = state.parameters as DotCrossProductState['parameters'];

    const validateVector = (v: { x: number; y: number; z: number }, name: string) => {
      if (Math.abs(v.x) > 5 || Math.abs(v.y) > 5 || Math.abs(v.z) > 5) {
        errors.push(`${name} components must be between -5 and 5`);
      }
    };

    if (params.vectorA) validateVector(params.vectorA, 'Vector A');
    if (params.vectorB) validateVector(params.vectorB, 'Vector B');

    return errors;
  },

  metadata: {
    version: '1.0.0',
    author: 'H2 Math Visualizer',
    tags: ['vectors', '3d', 'dot-product', 'cross-product', 'scalar-product', 'vector-product'],
    difficulty: 'intermediate',
    prerequisites: ['vectors.3d-operations'],
    estimatedTime: 20,
    learningObjectives: [
      'Calculate dot product using component formula',
      'Understand dot product as projection and angle measure',
      'Calculate cross product using determinant formula',
      'Visualize cross product as area of parallelogram',
      'Identify perpendicular vectors (dot product = 0)',
      'Identify parallel vectors (cross product = 0)',
    ],
  },
};

moduleRegistry.register(dotCrossProductModule);

export default dotCrossProductModule;
