/**
 * ComplexArithmetic Module
 *
 * Module definition and self-registration.
 */

import { VisualizationModule } from '@/lib/core/types/VisualizationModule';
import { MathState } from '@/lib/core/types/MathState';
import { moduleRegistry } from '@/lib/core/registry/ModuleRegistry';
import ComplexArithmetic from './ComplexArithmetic';
import { ComplexArithmeticState } from './types';

const complexArithmeticModule: VisualizationModule = {
  id: 'complex.arithmetic',

  name: 'Complex Arithmetic',
  description:
    'Visualize complex number operations (addition, subtraction, multiplication, division) and polar form on the Argand diagram.',

  syllabusRef: {
    strand: 'pure-math-complex',
    topic: 'arithmetic-and-polar',
    subtopic: 'operations-modulus-argument',
  },

  engine: 'svg',

  Component: ComplexArithmetic,

  getInitialState: (): ComplexArithmeticState => ({
    topicId: 'complex.arithmetic',

    parameters: {
      mainTab: 'arithmetic',
      operation: 'add',
      z1: { re: 3, im: 2 },
      z2: { re: 1, im: 3 },
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
    const params = state.parameters as ComplexArithmeticState['parameters'];

    const validateComplex = (z: { re: number; im: number }, name: string) => {
      if (Math.abs(z.re) > 5 || Math.abs(z.im) > 5) {
        errors.push(`${name} components must be between -5 and 5`);
      }
    };

    if (params.z1) validateComplex(params.z1, 'z₁');
    if (params.z2) validateComplex(params.z2, 'z₂');

    return errors;
  },

  metadata: {
    version: '1.0.0',
    author: 'H2 Math Visualizer',
    tags: ['complex', 'argand', 'arithmetic', 'polar', 'modulus', 'argument'],
    difficulty: 'basic',
    prerequisites: [],
    estimatedTime: 15,
    learningObjectives: [
      'Add and subtract complex numbers algebraically and geometrically',
      'Multiply and divide complex numbers',
      'Find modulus and argument of complex numbers',
      'Convert between Cartesian and polar form',
      'Visualize operations on the Argand diagram',
    ],
  },
};

moduleRegistry.register(complexArithmeticModule);

export default complexArithmeticModule;
