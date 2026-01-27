/**
 * Restricted Arrangements
 *
 * Pure functions for arrangements with restrictions:
 * 1. Non-adjacent (objects cannot be next to each other)
 * 2. Adjacent (objects must be together - grouping method)
 */

import { factorial } from './slotMethod';

/**
 * Non-adjacent arrangement configuration
 */
export interface NonAdjacentConfig {
  totalItems: number;
  restrictedItems: number;
  itemLabels?: string[];
  restrictedLabels?: string[];
}

/**
 * Non-adjacent arrangement result
 */
export interface NonAdjacentResult {
  totalArrangements: number;
  formula: string;
  formulaLatex: string;
  steps: StepExplanation[];
  visualization: {
    normalPositions: number;
    gaps: number;
    gapPositions: number[];
  };
}

/**
 * Adjacent (grouping) arrangement configuration
 */
export interface AdjacentConfig {
  totalItems: number;
  groupItems: number;
  itemLabels?: string[];
  groupLabels?: string[];
}

/**
 * Adjacent arrangement result
 */
export interface AdjacentResult {
  totalArrangements: number;
  formula: string;
  formulaLatex: string;
  steps: StepExplanation[];
  visualization: {
    groupAsOne: boolean;
    unitsToArrange: number;
    internalArrangements: number;
  };
}

/**
 * Step explanation
 */
export interface StepExplanation {
  step: number;
  description: string;
  calculation: string;
  result: number;
}

/**
 * Calculate arrangements with NON-ADJACENT restriction
 *
 * Problem: Arrange n items where r specific items CANNOT be next to each other
 *
 * Method (Slotting):
 * 1. Arrange the (n-r) normal items: (n-r)! ways
 * 2. This creates (n-r+1) gaps (before, between, after)
 * 3. Place r restricted items in these gaps: P(n-r+1, r) ways
 * 4. Total: (n-r)! × P(n-r+1, r)
 *
 * Example: Arrange 5 people where 2 specific people cannot sit together
 * - Arrange 3 normal people: 3! = 6 ways
 * - Creates 4 gaps: _P1_P2_P3_
 * - Place 2 restricted in 4 gaps: P(4,2) = 12 ways
 * - Total: 6 × 12 = 72 ways
 *
 * @param config - Configuration
 * @returns Calculation result
 */
export function calculateNonAdjacent(config: NonAdjacentConfig): NonAdjacentResult {
  const { totalItems, restrictedItems } = config;
  const normalItems = totalItems - restrictedItems;

  // Validate
  if (restrictedItems > normalItems + 1) {
    throw new Error(
      'Cannot arrange: too many restricted items for available gaps. ' +
      `Need at least ${restrictedItems - 1} normal items to separate ${restrictedItems} restricted items.`
    );
  }

  // Step 1: Arrange normal items
  const normalArrangements = factorial(normalItems);

  // Step 2: Calculate gaps
  const gaps = normalItems + 1;

  // Step 3: Place restricted items in gaps (permutation)
  let gapArrangements = 1;
  for (let i = 0; i < restrictedItems; i++) {
    gapArrangements *= (gaps - i);
  }

  // Step 4: Total
  const totalArrangements = normalArrangements * gapArrangements;

  // Build formula
  const formula = `${normalItems}! × P(${gaps}, ${restrictedItems}) = ${normalArrangements} × ${gapArrangements} = ${totalArrangements}`;
  const formulaLatex = `${normalItems}! \\times P(${gaps}, ${restrictedItems}) = ${normalArrangements} \\times ${gapArrangements} = ${totalArrangements}`;

  // Build steps
  const steps: StepExplanation[] = [
    {
      step: 1,
      description: `Arrange the ${normalItems} normal items (items that can be adjacent)`,
      calculation: `${normalItems}!`,
      result: normalArrangements,
    },
    {
      step: 2,
      description: `This creates ${gaps} gaps (before first, between each, after last)`,
      calculation: `${normalItems} items → ${gaps} gaps`,
      result: gaps,
    },
    {
      step: 3,
      description: `Place ${restrictedItems} restricted items in ${gaps} available gaps`,
      calculation: `P(${gaps}, ${restrictedItems})`,
      result: gapArrangements,
    },
    {
      step: 4,
      description: 'Multiply the arrangements (multiplicative principle)',
      calculation: `${normalArrangements} × ${gapArrangements}`,
      result: totalArrangements,
    },
  ];

  // Generate gap positions for visualization
  const gapPositions: number[] = [];
  for (let i = 0; i <= normalItems; i++) {
    gapPositions.push(i);
  }

  return {
    totalArrangements,
    formula,
    formulaLatex,
    steps,
    visualization: {
      normalPositions: normalItems,
      gaps,
      gapPositions,
    },
  };
}

/**
 * Calculate arrangements with ADJACENT restriction (Grouping Method)
 *
 * Problem: Arrange n items where r specific items MUST be together
 *
 * Method (Grouping):
 * 1. Treat r items as ONE unit
 * 2. Now have (n-r+1) units to arrange: (n-r+1)! ways
 * 3. Within the group, arrange r items: r! ways
 * 4. Total: (n-r+1)! × r!
 *
 * Example: Arrange 5 people where 2 specific people must sit together
 * - Treat 2 as one unit: [AB] C D E
 * - Arrange 4 units: 4! = 24 ways
 * - Arrange within group: 2! = 2 ways (AB or BA)
 * - Total: 24 × 2 = 48 ways
 *
 * @param config - Configuration
 * @returns Calculation result
 */
export function calculateAdjacent(config: AdjacentConfig): AdjacentResult {
  const { totalItems, groupItems } = config;
  const unitsToArrange = totalItems - groupItems + 1;

  // Step 1: Arrange units (treating group as one)
  const unitArrangements = factorial(unitsToArrange);

  // Step 2: Arrange within the group
  const internalArrangements = factorial(groupItems);

  // Step 3: Total
  const totalArrangements = unitArrangements * internalArrangements;

  // Build formula
  const formula = `${unitsToArrange}! × ${groupItems}! = ${unitArrangements} × ${internalArrangements} = ${totalArrangements}`;
  const formulaLatex = `${unitsToArrange}! \\times ${groupItems}! = ${unitArrangements} \\times ${internalArrangements} = ${totalArrangements}`;

  // Build steps
  const steps: StepExplanation[] = [
    {
      step: 1,
      description: `Treat ${groupItems} adjacent items as ONE unit (they must be together)`,
      calculation: `${totalItems} items → ${unitsToArrange} units`,
      result: unitsToArrange,
    },
    {
      step: 2,
      description: `Arrange the ${unitsToArrange} units (including the grouped unit)`,
      calculation: `${unitsToArrange}!`,
      result: unitArrangements,
    },
    {
      step: 3,
      description: `Arrange the ${groupItems} items within the group`,
      calculation: `${groupItems}!`,
      result: internalArrangements,
    },
    {
      step: 4,
      description: 'Multiply the arrangements (multiplicative principle)',
      calculation: `${unitArrangements} × ${internalArrangements}`,
      result: totalArrangements,
    },
  ];

  return {
    totalArrangements,
    formula,
    formulaLatex,
    steps,
    visualization: {
      groupAsOne: true,
      unitsToArrange,
      internalArrangements,
    },
  };
}

/**
 * Validate non-adjacent configuration
 */
export function validateNonAdjacent(config: NonAdjacentConfig): string[] {
  const errors: string[] = [];
  const { totalItems, restrictedItems } = config;

  if (totalItems < 2) {
    errors.push('Need at least 2 items total');
  }

  if (restrictedItems < 2) {
    errors.push('Need at least 2 restricted items for non-adjacent restriction');
  }

  if (restrictedItems >= totalItems) {
    errors.push('Restricted items must be less than total items');
  }

  const normalItems = totalItems - restrictedItems;
  if (restrictedItems > normalItems + 1) {
    errors.push(
      `Cannot separate ${restrictedItems} items with only ${normalItems} normal items. ` +
      `Need at least ${restrictedItems - 1} normal items.`
    );
  }

  return errors;
}

/**
 * Validate adjacent configuration
 */
export function validateAdjacent(config: AdjacentConfig): string[] {
  const errors: string[] = [];
  const { totalItems, groupItems } = config;

  if (totalItems < 2) {
    errors.push('Need at least 2 items total');
  }

  if (groupItems < 2) {
    errors.push('Need at least 2 items in the group');
  }

  if (groupItems > totalItems) {
    errors.push('Group items cannot exceed total items');
  }

  return errors;
}

/**
 * Example scenario for non-adjacent arrangements
 */
export interface NonAdjacentExample {
  id: string;
  title: string;
  context: string;
  question: string;
  config: NonAdjacentConfig;
}

/**
 * Example scenario for adjacent arrangements
 */
export interface AdjacentExample {
  id: string;
  title: string;
  context: string;
  question: string;
  config: AdjacentConfig;
}

/**
 * Real-life examples for Non-Adjacent Arrangements
 */
export const NON_ADJACENT_EXAMPLES: NonAdjacentExample[] = [
  {
    id: 'couple-seating',
    title: 'Couple Seating',
    context: 'At a dinner party, there are 7 people including 2 married couples. The host wants to arrange them in a row.',
    question: 'In how many ways can they be seated if no married couple sits next to each other?',
    config: {
      totalItems: 7,
      restrictedItems: 2,
    },
  },
  {
    id: 'task-scheduling',
    title: 'Task Scheduling',
    context: 'A student has 6 tasks to complete, including 2 difficult math assignments that require mental breaks between them.',
    question: 'How many schedules are possible if the math assignments cannot be done consecutively?',
    config: {
      totalItems: 6,
      restrictedItems: 2,
    },
  },
  {
    id: 'garden-plants',
    title: 'Garden Planting',
    context: 'A gardener is planting 8 different plants in a row. Three of them are tomato plants that need to be separated to prevent disease spread.',
    question: 'How many planting arrangements keep the tomato plants non-adjacent?',
    config: {
      totalItems: 8,
      restrictedItems: 3,
    },
  },
];

/**
 * Real-life examples for Adjacent Arrangements
 */
export const ADJACENT_EXAMPLES: AdjacentExample[] = [
  {
    id: 'family-photo',
    title: 'Family Photo',
    context: 'A family of 6 (parents and 4 children) is taking a photo. The parents want to stand next to each other.',
    question: 'How many arrangements are possible if the parents must be adjacent?',
    config: {
      totalItems: 6,
      groupItems: 2,
    },
  },
  {
    id: 'friend-queue',
    title: 'Queue at Canteen',
    context: 'Seven students are queuing for lunch. Three best friends want to stay together in the queue.',
    question: 'In how many ways can they line up if the 3 friends must be adjacent?',
    config: {
      totalItems: 7,
      groupItems: 3,
    },
  },
  {
    id: 'book-shelf',
    title: 'Bookshelf Organization',
    context: 'A student has 9 books to arrange on a shelf, including a 4-volume encyclopedia set that must be kept together.',
    question: 'How many arrangements keep the encyclopedia volumes adjacent?',
    config: {
      totalItems: 9,
      groupItems: 4,
    },
  },
];

/**
 * Create a sample non-adjacent problem
 */
export function createNonAdjacentSample(exampleId?: string): NonAdjacentResult {
  const example = NON_ADJACENT_EXAMPLES.find(ex => ex.id === exampleId) || NON_ADJACENT_EXAMPLES[0];
  return calculateNonAdjacent(example.config);
}

/**
 * Create a sample adjacent problem
 */
export function createAdjacentSample(exampleId?: string): AdjacentResult {
  const example = ADJACENT_EXAMPLES.find(ex => ex.id === exampleId) || ADJACENT_EXAMPLES[0];
  return calculateAdjacent(example.config);
}
