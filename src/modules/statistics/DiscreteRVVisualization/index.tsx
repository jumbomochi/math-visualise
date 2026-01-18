/**
 * General Discrete Random Variables Visualization Module
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import { FC, useState, useEffect } from 'react';
import { VisualizationModuleProps } from '@/core/types/VisualizationModule';
import {
  solveDiscreteRVProblem,
  DISCRETE_RV_EXAMPLES,
  ProbabilityDistribution,
} from '@/math/statistics';
import { formatFraction } from '@/math/utils/fractions';
import Card from '@/components/ui/Card';
import MathDisplay from '@/components/ui/MathDisplay';
import Button from '@/components/ui/Button';
import { BarChart3, CheckCircle2, TrendingUp } from 'lucide-react';

const DiscreteRVModule: FC<VisualizationModuleProps> = ({ mathState, onStateChange }) => {
  const [currentExampleId, setCurrentExampleId] = useState('dice-game');
  const result = mathState.computed as any;

  useEffect(() => {
    const computed = solveDiscreteRVProblem(currentExampleId);
    onStateChange({ computed: computed as any });
  }, [currentExampleId]);

  if (!result) return <div>Loading...</div>;

  const currentExample = DISCRETE_RV_EXAMPLES.find(ex => ex.id === currentExampleId) || DISCRETE_RV_EXAMPLES[0];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Discrete Random Variables</h2>
        <p className="text-gray-600 mt-2">
          Probability distributions, expectation, and variance
        </p>
      </div>

      {/* Key Formulas */}
      <Card className="bg-blue-50 border-2 border-blue-300">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Key Formulas
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded p-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">Expected Value:</p>
              <MathDisplay math="E(X) = \Sigma x \cdot P(X=x)" display="block" />
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">Variance:</p>
              <MathDisplay math="\text{Var}(X) = E(X^2) - [E(X)]^2" display="block" />
            </div>
          </div>
          <div className="bg-blue-100 rounded p-3">
            <p className="text-sm font-semibold text-blue-900 mb-2">Properties of Transformations:</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white rounded p-2">
                <MathDisplay math="E(aX + b) = aE(X) + b" />
              </div>
              <div className="bg-white rounded p-2">
                <MathDisplay math="\text{Var}(aX + b) = a^2\text{Var}(X)" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Example Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Real-Life Examples</h3>
        <div className="flex gap-2 flex-wrap">
          {DISCRETE_RV_EXAMPLES.map((example) => (
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
          <h3 className="text-lg font-bold text-blue-900">
            {currentExample.title}
          </h3>
          <div className="bg-white border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold mb-2 text-blue-900">
              Question:
            </p>
            <div className="text-gray-800 space-y-2">
              <p>{currentExample.context}</p>
              <p className="font-medium">{currentExample.question}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Probability Distribution Table */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Probability Distribution</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-3 font-semibold text-blue-900">x</th>
                {result.distribution.values.map((val: number, idx: number) => (
                  <th key={idx} className="px-4 py-3 font-semibold text-blue-900">{val}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t-2 border-blue-200">
                <td className="px-4 py-3 font-semibold text-gray-700">P(X = x)</td>
                {result.distribution.probabilities.map((prob: number, idx: number) => (
                  <td key={idx} className="px-4 py-3">
                    {result.distribution.probabilityFractions && result.distribution.probabilityFractions[idx] ? (
                      <div>
                        <div className="font-bold text-blue-900">
                          {formatFraction(result.distribution.probabilityFractions[idx])}
                        </div>
                        <div className="text-xs text-gray-600">
                          = {prob.toFixed(4)}
                        </div>
                      </div>
                    ) : (
                      <div className="font-bold text-blue-900">{prob.toFixed(4)}</div>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-xs text-gray-500 text-center">
          Note: Σ P(X=x) = {result.distribution.probabilities.reduce((sum: number, p: number) => sum + p, 0).toFixed(4)} = 1
        </div>
      </Card>

      {/* Bar Chart Visualization */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Probability Distribution Bar Chart
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <DiscreteRVBarChart
            distribution={result.distribution}
            expectation={result.expectation}
            mode={result.mode}
          />
        </div>
      </Card>

      {/* Statistics */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Distribution Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 border-2 border-green-300 rounded p-4">
            <p className="text-sm font-semibold text-green-900 mb-2">Expected Value E(X)</p>
            <p className="text-4xl font-bold text-green-900">{result.expectation.toFixed(4)}</p>
            <p className="text-xs text-green-700 mt-2">Long-run average</p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-300 rounded p-4">
            <p className="text-sm font-semibold text-purple-900 mb-2">Variance Var(X)</p>
            <p className="text-4xl font-bold text-purple-900">{result.variance.toFixed(4)}</p>
            <p className="text-xs text-purple-700 mt-2">Measure of spread</p>
          </div>
          <div className="bg-indigo-50 border-2 border-indigo-300 rounded p-4">
            <p className="text-sm font-semibold text-indigo-900 mb-2">Std Deviation SD(X)</p>
            <p className="text-4xl font-bold text-indigo-900">{result.standardDeviation.toFixed(4)}</p>
            <p className="text-xs text-indigo-700 mt-2">√Var(X)</p>
          </div>
        </div>
      </Card>

      {/* Mode and Median if calculated */}
      {(result.mode || result.median !== undefined) && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Measures of Central Tendency</h3>
          <div className="grid grid-cols-2 gap-4">
            {result.mode && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded p-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">Mode</p>
                <p className="text-3xl font-bold text-blue-900">{result.mode.join(', ')}</p>
                <p className="text-xs text-blue-700 mt-2">Most likely value(s)</p>
              </div>
            )}
            {result.median !== undefined && (
              <div className="bg-teal-50 border-2 border-teal-300 rounded p-4">
                <p className="text-sm font-semibold text-teal-900 mb-2">Median</p>
                <p className="text-3xl font-bold text-teal-900">{result.median}</p>
                <p className="text-xs text-teal-700 mt-2">Middle value</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Transformation Results */}
      {result.transformedExpectation !== undefined && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Transformation Results</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-orange-50 border-2 border-orange-300 rounded p-4">
              <p className="text-sm font-semibold text-orange-900 mb-2">E(Y)</p>
              <p className="text-3xl font-bold text-orange-900">{result.transformedExpectation.toFixed(4)}</p>
            </div>
            <div className="bg-pink-50 border-2 border-pink-300 rounded p-4">
              <p className="text-sm font-semibold text-pink-900 mb-2">Var(Y)</p>
              <p className="text-3xl font-bold text-pink-900">{result.transformedVariance!.toFixed(4)}</p>
            </div>
            <div className="bg-red-50 border-2 border-red-300 rounded p-4">
              <p className="text-sm font-semibold text-red-900 mb-2">SD(Y)</p>
              <p className="text-3xl font-bold text-red-900">{result.transformedSD!.toFixed(4)}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Cumulative Distribution */}
      {result.cumulativeProbs && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Cumulative Distribution Function F(x) = P(X ≤ x)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-4 py-3 font-semibold text-purple-900">x</th>
                  {result.distribution.values.map((val: number, idx: number) => (
                    <th key={idx} className="px-4 py-3 font-semibold text-purple-900">{val}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t-2 border-purple-200">
                  <td className="px-4 py-3 font-semibold text-gray-700">F(x)</td>
                  {result.cumulativeProbs.map((cumProb: number, idx: number) => (
                    <td key={idx} className="px-4 py-3 font-bold text-purple-900">
                      {cumProb.toFixed(4)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Probability Query Result */}
      {result.probability !== undefined && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
          <h3 className="text-lg font-semibold text-green-900 mb-3">Probability Result</h3>
          <div className="bg-white rounded p-6 text-center">
            <p className="text-5xl font-bold text-green-900 mb-2">
              {result.probability.toFixed(6)}
            </p>
            <p className="text-2xl font-semibold text-emerald-900">
              = {(result.probability * 100).toFixed(2)}%
            </p>
          </div>
        </Card>
      )}

      {/* Solution */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          Step-by-Step Solution
        </h3>

        <div className="space-y-2 mb-4">
          {result.steps.map((step: string, idx: number) => (
            <p key={idx} className="text-sm text-gray-700 font-mono">
              {step}
            </p>
          ))}
        </div>

        <div className="bg-white border-2 border-blue-200 rounded p-4">
          <MathDisplay math={result.formulaLatex} display="block" />
        </div>
      </Card>

      {/* Explanation */}
      <Card className="bg-blue-50 border-2 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Key Insight</h3>
        <p className="text-sm text-blue-800">{result.explanation}</p>
      </Card>
    </div>
  );
};

/**
 * Bar Chart for Discrete RV
 */
interface DiscreteRVBarChartProps {
  distribution: ProbabilityDistribution;
  expectation: number;
  mode?: number[];
}

const DiscreteRVBarChart: FC<DiscreteRVBarChartProps> = ({ distribution, expectation, mode }) => {
  const width = 900;
  const height = 400;
  const padding = 80;

  const { values, probabilities } = distribution;
  const maxProb = Math.max(...probabilities);

  const barWidth = (width - 2 * padding) / (values.length * 1.5);
  const scaleY = (prob: number) => {
    return (height - 2 * padding) * (prob / maxProb);
  };

  return (
    <svg width={width} height={height} className="mx-auto">
      {/* Axes */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#374151" strokeWidth="2" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#374151" strokeWidth="2" />

      {/* Y-axis labels */}
      {[0, 0.25, 0.5, 0.75, 1].map(frac => {
        const y = height - padding - (frac * (height - 2 * padding));
        const probValue = frac * maxProb;
        return (
          <g key={frac}>
            <line x1={padding - 5} y1={y} x2={padding + 5} y2={y} stroke="#374151" strokeWidth="2" />
            <text x={padding - 10} y={y + 5} fontSize="12" fill="#374151" textAnchor="end">
              {probValue.toFixed(2)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {values.map((val, idx) => {
        const x = padding + (idx + 0.5) * ((width - 2 * padding) / values.length);
        const barHeight = scaleY(probabilities[idx]);
        const isMode = mode?.includes(val);

        return (
          <g key={idx}>
            {/* Bar */}
            <rect
              x={x - barWidth / 2}
              y={height - padding - barHeight}
              width={barWidth}
              height={barHeight}
              fill={isMode ? '#10B981' : '#3B82F6'}
              stroke={isMode ? '#047857' : '#1E40AF'}
              strokeWidth="2"
              opacity="0.8"
            />
            {/* Value label */}
            <text
              x={x}
              y={height - padding + 25}
              fontSize="14"
              fill="#374151"
              textAnchor="middle"
              fontWeight="bold"
            >
              {val}
            </text>
            {/* Probability label */}
            <text
              x={x}
              y={height - padding - barHeight - 10}
              fontSize="11"
              fill="#1E40AF"
              textAnchor="middle"
              fontWeight="600"
            >
              {probabilities[idx].toFixed(3)}
            </text>
            {/* Mode indicator */}
            {isMode && (
              <text
                x={x}
                y={height - padding - barHeight - 25}
                fontSize="10"
                fill="#047857"
                textAnchor="middle"
                fontWeight="bold"
              >
                MODE
              </text>
            )}
          </g>
        );
      })}

      {/* Expected value line */}
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#DC2626"
        strokeWidth="0"
      />
      {/* Expected value marker on x-axis */}
      {expectation >= Math.min(...values) && expectation <= Math.max(...values) && (
        <>
          <line
            x1={padding + ((expectation - values[0]) / (values[values.length - 1] - values[0])) * (width - 2 * padding)}
            y1={padding}
            x2={padding + ((expectation - values[0]) / (values[values.length - 1] - values[0])) * (width - 2 * padding)}
            y2={height - padding}
            stroke="#DC2626"
            strokeWidth="3"
            strokeDasharray="6,4"
          />
          <text
            x={padding + ((expectation - values[0]) / (values[values.length - 1] - values[0])) * (width - 2 * padding)}
            y={padding - 10}
            fontSize="13"
            fill="#DC2626"
            textAnchor="middle"
            fontWeight="bold"
          >
            E(X) = {expectation.toFixed(2)}
          </text>
        </>
      )}

      {/* Axis labels */}
      <text x={width / 2} y={height - 20} fontSize="14" fill="#374151" fontWeight="bold" textAnchor="middle">
        x (Values of X)
      </text>
      <text x={30} y={height / 2} fontSize="14" fill="#374151" fontWeight="bold" textAnchor="middle" transform={`rotate(-90, 30, ${height / 2})`}>
        P(X = x)
      </text>

      {/* Legend */}
      <g transform={`translate(${width - 200}, 40)`}>
        <rect x="0" y="0" width="25" height="15" fill="#3B82F6" opacity="0.8" stroke="#1E40AF" strokeWidth="2" />
        <text x="30" y="12" fontSize="11" fill="#374151">Probability</text>

        {mode && mode.length > 0 && (
          <>
            <rect x="0" y="20" width="25" height="15" fill="#10B981" opacity="0.8" stroke="#047857" strokeWidth="2" />
            <text x="30" y="32" fontSize="11" fill="#374151">Mode</text>
          </>
        )}

        <line x1="0" y1="45" x2="25" y2="45" stroke="#DC2626" strokeWidth="3" strokeDasharray="6,4" />
        <text x="30" y="50" fontSize="11" fill="#374151">E(X)</text>
      </g>
    </svg>
  );
};

const discreteRVModule: VisualizationModule = {
  id: 'statistics.discrete-rv',
  name: 'Discrete Random Variables',
  description: 'Probability distributions, expectation, variance, and transformations',
  syllabusRef: { strand: 'statistics-distributions', topic: 'discrete-distributions' },
  engine: 'html',
  Component: DiscreteRVModule,
  getInitialState: () => {
    const result = solveDiscreteRVProblem('dice-game');
    return {
      topicId: 'statistics.discrete-rv',
      parameters: {},
      inputs: {},
      computed: result as any,
      visualization: { showLabels: true },
    };
  },
  validateState: () => [],
  metadata: {
    version: '1.0.0',
    tags: ['statistics', 'discrete', 'random-variables', 'expectation', 'variance'],
    difficulty: 'intermediate',
  },
};

moduleRegistry.register(discreteRVModule);
export default discreteRVModule;
