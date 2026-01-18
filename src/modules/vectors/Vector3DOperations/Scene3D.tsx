/**
 * Scene3D Component
 *
 * Three.js scene containing coordinate system, grid, and vector visualizations.
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line } from '@react-three/drei';
import VectorArrow from './VectorArrow';
import { Scene3DProps, VectorOperation } from './types';
import { Vector3D } from '@/core/types';

// Axis colors (standard convention)
const AXIS_COLORS = {
  x: '#ef4444', // red
  y: '#22c55e', // green
  z: '#3b82f6', // blue
};

// Vector colors
const VECTOR_COLORS = {
  a: '#f97316', // orange
  b: '#06b6d4', // cyan
  result: '#eab308', // yellow/gold
  negB: '#06b6d4', // cyan (for -b in subtraction)
};

interface AxesProps {
  size?: number;
}

const Axes: React.FC<AxesProps> = ({ size = 5 }) => {
  return (
    <group>
      {/* X axis */}
      <Line
        points={[[-size, 0, 0], [size, 0, 0]]}
        color={AXIS_COLORS.x}
        lineWidth={2}
      />
      <Text
        position={[size + 0.3, 0, 0]}
        fontSize={0.4}
        color={AXIS_COLORS.x}
        anchorX="left"
      >
        x
      </Text>

      {/* Y axis */}
      <Line
        points={[[0, -size, 0], [0, size, 0]]}
        color={AXIS_COLORS.y}
        lineWidth={2}
      />
      <Text
        position={[0, size + 0.3, 0]}
        fontSize={0.4}
        color={AXIS_COLORS.y}
        anchorY="bottom"
      >
        y
      </Text>

      {/* Z axis */}
      <Line
        points={[[0, 0, -size], [0, 0, size]]}
        color={AXIS_COLORS.z}
        lineWidth={2}
      />
      <Text
        position={[0, 0, size + 0.3]}
        fontSize={0.4}
        color={AXIS_COLORS.z}
      >
        z
      </Text>
    </group>
  );
};

interface VectorVisualizationProps {
  operation: VectorOperation;
  vectorA: Vector3D;
  vectorB: Vector3D;
  scalar: number;
  result: Vector3D;
}

const VectorVisualization: React.FC<VectorVisualizationProps> = ({
  operation,
  vectorA,
  vectorB,
  scalar,
  result,
}) => {
  const origin: [number, number, number] = [0, 0, 0];
  const endA: [number, number, number] = [vectorA.x, vectorA.y, vectorA.z];
  const endB: [number, number, number] = [vectorB.x, vectorB.y, vectorB.z];
  const endResult: [number, number, number] = [result.x, result.y, result.z];

  if (operation === 'addition') {
    // Show parallelogram law: a from origin, b from tip of a, result from origin
    const bFromA: [number, number, number] = [
      vectorA.x + vectorB.x,
      vectorA.y + vectorB.y,
      vectorA.z + vectorB.z,
    ];

    return (
      <group>
        {/* Vector A from origin */}
        <VectorArrow start={origin} end={endA} color={VECTOR_COLORS.a} label="a" />

        {/* Vector B from tip of A (parallelogram law) */}
        <VectorArrow start={endA} end={bFromA} color={VECTOR_COLORS.b} label="b" />

        {/* Result vector from origin */}
        <VectorArrow
          start={origin}
          end={endResult}
          color={VECTOR_COLORS.result}
          label="a + b"
          lineWidth={4}
        />
      </group>
    );
  }

  if (operation === 'subtraction') {
    // Show a, -b, and result (a - b)
    const negB: [number, number, number] = [-vectorB.x, -vectorB.y, -vectorB.z];

    return (
      <group>
        {/* Vector A from origin */}
        <VectorArrow start={origin} end={endA} color={VECTOR_COLORS.a} label="a" />

        {/* Vector B (shown faded/dashed) */}
        <VectorArrow
          start={origin}
          end={endB}
          color={VECTOR_COLORS.b}
          label="b"
          dashed
          lineWidth={2}
        />

        {/* -B vector */}
        <VectorArrow
          start={origin}
          end={negB}
          color={VECTOR_COLORS.negB}
          label="-b"
        />

        {/* Result vector (a - b) */}
        <VectorArrow
          start={origin}
          end={endResult}
          color={VECTOR_COLORS.result}
          label="a - b"
          lineWidth={4}
        />
      </group>
    );
  }

  if (operation === 'scalar') {
    // Show original vector and scaled version
    return (
      <group>
        {/* Original Vector A (dashed for reference) */}
        <VectorArrow
          start={origin}
          end={endA}
          color={VECTOR_COLORS.a}
          label="a"
          dashed
          lineWidth={2}
        />

        {/* Scaled result */}
        <VectorArrow
          start={origin}
          end={endResult}
          color={VECTOR_COLORS.result}
          label={`${scalar}a`}
          lineWidth={4}
        />
      </group>
    );
  }

  return null;
};

const Scene3D: React.FC<Scene3DProps> = ({
  operation,
  vectorA,
  vectorB,
  scalar,
  result,
}) => {
  return (
    <div className="w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden">
      <Canvas
        camera={{
          position: [8, 6, 8],
          fov: 50,
          near: 0.1,
          far: 100,
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />

        {/* Grid on XZ plane */}
        <Grid
          args={[10, 10]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#4b5563"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#6b7280"
          fadeDistance={25}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
        />

        {/* Coordinate axes */}
        <Axes size={5} />

        {/* Vector visualization based on operation */}
        <VectorVisualization
          operation={operation}
          vectorA={vectorA}
          vectorB={vectorB}
          scalar={scalar}
          result={result}
        />

        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
        />
      </Canvas>
    </div>
  );
};

export default Scene3D;
