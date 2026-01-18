/**
 * 2D Vectors Module
 *
 * Module definition and self-registration.
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { MathState } from '@/core/types/MathState';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import Vectors2D from './Vectors2D';
import { Vectors2DState } from './types';

const vectors2DModule: VisualizationModule = {
  id: 'vectors.2d-vectors',

  name: '2D Vectors',
  description:
    'Explore 2D vector operations (addition, subtraction, scalar multiplication) and dot product with interactive visualizations.',

  syllabusRef: {
    strand: 'pure-math-vectors',
    topic: '2d-vectors',
    subtopic: 'operations-and-dot-product',
  },

  engine: 'svg',

  Component: Vectors2D,

  getInitialState: (): Vectors2DState => ({
    topicId: 'vectors.2d-vectors',

    parameters: {
      mainTab: 'operations',
      operationTab: 'add',
      vectorA: { x: 3, y: 2 },
      vectorB: { x: 1, y: 3 },
      scalar: 2,
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
    const params = state.parameters as Vectors2DState['parameters'];

    const validateVector = (v: { x: number; y: number }, name: string) => {
      if (Math.abs(v.x) > 5 || Math.abs(v.y) > 5) {
        errors.push(`${name} components must be between -5 and 5`);
      }
    };

    if (params.vectorA) validateVector(params.vectorA, 'Vector A');
    if (params.vectorB) validateVector(params.vectorB, 'Vector B');

    if (params.scalar !== undefined && (params.scalar < -3 || params.scalar > 3)) {
      errors.push('Scalar must be between -3 and 3');
    }

    return errors;
  },

  metadata: {
    version: '1.0.0',
    author: 'H2 Math Visualizer',
    tags: ['vectors', '2d', 'addition', 'subtraction', 'scalar', 'dot-product'],
    difficulty: 'basic',
    prerequisites: [],
    estimatedTime: 15,
    learningObjectives: [
      'Add and subtract 2D vectors using components',
      'Multiply vectors by scalars',
      'Calculate dot product of 2D vectors',
      'Find angle between vectors using dot product',
      'Understand geometric interpretation of vector operations',
      'Identify perpendicular vectors (dot product = 0)',
    ],
  },
};

moduleRegistry.register(vectors2DModule);

export default vectors2DModule;
