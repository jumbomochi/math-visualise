/**
 * useVisualization Hook
 *
 * Custom hook for loading and managing visualization modules.
 * Handles module loading, state management, and state persistence.
 */

import { useState, useEffect, useCallback } from 'react';
import { moduleRegistry } from '@/lib/core/registry/ModuleRegistry';
import { VisualizationModule } from '@/lib/core/types/VisualizationModule';
import { MathState } from '@/lib/core/types/MathState';
import { useNavigationStore } from '@/lib/store/navigationStore';

/**
 * Hook return type
 */
interface UseVisualizationReturn {
  /** Loaded module (undefined if not found) */
  module: VisualizationModule | undefined;

  /** Current module state */
  mathState: MathState | undefined;

  /** Update module state */
  updateMathState: (updates: Partial<MathState>) => void;

  /** Validation errors */
  errors: string[];

  /** Loading status */
  isLoading: boolean;

  /** Reset state to initial values */
  resetState: () => void;
}

/**
 * Load and manage a visualization module
 *
 * @param moduleId - ID of the module to load
 * @returns Module, state, and state management functions
 */
export function useVisualization(moduleId: string | null): UseVisualizationReturn {
  const [module, setModule] = useState<VisualizationModule | undefined>(undefined);
  const [mathState, setMathState] = useState<MathState | undefined>(undefined);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getModuleState, saveModuleState } = useNavigationStore();

  // Load module when moduleId changes
  useEffect(() => {
    if (!moduleId) {
      setModule(undefined);
      setMathState(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Load module from registry
    const loadedModule = moduleRegistry.get(moduleId);

    if (!loadedModule) {
      setErrors([`Module "${moduleId}" not found in registry`]);
      setModule(undefined);
      setMathState(undefined);
      setIsLoading(false);
      return;
    }

    setModule(loadedModule);

    // Try to restore saved state, otherwise use initial state
    const savedState = getModuleState(moduleId);
    let initialState: MathState;

    if (savedState) {
      // Validate saved state
      const validationErrors = loadedModule.validateState(savedState);
      if (validationErrors.length === 0) {
        initialState = savedState;
      } else {
        console.warn('Saved state invalid, using initial state:', validationErrors);
        initialState = loadedModule.getInitialState();
      }
    } else {
      initialState = loadedModule.getInitialState();
    }

    setMathState(initialState);
    setErrors([]);
    setIsLoading(false);
  }, [moduleId, getModuleState]);

  // Update math state
  const updateMathState = useCallback(
    (updates: Partial<MathState>) => {
      if (!mathState || !module || !moduleId) return;

      const newState = { ...mathState, ...updates };

      // Validate new state
      const validationErrors = module.validateState(newState);
      setErrors(validationErrors);

      // Always update state (even if invalid) for better UX
      setMathState(newState);

      // Only save to store if valid
      if (validationErrors.length === 0) {
        saveModuleState(moduleId, newState);
      }
    },
    [mathState, module, moduleId, saveModuleState]
  );

  // Reset state to initial
  const resetState = useCallback(() => {
    if (!module) return;

    const initialState = module.getInitialState();
    setMathState(initialState);
    setErrors([]);

    if (moduleId) {
      saveModuleState(moduleId, initialState);
    }
  }, [module, moduleId, saveModuleState]);

  return {
    module,
    mathState,
    updateMathState,
    errors,
    isLoading,
    resetState,
  };
}
