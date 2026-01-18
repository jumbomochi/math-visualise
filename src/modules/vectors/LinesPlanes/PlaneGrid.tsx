/**
 * PlaneGrid Component
 *
 * Renders a semi-transparent plane with grid lines.
 */

import { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { PlaneGridProps } from './types';
import { magnitude } from '@/math/vectors/operations';

const PlaneGrid: React.FC<PlaneGridProps> = ({
  point,
  normal,
  color = '#06b6d4',
  opacity = 0.3,
  size = 8,
}) => {
  const { geometry, rotation, gridLines } = useMemo(() => {
    const mag = magnitude(normal);
    if (mag < 0.001) return { geometry: null, rotation: null, gridLines: [] };

    // Normalize the normal vector
    const n = new THREE.Vector3(normal.x / mag, normal.y / mag, normal.z / mag);

    // Create rotation to align plane with normal
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
    const euler = new THREE.Euler().setFromQuaternion(quaternion);

    // Create plane geometry
    const geo = new THREE.PlaneGeometry(size * 2, size * 2);

    // Generate grid lines in local plane coordinates
    const lines: [number, number, number][][] = [];
    const halfSize = size;
    const step = 1;

    // We'll create grid lines and transform them
    for (let i = -halfSize; i <= halfSize; i += step) {
      // Horizontal lines (in local coords)
      lines.push([
        [-halfSize, i, 0],
        [halfSize, i, 0],
      ]);
      // Vertical lines
      lines.push([
        [i, -halfSize, 0],
        [i, halfSize, 0],
      ]);
    }

    return { geometry: geo, rotation: euler, gridLines: lines };
  }, [normal, size]);

  if (!geometry || !rotation) return null;

  const p = new THREE.Vector3(point.x, point.y, point.z);

  return (
    <group position={p} rotation={rotation}>
      {/* Semi-transparent plane */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Grid lines */}
      {gridLines.map((line, i) => (
        <Line
          key={i}
          points={line}
          color={color}
          lineWidth={1}
          transparent
          opacity={0.5}
        />
      ))}
    </group>
  );
};

export default PlaneGrid;
