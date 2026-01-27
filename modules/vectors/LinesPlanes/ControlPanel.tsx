/**
 * ControlPanel Component
 *
 * Tab-aware controls for Lines & Planes module.
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import Slider from '@/components/ui/Slider';
import { LinesPlanesTab } from './types';
import { Vector3D } from '@/lib/core/types';

const TABS: { id: LinesPlanesTab; label: string }[] = [
  { id: 'line', label: 'Line' },
  { id: 'plane', label: 'Plane' },
  { id: 'intersection', label: 'Intersection' },
  { id: 'distance', label: 'Distance' },
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
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-medium text-gray-700 text-sm">{label}</span>
        <span className="text-xs text-gray-500 font-mono">
          ({vector.x}, {vector.y}, {vector.z})
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
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
  activeTab: LinesPlanesTab;
  linePoint: Vector3D;
  lineDirection: Vector3D;
  planePoint: Vector3D;
  planeNormal: Vector3D;
  distancePoint: Vector3D;
  onTabChange: (tab: LinesPlanesTab) => void;
  onLinePointChange: (v: Vector3D) => void;
  onLineDirectionChange: (v: Vector3D) => void;
  onPlanePointChange: (v: Vector3D) => void;
  onPlaneNormalChange: (v: Vector3D) => void;
  onDistancePointChange: (v: Vector3D) => void;
}

const ControlPanel: FC<ControlPanelProps> = ({
  activeTab,
  linePoint,
  lineDirection,
  planePoint,
  planeNormal,
  distancePoint,
  onTabChange,
  onLinePointChange,
  onLineDirectionChange,
  onPlanePointChange,
  onPlaneNormalChange,
  onDistancePointChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative flex-1 py-2 px-2 text-xs font-medium rounded-md
              transition-colors duration-200
              ${activeTab === tab.id
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }
            `}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeLinesPlanesTab"
                className="absolute inset-0 bg-purple-600 rounded-md"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Controls based on active tab */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        {activeTab === 'line' && (
          <>
            <VectorSliders
              label="Point A"
              vector={linePoint}
              onChange={onLinePointChange}
              color="#f97316"
            />
            <VectorSliders
              label="Direction d"
              vector={lineDirection}
              onChange={onLineDirectionChange}
              color="#06b6d4"
            />
          </>
        )}

        {activeTab === 'plane' && (
          <>
            <VectorSliders
              label="Point A"
              vector={planePoint}
              onChange={onPlanePointChange}
              color="#f97316"
            />
            <VectorSliders
              label="Normal n"
              vector={planeNormal}
              onChange={onPlaneNormalChange}
              color="#eab308"
            />
          </>
        )}

        {activeTab === 'intersection' && (
          <>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Line</div>
            <VectorSliders
              label="Point A"
              vector={linePoint}
              onChange={onLinePointChange}
              color="#f97316"
            />
            <VectorSliders
              label="Direction d"
              vector={lineDirection}
              onChange={onLineDirectionChange}
              color="#f97316"
            />
            <div className="border-t border-gray-200 my-3" />
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Plane</div>
            <VectorSliders
              label="Point B"
              vector={planePoint}
              onChange={onPlanePointChange}
              color="#06b6d4"
            />
            <VectorSliders
              label="Normal n"
              vector={planeNormal}
              onChange={onPlaneNormalChange}
              color="#06b6d4"
            />
          </>
        )}

        {activeTab === 'distance' && (
          <>
            <VectorSliders
              label="Point P"
              vector={distancePoint}
              onChange={onDistancePointChange}
              color="#a855f7"
            />
            <div className="border-t border-gray-200 my-3" />
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Plane</div>
            <VectorSliders
              label="Point A"
              vector={planePoint}
              onChange={onPlanePointChange}
              color="#06b6d4"
            />
            <VectorSliders
              label="Normal n"
              vector={planeNormal}
              onChange={onPlaneNormalChange}
              color="#06b6d4"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
