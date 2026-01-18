/**
 * Syllabus Structure
 *
 * Defines the 6 main strands of the Singapore H2 Mathematics (9758) syllabus
 * and their sub-topics. This structure drives the navigation sidebar.
 */

import { SyllabusStrand } from '@/core/types/VisualizationModule';

/**
 * Syllabus strand definition
 */
export interface SyllabusStrandDef {
  id: SyllabusStrand;
  name: string;
  description: string;
  icon: string;
  color: string;
  topics: SyllabusTopicDef[];
}

/**
 * Syllabus topic definition
 */
export interface SyllabusTopicDef {
  id: string;
  name: string;
  description: string;
  modules: string[]; // IDs of visualization modules
}

/**
 * The 6 main strands of H2 Math (Singapore SEAB 9758 Syllabus)
 *
 * Structure:
 * 1. Pure Math - Functions & Graphs
 * 2. Pure Math - Calculus
 * 3. Pure Math - Vectors
 * 4. Pure Math - Complex Numbers
 * 5. Statistics - Probability
 * 6. Statistics - Distributions
 */
export const SYLLABUS_STRUCTURE: SyllabusStrandDef[] = [
  // ==========================================================================
  // STRAND 1: Functions & Graphs
  // ==========================================================================
  {
    id: 'pure-math-functions',
    name: 'Functions & Graphs',
    description: 'Functions, transformations, and graphing techniques',
    icon: 'function',
    color: 'blue',
    topics: [
      {
        id: 'functions-domain-range',
        name: 'Domain & Range',
        description: 'Finding domain and range of functions',
        modules: ['functions.basics'],
      },
      {
        id: 'functions-composite',
        name: 'Composite Functions',
        description: 'Function composition and properties',
        modules: ['functions.basics'],
      },
      {
        id: 'functions-inverse',
        name: 'Inverse Functions',
        description: 'Finding and working with inverse functions',
        modules: ['functions.basics'],
      },
      {
        id: 'graphs-transformations-basic',
        name: 'Transformations',
        description: 'Translations, reflections, and scaling',
        modules: ['functions.transformations'],
      },
      {
        id: 'graphs-rational',
        name: 'Rational Functions',
        description: 'Graphing rational functions and asymptotes',
        modules: ['functions.rational'],
      },
    ],
  },

  // ==========================================================================
  // STRAND 2: Calculus
  // ==========================================================================
  {
    id: 'pure-math-calculus',
    name: 'Calculus',
    description: 'Differentiation and integration techniques',
    icon: 'integral',
    color: 'green',
    topics: [
      {
        id: 'differentiation-basic',
        name: 'Basic Differentiation',
        description: 'Power rule, product rule, quotient rule, chain rule',
        modules: ['calculus.differentiation'],
      },
      {
        id: 'differentiation-implicit',
        name: 'Implicit Differentiation',
        description: 'Differentiating implicit functions',
        modules: ['calculus.differentiation'],
      },
      {
        id: 'differentiation-applications',
        name: 'Applications of Differentiation',
        description: 'Tangents, normals, maxima, minima, optimization',
        modules: ['calculus.differentiation'],
      },
      {
        id: 'integration-basic',
        name: 'Basic Integration',
        description: 'Standard integrals and substitution',
        modules: ['calculus.integration'],
      },
      {
        id: 'integration-parts',
        name: 'Integration by Parts',
        description: 'Integration by parts technique',
        modules: ['calculus.integration'],
      },
      {
        id: 'integration-applications',
        name: 'Applications of Integration',
        description: 'Area under curve, volume of revolution',
        modules: ['calculus.integration'],
      },
      {
        id: 'differential-equations',
        name: 'Differential Equations',
        description: 'First-order differential equations',
        modules: ['calculus.differential-equations'],
      },
    ],
  },

  // ==========================================================================
  // STRAND 3: Vectors
  // ==========================================================================
  {
    id: 'pure-math-vectors',
    name: 'Vectors',
    description: '2D and 3D vectors, dot product, cross product',
    icon: 'vector',
    color: 'purple',
    topics: [
      {
        id: 'vectors-2d-operations',
        name: '2D Vector Operations',
        description: 'Addition, subtraction, scalar multiplication',
        modules: ['vectors.2d-vectors'],
      },
      {
        id: 'vectors-2d-dot-product',
        name: '2D Dot Product',
        description: 'Dot product and applications',
        modules: ['vectors.2d-vectors'],
      },
      {
        id: 'vectors-3d-operations',
        name: '3D Vector Operations',
        description: 'Addition, subtraction, scalar multiplication in 3D',
        modules: ['vectors.3d-operations'],
      },
      {
        id: 'vectors-3d-products',
        name: 'Dot & Cross Product',
        description: 'Dot product, cross product, and applications',
        modules: ['vectors.dot-cross-product'],
      },
      {
        id: 'vectors-3d-geometry',
        name: 'Lines & Planes',
        description: 'Equations of lines and planes in 3D',
        modules: ['vectors.lines-planes'],
      },
    ],
  },

  // ==========================================================================
  // STRAND 4: Complex Numbers
  // ==========================================================================
  {
    id: 'pure-math-complex',
    name: 'Complex Numbers',
    description: 'Complex number operations and Argand diagram',
    icon: 'complex',
    color: 'orange',
    topics: [
      {
        id: 'complex-arithmetic',
        name: 'Arithmetic',
        description: 'Addition, subtraction, multiplication, division',
        modules: ['complex.arithmetic'],
      },
      {
        id: 'complex-modulus-argument',
        name: 'Modulus & Argument',
        description: 'Modulus-argument form and conversions',
        modules: ['complex.arithmetic'],
      },
      {
        id: 'complex-argand',
        name: 'Argand Diagram',
        description: 'Geometric representation of complex numbers',
        modules: ['complex.arithmetic'],
      },
      {
        id: 'complex-roots',
        name: 'Roots of Unity',
        description: 'Finding nth roots of complex numbers',
        modules: ['complex.roots-of-unity'],
      },
    ],
  },

  // ==========================================================================
  // STRAND 5: Probability
  // ==========================================================================
  {
    id: 'statistics-probability',
    name: 'Probability',
    description: 'Counting principles, probability theory',
    icon: 'dice',
    color: 'red',
    topics: [
      {
        id: 'fundamental-principles',
        name: 'Fundamental Principles',
        description: 'Additive and multiplicative principles',
        modules: ['combinatorics.additive-principle', 'combinatorics.multiplicative-principle'],
      },
      {
        id: 'permutations',
        name: 'Permutations',
        description: 'Arrangements with order',
        modules: ['combinatorics.slot-method'],
      },
      {
        id: 'combinations',
        name: 'Combinations',
        description: 'Selection without order',
        modules: [],
      },
      {
        id: 'counting-restrictions',
        name: 'Restricted Arrangements',
        description: 'Arrangements with restrictions',
        modules: ['combinatorics.non-adjacent', 'combinatorics.adjacent'],
      },
      {
        id: 'advanced-cases',
        name: 'Advanced Cases',
        description: 'Complex problems combining multiple principles',
        modules: ['combinatorics.advanced-cases'],
      },
      {
        id: 'probability-fundamentals',
        name: 'Basic Concepts',
        description: 'Sample space, events, and calculating probabilities',
        modules: ['probability.basic-concepts'],
      },
      {
        id: 'probability-rules',
        name: 'Probability Rules',
        description: 'Addition rule, multiplication rule, and special cases',
        modules: ['probability.rules'],
      },
      {
        id: 'probability-conditional',
        name: 'Conditional Probability & Bayes',
        description: 'Conditional probability and Bayes\' Theorem',
        modules: ['probability.conditional'],
      },
      {
        id: 'probability-venn-diagrams',
        name: 'Venn Diagrams',
        description: 'Set operations and probability with Venn diagrams',
        modules: ['probability.venn-diagrams'],
      },
      {
        id: 'probability-tree-diagrams',
        name: 'Tree Diagrams',
        description: 'Sequential probability using tree diagrams',
        modules: ['probability.tree-diagrams'],
      },
      {
        id: 'probability-independence',
        name: 'Independence',
        description: 'Independent and mutually exclusive events',
        modules: [],
      },
    ],
  },

  // ==========================================================================
  // STRAND 6: Distributions
  // ==========================================================================
  {
    id: 'statistics-distributions',
    name: 'Distributions',
    description: 'Probability distributions and statistical inference',
    icon: 'chart',
    color: 'teal',
    topics: [
      {
        id: 'general-discrete-rv',
        name: 'Discrete Random Variables',
        description: 'Probability distributions, expectation, and variance',
        modules: ['statistics.discrete-rv'],
      },
      {
        id: 'distribution-binomial',
        name: 'Binomial Distribution',
        description: 'Binomial probability distribution',
        modules: ['statistics.binomial-distribution'],
      },
      {
        id: 'distribution-poisson',
        name: 'Poisson Distribution',
        description: 'Poisson probability distribution',
        modules: [],
      },
      {
        id: 'distribution-normal',
        name: 'Normal Distribution',
        description: 'Normal probability distribution and Z-scores',
        modules: ['statistics.normal-distribution'],
      },
      {
        id: 'sampling-distributions',
        name: 'Sampling Distributions',
        description: 'Central Limit Theorem and sampling distributions',
        modules: ['statistics.sampling'],
      },
      {
        id: 'hypothesis-testing',
        name: 'Hypothesis Testing',
        description: 'Testing hypotheses about population parameters',
        modules: ['statistics.hypothesis-testing'],
      },
      {
        id: 'correlation-regression',
        name: 'Correlation & Regression',
        description: 'Analyzing relationships between variables',
        modules: ['statistics.correlation-regression'],
      },
    ],
  },
];

/**
 * Get a strand by ID
 */
export function getStrand(strandId: SyllabusStrand): SyllabusStrandDef | undefined {
  return SYLLABUS_STRUCTURE.find((strand) => strand.id === strandId);
}

/**
 * Get a topic by ID (searches all strands)
 */
export function getTopic(topicId: string): SyllabusTopicDef | undefined {
  for (const strand of SYLLABUS_STRUCTURE) {
    const topic = findTopicInList(topicId, strand.topics);
    if (topic) return topic;
  }
  return undefined;
}

/**
 * Helper to find a topic in a list
 */
function findTopicInList(
  topicId: string,
  topics: SyllabusTopicDef[]
): SyllabusTopicDef | undefined {
  return topics.find((topic) => topic.id === topicId);
}

/**
 * Get all topics (flattened)
 */
export function getAllTopics(): SyllabusTopicDef[] {
  const topics: SyllabusTopicDef[] = [];

  for (const strand of SYLLABUS_STRUCTURE) {
    topics.push(...strand.topics);
  }

  return topics;
}

/**
 * Get the strand that contains a specific topic
 */
export function getStrandForTopic(topicId: string): SyllabusStrandDef | undefined {
  for (const strand of SYLLABUS_STRUCTURE) {
    const topic = findTopicInList(topicId, strand.topics);
    if (topic) return strand;
  }
  return undefined;
}
