/**
 * Conditional Probability and Bayes' Theorem
 *
 * Formulas:
 * - Conditional Probability: P(A|B) = P(A ∩ B) / P(B)
 * - Bayes' Theorem: P(A|B) = P(B|A) × P(A) / P(B)
 * - Law of Total Probability: P(B) = P(B|A) × P(A) + P(B|A') × P(A')
 */

export interface ConditionalProbabilityData {
  eventA: string;
  eventB: string;
  probA: number;
  probB: number;
  probAandB: number;
  probBgivenA?: number;
  probAgivenB?: number;
}

export interface BayesTheoremData {
  hypothesis: string;
  evidence: string;
  priorProbability: number; // P(H)
  likelihoodGivenTrue: number; // P(E|H)
  likelihoodGivenFalse: number; // P(E|H')
}

export interface ConditionalProbabilityExample {
  id: string;
  title: string;
  context: string;
  question: string;
  data: ConditionalProbabilityData;
  type: 'conditional' | 'bayes';
  bayesData?: BayesTheoremData;
}

export interface ConditionalProbabilityResult {
  eventA: string;
  eventB: string;
  probA: number;
  probB: number;
  probAandB: number;
  probAgivenB: number;
  probBgivenA: number;
  formulaLatex: string;
  steps: string[];
}

export interface BayesTheoremResult {
  hypothesis: string;
  evidence: string;
  priorProbability: number;
  posteriorProbability: number;
  likelihoodGivenTrue: number;
  likelihoodGivenFalse: number;
  probEvidence: number;
  formulaLatex: string;
  steps: string[];
}

/**
 * Calculate conditional probability P(A|B)
 */
export function calculateConditionalProbability(
  probAandB: number,
  probB: number
): number {
  if (probB === 0) {
    throw new Error('P(B) cannot be zero for conditional probability');
  }
  return probAandB / probB;
}

/**
 * Calculate using Bayes' Theorem
 */
export function calculateBayesTheorem(
  priorProbability: number,
  likelihoodGivenTrue: number,
  likelihoodGivenFalse: number
): BayesTheoremResult {
  // P(H') = 1 - P(H)
  const probNotH = 1 - priorProbability;

  // P(E) = P(E|H) × P(H) + P(E|H') × P(H')
  const probEvidence = likelihoodGivenTrue * priorProbability + likelihoodGivenFalse * probNotH;

  // P(H|E) = P(E|H) × P(H) / P(E)
  const posteriorProbability = (likelihoodGivenTrue * priorProbability) / probEvidence;

  const steps: string[] = [
    `Prior Probability: P(H) = ${priorProbability.toFixed(4)}`,
    `Complement: P(H') = 1 - ${priorProbability.toFixed(4)} = ${probNotH.toFixed(4)}`,
    `Likelihood if H is true: P(E|H) = ${likelihoodGivenTrue.toFixed(4)}`,
    `Likelihood if H is false: P(E|H') = ${likelihoodGivenFalse.toFixed(4)}`,
    `Law of Total Probability: P(E) = P(E|H) × P(H) + P(E|H') × P(H')`,
    `P(E) = ${likelihoodGivenTrue.toFixed(4)} × ${priorProbability.toFixed(4)} + ${likelihoodGivenFalse.toFixed(4)} × ${probNotH.toFixed(4)} = ${probEvidence.toFixed(4)}`,
    `Bayes' Theorem: P(H|E) = P(E|H) × P(H) / P(E)`,
    `P(H|E) = ${likelihoodGivenTrue.toFixed(4)} × ${priorProbability.toFixed(4)} / ${probEvidence.toFixed(4)} = ${posteriorProbability.toFixed(4)}`,
  ];

  const formulaLatex = `P(H|E) = \\frac{P(E|H) \\times P(H)}{P(E)} = \\frac{${likelihoodGivenTrue.toFixed(4)} \\times ${priorProbability.toFixed(4)}}{${probEvidence.toFixed(4)}} = ${posteriorProbability.toFixed(4)}`;

  return {
    hypothesis: 'H',
    evidence: 'E',
    priorProbability,
    posteriorProbability,
    likelihoodGivenTrue,
    likelihoodGivenFalse,
    probEvidence,
    formulaLatex,
    steps,
  };
}

/**
 * Solve conditional probability problem
 */
export function solveConditionalProbability(exampleId: string): ConditionalProbabilityResult {
  const example = CONDITIONAL_PROBABILITY_EXAMPLES.find(ex => ex.id === exampleId);
  if (!example) {
    throw new Error(`Example ${exampleId} not found`);
  }

  const { eventA, eventB, probA, probB, probAandB } = example.data;

  // Calculate P(A|B) and P(B|A)
  const probAgivenB = calculateConditionalProbability(probAandB, probB);
  const probBgivenA = calculateConditionalProbability(probAandB, probA);

  const steps: string[] = [
    `Given: P(${eventA}) = ${probA.toFixed(4)}`,
    `Given: P(${eventB}) = ${probB.toFixed(4)}`,
    `Given: P(${eventA} ∩ ${eventB}) = ${probAandB.toFixed(4)}`,
    ``,
    `Calculate P(${eventA}|${eventB}):`,
    `P(${eventA}|${eventB}) = P(${eventA} ∩ ${eventB}) / P(${eventB})`,
    `P(${eventA}|${eventB}) = ${probAandB.toFixed(4)} / ${probB.toFixed(4)} = ${probAgivenB.toFixed(4)}`,
    ``,
    `Calculate P(${eventB}|${eventA}):`,
    `P(${eventB}|${eventA}) = P(${eventA} ∩ ${eventB}) / P(${eventA})`,
    `P(${eventB}|${eventA}) = ${probAandB.toFixed(4)} / ${probA.toFixed(4)} = ${probBgivenA.toFixed(4)}`,
  ];

  const formulaLatex = `P(A|B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{${probAandB.toFixed(4)}}{${probB.toFixed(4)}} = ${probAgivenB.toFixed(4)}`;

  return {
    eventA,
    eventB,
    probA,
    probB,
    probAandB,
    probAgivenB,
    probBgivenA,
    formulaLatex,
    steps,
  };
}

/**
 * Solve Bayes' Theorem problem
 */
export function solveBayesTheorem(exampleId: string): BayesTheoremResult {
  const example = CONDITIONAL_PROBABILITY_EXAMPLES.find(ex => ex.id === exampleId);
  if (!example || !example.bayesData) {
    throw new Error(`Bayes example ${exampleId} not found`);
  }

  const { priorProbability, likelihoodGivenTrue, likelihoodGivenFalse } = example.bayesData;

  return calculateBayesTheorem(priorProbability, likelihoodGivenTrue, likelihoodGivenFalse);
}

/**
 * Conditional Probability Examples
 */
export const CONDITIONAL_PROBABILITY_EXAMPLES: ConditionalProbabilityExample[] = [
  {
    id: 'cards-face-given-red',
    title: 'Cards: Face Card given Red',
    context: 'A card is drawn from a standard 52-card deck.',
    question: 'Given that the card is red, what is the probability it is a face card (J, Q, K)?',
    type: 'conditional',
    data: {
      eventA: 'Face Card',
      eventB: 'Red Card',
      probA: 12/52, // 12 face cards total
      probB: 26/52, // 26 red cards
      probAandB: 6/52, // 6 red face cards (3 hearts + 3 diamonds)
    },
  },
  {
    id: 'students-science-given-female',
    title: 'Students: Science given Female',
    context: 'In a JC, 60% of students are female. Among females, 40% take Science. Among males, 70% take Science.',
    question: 'Given a student takes Science, what is the probability the student is female?',
    type: 'conditional',
    data: {
      eventA: 'Female',
      eventB: 'Science',
      probA: 0.60,
      probB: 0.60 * 0.40 + 0.40 * 0.70, // P(Science) = P(S|F)×P(F) + P(S|M)×P(M)
      probAandB: 0.60 * 0.40, // P(Female and Science)
    },
  },
  {
    id: 'medical-test-bayes',
    title: 'Medical Test (Bayes Theorem)',
    context: 'A disease affects 1% of the population. A test for the disease is 95% accurate when the person has the disease (true positive) and 90% accurate when the person does not have the disease (true negative).',
    question: 'If a person tests positive, what is the probability they actually have the disease?',
    type: 'bayes',
    data: {
      eventA: 'Disease',
      eventB: 'Positive Test',
      probA: 0.01,
      probB: 0, // Will be calculated
      probAandB: 0, // Will be calculated
    },
    bayesData: {
      hypothesis: 'Has Disease',
      evidence: 'Positive Test',
      priorProbability: 0.01, // 1% prevalence
      likelihoodGivenTrue: 0.95, // P(Positive | Disease)
      likelihoodGivenFalse: 0.10, // P(Positive | No Disease) = 1 - 0.90
    },
  },
  {
    id: 'quality-control-bayes',
    title: 'Quality Control (Bayes)',
    context: 'A factory has two machines A and B. Machine A produces 60% of items and has 2% defect rate. Machine B produces 40% of items and has 5% defect rate.',
    question: 'If an item is found to be defective, what is the probability it came from Machine A?',
    type: 'bayes',
    data: {
      eventA: 'Machine A',
      eventB: 'Defective',
      probA: 0.60,
      probB: 0, // Will be calculated
      probAandB: 0, // Will be calculated
    },
    bayesData: {
      hypothesis: 'From Machine A',
      evidence: 'Defective',
      priorProbability: 0.60,
      likelihoodGivenTrue: 0.02, // P(Defective | Machine A)
      likelihoodGivenFalse: 0.05, // P(Defective | Machine B)
    },
  },
];
