/**
 * Parallelogram Component
 *
 * Renders a semi-transparent parallelogram formed by two vectors.
 * Used to visualize the area interpretation of cross product.
 */

import { useMemo } from 'react';
import * as THREE from 'three';
import { ParallelogramProps } from './types';

const Parallelogram: React.FC<ParallelogramProps> = ({
  vectorA,
  vectorB,
  color = '#eab308',
  opacity = 0.3,
}) => {
  const geometry = useMemo(() => {
    // Four corners of parallelogram:
    // Origin (0,0,0), tip of A, tip of A+B, tip of B
    const vertices = new Float32Array([
      // Triangle 1: Origin, A, A+B
      0, 0, 0,
      vectorA.x, vectorA.y, vectorA.z,
      vectorA.x + vectorB.x, vectorA.y + vectorB.y, vectorA.z + vectorB.z,
      // Triangle 2: Origin, A+B, B
      0, 0, 0,
      vectorA.x + vectorB.x, vectorA.y + vectorB.y, vectorA.z + vectorB.z,
      vectorB.x, vectorB.y, vectorB.z,
    ]);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.computeVertexNormals();

    return geo;
  }, [vectorA, vectorB]);

  // Check if vectors are too small or parallel
  const area = Math.sqrt(
    Math.pow(vectorA.y * vectorB.z - vectorA.z * vectorB.y, 2) +
    Math.pow(vectorA.z * vectorB.x - vectorA.x * vectorB.z, 2) +
    Math.pow(vectorA.x * vectorB.y - vectorA.y * vectorB.x, 2)
  );

  if (area < 0.01) return null;

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

export default Parallelogram;
