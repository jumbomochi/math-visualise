/**
 * Differentiation Module
 *
 * Module definition and self-registration.
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { MathState } from '@/core/types/MathState';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import Differentiation from './Differentiation';
import { DifferentiationState } from './types';

const differentiationModule: VisualizationModule = {
  id: 'calculus.differentiation',

  name: 'Differentiation',
  description:
    'Visualize derivatives, tangent/normal lines, and curve analysis with critical points.',

  syllabusRef: {
    strand: 'pure-math-calculus',
    topic: 'differentiation',
    subtopic: 'derivatives-tangents-curve-sketching',
  },

  engine: 'svg',

  Component: Differentiation,

  getInitialState: (): DifferentiationState => ({
    topicId: 'calculus.differentiation',

    parameters: {
      mainTab: 'derivative',
      functionId: 'quadratic',
      tangentX: 1,
      coeffA: 1,
      coeffB: 0,
      coeffC: -3,
      coeffD: 0,
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
    const params = state.parameters as DifferentiationState['parameters'];

    if (params.tangentX < -10 || params.tangentX > 10) {
      errors.push('Tangent x-value must be within [-10, 10]');
    }

    return errors;
  },

  metadata: {
    version: '1.0.0',
    author: 'H2 Math Visualizer',
    tags: ['calculus', 'differentiation', 'derivative', 'tangent', 'normal', 'curve-sketching'],
    difficulty: 'intermediate',
    prerequisites: ['functions.basics'],
    estimatedTime: 20,
    learningObjectives: [
      'Understand the derivative as rate of change',
      'Find equations of tangent and normal lines',
      'Identify maxima, minima, and inflection points',
      'Apply differentiation rules',
      'Sketch curves using calculus techniques',
    ],
  },
};

moduleRegistry.register(differentiationModule);

export default differentiationModule;
