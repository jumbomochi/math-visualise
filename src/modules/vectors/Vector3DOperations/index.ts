/**
 * Vector 3D Operations Module
 *
 * Module definition and self-registration for 3D vector operations visualization.
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { MathState } from '@/core/types/MathState';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import Vector3DOperations from './Vector3DOperations';
import { Vector3DOperationsState } from './types';

/**
 * 3D Vector Operations Module Definition
 */
const vector3DOperationsModule: VisualizationModule = {
  id: 'vectors.3d-operations',

  name: '3D Vector Operations',
  description:
    'Visualize vector addition, subtraction, and scalar multiplication in 3D space with interactive controls.',

  syllabusRef: {
    strand: 'pure-math-vectors',
    topic: '3d-vector-operations',
    subtopic: 'basic-operations',
  },

  engine: 'three',

  Component: Vector3DOperations,

  getInitialState: (): Vector3DOperationsState => ({
    topicId: 'vectors.3d-operations',

    parameters: {
      operation: 'addition',
      vectorA: { x: 2, y: 1, z: 1 },
      vectorB: { x: 1, y: 2, z: -1 },
      scalar: 2,
    },

    inputs: {
      activeTab: 'addition',
    },

    computed: {
      result: { x: 3, y: 3, z: 0 },
      formulaLatex: '',
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
    const params = state.parameters as Vector3DOperationsState['parameters'];

    // Validate vector components are within range
    const validateVector = (v: { x: number; y: number; z: number }, name: string) => {
      if (Math.abs(v.x) > 5 || Math.abs(v.y) > 5 || Math.abs(v.z) > 5) {
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
    tags: ['vectors', '3d', 'addition', 'subtraction', 'scalar-multiplication'],
    difficulty: 'basic',
    prerequisites: [],
    estimatedTime: 15,
    learningObjectives: [
      'Visualize vectors in 3D space',
      'Understand vector addition using the parallelogram law',
      'Understand vector subtraction as adding the negative',
      'Apply scalar multiplication to scale vectors',
      'Calculate resultant vectors from component operations',
    ],
  },
};

// Self-register the module on import
moduleRegistry.register(vector3DOperationsModule);

export default vector3DOperationsModule;
