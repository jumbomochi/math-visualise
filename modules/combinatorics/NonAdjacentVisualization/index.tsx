/**
 * Non-Adjacent Arrangement Visualization (Slotting Method)
 */

import { VisualizationModule } from '@/lib/core/types/VisualizationModule';
import { moduleRegistry } from '@/lib/core/registry/ModuleRegistry';
import { FC, useEffect, useState } from 'react';
import { VisualizationModuleProps } from '@/lib/core/types/VisualizationModule';
import { calculateNonAdjacent, NON_ADJACENT_EXAMPLES } from '@/lib/math/combinatorics';
import Card from '@/components/ui/Card';
import Slider from '@/components/ui/Slider';
import MathDisplay from '@/components/ui/MathDisplay';
import Button from '@/components/ui/Button';

const NonAdjacentModule: FC<VisualizationModuleProps> = ({ mathState, onStateChange }) => {
  const params = mathState.parameters as { totalItems: number; restrictedItems: number };
  const result = mathState.computed as any;
  const [currentExampleId, setCurrentExampleId] = useState('couple-seating');

  useEffect(() => {
    try {
      const computed = calculateNonAdjacent({
        totalItems: params.totalItems,
        restrictedItems: params.restrictedItems,
      });
      onStateChange({ computed: computed as any });
    } catch (error: any) {
      onStateChange({ computed: { error: error.message } as any });
    }
  }, [params.totalItems, params.restrictedItems]);

  const handleExampleChange = (exampleId: string) => {
    const example = NON_ADJACENT_EXAMPLES.find(ex => ex.id === exampleId);
    if (example) {
      setCurrentExampleId(exampleId);
      onStateChange({
        parameters: {
          totalItems: example.config.totalItems,
          restrictedItems: example.config.restrictedItems,
        },
      });
    }
  };

  if (!result) return <div>Loading</div>;
  if (result.error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-2 border-red-300 rounded p-4 text-red-800">
          <strong>Error:</strong> {result.error}
        </div>
      </div>
    );
  }

  const normalItems = params.totalItems - params.restrictedItems;
  const currentExample = NON_ADJACENT_EXAMPLES.find(ex => ex.id === currentExampleId) || NON_ADJACENT_EXAMPLES[0];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Non-Adjacent Arrangements (Slotting Method)</h2>
        <p className="text-gray-600 mt-2">When specific items CANNOT be next to each other</p>
      </div>

      {/* Example Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Real-Life Examples</h3>
        <div className="flex gap-2 flex-wrap">
          {NON_ADJACENT_EXAMPLES.map((example) => (
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
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-purple-900">{currentExample.title}</h3>
          <div className="bg-white border-l-4 border-purple-500 p-4 rounded">
            <p className="font-semibold text-purple-900 mb-2">Question:</p>
            <div className="text-gray-800 space-y-2">
              <p>{currentExample.context}</p>
              <p className="font-medium">{currentExample.question}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-[1fr,320px] gap-6">
        <div className="space-y-6">
          {/* Visualization */}
          <Card className="bg-purple-50">
            <h3 className="font-semibold mb-4">Step 1: Arrange Normal Items</h3>
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: normalItems }).map((_, i) => (
                <div key={i} className="w-16 h-16 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
                  N{i + 1}
                </div>
              ))}
            </div>
            <p className="text-center text-sm">Arrange {normalItems} normal items: {normalItems}! ways</p>
          </Card>

          <Card className="bg-purple-50">
            <h3 className="font-semibold mb-4">Step 2: Identify Gaps</h3>
            <div className="flex justify-center items-center gap-1">
              <div className="w-8 h-8 bg-yellow-300 rounded flex items-center justify-center text-xs">_</div>
              {Array.from({ length: normalItems }).map((_, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="w-16 h-16 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
                    N{i + 1}
                  </div>
                  <div className="w-8 h-8 bg-yellow-300 rounded flex items-center justify-center text-xs">_</div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm mt-4">Creates {result.visualization.gaps} gaps for restricted items</p>
          </Card>

          <Card className="bg-purple-50">
            <h3 className="font-semibold mb-4">Step 3: Place Restricted Items in Gaps</h3>
            <p className="text-center text-sm">Choose {params.restrictedItems} gaps from {result.visualization.gaps} available gaps</p>
            <p className="text-center text-lg font-bold text-purple-600 mt-2">
              P({result.visualization.gaps}, {params.restrictedItems}) ways
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-3">Final Answer</h3>
            <div className="bg-white border-2 border-purple-200 rounded p-4 text-center">
              <MathDisplay math={result.formulaLatex} display="block" />
            </div>
            <div className="mt-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded p-4">
              <p className="text-2xl font-bold text-purple-600 text-center">
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
                label="Restricted Items (cannot be adjacent)"
                value={params.restrictedItems}
                min={2}
                max={params.totalItems - 1}
                onChange={(e) => onStateChange({
                  parameters: { ...params, restrictedItems: Number(e.target.value) }
                })}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const nonAdjacentModule: VisualizationModule = {
  id: 'combinatorics.non-adjacent',
  name: 'Non-Adjacent (Slotting)',
  description: 'Arrange items where specific objects CANNOT be next to each other using the slotting method',
  syllabusRef: { strand: 'statistics-probability', topic: 'counting-principles' },
  engine: 'html',
  Component: NonAdjacentModule,
  getInitialState: () => {
    const result = calculateNonAdjacent({ totalItems: 5, restrictedItems: 2 });
    return {
      topicId: 'combinatorics.non-adjacent',
      parameters: { totalItems: 5, restrictedItems: 2 },
      inputs: {},
      computed: result as any,
      visualization: { showLabels: true },
    };
  },
  validateState: () => [],
  metadata: {
    version: '1.0.0',
    tags: ['combinatorics', 'permutations', 'restricted', 'non-adjacent', 'slotting'],
    difficulty: 'intermediate',
  },
};

moduleRegistry.register(nonAdjacentModule);
export default nonAdjacentModule;
