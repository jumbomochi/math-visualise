/**
 * VectorArrow Component
 *
 * Renders a 3D arrow representing a vector using Three.js.
 * Includes shaft (line or cylinder) and arrowhead (cone).
 */

import { useMemo } from 'react';
import { Line, Cone, Text } from '@react-three/drei';
import * as THREE from 'three';
import { VectorArrowProps } from './types';

const VectorArrow: React.FC<VectorArrowProps> = ({
  start,
  end,
  color,
  label,
  dashed = false,
  lineWidth = 3,
}) => {
  const { direction, length, midpoint, conePosition, coneRotation } = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const dir = new THREE.Vector3().subVectors(endVec, startVec);
    const len = dir.length();

    if (len === 0) {
      return {
        direction: new THREE.Vector3(0, 1, 0),
        length: 0,
        midpoint: start,
        conePosition: end,
        coneRotation: new THREE.Euler(0, 0, 0),
      };
    }

    dir.normalize();

    // Cone size proportional to length but capped
    const coneHeight = Math.min(0.3, len * 0.15);

    // Position cone at the end, pulled back by cone height
    const conePos = new THREE.Vector3()
      .copy(endVec)
      .sub(dir.clone().multiplyScalar(coneHeight / 2));

    // Calculate rotation to align cone with direction
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    const euler = new THREE.Euler().setFromQuaternion(quaternion);

    // Midpoint for label
    const mid: [number, number, number] = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2,
    ];

    return {
      direction: dir,
      length: len,
      midpoint: mid,
      conePosition: [conePos.x, conePos.y, conePos.z] as [number, number, number],
      coneRotation: euler,
    };
  }, [start, end]);

  const coneHeight = Math.min(0.3, length * 0.15);
  const coneRadius = coneHeight * 0.4;

  // Adjust line end to not overlap with cone
  const lineEnd = useMemo(() => {
    if (length === 0) {
      return end;
    }
    const endVec = new THREE.Vector3(...end);
    const adjusted = endVec.sub(direction.clone().multiplyScalar(coneHeight));
    return [adjusted.x, adjusted.y, adjusted.z] as [number, number, number];
  }, [end, direction, coneHeight, length]);

  // Don't render if vector has zero length
  if (length === 0) {
    return null;
  }

  return (
    <group>
      {/* Vector shaft */}
      <Line
        points={[start, lineEnd]}
        color={color}
        lineWidth={lineWidth}
        dashed={dashed}
        dashSize={0.2}
        gapSize={0.1}
      />

      {/* Arrowhead */}
      <Cone
        args={[coneRadius, coneHeight, 8]}
        position={conePosition}
        rotation={coneRotation}
      >
        <meshStandardMaterial color={color} />
      </Cone>

      {/* Label */}
      {label && (
        <Text
          position={[midpoint[0] + 0.3, midpoint[1] + 0.3, midpoint[2] + 0.3]}
          fontSize={0.35}
          color={color}
          anchorX="left"
          anchorY="middle"
          fontWeight="bold"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

export default VectorArrow;
