/**
 * Advanced Combinatorics Cases
 *
 * Real-world problems that combine multiple counting principles.
 * These demonstrate how fundamental principles work together in complex scenarios.
 */

import { factorial, permutation } from './slotMethod';

/**
 * Step in a multi-principle solution
 */
export interface SolutionStep {
  step: number;
  part: 'i' | 'ii' | 'iii';  // Which part this step belongs to
  principle: string;
  description: string;
  calculation: string;
  result: number;
  reasoning: string;
}

/**
 * Result for each part of a question
 */
export interface PartResult {
  part: 'i' | 'ii' | 'iii';
  answer: number;
  formulaLatex: string;
}

/**
 * Advanced case result
 */
export interface AdvancedCaseResult {
  caseId: string;
  partResults: PartResult[];  // Answer for each part
  steps: SolutionStep[];
  principlesUsed: string[];
  visualizationData?: any;
}

/**
 * Advanced case example
 */
export interface AdvancedCaseExample {
  id: string;
  title: string;
  difficulty: 'intermediate' | 'advanced' | 'challenging';
  context: string;
  question: string;
  principlesUsed: string[];
  hints?: string[];
}

/**
 * Case 1: License Plate with Restrictions
 * Combines: Multiplicative Principle + Slot Method with Restrictions
 *
 * Problem:
 * The Land Transport Authority (LTA) is designing a new vehicle registration system for Singapore.
 * Each license plate consists of 3 letters followed by 4 digits (e.g., SBA 1234).
 *
 * Part (i): Find the total number of possible license plates that can be created.
 *
 * Part (ii): Due to clarity concerns, the LTA imposes the following restrictions:
 * - The first letter cannot be 'O' or 'I' (as they look similar to the digits 0 and 1)
 * - The first digit cannot be 0 (to avoid confusion with the letter O)
 * - The last digit must be different from the first digit (for easier identification)
 * Find the number of valid license plates under these restrictions.
 */
export function solveLicensePlateCase(): AdvancedCaseResult {
  // Part (i): Total number of possible license plates
  const partI_total = 26 * 26 * 26 * 10 * 10 * 10 * 10;

  // Part (ii): With restrictions
  const firstLetter = 26 - 2; // No O or I
  const secondLetter = 26;
  const thirdLetter = 26;
  const firstDigit = 9; // Cannot be 0
  const secondDigit = 10;
  const thirdDigit = 10;
  const fourthDigit = 9; // Cannot equal first digit
  const partII_total = firstLetter * secondLetter * thirdLetter * firstDigit * secondDigit * thirdDigit * fourthDigit;

  const steps: SolutionStep[] = [
    {
      step: 1,
      part: 'i',
      principle: 'Multiplicative Principle',
      description: 'Count total license plates (3 letters, 4 digits)',
      calculation: '26 × 26 × 26 × 10 × 10 × 10 × 10',
      result: partI_total,
      reasoning: 'Each letter has 26 choices, each digit has 10 choices',
    },
    {
      step: 2,
      part: 'ii',
      principle: 'Slot Method with Restrictions',
      description: 'First letter (cannot be O or I)',
      calculation: '26 - 2 = 24',
      result: firstLetter,
      reasoning: 'Letters O and I are forbidden as they look like 0 and 1',
    },
    {
      step: 3,
      part: 'ii',
      principle: 'Multiplicative Principle',
      description: 'Second and third letters (any letter)',
      calculation: '26 × 26',
      result: secondLetter * thirdLetter,
      reasoning: 'No restrictions on positions 2 and 3',
    },
    {
      step: 4,
      part: 'ii',
      principle: 'Slot Method with Restrictions',
      description: 'First digit (cannot be 0)',
      calculation: '9',
      result: firstDigit,
      reasoning: 'Digits 1-9 only, 0 is forbidden in first position',
    },
    {
      step: 5,
      part: 'ii',
      principle: 'Multiplicative Principle',
      description: 'Second and third digits (any digit)',
      calculation: '10 × 10',
      result: secondDigit * thirdDigit,
      reasoning: 'Digits 0-9, no restrictions',
    },
    {
      step: 6,
      part: 'ii',
      principle: 'Slot Method with Restrictions',
      description: 'Fourth digit (must differ from first)',
      calculation: '9',
      result: fourthDigit,
      reasoning: 'Any digit except the one used in first position',
    },
    {
      step: 7,
      part: 'ii',
      principle: 'Multiplicative Principle',
      description: 'Multiply all choices for Part (ii)',
      calculation: '24 × 26 × 26 × 9 × 10 × 10 × 9',
      result: partII_total,
      reasoning: 'Apply multiplicative principle across all positions',
    },
  ];

  const partResults: PartResult[] = [
    {
      part: 'i',
      answer: partI_total,
      formulaLatex: `26^3 \\times 10^4 = ${partI_total.toLocaleString()}`,
    },
    {
      part: 'ii',
      answer: partII_total,
      formulaLatex: `24 \\times 26^2 \\times 9 \\times 10^2 \\times 9 = ${partII_total.toLocaleString()}`,
    },
  ];

  return {
    caseId: 'license-plate',
    partResults,
    steps,
    principlesUsed: ['Multiplicative Principle', 'Slot Method', 'Restrictions'],
  };
}

/**
 * Case 2: Student Council Committee Arrangement
 * Combines: Circular Permutations + Non-Adjacent + Adjacent Grouping
 *
 * Problem:
 * A group of 9 student councillors comprises 3 from the Sports Committee, 3 from the Academic Committee,
 * and 3 from the Welfare Committee. Two particular student councillors, Alex and Ben, are from the
 * Sports Committee and Academic Committee respectively.
 *
 * The group sits in a circle for a meeting.
 *
 * Part (i): Find the number of possible seating arrangements if no two student councillors from the
 * Sports Committee sit next to each other.
 *
 * Part (ii): Find the number of possible seating arrangements if student councillors from the same
 * committee must sit next to one another, and Alex and Ben must sit next to each other.
 */
export function solveStudyGroupCase(): AdvancedCaseResult {
  // Part (i): Non-adjacent Sports Committee members in circular arrangement
  // In a circle of 9, arrange 6 non-Sports members first: (6-1)! = 5!
  // This creates 6 gaps, place 3 Sports members in 3 of these gaps: P(6,3)
  const nonSportsArrangements = factorial(5); // (6-1)! for circular
  const sportsInGaps = permutation(6, 3);
  const partI_total = nonSportsArrangements * sportsInGaps;

  // Part (ii): Committees together + Alex and Ben together
  // Treat each committee as 1 unit: 3 units in circle = (3-1)! = 2!
  // Within Sports: 3! arrangements
  // Within Academic: Treat Alex-Ben as 1 unit, so (2-1+1)! × 2! = 2! × 2!
  // Within Welfare: 3! arrangements
  const committeeUnits = factorial(2); // (3-1)! circular
  const sportsInternal = factorial(3);
  const academicUnits = factorial(2); // Alex-Ben as unit + 1 other = 2 units
  const alexBenInternal = factorial(2);
  const welfareInternal = factorial(3);
  const partII_total = committeeUnits * sportsInternal * academicUnits * alexBenInternal * welfareInternal;

  const steps: SolutionStep[] = [
    {
      step: 1,
      part: 'i',
      principle: 'Circular Permutations',
      description: 'Arrange 6 non-Sports members in a circle',
      calculation: '(6-1)! = 5!',
      result: nonSportsArrangements,
      reasoning: 'Fix one person to account for rotational symmetry in circular arrangement',
    },
    {
      step: 2,
      part: 'i',
      principle: 'Non-Adjacent Slotting',
      description: 'Place 3 Sports members in gaps (non-adjacent)',
      calculation: 'P(6,3)',
      result: sportsInGaps,
      reasoning: '6 people create 6 gaps in a circle, choose and arrange 3 Sports members in these gaps',
    },
    {
      step: 3,
      part: 'i',
      principle: 'Multiplicative Principle',
      description: 'Total for Part (i)',
      calculation: `5! × P(6,3)`,
      result: partI_total,
      reasoning: 'Multiply arrangements of non-Sports members by gap placements of Sports members',
    },
    {
      step: 4,
      part: 'ii',
      principle: 'Circular Grouping',
      description: 'Treat 3 committees as units in a circle',
      calculation: '(3-1)! = 2!',
      result: committeeUnits,
      reasoning: 'Arrange 3 committee groups around a circle using circular permutations',
    },
    {
      step: 5,
      part: 'ii',
      principle: 'Internal Arrangements - Sports',
      description: 'Arrange 3 Sports members within their group',
      calculation: '3!',
      result: sportsInternal,
      reasoning: 'Sports committee members can be arranged in any order',
    },
    {
      step: 6,
      part: 'ii',
      principle: 'Internal Arrangements - Academic',
      description: 'Arrange Academic members with Alex-Ben together',
      calculation: '2! × 2!',
      result: academicUnits * alexBenInternal,
      reasoning: 'Treat Alex-Ben as one unit with 1 other (2 units): 2! ways. Alex-Ben can swap: 2! ways',
    },
    {
      step: 7,
      part: 'ii',
      principle: 'Internal Arrangements - Welfare',
      description: 'Arrange 3 Welfare members within their group',
      calculation: '3!',
      result: welfareInternal,
      reasoning: 'Welfare committee members can be arranged in any order',
    },
    {
      step: 8,
      part: 'ii',
      principle: 'Multiplicative Principle',
      description: 'Total for Part (ii)',
      calculation: `2! × 3! × (2! × 2!) × 3!`,
      result: partII_total,
      reasoning: 'Multiply committee arrangements with internal arrangements',
    },
  ];

  const partResults: PartResult[] = [
    {
      part: 'i',
      answer: partI_total,
      formulaLatex: `5! \\times P(6,3) = ${partI_total.toLocaleString()}`,
    },
    {
      part: 'ii',
      answer: partII_total,
      formulaLatex: `2! \\times 3! \\times 2! \\times 2! \\times 3! = ${partII_total.toLocaleString()}`,
    },
  ];

  return {
    caseId: 'study-group',
    partResults,
    steps,
    principlesUsed: ['Circular Permutations', 'Non-Adjacent Slotting', 'Adjacent Grouping', 'Multiplicative Principle'],
  };
}

/**
 * Case 3: Photography Exhibition Committee
 * Combines: Selection (Combinations) + Additive Principle + Restrictions
 *
 * Problem:
 * A school photography club has 12 members comprising 5 seniors, 4 juniors, and 3 freshmen.
 * Two particular members, Sarah (a senior) and James (a junior), are best friends.
 *
 * The club needs to select a committee of 6 members to organize an exhibition.
 *
 * Part (i): Find the number of ways to form the committee if it must include at least 2 seniors
 * and at least 1 freshman.
 *
 * Part (ii): Find the number of ways to form the committee if Sarah and James must not both be
 * in the committee (i.e., either one or both are excluded).
 *
 * Part (iii): If the committee includes Sarah, find the number of ways to arrange the 6 members
 * in a row for a photoshoot, given that Sarah must not stand at either end of the row.
 */
export function solveMeetingSeatingCase(): AdvancedCaseResult {
  // Helper function for combinations
  const C = (n: number, r: number): number => {
    if (r > n || r < 0) return 0;
    if (r === 0 || r === n) return 1;
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  // Part (i): At least 2 seniors and at least 1 freshman
  // Case 1: 2 seniors, 1 freshman, 3 juniors: C(5,2) × C(3,1) × C(4,3)
  const case1 = C(5, 2) * C(3, 1) * C(4, 3);
  // Case 2: 2 seniors, 2 freshmen, 2 juniors: C(5,2) × C(3,2) × C(4,2)
  const case2 = C(5, 2) * C(3, 2) * C(4, 2);
  // Case 3: 2 seniors, 3 freshmen, 1 junior: C(5,2) × C(3,3) × C(4,1)
  const case3 = C(5, 2) * C(3, 3) * C(4, 1);
  // Case 4: 3 seniors, 1 freshman, 2 juniors: C(5,3) × C(3,1) × C(4,2)
  const case4 = C(5, 3) * C(3, 1) * C(4, 2);
  // Case 5: 3 seniors, 2 freshmen, 1 junior: C(5,3) × C(3,2) × C(4,1)
  const case5 = C(5, 3) * C(3, 2) * C(4, 1);
  // Case 6: 4 seniors, 1 freshman, 1 junior: C(5,4) × C(3,1) × C(4,1)
  const case6 = C(5, 4) * C(3, 1) * C(4, 1);
  // Case 7: 4 seniors, 2 freshmen, 0 juniors: C(5,4) × C(3,2) × C(4,0)
  const case7 = C(5, 4) * C(3, 2) * C(4, 0);
  // Case 8: 5 seniors, 1 freshman, 0 juniors: C(5,5) × C(3,1) × C(4,0)
  const case8 = C(5, 5) * C(3, 1) * C(4, 0);
  const partI_total = case1 + case2 + case3 + case4 + case5 + case6 + case7 + case8;

  // Part (ii): Sarah and James not both in committee
  // Total committees - (Sarah AND James both in)
  const totalCommittees = C(12, 6);
  const bothIn = C(10, 4); // Choose 4 from remaining 10
  const partII_total = totalCommittees - bothIn;

  // Part (iii): Sarah in committee, not at ends
  // Sarah is in committee (5 others from 11), arrange 6 in row, Sarah not at ends
  // Choose 5 from 11: C(11,5), arrange 6 with Sarah in middle 4 positions: 4 × 5!
  const choose5Others = C(11, 5);
  const sarahMiddle = 4; // 4 middle positions
  const others5Arrangement = factorial(5);
  const partIII_total = choose5Others * sarahMiddle * others5Arrangement;

  const steps: SolutionStep[] = [
    {
      step: 1,
      part: 'i',
      principle: 'Systematic Case Enumeration',
      description: 'Enumerate all valid distributions (≥2 seniors, ≥1 freshman)',
      calculation: 'C(5,2)×C(3,1)×C(4,3) + ... + C(5,5)×C(3,1)×C(4,0)',
      result: partI_total,
      reasoning: '8 different distribution patterns satisfy both constraints',
    },
    {
      step: 2,
      part: 'ii',
      principle: 'Complementary Counting',
      description: 'Total committees minus (both Sarah AND James)',
      calculation: `C(12,6) - C(10,4)`,
      result: partII_total,
      reasoning: 'Easier to count the complement: subtract the unwanted case where both are included',
    },
    {
      step: 3,
      part: 'iii',
      principle: 'Selection with Restriction',
      description: 'Choose 5 others from 11 remaining members',
      calculation: `C(11,5)`,
      result: choose5Others,
      reasoning: 'Sarah is already in, select 5 more from the other 11 members',
    },
    {
      step: 4,
      part: 'iii',
      principle: 'Restricted Arrangement',
      description: 'Arrange 6 members with Sarah in middle positions',
      calculation: `4 × 5!`,
      result: sarahMiddle * others5Arrangement,
      reasoning: 'Sarah has 4 middle positions to choose from, others arrange in remaining 5 spots',
    },
    {
      step: 5,
      part: 'iii',
      principle: 'Multiplicative Principle',
      description: 'Total for Part (iii)',
      calculation: `C(11,5) × 4 × 5!`,
      result: partIII_total,
      reasoning: 'Multiply selection by arrangement possibilities',
    },
  ];

  const partResults: PartResult[] = [
    {
      part: 'i',
      answer: partI_total,
      formulaLatex: `\\sum \\text{(8 cases)} = ${partI_total.toLocaleString()}`,
    },
    {
      part: 'ii',
      answer: partII_total,
      formulaLatex: `C(12,6) - C(10,4) = ${partII_total.toLocaleString()}`,
    },
    {
      part: 'iii',
      answer: partIII_total,
      formulaLatex: `C(11,5) \\times 4 \\times 5! = ${partIII_total.toLocaleString()}`,
    },
  ];

  return {
    caseId: 'meeting-seating',
    partResults,
    steps,
    principlesUsed: ['Combinations', 'Complementary Counting', 'Restricted Arrangements'],
  };
}

/**
 * Case 4: Student Council Task Force Formation
 * Combines: Combinations + Additive Principle + Complementary Counting
 *
 * Problem:
 * A group of 15 student councillors comprises 6 from the House Committee, 5 from the Liaison Committee,
 * and 4 from the Welfare Committee.
 *
 * The group is to form a Task Force of 10 student councillors to organize a school activity.
 *
 * Part (i): Find the number of possible ways the Task Force may be formed if it must include at least
 * 1 student councillor from each of the 3 committees.
 *
 * Part (ii): Two particular councillors, Marcus from House and Nina from Welfare, have a scheduling conflict.
 * Find the number of ways to form the Task Force if at most one of Marcus or Nina can be included.
 */
export function solveEventScheduleCase(): AdvancedCaseResult {
  const C = (n: number, r: number): number => {
    if (r > n || r < 0) return 0;
    if (r === 0 || r === n) return 1;
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  // Part (i): At least 1 from each committee
  // Enumerate valid cases: H + L + W = 10, with H ≥ 1, L ≥ 1, W ≥ 1
  let partI_total = 0;
  const validDistributions: string[] = [];
  for (let h = 1; h <= 6; h++) {
    for (let l = 1; l <= 5; l++) {
      for (let w = 1; w <= 4; w++) {
        if (h + l + w === 10) {
          partI_total += C(6, h) * C(5, l) * C(4, w);
          validDistributions.push(`(${h},${l},${w})`);
        }
      }
    }
  }

  // Part (ii): At most one of Marcus or Nina
  // Case 1: Neither Marcus nor Nina
  const neitherMN = C(13, 10);
  // Case 2: Marcus but not Nina
  const marcusOnly = C(13, 9); // Choose 9 from 13 others
  // Case 3: Nina but not Marcus
  const ninaOnly = C(13, 9);
  const partII_total = neitherMN + marcusOnly + ninaOnly;

  const steps: SolutionStep[] = [
    {
      step: 1,
      part: 'i',
      principle: 'Systematic Enumeration',
      description: 'Find all valid distributions (h,l,w) where h+l+w=10',
      calculation: 'h≥1, l≥1, w≥1',
      result: validDistributions.length,
      reasoning: `Found ${validDistributions.length} valid distributions satisfying the constraints`,
    },
    {
      step: 2,
      part: 'i',
      principle: 'Combinations with Multiplication',
      description: 'Sum C(6,h) × C(5,l) × C(4,w) for all valid (h,l,w)',
      calculation: 'Sum over all valid distributions',
      result: partI_total,
      reasoning: 'Each distribution contributes C(6,h) × C(5,l) × C(4,w) ways',
    },
    {
      step: 3,
      part: 'ii',
      principle: 'Case Analysis - Neither',
      description: 'Task Force with neither Marcus nor Nina',
      calculation: 'C(13,10)',
      result: neitherMN,
      reasoning: 'Choose 10 from the remaining 13 councillors',
    },
    {
      step: 4,
      part: 'ii',
      principle: 'Case Analysis - Marcus Only',
      description: 'Task Force with Marcus but not Nina',
      calculation: 'C(13,9)',
      result: marcusOnly,
      reasoning: 'Marcus is in, choose 9 more from 13 others (excluding Nina)',
    },
    {
      step: 5,
      part: 'ii',
      principle: 'Case Analysis - Nina Only',
      description: 'Task Force with Nina but not Marcus',
      calculation: 'C(13,9)',
      result: ninaOnly,
      reasoning: 'Nina is in, choose 9 more from 13 others (excluding Marcus)',
    },
    {
      step: 6,
      part: 'ii',
      principle: 'Additive Principle',
      description: 'Add all three mutually exclusive cases',
      calculation: `C(13,10) + C(13,9) + C(13,9)`,
      result: partII_total,
      reasoning: 'Neither + Marcus only + Nina only are mutually exclusive',
    },
  ];

  const partResults: PartResult[] = [
    {
      part: 'i',
      answer: partI_total,
      formulaLatex: `\\sum_{h+l+w=10} C(6,h) \\times C(5,l) \\times C(4,w) = ${partI_total.toLocaleString()}`,
    },
    {
      part: 'ii',
      answer: partII_total,
      formulaLatex: `C(13,10) + 2 \\times C(13,9) = ${partII_total.toLocaleString()}`,
    },
  ];

  return {
    caseId: 'event-schedule',
    partResults,
    steps,
    principlesUsed: ['Combinations', 'Additive Principle', 'Complementary Counting'],
  };
}

/**
 * Case 5: Book Arrangement with Multiple Constraints
 * Combines: Slot Method + Adjacent Grouping + Non-Adjacent + Complementary Counting
 *
 * Problem:
 * A student has 10 books on a shelf: 3 Math textbooks, 4 Science textbooks, 2 Literature books,
 * and 1 Dictionary. Two particular Math textbooks, Algebra and Calculus, are reference books
 * that are frequently used together.
 *
 * Part (i): The books are to be arranged in a row on a shelf. Find the number of arrangements
 * if all Math textbooks must be placed together, and the 2 Literature books must NOT be adjacent
 * to each other.
 *
 * Part (ii): The student decides to select 6 books to bring to school. Find the number of ways to
 * select the books if the selection must include the Dictionary and at least 2 Science textbooks,
 * but cannot include both Algebra and Calculus together.
 */
export function solveSecurityCodeCase(): AdvancedCaseResult {
  const C = (n: number, r: number): number => {
    if (r > n || r < 0) return 0;
    if (r === 0 || r === n) return 1;
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  // Part (i): Math books together, Literature books non-adjacent
  // Treat 3 Math books as 1 unit: (1 Math-unit + 4 Science + 1 Dictionary = 6 units)
  // Arrange 6 units: 6!
  // Within Math unit: 3!
  // Now place 2 Literature books in gaps (non-adjacent)
  // 6 units create 7 gaps, choose 2: P(7, 2)
  const unitsWithoutLit = 6;
  const arrangeUnits = factorial(unitsWithoutLit);
  const mathInternal = factorial(3);
  const gaps = unitsWithoutLit + 1;
  const litInGaps = permutation(gaps, 2);
  const partI_total = arrangeUnits * mathInternal * litInGaps;

  // Part (ii): Select 6 books with Dictionary, ≥2 Science, not both Algebra & Calculus
  // Dictionary is fixed (already selected), need to choose 5 more from 9 remaining
  // Remaining: 3 Math (Algebra, Calculus, 1 other), 4 Science, 2 Literature = 9 books
  // Constraint: ≥2 Science, AND not both Algebra & Calculus

  // Case 1: Algebra in, Calculus out
  // Have: Dictionary, Algebra. Need: 4 more from (1 Math, 4 Science, 2 Lit = 7 books)
  // Must have ≥2 Science
  let case1 = 0;
  for (let s = 2; s <= 4; s++) { // Science count
    const remaining = 4 - s;
    case1 += C(4, s) * C(3, remaining); // 3 = 1 Math + 2 Lit
  }

  // Case 2: Calculus in, Algebra out (symmetric)
  const case2 = case1;

  // Case 3: Neither Algebra nor Calculus
  // Have: Dictionary. Need: 5 more from (1 Math, 4 Science, 2 Lit = 7 books)
  // Must have ≥2 Science
  let case3 = 0;
  for (let s = 2; s <= 4; s++) {
    const remaining = 5 - s;
    case3 += C(4, s) * C(3, remaining);
  }

  const partII_total = case1 + case2 + case3;

  const steps: SolutionStep[] = [
    {
      step: 1,
      part: 'i',
      principle: 'Adjacent Grouping',
      description: 'Treat 3 Math books as one unit',
      calculation: '6 units total',
      result: unitsWithoutLit,
      reasoning: 'Math-unit + 4 Science + 1 Dictionary = 6 units',
    },
    {
      step: 2,
      part: 'i',
      principle: 'Permutations',
      description: 'Arrange 6 units and arrange within Math unit',
      calculation: '6! × 3!',
      result: arrangeUnits * mathInternal,
      reasoning: 'Arrange 6 units in a row, then arrange 3 Math books within their unit',
    },
    {
      step: 3,
      part: 'i',
      principle: 'Non-Adjacent Slotting',
      description: 'Place 2 Literature books in gaps (non-adjacent)',
      calculation: 'P(7,2)',
      result: litInGaps,
      reasoning: '6 units create 7 gaps (including ends), choose and arrange 2 Literature books',
    },
    {
      step: 4,
      part: 'i',
      principle: 'Multiplicative Principle',
      description: 'Total for Part (i)',
      calculation: `6! × 3! × P(7,2)`,
      result: partI_total,
      reasoning: 'Multiply unit arrangements by Math internal arrangements by Literature placements',
    },
    {
      step: 5,
      part: 'ii',
      principle: 'Case Analysis - Algebra Only',
      description: 'Dictionary + Algebra, choose 4 more with ≥2 Science',
      calculation: `Sum for s=2 to 4: C(4,s) × C(3,4-s)`,
      result: case1,
      reasoning: 'Enumerate Science counts, choose remaining from 1 Math + 2 Lit',
    },
    {
      step: 6,
      part: 'ii',
      principle: 'Case Analysis - Calculus Only',
      description: 'Dictionary + Calculus, choose 4 more with ≥2 Science',
      calculation: `Sum for s=2 to 4: C(4,s) × C(3,4-s)`,
      result: case2,
      reasoning: 'Symmetric to Algebra case',
    },
    {
      step: 7,
      part: 'ii',
      principle: 'Case Analysis - Neither A nor C',
      description: 'Dictionary only, choose 5 more with ≥2 Science',
      calculation: `Sum for s=2 to 4: C(4,s) × C(3,5-s)`,
      result: case3,
      reasoning: 'Choose from 1 Math + 4 Science + 2 Lit, ensure ≥2 Science',
    },
    {
      step: 8,
      part: 'ii',
      principle: 'Additive Principle',
      description: 'Add all three mutually exclusive cases',
      calculation: `${case1} + ${case2} + ${case3}`,
      result: partII_total,
      reasoning: 'Three cases are mutually exclusive',
    },
  ];

  const partResults: PartResult[] = [
    {
      part: 'i',
      answer: partI_total,
      formulaLatex: `6! \\times 3! \\times P(7,2) = ${partI_total.toLocaleString()}`,
    },
    {
      part: 'ii',
      answer: partII_total,
      formulaLatex: `2 \\times ${case1.toLocaleString()} + ${case3.toLocaleString()} = ${partII_total.toLocaleString()}`,
    },
  ];

  return {
    caseId: 'security-code',
    partResults,
    steps,
    principlesUsed: ['Adjacent Grouping', 'Non-Adjacent Slotting', 'Combinations', 'Case Analysis'],
  };
}

/**
 * All advanced case examples
 */
export const ADVANCED_CASE_EXAMPLES: AdvancedCaseExample[] = [
  {
    id: 'license-plate',
    title: 'Vehicle License Plate Design',
    difficulty: 'intermediate',
    context: 'The Land Transport Authority (LTA) is designing a new vehicle registration system for Singapore. Each license plate consists of 3 letters followed by 4 digits (e.g., SBA 1234).',
    question: 'Part (i): Find the total number of possible license plates. Part (ii): Find the number of valid plates if the first letter cannot be O or I, the first digit cannot be 0, and the last digit must differ from the first digit.',
    principlesUsed: ['Multiplicative Principle', 'Slot Method', 'Restrictions'],
    hints: [
      'For part (i), use multiplicative principle with 26 letters and 10 digits',
      'For part (ii), analyze each position\'s restrictions independently',
      'Remember that the last digit depends on what was chosen for the first digit',
    ],
  },
  {
    id: 'study-group',
    title: 'Student Council Circle Seating',
    difficulty: 'advanced',
    context: 'A group of 9 student councillors comprises 3 from Sports, 3 from Academic, and 3 from Welfare committees. Alex (Sports) and Ben (Academic) are two particular councillors. The group sits in a circle for a meeting.',
    question: 'Part (i): Find arrangements if no two Sports Committee members sit next to each other. Part (ii): Find arrangements if councillors from the same committee sit together, and Alex and Ben must be next to each other.',
    principlesUsed: ['Circular Permutations', 'Non-Adjacent Slotting', 'Adjacent Grouping'],
    hints: [
      'For circular arrangements, fix one person to eliminate rotational duplicates',
      'For part (i), arrange non-Sports members first, then use gaps',
      'For part (ii), treat committees as units, then handle Alex-Ben as a sub-unit',
    ],
  },
  {
    id: 'meeting-seating',
    title: 'Photography Club Committee',
    difficulty: 'advanced',
    context: 'A photography club has 12 members: 5 seniors, 4 juniors, 3 freshmen. Sarah (senior) and James (junior) are best friends. A committee of 6 is needed to organize an exhibition.',
    question: 'Part (i): Form committee with ≥2 seniors, ≥1 freshman. Part (ii): Form committee where Sarah and James are not both included. Part (iii): If Sarah is in committee, arrange 6 members in a row with Sarah not at either end.',
    principlesUsed: ['Combinations', 'Complementary Counting', 'Restricted Arrangements'],
    hints: [
      'For part (i), enumerate all valid distributions of members',
      'For part (ii), use complementary counting: total minus both included',
      'For part (iii), multiply selection by restricted arrangement',
    ],
  },
  {
    id: 'event-schedule',
    title: 'Student Council Task Force',
    difficulty: 'advanced',
    context: 'A group of 15 student councillors comprises 6 from House Committee, 5 from Liaison Committee, and 4 from Welfare Committee. A Task Force of 10 is to be formed.',
    question: 'Part (i): Find ways to form the Task Force with at least 1 from each committee. Part (ii): If Marcus (House) and Nina (Welfare) have a conflict, find ways to form the Task Force with at most one of them.',
    principlesUsed: ['Combinations', 'Additive Principle', 'Complementary Counting'],
    hints: [
      'For part (i), enumerate all distributions with h ≥ 1, l ≥ 1, w ≥ 1 where h+l+w=10',
      'For part (ii), split into 3 cases: neither, Marcus only, Nina only',
      'Add the results since these are mutually exclusive scenarios',
    ],
  },
  {
    id: 'security-code',
    title: 'Book Shelf Arrangement',
    difficulty: 'challenging',
    context: 'A student has 10 books: 3 Math textbooks (including Algebra and Calculus), 4 Science textbooks, 2 Literature books, and 1 Dictionary.',
    question: 'Part (i): Arrange books in a row if all Math books must be together and the 2 Literature books must NOT be adjacent. Part (ii): Select 6 books including the Dictionary and ≥2 Science books, but not both Algebra and Calculus.',
    principlesUsed: ['Adjacent Grouping', 'Non-Adjacent Slotting', 'Combinations', 'Complementary Counting'],
    hints: [
      'For part (i), treat Math books as one unit, arrange units, then place Literature books in gaps',
      'For part (ii), fix Dictionary as selected, then handle Algebra/Calculus cases separately',
      'Consider 3 cases: Algebra in, Calculus in, neither in',
    ],
  },
];

/**
 * Solve an advanced case by ID
 */
export function solveAdvancedCase(caseId: string): AdvancedCaseResult {
  switch (caseId) {
    case 'license-plate':
      return solveLicensePlateCase();
    case 'study-group':
      return solveStudyGroupCase();
    case 'meeting-seating':
      return solveMeetingSeatingCase();
    case 'event-schedule':
      return solveEventScheduleCase();
    case 'security-code':
      return solveSecurityCodeCase();
    default:
      return solveLicensePlateCase();
  }
}
