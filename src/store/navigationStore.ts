/**
 * Navigation Store
 *
 * Zustand store for managing navigation state and preserving
 * module progress when switching between topics.
 *
 * Key Features:
 * - Tracks current strand, topic, and module
 * - Preserves MathState for each module when switching
 * - Maintains navigation history for back button
 * - Lightweight persistence (current location only)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MathState } from '@/core/types/MathState';
import { NavigationHistoryItem, BreadcrumbItem } from '@/core/types/NavigationTypes';

/**
 * Navigation store state interface
 */
interface NavigationStore {
  // =========================================================================
  // Current Navigation State
  // =========================================================================

  /** Currently active strand */
  currentStrand: string | null;

  /** Currently active topic */
  currentTopic: string | null;

  /** Currently active module */
  currentModule: string | null;

  // =========================================================================
  // State Preservation
  // =========================================================================

  /**
   * Preserved state for each module
   * Key: moduleId, Value: MathState
   *
   * When a user switches away from a module, its state is saved here.
   * When they return, the state is restored exactly as they left it.
   */
  moduleStates: Map<string, MathState>;

  // =========================================================================
  // Navigation History
  // =========================================================================

  /**
   * Navigation history stack (for back button)
   */
  history: NavigationHistoryItem[];

  /**
   * Maximum history length
   */
  maxHistoryLength: number;

  // =========================================================================
  // Navigation Actions
  // =========================================================================

  /**
   * Navigate to a specific strand
   * Clears topic and module selection
   */
  navigateToStrand: (strandId: string) => void;

  /**
   * Navigate to a specific topic within current strand
   * Clears module selection
   */
  navigateToTopic: (topicId: string) => void;

  /**
   * Navigate to a specific module
   * Records in history
   */
  navigateToModule: (moduleId: string) => void;

  /**
   * Go back to previous navigation state
   */
  goBack: () => void;

  /**
   * Go to home (clear all selections)
   */
  goHome: () => void;

  // =========================================================================
  // State Management Actions
  // =========================================================================

  /**
   * Save the current state of a module
   * Called when leaving a module or updating its state
   */
  saveModuleState: (moduleId: string, state: MathState) => void;

  /**
   * Get the saved state for a module
   * Returns undefined if no state has been saved
   */
  getModuleState: (moduleId: string) => MathState | undefined;

  /**
   * Clear saved state for a specific module
   * Useful for "reset" functionality
   */
  clearModuleState: (moduleId: string) => void;

  /**
   * Clear all saved module states
   * Nuclear reset option
   */
  resetAllStates: () => void;

  // =========================================================================
  // Utility Methods
  // =========================================================================

  /**
   * Get breadcrumb trail for current location
   */
  getBreadcrumbs: () => BreadcrumbItem[];

  /**
   * Check if we can go back
   */
  canGoBack: () => boolean;
}

/**
 * Create navigation store with Zustand
 */
export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStrand: null,
      currentTopic: null,
      currentModule: null,
      moduleStates: new Map(),
      history: [],
      maxHistoryLength: 50,

      // Navigation actions
      navigateToStrand: (strandId: string) => {
        set({
          currentStrand: strandId,
          currentTopic: null,
          currentModule: null,
        });
      },

      navigateToTopic: (topicId: string) => {
        set({
          currentTopic: topicId,
          currentModule: null,
        });
      },

      navigateToModule: (moduleId: string) => {
        const { currentStrand, currentTopic, history, maxHistoryLength } = get();

        // Create history item
        const historyItem: NavigationHistoryItem = {
          strand: currentStrand || '',
          topic: currentTopic || '',
          module: moduleId,
          timestamp: Date.now(),
        };

        // Add to history (limit length)
        const newHistory = [...history, historyItem];
        if (newHistory.length > maxHistoryLength) {
          newHistory.shift(); // Remove oldest item
        }

        set({
          currentModule: moduleId,
          history: newHistory,
        });
      },

      goBack: () => {
        const { history } = get();

        if (history.length <= 1) {
          // Can't go back, already at the beginning
          return;
        }

        // Remove current item
        const newHistory = history.slice(0, -1);

        // Get previous item
        const previous = newHistory[newHistory.length - 1];

        set({
          currentStrand: previous.strand,
          currentTopic: previous.topic,
          currentModule: previous.module,
          history: newHistory,
        });
      },

      goHome: () => {
        set({
          currentStrand: null,
          currentTopic: null,
          currentModule: null,
          history: [],
        });
      },

      // State management actions
      saveModuleState: (moduleId: string, state: MathState) => {
        const { moduleStates } = get();
        const newStates = new Map(moduleStates);
        newStates.set(moduleId, state);

        set({ moduleStates: newStates });
      },

      getModuleState: (moduleId: string) => {
        const { moduleStates } = get();
        return moduleStates.get(moduleId);
      },

      clearModuleState: (moduleId: string) => {
        const { moduleStates } = get();
        const newStates = new Map(moduleStates);
        newStates.delete(moduleId);

        set({ moduleStates: newStates });
      },

      resetAllStates: () => {
        set({ moduleStates: new Map() });
      },

      // Utility methods
      getBreadcrumbs: () => {
        const { currentStrand, currentTopic, currentModule } = get();
        const breadcrumbs: BreadcrumbItem[] = [];

        if (currentStrand) {
          breadcrumbs.push({
            label: currentStrand,
            path: `/strand/${currentStrand}`,
            type: 'strand',
          });
        }

        if (currentTopic) {
          breadcrumbs.push({
            label: currentTopic,
            path: `/topic/${currentTopic}`,
            type: 'topic',
          });
        }

        if (currentModule) {
          breadcrumbs.push({
            label: currentModule,
            path: `/module/${currentModule}`,
            type: 'module',
          });
        }

        return breadcrumbs;
      },

      canGoBack: () => {
        const { history } = get();
        return history.length > 1;
      },
    }),
    {
      name: 'math-viz-navigation',

      // Only persist current location, not full states
      // This keeps localStorage small and fast
      partialize: (state) => ({
        currentStrand: state.currentStrand,
        currentTopic: state.currentTopic,
        currentModule: state.currentModule,
        // Don't persist module states or history to localStorage
        // They will reset on page reload (as per requirements)
      }),
    }
  )
);

/**
 * Selector hook for current location
 * Useful for components that only need current location
 */
export const useCurrentLocation = () => {
  return useNavigationStore((state) => ({
    strand: state.currentStrand,
    topic: state.currentTopic,
    module: state.currentModule,
  }));
};

/**
 * Selector hook for navigation actions
 * Useful for components that only need navigation methods
 */
export const useNavigationActions = () => {
  return useNavigationStore((state) => ({
    navigateToStrand: state.navigateToStrand,
    navigateToTopic: state.navigateToTopic,
    navigateToModule: state.navigateToModule,
    goBack: state.goBack,
    goHome: state.goHome,
  }));
};

/**
 * Selector hook for state preservation
 * Useful for visualization components
 */
export const useModuleStateManager = () => {
  return useNavigationStore((state) => ({
    saveState: state.saveModuleState,
    getState: state.getModuleState,
    clearState: state.clearModuleState,
    resetAll: state.resetAllStates,
  }));
};
