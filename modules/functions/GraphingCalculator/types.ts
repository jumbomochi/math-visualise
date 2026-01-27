/**
 * Types for Graphing Calculator module
 */

export interface FunctionEntry {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
}

export interface GraphWindow {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface GraphingCalculatorState {
  functions: FunctionEntry[];
  window: GraphWindow;
  angleMode: 'DEG' | 'RAD';
}
