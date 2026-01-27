/**
 * Tree Diagrams for Sequential Probability Visualization Module
 */

import { VisualizationModule } from '@/lib/core/types/VisualizationModule';
import { moduleRegistry } from '@/lib/core/registry/ModuleRegistry';
import { FC, useState, useEffect } from 'react';
import { VisualizationModuleProps } from '@/lib/core/types/VisualizationModule';
import {
  solveTreeDiagram,
  TREE_DIAGRAM_EXAMPLES,
  TreeNode,
  TreePath,
} from '@/lib/math/probability';
import Card from '@/components/ui/Card';
import MathDisplay from '@/components/ui/MathDisplay';
import Button from '@/components/ui/Button';
import { GitBranch, CheckCircle2, ArrowRight } from 'lucide-react';

const TreeDiagramsModule: FC<VisualizationModuleProps> = ({ mathState, onStateChange }) => {
  const [currentExampleId, setCurrentExampleId] = useState('three-coins');
  const [selectedPath, setSelectedPath] = useState<number | null>(null);
  const result = mathState.computed as any;

  useEffect(() => {
    const computed = solveTreeDiagram(currentExampleId);
    onStateChange({ computed: computed as any });
  }, [currentExampleId]);

  if (!result) return <div>Loading...</div>;

  const currentExample = TREE_DIAGRAM_EXAMPLES.find(ex => ex.id === currentExampleId) || TREE_DIAGRAM_EXAMPLES[0];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tree Diagrams for Sequential Probability</h2>
        <p className="text-gray-600 mt-2">
          Visualize sequential events and calculate probabilities along paths
        </p>
      </div>

      {/* Key Rules */}
      <Card className="bg-green-50 border-2 border-green-300">
        <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Tree Diagram Rules
        </h3>
        <div className="space-y-2 text-sm text-green-900">
          <p><strong>Rule 1:</strong> Multiply probabilities along each branch (path)</p>
          <p><strong>Rule 2:</strong> Add probabilities across different paths to the same outcome</p>
          <p><strong>Rule 3:</strong> All probabilities from a node must sum to 1</p>
        </div>
      </Card>

      {/* Example Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Examples</h3>
        <div className="flex gap-2 flex-wrap">
          {TREE_DIAGRAM_EXAMPLES.map((example) => (
            <Button
              key={example.id}
              onClick={() => {
                setCurrentExampleId(example.id);
                setSelectedPath(null);
              }}
              variant={currentExampleId === example.id ? 'primary' : 'secondary'}
            >
              {example.title}
            </Button>
          ))}
        </div>
      </Card>

      {/* Example Question */}
      <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-green-900">
            {currentExample.title}
          </h3>
          <div className="bg-white border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold mb-2 text-green-900">
              Question:
            </p>
            <div className="text-gray-800 space-y-2">
              <p>{currentExample.context}</p>
              <p className="font-medium">{currentExample.question}</p>
            </div>
          </div>
          <div className="bg-blue-100 border-l-4 border-blue-500 p-3 rounded">
            <p className="text-sm font-semibold text-blue-900">
              {currentExample.withReplacement ? '🔄 With Replacement' : '🚫 Without Replacement'}
            </p>
          </div>
        </div>
      </Card>

      {/* Tree Diagram Visualization */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Tree Diagram</h3>
        <div className="bg-gray-50 rounded-lg p-6 overflow-x-auto">
          <TreeDiagramSVG
            rootNode={result.data.rootNode}
            targetPaths={result.targetPaths}
            selectedPath={selectedPath}
            onPathSelect={setSelectedPath}
          />
        </div>
      </Card>

      {/* Target Paths */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Target Outcome Paths</h3>
        <div className="space-y-3">
          {result.targetPaths.map((path: TreePath, idx: number) => (
            <div
              key={idx}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedPath === idx
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-white hover:border-green-300'
              }`}
              onClick={() => setSelectedPath(idx)}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-900">Path {idx + 1}: {path.outcome}</p>
                <p className="text-lg font-bold text-green-700">
                  P = {path.probability.toFixed(4)}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ArrowRight className="w-4 h-4" />
                <p>{path.pathDescription}</p>
              </div>
              <div className="mt-2 bg-gray-100 rounded p-2">
                <p className="text-xs font-mono text-gray-700">
                  Calculation: {path.nodes
                    .filter(n => n.label !== 'Start')
                    .map(n => n.probability.toFixed(2))
                    .join(' × ')} = {path.probability.toFixed(4)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Solution */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          Step-by-Step Solution
        </h3>

        <div className="space-y-2 mb-4">
          {result.explanation.map((line: string, idx: number) => (
            <p key={idx} className="text-sm text-gray-700">
              {line}
            </p>
          ))}
        </div>

        <div className="bg-white border-2 border-green-200 rounded p-4 mb-4">
          <MathDisplay math={result.formulaLatex} display="block" />
        </div>

        <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded p-4">
          <p className="text-sm text-gray-700 mb-2">Final Probability:</p>
          <p className="text-3xl font-bold text-green-900">
            {result.totalProbability.toFixed(4)} or {(result.totalProbability * 100).toFixed(2)}%
          </p>
        </div>
      </Card>
    </div>
  );
};

/**
 * Tree Diagram SVG Component
 */
interface TreeDiagramSVGProps {
  rootNode: TreeNode;
  targetPaths: TreePath[];
  selectedPath: number | null;
  onPathSelect: (idx: number) => void;
}

const TreeDiagramSVG: FC<TreeDiagramSVGProps> = ({
  rootNode,
  targetPaths,
  selectedPath,
  onPathSelect,
}) => {
  // Calculate tree dimensions
  const getTreeDepth = (node: TreeNode): number => {
    if (!node.children || node.children.length === 0) return 1;
    return 1 + Math.max(...node.children.map(getTreeDepth));
  };

  const getLeafCount = (node: TreeNode): number => {
    if (!node.children || node.children.length === 0) return 1;
    return node.children.reduce((sum, child) => sum + getLeafCount(child), 0);
  };

  const depth = getTreeDepth(rootNode);
  const leafCount = getLeafCount(rootNode);

  // SVG dimensions
  const nodeRadius = 25;
  const levelWidth = 120;
  const width = Math.max(600, depth * levelWidth + 100);
  const nodeSpacing = 60;
  const height = Math.max(400, leafCount * nodeSpacing + 100);

  // Check if a path should be highlighted
  const isPathHighlighted = (path: TreeNode[]): boolean => {
    if (selectedPath === null) {
      // Highlight all target paths
      return targetPaths.some(targetPath =>
        targetPath.nodes.every((node, idx) => node.id === path[idx]?.id)
      );
    } else {
      // Highlight only the selected path
      const targetPath = targetPaths[selectedPath];
      return targetPath.nodes.every((node, idx) => node.id === path[idx]?.id);
    }
  };

  // Recursive function to render tree nodes
  interface NodePosition {
    x: number;
    y: number;
    node: TreeNode;
    path: TreeNode[];
  }

  const positions: NodePosition[] = [];

  const calculatePositions = (
    node: TreeNode,
    x: number,
    y: number,
    path: TreeNode[]
  ): number => {
    const currentPath = [...path, node];
    positions.push({ x, y, node, path: currentPath });

    if (!node.children || node.children.length === 0) {
      return y;
    }

    let currentY = y;
    const childPositions: number[] = [];

    node.children.forEach((child) => {
      const childY = calculatePositions(child, x + levelWidth, currentY, currentPath);
      childPositions.push(childY);
      currentY = childY + nodeSpacing;
    });

    // Center parent between children
    const newY = (childPositions[0] + childPositions[childPositions.length - 1]) / 2;
    positions[positions.length - node.children.length - 1].y = newY;

    return newY;
  };

  calculatePositions(rootNode, 50, height / 2, []);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Draw edges first (so they appear behind nodes) */}
      {positions.map((pos, idx) => {
        if (!pos.node.children) return null;
        return pos.node.children.map((child, childIdx) => {
          const childPos = positions.find(p => p.node.id === child.id);
          if (!childPos) return null;

          const isHighlighted = isPathHighlighted([...pos.path, child]);

          return (
            <g key={`${idx}-${childIdx}`}>
              <line
                x1={pos.x}
                y1={pos.y}
                x2={childPos.x}
                y2={childPos.y}
                stroke={isHighlighted ? '#10B981' : '#D1D5DB'}
                strokeWidth={isHighlighted ? 3 : 2}
                opacity={isHighlighted ? 1 : 0.5}
              />
              {/* Probability label on branch */}
              <text
                x={(pos.x + childPos.x) / 2}
                y={(pos.y + childPos.y) / 2 - 5}
                fontSize="12"
                fontWeight={isHighlighted ? 'bold' : 'normal'}
                fill={isHighlighted ? '#059669' : '#6B7280'}
                textAnchor="middle"
              >
                {child.probability.toFixed(2)}
              </text>
            </g>
          );
        });
      })}

      {/* Draw nodes */}
      {positions.map((pos, idx) => {
        const isInTargetPath = targetPaths.some(targetPath =>
          targetPath.nodes.some(node => node.id === pos.node.id)
        );
        const isHighlighted = isPathHighlighted(pos.path);
        const isLeaf = !pos.node.children || pos.node.children.length === 0;

        return (
          <g key={idx}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={nodeRadius}
              fill={isHighlighted ? '#10B981' : isInTargetPath ? '#60A5FA' : '#FFFFFF'}
              stroke={isHighlighted ? '#059669' : '#9CA3AF'}
              strokeWidth={isHighlighted ? 3 : 2}
            />
            <text
              x={pos.x}
              y={pos.y + 5}
              fontSize="14"
              fontWeight="bold"
              fill={isHighlighted ? '#FFFFFF' : '#374151'}
              textAnchor="middle"
            >
              {pos.node.label}
            </text>
            {/* Show outcome for leaf nodes */}
            {isLeaf && pos.node.outcome && (
              <text
                x={pos.x + nodeRadius + 10}
                y={pos.y + 5}
                fontSize="12"
                fontWeight="bold"
                fill="#059669"
              >
                {pos.node.outcome}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const treeDiagramsModule: VisualizationModule = {
  id: 'probability.tree-diagrams',
  name: 'Tree Diagrams',
  description: 'Sequential probability visualization using tree diagrams',
  syllabusRef: { strand: 'statistics-probability', topic: 'probability-basic' },
  engine: 'html',
  Component: TreeDiagramsModule,
  getInitialState: () => {
    const result = solveTreeDiagram('three-coins');
    return {
      topicId: 'probability.tree-diagrams',
      parameters: {},
      inputs: {},
      computed: result as any,
      visualization: { showLabels: true },
    };
  },
  validateState: () => [],
  metadata: {
    version: '1.0.0',
    tags: ['probability', 'tree-diagrams', 'sequential-events', 'conditional'],
    difficulty: 'intermediate',
  },
};

moduleRegistry.register(treeDiagramsModule);
export default treeDiagramsModule;
