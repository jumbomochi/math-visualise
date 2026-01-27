/**
 * Sampling and Central Limit Theorem Visualization Module
 */

import { VisualizationModule } from '@/lib/core/types/VisualizationModule';
import { moduleRegistry } from '@/lib/core/registry/ModuleRegistry';
import { FC, useState, useEffect } from 'react';
import { VisualizationModuleProps } from '@/lib/core/types/VisualizationModule';
import {
  solveSamplingProblem,
  SAMPLING_EXAMPLES,
} from '@/lib/math/statistics';
import Card from '@/components/ui/Card';
import MathDisplay from '@/components/ui/MathDisplay';
import Button from '@/components/ui/Button';
import { BarChart3, CheckCircle2, TrendingUp } from 'lucide-react';

const SamplingModule: FC<VisualizationModuleProps> = ({ mathState, onStateChange }) => {
  const [currentExampleId, setCurrentExampleId] = useState('bottles');
  const result = mathState.computed as any;

  useEffect(() => {
    const computed = solveSamplingProblem(currentExampleId);
    onStateChange({ computed: computed as any });
  }, [currentExampleId]);

  if (!result) return <div>Loading...</div>;

  const currentExample = SAMPLING_EXAMPLES.find(ex => ex.id === currentExampleId) || SAMPLING_EXAMPLES[0];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Sampling & Central Limit Theorem</h2>
        <p className="text-gray-600 mt-2">
          Distribution of sample means and unbiased estimates
        </p>
      </div>

      {/* Central Limit Theorem Formula */}
      <Card className="bg-blue-50 border-2 border-blue-300">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Central Limit Theorem
        </h3>
        <div className="bg-white rounded p-3 mb-3">
          <MathDisplay
            math="\bar{X} \sim N\left(\mu, \frac{\sigma^2}{n}\right)"
            display="block"
          />
        </div>
        <div className="space-y-3">
          <div className="bg-blue-100 rounded p-3">
            <p className="text-sm font-semibold text-blue-900 mb-2">Sample Mean Distribution:</p>
            <div className="space-y-1 text-xs text-blue-800">
              <MathDisplay math="E(\bar{X}) = \mu" display="block" />
              <MathDisplay math="Var(\bar{X}) = \frac{\sigma^2}{n}" display="block" />
              <MathDisplay math="SD(\bar{X}) = \frac{\sigma}{\sqrt{n}}" display="block" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded p-3">
              <p className="text-sm font-semibold text-gray-700 mb-1">Conditions:</p>
              <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                <li>Large sample (n ≥ 30)</li>
                <li>Random sampling</li>
                <li>Independent observations</li>
              </ul>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-sm font-semibold text-gray-700 mb-1">Unbiased Estimates:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <MathDisplay math="\bar{x} = \frac{\Sigma x}{n}" />
                <MathDisplay math="s^2 = \frac{\Sigma(x - \bar{x})^2}{n-1}" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Example Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Real-Life Examples</h3>
        <div className="flex gap-2 flex-wrap">
          {SAMPLING_EXAMPLES.map((example) => (
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
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
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
      {currentExample.type !== 'unbiased-estimate' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Sample Mean Distribution Parameters</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 border-2 border-blue-300 rounded p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">E(X̄)</p>
              <p className="text-3xl font-bold text-blue-900">{result.sampleMeanExpectation}</p>
            </div>
            <div className="bg-purple-50 border-2 border-purple-300 rounded p-4">
              <p className="text-sm font-semibold text-purple-900 mb-2">SD(X̄)</p>
              <p className="text-3xl font-bold text-purple-900">{result.sampleMeanSD.toFixed(4)}</p>
            </div>
            <div className="bg-indigo-50 border-2 border-indigo-300 rounded p-4">
              <p className="text-sm font-semibold text-indigo-900 mb-2">Var(X̄)</p>
              <p className="text-3xl font-bold text-indigo-900">{result.sampleMeanVariance.toFixed(4)}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 border-2 border-gray-300 rounded p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Population μ</p>
              <p className="text-2xl font-bold text-gray-900">{result.populationMean}</p>
            </div>
            <div className="bg-gray-50 border-2 border-gray-300 rounded p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Population σ</p>
              <p className="text-2xl font-bold text-gray-900">{result.populationSD}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Sampling Distribution Visualization */}
      {currentExample.type !== 'unbiased-estimate' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Sampling Distribution Comparison
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <SamplingDistributionChart
              populationMean={result.populationMean}
              populationSD={result.populationSD}
              sampleSize={result.sampleSize}
              sampleMeanSD={result.sampleMeanSD}
              targetValue={currentExample.targetValue}
            />
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
            <p key={idx} className="text-sm text-gray-700">
              {step}
            </p>
          ))}
        </div>

        <div className="bg-white border-2 border-blue-200 rounded p-4 mb-4">
          <MathDisplay math={result.formulaLatex} display="block" />
        </div>

        {result.zScore !== undefined && (
          <div className="bg-blue-50 border-2 border-blue-300 rounded p-4 mb-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">Z-Score:</p>
            <p className="text-2xl font-bold text-blue-900">
              Z = {result.zScore.toFixed(4)}
            </p>
          </div>
        )}

        {result.probability !== undefined && (
          <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">Probability:</p>
            <p className="text-3xl font-bold text-green-900 mb-2">
              {result.probability.toFixed(6)}
            </p>
            <p className="text-xl font-semibold text-teal-900">
              = {(result.probability * 100).toFixed(2)}%
            </p>
          </div>
        )}

        {result.value !== undefined && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">Sample Mean Value:</p>
            <p className="text-3xl font-bold text-purple-900">
              x̄ = {result.value.toFixed(2)}
            </p>
          </div>
        )}

        {result.unbiasedMean !== undefined && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded p-4">
              <p className="text-sm text-gray-700 mb-2">Unbiased Mean Estimate:</p>
              <p className="text-3xl font-bold text-green-900 mb-1">
                x̄ = {result.unbiasedMean.toFixed(4)}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Unbiased estimate of μ
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded p-4">
              <p className="text-sm text-gray-700 mb-2">Unbiased Variance Estimate:</p>
              <p className="text-3xl font-bold text-blue-900 mb-1">
                s² = {result.unbiasedVariance!.toFixed(4)}
              </p>
              <p className="text-xl font-semibold text-cyan-900">
                s = {Math.sqrt(result.unbiasedVariance!).toFixed(4)}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Divide by (n-1) for unbiased estimate
              </p>
            </div>
          </div>
        )}
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
 * Sampling Distribution Comparison Chart
 */
interface SamplingDistributionChartProps {
  populationMean: number;
  populationSD: number;
  sampleSize: number;
  sampleMeanSD: number;
  targetValue?: number;
}

const SamplingDistributionChart: FC<SamplingDistributionChartProps> = ({
  populationMean,
  populationSD,
  sampleSize,
  sampleMeanSD,
  targetValue,
}) => {
  const width = 1100;
  const height = 400;
  const padding = 90;

  // X-axis range
  const xMin = populationMean - 4 * populationSD;
  const xMax = populationMean + 4 * populationSD;

  // Scale functions
  const scaleX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
  const scaleY = (y: number) => height - padding - y * (height - 2 * padding) * 2.5;

  // Normal PDF
  const normalPDF = (x: number, mean: number, sd: number) => {
    const exponent = -0.5 * Math.pow((x - mean) / sd, 2);
    return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
  };

  // Generate points for population distribution
  const populationPoints: { x: number; y: number }[] = [];
  const sampleMeanPoints: { x: number; y: number }[] = [];
  const numPoints = 200;
  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + (i / numPoints) * (xMax - xMin);
    populationPoints.push({ x, y: normalPDF(x, populationMean, populationSD) });
    sampleMeanPoints.push({ x, y: normalPDF(x, populationMean, sampleMeanSD) });
  }

  // Create paths
  const populationPath = populationPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`)
    .join(' ');

  const sampleMeanPath = sampleMeanPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`)
    .join(' ');

  return (
    <svg width={width} height={height} className="mx-auto">
      {/* Axes */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#374151" strokeWidth="2" />
      <line x1={scaleX(populationMean)} y1={padding / 2} x2={scaleX(populationMean)} y2={height - padding} stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4" />

      {/* Population distribution (wider, lighter) */}
      <path d={populationPath} stroke="#9CA3AF" strokeWidth="3" fill="none" strokeDasharray="6" />
      <text x={scaleX(populationMean + 2 * populationSD)} y={scaleY(normalPDF(populationMean + 2 * populationSD, populationMean, populationSD)) - 15} fontSize="13" fill="#6B7280" fontWeight="bold">
        Population
      </text>

      {/* Sample mean distribution (narrower, darker) */}
      <path d={sampleMeanPath} stroke="#3B82F6" strokeWidth="4" fill="none" />
      <text x={scaleX(populationMean + 1 * sampleMeanSD)} y={scaleY(normalPDF(populationMean + 1 * sampleMeanSD, populationMean, sampleMeanSD)) - 15} fontSize="13" fill="#1E40AF" fontWeight="bold">
        Sample Mean (n={sampleSize})
      </text>

      {/* Standard deviation markers for sample mean */}
      {[-2, -1, 0, 1, 2].map(k => {
        const x = populationMean + k * sampleMeanSD;
        return (
          <g key={k}>
            <line
              x1={scaleX(x)}
              y1={height - padding - 5}
              x2={scaleX(x)}
              y2={height - padding + 5}
              stroke="#3B82F6"
              strokeWidth="2"
            />
            <text
              x={scaleX(x)}
              y={height - padding + 25}
              fontSize="13"
              fill="#1E40AF"
              textAnchor="middle"
            >
              {k === 0 ? `μ=${populationMean}` : k > 0 ? `+${k}σ/√n` : `${k}σ/√n`}
            </text>
          </g>
        );
      })}

      {/* Target value line */}
      {targetValue !== undefined && (
        <>
          <line
            x1={scaleX(targetValue)}
            y1={padding / 2}
            x2={scaleX(targetValue)}
            y2={height - padding}
            stroke="#DC2626"
            strokeWidth="3"
            strokeDasharray="6,4"
          />
          <text
            x={scaleX(targetValue)}
            y={padding / 2 - 10}
            fontSize="14"
            fill="#DC2626"
            fontWeight="bold"
            textAnchor="middle"
          >
            x̄ = {targetValue}
          </text>
        </>
      )}

      {/* Labels */}
      <text x={width / 2} y={height - 15} fontSize="14" fill="#374151" fontWeight="bold" textAnchor="middle">
        X / X̄
      </text>
      <text x={25} y={35} fontSize="14" fill="#374151" fontWeight="bold">
        f(x)
      </text>

      {/* Legend */}
      <g transform={`translate(${width - 250}, 50)`}>
        <line x1="0" y1="0" x2="40" y2="0" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="4" />
        <text x="45" y="5" fontSize="12" fill="#6B7280" fontWeight="600">Population: σ = {populationSD}</text>

        <line x1="0" y1="20" x2="40" y2="20" stroke="#3B82F6" strokeWidth="3" />
        <text x="45" y="25" fontSize="12" fill="#1E40AF" fontWeight="600">Sample Mean: σ/√n = {sampleMeanSD.toFixed(2)}</text>
      </g>
    </svg>
  );
};

const samplingModule: VisualizationModule = {
  id: 'statistics.sampling',
  name: 'Sampling & Central Limit Theorem',
  description: 'Distribution of sample means and unbiased estimates',
  syllabusRef: { strand: 'statistics-distributions', topic: 'sampling-clt' },
  engine: 'html',
  Component: SamplingModule,
  getInitialState: () => {
    const result = solveSamplingProblem('bottles');
    return {
      topicId: 'statistics.sampling',
      parameters: {},
      inputs: {},
      computed: result as any,
      visualization: { showLabels: true },
    };
  },
  validateState: () => [],
  metadata: {
    version: '1.0.0',
    tags: ['statistics', 'sampling', 'central-limit-theorem', 'clt', 'unbiased'],
    difficulty: 'intermediate',
  },
};

moduleRegistry.register(samplingModule);
export default samplingModule;
