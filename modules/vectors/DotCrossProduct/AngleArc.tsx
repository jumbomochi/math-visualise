/**
 * AngleArc Component
 *
 * Renders an arc showing the angle between two vectors.
 */

import { useMemo } from 'react';
import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { AngleArcProps } from './types';
import { magnitude, radToDeg, roundTo } from '@/lib/math/vectors/operations';

const AngleArc: React.FC<AngleArcProps> = ({
  vectorA,
  vectorB,
  radius = 0.8,
  color = '#22c55e',
}) => {
  const { points, labelPosition, angleDeg } = useMemo(() => {
    const a = new THREE.Vector3(vectorA.x, vectorA.y, vectorA.z);
    const b = new THREE.Vector3(vectorB.x, vectorB.y, vectorB.z);

    const magA = magnitude(vectorA);
    const magB = magnitude(vectorB);

    // Handle zero vectors
    if (magA === 0 || magB === 0) {
      return { points: [], labelPosition: [0, 0, 0] as [number, number, number], angleDeg: 0 };
    }

    // Normalize vectors
    const aNorm = a.clone().normalize();
    const bNorm = b.clone().normalize();

    // Calculate angle
    const dot = aNorm.dot(bNorm);
    const angleRad = Math.acos(Math.max(-1, Math.min(1, dot)));
    const deg = roundTo(radToDeg(angleRad), 1);

    // Generate arc points
    const segments = 32;
    const arcPoints: [number, number, number][] = [];

    // Create rotation axis (perpendicular to both vectors)
    const axis = new THREE.Vector3().crossVectors(aNorm, bNorm);

    if (axis.length() < 0.001) {
      // Vectors are parallel or anti-parallel
      return { points: [], labelPosition: [0, 0, 0] as [number, number, number], angleDeg: deg };
    }

    axis.normalize();

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * angleRad;

      // Rotate aNorm around axis by angle
      const point = aNorm.clone().applyAxisAngle(axis, angle).multiplyScalar(radius);
      arcPoints.push([point.x, point.y, point.z]);
    }

    // Label position at middle of arc
    const midAngle = angleRad / 2;
    const labelVec = aNorm.clone().applyAxisAngle(axis, midAngle).multiplyScalar(radius + 0.4);

    return {
      points: arcPoints,
      labelPosition: [labelVec.x, labelVec.y, labelVec.z] as [number, number, number],
      angleDeg: deg,
    };
  }, [vectorA, vectorB, radius]);

  if (points.length === 0) return null;

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={2}
      />
      <Text
        position={labelPosition}
        fontSize={0.3}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {angleDeg}°
      </Text>
    </group>
  );
};

export default AngleArc;
