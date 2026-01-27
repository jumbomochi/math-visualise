/**
 * RootsOfUnity Module Types
 *
 * Type definitions for the roots of unity visualization module.
 */

import { MathState } from '@/lib/core/types/MathState';
import { Complex, RootOfUnity } from '@/lib/math/complex/types';

/**
 * Module state
 */
export interface RootsOfUnityState extends MathState {
  parameters: {
    n: number; // nth root
    baseNumber: Complex; // The number to find roots of (default: 1 for unity)
    showUnityRoots: boolean; // Whether to show roots of 1 or roots of baseNumber
  };
}

/**
 * Props for RootsCanvas
 */
export interface RootsCanvasProps {
  width?: number;
  height?: number;
  range?: number;
  children: React.ReactNode;
}

/**
 * Props for RootsView
 */
export interface RootsViewProps {
  roots: RootOfUnity[];
  baseNumber: Complex;
  showConnections: boolean;
}

/**
 * Props for ControlPanel
 */
export interface ControlPanelProps {
  n: number;
  baseNumber: Complex;
  showUnityRoots: boolean;
  onNChange: (n: number) => void;
  onBaseNumberChange: (z: Complex) => void;
  onShowUnityRootsChange: (show: boolean) => void;
}
