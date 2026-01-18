/**
 * Calculator Store
 * Global state management for TI-84 calculator visibility
 */

import { create } from 'zustand';

interface CalculatorStore {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const useCalculatorStore = create<CalculatorStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
