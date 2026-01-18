/**
 * Integration Module
 *
 * Module definition and self-registration.
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { MathState } from '@/core/types/MathState';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import Integration from './Integration';
import { IntegrationState } from './types';

const integrationModule: VisualizationModule = {
  id: 'calculus.integration',

  name: 'Integration',
  description:
    'Visualize Riemann sums, definite integrals, and volumes of revolution.',

  syllabusRef: {
    strand: 'pure-math-calculus',
    topic: 'integration',
    subtopic: 'area-volume',
  },

  engine: 'svg',

  Component: Integration,

  getInitialState: (): IntegrationState => ({
    topicId: 'calculus.integration',

    parameters: {
      mainTab: 'riemann',
      functionId: 'quadratic',
      lowerBound: 0,
      upperBound: 2,
      numRectangles: 5,
      riemannType: 'left',
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
    const params = state.parameters as IntegrationState['parameters'];

    if (params.lowerBound >= params.upperBound) {
      errors.push('Lower bound must be less than upper bound');
    }

    if (params.numRectangles < 1 || params.numRectangles > 50) {
      errors.push('Number of rectangles must be between 1 and 50');
    }

    return errors;
  },

  metadata: {
    version: '1.0.0',
    author: 'H2 Math Visualizer',
    tags: ['calculus', 'integration', 'riemann', 'area', 'volume', 'revolution'],
    difficulty: 'intermediate',
    prerequisites: ['calculus.differentiation'],
    estimatedTime: 20,
    learningObjectives: [
      'Understand Riemann sums as approximations',
      'Calculate definite integrals',
      'Find area under curves',
      'Compute volumes of revolution using disk method',
      'Apply integration techniques',
    ],
  },
};

moduleRegistry.register(integrationModule);

export default integrationModule;
