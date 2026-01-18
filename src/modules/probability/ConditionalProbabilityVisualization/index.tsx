/**
 * Conditional Probability and Bayes' Theorem Visualization Module
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import { FC, useState, useEffect } from 'react';
import { VisualizationModuleProps } from '@/core/types/VisualizationModule';
import {
  solveConditionalProbability,
  solveBayesTheorem,
  CONDITIONAL_PROBABILITY_EXAMPLES,
} from '@/math/probability';
import Card from '@/components/ui/Card';
import MathDisplay from '@/components/ui/MathDisplay';
import Button from '@/components/ui/Button';
import { GitBranch, CheckCircle2 } from 'lucide-react';

const ConditionalProbabilityModule: FC<VisualizationModuleProps> = ({ mathState, onStateChange }) => {
  const [currentType, setCurrentType] = useState<'conditional' | 'bayes'>('conditional');
  const [currentExampleId, setCurrentExampleId] = useState('cards-face-given-red');
  const result = mathState.computed as any;

  useEffect(() => {
    let computed;
    if (currentType === 'conditional') {
      computed = solveConditionalProbability(currentExampleId);
    } else {
      computed = solveBayesTheorem(currentExampleId);
    }
    onStateChange({ computed: computed as any });
  }, [currentType, currentExampleId]);

  const handleTypeChange = (type: 'conditional' | 'bayes') => {
    setCurrentType(type);
    if (type === 'conditional') {
      setCurrentExampleId('cards-face-given-red');
    } else {
      setCurrentExampleId('medical-test-bayes');
    }
  };

  if (!result) return <div>Loading...</div>;

  const examples = CONDITIONAL_PROBABILITY_EXAMPLES.filter(ex => ex.type === currentType);
  const currentExample = examples.find(ex => ex.id === currentExampleId) || examples[0];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Conditional Probability & Bayes' Theorem</h2>
        <p className="text-gray-600 mt-2">
          Understanding probability when additional information is known
        </p>
      </div>

      {/* Type Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Select Topic</h3>
        <div className="flex gap-3">
          <Button
            onClick={() => handleTypeChange('conditional')}
            variant={currentType === 'conditional' ? 'primary' : 'secondary'}
            className="flex-1"
          >
            Conditional Probability
          </Button>
          <Button
            onClick={() => handleTypeChange('bayes')}
            variant={currentType === 'bayes' ? 'primary' : 'secondary'}
            className="flex-1"
          >
            Bayes' Theorem
          </Button>
        </div>
      </Card>

      {/* Key Formula */}
      {currentType === 'conditional' ? (
        <Card className="bg-blue-50 border-2 border-blue-300">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Conditional Probability Formula
          </h3>
          <div className="bg-white rounded p-3">
            <MathDisplay
              math="P(A|B) = \frac{P(A \cap B)}{P(B)}"
              display="block"
            />
          </div>
          <p className="text-sm text-blue-800 mt-3">
            "The probability of A given that B has occurred"
          </p>
        </Card>
      ) : (
        <Card className="bg-purple-50 border-2 border-purple-300">
          <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Bayes' Theorem
          </h3>
          <div className="space-y-3">
            <div className="bg-white rounded p-3">
              <MathDisplay
                math="P(H|E) = \frac{P(E|H) \times P(H)}{P(E)}"
                display="block"
              />
            </div>
            <div className="bg-purple-100 rounded p-3">
              <p className="text-sm text-purple-900 font-semibold mb-1">Law of Total Probability:</p>
              <MathDisplay
                math="P(E) = P(E|H) \times P(H) + P(E|H') \times P(H')"
                display="block"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Example Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Real-Life Examples</h3>
        <div className="flex gap-2 flex-wrap">
          {examples.map((example) => (
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
      <Card className={`bg-gradient-to-r border-2 ${
        currentType === 'conditional'
          ? 'from-blue-50 to-indigo-50 border-blue-200'
          : 'from-purple-50 to-indigo-50 border-purple-200'
      }`}>
        <div className="space-y-3">
          <h3 className={`text-lg font-bold ${
            currentType === 'conditional' ? 'text-blue-900' : 'text-purple-900'
          }`}>
            {currentExample.title}
          </h3>
          <div className={`bg-white border-l-4 p-4 rounded ${
            currentType === 'conditional' ? 'border-blue-500' : 'border-purple-500'
          }`}>
            <p className={`font-semibold mb-2 ${
              currentType === 'conditional' ? 'text-blue-900' : 'text-purple-900'
            }`}>
              Question:
            </p>
            <div className="text-gray-800 space-y-2">
              <p>{currentExample.context}</p>
              <p className="font-medium">{currentExample.question}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Given Information */}
      {currentType === 'conditional' ? (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Given Information</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 border-2 border-blue-300 rounded p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">P({result.eventA})</p>
              <p className="text-2xl font-bold text-blue-900">{result.probA.toFixed(4)}</p>
            </div>
            <div className="bg-orange-50 border-2 border-orange-300 rounded p-4">
              <p className="text-sm font-semibold text-orange-900 mb-2">P({result.eventB})</p>
              <p className="text-2xl font-bold text-orange-900">{result.probB.toFixed(4)}</p>
            </div>
            <div className="bg-indigo-50 border-2 border-indigo-300 rounded p-4">
              <p className="text-sm font-semibold text-indigo-900 mb-2">P({result.eventA} ∩ {result.eventB})</p>
              <p className="text-2xl font-bold text-indigo-900">{result.probAandB.toFixed(4)}</p>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Given Information</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 border-2 border-blue-300 rounded p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">Prior Probability</p>
              <p className="text-lg">P(H) = <span className="text-2xl font-bold text-blue-900">{result.priorProbability.toFixed(4)}</span></p>
            </div>
            <div className="bg-green-50 border-2 border-green-300 rounded p-4">
              <p className="text-sm font-semibold text-green-900 mb-2">Likelihood (if H true)</p>
              <p className="text-lg">P(E|H) = <span className="text-2xl font-bold text-green-900">{result.likelihoodGivenTrue.toFixed(4)}</span></p>
            </div>
          </div>
          <div className="bg-orange-50 border-2 border-orange-300 rounded p-4">
            <p className="text-sm font-semibold text-orange-900 mb-2">Likelihood (if H false)</p>
            <p className="text-lg">P(E|H') = <span className="text-2xl font-bold text-orange-900">{result.likelihoodGivenFalse.toFixed(4)}</span></p>
          </div>
        </Card>
      )}

      {/* Solution */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          Step-by-Step Solution
        </h3>

        <div className="space-y-3 mb-4">
          {result.steps.map((step: string, idx: number) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                {step === '' ? '·' : idx + 1 - result.steps.slice(0, idx).filter((s: string) => s === '').length}
              </div>
              <p className="text-sm text-gray-700 flex-1">{step || ' '}</p>
            </div>
          ))}
        </div>

        <div className={`bg-white border-2 rounded p-4 ${
          currentType === 'conditional' ? 'border-blue-200' : 'border-purple-200'
        }`}>
          <MathDisplay math={result.formulaLatex} display="block" />
        </div>

        <div className={`mt-4 bg-gradient-to-r border-2 rounded p-4 ${
          currentType === 'conditional'
            ? 'from-blue-50 to-indigo-50 border-blue-300'
            : 'from-purple-50 to-indigo-50 border-purple-300'
        }`}>
          {currentType === 'conditional' ? (
            <>
              <p className="text-sm text-gray-700 mb-2">Conditional Probabilities:</p>
              <p className="text-2xl font-bold text-blue-900 mb-2">
                P({result.eventA}|{result.eventB}) = {result.probAgivenB.toFixed(4)} or {(result.probAgivenB * 100).toFixed(2)}%
              </p>
              <p className="text-2xl font-bold text-green-900">
                P({result.eventB}|{result.eventA}) = {result.probBgivenA.toFixed(4)} or {(result.probBgivenA * 100).toFixed(2)}%
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-700 mb-2">Posterior Probability:</p>
              <p className="text-3xl font-bold text-purple-900">
                P(H|E) = {result.posteriorProbability.toFixed(4)} or {(result.posteriorProbability * 100).toFixed(2)}%
              </p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

const conditionalProbabilityModule: VisualizationModule = {
  id: 'probability.conditional',
  name: 'Conditional Probability & Bayes',
  description: 'Conditional probability and Bayes\' Theorem with real-world applications',
  syllabusRef: { strand: 'statistics-probability', topic: 'probability-basic' },
  engine: 'html',
  Component: ConditionalProbabilityModule,
  getInitialState: () => {
    const result = solveConditionalProbability('cards-face-given-red');
    return {
      topicId: 'probability.conditional',
      parameters: {},
      inputs: {},
      computed: result as any,
      visualization: { showLabels: true },
    };
  },
  validateState: () => [],
  metadata: {
    version: '1.0.0',
    tags: ['probability', 'conditional', 'bayes-theorem', 'inference'],
    difficulty: 'advanced',
  },
};

moduleRegistry.register(conditionalProbabilityModule);
export default conditionalProbabilityModule;
