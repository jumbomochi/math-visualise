/**
 * Combinatorics Module
 *
 * Barrel export for all combinatorics functions
 */

// Fundamental Principles
export {
  calculateAdditivePrinciple,
  calculateMultiplicativePrinciple,
  createAdditiveSample,
  createMultiplicativeSample,
  ADDITIVE_EXAMPLES,
  MULTIPLICATIVE_EXAMPLES,
  type CountingScenario,
  type AdditivePrincipleResult,
  type MultiplicativePrincipleResult,
  type ExampleScenario,
} from './principles';

// Slot Method
export {
  calculateSlotPermutations,
  permutation,
  factorial,
  generateArrangements,
  validatePermutation,
  createSlotMethodSample,
  SLOT_METHOD_EXAMPLES,
  type SlotConfiguration,
  type SlotRestriction,
  type SlotCalculation,
  type SlotMethodResult,
  type SlotMethodExample,
} from './slotMethod';

// Restricted Arrangements
export {
  calculateNonAdjacent,
  calculateAdjacent,
  validateNonAdjacent,
  validateAdjacent,
  createNonAdjacentSample,
  createAdjacentSample,
  NON_ADJACENT_EXAMPLES,
  ADJACENT_EXAMPLES,
  type NonAdjacentConfig,
  type NonAdjacentResult,
  type AdjacentConfig,
  type AdjacentResult,
  type StepExplanation,
  type NonAdjacentExample,
  type AdjacentExample,
} from './restrictedArrangements';

// Permutations
export {
  nPr,
  permutationsWithRepetition,
  circularPermutations,
  permutationsWithIdentical,
} from './permutations';

// Combinations
export {
  nCr,
  combinationsWithRepetition,
  pascalTriangle,
  binomialCoefficient,
} from './combinations';

// Advanced Cases
export {
  solveAdvancedCase,
  solveLicensePlateCase,
  solveStudyGroupCase,
  solveMeetingSeatingCase,
  solveEventScheduleCase,
  solveSecurityCodeCase,
  ADVANCED_CASE_EXAMPLES,
  type AdvancedCaseExample,
  type AdvancedCaseResult,
  type SolutionStep,
  type PartResult,
} from './advancedCases';
