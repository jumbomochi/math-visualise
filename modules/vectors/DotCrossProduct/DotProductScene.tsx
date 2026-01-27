/**
 * DotProductScene Component
 *
 * 3D visualization for dot product showing vectors, projection, and angle.
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line } from '@react-three/drei';
import VectorArrow from '../Vector3DOperations/VectorArrow';
import AngleArc from './AngleArc';
import { DotProductSceneProps } from './types';
import { magnitude } from '@/lib/math/vectors/operations';

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
  projection: '#a3e635',
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

const DotProductScene: React.FC<DotProductSceneProps> = ({
  vectorA,
  vectorB,
  projection,
}) => {
  const origin: [number, number, number] = [0, 0, 0];
  const endA: [number, number, number] = [vectorA.x, vectorA.y, vectorA.z];
  const endB: [number, number, number] = [vectorB.x, vectorB.y, vectorB.z];
  const endProj: [number, number, number] = [projection.x, projection.y, projection.z];

  const magA = magnitude(vectorA);
  const magB = magnitude(vectorB);
  const showProjection = magA > 0.1 && magB > 0.1;

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

        {/* Projection of A onto B */}
        {showProjection && magnitude(projection) > 0.01 && (
          <>
            {/* Projection vector (dashed) */}
            <VectorArrow
              start={origin}
              end={endProj}
              color={VECTOR_COLORS.projection}
              label="proj"
              dashed
              lineWidth={2}
            />

            {/* Dashed line from tip of A to projection point */}
            <Line
              points={[endA, endProj]}
              color="#9ca3af"
              lineWidth={1}
              dashed
              dashSize={0.15}
              gapSize={0.1}
            />
          </>
        )}

        {/* Angle arc */}
        {showProjection && (
          <AngleArc
            vectorA={vectorA}
            vectorB={vectorB}
            radius={0.8}
            color="#fbbf24"
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

export default DotProductScene;
