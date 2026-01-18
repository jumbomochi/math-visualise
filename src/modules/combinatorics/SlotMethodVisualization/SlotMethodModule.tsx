/**
 * Slot Method Module
 *
 * Main component for the slot method visualization.
 * Demonstrates the plug-and-play architecture by implementing
 * the VisualizationModuleProps interface.
 */

import { FC, useEffect, useState } from 'react';
import { VisualizationModuleProps } from '@/core/types/VisualizationModule';
import { SlotMethodState } from '@/core/types/MathState';
import { calculateSlotPermutations, SLOT_METHOD_EXAMPLES } from '@/math/combinatorics';
import P5SlotDiagram from './P5SlotDiagram';
import Controls from './Controls';
import Explanation from './Explanation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const SlotMethodModule: FC<VisualizationModuleProps> = ({
  mathState,
  onStateChange,
}) => {
  const state = mathState as SlotMethodState;
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentExampleId, setCurrentExampleId] = useState('student-photo');

  // Recalculate when parameters change
  useEffect(() => {
    const result = calculateSlotPermutations({
      totalItems: state.parameters.totalItems,
      totalPositions: state.parameters.positions,
      restrictions: state.parameters.restrictions,
    });

    onStateChange({
      computed: {
        totalArrangements: result.totalArrangements,
        slotsBreakdown: result.slots,
        formula: result.formula,
        formulaLatex: result.formulaLatex,
        explanation: result.steps,
      },
    });

    // Reset animation
    setAnimationStep(0);
    setIsAnimating(false);
  }, [state.parameters.totalItems, state.parameters.positions]);

  // Animation loop
  useEffect(() => {
    if (!isAnimating || !state.computed) return;

    const interval = setInterval(() => {
      setAnimationStep((prev) => {
        if (prev >= state.computed!.slotsBreakdown.length - 1) {
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isAnimating, state.computed]);

  const handleTotalItemsChange = (value: number) => {
    onStateChange({
      parameters: {
        ...state.parameters,
        totalItems: value,
        positions: Math.min(state.parameters.positions, value),
      },
    });
  };

  const handlePositionsChange = (value: number) => {
    onStateChange({
      parameters: {
        ...state.parameters,
        positions: value,
      },
    });
  };

  const handleReset = () => {
    onStateChange({
      parameters: {
        totalItems: 5,
        positions: 3,
      },
    });
    setAnimationStep(0);
    setIsAnimating(false);
  };

  const handleToggleAnimation = () => {
    if (isAnimating) {
      setIsAnimating(false);
    } else {
      setAnimationStep(0);
      setIsAnimating(true);
    }
  };

  const handleExampleChange = (exampleId: string) => {
    const example = SLOT_METHOD_EXAMPLES.find(ex => ex.id === exampleId);
    if (example) {
      setCurrentExampleId(exampleId);
      onStateChange({
        parameters: {
          totalItems: example.config.totalItems,
          positions: example.config.totalPositions,
        },
      });
      setAnimationStep(0);
      setIsAnimating(false);
    }
  };

  if (!state.computed) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const currentExample = SLOT_METHOD_EXAMPLES.find(ex => ex.id === currentExampleId) || SLOT_METHOD_EXAMPLES[0];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Slot Method for Permutations</h2>
        <p className="text-gray-600 mt-2">
          Visualize how to count arrangements using the slot filling method
        </p>
      </div>

      {/* Example Selector */}
      <Card>
        <h3 className="font-semibold mb-3">Real-Life Examples</h3>
        <div className="flex gap-2 flex-wrap">
          {SLOT_METHOD_EXAMPLES.map((example) => (
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-[1fr,320px] gap-6">
        {/* Visualization Area */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <P5SlotDiagram
              slots={state.computed.slotsBreakdown}
              animationStep={animationStep}
              highlightedSlot={isAnimating ? animationStep : -1}
            />
          </div>

          {/* Explanation */}
          <Explanation
            slots={state.computed.slotsBreakdown}
            formulaLatex={state.computed.formulaLatex}
            totalArrangements={state.computed.totalArrangements}
          />
        </div>

        {/* Controls Sidebar */}
        <div>
          <Controls
            totalItems={state.parameters.totalItems}
            positions={state.parameters.positions}
            onTotalItemsChange={handleTotalItemsChange}
            onPositionsChange={handlePositionsChange}
            onReset={handleReset}
            isAnimating={isAnimating}
            onToggleAnimation={handleToggleAnimation}
          />
        </div>
      </div>
    </div>
  );
};

export default SlotMethodModule;
