/**
 * Slot Method Controls
 *
 * Input controls for the slot method visualization
 */

import { FC } from 'react';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface ControlsProps {
  totalItems: number;
  positions: number;
  onTotalItemsChange: (value: number) => void;
  onPositionsChange: (value: number) => void;
  onReset: () => void;
  isAnimating?: boolean;
  onToggleAnimation?: () => void;
}

const Controls: FC<ControlsProps> = ({
  totalItems,
  positions,
  onTotalItemsChange,
  onPositionsChange,
  onReset,
  isAnimating = false,
  onToggleAnimation,
}) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Controls</h3>

      <div className="space-y-6">
        {/* Total Items Slider */}
        <div className="control-group">
          <Slider
            label="Total Items (n)"
            value={totalItems}
            min={1}
            max={10}
            step={1}
            onChange={(e) => onTotalItemsChange(Number(e.target.value))}
            showValue
          />
          <p className="text-xs text-gray-500 mt-1">
            Total number of distinct items available
          </p>
        </div>

        {/* Positions Slider */}
        <div className="control-group">
          <Slider
            label="Positions (r)"
            value={positions}
            min={1}
            max={Math.min(totalItems, 10)}
            step={1}
            onChange={(e) => onPositionsChange(Number(e.target.value))}
            showValue
          />
          <p className="text-xs text-gray-500 mt-1">
            Number of positions to fill
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          {onToggleAnimation && (
            <Button
              variant="primary"
              className="w-full"
              onClick={onToggleAnimation}
            >
              {isAnimating ? 'Pause Animation' : 'Play Animation'}
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={onReset}
          >
            Reset
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            About the Slot Method
          </h4>
          <p className="text-xs text-blue-800">
            The slot method helps count arrangements by considering each position
            separately. For each position (slot), count how many choices are
            available, then multiply all the choices together.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Controls;
