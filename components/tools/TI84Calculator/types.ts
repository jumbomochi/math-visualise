/**
 * TI-84 Plus CE Calculator Types
 */

export type CalculatorMode = 'NORMAL' | 'GRAPH' | 'TABLE' | 'STAT';

export interface GraphWindow {
  xMin: number;
  xMax: number;
  xScl: number;
  yMin: number;
  yMax: number;
  yScl: number;
}

export interface CalculatorState {
  mode: CalculatorMode;
  display: string;
  input: string;
  memory: number;
  functions: string[]; // Y1, Y2, Y3, etc.
  activeFunction: number;
  window: GraphWindow;
  cursorPosition: number;
  angle: 'DEG' | 'RAD';
  historyIndex: number;
  history: string[];
}

export const DEFAULT_WINDOW: GraphWindow = {
  xMin: -10,
  xMax: 10,
  xScl: 1,
  yMin: -10,
  yMax: 10,
  yScl: 1,
};

export const INITIAL_STATE: CalculatorState = {
  mode: 'NORMAL',
  display: '',
  input: '',
  memory: 0,
  functions: ['', '', '', ''],
  activeFunction: 0,
  window: DEFAULT_WINDOW,
  cursorPosition: 0,
  angle: 'DEG',
  historyIndex: -1,
  history: [],
};
