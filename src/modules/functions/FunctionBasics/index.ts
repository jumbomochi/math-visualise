/**
 * FunctionBasics Module
 *
 * Module definition and self-registration.
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { MathState } from '@/core/types/MathState';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import FunctionBasics from './FunctionBasics';
import { FunctionBasicsState } from './types';

const functionBasicsModule: VisualizationModule = {
  id: 'functions.basics',

  name: 'Function Basics',
  description:
    'Explore domain, range, composite functions, and inverse functions with interactive visualizations.',

  syllabusRef: {
    strand: 'pure-math-functions',
    topic: 'functions-basics',
    subtopic: 'domain-range-composite-inverse',
  },

  engine: 'svg',

  Component: FunctionBasics,

  getInitialState: (): FunctionBasicsState => ({
    topicId: 'functions.basics',

    parameters: {
      mainTab: 'domain-range',
      functionF: 'quadratic',
      functionG: 'linear',
      domainMin: -2,
      domainMax: 3,
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
    const params = state.parameters as FunctionBasicsState['parameters'];

    if (params.domainMin >= params.domainMax) {
      errors.push('Domain minimum must be less than maximum');
    }

    if (params.domainMin < -10 || params.domainMax > 10) {
      errors.push('Domain must be within [-10, 10]');
    }

    return errors;
  },

  metadata: {
    version: '1.0.0',
    author: 'H2 Math Visualizer',
    tags: ['functions', 'domain', 'range', 'composite', 'inverse', 'graphs'],
    difficulty: 'basic',
    prerequisites: [],
    estimatedTime: 15,
    learningObjectives: [
      'Determine domain and range of functions',
      'Understand the effect of domain restrictions on range',
      'Compose functions f(g(x))',
      'Find inverse functions graphically',
      'Understand the horizontal line test for invertibility',
    ],
  },
};

moduleRegistry.register(functionBasicsModule);

export default functionBasicsModule;
