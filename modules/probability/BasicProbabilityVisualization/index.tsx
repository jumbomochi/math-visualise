/**
 * Basic Probability Visualization Module
 */

import { VisualizationModule } from '@/lib/core/types/VisualizationModule';
import { moduleRegistry } from '@/lib/core/registry/ModuleRegistry';
import { FC, useState, useEffect } from 'react';
import { VisualizationModuleProps } from '@/lib/core/types/VisualizationModule';
import { solveBasicProbability, BASIC_PROBABILITY_EXAMPLES } from '@/lib/math/probability';
import Card from '@/components/ui/Card';
import MathDisplay from '@/components/ui/MathDisplay';
import Button from '@/components/ui/Button';
import { Dices, CheckCircle2 } from 'lucide-react';

const BasicProbabilityModule: FC<VisualizationModuleProps> = ({ mathState, onStateChange }) => {
  const [currentExampleId, setCurrentExampleId] = useState('die');
  const result = mathState.computed as any;

  useEffect(() => {
    const computed = solveBasicProbability(currentExampleId);
    onStateChange({ computed: computed as any });
  }, [currentExampleId]);

  if (!result) return <div>Loading...</div>;

  const currentExample = BASIC_PROBABILITY_EXAMPLES.find(ex => ex.id === currentExampleId) || BASIC_PROBABILITY_EXAMPLES[0];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Basic Probability Concepts</h2>
        <p className="text-gray-600 mt-2">
          Understanding sample spaces, events, and calculating probabilities
        </p>
      </div>

      {/* Key Concept */}
      <Card className="bg-blue-50 border-2 border-blue-300">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Dices className="w-5 h-5" />
          Key Formula
        </h3>
        <div className="bg-white rounded p-3">
          <MathDisplay
            math="P(\text{Event}) = \frac{\text{Number of favorable outcomes}}{\text{Total number of possible outcomes}}"
            display="block"
          />
        </div>
      </Card>

      {/* Example Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Real-Life Examples</h3>
        <div className="flex gap-2 flex-wrap">
          {BASIC_PROBABILITY_EXAMPLES.map((example) => (
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
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-blue-900">{currentExample.title}</h3>
          <div className="bg-white border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">Question:</p>
            <div className="text-gray-800 space-y-2">
              <p>{currentExample.context}</p>
              <p className="font-medium">{currentExample.question}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Sample Space Visualization */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Sample Space</h3>
        <p className="text-sm text-gray-600 mb-4">{result.sampleSpace.description}</p>

        {/* Display outcomes if available */}
        {result.sampleSpace.outcomes.length > 0 && result.sampleSpace.outcomes.length <= 52 && (
          <div className="grid grid-cols-6 gap-2 mb-4">
            {result.sampleSpace.outcomes.map((outcome: any, idx: number) => {
              const isInTarget = result.targetEvent.outcomes.includes(outcome.id);
              return (
                <div
                  key={idx}
                  className={`p-3 rounded text-center font-semibold transition-all ${
                    isInTarget
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {outcome.value !== undefined ? outcome.value : outcome.id}
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-blue-50 rounded p-4">
          <p className="text-sm font-semibold text-blue-900">
            Total Outcomes: <span className="text-2xl ml-2">{result.sampleSpace.totalOutcomes}</span>
          </p>
        </div>
      </Card>

      {/* Target Event */}
      <Card className="bg-green-50">
        <h3 className="text-lg font-semibold mb-4 text-green-900">Target Event: {result.targetEvent.name}</h3>

        <div className="bg-white rounded p-4 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Favorable Outcomes:</p>
          <div className="flex flex-wrap gap-2">
            {result.targetEvent.outcomes.map((outcomeId: string, idx: number) => {
              const outcome = result.sampleSpace.outcomes.find((o: any) => o.id === outcomeId);
              return (
                <div key={idx} className="px-3 py-2 bg-green-500 text-white rounded font-semibold">
                  {outcome?.value !== undefined ? outcome.value : outcomeId}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-green-100 rounded p-4">
          <p className="text-sm font-semibold text-green-900">
            Favorable Outcomes: <span className="text-2xl ml-2">{result.targetEvent.outcomes.length}</span>
          </p>
        </div>
      </Card>

      {/* Solution */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
          Step-by-Step Solution
        </h3>

        <div className="space-y-3 mb-4">
          {result.explanation.map((step: string, idx: number) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                {idx + 1}
              </div>
              <p className="text-sm text-gray-700 flex-1">{step}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border-2 border-blue-200 rounded p-4">
          <MathDisplay math={result.formulaLatex} display="block" />
        </div>

        <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded p-4">
          <p className="text-sm text-blue-800 mb-2">Probability:</p>
          <p className="text-3xl font-bold text-blue-900">
            {result.probability.toFixed(4)} or {(result.probability * 100).toFixed(2)}%
          </p>
        </div>

        {/* Complement */}
        <div className="mt-4 bg-orange-50 border-2 border-orange-300 rounded p-4">
          <p className="text-sm font-semibold text-orange-900 mb-2">Complement (NOT {result.targetEvent.name}):</p>
          <p className="text-2xl font-bold text-orange-900">
            P(NOT {result.targetEvent.name}) = 1 - {result.probability.toFixed(4)} = {result.complement.toFixed(4)}
          </p>
        </div>
      </Card>
    </div>
  );
};

const basicProbabilityModule: VisualizationModule = {
  id: 'probability.basic-concepts',
  name: 'Basic Probability',
  description: 'Sample spaces, events, and calculating basic probabilities',
  syllabusRef: { strand: 'statistics-probability', topic: 'probability-basic' },
  engine: 'html',
  Component: BasicProbabilityModule,
  getInitialState: () => {
    const result = solveBasicProbability('die');
    return {
      topicId: 'probability.basic-concepts',
      parameters: {},
      inputs: {},
      computed: result as any,
      visualization: { showLabels: true },
    };
  },
  validateState: () => [],
  metadata: {
    version: '1.0.0',
    tags: ['probability', 'basic', 'sample-space', 'events'],
    difficulty: 'basic',
  },
};

moduleRegistry.register(basicProbabilityModule);
export default basicProbabilityModule;
