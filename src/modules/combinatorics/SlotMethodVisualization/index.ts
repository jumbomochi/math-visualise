/**
 * Slot Method Visualization Module
 *
 * Module definition and self-registration.
 * This demonstrates the plug-and-play architecture - simply importing
 * this file will register the module with the ModuleRegistry.
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { MathState, SlotMethodState } from '@/core/types/MathState';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import SlotMethodModule from './SlotMethodModule';

/**
 * Slot Method Visualization Module Definition
 *
 * Implements the VisualizationModule interface for plug-and-play functionality
 */
const slotMethodModule: VisualizationModule = {
  // Unique identifier
  id: 'combinatorics.slot-method',

  // Display information
  name: 'Slot Method',
  description: 'Visualize permutations using the slot filling technique - a systematic way to count arrangements by filling each position step-by-step',

  // Syllabus reference
  syllabusRef: {
    strand: 'statistics-probability',
    topic: 'counting-principles',
    subtopic: 'permutations',
  },

  // Visualization engine
  engine: 'p5',

  // React component
  Component: SlotMethodModule,

  // Initial state factory
  getInitialState: (): SlotMethodState => ({
    topicId: 'combinatorics.slot-method',

    parameters: {
      totalItems: 5,
      positions: 3,
      restrictions: [],
    },

    inputs: {
      items: ['A', 'B', 'C', 'D', 'E'],
      selectedSlots: [],
    },

    computed: {
      totalArrangements: 0,
      slotsBreakdown: [],
      formula: '',
      formulaLatex: '',
      explanation: [],
    },

    visualization: {
      showGrid: false,
      showLabels: true,
      showSteps: true,
      colorScheme: 'default',
      scale: 1,
    },

    animation: {
      isPlaying: false,
      speed: 1,
      currentStep: 0,
      totalSteps: 0,
      loop: false,
    },
  }),

  // State validation
  validateState: (state: MathState): string[] => {
    const errors: string[] = [];

    const { totalItems, positions } = state.parameters as {
      totalItems: number;
      positions: number;
    };

    if (typeof totalItems !== 'number' || totalItems < 1) {
      errors.push('Total items must be a positive number');
    }

    if (typeof positions !== 'number' || positions < 1) {
      errors.push('Positions must be a positive number');
    }

    if (positions > totalItems) {
      errors.push('Positions cannot exceed total items');
    }

    if (totalItems > 20) {
      errors.push('Total items cannot exceed 20 (for performance reasons)');
    }

    return errors;
  },

  // Metadata
  metadata: {
    version: '1.0.0',
    author: 'H2 Math Visualizer',
    tags: ['combinatorics', 'permutations', 'counting', 'slot-method', 'arrangements'],
    difficulty: 'basic',
    prerequisites: [],
    estimatedTime: 15,
    learningObjectives: [
      'Understand the slot method for counting permutations',
      'Apply the multiplication principle to arrangement problems',
      'Calculate the number of ways to arrange r items from n items',
      'Visualize step-by-step permutation calculations',
    ],
  },
};

// Self-register the module on import
moduleRegistry.register(slotMethodModule);

// Export for direct use if needed
export default slotMethodModule;
