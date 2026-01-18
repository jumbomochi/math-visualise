/**
 * Advanced Combinatorics Cases Visualization Module
 *
 * Real-world problems combining multiple counting principles
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import { FC, useState, useEffect } from 'react';
import { VisualizationModuleProps } from '@/core/types/VisualizationModule';
import { solveAdvancedCase, ADVANCED_CASE_EXAMPLES } from '@/math/combinatorics';
import type { SolutionStep } from '@/math/combinatorics/advancedCases';
import Card from '@/components/ui/Card';
import MathDisplay from '@/components/ui/MathDisplay';
import Button from '@/components/ui/Button';
import { BookOpen, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';

const AdvancedCasesModule: FC<VisualizationModuleProps> = ({ mathState, onStateChange }) => {
  const [currentCaseId, setCurrentCaseId] = useState('license-plate');
  const [showHints, setShowHints] = useState(false);
  const result = mathState.computed as any;

  useEffect(() => {
    const computed = solveAdvancedCase(currentCaseId);
    onStateChange({ computed: computed as any });
  }, [currentCaseId]);

  if (!result) return <div>Loading...</div>;

  const currentCase = ADVANCED_CASE_EXAMPLES.find(ex => ex.id === currentCaseId) || ADVANCED_CASE_EXAMPLES[0];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'advanced': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'challenging': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPrincipleColor = (index: number) => {
    const colors = [
      'bg-blue-50 border-blue-300 text-blue-900',
      'bg-green-50 border-green-300 text-green-900',
      'bg-purple-50 border-purple-300 text-purple-900',
      'bg-orange-50 border-orange-300 text-orange-900',
      'bg-pink-50 border-pink-300 text-pink-900',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Advanced Combinatorics Cases</h2>
        <p className="text-gray-600 mt-2">Complex real-world problems combining multiple counting principles</p>
      </div>

      {/* Case Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Select a Case</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ADVANCED_CASE_EXAMPLES.map((caseEx) => (
            <button
              key={caseEx.id}
              onClick={() => {
                setCurrentCaseId(caseEx.id);
                setShowHints(false);
              }}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                currentCaseId === caseEx.id
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm">{caseEx.title}</h4>
                <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(caseEx.difficulty)}`}>
                  {caseEx.difficulty}
                </span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{caseEx.context}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Problem Statement */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-indigo-900">{currentCase.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(currentCase.difficulty)}`}>
                  {currentCase.difficulty}
                </span>
                <span className="text-xs text-gray-600">
                  {currentCase.principlesUsed.length} principle{currentCase.principlesUsed.length > 1 ? 's' : ''} used
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 space-y-3">
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
              <p className="text-sm font-semibold text-indigo-900 mb-3">Question:</p>
              <div className="text-gray-800 space-y-2">
                <p className="mb-3">{currentCase.context}</p>
                <div className="space-y-2">
                  {currentCase.question.split('Part (').map((part, idx) => {
                    if (idx === 0) return null; // Skip the text before first "Part ("
                    return (
                      <p key={idx} className="ml-2">
                        <span className="font-semibold">Part ({part}</span>
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Principles Used */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Principles Required:</p>
            <div className="flex flex-wrap gap-2">
              {currentCase.principlesUsed.map((principle, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-3 py-1 rounded-full border ${getPrincipleColor(idx)}`}
                >
                  {principle}
                </span>
              ))}
            </div>
          </div>

          {/* Hints Toggle */}
          {currentCase.hints && currentCase.hints.length > 0 && (
            <div>
              <Button
                onClick={() => setShowHints(!showHints)}
                variant={showHints ? 'primary' : 'secondary'}
                className="flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                {showHints ? 'Hide Hints' : 'Show Hints'}
              </Button>

              {showHints && (
                <div className="mt-3 bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                  <p className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Hints to solve this problem:
                  </p>
                  <ul className="space-y-2">
                    {currentCase.hints.map((hint, idx) => (
                      <li key={idx} className="text-sm text-yellow-900 flex items-start gap-2">
                        <span className="font-bold">{idx + 1}.</span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Solution Steps - Grouped by Parts */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          Step-by-Step Solution
        </h3>

        <div className="space-y-6">
          {result.partResults.map((partResult: any, partIdx: number) => {
            const partSteps = result.steps.filter((step: SolutionStep) => step.part === partResult.part);

            return (
              <div key={partIdx} className="border-2 border-indigo-200 rounded-lg p-4 bg-indigo-50">
                <h4 className="text-lg font-bold text-indigo-900 mb-4">
                  Part ({partResult.part})
                </h4>

                <div className="space-y-3 mb-4">
                  {partSteps.map((step: SolutionStep, idx: number) => (
                    <div
                      key={idx}
                      className={`border-l-4 p-4 rounded-r-lg bg-white ${getPrincipleColor(idx)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-current flex items-center justify-center font-bold">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold">{step.description}</h5>
                            <span className="text-xs px-2 py-0.5 bg-white rounded border border-current">
                              {step.principle}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{step.reasoning}</p>
                          <div className="bg-gray-50 rounded p-2 font-mono text-sm">
                            <span className="text-gray-600">Calculation:</span> {step.calculation} = <strong>{step.result.toLocaleString()}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Answer for this part */}
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-lg p-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-green-900">Answer for Part ({partResult.part}):</p>
                    <div className="bg-white rounded p-3">
                      <MathDisplay math={partResult.formulaLatex} display="block" />
                    </div>
                    <p className="text-3xl font-bold text-green-900 text-center">
                      {partResult.answer.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Principles Applied */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Principles Applied</h3>
        <div className="flex flex-wrap gap-2">
          {result.principlesUsed.map((principle: string, idx: number) => (
            <span
              key={idx}
              className="text-sm px-3 py-1 bg-white border border-blue-300 text-blue-800 rounded-full"
            >
              ✓ {principle}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
};

const advancedCasesModule: VisualizationModule = {
  id: 'combinatorics.advanced-cases',
  name: 'Advanced Cases',
  description: 'Complex real-world problems combining multiple counting principles',
  syllabusRef: { strand: 'statistics-probability', topic: 'counting-principles' },
  engine: 'html',
  Component: AdvancedCasesModule,
  getInitialState: () => {
    const result = solveAdvancedCase('license-plate');
    return {
      topicId: 'combinatorics.advanced-cases',
      parameters: {},
      inputs: {},
      computed: result as any,
      visualization: { showLabels: true },
    };
  },
  validateState: () => [],
  metadata: {
    version: '1.0.0',
    tags: ['combinatorics', 'advanced', 'multi-principle', 'real-world'],
    difficulty: 'advanced',
  },
};

moduleRegistry.register(advancedCasesModule);
export default advancedCasesModule;
