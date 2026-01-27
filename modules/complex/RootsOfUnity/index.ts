/**
 * RootsOfUnity Module
 *
 * Module definition and self-registration.
 */

import { VisualizationModule } from '@/lib/core/types/VisualizationModule';
import { MathState } from '@/lib/core/types/MathState';
import { moduleRegistry } from '@/lib/core/registry/ModuleRegistry';
import RootsOfUnity from './RootsOfUnity';
import { RootsOfUnityState } from './types';

const rootsOfUnityModule: VisualizationModule = {
  id: 'complex.roots-of-unity',

  name: 'Roots of Unity',
  description:
    'Visualize the nth roots of unity and complex numbers on the Argand diagram.',

  syllabusRef: {
    strand: 'pure-math-complex',
    topic: 'roots-of-unity',
    subtopic: 'nth-roots',
  },

  engine: 'svg',

  Component: RootsOfUnity,

  getInitialState: (): RootsOfUnityState => ({
    topicId: 'complex.roots-of-unity',

    parameters: {
      n: 4,
      baseNumber: { re: 1, im: 0 },
      showUnityRoots: true,
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
    const params = state.parameters as RootsOfUnityState['parameters'];

    if (params.n < 2 || params.n > 12) {
      errors.push('n must be between 2 and 12');
    }

    if (params.baseNumber) {
      if (Math.abs(params.baseNumber.re) > 5 || Math.abs(params.baseNumber.im) > 5) {
        errors.push('Base number components must be between -5 and 5');
      }
    }

    return errors;
  },

  metadata: {
    version: '1.0.0',
    author: 'H2 Math Visualizer',
    tags: ['complex', 'roots', 'unity', 'argand', 'nth-root'],
    difficulty: 'intermediate',
    prerequisites: ['complex.arithmetic'],
    estimatedTime: 15,
    learningObjectives: [
      'Find nth roots of unity using polar form',
      'Understand the geometric distribution of roots',
      'Calculate nth roots of any complex number',
      'Identify primitive roots of unity',
      'Visualize roots on the Argand diagram',
    ],
  },
};

moduleRegistry.register(rootsOfUnityModule);

export default rootsOfUnityModule;
