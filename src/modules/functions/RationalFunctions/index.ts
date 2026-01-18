/**
 * RationalFunctions Module
 *
 * Module definition and self-registration.
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { MathState } from '@/core/types/MathState';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import RationalFunctions from './RationalFunctions';
import { RationalFunctionsState } from './types';

const rationalFunctionsModule: VisualizationModule = {
  id: 'functions.rational',

  name: 'Rational Functions',
  description:
    'Explore rational functions, vertical and horizontal asymptotes, and key graph features.',

  syllabusRef: {
    strand: 'pure-math-functions',
    topic: 'graphs-rational',
    subtopic: 'asymptotes-intercepts',
  },

  engine: 'svg',

  Component: RationalFunctions,

  getInitialState: (): RationalFunctionsState => ({
    topicId: 'functions.rational',

    parameters: {
      preset: 'basic',
      numA: 1,
      numB: 0,
      denC: 1,
      denD: 0,
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
    const params = state.parameters as RationalFunctionsState['parameters'];

    if (params.denC === 0 && params.denD === 0) {
      errors.push('Denominator cannot be zero');
    }

    return errors;
  },

  metadata: {
    version: '1.0.0',
    author: 'H2 Math Visualizer',
    tags: ['functions', 'rational', 'asymptotes', 'graphs'],
    difficulty: 'intermediate',
    prerequisites: ['functions.basics'],
    estimatedTime: 15,
    learningObjectives: [
      'Identify vertical asymptotes from denominator roots',
      'Determine horizontal asymptotes from degree comparison',
      'Find x-intercepts and y-intercepts',
      'Sketch rational function graphs',
      'Understand behavior near asymptotes',
    ],
  },
};

moduleRegistry.register(rationalFunctionsModule);

export default rationalFunctionsModule;
