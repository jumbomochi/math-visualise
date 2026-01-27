/**
 * CrossProductScene Component
 *
 * 3D visualization for cross product showing vectors, parallelogram, and result.
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line } from '@react-three/drei';
import VectorArrow from '../Vector3DOperations/VectorArrow';
import Parallelogram from './Parallelogram';
import { CrossProductSceneProps } from './types';
import { magnitude, roundTo } from '@/lib/math/vectors/operations';

// Axis colors
const AXIS_COLORS = {
  x: '#ef4444',
  y: '#22c55e',
  z: '#3b82f6',
};

// Vector colors
const VECTOR_COLORS = {
  a: '#f97316',
  b: '#06b6d4',
  cross: '#eab308',
};

interface AxesProps {
  size?: number;
}

const Axes: React.FC<AxesProps> = ({ size = 5 }) => {
  return (
    <group>
      <Line points={[[-size, 0, 0], [size, 0, 0]]} color={AXIS_COLORS.x} lineWidth={2} />
      <Text position={[size + 0.3, 0, 0]} fontSize={0.4} color={AXIS_COLORS.x} anchorX="left">
        x
      </Text>
      <Line points={[[0, -size, 0], [0, size, 0]]} color={AXIS_COLORS.y} lineWidth={2} />
      <Text position={[0, size + 0.3, 0]} fontSize={0.4} color={AXIS_COLORS.y} anchorY="bottom">
        y
      </Text>
      <Line points={[[0, 0, -size], [0, 0, size]]} color={AXIS_COLORS.z} lineWidth={2} />
      <Text position={[0, 0, size + 0.3]} fontSize={0.4} color={AXIS_COLORS.z}>
        z
      </Text>
    </group>
  );
};

const CrossProductScene: React.FC<CrossProductSceneProps> = ({
  vectorA,
  vectorB,
  crossResult,
}) => {
  const origin: [number, number, number] = [0, 0, 0];
  const endA: [number, number, number] = [vectorA.x, vectorA.y, vectorA.z];
  const endB: [number, number, number] = [vectorB.x, vectorB.y, vectorB.z];
  const endCross: [number, number, number] = [crossResult.x, crossResult.y, crossResult.z];

  const crossMag = magnitude(crossResult);
  const showCross = crossMag > 0.01;

  // Calculate area label position (center of parallelogram)
  const areaLabelPos: [number, number, number] = [
    (vectorA.x + vectorB.x) / 2,
    (vectorA.y + vectorB.y) / 2 + 0.3,
    (vectorA.z + vectorB.z) / 2,
  ];

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
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />

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

        <Axes size={5} />

        {/* Vector A */}
        <VectorArrow start={origin} end={endA} color={VECTOR_COLORS.a} label="a" />

        {/* Vector B */}
        <VectorArrow start={origin} end={endB} color={VECTOR_COLORS.b} label="b" />

        {/* Parallelogram */}
        <Parallelogram
          vectorA={vectorA}
          vectorB={vectorB}
          color={VECTOR_COLORS.cross}
          opacity={0.25}
        />

        {/* Area label on parallelogram */}
        {showCross && (
          <Text
            position={areaLabelPos}
            fontSize={0.25}
            color="#fcd34d"
            anchorX="center"
            anchorY="middle"
          >
            Area = {roundTo(crossMag, 2)}
          </Text>
        )}

        {/* Cross product result vector */}
        {showCross && (
          <VectorArrow
            start={origin}
            end={endCross}
            color={VECTOR_COLORS.cross}
            label="a × b"
            lineWidth={4}
          />
        )}

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

export default CrossProductScene;
