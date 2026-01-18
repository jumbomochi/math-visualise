/**
 * Progress Store
 *
 * Tracks user progress across modules, topics, and strands.
 * Currently not persisted (as per requirements), but can be
 * easily extended to use localStorage when needed.
 */

import { create } from 'zustand';
import { ModuleProgress, TopicProgress, StrandProgress } from '@/core/types/NavigationTypes';

interface ProgressStore {
  /**
   * Module progress tracking
   */
  moduleProgress: Map<string, ModuleProgress>;

  /**
   * Topic progress tracking
   */
  topicProgress: Map<string, TopicProgress>;

  /**
   * Strand progress tracking
   */
  strandProgress: Map<string, StrandProgress>;

  /**
   * Total time spent in application (seconds)
   */
  totalTimeSpent: number;

  /**
   * Last activity timestamp
   */
  lastActivityTimestamp: number;

  // Actions

  /**
   * Mark a module as visited
   */
  visitModule: (moduleId: string) => void;

  /**
   * Mark a module as completed
   */
  completeModule: (moduleId: string) => void;

  /**
   * Update module completion percentage
   */
  updateModuleProgress: (moduleId: string, percentage: number) => void;

  /**
   * Add time spent on a module
   */
  addTimeSpent: (moduleId: string, seconds: number) => void;

  /**
   * Get progress for a module
   */
  getModuleProgress: (moduleId: string) => ModuleProgress | undefined;

  /**
   * Get overall progress statistics
   */
  getStats: () => {
    totalModulesVisited: number;
    totalModulesCompleted: number;
    totalTimeSpent: number;
  };

  /**
   * Reset all progress
   */
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  moduleProgress: new Map(),
  topicProgress: new Map(),
  strandProgress: new Map(),
  totalTimeSpent: 0,
  lastActivityTimestamp: Date.now(),

  visitModule: (moduleId: string) => {
    const { moduleProgress } = get();
    const existing = moduleProgress.get(moduleId);

    const newProgress = new Map(moduleProgress);
    newProgress.set(moduleId, {
      moduleId,
      completed: existing?.completed || false,
      lastVisited: Date.now(),
      timeSpent: existing?.timeSpent || 0,
      completionPercentage: existing?.completionPercentage || 0,
    });

    set({
      moduleProgress: newProgress,
      lastActivityTimestamp: Date.now(),
    });
  },

  completeModule: (moduleId: string) => {
    const { moduleProgress } = get();
    const existing = moduleProgress.get(moduleId);

    const newProgress = new Map(moduleProgress);
    newProgress.set(moduleId, {
      ...existing,
      moduleId,
      completed: true,
      completionPercentage: 100,
      lastVisited: Date.now(),
      timeSpent: existing?.timeSpent || 0,
    } as ModuleProgress);

    set({
      moduleProgress: newProgress,
      lastActivityTimestamp: Date.now(),
    });
  },

  updateModuleProgress: (moduleId: string, percentage: number) => {
    const { moduleProgress } = get();
    const existing = moduleProgress.get(moduleId);

    const newProgress = new Map(moduleProgress);
    newProgress.set(moduleId, {
      ...existing,
      moduleId,
      completionPercentage: Math.min(100, Math.max(0, percentage)),
      completed: percentage >= 100,
      lastVisited: Date.now(),
      timeSpent: existing?.timeSpent || 0,
    } as ModuleProgress);

    set({ moduleProgress: newProgress });
  },

  addTimeSpent: (moduleId: string, seconds: number) => {
    const { moduleProgress, totalTimeSpent } = get();
    const existing = moduleProgress.get(moduleId);

    const newProgress = new Map(moduleProgress);
    newProgress.set(moduleId, {
      ...existing,
      moduleId,
      timeSpent: (existing?.timeSpent || 0) + seconds,
      completed: existing?.completed || false,
      lastVisited: Date.now(),
    } as ModuleProgress);

    set({
      moduleProgress: newProgress,
      totalTimeSpent: totalTimeSpent + seconds,
    });
  },

  getModuleProgress: (moduleId: string) => {
    return get().moduleProgress.get(moduleId);
  },

  getStats: () => {
    const { moduleProgress, totalTimeSpent } = get();
    let visited = 0;
    let completed = 0;

    moduleProgress.forEach((progress) => {
      visited++;
      if (progress.completed) {
        completed++;
      }
    });

    return {
      totalModulesVisited: visited,
      totalModulesCompleted: completed,
      totalTimeSpent,
    };
  },

  resetProgress: () => {
    set({
      moduleProgress: new Map(),
      topicProgress: new Map(),
      strandProgress: new Map(),
      totalTimeSpent: 0,
      lastActivityTimestamp: Date.now(),
    });
  },
}));
