/**
 * Visualization Module Interface
 *
 * Defines the contract that all visualization modules must implement
 * to be registered and used in the plug-and-play system.
 */

import { ComponentType } from 'react';
import { MathState } from './MathState';

/**
 * Every visualization module must implement this interface
 * to be registered and used in the application.
 *
 * This enables the plug-and-play architecture where modules
 * can be added without modifying the core application.
 */
export interface VisualizationModule {
  /**
   * Unique identifier for the module
   * Format: "strand.topic.visualization" or "topic.subtopic.visualization"
   * Example: "statistics.combinatorics.slot-method"
   */
  id: string;

  /**
   * Display name shown in UI
   */
  name: string;

  /**
   * Brief description of what this visualization demonstrates
   */
  description: string;

  /**
   * Which syllabus topic this belongs to
   */
  syllabusRef: {
    strand: SyllabusStrand;
    topic: string;
    subtopic?: string;
  };

  /**
   * Rendering engine used by this module
   * Determines which visualization library to use
   */
  engine: VisualizationEngine;

  /**
   * The React component that renders the visualization
   * Must accept VisualizationModuleProps
   */
  Component: ComponentType<VisualizationModuleProps>;

  /**
   * Factory function that returns the initial/default state for this module
   * Called when the module is first loaded or reset
   */
  getInitialState: () => MathState;

  /**
   * Validation function for MathState
   * Returns an array of error messages if invalid, empty array if valid
   *
   * This is called before state updates to ensure data integrity
   */
  validateState: (state: MathState) => string[];

  /**
   * Optional: State migration for backwards compatibility
   * Used when state schema changes between versions
   */
  migrateState?: (oldState: unknown, fromVersion: string) => MathState;

  /**
   * Module metadata
   */
  metadata: ModuleMetadata;
}

/**
 * Props that every visualization component receives
 */
export interface VisualizationModuleProps {
  /**
   * Current mathematical state
   * Contains all parameters, inputs, and computed results
   */
  mathState: MathState;

  /**
   * Callback to update state
   * Accepts partial state updates (will be merged with current state)
   */
  onStateChange: (newState: Partial<MathState>) => void;

  /**
   * Whether this visualization is currently active/visible
   * Can be used to pause animations or free resources
   */
  isActive: boolean;

  /**
   * Dimensions for the visualization container
   * Modules should respect these dimensions when rendering
   */
  dimensions?: {
    width: number;
    height: number;
  };
}

/**
 * Module metadata
 */
export interface ModuleMetadata {
  /**
   * Module version (semver)
   */
  version: string;

  /**
   * Optional author information
   */
  author?: string;

  /**
   * Tags for search and categorization
   */
  tags: string[];

  /**
   * Difficulty level for students
   */
  difficulty?: DifficultyLevel;

  /**
   * IDs of prerequisite modules that should be completed first
   */
  prerequisites?: string[];

  /**
   * Estimated time to complete (in minutes)
   */
  estimatedTime?: number;

  /**
   * Learning objectives addressed by this module
   */
  learningObjectives?: string[];
}

/**
 * Supported visualization engines
 */
export type VisualizationEngine =
  | 'p5'      // P5.js for 2D graphics and animations
  | 'three'   // Three.js for 3D graphics
  | 'canvas'  // HTML5 Canvas API
  | 'svg'     // SVG for vector graphics
  | 'html';   // Pure HTML/CSS (for simple visualizations)

/**
 * Six main strands of H2 Math syllabus (Singapore SEAB 9758)
 */
export type SyllabusStrand =
  | 'pure-math-functions'      // Functions and Graphs
  | 'pure-math-calculus'       // Calculus (Differentiation & Integration)
  | 'pure-math-vectors'        // Vectors (2D and 3D)
  | 'pure-math-complex'        // Complex Numbers
  | 'statistics-probability'   // Probability and Permutations/Combinations
  | 'statistics-distributions'; // Probability Distributions and Hypothesis Testing

/**
 * Difficulty levels for modules
 */
export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced';

/**
 * Module registration status
 */
export interface ModuleRegistrationResult {
  success: boolean;
  moduleId: string;
  errors?: string[];
  warnings?: string[];
}
