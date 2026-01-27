/**
 * PlaneScene Component
 *
 * 3D visualization for a plane defined by point and normal vector.
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line, Sphere } from '@react-three/drei';
import VectorArrow from '../Vector3DOperations/VectorArrow';
import PlaneGrid from './PlaneGrid';
import { PlaneSceneProps } from './types';

const AXIS_COLORS = { x: '#ef4444', y: '#22c55e', z: '#3b82f6' };

const Axes: React.FC<{ size?: number }> = ({ size = 5 }) => (
  <group>
    <Line points={[[-size, 0, 0], [size, 0, 0]]} color={AXIS_COLORS.x} lineWidth={2} />
    <Text position={[size + 0.3, 0, 0]} fontSize={0.4} color={AXIS_COLORS.x} anchorX="left">x</Text>
    <Line points={[[0, -size, 0], [0, size, 0]]} color={AXIS_COLORS.y} lineWidth={2} />
    <Text position={[0, size + 0.3, 0]} fontSize={0.4} color={AXIS_COLORS.y} anchorY="bottom">y</Text>
    <Line points={[[0, 0, -size], [0, 0, size]]} color={AXIS_COLORS.z} lineWidth={2} />
    <Text position={[0, 0, size + 0.3]} fontSize={0.4} color={AXIS_COLORS.z}>z</Text>
  </group>
);

const PlaneScene: React.FC<PlaneSceneProps> = ({ point, normal }) => {
  const pointPos: [number, number, number] = [point.x, point.y, point.z];
  const normalEnd: [number, number, number] = [
    point.x + normal.x,
    point.y + normal.y,
    point.z + normal.z,
  ];

  return (
    <div className="w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [8, 6, 8], fov: 50 }}>
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
          followCamera={false}
          infiniteGrid={false}
        />

        <Axes size={5} />

        {/* The plane */}
        <PlaneGrid
          point={point}
          normal={normal}
          color="#06b6d4"
          opacity={0.25}
          size={6}
        />

        {/* Point A on plane */}
        <Sphere args={[0.15]} position={pointPos}>
          <meshStandardMaterial color="#f97316" />
        </Sphere>
        <Text
          position={[point.x + 0.3, point.y + 0.3, point.z]}
          fontSize={0.35}
          color="#f97316"
        >
          A
        </Text>

        {/* Normal vector */}
        <VectorArrow
          start={pointPos}
          end={normalEnd}
          color="#eab308"
          label="n"
        />

        <OrbitControls enablePan enableZoom enableRotate minDistance={5} maxDistance={30} />
      </Canvas>
    </div>
  );
};

export default PlaneScene;
