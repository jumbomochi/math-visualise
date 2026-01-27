/**
 * Core MathState Types
 *
 * Unified state object passed to all visualization modules.
 * Contains topic identifier, visualization parameters, user inputs,
 * computed results, and visualization settings.
 */

/**
 * Main state interface for all math visualizations
 */
export interface MathState {
  /**
   * Identifies which topic/visualization this state belongs to
   * Format: "strand.topic" or "topic.subtopic"
   */
  topicId: string;

  /**
   * Module-specific parameters
   * Each module defines its own parameter schema
   */
  parameters: MathParameters;

  /**
   * User input values from controls
   */
  inputs: MathInputs;

  /**
   * Computed results from pure math functions
   * Separated to keep computation logic out of UI
   */
  computed?: ComputedResults;

  /**
   * Visualization-specific display settings
   */
  visualization: VisualizationSettings;

  /**
   * Animation state and controls
   */
  animation?: AnimationState;
}

/**
 * Type-safe parameter definitions
 * Modules extend this with their specific needs
 * Using a more flexible type to allow custom parameter structures
 */
export type MathParameters = Record<string, any>;

/**
 * User inputs from interactive controls
 */
export interface MathInputs {
  [key: string]: unknown;
}

/**
 * Results computed by pure math functions
 * Prevents business logic in UI components
 */
export interface ComputedResults {
  [key: string]: unknown;
}

/**
 * Visualization display settings
 */
export interface VisualizationSettings {
  /** Show coordinate grid */
  showGrid?: boolean;

  /** Show axes (x, y, z) */
  showAxes?: boolean;

  /** Show labels and annotations */
  showLabels?: boolean;

  /** Show step-by-step breakdown */
  showSteps?: boolean;

  /** Color scheme */
  colorScheme?: 'default' | 'colorblind' | 'high-contrast' | 'dark';

  /** Visualization scale/zoom */
  scale?: number;

  /** Camera angle for 3D visualizations (spherical coordinates) */
  viewAngle?: {
    theta: number; // Azimuthal angle (horizontal rotation)
    phi: number;   // Polar angle (vertical rotation)
  };

  /** Canvas dimensions */
  dimensions?: {
    width: number;
    height: number;
  };
}

/**
 * Animation control state
 */
export interface AnimationState {
  /** Whether animation is currently playing */
  isPlaying: boolean;

  /** Animation speed multiplier (1 = normal, 2 = double speed, etc.) */
  speed: number;

  /** Current step in the animation sequence */
  currentStep: number;

  /** Total number of steps in the animation */
  totalSteps: number;

  /** Whether to loop the animation */
  loop: boolean;

  /** Animation direction */
  direction?: 'forward' | 'backward';
}

// ============================================================================
// Supporting Mathematical Types
// ============================================================================

/**
 * 2D Vector representation
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * 3D Vector representation
 */
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Complex number representation
 */
export interface ComplexNumber {
  real: number;
  imaginary: number;
}

/**
 * Matrix representation
 */
export interface Matrix {
  rows: number;
  cols: number;
  data: number[][];
}

// ============================================================================
// Topic-Specific State Extensions
// ============================================================================

/**
 * Example: Combinatorics Slot Method State
 * Shows how modules can extend the base MathState
 */
export interface SlotMethodState extends MathState {
  topicId: 'combinatorics.slot-method';
  parameters: {
    totalItems: number;
    positions: number;
    restrictions?: SlotRestriction[];
  };
  inputs: {
    items: string[];
    selectedSlots: number[];
  };
  computed: {
    totalArrangements: number;
    slotsBreakdown: SlotCalculation[];
    formula: string;
    formulaLatex: string;
    explanation: string[];
  };
}

/**
 * Slot restriction for permutation calculations
 */
export interface SlotRestriction {
  position: number;
  allowedItems?: string[];
  forbiddenItems?: string[];
}

/**
 * Calculation result for a single slot
 */
export interface SlotCalculation {
  position: number;
  availableChoices: number;
  explanation: string;
  reasoning: string;
}

/**
 * Example: 3D Vector State
 */
export interface Vector3DState extends MathState {
  topicId: 'vectors.3d';
  parameters: {
    showResultant: boolean;
    operation: 'add' | 'subtract' | 'cross' | 'dot';
  };
  inputs: {
    vectorA: Vector3D;
    vectorB: Vector3D;
  };
  computed: {
    result: Vector3D | number;
    magnitude?: number;
    angle?: number;
    explanation: string;
  };
}

/**
 * Example: Probability Distribution State
 */
export interface DistributionState extends MathState {
  topicId: 'probability.distributions';
  parameters: {
    distributionType: 'normal' | 'binomial' | 'poisson';
    mean: number;
    standardDeviation?: number;
    n?: number;
    p?: number;
    lambda?: number;
  };
  inputs: {
    xValue?: number;
    lowerBound?: number;
    upperBound?: number;
  };
  computed: {
    probability?: number;
    cumulativeProbability?: number;
    expectedValue: number;
    variance: number;
    dataPoints: Array<{ x: number; y: number }>;
  };
}
