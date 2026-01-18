/**
 * Additive Principle Visualization Module
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import { FC, useState, useEffect } from 'react';
import { VisualizationModuleProps } from '@/core/types/VisualizationModule';
import { createAdditiveSample, ADDITIVE_EXAMPLES, CountingScenario } from '@/math/combinatorics';
import Card from '@/components/ui/Card';
import MathDisplay from '@/components/ui/MathDisplay';
import Button from '@/components/ui/Button';

const AdditivePrincipleModule: FC<VisualizationModuleProps> = ({ mathState, onStateChange }) => {
  const [currentExampleId, setCurrentExampleId] = useState('travel');
  const result = mathState.computed as any;

  useEffect(() => {
    const computed = createAdditiveSample(currentExampleId);
    onStateChange({ computed: computed as any });
  }, [currentExampleId]);

  if (!result) return <div>Loading</div>;

  const currentExample = ADDITIVE_EXAMPLES.find(ex => ex.id === currentExampleId) || ADDITIVE_EXAMPLES[0];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Additive Principle</h2>
        <p className="text-gray-600 mt-2">When events are mutually exclusive (OR), ADD the number of ways</p>
      </div>

      <Card className="bg-blue-50 border-2 border-blue-300">
        <h3 className="font-semibold text-blue-900 mb-2">Principle</h3>
        <p className="text-sm text-blue-800">{result.principle}</p>
      </Card>

      {/* Example Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Real-Life Examples</h3>
        <div className="flex gap-2 flex-wrap">
          {ADDITIVE_EXAMPLES.map((example) => (
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

      {/* Visual Representation */}
      <div className="grid grid-cols-2 gap-4">
        {result.scenarios.map((scenario: CountingScenario, idx: number) => (
          <Card key={idx} className="bg-white hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {scenario.choices.reduce((a: number, b: number) => a + b, 0)}
              </div>
              <p className="text-sm font-medium text-gray-700">{scenario.description}</p>
            </div>
          </Card>
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
        <div className="bg-white border-2 border-blue-200 rounded p-4 text-center">
          <MathDisplay math={result.formulaLatex} display="block" />
        </div>
        <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded p-4">
          <p className="text-2xl font-bold text-blue-600 text-center">
            Answer: {result.totalOutcomes} different ways
          </p>
        </div>
      </Card>
    </div>
  );
};

const additivePrincipleModule: VisualizationModule = {
  id: 'combinatorics.additive-principle',
  name: 'Additive Principle',
  description: 'When events are mutually exclusive (OR) - ADD the number of ways',
  syllabusRef: { strand: 'statistics-probability', topic: 'counting-principles' },
  engine: 'html',
  Component: AdditivePrincipleModule,
  getInitialState: () => {
    const sample = createAdditiveSample();
    return {
      topicId: 'combinatorics.additive-principle',
      parameters: {},
      inputs: {},
      computed: sample as any,
      visualization: { showLabels: true },
    };
  },
  validateState: () => [],
  metadata: {
    version: '1.0.0',
    tags: ['combinatorics', 'additive-principle', 'counting'],
    difficulty: 'basic',
  },
};

moduleRegistry.register(additivePrincipleModule);
export default additivePrincipleModule;
