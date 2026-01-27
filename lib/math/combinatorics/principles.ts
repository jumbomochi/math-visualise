/**
 * Fundamental Counting Principles
 *
 * Pure functions for additive and multiplicative principles.
 * These are the foundation of all combinatorics.
 */

/**
 * Scenario for demonstrating counting principles
 */
export interface CountingScenario {
  description: string;
  choices: number[];
  labels: string[];
}

/**
 * Additive Principle result
 */
export interface AdditivePrincipleResult {
  scenarios: CountingScenario[];
  totalOutcomes: number;
  formula: string;
  formulaLatex: string;
  explanation: string[];
  principle: string;
}

/**
 * Multiplicative Principle result
 */
export interface MultiplicativePrincipleResult {
  stages: CountingScenario;
  totalOutcomes: number;
  formula: string;
  formulaLatex: string;
  explanation: string[];
  principle: string;
}

/**
 * Calculate using the Additive Principle
 *
 * Use when: Events are mutually exclusive (can't happen at the same time)
 * Rule: ADD the number of ways for each event
 *
 * Example: Travel from A to B by bus (5 ways) OR train (3 ways)
 * Answer: 5 + 3 = 8 ways
 *
 * @param scenarios - Array of mutually exclusive scenarios
 * @returns Calculation result
 */
export function calculateAdditivePrinciple(
  scenarios: CountingScenario[]
): AdditivePrincipleResult {
  const totalOutcomes = scenarios.reduce((sum, scenario) => {
    const scenarioTotal = scenario.choices.reduce((a, b) => a + b, 0);
    return sum + scenarioTotal;
  }, 0);

  const parts: string[] = [];
  const latexParts: string[] = [];
  const explanation: string[] = [];

  scenarios.forEach((scenario, index) => {
    const scenarioSum = scenario.choices.reduce((a, b) => a + b, 0);

    if (scenario.choices.length > 1) {
      const choicesStr = scenario.choices.join(' + ');
      parts.push(`(${choicesStr})`);
      latexParts.push(`(${choicesStr})`);
    } else {
      parts.push(`${scenarioSum}`);
      latexParts.push(`${scenarioSum}`);
    }

    explanation.push(
      `**Scenario ${index + 1}:** ${scenario.description} → ${scenarioSum} way${scenarioSum !== 1 ? 's' : ''}`
    );
  });

  const formula = parts.join(' + ') + ` = ${totalOutcomes}`;
  const formulaLatex = latexParts.join(' + ') + ` = ${totalOutcomes}`;

  explanation.push(
    `\n**Additive Principle Applied:** Since these scenarios are mutually exclusive (only ONE can happen), we ADD the number of ways.`
  );

  return {
    scenarios,
    totalOutcomes,
    formula,
    formulaLatex,
    explanation,
    principle: 'If event A can occur in m ways and event B can occur in n ways, and A and B cannot occur together, then A OR B can occur in m + n ways.',
  };
}

/**
 * Calculate using the Multiplicative Principle
 *
 * Use when: Events occur in sequence (one after another)
 * Rule: MULTIPLY the number of choices at each stage
 *
 * Example: Choose outfit - 4 shirts AND 3 pants
 * Answer: 4 × 3 = 12 outfits
 *
 * @param stages - Sequential choices
 * @returns Calculation result
 */
export function calculateMultiplicativePrinciple(
  stages: CountingScenario
): MultiplicativePrincipleResult {
  const totalOutcomes = stages.choices.reduce((product, choice) => product * choice, 1);

  const formula = stages.choices.join(' × ') + ` = ${totalOutcomes}`;
  const formulaLatex = stages.choices.join(' \\times ') + ` = ${totalOutcomes}`;

  const explanation: string[] = [];

  stages.choices.forEach((choices, index) => {
    explanation.push(
      `**Stage ${index + 1}:** ${stages.labels[index]} → ${choices} choice${choices !== 1 ? 's' : ''}`
    );
  });

  explanation.push(
    `\n**Multiplicative Principle Applied:** Since these stages occur in sequence (one THEN another), we MULTIPLY the number of choices.`
  );

  return {
    stages,
    totalOutcomes,
    formula,
    formulaLatex,
    explanation,
    principle: 'If event A can occur in m ways and event B can occur in n ways, then A AND B occurring in sequence can occur in m × n ways.',
  };
}

/**
 * Example with context for real-life scenarios
 */
export interface ExampleScenario {
  id: string;
  title: string;
  context: string;
  question: string;
  scenarios?: CountingScenario[];
  stages?: CountingScenario;
}

/**
 * Real-life examples for Additive Principle
 */
export const ADDITIVE_EXAMPLES: ExampleScenario[] = [
  {
    id: 'travel',
    title: 'Travel to School',
    context: 'Sarah wants to travel from her home in Jurong to her school in Tampines.',
    question: 'How many different ways can she travel if she can take a bus, MRT, or carpool?',
    scenarios: [
      {
        description: 'Bus routes available',
        choices: [6],
        labels: ['Bus routes'],
      },
      {
        description: 'MRT route options (via different interchanges)',
        choices: [3],
        labels: ['MRT routes'],
      },
      {
        description: 'Carpool options (different parents)',
        choices: [2],
        labels: ['Carpool arrangements'],
      },
    ],
  },
  {
    id: 'meal',
    title: 'School Canteen Lunch',
    context: 'The school canteen offers set meals from different stalls.',
    question: 'How many different set meal options are available?',
    scenarios: [
      {
        description: 'Chinese stall set meals',
        choices: [5],
        labels: ['Chinese sets'],
      },
      {
        description: 'Malay stall set meals',
        choices: [4],
        labels: ['Malay sets'],
      },
      {
        description: 'Western stall set meals',
        choices: [3],
        labels: ['Western sets'],
      },
      {
        description: 'Vegetarian stall set meals',
        choices: [2],
        labels: ['Vegetarian sets'],
      },
    ],
  },
  {
    id: 'electives',
    title: 'H2 Subject Selection',
    context: 'A JC student needs to choose ONE H2 contrasting subject to complement their science stream.',
    question: 'How many choices does the student have?',
    scenarios: [
      {
        description: 'Humanities subjects offered',
        choices: [4],
        labels: ['Humanities (Econs, Geog, Hist, Lit)'],
      },
      {
        description: 'Language subjects offered',
        choices: [3],
        labels: ['Languages (Chinese, Malay, Tamil)'],
      },
      {
        description: 'Arts subject offered',
        choices: [1],
        labels: ['Arts (Art)'],
      },
    ],
  },
];

/**
 * Real-life examples for Multiplicative Principle
 */
export const MULTIPLICATIVE_EXAMPLES: ExampleScenario[] = [
  {
    id: 'password',
    title: 'Student Portal Password',
    context: 'Creating a secure password for the school portal with specific requirements.',
    question: 'How many different 4-character passwords can be created?',
    stages: {
      description: 'Password creation (1 uppercase, 2 digits, 1 symbol)',
      choices: [26, 10, 10, 8],
      labels: ['Uppercase letter', 'First digit', 'Second digit', 'Symbol (!@#$%^&*)'],
    },
  },
  {
    id: 'outfit',
    title: 'School Event Outfit',
    context: 'Students can wear casual clothes for the school carnival.',
    question: 'How many different outfit combinations are possible?',
    stages: {
      description: 'Choosing an outfit',
      choices: [5, 4, 3],
      labels: ['T-shirts', 'Pants/Shorts', 'Shoes'],
    },
  },
  {
    id: 'food-order',
    title: 'Fast Food Combo',
    context: 'A fast food restaurant offers customizable combo meals.',
    question: 'How many different combo meals can be ordered?',
    stages: {
      description: 'Building a combo meal',
      choices: [6, 4, 5, 3],
      labels: ['Main (burger/chicken)', 'Side dish', 'Drink', 'Sauce'],
    },
  },
];

/**
 * Create a sample additive principle problem
 */
export function createAdditiveSample(exampleId?: string): AdditivePrincipleResult {
  const example = ADDITIVE_EXAMPLES.find(ex => ex.id === exampleId) || ADDITIVE_EXAMPLES[0];
  return calculateAdditivePrinciple(example.scenarios!);
}

/**
 * Create a sample multiplicative principle problem
 */
export function createMultiplicativeSample(exampleId?: string): MultiplicativePrincipleResult {
  const example = MULTIPLICATIVE_EXAMPLES.find(ex => ex.id === exampleId) || MULTIPLICATIVE_EXAMPLES[0];
  return calculateMultiplicativePrinciple(example.stages!);
}
