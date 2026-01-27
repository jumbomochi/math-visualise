/**
 * Venn Diagrams and Set Notation
 *
 * Set Operations:
 * - Union: A ∪ B (everything in A or B or both)
 * - Intersection: A ∩ B (everything in both A and B)
 * - Complement: A' (everything not in A)
 * - Difference: A - B (in A but not in B)
 */

export interface VennSet {
  id: string;
  name: string;
  label: string;
  elements: string[];
  probability?: number;
  count?: number;
  color: string;
}

export interface VennDiagramData {
  universalSet: {
    name: string;
    totalElements: number;
    elements?: string[];
  };
  setA: VennSet;
  setB: VennSet;
  setC?: VennSet; // Optional third set
  intersection: {
    AB: string[]; // A ∩ B
    AC?: string[]; // A ∩ C (if C exists)
    BC?: string[]; // B ∩ C (if C exists)
    ABC?: string[]; // A ∩ B ∩ C (if C exists)
  };
}

export interface VennDiagramExample {
  id: string;
  title: string;
  context: string;
  question: string;
  data: VennDiagramData;
  targetOperation: 'union' | 'intersection' | 'complement' | 'difference' | 'symmetric-difference';
  targetSets: string[]; // Which sets are involved in the operation
}

export interface VennDiagramResult {
  data: VennDiagramData;
  targetOperation: string;
  targetSets: string[];
  resultElements: string[];
  resultCount: number;
  resultProbability: number;
  formulaLatex: string;
  setNotation: string;
  explanation: string[];
}

/**
 * Calculate union of sets
 */
export function calculateUnion(
  setA: string[],
  setB: string[],
  setC?: string[]
): string[] {
  const union = new Set([...setA, ...setB]);
  if (setC) {
    setC.forEach(elem => union.add(elem));
  }
  return Array.from(union);
}

/**
 * Calculate intersection of sets
 */
export function calculateIntersection(
  setA: string[],
  setB: string[],
  setC?: string[]
): string[] {
  let intersection = setA.filter(elem => setB.includes(elem));
  if (setC) {
    intersection = intersection.filter(elem => setC.includes(elem));
  }
  return intersection;
}

/**
 * Calculate complement of a set
 */
export function calculateComplement(
  universalSet: string[],
  setA: string[]
): string[] {
  return universalSet.filter(elem => !setA.includes(elem));
}

/**
 * Calculate set difference (A - B)
 */
export function calculateDifference(
  setA: string[],
  setB: string[]
): string[] {
  return setA.filter(elem => !setB.includes(elem));
}

/**
 * Calculate symmetric difference (A ⊕ B)
 */
export function calculateSymmetricDifference(
  setA: string[],
  setB: string[]
): string[] {
  const aMinusB = calculateDifference(setA, setB);
  const bMinusA = calculateDifference(setB, setA);
  return [...aMinusB, ...bMinusA];
}

/**
 * Solve Venn Diagram problem
 */
export function solveVennDiagram(exampleId: string): VennDiagramResult {
  const example = VENN_DIAGRAM_EXAMPLES.find(ex => ex.id === exampleId);
  if (!example) {
    throw new Error(`Example ${exampleId} not found`);
  }

  const { data, targetOperation, targetSets } = example;
  let resultElements: string[] = [];
  let setNotation = '';
  let formulaLatex = '';
  const explanation: string[] = [];

  const allElements = data.universalSet.elements || [];
  const totalElements = data.universalSet.totalElements;

  // Perform the operation
  switch (targetOperation) {
    case 'union':
      if (targetSets.length === 2) {
        resultElements = calculateUnion(data.setA.elements, data.setB.elements);
        setNotation = `${data.setA.label} \\cup ${data.setB.label}`;
        explanation.push(`Union: All elements in ${data.setA.name} OR ${data.setB.name}`);
      } else if (targetSets.length === 3 && data.setC) {
        resultElements = calculateUnion(data.setA.elements, data.setB.elements, data.setC.elements);
        setNotation = `${data.setA.label} \\cup ${data.setB.label} \\cup ${data.setC.label}`;
        explanation.push(`Union: All elements in ${data.setA.name} OR ${data.setB.name} OR ${data.setC.name}`);
      }
      break;

    case 'intersection':
      if (targetSets.length === 2) {
        resultElements = calculateIntersection(data.setA.elements, data.setB.elements);
        setNotation = `${data.setA.label} \\cap ${data.setB.label}`;
        explanation.push(`Intersection: Elements in BOTH ${data.setA.name} AND ${data.setB.name}`);
      } else if (targetSets.length === 3 && data.setC) {
        resultElements = calculateIntersection(data.setA.elements, data.setB.elements, data.setC.elements);
        setNotation = `${data.setA.label} \\cap ${data.setB.label} \\cap ${data.setC.label}`;
        explanation.push(`Intersection: Elements in ALL three sets`);
      }
      break;

    case 'complement':
      resultElements = calculateComplement(allElements, data.setA.elements);
      setNotation = `${data.setA.label}'`;
      explanation.push(`Complement: All elements NOT in ${data.setA.name}`);
      break;

    case 'difference':
      resultElements = calculateDifference(data.setA.elements, data.setB.elements);
      setNotation = `${data.setA.label} - ${data.setB.label}`;
      explanation.push(`Difference: Elements in ${data.setA.name} but NOT in ${data.setB.name}`);
      break;

    case 'symmetric-difference':
      resultElements = calculateSymmetricDifference(data.setA.elements, data.setB.elements);
      setNotation = `${data.setA.label} \\oplus ${data.setB.label}`;
      explanation.push(`Symmetric Difference: Elements in ${data.setA.name} OR ${data.setB.name} but NOT in both`);
      break;
  }

  const resultCount = resultElements.length;
  const resultProbability = totalElements > 0 ? resultCount / totalElements : 0;

  explanation.push(`Number of elements: ${resultCount}`);
  explanation.push(`Probability: ${resultCount}/${totalElements} = ${resultProbability.toFixed(4)}`);

  formulaLatex = `P(${setNotation}) = \\frac{${resultCount}}{${totalElements}} = ${resultProbability.toFixed(4)}`;

  return {
    data,
    targetOperation,
    targetSets,
    resultElements,
    resultCount,
    resultProbability,
    formulaLatex,
    setNotation,
    explanation,
  };
}

/**
 * Venn Diagram Examples
 */
export const VENN_DIAGRAM_EXAMPLES: VennDiagramExample[] = [
  {
    id: 'students-sports',
    title: 'Students: Sports and Music',
    context: 'In a class of 30 students, 18 play sports, 12 play musical instruments, and 5 do both.',
    question: 'Find the probability a randomly selected student plays sports OR music.',
    targetOperation: 'union',
    targetSets: ['A', 'B'],
    data: {
      universalSet: {
        name: 'All Students',
        totalElements: 30,
        elements: Array.from({ length: 30 }, (_, i) => `S${i + 1}`),
      },
      setA: {
        id: 'sports',
        name: 'Sports',
        label: 'A',
        elements: Array.from({ length: 18 }, (_, i) => `S${i + 1}`),
        count: 18,
        color: '#3B82F6', // blue
      },
      setB: {
        id: 'music',
        name: 'Music',
        label: 'B',
        elements: [...Array.from({ length: 5 }, (_, i) => `S${i + 1}`), ...Array.from({ length: 7 }, (_, i) => `S${i + 19}`)],
        count: 12,
        color: '#F59E0B', // orange
      },
      intersection: {
        AB: Array.from({ length: 5 }, (_, i) => `S${i + 1}`),
      },
    },
  },
  {
    id: 'cards-red-and-face',
    title: 'Cards: Red and Face Cards',
    context: 'From a standard 52-card deck: 26 are red, 12 are face cards, 6 are both red and face cards.',
    question: 'Find the probability a card is red AND a face card.',
    targetOperation: 'intersection',
    targetSets: ['A', 'B'],
    data: {
      universalSet: {
        name: 'All Cards',
        totalElements: 52,
      },
      setA: {
        id: 'red',
        name: 'Red',
        label: 'R',
        elements: Array.from({ length: 26 }, (_, i) => `C${i + 1}`),
        count: 26,
        color: '#EF4444', // red
      },
      setB: {
        id: 'face',
        name: 'Face',
        label: 'F',
        elements: [...Array.from({ length: 6 }, (_, i) => `C${i + 1}`), ...Array.from({ length: 6 }, (_, i) => `C${i + 27}`)],
        count: 12,
        color: '#8B5CF6', // purple
      },
      intersection: {
        AB: Array.from({ length: 6 }, (_, i) => `C${i + 1}`),
      },
    },
  },
  {
    id: 'subjects-three-sets',
    title: 'Subjects: Math, Physics, Chemistry',
    context: 'Among 40 students: 25 take Math, 20 take Physics, 18 take Chemistry. 12 take both Math and Physics, 10 take both Math and Chemistry, 8 take both Physics and Chemistry, and 5 take all three.',
    question: 'Find the probability a student takes Math but not Physics.',
    targetOperation: 'difference',
    targetSets: ['A', 'B'],
    data: {
      universalSet: {
        name: 'All Students',
        totalElements: 40,
      },
      setA: {
        id: 'math',
        name: 'Math',
        label: 'M',
        elements: Array.from({ length: 25 }, (_, i) => `S${i + 1}`),
        count: 25,
        color: '#3B82F6', // blue
      },
      setB: {
        id: 'physics',
        name: 'Physics',
        label: 'P',
        elements: Array.from({ length: 20 }, (_, i) => `S${i + 6}`),
        count: 20,
        color: '#10B981', // green
      },
      setC: {
        id: 'chemistry',
        name: 'Chemistry',
        label: 'C',
        elements: Array.from({ length: 18 }, (_, i) => `S${i + 11}`),
        count: 18,
        color: '#F59E0B', // orange
      },
      intersection: {
        AB: Array.from({ length: 12 }, (_, i) => `S${i + 6}`),
        AC: Array.from({ length: 10 }, (_, i) => `S${i + 11}`),
        BC: Array.from({ length: 8 }, (_, i) => `S${i + 16}`),
        ABC: Array.from({ length: 5 }, (_, i) => `S${i + 16}`),
      },
    },
  },
];
