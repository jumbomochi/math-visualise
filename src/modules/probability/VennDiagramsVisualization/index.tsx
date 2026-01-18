/**
 * Venn Diagrams & Set Notation Visualization Module
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import { FC, useState, useEffect } from 'react';
import { VisualizationModuleProps } from '@/core/types/VisualizationModule';
import {
  solveVennDiagram,
  VENN_DIAGRAM_EXAMPLES,
} from '@/math/probability';
import Card from '@/components/ui/Card';
import MathDisplay from '@/components/ui/MathDisplay';
import Button from '@/components/ui/Button';
import { Circle, CheckCircle2 } from 'lucide-react';

const VennDiagramsModule: FC<VisualizationModuleProps> = ({ mathState, onStateChange }) => {
  const [currentExampleId, setCurrentExampleId] = useState('students-sports');
  const result = mathState.computed as any;

  useEffect(() => {
    const computed = solveVennDiagram(currentExampleId);
    onStateChange({ computed: computed as any });
  }, [currentExampleId]);

  if (!result) return <div>Loading...</div>;

  const currentExample = VENN_DIAGRAM_EXAMPLES.find(ex => ex.id === currentExampleId) || VENN_DIAGRAM_EXAMPLES[0];
  const hasThreeSets = !!result.data.setC;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Venn Diagrams & Set Notation</h2>
        <p className="text-gray-600 mt-2">
          Visual representation of set operations and probability
        </p>
      </div>

      {/* Key Formulas */}
      <Card className="bg-purple-50 border-2 border-purple-300">
        <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
          <Circle className="w-5 h-5" />
          Set Operations
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded p-3">
            <p className="text-sm font-semibold text-gray-700 mb-1">Union (OR)</p>
            <MathDisplay math="A \cup B" display="block" />
          </div>
          <div className="bg-white rounded p-3">
            <p className="text-sm font-semibold text-gray-700 mb-1">Intersection (AND)</p>
            <MathDisplay math="A \cap B" display="block" />
          </div>
          <div className="bg-white rounded p-3">
            <p className="text-sm font-semibold text-gray-700 mb-1">Complement (NOT)</p>
            <MathDisplay math="A'" display="block" />
          </div>
          <div className="bg-white rounded p-3">
            <p className="text-sm font-semibold text-gray-700 mb-1">Difference (A but not B)</p>
            <MathDisplay math="A - B" display="block" />
          </div>
        </div>
      </Card>

      {/* Example Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Real-Life Examples</h3>
        <div className="flex gap-2 flex-wrap">
          {VENN_DIAGRAM_EXAMPLES.map((example) => (
            <Button
              key={example.id}
              onClick={() => setCurrentExampleId(example.id)}
              variant={currentExampleId === example.id ? 'primary' : 'secondary'}
            >
              {example.title}
            </Button>
          ))}
        </div>
      </Card>

      {/* Example Question */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-purple-900">
            {currentExample.title}
          </h3>
          <div className="bg-white border-l-4 border-purple-500 p-4 rounded">
            <p className="font-semibold mb-2 text-purple-900">
              Question:
            </p>
            <div className="text-gray-800 space-y-2">
              <p>{currentExample.context}</p>
              <p className="font-medium">{currentExample.question}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Venn Diagram Visualization */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Venn Diagram</h3>
        <div className="bg-gray-50 rounded-lg p-6 flex justify-center">
          {hasThreeSets ? (
            <ThreeSetVennDiagram result={result} />
          ) : (
            <TwoSetVennDiagram result={result} />
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border-2"
              style={{
                backgroundColor: `${result.data.setA.color}40`,
                borderColor: result.data.setA.color
              }}
            />
            <span className="text-sm font-medium">{result.data.setA.name} ({result.data.setA.label})</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border-2"
              style={{
                backgroundColor: `${result.data.setB.color}40`,
                borderColor: result.data.setB.color
              }}
            />
            <span className="text-sm font-medium">{result.data.setB.name} ({result.data.setB.label})</span>
          </div>
          {hasThreeSets && (
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full border-2"
                style={{
                  backgroundColor: `${result.data.setC.color}40`,
                  borderColor: result.data.setC.color
                }}
              />
              <span className="text-sm font-medium">{result.data.setC.name} ({result.data.setC.label})</span>
            </div>
          )}
        </div>
      </Card>

      {/* Set Information */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Set Information</h3>
        <div className="grid grid-cols-3 gap-4">
          <div
            className="border-2 rounded p-4"
            style={{
              backgroundColor: `${result.data.setA.color}20`,
              borderColor: result.data.setA.color
            }}
          >
            <p className="text-sm font-semibold mb-2" style={{ color: result.data.setA.color }}>
              {result.data.setA.name} ({result.data.setA.label})
            </p>
            <p className="text-2xl font-bold" style={{ color: result.data.setA.color }}>
              {result.data.setA.count || result.data.setA.elements.length}
            </p>
          </div>
          <div
            className="border-2 rounded p-4"
            style={{
              backgroundColor: `${result.data.setB.color}20`,
              borderColor: result.data.setB.color
            }}
          >
            <p className="text-sm font-semibold mb-2" style={{ color: result.data.setB.color }}>
              {result.data.setB.name} ({result.data.setB.label})
            </p>
            <p className="text-2xl font-bold" style={{ color: result.data.setB.color }}>
              {result.data.setB.count || result.data.setB.elements.length}
            </p>
          </div>
          {hasThreeSets && (
            <div
              className="border-2 rounded p-4"
              style={{
                backgroundColor: `${result.data.setC.color}20`,
                borderColor: result.data.setC.color
              }}
            >
              <p className="text-sm font-semibold mb-2" style={{ color: result.data.setC.color }}>
                {result.data.setC.name} ({result.data.setC.label})
              </p>
              <p className="text-2xl font-bold" style={{ color: result.data.setC.color }}>
                {result.data.setC.count || result.data.setC.elements.length}
              </p>
            </div>
          )}
          <div className="bg-indigo-50 border-2 border-indigo-300 rounded p-4">
            <p className="text-sm font-semibold text-indigo-900 mb-2">
              {result.data.setA.label} ∩ {result.data.setB.label}
            </p>
            <p className="text-2xl font-bold text-indigo-900">
              {result.data.intersection.AB.length}
            </p>
          </div>
        </div>
      </Card>

      {/* Solution */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          Solution
        </h3>

        <div className="space-y-3 mb-4">
          {result.explanation.map((line: string, idx: number) => (
            <p key={idx} className="text-sm text-gray-700">
              {line}
            </p>
          ))}
        </div>

        <div className="bg-white border-2 border-purple-200 rounded p-4 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Set Notation:</p>
          <MathDisplay math={result.setNotation} display="block" />
        </div>

        <div className="bg-white border-2 border-purple-200 rounded p-4 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Formula:</p>
          <MathDisplay math={result.formulaLatex} display="block" />
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded p-4">
          <p className="text-sm text-gray-700 mb-2">Result:</p>
          <p className="text-3xl font-bold text-purple-900 mb-2">
            {result.resultCount} elements
          </p>
          <p className="text-2xl font-bold text-indigo-900">
            Probability: {(result.resultProbability * 100).toFixed(2)}%
          </p>
        </div>
      </Card>
    </div>
  );
};

/**
 * Two-Set Venn Diagram SVG Component
 */
const TwoSetVennDiagram: FC<{ result: any }> = ({ result }) => {
  const { data, targetOperation, resultElements } = result;

  // SVG dimensions
  const width = 500;
  const height = 300;
  const radius = 80;

  // Circle centers
  const centerA = { x: width / 2 - 40, y: height / 2 };
  const centerB = { x: width / 2 + 40, y: height / 2 };

  // Determine which regions to highlight
  const shouldHighlight = (region: string) => {
    const setAElems = data.setA.elements;
    const setBElems = data.setB.elements;
    const intersectionElems = data.intersection.AB;
    const onlyA = setAElems.filter((e: string) => !intersectionElems.includes(e));
    const onlyB = setBElems.filter((e: string) => !intersectionElems.includes(e));

    switch (targetOperation) {
      case 'union':
        return region === 'A' || region === 'B' || region === 'AB';
      case 'intersection':
        return region === 'AB';
      case 'complement':
        return region === 'outside';
      case 'difference':
        return region === 'A-only';
      case 'symmetric-difference':
        return region === 'A-only' || region === 'B-only';
      default:
        return false;
    }
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Universal set rectangle */}
      <rect
        x={50}
        y={30}
        width={width - 100}
        height={height - 60}
        fill={shouldHighlight('outside') ? '#FEF3C7' : '#F3F4F6'}
        stroke="#6B7280"
        strokeWidth="2"
        rx="8"
      />
      <text x={60} y={50} fontSize="14" fontWeight="bold" fill="#374151">
        Universal Set ({data.universalSet.name})
      </text>

      {/* Set A (left circle) */}
      <circle
        cx={centerA.x}
        cy={centerA.y}
        r={radius}
        fill={shouldHighlight('A') || shouldHighlight('A-only') ? data.setA.color : `${data.setA.color}40`}
        stroke={data.setA.color}
        strokeWidth="3"
        opacity={shouldHighlight('A') || shouldHighlight('A-only') || shouldHighlight('AB') ? 0.7 : 0.3}
      />
      <text
        x={centerA.x - 50}
        y={centerA.y}
        fontSize="16"
        fontWeight="bold"
        fill={data.setA.color}
      >
        {data.setA.label}
      </text>

      {/* Set B (right circle) */}
      <circle
        cx={centerB.x}
        cy={centerB.y}
        r={radius}
        fill={shouldHighlight('B') || shouldHighlight('B-only') ? data.setB.color : `${data.setB.color}40`}
        stroke={data.setB.color}
        strokeWidth="3"
        opacity={shouldHighlight('B') || shouldHighlight('B-only') || shouldHighlight('AB') ? 0.7 : 0.3}
      />
      <text
        x={centerB.x + 40}
        y={centerB.y}
        fontSize="16"
        fontWeight="bold"
        fill={data.setB.color}
      >
        {data.setB.label}
      </text>

      {/* Intersection highlight */}
      {shouldHighlight('AB') && (
        <ellipse
          cx={(centerA.x + centerB.x) / 2}
          cy={centerA.y}
          rx={30}
          ry={radius}
          fill="#8B5CF6"
          opacity="0.6"
        />
      )}

      {/* Intersection label */}
      <text
        x={(centerA.x + centerB.x) / 2}
        y={centerA.y}
        fontSize="14"
        fontWeight="bold"
        fill="#374151"
        textAnchor="middle"
      >
        {data.intersection.AB.length}
      </text>
    </svg>
  );
};

/**
 * Three-Set Venn Diagram SVG Component
 */
const ThreeSetVennDiagram: FC<{ result: any }> = ({ result }) => {
  const { data } = result;

  const width = 500;
  const height = 350;
  const radius = 70;

  // Circle centers (triangular arrangement)
  const centerA = { x: width / 2, y: height / 2 - 40 };
  const centerB = { x: width / 2 - 50, y: height / 2 + 30 };
  const centerC = { x: width / 2 + 50, y: height / 2 + 30 };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Universal set rectangle */}
      <rect
        x={50}
        y={30}
        width={width - 100}
        height={height - 60}
        fill="#F3F4F6"
        stroke="#6B7280"
        strokeWidth="2"
        rx="8"
      />
      <text x={60} y={50} fontSize="14" fontWeight="bold" fill="#374151">
        Universal Set
      </text>

      {/* Set A (top circle) */}
      <circle
        cx={centerA.x}
        cy={centerA.y}
        r={radius}
        fill={`${data.setA.color}40`}
        stroke={data.setA.color}
        strokeWidth="3"
        opacity="0.5"
      />
      <text
        x={centerA.x}
        y={centerA.y - 50}
        fontSize="16"
        fontWeight="bold"
        fill={data.setA.color}
        textAnchor="middle"
      >
        {data.setA.label}
      </text>

      {/* Set B (bottom-left circle) */}
      <circle
        cx={centerB.x}
        cy={centerB.y}
        r={radius}
        fill={`${data.setB.color}40`}
        stroke={data.setB.color}
        strokeWidth="3"
        opacity="0.5"
      />
      <text
        x={centerB.x - 50}
        y={centerB.y + 40}
        fontSize="16"
        fontWeight="bold"
        fill={data.setB.color}
      >
        {data.setB.label}
      </text>

      {/* Set C (bottom-right circle) */}
      <circle
        cx={centerC.x}
        cy={centerC.y}
        r={radius}
        fill={`${data.setC.color}40`}
        stroke={data.setC.color}
        strokeWidth="3"
        opacity="0.5"
      />
      <text
        x={centerC.x + 50}
        y={centerC.y + 40}
        fontSize="16"
        fontWeight="bold"
        fill={data.setC.color}
      >
        {data.setC.label}
      </text>

      {/* Intersection labels */}
      <text
        x={centerA.x}
        y={centerA.y}
        fontSize="12"
        fontWeight="bold"
        fill="#374151"
        textAnchor="middle"
      >
        {data.intersection.ABC?.length || 0}
      </text>
    </svg>
  );
};

const vennDiagramsModule: VisualizationModule = {
  id: 'probability.venn-diagrams',
  name: 'Venn Diagrams & Set Notation',
  description: 'Visual representation of set operations and probability using Venn diagrams',
  syllabusRef: { strand: 'statistics-probability', topic: 'probability-basic' },
  engine: 'html',
  Component: VennDiagramsModule,
  getInitialState: () => {
    const result = solveVennDiagram('students-sports');
    return {
      topicId: 'probability.venn-diagrams',
      parameters: {},
      inputs: {},
      computed: result as any,
      visualization: { showLabels: true },
    };
  },
  validateState: () => [],
  metadata: {
    version: '1.0.0',
    tags: ['probability', 'venn-diagrams', 'set-theory', 'set-operations'],
    difficulty: 'intermediate',
  },
};

moduleRegistry.register(vennDiagramsModule);
export default vennDiagramsModule;
