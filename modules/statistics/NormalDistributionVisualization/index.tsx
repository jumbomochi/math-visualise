/**
 * Normal Distribution Visualization Module
 */

import { VisualizationModule } from '@/lib/core/types/VisualizationModule';
import { moduleRegistry } from '@/lib/core/registry/ModuleRegistry';
import { FC, useState, useEffect } from 'react';
import { VisualizationModuleProps } from '@/lib/core/types/VisualizationModule';
import {
  solveNormalProblem,
  NORMAL_EXAMPLES,
  standardNormalCDF,
} from '@/lib/math/statistics';
import Card from '@/components/ui/Card';
import MathDisplay from '@/components/ui/MathDisplay';
import Button from '@/components/ui/Button';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

const NormalDistributionModule: FC<VisualizationModuleProps> = ({ mathState, onStateChange }) => {
  const [currentExampleId, setCurrentExampleId] = useState('heights');
  const result = mathState.computed as any;

  useEffect(() => {
    const computed = solveNormalProblem(currentExampleId);
    onStateChange({ computed: computed as any });
  }, [currentExampleId]);

  if (!result) return <div>Loading...</div>;

  const currentExample = NORMAL_EXAMPLES.find(ex => ex.id === currentExampleId) || NORMAL_EXAMPLES[0];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Normal Distribution</h2>
        <p className="text-gray-600 mt-2">
          The bell curve - continuous probability distribution
        </p>
      </div>

      {/* Normal Distribution Formula */}
      <Card className="bg-green-50 border-2 border-green-300">
        <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Normal Distribution
        </h3>
        <div className="bg-white rounded p-3 mb-3">
          <MathDisplay
            math="X \sim N(\mu, \sigma^2)"
            display="block"
          />
        </div>
        <div className="space-y-3">
          <div className="bg-green-100 rounded p-3">
            <p className="text-sm font-semibold text-green-900 mb-2">Standard Normal Distribution:</p>
            <MathDisplay math="Z = \frac{X - \mu}{\sigma}" display="block" />
            <p className="text-xs text-green-800 mt-2">where Z ~ N(0, 1)</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded p-3">
              <p className="text-sm font-semibold text-gray-700 mb-1">Properties:</p>
              <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                <li>Symmetric about μ</li>
                <li>Bell-shaped curve</li>
                <li>Mean = Median = Mode</li>
                <li>68-95-99.7 rule</li>
              </ul>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-sm font-semibold text-gray-700 mb-1">Key Values:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>P(μ - σ &lt; X &lt; μ + σ) ≈ 68%</li>
                <li>P(μ - 2σ &lt; X &lt; μ + 2σ) ≈ 95%</li>
                <li>P(μ - 3σ &lt; X &lt; μ + 3σ) ≈ 99.7%</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Example Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Real-Life Examples</h3>
        <div className="flex gap-2 flex-wrap">
          {NORMAL_EXAMPLES.map((example) => (
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
      <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-green-900">
            {currentExample.title}
          </h3>
          <div className="bg-white border-l-4 border-green-500 p-4 rounded">
            <p className="font-semibold mb-2 text-green-900">
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
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 border-2 border-blue-300 rounded p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">Mean (μ)</p>
            <p className="text-3xl font-bold text-blue-900">{result.mean}</p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-300 rounded p-4">
            <p className="text-sm font-semibold text-purple-900 mb-2">Std Dev (σ)</p>
            <p className="text-3xl font-bold text-purple-900">{result.standardDeviation}</p>
          </div>
          <div className="bg-indigo-50 border-2 border-indigo-300 rounded p-4">
            <p className="text-sm font-semibold text-indigo-900 mb-2">Variance (σ²)</p>
            <p className="text-3xl font-bold text-indigo-900">{result.variance}</p>
          </div>
        </div>
      </Card>

      {/* Normal Curve Visualization */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Normal Curve</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <NormalCurve
            mean={result.mean}
            sd={result.standardDeviation}
            zScore={result.zScore}
            shadedRegion={currentExample.type}
            targetValue={currentExample.targetValue}
            targetRange={currentExample.targetRange}
          />
        </div>
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

        <div className="bg-white border-2 border-green-200 rounded p-4 mb-4">
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
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded p-4">
            <p className="text-sm text-gray-700 mb-2">Value:</p>
            <p className="text-3xl font-bold text-purple-900">
              x = {result.value.toFixed(2)}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

/**
 * Normal Curve SVG Component
 */
interface NormalCurveProps {
  mean: number;
  sd: number;
  zScore?: number;
  shadedRegion: string;
  targetValue?: number;
  targetRange?: { lower?: number; upper?: number };
}

const NormalCurve: FC<NormalCurveProps> = ({ mean, sd, zScore, shadedRegion, targetValue, targetRange }) => {
  const width = 800;
  const height = 300;
  const padding = 60;

  // X-axis range: mean ± 4 standard deviations
  const xMin = mean - 4 * sd;
  const xMax = mean + 4 * sd;

  // Scale functions
  const scaleX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
  const scaleY = (y: number) => height - padding - y * (height - 2 * padding) * 2.5;

  // Normal probability density function
  const normalPDF = (x: number) => {
    const exponent = -0.5 * Math.pow((x - mean) / sd, 2);
    return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
  };

  // Generate points for the curve
  const points: { x: number; y: number }[] = [];
  const numPoints = 200;
  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + (i / numPoints) * (xMax - xMin);
    const y = normalPDF(x);
    points.push({ x, y });
  }

  // Create path for the normal curve
  const curvePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`)
    .join(' ');

  // Create shaded area path
  let shadedPath = '';
  if (shadedRegion === 'find-probability' && targetValue !== undefined) {
    // Shade from -∞ to targetValue
    const shadedPoints = points.filter(p => p.x <= targetValue);
    if (shadedPoints.length > 0) {
      shadedPath = `M ${scaleX(xMin)} ${scaleY(0)} `;
      shadedPath += shadedPoints.map(p => `L ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ');
      shadedPath += ` L ${scaleX(targetValue)} ${scaleY(0)} Z`;
    }
  } else if (shadedRegion === 'range' && targetRange) {
    const { lower, upper } = targetRange;
    const lowerBound = lower ?? xMin;
    const upperBound = upper ?? xMax;
    const shadedPoints = points.filter(p => p.x >= lowerBound && p.x <= upperBound);
    if (shadedPoints.length > 0) {
      shadedPath = `M ${scaleX(lowerBound)} ${scaleY(0)} `;
      shadedPath += shadedPoints.map(p => `L ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ');
      shadedPath += ` L ${scaleX(upperBound)} ${scaleY(0)} Z`;
    }
  }

  return (
    <svg width={width} height={height} className="mx-auto">
      {/* Axes */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#374151" strokeWidth="2" />
      <line x1={scaleX(mean)} y1={padding / 2} x2={scaleX(mean)} y2={height - padding} stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4" />

      {/* Standard deviation markers */}
      {[-3, -2, -1, 0, 1, 2, 3].map(k => {
        const x = mean + k * sd;
        return (
          <g key={k}>
            <line
              x1={scaleX(x)}
              y1={height - padding - 5}
              x2={scaleX(x)}
              y2={height - padding + 5}
              stroke="#374151"
              strokeWidth="2"
            />
            <text
              x={scaleX(x)}
              y={height - padding + 20}
              fontSize="11"
              fill="#374151"
              textAnchor="middle"
            >
              {k === 0 ? `μ=${mean}` : k > 0 ? `μ+${k}σ` : `μ${k}σ`}
            </text>
          </g>
        );
      })}

      {/* Shaded area */}
      {shadedPath && (
        <path d={shadedPath} fill="#3B82F6" opacity="0.3" />
      )}

      {/* Normal curve */}
      <path d={curvePath} stroke="#1E40AF" strokeWidth="2" fill="none" />

      {/* Target value line */}
      {targetValue !== undefined && (
        <>
          <line
            x1={scaleX(targetValue)}
            y1={padding / 2}
            x2={scaleX(targetValue)}
            y2={height - padding}
            stroke="#DC2626"
            strokeWidth="2"
            strokeDasharray="4"
          />
          <text
            x={scaleX(targetValue)}
            y={padding / 2 - 5}
            fontSize="12"
            fill="#DC2626"
            fontWeight="bold"
            textAnchor="middle"
          >
            x = {targetValue}
          </text>
        </>
      )}

      {/* Range markers */}
      {targetRange?.lower !== undefined && (
        <line
          x1={scaleX(targetRange.lower)}
          y1={padding / 2}
          x2={scaleX(targetRange.lower)}
          y2={height - padding}
          stroke="#DC2626"
          strokeWidth="2"
          strokeDasharray="4"
        />
      )}
      {targetRange?.upper !== undefined && (
        <line
          x1={scaleX(targetRange.upper)}
          y1={padding / 2}
          x2={scaleX(targetRange.upper)}
          y2={height - padding}
          stroke="#DC2626"
          strokeWidth="2"
          strokeDasharray="4"
        />
      )}

      {/* Labels */}
      <text x={width / 2} y={height - 10} fontSize="12" fill="#374151" fontWeight="bold" textAnchor="middle">
        X
      </text>
      <text x={20} y={30} fontSize="12" fill="#374151" fontWeight="bold">
        f(x)
      </text>
    </svg>
  );
};

const normalDistributionModule: VisualizationModule = {
  id: 'statistics.normal-distribution',
  name: 'Normal Distribution',
  description: 'Continuous probability distribution - the bell curve',
  syllabusRef: { strand: 'statistics-distributions', topic: 'continuous-distributions' },
  engine: 'html',
  Component: NormalDistributionModule,
  getInitialState: () => {
    const result = solveNormalProblem('heights');
    return {
      topicId: 'statistics.normal-distribution',
      parameters: {},
      inputs: {},
      computed: result as any,
      visualization: { showLabels: true },
    };
  },
  validateState: () => [],
  metadata: {
    version: '1.0.0',
    tags: ['statistics', 'normal', 'continuous', 'distribution', 'z-score'],
    difficulty: 'intermediate',
  },
};

moduleRegistry.register(normalDistributionModule);
export default normalDistributionModule;
