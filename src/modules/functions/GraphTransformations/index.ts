/**
 * GraphTransformations Module
 *
 * Module definition and self-registration.
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { MathState } from '@/core/types/MathState';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import GraphTransformations from './GraphTransformations';
import { GraphTransformationsState } from './types';

const graphTransformationsModule: VisualizationModule = {
  id: 'functions.transformations',

  name: 'Graph Transformations',
  description:
    'Visualize how translations, scaling, and reflections transform function graphs.',

  syllabusRef: {
    strand: 'pure-math-functions',
    topic: 'graphs-transformations',
    subtopic: 'translate-scale-reflect',
  },

  engine: 'svg',

  Component: GraphTransformations,

  getInitialState: (): GraphTransformationsState => ({
    topicId: 'functions.transformations',

    parameters: {
      transformType: 'translate',
      baseFunction: 'quadratic',
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      reflectX: false,
      reflectY: false,
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
    const params = state.parameters as GraphTransformationsState['parameters'];

    if (params.scaleX <= 0) {
      errors.push('Horizontal scale must be positive');
    }
    if (params.scaleY <= 0) {
      errors.push('Vertical scale must be positive');
    }

    return errors;
  },

  metadata: {
    version: '1.0.0',
    author: 'H2 Math Visualizer',
    tags: ['functions', 'transformations', 'graphs', 'translate', 'scale', 'reflect'],
    difficulty: 'basic',
    prerequisites: [],
    estimatedTime: 15,
    learningObjectives: [
      'Apply horizontal and vertical translations',
      'Apply horizontal and vertical scaling',
      'Reflect graphs in the x-axis and y-axis',
      'Combine multiple transformations',
      'Write the equation of a transformed function',
    ],
  },
};

moduleRegistry.register(graphTransformationsModule);

export default graphTransformationsModule;
