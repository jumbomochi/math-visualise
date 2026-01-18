/**
 * Correlation and Linear Regression Visualization Module
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import { FC, useState, useEffect } from 'react';
import { VisualizationModuleProps } from '@/core/types/VisualizationModule';
import {
  solveCorrelationRegression,
  CORRELATION_REGRESSION_EXAMPLES,
  DataPoint,
} from '@/math/statistics';
import Card from '@/components/ui/Card';
import MathDisplay from '@/components/ui/MathDisplay';
import Button from '@/components/ui/Button';
import { ScatterChart, CheckCircle2, TrendingUp } from 'lucide-react';

const CorrelationRegressionModule: FC<VisualizationModuleProps> = ({ mathState, onStateChange }) => {
  const [currentExampleId, setCurrentExampleId] = useState('height-weight');
  const result = mathState.computed as any;

  useEffect(() => {
    const computed = solveCorrelationRegression(currentExampleId);
    onStateChange({ computed: computed as any });
  }, [currentExampleId]);

  if (!result) return <div>Loading...</div>;

  const currentExample = CORRELATION_REGRESSION_EXAMPLES.find(ex => ex.id === currentExampleId) || CORRELATION_REGRESSION_EXAMPLES[0];

  // Interpret correlation strength
  const absR = Math.abs(result.correlationCoefficient);
  let correlationStrength = '';
  let strengthColor = '';
  if (absR >= 0.9) {
    correlationStrength = 'Very Strong';
    strengthColor = 'bg-green-50 border-green-300 text-green-900';
  } else if (absR >= 0.7) {
    correlationStrength = 'Strong';
    strengthColor = 'bg-blue-50 border-blue-300 text-blue-900';
  } else if (absR >= 0.5) {
    correlationStrength = 'Moderate';
    strengthColor = 'bg-yellow-50 border-yellow-300 text-yellow-900';
  } else if (absR >= 0.3) {
    correlationStrength = 'Weak';
    strengthColor = 'bg-orange-50 border-orange-300 text-orange-900';
  } else {
    correlationStrength = 'Very Weak';
    strengthColor = 'bg-red-50 border-red-300 text-red-900';
  }

  const correlationDirection = result.correlationCoefficient > 0 ? 'Positive' : 'Negative';

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Correlation & Linear Regression</h2>
        <p className="text-gray-600 mt-2">
          Analyzing relationships between two variables
        </p>
      </div>

      {/* Correlation and Regression Formulas */}
      <Card className="bg-teal-50 border-2 border-teal-300">
        <h3 className="font-semibold text-teal-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Key Formulas
        </h3>
        <div className="space-y-3">
          <div className="bg-white rounded p-3">
            <p className="text-sm font-semibold text-gray-700 mb-2">Product-Moment Correlation Coefficient:</p>
            <MathDisplay math="r = \frac{S_{xy}}{\sqrt{S_{xx} \times S_{yy}}}" display="block" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-teal-100 rounded p-3">
              <p className="text-sm font-semibold text-teal-900 mb-2">Regression Y on X:</p>
              <MathDisplay math="y = a + bx" display="block" />
              <p className="text-xs text-teal-800 mt-2">where b = S<sub>xy</sub>/S<sub>xx</sub></p>
            </div>
            <div className="bg-teal-100 rounded p-3">
              <p className="text-sm font-semibold text-teal-900 mb-2">Regression X on Y:</p>
              <MathDisplay math="x = a + by" display="block" />
              <p className="text-xs text-teal-800 mt-2">where b = S<sub>xy</sub>/S<sub>yy</sub></p>
            </div>
          </div>
          <div className="bg-white rounded p-3">
            <p className="text-sm font-semibold text-gray-700 mb-1">Key Values:</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
              <div>
                <MathDisplay math="S_{xx} = \Sigma x^2 - \frac{(\Sigma x)^2}{n}" />
              </div>
              <div>
                <MathDisplay math="S_{yy} = \Sigma y^2 - \frac{(\Sigma y)^2}{n}" />
              </div>
              <div>
                <MathDisplay math="S_{xy} = \Sigma xy - \frac{(\Sigma x)(\Sigma y)}{n}" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Example Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Real-Life Examples</h3>
        <div className="flex gap-2 flex-wrap">
          {CORRELATION_REGRESSION_EXAMPLES.map((example) => (
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
      <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-teal-900">
            {currentExample.title}
          </h3>
          <div className="bg-white border-l-4 border-teal-500 p-4 rounded">
            <p className="font-semibold mb-2 text-teal-900">
              Question:
            </p>
            <div className="text-gray-800 space-y-2">
              <p>{currentExample.context}</p>
              <p className="font-medium">{currentExample.question}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Data Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Observation</th>
                <th className="px-4 py-2 text-right font-semibold">{result.xLabel}</th>
                <th className="px-4 py-2 text-right font-semibold">{result.yLabel}</th>
                <th className="px-4 py-2 text-right font-semibold">xy</th>
                <th className="px-4 py-2 text-right font-semibold">x²</th>
                <th className="px-4 py-2 text-right font-semibold">y²</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((point: DataPoint, idx: number) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2 text-right">{point.x}</td>
                  <td className="px-4 py-2 text-right">{point.y}</td>
                  <td className="px-4 py-2 text-right">{(point.x * point.y).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">{(point.x * point.x).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">{(point.y * point.y).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-400 font-semibold bg-gray-50">
                <td className="px-4 py-2">Σ (Sum)</td>
                <td className="px-4 py-2 text-right">{result.sumX.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{result.sumY.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{result.sumXY.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{result.sumX2.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{result.sumY2.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Scatter Diagram with Regression Line */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ScatterChart className="w-5 h-5 text-teal-600" />
          Scatter Diagram
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <ScatterPlot
            data={result.data}
            xLabel={result.xLabel}
            yLabel={result.yLabel}
            regressionLineY={result.regressionLineY}
            predictX={currentExample.predictX}
            predictedY={result.predictedY}
          />
        </div>
      </Card>

      {/* Correlation Coefficient */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Correlation Analysis</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 border-2 border-blue-300 rounded p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">Correlation (r)</p>
            <p className="text-4xl font-bold text-blue-900">{result.correlationCoefficient.toFixed(4)}</p>
          </div>
          <div className={`${strengthColor} border-2 rounded p-4`}>
            <p className="text-sm font-semibold mb-2">Strength</p>
            <p className="text-2xl font-bold">{correlationStrength}</p>
          </div>
          <div className={`${result.correlationCoefficient > 0 ? 'bg-green-50 border-green-300 text-green-900' : 'bg-red-50 border-red-300 text-red-900'} border-2 rounded p-4`}>
            <p className="text-sm font-semibold mb-2">Direction</p>
            <p className="text-2xl font-bold">{correlationDirection}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-purple-50 border-2 border-purple-300 rounded p-4">
            <p className="text-sm font-semibold text-purple-900 mb-2">S<sub>xx</sub></p>
            <p className="text-2xl font-bold text-purple-900">{result.sxx.toFixed(4)}</p>
          </div>
          <div className="bg-indigo-50 border-2 border-indigo-300 rounded p-4">
            <p className="text-sm font-semibold text-indigo-900 mb-2">S<sub>yy</sub></p>
            <p className="text-2xl font-bold text-indigo-900">{result.syy.toFixed(4)}</p>
          </div>
          <div className="bg-violet-50 border-2 border-violet-300 rounded p-4">
            <p className="text-sm font-semibold text-violet-900 mb-2">S<sub>xy</sub></p>
            <p className="text-2xl font-bold text-violet-900">{result.sxy.toFixed(4)}</p>
          </div>
        </div>
      </Card>

      {/* Regression Lines */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Regression Equations</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-300 rounded p-4">
            <p className="text-sm font-semibold text-teal-900 mb-3">Y on X (predict Y from X)</p>
            <div className="bg-white rounded p-3 mb-2">
              <MathDisplay math={result.regressionLineY.equationLatex} display="block" />
            </div>
            <div className="text-xs text-teal-800 space-y-1">
              <p>Slope (b) = {result.regressionLineY.slope.toFixed(4)}</p>
              <p>Intercept (a) = {result.regressionLineY.intercept.toFixed(4)}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded p-4">
            <p className="text-sm font-semibold text-blue-900 mb-3">X on Y (predict X from Y)</p>
            <div className="bg-white rounded p-3 mb-2">
              <MathDisplay math={result.regressionLineX.equationLatex} display="block" />
            </div>
            <div className="text-xs text-blue-800 space-y-1">
              <p>Slope (b) = {result.regressionLineX.slope.toFixed(4)}</p>
              <p>Intercept (a) = {result.regressionLineX.intercept.toFixed(4)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Predictions */}
      {(result.predictedY !== undefined || result.predictedX !== undefined) && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Predictions</h3>
          <div className="grid grid-cols-2 gap-4">
            {result.predictedY !== undefined && currentExample.predictX !== undefined && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded p-4">
                <p className="text-sm text-gray-700 mb-2">When {result.xLabel} = {currentExample.predictX}:</p>
                <p className="text-sm font-semibold text-green-900 mb-1">Predicted {result.yLabel}</p>
                <p className="text-4xl font-bold text-green-900">{result.predictedY.toFixed(2)}</p>
              </div>
            )}
            {result.predictedX !== undefined && currentExample.predictY !== undefined && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded p-4">
                <p className="text-sm text-gray-700 mb-2">When {result.yLabel} = {currentExample.predictY}:</p>
                <p className="text-sm font-semibold text-purple-900 mb-1">Predicted {result.xLabel}</p>
                <p className="text-4xl font-bold text-purple-900">{result.predictedX.toFixed(2)}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Data Table */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Data Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Observation</th>
                <th className="px-4 py-2 text-right font-semibold">{result.xLabel}</th>
                <th className="px-4 py-2 text-right font-semibold">{result.yLabel}</th>
                <th className="px-4 py-2 text-right font-semibold">xy</th>
                <th className="px-4 py-2 text-right font-semibold">x²</th>
                <th className="px-4 py-2 text-right font-semibold">y²</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((point: DataPoint, idx: number) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2 text-right">{point.x}</td>
                  <td className="px-4 py-2 text-right">{point.y}</td>
                  <td className="px-4 py-2 text-right">{(point.x * point.y).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">{(point.x * point.x).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">{(point.y * point.y).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-400 font-semibold bg-gray-50">
                <td className="px-4 py-2">Σ (Sum)</td>
                <td className="px-4 py-2 text-right">{result.sumX.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{result.sumY.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{result.sumXY.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{result.sumX2.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">{result.sumY2.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
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

        <div className="bg-white border-2 border-teal-200 rounded p-4">
          <MathDisplay math={result.formulaLatex} display="block" />
        </div>
      </Card>

      {/* Explanation */}
      <Card className="bg-teal-50 border-2 border-teal-200">
        <h3 className="font-semibold text-teal-900 mb-2">Key Insight</h3>
        <p className="text-sm text-teal-800">{result.explanation}</p>
      </Card>
    </div>
  );
};

/**
 * Scatter Plot with Regression Line
 */
interface ScatterPlotProps {
  data: DataPoint[];
  xLabel: string;
  yLabel: string;
  regressionLineY: {
    slope: number;
    intercept: number;
  };
  predictX?: number;
  predictedY?: number;
}

const ScatterPlot: FC<ScatterPlotProps> = ({
  data,
  xLabel,
  yLabel,
  regressionLineY,
  predictX,
  predictedY,
}) => {
  const width = 800;
  const height = 500;
  const padding = 80;

  // Find data ranges
  const xValues = data.map(p => p.x);
  const yValues = data.map(p => p.y);
  const xMin = Math.min(...xValues) * 0.9;
  const xMax = Math.max(...xValues) * 1.1;
  const yMin = Math.min(...yValues) * 0.9;
  const yMax = Math.max(...yValues) * 1.1;

  // Scale functions
  const scaleX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
  const scaleY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);

  // Regression line endpoints
  const regressionY1 = regressionLineY.intercept + regressionLineY.slope * xMin;
  const regressionY2 = regressionLineY.intercept + regressionLineY.slope * xMax;

  return (
    <svg width={width} height={height} className="mx-auto">
      {/* Axes */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#374151" strokeWidth="2" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#374151" strokeWidth="2" />

      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(frac => {
        const x = xMin + frac * (xMax - xMin);
        const y = yMin + frac * (yMax - yMin);
        return (
          <g key={frac}>
            <line
              x1={scaleX(x)}
              y1={padding}
              x2={scaleX(x)}
              y2={height - padding}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
            <line
              x1={padding}
              y1={scaleY(y)}
              x2={width - padding}
              y2={scaleY(y)}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          </g>
        );
      })}

      {/* Regression line */}
      <line
        x1={scaleX(xMin)}
        y1={scaleY(regressionY1)}
        x2={scaleX(xMax)}
        y2={scaleY(regressionY2)}
        stroke="#0D9488"
        strokeWidth="3"
      />

      {/* Data points */}
      {data.map((point, idx) => (
        <circle
          key={idx}
          cx={scaleX(point.x)}
          cy={scaleY(point.y)}
          r="6"
          fill="#3B82F6"
          stroke="#1E40AF"
          strokeWidth="2"
        />
      ))}

      {/* Prediction point and lines */}
      {predictX !== undefined && predictedY !== undefined && (
        <>
          {/* Vertical line from x-axis to prediction point */}
          <line
            x1={scaleX(predictX)}
            y1={height - padding}
            x2={scaleX(predictX)}
            y2={scaleY(predictedY)}
            stroke="#DC2626"
            strokeWidth="2"
            strokeDasharray="4"
          />
          {/* Horizontal line from y-axis to prediction point */}
          <line
            x1={padding}
            y1={scaleY(predictedY)}
            x2={scaleX(predictX)}
            y2={scaleY(predictedY)}
            stroke="#DC2626"
            strokeWidth="2"
            strokeDasharray="4"
          />
          {/* Prediction point */}
          <circle
            cx={scaleX(predictX)}
            cy={scaleY(predictedY)}
            r="8"
            fill="#DC2626"
            stroke="#991B1B"
            strokeWidth="2"
          />
          {/* Labels for prediction */}
          <text
            x={scaleX(predictX)}
            y={height - padding + 25}
            fontSize="12"
            fill="#DC2626"
            fontWeight="bold"
            textAnchor="middle"
          >
            x = {predictX}
          </text>
          <text
            x={padding - 10}
            y={scaleY(predictedY) + 5}
            fontSize="12"
            fill="#DC2626"
            fontWeight="bold"
            textAnchor="end"
          >
            y = {predictedY.toFixed(1)}
          </text>
        </>
      )}

      {/* Axis labels */}
      <text x={width / 2} y={height - 20} fontSize="14" fill="#374151" fontWeight="bold" textAnchor="middle">
        {xLabel}
      </text>
      <text x={30} y={height / 2} fontSize="14" fill="#374151" fontWeight="bold" textAnchor="middle" transform={`rotate(-90, 30, ${height / 2})`}>
        {yLabel}
      </text>

      {/* Tick marks and values */}
      {[0, 0.25, 0.5, 0.75, 1].map(frac => {
        const x = xMin + frac * (xMax - xMin);
        const y = yMin + frac * (yMax - yMin);
        return (
          <g key={frac}>
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
              {x.toFixed(0)}
            </text>

            <line
              x1={padding - 5}
              y1={scaleY(y)}
              x2={padding + 5}
              y2={scaleY(y)}
              stroke="#374151"
              strokeWidth="2"
            />
            <text
              x={padding - 10}
              y={scaleY(y) + 5}
              fontSize="11"
              fill="#374151"
              textAnchor="end"
            >
              {y.toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${width - 200}, 40)`}>
        <circle cx="0" cy="0" r="6" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2" />
        <text x="15" y="5" fontSize="12" fill="#374151">Data Points</text>

        <line x1="0" y1="20" x2="30" y2="20" stroke="#0D9488" strokeWidth="3" />
        <text x="35" y="25" fontSize="12" fill="#374151">Regression Line</text>

        {predictX !== undefined && (
          <>
            <circle cx="0" cy="40" r="8" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
            <text x="15" y="45" fontSize="12" fill="#374151">Prediction</text>
          </>
        )}
      </g>
    </svg>
  );
};

const correlationRegressionModule: VisualizationModule = {
  id: 'statistics.correlation-regression',
  name: 'Correlation & Regression',
  description: 'Analyze relationships between variables and make predictions',
  syllabusRef: { strand: 'statistics-distributions', topic: 'correlation-regression' },
  engine: 'html',
  Component: CorrelationRegressionModule,
  getInitialState: () => {
    const result = solveCorrelationRegression('height-weight');
    return {
      topicId: 'statistics.correlation-regression',
      parameters: {},
      inputs: {},
      computed: result as any,
      visualization: { showLabels: true },
    };
  },
  validateState: () => [],
  metadata: {
    version: '1.0.0',
    tags: ['statistics', 'correlation', 'regression', 'scatter-plot', 'linear-regression'],
    difficulty: 'intermediate',
  },
};

moduleRegistry.register(correlationRegressionModule);
export default correlationRegressionModule;
