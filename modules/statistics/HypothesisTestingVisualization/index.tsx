/**
 * Hypothesis Testing Visualization Module
 */

import { VisualizationModule } from '@/lib/core/types/VisualizationModule';
import { moduleRegistry } from '@/lib/core/registry/ModuleRegistry';
import { FC, useState, useEffect } from 'react';
import { VisualizationModuleProps } from '@/lib/core/types/VisualizationModule';
import {
  solveHypothesisTest,
  HYPOTHESIS_TEST_EXAMPLES,
  standardNormalCDF,
  calculateZCriticalValue,
  calculateZPValue,
} from '@/lib/math/statistics';
import Card from '@/components/ui/Card';
import MathDisplay from '@/components/ui/MathDisplay';
import Button from '@/components/ui/Button';
import { Target, CheckCircle2, AlertCircle, TrendingUp, Sliders } from 'lucide-react';

const HypothesisTestingModule: FC<VisualizationModuleProps> = ({ mathState, onStateChange }) => {
  const [currentExampleId, setCurrentExampleId] = useState('mean-weight');
  const result = mathState.computed as any;

  useEffect(() => {
    const computed = solveHypothesisTest(currentExampleId);
    onStateChange({ computed: computed as any });
  }, [currentExampleId]);

  if (!result) return <div>Loading...</div>;

  const currentExample = HYPOTHESIS_TEST_EXAMPLES.find(ex => ex.id === currentExampleId) || HYPOTHESIS_TEST_EXAMPLES[0];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Hypothesis Testing</h2>
        <p className="text-gray-600 mt-2">
          Testing claims about population parameters
        </p>
      </div>

      {/* Hypothesis Testing Framework */}
      <Card className="bg-purple-50 border-2 border-purple-300">
        <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Hypothesis Testing Framework
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded p-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">Test Statistic:</p>
              <div className="space-y-1 text-xs">
                <MathDisplay math="Z = \frac{\bar{x} - \mu_0}{\sigma/\sqrt{n}}" display="block" />
                <p className="text-gray-600 mt-1">or</p>
                <MathDisplay math="t = \frac{\bar{x} - \mu_0}{s/\sqrt{n}}" display="block" />
              </div>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">Decision Rule:</p>
              <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                <li>If p-value &lt; α: Reject H₀</li>
                <li>If p-value ≥ α: Do not reject H₀</li>
                <li>Or compare test statistic to critical value</li>
              </ul>
            </div>
          </div>
          <div className="bg-purple-100 rounded p-3">
            <p className="text-sm font-semibold text-purple-900 mb-2">Types of Tests:</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-purple-800">
              <div className="bg-white rounded p-2">
                <p className="font-semibold">1-Tail Right</p>
                <MathDisplay math="H_1: \mu > \mu_0" />
              </div>
              <div className="bg-white rounded p-2">
                <p className="font-semibold">1-Tail Left</p>
                <MathDisplay math="H_1: \mu < \mu_0" />
              </div>
              <div className="bg-white rounded p-2">
                <p className="font-semibold">2-Tail</p>
                <MathDisplay math="H_1: \mu \neq \mu_0" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Example Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Real-Life Examples</h3>
        <div className="flex gap-2 flex-wrap">
          {HYPOTHESIS_TEST_EXAMPLES.map((example) => (
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
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-purple-900">
            {currentExample.title}
          </h3>
          <div className="bg-white border-l-4 border-purple-500 p-4 rounded">
            <p className="font-semibold mb-2 text-purple-900">
              Question:
            </p>
            <div className="text-gray-800 space-y-2">
              <p>{currentExample.context}</p>
              <p className="font-medium">{currentExample.question}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Hypotheses */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Hypotheses</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 border-2 border-blue-300 rounded p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">Null Hypothesis (H₀)</p>
            <p className="text-xl font-bold text-blue-900">{result.nullHypothesis}</p>
            <p className="text-xs text-blue-700 mt-2">Assumed to be true unless evidence suggests otherwise</p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-300 rounded p-4">
            <p className="text-sm font-semibold text-purple-900 mb-2">Alternative Hypothesis (H₁)</p>
            <p className="text-xl font-bold text-purple-900">{result.alternativeHypothesis}</p>
            <p className="text-xs text-purple-700 mt-2">What we're testing for</p>
          </div>
        </div>
      </Card>

      {/* Test Details */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Test Configuration</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-indigo-50 border-2 border-indigo-300 rounded p-4">
            <p className="text-sm font-semibold text-indigo-900 mb-2">Test Type</p>
            <p className="text-2xl font-bold text-indigo-900">{result.testType.toUpperCase()}</p>
          </div>
          <div className="bg-violet-50 border-2 border-violet-300 rounded p-4">
            <p className="text-sm font-semibold text-violet-900 mb-2">Tail Type</p>
            <p className="text-xl font-bold text-violet-900">
              {result.tailType === '2-tail' ? '2-Tail' : '1-Tail'}
            </p>
          </div>
          <div className="bg-pink-50 border-2 border-pink-300 rounded p-4">
            <p className="text-sm font-semibold text-pink-900 mb-2">Significance (α)</p>
            <p className="text-2xl font-bold text-pink-900">{result.significanceLevel}</p>
            <p className="text-xs text-pink-700 mt-1">{(result.significanceLevel * 100).toFixed(0)}%</p>
          </div>
          <div className="bg-fuchsia-50 border-2 border-fuchsia-300 rounded p-4">
            <p className="text-sm font-semibold text-fuchsia-900 mb-2">Sample Size</p>
            <p className="text-2xl font-bold text-fuchsia-900">n = {currentExample.sampleSize}</p>
          </div>
        </div>
      </Card>

      {/* Interactive Visualization: Explore Critical Regions */}
      <InteractiveCriticalRegions />

      {/* Normal Distribution with Critical Regions */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Test Statistic Distribution (Current Example)
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <HypothesisTestCurve
            testStatistic={result.testStatistic}
            criticalValue={result.criticalValue}
            tailType={result.tailType}
            reject={result.reject}
          />
        </div>
      </Card>

      {/* Test Results */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Test Results</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 border-2 border-blue-300 rounded p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">Test Statistic</p>
            <p className="text-3xl font-bold text-blue-900">
              {result.testType === 'z-test' ? 'Z' : 't'} = {result.testStatistic.toFixed(4)}
            </p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-300 rounded p-4">
            <p className="text-sm font-semibold text-purple-900 mb-2">Critical Value(s)</p>
            <p className="text-2xl font-bold text-purple-900">
              {typeof result.criticalValue === 'number'
                ? result.criticalValue.toFixed(4)
                : `±${result.criticalValue.upper.toFixed(4)}`}
            </p>
          </div>
          <div className="bg-pink-50 border-2 border-pink-300 rounded p-4">
            <p className="text-sm font-semibold text-pink-900 mb-2">p-value</p>
            <p className="text-3xl font-bold text-pink-900">{result.pValue.toFixed(6)}</p>
            <p className="text-xs text-pink-700 mt-1">
              {result.pValue < result.significanceLevel ? '< α' : '≥ α'}
            </p>
          </div>
        </div>

        {/* Decision */}
        <div className={`${result.reject ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'} border-2 rounded p-4`}>
          <div className="flex items-start gap-3">
            {result.reject ? (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            )}
            <div>
              <p className={`text-lg font-bold ${result.reject ? 'text-red-900' : 'text-green-900'} mb-2`}>
                Decision: {result.reject ? 'Reject H₀' : 'Do Not Reject H₀'}
              </p>
              <p className={`text-sm ${result.reject ? 'text-red-800' : 'text-green-800'}`}>
                {result.conclusion}
              </p>
            </div>
          </div>
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

        <div className="bg-white border-2 border-purple-200 rounded p-4">
          <MathDisplay math={result.formulaLatex} display="block" />
        </div>
      </Card>

      {/* Explanation */}
      <Card className="bg-purple-50 border-2 border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-2">Key Insight</h3>
        <p className="text-sm text-purple-800">{result.explanation}</p>
      </Card>
    </div>
  );
};

/**
 * Interactive Critical Regions Explorer
 */
const InteractiveCriticalRegions: FC = () => {
  const [tailType, setTailType] = useState<'1-tail-right' | '1-tail-left' | '2-tail'>('1-tail-right');
  const [alpha, setAlpha] = useState(0.05);
  const [testStatistic, setTestStatistic] = useState(2.0);

  // Calculate critical values and p-value
  const criticalValue = calculateZCriticalValue(alpha, tailType);
  const pValue = calculateZPValue(testStatistic, tailType);

  // Determine if we reject H0
  let reject = false;
  if (typeof criticalValue === 'number') {
    if (tailType === '1-tail-right') {
      reject = testStatistic > criticalValue;
    } else {
      reject = testStatistic < criticalValue;
    }
  } else {
    reject = testStatistic < criticalValue.lower || testStatistic > criticalValue.upper;
  }

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Sliders className="w-5 h-5 text-indigo-600" />
        Interactive Explorer: Critical Regions
      </h3>
      <p className="text-sm text-gray-700 mb-4">
        Explore how critical regions change with different hypothesis types and significance levels. Adjust the test statistic to see when H₀ is rejected.
      </p>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Hypothesis Type Selector */}
        <div className="bg-white rounded p-4 border-2 border-indigo-200">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Hypothesis Type</label>
          <div className="space-y-2">
            <button
              onClick={() => setTailType('1-tail-right')}
              className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors ${
                tailType === '1-tail-right'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-left">
                <div className="font-semibold">H₁: μ &gt; μ₀</div>
                <div className="text-xs opacity-80">Right-tail test</div>
              </div>
            </button>
            <button
              onClick={() => setTailType('1-tail-left')}
              className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors ${
                tailType === '1-tail-left'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-left">
                <div className="font-semibold">H₁: μ &lt; μ₀</div>
                <div className="text-xs opacity-80">Left-tail test</div>
              </div>
            </button>
            <button
              onClick={() => setTailType('2-tail')}
              className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors ${
                tailType === '2-tail'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-left">
                <div className="font-semibold">H₁: μ ≠ μ₀</div>
                <div className="text-xs opacity-80">Two-tail test</div>
              </div>
            </button>
          </div>
        </div>

        {/* Significance Level Slider */}
        <div className="bg-white rounded p-4 border-2 border-purple-200">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Significance Level (α)
          </label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-purple-900">{alpha.toFixed(3)}</span>
              <span className="text-sm text-purple-700">{(alpha * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.001"
              max="0.20"
              step="0.001"
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0.1%</span>
              <span>20%</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[0.01, 0.05, 0.10].map(val => (
                <button
                  key={val}
                  onClick={() => setAlpha(val)}
                  className="px-2 py-1 text-xs bg-purple-100 hover:bg-purple-200 rounded transition-colors"
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Test Statistic Slider */}
        <div className="bg-white rounded p-4 border-2 border-pink-200">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Test Statistic (Z)
          </label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-pink-900">{testStatistic.toFixed(2)}</span>
              <span className={`text-sm font-semibold ${reject ? 'text-red-600' : 'text-green-600'}`}>
                {reject ? 'Reject H₀' : 'Accept H₀'}
              </span>
            </div>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.1"
              value={testStatistic}
              onChange={(e) => setTestStatistic(parseFloat(e.target.value))}
              className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>-4</span>
              <span>0</span>
              <span>+4</span>
            </div>
            <div className="text-xs text-gray-600">
              p-value: <span className="font-bold">{pValue.toFixed(6)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Values Display */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded p-3 border-2 border-blue-200">
          <p className="text-xs font-semibold text-gray-600 mb-1">Critical Value(s)</p>
          <p className="text-xl font-bold text-blue-900">
            {typeof criticalValue === 'number'
              ? criticalValue.toFixed(4)
              : `±${criticalValue.upper.toFixed(4)}`}
          </p>
        </div>
        <div className="bg-white rounded p-3 border-2 border-green-200">
          <p className="text-xs font-semibold text-gray-600 mb-1">Critical Region</p>
          <p className="text-sm font-bold text-green-900">
            {tailType === '1-tail-right' && `Z > ${(criticalValue as number).toFixed(2)}`}
            {tailType === '1-tail-left' && `Z < ${(criticalValue as number).toFixed(2)}`}
            {tailType === '2-tail' && typeof criticalValue !== 'number' &&
              `|Z| > ${criticalValue.upper.toFixed(2)}`}
          </p>
        </div>
        <div className={`rounded p-3 border-2 ${reject ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
          <p className="text-xs font-semibold text-gray-600 mb-1">Decision</p>
          <p className={`text-sm font-bold ${reject ? 'text-red-900' : 'text-green-900'}`}>
            {reject ? 'Reject H₀' : 'Do Not Reject H₀'}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            p = {pValue.toFixed(4)} {pValue < alpha ? '<' : '≥'} α
          </p>
        </div>
      </div>

      {/* Interactive Visualization */}
      <div className="bg-gray-50 rounded-lg p-4">
        <InteractiveCurve
          testStatistic={testStatistic}
          criticalValue={criticalValue}
          tailType={tailType}
          reject={reject}
          alpha={alpha}
        />
      </div>

      {/* Explanation */}
      <div className="mt-4 bg-white rounded p-4 border-l-4 border-indigo-500">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">How to use:</span> Select a hypothesis type, adjust the significance level (α) to see how the critical region changes,
          then move the test statistic slider to see when it falls in the critical region (reject H₀) or acceptance region (do not reject H₀).
        </p>
      </div>
    </Card>
  );
};

/**
 * Interactive Curve Component
 */
interface InteractiveCurveProps {
  testStatistic: number;
  criticalValue: number | { lower: number; upper: number };
  tailType: '1-tail-right' | '1-tail-left' | '2-tail';
  reject: boolean;
  alpha: number;
}

const InteractiveCurve: FC<InteractiveCurveProps> = ({
  testStatistic,
  criticalValue,
  tailType,
  reject,
  alpha,
}) => {
  const width = 900;
  const height = 350;
  const padding = 60;

  const xMin = -4;
  const xMax = 4;

  const scaleX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
  const scaleY = (y: number) => height - padding - y * (height - 2 * padding) * 2.5;

  const normalPDF = (x: number) => {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
  };

  const points: { x: number; y: number }[] = [];
  const numPoints = 200;
  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + (i / numPoints) * (xMax - xMin);
    const y = normalPDF(x);
    points.push({ x, y });
  }

  const curvePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`)
    .join(' ');

  // Critical region paths
  let criticalRegionPaths: string[] = [];
  if (tailType === '1-tail-right' && typeof criticalValue === 'number') {
    const shadedPoints = points.filter(p => p.x >= criticalValue);
    if (shadedPoints.length > 0) {
      let path = `M ${scaleX(criticalValue)} ${scaleY(0)} `;
      path += shadedPoints.map(p => `L ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ');
      path += ` L ${scaleX(xMax)} ${scaleY(0)} Z`;
      criticalRegionPaths.push(path);
    }
  } else if (tailType === '1-tail-left' && typeof criticalValue === 'number') {
    const shadedPoints = points.filter(p => p.x <= criticalValue);
    if (shadedPoints.length > 0) {
      let path = `M ${scaleX(xMin)} ${scaleY(0)} `;
      path += shadedPoints.map(p => `L ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ');
      path += ` L ${scaleX(criticalValue)} ${scaleY(0)} Z`;
      criticalRegionPaths.push(path);
    }
  } else if (tailType === '2-tail' && typeof criticalValue !== 'number') {
    const leftPoints = points.filter(p => p.x <= criticalValue.lower);
    if (leftPoints.length > 0) {
      let path = `M ${scaleX(xMin)} ${scaleY(0)} `;
      path += leftPoints.map(p => `L ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ');
      path += ` L ${scaleX(criticalValue.lower)} ${scaleY(0)} Z`;
      criticalRegionPaths.push(path);
    }
    const rightPoints = points.filter(p => p.x >= criticalValue.upper);
    if (rightPoints.length > 0) {
      let path = `M ${scaleX(criticalValue.upper)} ${scaleY(0)} `;
      path += rightPoints.map(p => `L ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ');
      path += ` L ${scaleX(xMax)} ${scaleY(0)} Z`;
      criticalRegionPaths.push(path);
    }
  }

  return (
    <svg width={width} height={height} className="mx-auto">
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#374151" strokeWidth="2" />
      <line x1={scaleX(0)} y1={padding / 2} x2={scaleX(0)} y2={height - padding} stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4" />

      {/* Critical regions */}
      {criticalRegionPaths.map((path, idx) => (
        <path key={idx} d={path} fill="#EF4444" opacity="0.3" />
      ))}

      {/* Acceptance region highlight */}
      {tailType === '1-tail-right' && typeof criticalValue === 'number' && (
        <text x={scaleX((xMin + criticalValue) / 2)} y={scaleY(0.15)} fontSize="11" fill="#059669" fontWeight="bold" textAnchor="middle">
          Acceptance Region
        </text>
      )}
      {tailType === '1-tail-left' && typeof criticalValue === 'number' && (
        <text x={scaleX((criticalValue + xMax) / 2)} y={scaleY(0.15)} fontSize="11" fill="#059669" fontWeight="bold" textAnchor="middle">
          Acceptance Region
        </text>
      )}
      {tailType === '2-tail' && typeof criticalValue !== 'number' && (
        <text x={scaleX(0)} y={scaleY(0.15)} fontSize="11" fill="#059669" fontWeight="bold" textAnchor="middle">
          Acceptance Region
        </text>
      )}

      {/* Normal curve */}
      <path d={curvePath} stroke="#1E40AF" strokeWidth="3" fill="none" />

      {/* Critical value lines */}
      {typeof criticalValue === 'number' ? (
        <>
          <line
            x1={scaleX(criticalValue)}
            y1={padding / 2}
            x2={scaleX(criticalValue)}
            y2={height - padding}
            stroke="#DC2626"
            strokeWidth="2"
            strokeDasharray="6,4"
          />
          <text
            x={scaleX(criticalValue)}
            y={padding / 2 - 5}
            fontSize="12"
            fill="#DC2626"
            fontWeight="bold"
            textAnchor="middle"
          >
            Critical: {criticalValue.toFixed(2)}
          </text>
        </>
      ) : (
        <>
          <line x1={scaleX(criticalValue.lower)} y1={padding / 2} x2={scaleX(criticalValue.lower)} y2={height - padding} stroke="#DC2626" strokeWidth="2" strokeDasharray="6,4" />
          <line x1={scaleX(criticalValue.upper)} y1={padding / 2} x2={scaleX(criticalValue.upper)} y2={height - padding} stroke="#DC2626" strokeWidth="2" strokeDasharray="6,4" />
          <text x={scaleX(criticalValue.lower)} y={padding / 2 - 5} fontSize="11" fill="#DC2626" fontWeight="bold" textAnchor="middle">
            {criticalValue.lower.toFixed(2)}
          </text>
          <text x={scaleX(criticalValue.upper)} y={padding / 2 - 5} fontSize="11" fill="#DC2626" fontWeight="bold" textAnchor="middle">
            {criticalValue.upper.toFixed(2)}
          </text>
        </>
      )}

      {/* Test statistic marker */}
      <line
        x1={scaleX(testStatistic)}
        y1={padding / 2 + 30}
        x2={scaleX(testStatistic)}
        y2={height - padding}
        stroke={reject ? '#059669' : '#6B7280'}
        strokeWidth="4"
      />
      <circle
        cx={scaleX(testStatistic)}
        cy={scaleY(normalPDF(testStatistic))}
        r="8"
        fill={reject ? '#059669' : '#6B7280'}
        stroke="white"
        strokeWidth="2"
      />
      <text
        x={scaleX(testStatistic)}
        y={padding / 2 + 20}
        fontSize="13"
        fill={reject ? '#059669' : '#6B7280'}
        fontWeight="bold"
        textAnchor="middle"
      >
        Z = {testStatistic.toFixed(2)}
      </text>

      {/* Axis labels */}
      {[-3, -2, -1, 0, 1, 2, 3].map(k => (
        <g key={k}>
          <line
            x1={scaleX(k)}
            y1={height - padding - 5}
            x2={scaleX(k)}
            y2={height - padding + 5}
            stroke="#374151"
            strokeWidth="2"
          />
          <text
            x={scaleX(k)}
            y={height - padding + 20}
            fontSize="11"
            fill="#374151"
            textAnchor="middle"
          >
            {k}
          </text>
        </g>
      ))}

      <text x={width / 2} y={height - 10} fontSize="12" fill="#374151" fontWeight="bold" textAnchor="middle">
        Z (Test Statistic)
      </text>
      <text x={20} y={30} fontSize="12" fill="#374151" fontWeight="bold">
        f(z)
      </text>

      {/* Alpha annotation */}
      <text x={width - 100} y={40} fontSize="11" fill="#6B7280">
        α = {alpha.toFixed(3)} ({(alpha * 100).toFixed(1)}%)
      </text>

      {/* Legend */}
      <g transform={`translate(${width - 200}, 60)`}>
        <rect x="0" y="0" width="20" height="15" fill="#EF4444" opacity="0.3" />
        <text x="25" y="12" fontSize="10" fill="#374151">Critical Region (α)</text>

        <line x1="0" y1="25" x2="20" y2="25" stroke={reject ? '#059669' : '#6B7280'} strokeWidth="4" />
        <text x="25" y="30" fontSize="10" fill="#374151">Test Statistic</text>

        <line x1="0" y1="40" x2="20" y2="40" stroke="#DC2626" strokeWidth="2" strokeDasharray="6,4" />
        <text x="25" y="45" fontSize="10" fill="#374151">Critical Value</text>
      </g>
    </svg>
  );
};

/**
 * Hypothesis Test Distribution Curve
 */
interface HypothesisTestCurveProps {
  testStatistic: number;
  criticalValue: number | { lower: number; upper: number };
  tailType: '1-tail-right' | '1-tail-left' | '2-tail';
  reject: boolean;
}

const HypothesisTestCurve: FC<HypothesisTestCurveProps> = ({
  testStatistic,
  criticalValue,
  tailType,
  reject,
}) => {
  const width = 800;
  const height = 300;
  const padding = 60;

  // X-axis range
  const xMin = -4;
  const xMax = 4;

  // Scale functions
  const scaleX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
  const scaleY = (y: number) => height - padding - y * (height - 2 * padding) * 2.5;

  // Standard normal PDF
  const normalPDF = (x: number) => {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
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

  // Create shaded area paths for critical regions
  let criticalRegionPaths: string[] = [];
  if (tailType === '1-tail-right' && typeof criticalValue === 'number') {
    const shadedPoints = points.filter(p => p.x >= criticalValue);
    if (shadedPoints.length > 0) {
      let path = `M ${scaleX(criticalValue)} ${scaleY(0)} `;
      path += shadedPoints.map(p => `L ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ');
      path += ` L ${scaleX(xMax)} ${scaleY(0)} Z`;
      criticalRegionPaths.push(path);
    }
  } else if (tailType === '1-tail-left' && typeof criticalValue === 'number') {
    const shadedPoints = points.filter(p => p.x <= criticalValue);
    if (shadedPoints.length > 0) {
      let path = `M ${scaleX(xMin)} ${scaleY(0)} `;
      path += shadedPoints.map(p => `L ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ');
      path += ` L ${scaleX(criticalValue)} ${scaleY(0)} Z`;
      criticalRegionPaths.push(path);
    }
  } else if (tailType === '2-tail' && typeof criticalValue !== 'number') {
    // Left tail
    const leftPoints = points.filter(p => p.x <= criticalValue.lower);
    if (leftPoints.length > 0) {
      let path = `M ${scaleX(xMin)} ${scaleY(0)} `;
      path += leftPoints.map(p => `L ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ');
      path += ` L ${scaleX(criticalValue.lower)} ${scaleY(0)} Z`;
      criticalRegionPaths.push(path);
    }
    // Right tail
    const rightPoints = points.filter(p => p.x >= criticalValue.upper);
    if (rightPoints.length > 0) {
      let path = `M ${scaleX(criticalValue.upper)} ${scaleY(0)} `;
      path += rightPoints.map(p => `L ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ');
      path += ` L ${scaleX(xMax)} ${scaleY(0)} Z`;
      criticalRegionPaths.push(path);
    }
  }

  return (
    <svg width={width} height={height} className="mx-auto">
      {/* Axes */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#374151" strokeWidth="2" />
      <line x1={scaleX(0)} y1={padding / 2} x2={scaleX(0)} y2={height - padding} stroke="#9CA3AF" strokeWidth="1" strokeDasharray="4" />

      {/* Critical region(s) */}
      {criticalRegionPaths.map((path, idx) => (
        <path key={idx} d={path} fill="#DC2626" opacity="0.2" />
      ))}

      {/* Normal curve */}
      <path d={curvePath} stroke="#1E40AF" strokeWidth="2" fill="none" />

      {/* Critical value line(s) */}
      {typeof criticalValue === 'number' ? (
        <>
          <line
            x1={scaleX(criticalValue)}
            y1={padding / 2}
            x2={scaleX(criticalValue)}
            y2={height - padding}
            stroke="#DC2626"
            strokeWidth="2"
            strokeDasharray="4"
          />
          <text
            x={scaleX(criticalValue)}
            y={padding / 2 - 5}
            fontSize="11"
            fill="#DC2626"
            fontWeight="bold"
            textAnchor="middle"
          >
            Critical: {criticalValue.toFixed(2)}
          </text>
        </>
      ) : (
        <>
          <line
            x1={scaleX(criticalValue.lower)}
            y1={padding / 2}
            x2={scaleX(criticalValue.lower)}
            y2={height - padding}
            stroke="#DC2626"
            strokeWidth="2"
            strokeDasharray="4"
          />
          <line
            x1={scaleX(criticalValue.upper)}
            y1={padding / 2}
            x2={scaleX(criticalValue.upper)}
            y2={height - padding}
            stroke="#DC2626"
            strokeWidth="2"
            strokeDasharray="4"
          />
          <text
            x={scaleX(criticalValue.lower)}
            y={padding / 2 - 5}
            fontSize="11"
            fill="#DC2626"
            fontWeight="bold"
            textAnchor="middle"
          >
            {criticalValue.lower.toFixed(2)}
          </text>
          <text
            x={scaleX(criticalValue.upper)}
            y={padding / 2 - 5}
            fontSize="11"
            fill="#DC2626"
            fontWeight="bold"
            textAnchor="middle"
          >
            {criticalValue.upper.toFixed(2)}
          </text>
        </>
      )}

      {/* Test statistic line */}
      <line
        x1={scaleX(testStatistic)}
        y1={padding / 2 + 20}
        x2={scaleX(testStatistic)}
        y2={height - padding}
        stroke={reject ? '#059669' : '#6B7280'}
        strokeWidth="3"
      />
      <text
        x={scaleX(testStatistic)}
        y={padding / 2 + 15}
        fontSize="12"
        fill={reject ? '#059669' : '#6B7280'}
        fontWeight="bold"
        textAnchor="middle"
      >
        Test Stat: {testStatistic.toFixed(2)}
      </text>

      {/* Standard deviation markers */}
      {[-3, -2, -1, 0, 1, 2, 3].map(k => (
        <g key={k}>
          <line
            x1={scaleX(k)}
            y1={height - padding - 5}
            x2={scaleX(k)}
            y2={height - padding + 5}
            stroke="#374151"
            strokeWidth="2"
          />
          <text
            x={scaleX(k)}
            y={height - padding + 20}
            fontSize="11"
            fill="#374151"
            textAnchor="middle"
          >
            {k}
          </text>
        </g>
      ))}

      {/* Labels */}
      <text x={width / 2} y={height - 10} fontSize="12" fill="#374151" fontWeight="bold" textAnchor="middle">
        Test Statistic (Z or t)
      </text>
      <text x={20} y={30} fontSize="12" fill="#374151" fontWeight="bold">
        f(x)
      </text>

      {/* Legend */}
      <g transform={`translate(${width - 250}, 40)`}>
        <rect x="0" y="0" width="20" height="15" fill="#DC2626" opacity="0.2" />
        <text x="25" y="12" fontSize="10" fill="#374151">Critical Region</text>

        <line x1="0" y1="25" x2="20" y2="25" stroke={reject ? '#059669' : '#6B7280'} strokeWidth="3" />
        <text x="25" y="30" fontSize="10" fill="#374151">Test Statistic</text>
      </g>
    </svg>
  );
};

const hypothesisTestingModule: VisualizationModule = {
  id: 'statistics.hypothesis-testing',
  name: 'Hypothesis Testing',
  description: 'Test claims about population parameters using sample data',
  syllabusRef: { strand: 'statistics-distributions', topic: 'hypothesis-testing' },
  engine: 'html',
  Component: HypothesisTestingModule,
  getInitialState: () => {
    const result = solveHypothesisTest('mean-weight');
    return {
      topicId: 'statistics.hypothesis-testing',
      parameters: {},
      inputs: {},
      computed: result as any,
      visualization: { showLabels: true },
    };
  },
  validateState: () => [],
  metadata: {
    version: '1.0.0',
    tags: ['statistics', 'hypothesis-testing', 'z-test', 't-test', 'p-value'],
    difficulty: 'advanced',
  },
};

moduleRegistry.register(hypothesisTestingModule);
export default hypothesisTestingModule;
