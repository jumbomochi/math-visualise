/**
 * Slot Method for Permutations
 *
 * Pure mathematical functions for calculating permutations using
 * the slot method. Completely independent of UI/React.
 *
 * The slot method is a systematic way to count arrangements by
 * considering each position (slot) and counting available choices.
 */

/**
 * Configuration for slot-based permutation calculation
 */
export interface SlotConfiguration {
  /** Total number of items available */
  totalItems: number;

  /** Number of positions to fill */
  totalPositions: number;

  /** Optional restrictions on specific positions */
  restrictions?: SlotRestriction[];

  /** Whether repetition is allowed */
  allowRepetition?: boolean;
}

/**
 * Restriction on a specific slot position
 */
export interface SlotRestriction {
  /** Position index (0-based) */
  position: number;

  /** Items that MUST be in this position (whitelist) */
  allowedItems?: string[];

  /** Items that CANNOT be in this position (blacklist) */
  forbiddenItems?: string[];

  /** Specific item that must be in this position */
  fixedItem?: string;
}

/**
 * Calculation result for a single slot
 */
export interface SlotCalculation {
  /** Position index (0-based) */
  position: number;

  /** Number of available choices for this slot */
  availableChoices: number;

  /** Human-readable explanation */
  explanation: string;

  /** Detailed reasoning */
  reasoning: string;

  /** Items available for this slot */
  availableItems?: string[];
}

/**
 * Complete slot method calculation result
 */
export interface SlotMethodResult {
  /** Total number of arrangements */
  totalArrangements: number;

  /** Breakdown for each slot */
  slots: SlotCalculation[];

  /** Mathematical formula as string */
  formula: string;

  /** LaTeX formula for rendering */
  formulaLatex: string;

  /** Step-by-step explanation */
  steps: string[];
}

/**
 * Calculate permutations using the slot method
 *
 * This is a pure function with no side effects or UI dependencies.
 *
 * @param config - Configuration object
 * @returns Complete calculation result
 */
export function calculateSlotPermutations(
  config: SlotConfiguration
): SlotMethodResult {
  const {
    totalItems,
    totalPositions,
    restrictions = [],
    allowRepetition = false,
  } = config;

  // Validate inputs
  if (totalItems <= 0) {
    throw new Error('Total items must be positive');
  }

  if (totalPositions <= 0) {
    throw new Error('Total positions must be positive');
  }

  if (!allowRepetition && totalPositions > totalItems) {
    throw new Error('Cannot fill more positions than available items without repetition');
  }

  // Build slot calculations
  const slots: SlotCalculation[] = [];
  const formulaParts: string[] = [];
  const steps: string[] = [];

  let totalArrangements = 1;

  for (let pos = 0; pos < totalPositions; pos++) {
    const restriction = restrictions.find((r) => r.position === pos);

    let availableChoices: number;
    let explanation: string;
    let reasoning: string;

    if (restriction?.fixedItem) {
      // Fixed item in this position
      availableChoices = 1;
      explanation = '1 choice (fixed)';
      reasoning = `Position ${pos + 1} must contain "${restriction.fixedItem}"`;
    } else if (restriction?.allowedItems && restriction.allowedItems.length > 0) {
      // Whitelist restriction
      availableChoices = restriction.allowedItems.length;
      explanation = `${availableChoices} choice${availableChoices !== 1 ? 's' : ''} (restricted)`;
      reasoning = `Position ${pos + 1} can only contain: ${restriction.allowedItems.join(', ')}`;
    } else if (restriction?.forbiddenItems && restriction.forbiddenItems.length > 0) {
      // Blacklist restriction
      const forbiddenCount = restriction.forbiddenItems.length;
      if (allowRepetition) {
        availableChoices = totalItems - forbiddenCount;
      } else {
        availableChoices = (totalItems - pos) - forbiddenCount;
      }
      explanation = `${availableChoices} choices (${forbiddenCount} forbidden)`;
      reasoning = `Position ${pos + 1} cannot contain: ${restriction.forbiddenItems.join(', ')}`;
    } else {
      // No restriction
      if (allowRepetition) {
        availableChoices = totalItems;
        explanation = `${totalItems} choices (any item)`;
        reasoning = `Position ${pos + 1} can use any of the ${totalItems} items (repetition allowed)`;
      } else {
        availableChoices = totalItems - pos;
        explanation = `${availableChoices} choices remaining`;
        reasoning = `Position ${pos + 1} can use any of the ${availableChoices} remaining items`;
      }
    }

    slots.push({
      position: pos,
      availableChoices,
      explanation,
      reasoning,
    });

    formulaParts.push(availableChoices.toString());
    totalArrangements *= availableChoices;

    steps.push(
      `**Step ${pos + 1}:** ${reasoning} → ${availableChoices} choice${availableChoices !== 1 ? 's' : ''}`
    );
  }

  // Build formula string
  const formula = formulaParts.join(' × ') + ` = ${totalArrangements}`;
  const formulaLatex = formulaParts.join(' \\times ') + ` = ${totalArrangements}`;

  steps.push(
    `\n**Final Answer:** ${formula}\n\nTotal arrangements = **${totalArrangements}**`
  );

  return {
    totalArrangements,
    slots,
    formula,
    formulaLatex,
    steps,
  };
}

/**
 * Calculate standard permutation P(n, r) = n!/(n-r)!
 *
 * @param n - Total items
 * @param r - Items to select
 * @returns Number of permutations
 */
export function permutation(n: number, r: number): number {
  if (r > n || r < 0 || n < 0) {
    return 0;
  }

  if (r === 0) {
    return 1;
  }

  let result = 1;
  for (let i = 0; i < r; i++) {
    result *= n - i;
  }

  return result;
}

/**
 * Calculate factorial n!
 *
 * @param n - Number
 * @returns Factorial
 */
export function factorial(n: number): number {
  if (n < 0) {
    throw new Error('Factorial not defined for negative numbers');
  }

  if (n === 0 || n === 1) {
    return 1;
  }

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }

  return result;
}

/**
 * Generate all possible arrangements (for visualization)
 *
 * WARNING: Only use for small values (n ≤ 8) as this grows factorially.
 *
 * @param items - Array of items
 * @param positions - Number of positions
 * @returns Array of all arrangements
 */
export function generateArrangements(
  items: string[],
  positions: number
): string[][] {
  if (positions > items.length) {
    return [];
  }

  if (positions === 0) {
    return [[]];
  }

  if (positions === 1) {
    return items.map((item) => [item]);
  }

  const arrangements: string[][] = [];

  function permute(arr: string[], used: Set<number>, current: string[]) {
    if (current.length === positions) {
      arrangements.push([...current]);
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      if (used.has(i)) continue;

      current.push(arr[i]);
      used.add(i);
      permute(arr, used, current);
      used.delete(i);
      current.pop();
    }
  }

  permute(items, new Set(), []);

  return arrangements;
}

/**
 * Check if a number is a valid permutation result
 *
 * @param n - Total items
 * @param r - Positions
 * @param result - Expected result
 * @returns Whether the result is correct
 */
export function validatePermutation(n: number, r: number, result: number): boolean {
  return permutation(n, r) === result;
}

/**
 * Example scenario with real-life context
 */
export interface SlotMethodExample {
  id: string;
  title: string;
  context: string;
  question: string;
  config: SlotConfiguration;
}

/**
 * Real-life examples for Slot Method
 */
export const SLOT_METHOD_EXAMPLES: SlotMethodExample[] = [
  {
    id: 'student-photo',
    title: 'Class Photo Arrangement',
    context: 'A photographer is arranging 5 students in a row for a class photo.',
    question: 'How many different arrangements are possible?',
    config: {
      totalItems: 5,
      totalPositions: 5,
      allowRepetition: false,
    },
  },
  {
    id: 'presentation-schedule',
    title: 'Presentation Schedule',
    context: 'A teacher needs to schedule 4 student presentations out of 7 volunteers.',
    question: 'In how many ways can the presentation order be arranged?',
    config: {
      totalItems: 7,
      totalPositions: 4,
      allowRepetition: false,
    },
  },
  {
    id: 'license-plate',
    title: 'Vehicle License Plate',
    context: 'Creating a license plate with 3 letters followed by 3 digits (letters and digits can repeat).',
    question: 'How many different license plates can be created?',
    config: {
      totalItems: 26,
      totalPositions: 3,
      allowRepetition: true,
    },
  },
];

/**
 * Create a sample slot method problem
 */
export function createSlotMethodSample(exampleId?: string): SlotMethodResult {
  const example = SLOT_METHOD_EXAMPLES.find(ex => ex.id === exampleId) || SLOT_METHOD_EXAMPLES[0];
  return calculateSlotPermutations(example.config);
}
