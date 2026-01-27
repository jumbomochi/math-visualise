/**
 * Tree Diagrams for Sequential Probability
 *
 * Used for:
 * - Sequential events (with or without replacement)
 * - Multiple stages of probability
 * - Conditional probability visualization
 *
 * Key Rules:
 * - Multiply probabilities along branches
 * - Add probabilities across different paths to the same outcome
 */

export interface TreeNode {
  id: string;
  label: string;
  probability: number;
  cumulativeProbability?: number;
  children?: TreeNode[];
  level: number;
  outcome?: string;
}

export interface TreeDiagramData {
  stages: number;
  rootNode: TreeNode;
  targetOutcomes?: string[];
}

export interface TreeDiagramExample {
  id: string;
  title: string;
  context: string;
  question: string;
  data: TreeDiagramData;
  withReplacement: boolean;
}

export interface TreeDiagramResult {
  data: TreeDiagramData;
  targetOutcomes: string[];
  allPaths: TreePath[];
  targetPaths: TreePath[];
  totalProbability: number;
  formulaLatex: string;
  explanation: string[];
}

export interface TreePath {
  nodes: TreeNode[];
  outcome: string;
  probability: number;
  pathDescription: string;
}

/**
 * Build tree diagram for coin flips
 */
export function buildCoinFlipTree(numFlips: number): TreeNode {
  function buildLevel(level: number, pathSoFar: string): TreeNode {
    if (level === numFlips) {
      return {
        id: pathSoFar,
        label: pathSoFar[pathSoFar.length - 1],
        probability: 0.5,
        level,
        outcome: pathSoFar,
      };
    }

    const headsChild = buildLevel(level + 1, pathSoFar + 'H');
    const tailsChild = buildLevel(level + 1, pathSoFar + 'T');

    return {
      id: pathSoFar || 'root',
      label: pathSoFar ? pathSoFar[pathSoFar.length - 1] : 'Start',
      probability: pathSoFar ? 0.5 : 1,
      level,
      children: [headsChild, tailsChild],
    };
  }

  return buildLevel(0, '');
}

/**
 * Build tree diagram for drawing without replacement
 */
export function buildWithoutReplacementTree(
  totalItems: number,
  redItems: number,
  draws: number
): TreeNode {
  function buildLevel(level: number, red: number, total: number, pathSoFar: string): TreeNode {
    if (level === draws) {
      return {
        id: pathSoFar,
        label: pathSoFar[pathSoFar.length - 1],
        probability: 0,
        level,
        outcome: pathSoFar,
      };
    }

    const probRed = red / total;
    const probBlue = (total - red) / total;

    const children: TreeNode[] = [];

    // Red branch
    if (red > 0) {
      const redChild = buildLevel(level + 1, red - 1, total - 1, pathSoFar + 'R');
      redChild.probability = probRed;
      children.push(redChild);
    }

    // Blue branch
    if (total - red > 0) {
      const blueChild = buildLevel(level + 1, red, total - 1, pathSoFar + 'B');
      blueChild.probability = probBlue;
      children.push(blueChild);
    }

    return {
      id: pathSoFar || 'root',
      label: pathSoFar ? pathSoFar[pathSoFar.length - 1] : 'Start',
      probability: pathSoFar ? 0 : 1,
      level,
      children,
    };
  }

  return buildLevel(0, redItems, totalItems, '');
}

/**
 * Extract all paths from root to leaves
 */
export function extractAllPaths(root: TreeNode): TreePath[] {
  const paths: TreePath[] = [];

  function traverse(node: TreeNode, currentPath: TreeNode[], currentProb: number) {
    const newPath = [...currentPath, node];
    const newProb = currentProb * node.probability;

    if (!node.children || node.children.length === 0) {
      // Leaf node - complete path
      const pathDescription = newPath.map(n => n.label).filter(l => l !== 'Start').join(' → ');
      paths.push({
        nodes: newPath,
        outcome: node.outcome || '',
        probability: newProb,
        pathDescription,
      });
    } else {
      // Continue traversing
      node.children.forEach(child => {
        traverse(child, newPath, newProb);
      });
    }
  }

  traverse(root, [], 1);
  return paths;
}

/**
 * Filter paths by target outcomes
 */
export function filterPathsByOutcome(
  paths: TreePath[],
  targetOutcomes: string[]
): TreePath[] {
  return paths.filter(path => targetOutcomes.includes(path.outcome));
}

/**
 * Calculate total probability for target outcomes
 */
export function calculateTotalProbability(paths: TreePath[]): number {
  return paths.reduce((sum, path) => sum + path.probability, 0);
}

/**
 * Solve tree diagram problem
 */
export function solveTreeDiagram(exampleId: string): TreeDiagramResult {
  const example = TREE_DIAGRAM_EXAMPLES.find(ex => ex.id === exampleId);
  if (!example) {
    throw new Error(`Example ${exampleId} not found`);
  }

  const { data } = example;
  const targetOutcomes = data.targetOutcomes || [];

  // Extract all possible paths
  const allPaths = extractAllPaths(data.rootNode);
  const targetPaths = filterPathsByOutcome(allPaths, targetOutcomes);
  const totalProbability = calculateTotalProbability(targetPaths);

  const explanation: string[] = [
    `Total number of paths: ${allPaths.length}`,
    `Paths matching target outcome: ${targetPaths.length}`,
    ``,
  ];

  // List each target path
  targetPaths.forEach((path, idx) => {
    explanation.push(`Path ${idx + 1}: ${path.pathDescription}`);
    explanation.push(`  Probability: ${path.probability.toFixed(4)}`);
  });

  explanation.push(``);
  explanation.push(`Total Probability = Sum of all target paths`);

  const pathProbabilities = targetPaths.map(p => p.probability.toFixed(4)).join(' + ');
  explanation.push(`Total = ${pathProbabilities} = ${totalProbability.toFixed(4)}`);

  const formulaLatex = `P(\\text{Target}) = ${totalProbability.toFixed(4)}`;

  return {
    data,
    targetOutcomes,
    allPaths,
    targetPaths,
    totalProbability,
    formulaLatex,
    explanation,
  };
}

/**
 * Tree Diagram Examples
 */
export const TREE_DIAGRAM_EXAMPLES: TreeDiagramExample[] = [
  {
    id: 'three-coins',
    title: 'Three Coin Flips',
    context: 'A fair coin is flipped three times.',
    question: 'Find the probability of getting exactly 2 heads.',
    withReplacement: true,
    data: {
      stages: 3,
      rootNode: buildCoinFlipTree(3),
      targetOutcomes: ['HHT', 'HTH', 'THH'],
    },
  },
  {
    id: 'marbles-without-replacement',
    title: 'Drawing Marbles (Without Replacement)',
    context: 'A bag contains 3 red marbles and 2 blue marbles. Two marbles are drawn without replacement.',
    question: 'Find the probability of drawing 2 red marbles.',
    withReplacement: false,
    data: {
      stages: 2,
      rootNode: buildWithoutReplacementTree(5, 3, 2),
      targetOutcomes: ['RR'],
    },
  },
  {
    id: 'cards-without-replacement',
    title: 'Drawing Cards (Without Replacement)',
    context: 'From a deck with 3 red cards and 2 black cards, draw 2 cards without replacement.',
    question: 'Find the probability of drawing at least one red card.',
    withReplacement: false,
    data: {
      stages: 2,
      rootNode: buildWithoutReplacementTree(5, 3, 2),
      targetOutcomes: ['RR', 'RB', 'BR'], // At least one red = all except BB
    },
  },
];
