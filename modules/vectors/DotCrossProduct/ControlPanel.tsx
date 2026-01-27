/**
 * ControlPanel Component
 *
 * Tabs and sliders for dot/cross product module.
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import Slider from '@/components/ui/Slider';
import { ProductOperation } from './types';
import { Vector3D } from '@/lib/core/types';

const TABS: { id: ProductOperation; label: string }[] = [
  { id: 'dot', label: 'Dot Product' },
  { id: 'cross', label: 'Cross Product' },
];

interface VectorSlidersProps {
  label: string;
  vector: Vector3D;
  onChange: (v: Vector3D) => void;
  color: string;
}

const VectorSliders: FC<VectorSlidersProps> = ({ label, vector, onChange, color }) => {
  const handleChange = (component: 'x' | 'y' | 'z', value: number) => {
    onChange({ ...vector, [component]: value });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="font-semibold text-gray-700">{label}</span>
        <span className="text-sm text-gray-500 font-mono">
          ({vector.x}, {vector.y}, {vector.z})
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
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
        <Slider
          label="z"
          min={-5}
          max={5}
          step={0.5}
          value={vector.z}
          onChange={(e) => handleChange('z', parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
};

interface ControlPanelProps {
  operation: ProductOperation;
  vectorA: Vector3D;
  vectorB: Vector3D;
  onOperationChange: (op: ProductOperation) => void;
  onVectorAChange: (v: Vector3D) => void;
  onVectorBChange: (v: Vector3D) => void;
}

const ControlPanel: FC<ControlPanelProps> = ({
  operation,
  vectorA,
  vectorB,
  onOperationChange,
  onVectorAChange,
  onVectorBChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Operation tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onOperationChange(tab.id)}
            className={`
              relative flex-1 py-2 px-4 text-sm font-medium rounded-md
              transition-colors duration-200
              ${operation === tab.id
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }
            `}
          >
            {operation === tab.id && (
              <motion.div
                layoutId="activeProductTab"
                className="absolute inset-0 bg-purple-600 rounded-md"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Vector controls */}
      <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
        <VectorSliders
          label="Vector a"
          vector={vectorA}
          onChange={onVectorAChange}
          color="#f97316"
        />
        <VectorSliders
          label="Vector b"
          vector={vectorB}
          onChange={onVectorBChange}
          color="#06b6d4"
        />
      </div>
    </div>
  );
};

export default ControlPanel;
