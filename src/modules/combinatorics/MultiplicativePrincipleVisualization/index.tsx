/**
 * Multiplicative Principle Visualization Module
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import { FC, useState, useEffect } from 'react';
import { VisualizationModuleProps } from '@/core/types/VisualizationModule';
import { createMultiplicativeSample, MULTIPLICATIVE_EXAMPLES } from '@/math/combinatorics';
import Card from '@/components/ui/Card';
import MathDisplay from '@/components/ui/MathDisplay';
import Button from '@/components/ui/Button';

const MultiplicativePrincipleModule: FC<VisualizationModuleProps> = ({ mathState, onStateChange }) => {
  const [currentExampleId, setCurrentExampleId] = useState('password');
  const result = mathState.computed as any;

  useEffect(() => {
    const computed = createMultiplicativeSample(currentExampleId);
    onStateChange({ computed: computed as any });
  }, [currentExampleId]);

  if (!result) return <div>Loading</div>;

  const currentExample = MULTIPLICATIVE_EXAMPLES.find(ex => ex.id === currentExampleId) || MULTIPLICATIVE_EXAMPLES[0];
  const stages = result.stages;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Multiplicative Principle</h2>
        <p className="text-gray-600 mt-2">When events occur in sequence (AND), MULTIPLY the number of choices</p>
      </div>

      <Card className="bg-green-50 border-2 border-green-300">
        <h3 className="font-semibold text-green-900 mb-2">Principle</h3>
        <p className="text-sm text-green-800">{result.principle}</p>
      </Card>

      {/* Example Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Real-Life Examples</h3>
        <div className="flex gap-2 flex-wrap">
          {MULTIPLICATIVE_EXAMPLES.map((example) => (
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
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-green-900">{currentExample.title}</h3>
          <div className="bg-white border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold text-green-900 mb-2">Question:</p>
            <div className="text-gray-800 space-y-2">
              <p>{currentExample.context}</p>
              <p className="font-medium">{currentExample.question}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Visual Representation */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {stages.choices.map((choice: number, idx: number) => (
          <div key={idx} className="flex items-center gap-4">
            <Card className="bg-white text-center min-w-[120px] hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-green-600 mb-2">{choice}</div>
              <p className="text-sm font-medium text-gray-700">{stages.labels[idx]}</p>
            </Card>
            {idx < stages.choices.length - 1 && (
              <div className="text-3xl font-bold text-gray-400">×</div>
            )}
          </div>
        ))}
      </div>

      {/* Calculation */}
      <Card>
        <h3 className="text-lg font-semibold mb-3">Step-by-Step Solution</h3>
        <div className="space-y-3 mb-4">
          {result.explanation.map((step: string, idx: number) => (
            <p key={idx} className="text-sm text-gray-700">{step}</p>
          ))}
        </div>
        <div className="bg-white border-2 border-green-200 rounded p-4 text-center">
          <MathDisplay math={result.formulaLatex} display="block" />
        </div>
        <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded p-4">
          <p className="text-2xl font-bold text-green-600 text-center">
            Answer: {result.totalOutcomes} different combinations
          </p>
        </div>
      </Card>
    </div>
  );
};

const multiplicativePrincipleModule: VisualizationModule = {
  id: 'combinatorics.multiplicative-principle',
  name: 'Multiplicative Principle',
  description: 'When events occur in sequence (AND) - MULTIPLY the number of choices',
  syllabusRef: { strand: 'statistics-probability', topic: 'counting-principles' },
  engine: 'html',
  Component: MultiplicativePrincipleModule,
  getInitialState: () => {
    const sample = createMultiplicativeSample();
    return {
      topicId: 'combinatorics.multiplicative-principle',
      parameters: {},
      inputs: {},
      computed: sample as any,
      visualization: { showLabels: true },
    };
  },
  validateState: () => [],
  metadata: {
    version: '1.0.0',
    tags: ['combinatorics', 'multiplicative-principle', 'counting'],
    difficulty: 'basic',
  },
};

moduleRegistry.register(multiplicativePrincipleModule);
export default multiplicativePrincipleModule;
