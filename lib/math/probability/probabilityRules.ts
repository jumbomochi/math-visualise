/**
 * Probability Rules
 *
 * Addition and Multiplication rules for probability:
 * - Addition Rule: P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
 * - Multiplication Rule: P(A ∩ B) = P(A) × P(B|A)
 * - Special cases: Mutually exclusive events, Independent events
 */

export interface ProbabilityRuleExample {
  id: string;
  title: string;
  context: string;
  question: string;
  rule: 'addition' | 'multiplication';
  eventA: EventData;
  eventB: EventData;
  intersection?: IntersectionData;
  isMutuallyExclusive?: boolean;
  isIndependent?: boolean;
}

export interface EventData {
  name: string;
  description: string;
  probability: number;
  count?: number;
}

export interface IntersectionData {
  description: string;
  probability: number;
  count?: number;
}

export interface AdditionRuleResult {
  eventA: EventData;
  eventB: EventData;
  intersection: IntersectionData;
  probA: number;
  probB: number;
  probIntersection: number;
  probUnion: number;
  isMutuallyExclusive: boolean;
  formulaLatex: string;
  steps: string[];
}

export interface MultiplicationRuleResult {
  eventA: EventData;
  eventB: EventData;
  probA: number;
  probB: number;
  probBGivenA?: number;
  probIntersection: number;
  isIndependent: boolean;
  formulaLatex: string;
  steps: string[];
}

/**
 * Calculate probability using Addition Rule
 * P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
 */
export function calculateAdditionRule(
  probA: number,
  probB: number,
  probIntersection: number,
  isMutuallyExclusive: boolean = false
): number {
  if (isMutuallyExclusive) {
    return probA + probB;
  }
  return probA + probB - probIntersection;
}

/**
 * Calculate probability using Multiplication Rule
 * P(A ∩ B) = P(A) × P(B|A)
 * If independent: P(A ∩ B) = P(A) × P(B)
 */
export function calculateMultiplicationRule(
  probA: number,
  probB: number,
  isIndependent: boolean = false,
  probBGivenA?: number
): number {
  if (isIndependent) {
    return probA * probB;
  }
  if (probBGivenA === undefined) {
    throw new Error('P(B|A) is required for dependent events');
  }
  return probA * probBGivenA;
}

/**
 * Solve addition rule problem
 */
export function solveAdditionRule(exampleId: string): AdditionRuleResult {
  const example = ADDITION_RULE_EXAMPLES.find(ex => ex.id === exampleId);
  if (!example) {
    throw new Error(`Example ${exampleId} not found`);
  }

  const probA = example.eventA.probability;
  const probB = example.eventB.probability;
  const probIntersection = example.intersection?.probability || 0;
  const isMutuallyExclusive = example.isMutuallyExclusive || false;

  const probUnion = calculateAdditionRule(probA, probB, probIntersection, isMutuallyExclusive);

  const steps: string[] = [
    `Given: P(${example.eventA.name}) = ${probA.toFixed(4)}`,
    `Given: P(${example.eventB.name}) = ${probB.toFixed(4)}`,
  ];

  if (isMutuallyExclusive) {
    steps.push(`Events are mutually exclusive (cannot both occur)`);
    steps.push(`Addition Rule: P(A ∪ B) = P(A) + P(B)`);
    steps.push(`P(${example.eventA.name} ∪ ${example.eventB.name}) = ${probA.toFixed(4)} + ${probB.toFixed(4)} = ${probUnion.toFixed(4)}`);
  } else {
    steps.push(`Given: P(${example.eventA.name} ∩ ${example.eventB.name}) = ${probIntersection.toFixed(4)}`);
    steps.push(`Addition Rule: P(A ∪ B) = P(A) + P(B) - P(A ∩ B)`);
    steps.push(`P(${example.eventA.name} ∪ ${example.eventB.name}) = ${probA.toFixed(4)} + ${probB.toFixed(4)} - ${probIntersection.toFixed(4)} = ${probUnion.toFixed(4)}`);
  }

  let formulaLatex: string;
  if (isMutuallyExclusive) {
    formulaLatex = `P(A \\cup B) = ${probA.toFixed(4)} + ${probB.toFixed(4)} = ${probUnion.toFixed(4)}`;
  } else {
    formulaLatex = `P(A \\cup B) = ${probA.toFixed(4)} + ${probB.toFixed(4)} - ${probIntersection.toFixed(4)} = ${probUnion.toFixed(4)}`;
  }

  return {
    eventA: example.eventA,
    eventB: example.eventB,
    intersection: example.intersection || { description: 'Empty (mutually exclusive)', probability: 0 },
    probA,
    probB,
    probIntersection,
    probUnion,
    isMutuallyExclusive,
    formulaLatex,
    steps,
  };
}

/**
 * Solve multiplication rule problem
 */
export function solveMultiplicationRule(exampleId: string): MultiplicationRuleResult {
  const example = MULTIPLICATION_RULE_EXAMPLES.find(ex => ex.id === exampleId);
  if (!example) {
    throw new Error(`Example ${exampleId} not found`);
  }

  const probA = example.eventA.probability;
  const probB = example.eventB.probability;
  const isIndependent = example.isIndependent || false;
  const probBGivenA = example.intersection?.probability;

  const probIntersection = calculateMultiplicationRule(probA, probB, isIndependent, probBGivenA);

  const steps: string[] = [
    `Given: P(${example.eventA.name}) = ${probA.toFixed(4)}`,
    `Given: P(${example.eventB.name}) = ${probB.toFixed(4)}`,
  ];

  if (isIndependent) {
    steps.push(`Events are independent (occurrence of one doesn't affect the other)`);
    steps.push(`Multiplication Rule: P(A ∩ B) = P(A) × P(B)`);
    steps.push(`P(${example.eventA.name} ∩ ${example.eventB.name}) = ${probA.toFixed(4)} × ${probB.toFixed(4)} = ${probIntersection.toFixed(4)}`);
  } else {
    steps.push(`Given: P(${example.eventB.name}|${example.eventA.name}) = ${probBGivenA?.toFixed(4)}`);
    steps.push(`Multiplication Rule: P(A ∩ B) = P(A) × P(B|A)`);
    steps.push(`P(${example.eventA.name} ∩ ${example.eventB.name}) = ${probA.toFixed(4)} × ${probBGivenA?.toFixed(4)} = ${probIntersection.toFixed(4)}`);
  }

  let formulaLatex: string;
  if (isIndependent) {
    formulaLatex = `P(A \\cap B) = ${probA.toFixed(4)} \\times ${probB.toFixed(4)} = ${probIntersection.toFixed(4)}`;
  } else {
    formulaLatex = `P(A \\cap B) = ${probA.toFixed(4)} \\times ${probBGivenA?.toFixed(4)} = ${probIntersection.toFixed(4)}`;
  }

  return {
    eventA: example.eventA,
    eventB: example.eventB,
    probA,
    probB,
    probBGivenA,
    probIntersection,
    isIndependent,
    formulaLatex,
    steps,
  };
}

/**
 * Addition Rule Examples
 */
export const ADDITION_RULE_EXAMPLES: ProbabilityRuleExample[] = [
  {
    id: 'card-heart-or-king',
    title: 'Card: Heart or King',
    context: 'Drawing a card from a standard 52-card deck.',
    question: 'What is the probability of drawing a Heart OR a King?',
    rule: 'addition',
    eventA: {
      name: 'Heart',
      description: 'Drawing a heart',
      probability: 13/52,
      count: 13,
    },
    eventB: {
      name: 'King',
      description: 'Drawing a king',
      probability: 4/52,
      count: 4,
    },
    intersection: {
      description: 'King of Hearts',
      probability: 1/52,
      count: 1,
    },
    isMutuallyExclusive: false,
  },
  {
    id: 'die-even-or-greater-4',
    title: 'Die: Even or Greater than 4',
    context: 'Rolling a fair six-sided die.',
    question: 'What is the probability of rolling an even number OR a number greater than 4?',
    rule: 'addition',
    eventA: {
      name: 'Even',
      description: 'Rolling 2, 4, or 6',
      probability: 3/6,
      count: 3,
    },
    eventB: {
      name: 'Greater than 4',
      description: 'Rolling 5 or 6',
      probability: 2/6,
      count: 2,
    },
    intersection: {
      description: 'Rolling 6 (even AND greater than 4)',
      probability: 1/6,
      count: 1,
    },
    isMutuallyExclusive: false,
  },
  {
    id: 'student-science-or-arts',
    title: 'Student: Science or Arts',
    context: 'In a JC, 60% of students take Science subjects and 30% take Arts subjects. No student takes both.',
    question: 'What is the probability a randomly selected student takes Science OR Arts?',
    rule: 'addition',
    eventA: {
      name: 'Science',
      description: 'Student takes Science',
      probability: 0.60,
    },
    eventB: {
      name: 'Arts',
      description: 'Student takes Arts',
      probability: 0.30,
    },
    isMutuallyExclusive: true,
  },
];

/**
 * Multiplication Rule Examples
 */
export const MULTIPLICATION_RULE_EXAMPLES: ProbabilityRuleExample[] = [
  {
    id: 'two-dice-independent',
    title: 'Two Dice (Independent)',
    context: 'Rolling two fair six-sided dice.',
    question: 'What is the probability of getting a 6 on the first die AND a 6 on the second die?',
    rule: 'multiplication',
    eventA: {
      name: 'First die = 6',
      description: 'First die shows 6',
      probability: 1/6,
    },
    eventB: {
      name: 'Second die = 6',
      description: 'Second die shows 6',
      probability: 1/6,
    },
    isIndependent: true,
  },
  {
    id: 'cards-without-replacement',
    title: 'Cards Without Replacement',
    context: 'Drawing 2 cards from a standard deck without replacement.',
    question: 'What is the probability that both cards are Aces?',
    rule: 'multiplication',
    eventA: {
      name: 'First card is Ace',
      description: 'First card drawn is an Ace',
      probability: 4/52,
    },
    eventB: {
      name: 'Second card is Ace',
      description: 'Second card drawn is an Ace',
      probability: 3/51, // This is actually P(B|A)
    },
    intersection: {
      description: 'Probability of second Ace given first was Ace',
      probability: 3/51, // P(B|A)
    },
    isIndependent: false,
  },
  {
    id: 'coin-and-die',
    title: 'Coin and Die',
    context: 'Flipping a fair coin and rolling a fair die.',
    question: 'What is the probability of getting Heads AND rolling a 5?',
    rule: 'multiplication',
    eventA: {
      name: 'Heads',
      description: 'Coin shows heads',
      probability: 1/2,
    },
    eventB: {
      name: 'Roll 5',
      description: 'Die shows 5',
      probability: 1/6,
    },
    isIndependent: true,
  },
];
