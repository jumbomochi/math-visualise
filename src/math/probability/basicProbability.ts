/**
 * Basic Probability Concepts
 *
 * Core probability calculations and concepts including:
 * - Sample spaces and events
 * - Basic probability rules
 * - Complementary events
 */

/**
 * Outcome in a sample space
 */
export interface Outcome {
  id: string;
  description: string;
  value?: any;
}

/**
 * Event (subset of sample space)
 */
export interface Event {
  id: string;
  name: string;
  outcomes: string[]; // IDs of outcomes in this event
  probability?: number;
}

/**
 * Sample space with events
 */
export interface SampleSpace {
  outcomes: Outcome[];
  totalOutcomes: number;
  events: Event[];
  description: string;
}

/**
 * Example scenario for basic probability
 */
export interface ProbabilityExample {
  id: string;
  title: string;
  context: string;
  question: string;
  sampleSpace: SampleSpace;
  targetEvent: string; // ID of the event we're finding probability for
}

/**
 * Calculate probability of an event
 */
export function calculateProbability(
  eventOutcomes: number,
  totalOutcomes: number
): number {
  if (totalOutcomes === 0) {
    throw new Error('Total outcomes cannot be zero');
  }
  return eventOutcomes / totalOutcomes;
}

/**
 * Calculate complement probability
 */
export function calculateComplement(probability: number): number {
  if (probability < 0 || probability > 1) {
    throw new Error('Probability must be between 0 and 1');
  }
  return 1 - probability;
}

/**
 * Basic probability result
 */
export interface BasicProbabilityResult {
  sampleSpace: SampleSpace;
  targetEvent: Event;
  probability: number;
  complement: number;
  formulaLatex: string;
  explanation: string[];
}

/**
 * Solve a basic probability problem
 */
export function solveBasicProbability(exampleId: string): BasicProbabilityResult {
  const example = BASIC_PROBABILITY_EXAMPLES.find(ex => ex.id === exampleId);
  if (!example) {
    throw new Error(`Example ${exampleId} not found`);
  }

  const targetEvent = example.sampleSpace.events.find(e => e.id === example.targetEvent);
  if (!targetEvent) {
    throw new Error(`Event ${example.targetEvent} not found`);
  }

  const favorableOutcomes = targetEvent.outcomes.length;
  const totalOutcomes = example.sampleSpace.totalOutcomes;
  const probability = calculateProbability(favorableOutcomes, totalOutcomes);
  const complement = calculateComplement(probability);

  // Generate explanation
  const explanation: string[] = [
    `Sample Space: ${example.sampleSpace.description}`,
    `Total number of possible outcomes: ${totalOutcomes}`,
    `Favorable outcomes for ${targetEvent.name}: ${favorableOutcomes}`,
    `Probability = Favorable outcomes / Total outcomes`,
    `P(${targetEvent.name}) = ${favorableOutcomes}/${totalOutcomes} = ${probability.toFixed(4)}`,
  ];

  // Check if it simplifies to a nice fraction
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(favorableOutcomes, totalOutcomes);
  const simplifiedNum = favorableOutcomes / divisor;
  const simplifiedDen = totalOutcomes / divisor;

  let formulaLatex: string;
  if (simplifiedNum === favorableOutcomes) {
    formulaLatex = `P(${targetEvent.name}) = \\frac{${favorableOutcomes}}{${totalOutcomes}}`;
  } else {
    formulaLatex = `P(${targetEvent.name}) = \\frac{${favorableOutcomes}}{${totalOutcomes}} = \\frac{${simplifiedNum}}{${simplifiedDen}}`;
  }

  if (probability !== simplifiedNum / simplifiedDen) {
    formulaLatex += ` \\approx ${probability.toFixed(4)}`;
  }

  return {
    sampleSpace: example.sampleSpace,
    targetEvent,
    probability,
    complement,
    formulaLatex,
    explanation,
  };
}

/**
 * Example: Rolling a Die
 */
const DIE_EXAMPLE: ProbabilityExample = {
  id: 'die',
  title: 'Rolling a Fair Die',
  context: 'A fair six-sided die is rolled once.',
  question: 'What is the probability of rolling an even number?',
  sampleSpace: {
    description: 'All possible outcomes when rolling a die',
    totalOutcomes: 6,
    outcomes: [
      { id: '1', description: 'Roll 1', value: 1 },
      { id: '2', description: 'Roll 2', value: 2 },
      { id: '3', description: 'Roll 3', value: 3 },
      { id: '4', description: 'Roll 4', value: 4 },
      { id: '5', description: 'Roll 5', value: 5 },
      { id: '6', description: 'Roll 6', value: 6 },
    ],
    events: [
      {
        id: 'even',
        name: 'Even Number',
        outcomes: ['2', '4', '6'],
      },
      {
        id: 'odd',
        name: 'Odd Number',
        outcomes: ['1', '3', '5'],
      },
      {
        id: 'greater-than-4',
        name: 'Greater than 4',
        outcomes: ['5', '6'],
      },
    ],
  },
  targetEvent: 'even',
};

/**
 * Example: Drawing a Card
 */
const CARD_EXAMPLE: ProbabilityExample = {
  id: 'card',
  title: 'Drawing from a Standard Deck',
  context: 'A card is drawn at random from a standard deck of 52 playing cards.',
  question: 'What is the probability of drawing a Heart?',
  sampleSpace: {
    description: '52 playing cards (13 ranks × 4 suits)',
    totalOutcomes: 52,
    outcomes: [], // We won't enumerate all 52 for brevity
    events: [
      {
        id: 'heart',
        name: 'Heart',
        outcomes: Array.from({ length: 13 }, (_, i) => `H${i + 1}`),
      },
      {
        id: 'red',
        name: 'Red Card',
        outcomes: [
          ...Array.from({ length: 13 }, (_, i) => `H${i + 1}`),
          ...Array.from({ length: 13 }, (_, i) => `D${i + 1}`),
        ],
      },
      {
        id: 'face',
        name: 'Face Card (J, Q, K)',
        outcomes: ['HJ', 'HQ', 'HK', 'DJ', 'DQ', 'DK', 'CJ', 'CQ', 'CK', 'SJ', 'SQ', 'SK'],
      },
    ],
  },
  targetEvent: 'heart',
};

/**
 * Example: Marble Selection
 */
const MARBLE_EXAMPLE: ProbabilityExample = {
  id: 'marble',
  title: 'Selecting Marbles from a Bag',
  context: 'A bag contains 5 red marbles, 3 blue marbles, and 2 green marbles.',
  question: 'What is the probability of randomly selecting a blue marble?',
  sampleSpace: {
    description: '10 marbles in total (5 red + 3 blue + 2 green)',
    totalOutcomes: 10,
    outcomes: [
      ...Array.from({ length: 5 }, (_, i) => ({ id: `R${i + 1}`, description: `Red marble ${i + 1}`, value: 'red' })),
      ...Array.from({ length: 3 }, (_, i) => ({ id: `B${i + 1}`, description: `Blue marble ${i + 1}`, value: 'blue' })),
      ...Array.from({ length: 2 }, (_, i) => ({ id: `G${i + 1}`, description: `Green marble ${i + 1}`, value: 'green' })),
    ],
    events: [
      {
        id: 'blue',
        name: 'Blue',
        outcomes: ['B1', 'B2', 'B3'],
      },
      {
        id: 'red',
        name: 'Red',
        outcomes: ['R1', 'R2', 'R3', 'R4', 'R5'],
      },
      {
        id: 'not-green',
        name: 'Not Green',
        outcomes: ['R1', 'R2', 'R3', 'R4', 'R5', 'B1', 'B2', 'B3'],
      },
    ],
  },
  targetEvent: 'blue',
};

/**
 * All basic probability examples
 */
export const BASIC_PROBABILITY_EXAMPLES: ProbabilityExample[] = [
  DIE_EXAMPLE,
  CARD_EXAMPLE,
  MARBLE_EXAMPLE,
];
