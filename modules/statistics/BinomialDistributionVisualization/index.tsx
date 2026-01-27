/**
 * Binomial Distribution Visualization Module
 */

import { VisualizationModule } from '@/lib/core/types/VisualizationModule';
import { moduleRegistry } from '@/lib/core/registry/ModuleRegistry';
import { FC, useState, useEffect } from 'react';
import { VisualizationModuleProps } from '@/lib/core/types/VisualizationModule';
import {
  solveBinomialProblem,
  BINOMIAL_EXAMPLES,
} from '@/lib/math/statistics';
import { formatFraction, formatFractionLatex } from '@/lib/math/utils/fractions';
import Card from '@/components/ui/Card';
import MathDisplay from '@/components/ui/MathDisplay';
import Button from '@/components/ui/Button';
import { BarChart3, CheckCircle2 } from 'lucide-react';

const BinomialDistributionModule: FC<VisualizationModuleProps> = ({ mathState, onStateChange }) => {
  const [currentExampleId, setCurrentExampleId] = useState('coin-flips');
  const result = mathState.computed as any;

  useEffect(() => {
    const computed = solveBinomialProblem(currentExampleId);
    onStateChange({ computed: computed as any });
  }, [currentExampleId]);

  if (!result) return <div>Loading...</div>;

  const currentExample = BINOMIAL_EXAMPLES.find(ex => ex.id === currentExampleId) || BINOMIAL_EXAMPLES[0];

  // Find the mode (most likely value)
  const maxProbIndex = result.probabilities.indexOf(Math.max(...result.probabilities));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Binomial Distribution</h2>
        <p className="text-gray-600 mt-2">
          Modeling the number of successes in n independent trials
        </p>
      </div>

      {/* Binomial Distribution Formula */}
      <Card className="bg-blue-50 border-2 border-blue-300">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Binomial Distribution Formula
        </h3>
        <div className="bg-white rounded p-3 mb-3">
          <MathDisplay
            math="P(X = k) = {n \choose k} p^k (1-p)^{n-k}"
            display="block"
          />
        </div>
        <div className="space-y-2 text-sm text-blue-900">
          <p><strong>Conditions for Binomial Distribution:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Fixed number of trials (n)</li>
            <li>Each trial has only two outcomes (success/failure)</li>
            <li>Probability of success (p) is constant</li>
            <li>Trials are independent</li>
          </ul>
        </div>
        <div className="mt-3 bg-blue-100 rounded p-3">
          <p className="text-sm font-semibold text-blue-900 mb-1">Key Formulas:</p>
          <div className="space-y-1 text-sm text-blue-900">
            <MathDisplay math="E(X) = np" display="inline" /> (Mean)
            <br />
            <MathDisplay math="Var(X) = np(1-p)" display="inline" /> (Variance)
            <br />
            <MathDisplay math="SD(X) = \sqrt{np(1-p)}" display="inline" /> (Standard Deviation)
          </div>
        </div>
      </Card>

      {/* Example Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Real-Life Examples</h3>
        <div className="flex gap-2 flex-wrap">
          {BINOMIAL_EXAMPLES.map((example) => (
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

      {/* Distribution Parameters */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Distribution Parameters</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 border-2 border-blue-300 rounded p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">Number of Trials (n)</p>
            <p className="text-3xl font-bold text-blue-900">{result.n}</p>
          </div>
          <div className="bg-green-50 border-2 border-green-300 rounded p-4">
            <p className="text-sm font-semibold text-green-900 mb-2">Success Probability (p)</p>
            <p className="text-3xl font-bold text-green-900">
              {result.pFraction ? formatFraction(result.pFraction) : result.p.toFixed(4)}
            </p>
            {result.pFraction && (
              <p className="text-sm text-green-700 mt-1">
                = {result.p.toFixed(4)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-indigo-50 border-2 border-indigo-300 rounded p-4">
            <p className="text-sm font-semibold text-indigo-900 mb-2">Mean (μ)</p>
            <p className="text-2xl font-bold text-indigo-900">{result.mean.toFixed(2)}</p>
            <p className="text-xs text-indigo-700 mt-1">E(X) = np</p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-300 rounded p-4">
            <p className="text-sm font-semibold text-purple-900 mb-2">Variance (σ²)</p>
            <p className="text-2xl font-bold text-purple-900">{result.variance.toFixed(2)}</p>
            <p className="text-xs text-purple-700 mt-1">Var(X) = np(1-p)</p>
          </div>
          <div className="bg-pink-50 border-2 border-pink-300 rounded p-4">
            <p className="text-sm font-semibold text-pink-900 mb-2">Std Dev (σ)</p>
            <p className="text-2xl font-bold text-pink-900">{result.standardDeviation.toFixed(2)}</p>
            <p className="text-xs text-pink-700 mt-1">SD(X) = √Var(X)</p>
          </div>
        </div>
      </Card>

      {/* Probability Distribution Chart */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Probability Distribution</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <BinomialBarChart
            n={result.n}
            probabilities={result.probabilities}
            mean={result.mean}
            highlightIndex={currentExample.targetValue}
          />
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Mode (most likely value): X = {maxProbIndex} with P(X = {maxProbIndex}) = {result.probabilities[maxProbIndex].toFixed(4)}
        </p>
      </Card>

      {/* Solution */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          Step-by-Step Solution
        </h3>

        <div className="space-y-2 mb-4">
          {result.steps.map((step: string, idx: number) => (
            <p key={idx} className="text-sm text-gray-700">
              {step}
            </p>
          ))}
        </div>

        <div className="bg-white border-2 border-blue-200 rounded p-4 mb-4">
          <MathDisplay math={result.formulaLatex} display="block" />
        </div>

        {result.targetProbability !== undefined && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded p-4">
            <p className="text-sm text-gray-700 mb-2">Answer:</p>
            <p className="text-3xl font-bold text-blue-900 mb-2">
              {result.targetProbability.toFixed(6)}
            </p>
            <p className="text-xl font-semibold text-indigo-900">
              = {(result.targetProbability * 100).toFixed(2)}%
            </p>
          </div>
        )}
      </Card>

      {/* Probability Table */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Probability Distribution Table</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left font-semibold">k</th>
                <th className="px-4 py-2 text-left font-semibold">P(X = k)</th>
                <th className="px-4 py-2 text-left font-semibold">P(X ≤ k)</th>
              </tr>
            </thead>
            <tbody>
              {result.probabilities.map((prob: number, k: number) => (
                <tr
                  key={k}
                  className={`border-t ${k === currentExample.targetValue ? 'bg-blue-100 font-bold' : ''}`}
                >
                  <td className="px-4 py-2">{k}</td>
                  <td className="px-4 py-2">{prob.toFixed(6)}</td>
                  <td className="px-4 py-2">{result.cumulativeProbabilities[k].toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

/**
 * Binomial Distribution Bar Chart Component
 */
interface BinomialBarChartProps {
  n: number;
  probabilities: number[];
  mean: number;
  highlightIndex?: number;
}

const BinomialBarChart: FC<BinomialBarChartProps> = ({ n, probabilities, mean, highlightIndex }) => {
  const maxProb = Math.max(...probabilities);
  const chartHeight = 300;
  const chartWidth = Math.min(800, n * 40 + 100);
  const barWidth = Math.max(20, (chartWidth - 100) / (n + 1));

  return (
    <svg width={chartWidth} height={chartHeight + 50} className="mx-auto">
      {/* Y-axis */}
      <line x1="50" y1="20" x2="50" y2={chartHeight + 20} stroke="#374151" strokeWidth="2" />

      {/* X-axis */}
      <line x1="50" y1={chartHeight + 20} x2={chartWidth - 20} y2={chartHeight + 20} stroke="#374151" strokeWidth="2" />

      {/* Y-axis label */}
      <text x="20" y="15" fontSize="12" fill="#374151" fontWeight="bold">P(X=k)</text>

      {/* X-axis label */}
      <text x={chartWidth / 2} y={chartHeight + 45} fontSize="12" fill="#374151" fontWeight="bold" textAnchor="middle">k</text>

      {/* Bars */}
      {probabilities.map((prob, k) => {
        const barHeight = (prob / maxProb) * (chartHeight - 40);
        const x = 60 + k * barWidth;
        const y = chartHeight + 20 - barHeight;
        const isHighlighted = k === highlightIndex;

        return (
          <g key={k}>
            {/* Bar */}
            <rect
              x={x}
              y={y}
              width={barWidth - 5}
              height={barHeight}
              fill={isHighlighted ? '#3B82F6' : '#93C5FD'}
              stroke={isHighlighted ? '#1E40AF' : '#60A5FA'}
              strokeWidth={isHighlighted ? 2 : 1}
            />

            {/* X-axis tick label */}
            <text
              x={x + (barWidth - 5) / 2}
              y={chartHeight + 35}
              fontSize="10"
              fill="#374151"
              textAnchor="middle"
            >
              {k}
            </text>

            {/* Probability value on top of bar (for highlighted or high probability) */}
            {(isHighlighted || prob > maxProb * 0.15) && (
              <text
                x={x + (barWidth - 5) / 2}
                y={y - 5}
                fontSize="10"
                fill="#1E40AF"
                fontWeight="bold"
                textAnchor="middle"
              >
                {prob.toFixed(3)}
              </text>
            )}
          </g>
        );
      })}

      {/* Mean line */}
      <line
        x1={60 + mean * barWidth}
        y1="20"
        x2={60 + mean * barWidth}
        y2={chartHeight + 20}
        stroke="#DC2626"
        strokeWidth="2"
        strokeDasharray="4"
      />
      <text
        x={60 + mean * barWidth + 5}
        y="35"
        fontSize="11"
        fill="#DC2626"
        fontWeight="bold"
      >
        μ = {mean.toFixed(2)}
      </text>
    </svg>
  );
};

const binomialDistributionModule: VisualizationModule = {
  id: 'statistics.binomial-distribution',
  name: 'Binomial Distribution',
  description: 'Discrete probability distribution for the number of successes in n independent trials',
  syllabusRef: { strand: 'statistics-distributions', topic: 'discrete-distributions' },
  engine: 'html',
  Component: BinomialDistributionModule,
  getInitialState: () => {
    const result = solveBinomialProblem('coin-flips');
    return {
      topicId: 'statistics.binomial-distribution',
      parameters: {},
      inputs: {},
      computed: result as any,
      visualization: { showLabels: true },
    };
  },
  validateState: () => [],
  metadata: {
    version: '1.0.0',
    tags: ['statistics', 'binomial', 'discrete', 'distribution', 'probability'],
    difficulty: 'intermediate',
  },
};

moduleRegistry.register(binomialDistributionModule);
export default binomialDistributionModule;
