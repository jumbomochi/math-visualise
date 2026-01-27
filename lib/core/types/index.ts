/**
 * Core Types Barrel Export
 *
 * Central export point for all core type definitions.
 */

// MathState types
export type {
  MathState,
  MathParameters,
  MathInputs,
  ComputedResults,
  VisualizationSettings,
  AnimationState,
  Vector2D,
  Vector3D,
  ComplexNumber,
  Matrix,
  SlotMethodState,
  SlotRestriction,
  SlotCalculation,
  Vector3DState,
  DistributionState,
} from './MathState';

// VisualizationModule types
export type {
  VisualizationModule,
  VisualizationModuleProps,
  ModuleMetadata,
  VisualizationEngine,
  SyllabusStrand,
  DifficultyLevel,
  ModuleRegistrationResult,
} from './VisualizationModule';

// Navigation types
export type {
  NavigationHistoryItem,
  BreadcrumbItem,
  ModuleProgress,
  TopicProgress,
  StrandProgress,
  UserProgress,
} from './NavigationTypes';
