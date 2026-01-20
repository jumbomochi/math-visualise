/**
 * GraphingCalculator Module
 *
 * Module definition and self-registration.
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { MathState } from '@/core/types/MathState';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import GraphingCalculator from './GraphingCalculator';
import { GraphingCalculatorState } from './types';

interface GraphingCalculatorMathState extends MathState {
  parameters: GraphingCalculatorState;
}

const graphingCalculatorModule: VisualizationModule = {
  id: 'functions.graphing-calculator',

  name: 'Graphing Calculator',
  description:
    'Interactive graphing calculator for visualizing mathematical functions. Plot multiple functions simultaneously with adjustable viewing windows.',

  syllabusRef: {
    strand: 'pure-math-functions',
    topic: 'functions-basics',
    subtopic: 'graphing-calculator',
  },

  engine: 'canvas',

  Component: GraphingCalculator,

  getInitialState: (): GraphingCalculatorMathState => ({
    topicId: 'functions.graphing-calculator',

    parameters: {
      functions: [
        { id: '1', expression: '', color: '#2563eb', visible: true },
      ],
      window: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
      angleMode: 'RAD',
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
    const params = (state as GraphingCalculatorMathState).parameters;

    if (params.window.xMin >= params.window.xMax) {
      errors.push('X minimum must be less than X maximum');
    }

    if (params.window.yMin >= params.window.yMax) {
      errors.push('Y minimum must be less than Y maximum');
    }

    return errors;
  },

  metadata: {
    version: '1.0.0',
    author: 'H2 Math Visualizer',
    tags: ['graphing', 'calculator', 'functions', 'plotting', 'visualization'],
    difficulty: 'basic',
    prerequisites: [],
    estimatedTime: 10,
    learningObjectives: [
      'Plot mathematical functions graphically',
      'Compare multiple functions visually',
      'Understand function behavior through visualization',
      'Explore trigonometric, polynomial, exponential, and logarithmic functions',
    ],
  },
};

moduleRegistry.register(graphingCalculatorModule);

export default graphingCalculatorModule;
