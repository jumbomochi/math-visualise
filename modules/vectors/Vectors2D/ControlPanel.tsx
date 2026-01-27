/**
 * ControlPanel Component
 *
 * Controls for 2D vectors module with main tabs and operation sub-tabs.
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import Slider from '@/components/ui/Slider';
import { MainTab, OperationSubTab } from './types';
import { Vector2D } from '@/lib/math/vectors/types';

const MAIN_TABS: { id: MainTab; label: string }[] = [
  { id: 'operations', label: 'Operations' },
  { id: 'dotProduct', label: 'Dot Product' },
];

const OP_TABS: { id: OperationSubTab; label: string }[] = [
  { id: 'add', label: 'Add' },
  { id: 'subtract', label: 'Subtract' },
  { id: 'scalar', label: 'Scalar' },
];

interface Vector2DSlidersProps {
  label: string;
  vector: Vector2D;
  onChange: (v: Vector2D) => void;
  color: string;
}

const Vector2DSliders: FC<Vector2DSlidersProps> = ({ label, vector, onChange, color }) => {
  const handleChange = (component: 'x' | 'y', value: number) => {
    onChange({ ...vector, [component]: value });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-medium text-gray-700 text-sm">{label}</span>
        <span className="text-xs text-gray-500 font-mono">
          ({vector.x}, {vector.y})
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Slider
          label="x"
          min={-5}
          max={5}
          step={0.5}
          value={vector.x}
          onChange={(e) => handleChange('x', parseFloat(e.target.value))}
        />
        <Slider
          label="y"
          min={-5}
          max={5}
          step={0.5}
          value={vector.y}
          onChange={(e) => handleChange('y', parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
};

interface ControlPanelProps {
  mainTab: MainTab;
  operationTab: OperationSubTab;
  vectorA: Vector2D;
  vectorB: Vector2D;
  scalar: number;
  onMainTabChange: (tab: MainTab) => void;
  onOperationTabChange: (tab: OperationSubTab) => void;
  onVectorAChange: (v: Vector2D) => void;
  onVectorBChange: (v: Vector2D) => void;
  onScalarChange: (k: number) => void;
}

const ControlPanel: FC<ControlPanelProps> = ({
  mainTab,
  operationTab,
  vectorA,
  vectorB,
  scalar,
  onMainTabChange,
  onOperationTabChange,
  onVectorAChange,
  onVectorBChange,
  onScalarChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Main tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        {MAIN_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onMainTabChange(tab.id)}
            className={`
              relative flex-1 py-2 px-4 text-sm font-medium rounded-md
              transition-colors duration-200
              ${mainTab === tab.id
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }
            `}
          >
            {mainTab === tab.id && (
              <motion.div
                layoutId="active2DMainTab"
                className="absolute inset-0 bg-purple-600 rounded-md"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Operation sub-tabs (only for operations main tab) */}
      {mainTab === 'operations' && (
        <div className="flex gap-1 p-1 bg-gray-50 rounded-lg">
          {OP_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onOperationTabChange(tab.id)}
              className={`
                relative flex-1 py-1.5 px-3 text-xs font-medium rounded
                transition-colors duration-200
                ${operationTab === tab.id
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              {operationTab === tab.id && (
                <motion.div
                  layoutId="active2DOpTab"
                  className="absolute inset-0 bg-purple-500 rounded"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Vector controls */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <Vector2DSliders
          label="Vector a"
          vector={vectorA}
          onChange={onVectorAChange}
          color="#f97316"
        />

        {/* Vector B - shown for add, subtract, and dot product */}
        {(mainTab === 'dotProduct' || operationTab !== 'scalar') && (
          <Vector2DSliders
            label="Vector b"
            vector={vectorB}
            onChange={onVectorBChange}
            color="#06b6d4"
          />
        )}

        {/* Scalar - only for scalar operation */}
        {mainTab === 'operations' && operationTab === 'scalar' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700 text-sm">Scalar k</span>
              <span className="text-xs text-gray-500 font-mono">= {scalar}</span>
            </div>
            <Slider
              label="k"
              min={-3}
              max={3}
              step={0.5}
              value={scalar}
              onChange={(e) => onScalarChange(parseFloat(e.target.value))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
