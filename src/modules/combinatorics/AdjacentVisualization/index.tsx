/**
 * Adjacent Arrangement Visualization (Grouping Method)
 */

import { VisualizationModule } from '@/core/types/VisualizationModule';
import { moduleRegistry } from '@/core/registry/ModuleRegistry';
import { FC, useEffect, useState } from 'react';
import { VisualizationModuleProps } from '@/core/types/VisualizationModule';
import { calculateAdjacent, ADJACENT_EXAMPLES } from '@/math/combinatorics';
import Card from '@/components/ui/Card';
import Slider from '@/components/ui/Slider';
import MathDisplay from '@/components/ui/MathDisplay';
import Button from '@/components/ui/Button';

const AdjacentModule: FC<VisualizationModuleProps> = ({ mathState, onStateChange }) => {
  const params = mathState.parameters as { totalItems: number; groupItems: number };
  const result = mathState.computed as any;
  const [currentExampleId, setCurrentExampleId] = useState('family-photo');

  useEffect(() => {
    const computed = calculateAdjacent({
      totalItems: params.totalItems,
      groupItems: params.groupItems,
    });
    onStateChange({ computed: computed as any });
  }, [params.totalItems, params.groupItems]);

  const handleExampleChange = (exampleId: string) => {
    const example = ADJACENT_EXAMPLES.find(ex => ex.id === exampleId);
    if (example) {
      setCurrentExampleId(exampleId);
      onStateChange({
        parameters: {
          totalItems: example.config.totalItems,
          groupItems: example.config.groupItems,
        },
      });
    }
  };

  if (!result) return <div>Loading</div>;

  const otherItems = params.totalItems - params.groupItems;
  const currentExample = ADJACENT_EXAMPLES.find(ex => ex.id === currentExampleId) || ADJACENT_EXAMPLES[0];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Adjacent Arrangements (Grouping Method)</h2>
        <p className="text-gray-600 mt-2">When specific items MUST be together</p>
      </div>

      {/* Example Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Real-Life Examples</h3>
        <div className="flex gap-2 flex-wrap">
          {ADJACENT_EXAMPLES.map((example) => (
            <Button
              key={example.id}
              onClick={() => handleExampleChange(example.id)}
              variant={currentExampleId === example.id ? 'primary' : 'secondary'}
            >
              {example.title}
            </Button>
          ))}
        </div>
      </Card>

      {/* Example Question */}
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-orange-900">{currentExample.title}</h3>
          <div className="bg-white border-l-4 border-orange-500 p-4 rounded">
            <p className="font-semibold text-orange-900 mb-2">Question:</p>
            <div className="text-gray-800 space-y-2">
              <p>{currentExample.context}</p>
              <p className="font-medium">{currentExample.question}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-[1fr,320px] gap-6">
        <div className="space-y-6">
          {/* Step 1: Group as One */}
          <Card className="bg-orange-50">
            <h3 className="font-semibold mb-4">Step 1: Treat Group as ONE Unit</h3>
            <div className="flex justify-center items-center gap-2">
              <div className="border-4 border-orange-500 rounded-lg p-2 bg-orange-100">
                <div className="flex gap-1">
                  {Array.from({ length: params.groupItems }).map((_, i) => (
                    <div key={i} className="w-12 h-12 bg-red-500 rounded flex items-center justify-center text-white text-sm font-bold">
                      G{i + 1}
                    </div>
                  ))}
                </div>
              </div>
              {otherItems > 0 && Array.from({ length: otherItems }).map((_, i) => (
                <div key={i} className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center text-white text-sm font-bold">
                  O{i + 1}
                </div>
              ))}
            </div>
            <p className="text-center text-sm mt-4">
              Grouped items (must be together) + {otherItems} other items = {result.visualization.unitsToArrange} units
            </p>
          </Card>

          {/* Step 2: Arrange Units */}
          <Card className="bg-orange-50">
            <h3 className="font-semibold mb-4">Step 2: Arrange the {result.visualization.unitsToArrange} Units</h3>
            <p className="text-center text-lg font-bold text-orange-600">
              {result.visualization.unitsToArrange}! ways
            </p>
            <p className="text-center text-sm mt-2">
              The grouped unit can be in any position among all units
            </p>
          </Card>

          {/* Step 3: Internal Arrangements */}
          <Card className="bg-orange-50">
            <h3 className="font-semibold mb-4">Step 3: Arrange Within the Group</h3>
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: params.groupItems }).map((_, i) => (
                <div key={i} className="w-12 h-12 bg-red-500 rounded flex items-center justify-center text-white text-sm font-bold">
                  G{i + 1}
                </div>
              ))}
            </div>
            <p className="text-center text-lg font-bold text-orange-600">
              {params.groupItems}! ways
            </p>
            <p className="text-center text-sm mt-2">
              Items within the group can be rearranged among themselves
            </p>
          </Card>

          {/* Final Answer */}
          <Card>
            <h3 className="text-lg font-semibold mb-3">Final Answer</h3>
            <div className="bg-white border-2 border-orange-200 rounded p-4 text-center">
              <MathDisplay math={result.formulaLatex} display="block" />
            </div>
            <div className="mt-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded p-4">
              <p className="text-2xl font-bold text-orange-600 text-center">
                Total: {result.totalArrangements} arrangements
              </p>
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="font-semibold mb-4">Controls</h3>
            <div className="space-y-4">
              <Slider
                label="Total Items"
                value={params.totalItems}
                min={3}
                max={10}
                onChange={(e) => onStateChange({
                  parameters: { ...params, totalItems: Number(e.target.value) }
                })}
              />
              <Slider
                label="Items in Group (must be adjacent)"
                value={params.groupItems}
                min={2}
                max={params.totalItems - 1}
                onChange={(e) => onStateChange({
                  parameters: { ...params, groupItems: Number(e.target.value) }
                })}
              />
            </div>

            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
              <h4 className="text-sm font-semibold text-orange-900 mb-1">Example</h4>
              <p className="text-xs text-orange-800">
                Arrange {params.totalItems} people where {params.groupItems} specific people must sit together
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const adjacentModule: VisualizationModule = {
  id: 'combinatorics.adjacent',
  name: 'Adjacent (Grouping)',
  description: 'Arrange items where specific objects MUST be together using the grouping method',
  syllabusRef: { strand: 'statistics-probability', topic: 'counting-principles' },
  engine: 'html',
  Component: AdjacentModule,
  getInitialState: () => {
    const result = calculateAdjacent({ totalItems: 5, groupItems: 2 });
    return {
      topicId: 'combinatorics.adjacent',
      parameters: { totalItems: 5, groupItems: 2 },
      inputs: {},
      computed: result as any,
      visualization: { showLabels: true },
    };
  },
  validateState: () => [],
  metadata: {
    version: '1.0.0',
    tags: ['combinatorics', 'permutations', 'restricted', 'adjacent', 'grouping'],
    difficulty: 'intermediate',
  },
};

moduleRegistry.register(adjacentModule);
export default adjacentModule;
