/**
 * Probability Module
 *
 * Barrel export for all probability functions
 */

// Basic Probability
export {
  calculateProbability,
  calculateComplement,
  solveBasicProbability,
  BASIC_PROBABILITY_EXAMPLES,
  type Outcome,
  type Event,
  type SampleSpace,
  type ProbabilityExample,
  type BasicProbabilityResult,
} from './basicProbability';

// Probability Rules
export {
  calculateAdditionRule,
  calculateMultiplicationRule,
  solveAdditionRule,
  solveMultiplicationRule,
  ADDITION_RULE_EXAMPLES,
  MULTIPLICATION_RULE_EXAMPLES,
  type ProbabilityRuleExample,
  type EventData,
  type IntersectionData,
  type AdditionRuleResult,
  type MultiplicationRuleResult,
} from './probabilityRules';

// Conditional Probability & Bayes' Theorem
export {
  calculateConditionalProbability,
  calculateBayesTheorem,
  solveConditionalProbability,
  solveBayesTheorem,
  CONDITIONAL_PROBABILITY_EXAMPLES,
  type ConditionalProbabilityData,
  type BayesTheoremData,
  type ConditionalProbabilityExample,
  type ConditionalProbabilityResult,
  type BayesTheoremResult,
} from './conditionalProbability';

// Venn Diagrams & Set Notation
export {
  calculateUnion,
  calculateIntersection,
  calculateComplement as calculateSetComplement,
  calculateDifference,
  calculateSymmetricDifference,
  solveVennDiagram,
  VENN_DIAGRAM_EXAMPLES,
  type VennSet,
  type VennDiagramData,
  type VennDiagramExample,
  type VennDiagramResult,
} from './vennDiagrams';

// Tree Diagrams
export {
  buildCoinFlipTree,
  buildWithoutReplacementTree,
  extractAllPaths,
  filterPathsByOutcome,
  calculateTotalProbability,
  solveTreeDiagram,
  TREE_DIAGRAM_EXAMPLES,
  type TreeNode,
  type TreeDiagramData,
  type TreeDiagramExample,
  type TreeDiagramResult,
  type TreePath,
} from './treeDiagrams';
