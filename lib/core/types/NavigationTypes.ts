/**
 * Navigation Types
 *
 * Types for the navigation system, syllabus structure,
 * and progress tracking.
 */

import { SyllabusStrand } from './VisualizationModule';

/**
 * Navigation history item
 */
export interface NavigationHistoryItem {
  strand: string;
  topic: string;
  module: string;
  timestamp: number;
}

/**
 * Breadcrumb item for navigation trail
 */
export interface BreadcrumbItem {
  label: string;
  path: string;
  type: 'strand' | 'topic' | 'module';
}

/**
 * Module progress tracking
 */
export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  lastVisited?: number;
  timeSpent?: number; // in seconds
  completionPercentage?: number;
  notes?: string;
}

/**
 * Topic progress tracking
 */
export interface TopicProgress {
  topicId: string;
  modulesCompleted: number;
  totalModules: number;
  lastVisited?: number;
}

/**
 * Strand progress tracking
 */
export interface StrandProgress {
  strandId: SyllabusStrand;
  topicsCompleted: number;
  totalTopics: number;
  lastVisited?: number;
}

/**
 * Overall user progress
 */
export interface UserProgress {
  strands: Record<string, StrandProgress>;
  topics: Record<string, TopicProgress>;
  modules: Record<string, ModuleProgress>;
  totalTimeSpent: number;
  lastActivityTimestamp?: number;
}
