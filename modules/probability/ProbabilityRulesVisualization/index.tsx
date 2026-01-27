/**
 * Probability Rules Visualization Module
 *
 * Demonstrates Addition Rule and Multiplication Rule
 */

import { VisualizationModule } from '@/lib/core/types/VisualizationModule';
import { moduleRegistry } from '@/lib/core/registry/ModuleRegistry';
import { FC, useState, useEffect } from 'react';
import { VisualizationModuleProps } from '@/lib/core/types/VisualizationModule';
import {
  solveAdditionRule,
  solveMultiplicationRule,
  ADDITION_RULE_EXAMPLES,
  MULTIPLICATION_RULE_EXAMPLES,
} from '@/lib/math/probability';
import Card from '@/components/ui/Card';
import MathDisplay from '@/components/ui/MathDisplay';
import Button from '@/components/ui/Button';
import { Plus, X, CheckCircle2 } from 'lucide-react';

const ProbabilityRulesModule: FC<VisualizationModuleProps> = ({ mathState, onStateChange }) => {
  const [currentRule, setCurrentRule] = useState<'addition' | 'multiplication'>('addition');
  const [currentExampleId, setCurrentExampleId] = useState('card-heart-or-king');
  const result = mathState.computed as any;

  useEffect(() => {
    let computed;
    if (currentRule === 'addition') {
      computed = solveAdditionRule(currentExampleId);
    } else {
      computed = solveMultiplicationRule(currentExampleId);
    }
    onStateChange({ computed: computed as any });
  }, [currentRule, currentExampleId]);

  const handleRuleChange = (rule: 'addition' | 'multiplication') => {
    setCurrentRule(rule);
    if (rule === 'addition') {
      setCurrentExampleId('card-heart-or-king');
    } else {
      setCurrentExampleId('two-dice-independent');
    }
  };

  if (!result) return <div>Loading...</div>;

  const examples = currentRule === 'addition' ? ADDITION_RULE_EXAMPLES : MULTIPLICATION_RULE_EXAMPLES;
  const currentExample = examples.find(ex => ex.id === currentExampleId) || examples[0];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Probability Rules</h2>
        <p className="text-gray-600 mt-2">
          Addition Rule (OR) and Multiplication Rule (AND)
        </p>
      </div>

      {/* Rule Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Select a Rule</h3>
        <div className="flex gap-3">
          <Button
            onClick={() => handleRuleChange('addition')}
            variant={currentRule === 'addition' ? 'primary' : 'secondary'}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Addition Rule (OR)
          </Button>
          <Button
            onClick={() => handleRuleChange('multiplication')}
            variant={currentRule === 'multiplication' ? 'primary' : 'secondary'}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Multiplication Rule (AND)
          </Button>
        </div>
      </Card>

      {/* Key Formula */}
      {currentRule === 'addition' ? (
        <Card className="bg-green-50 border-2 border-green-300">
          <h3 className="font-semibold text-green-900 mb-3">Addition Rule (Union - OR)</h3>
          <div className="space-y-3">
            <div className="bg-white rounded p-3">
              <p className="text-sm text-gray-600 mb-2">General Case:</p>
              <MathDisplay
                math="P(A \cup B) = P(A) + P(B) - P(A \cap B)"
                display="block"
              />
            </div>
            <div className="bg-green-100 rounded p-3">
              <p className="text-sm text-green-800 mb-2">Special Case (Mutually Exclusive):</p>
              <MathDisplay
                math="P(A \cup B) = P(A) + P(B)"
                display="block"
              />
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-purple-50 border-2 border-purple-300">
          <h3 className="font-semibold text-purple-900 mb-3">Multiplication Rule (Intersection - AND)</h3>
          <div className="space-y-3">
            <div className="bg-white rounded p-3">
              <p className="text-sm text-gray-600 mb-2">General Case:</p>
              <MathDisplay
                math="P(A \cap B) = P(A) \times P(B|A)"
                display="block"
              />
            </div>
            <div className="bg-purple-100 rounded p-3">
              <p className="text-sm text-purple-800 mb-2">Special Case (Independent Events):</p>
              <MathDisplay
                math="P(A \cap B) = P(A) \times P(B)"
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
        currentRule === 'addition'
          ? 'from-green-50 to-emerald-50 border-green-200'
          : 'from-purple-50 to-indigo-50 border-purple-200'
      }`}>
        <div className="space-y-3">
          <h3 className={`text-lg font-bold ${
            currentRule === 'addition' ? 'text-green-900' : 'text-purple-900'
          }`}>
            {currentExample.title}
          </h3>
          <div className={`bg-white border-l-4 p-4 rounded ${
            currentRule === 'addition' ? 'border-green-500' : 'border-purple-500'
          }`}>
            <p className={`font-semibold mb-2 ${
              currentRule === 'addition' ? 'text-green-900' : 'text-purple-900'
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
      <Card>
        <h3 className="text-lg font-semibold mb-4">Given Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 border-2 border-blue-300 rounded p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">Event A: {result.eventA.name}</p>
            <p className="text-xs text-gray-600 mb-3">{result.eventA.description}</p>
            <p className="text-2xl font-bold text-blue-900">
              P(A) = {result.probA.toFixed(4)}
            </p>
          </div>
          <div className="bg-orange-50 border-2 border-orange-300 rounded p-4">
            <p className="text-sm font-semibold text-orange-900 mb-2">Event B: {result.eventB.name}</p>
            <p className="text-xs text-gray-600 mb-3">{result.eventB.description}</p>
            <p className="text-2xl font-bold text-orange-900">
              P(B) = {result.probB.toFixed(4)}
            </p>
          </div>
        </div>

        {currentRule === 'addition' && !result.isMutuallyExclusive && (
          <div className="mt-4 bg-indigo-50 border-2 border-indigo-300 rounded p-4">
            <p className="text-sm font-semibold text-indigo-900 mb-2">Intersection (A AND B)</p>
            <p className="text-xs text-gray-600 mb-3">{result.intersection.description}</p>
            <p className="text-2xl font-bold text-indigo-900">
              P(A ∩ B) = {result.probIntersection.toFixed(4)}
            </p>
          </div>
        )}

        {currentRule === 'multiplication' && !result.isIndependent && result.probBGivenA !== undefined && (
          <div className="mt-4 bg-purple-50 border-2 border-purple-300 rounded p-4">
            <p className="text-sm font-semibold text-purple-900 mb-2">Conditional Probability</p>
            <p className="text-2xl font-bold text-purple-900">
              P(B|A) = {result.probBGivenA.toFixed(4)}
            </p>
          </div>
        )}

        {currentRule === 'addition' && result.isMutuallyExclusive && (
          <div className="mt-4 bg-yellow-50 border-2 border-yellow-300 rounded p-4">
            <p className="text-sm font-semibold text-yellow-900">
              ⚠️ These events are mutually exclusive (cannot both occur)
            </p>
          </div>
        )}

        {currentRule === 'multiplication' && result.isIndependent && (
          <div className="mt-4 bg-green-50 border-2 border-green-300 rounded p-4">
            <p className="text-sm font-semibold text-green-900">
              ✓ These events are independent (occurrence of one doesn't affect the other)
            </p>
          </div>
        )}
      </Card>

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
                {idx + 1}
              </div>
              <p className="text-sm text-gray-700 flex-1">{step}</p>
            </div>
          ))}
        </div>

        <div className={`bg-white border-2 rounded p-4 ${
          currentRule === 'addition' ? 'border-green-200' : 'border-purple-200'
        }`}>
          <MathDisplay math={result.formulaLatex} display="block" />
        </div>

        <div className={`mt-4 bg-gradient-to-r border-2 rounded p-4 ${
          currentRule === 'addition'
            ? 'from-green-50 to-emerald-50 border-green-300'
            : 'from-purple-50 to-indigo-50 border-purple-300'
        }`}>
          <p className="text-sm text-gray-700 mb-2">
            {currentRule === 'addition' ? 'Probability (A OR B):' : 'Probability (A AND B):'}
          </p>
          <p className={`text-3xl font-bold ${
            currentRule === 'addition' ? 'text-green-900' : 'text-purple-900'
          }`}>
            {currentRule === 'addition'
              ? `${result.probUnion.toFixed(4)} or ${(result.probUnion * 100).toFixed(2)}%`
              : `${result.probIntersection.toFixed(4)} or ${(result.probIntersection * 100).toFixed(2)}%`
            }
          </p>
        </div>
      </Card>
    </div>
  );
};

const probabilityRulesModule: VisualizationModule = {
  id: 'probability.rules',
  name: 'Probability Rules',
  description: 'Addition Rule (OR) and Multiplication Rule (AND)',
  syllabusRef: { strand: 'statistics-probability', topic: 'probability-basic' },
  engine: 'html',
  Component: ProbabilityRulesModule,
  getInitialState: () => {
    const result = solveAdditionRule('card-heart-or-king');
    return {
      topicId: 'probability.rules',
      parameters: {},
      inputs: {},
      computed: result as any,
      visualization: { showLabels: true },
    };
  },
  validateState: () => [],
  metadata: {
    version: '1.0.0',
    tags: ['probability', 'addition-rule', 'multiplication-rule', 'union', 'intersection'],
    difficulty: 'intermediate',
  },
};

moduleRegistry.register(probabilityRulesModule);
export default probabilityRulesModule;
