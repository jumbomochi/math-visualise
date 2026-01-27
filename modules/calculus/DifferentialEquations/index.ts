/**
 * DifferentialEquations Module
 *
 * Module definition and self-registration.
 */

import { VisualizationModule } from '@/lib/core/types/VisualizationModule';
import { MathState } from '@/lib/core/types/MathState';
import { moduleRegistry } from '@/lib/core/registry/ModuleRegistry';
import DifferentialEquations from './DifferentialEquations';
import { DifferentialEquationsState } from './types';

const differentialEquationsModule: VisualizationModule = {
  id: 'calculus.differential-equations',

  name: 'Differential Equations',
  description:
    'Visualize slope fields and solution curves for first-order differential equations.',

  syllabusRef: {
    strand: 'pure-math-calculus',
    topic: 'differential-equations',
    subtopic: 'first-order-odes',
  },

  engine: 'svg',

  Component: DifferentialEquations,

  getInitialState: (): DifferentialEquationsState => ({
    topicId: 'calculus.differential-equations',

    parameters: {
      preset: 'exponential',
      initialX: 0,
      initialY: 1,
      showSlopeField: true,
      showSolution: true,
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
    const params = state.parameters as DifferentialEquationsState['parameters'];

    if (Math.abs(params.initialX) > 10 || Math.abs(params.initialY) > 10) {
      errors.push('Initial conditions must be within [-10, 10]');
    }

    return errors;
  },

  metadata: {
    version: '1.0.0',
    author: 'H2 Math Visualizer',
    tags: ['calculus', 'differential-equations', 'ode', 'slope-field', 'initial-value'],
    difficulty: 'advanced',
    prerequisites: ['calculus.differentiation', 'calculus.integration'],
    estimatedTime: 20,
    learningObjectives: [
      'Understand slope fields as direction fields',
      'Interpret solution curves geometrically',
      'Apply initial conditions to find particular solutions',
      'Solve separable differential equations',
      'Model exponential and logistic growth',
    ],
  },
};

moduleRegistry.register(differentialEquationsModule);

export default differentialEquationsModule;
