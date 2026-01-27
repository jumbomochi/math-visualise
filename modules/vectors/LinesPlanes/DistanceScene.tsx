/**
 * DistanceScene Component
 *
 * 3D visualization for point-to-plane distance.
 */

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line, Sphere } from '@react-three/drei';
import PlaneGrid from './PlaneGrid';
import { DistanceSceneProps } from './types';
import { footOfPerpendicular, pointToPlaneDistance, roundTo } from '@/lib/math/vectors/operations';

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

const DistanceScene: React.FC<DistanceSceneProps> = ({
  point,
  planePoint,
  planeNormal,
}) => {
  const { foot, distance } = useMemo(() => {
    const f = footOfPerpendicular(point, planePoint, planeNormal);
    const d = pointToPlaneDistance(point, planePoint, planeNormal);
    return { foot: f, distance: d };
  }, [point, planePoint, planeNormal]);

  const pointPos: [number, number, number] = [point.x, point.y, point.z];
  const footPos: [number, number, number] = [foot.x, foot.y, foot.z];

  // Midpoint for distance label
  const midPoint: [number, number, number] = [
    (point.x + foot.x) / 2 + 0.3,
    (point.y + foot.y) / 2 + 0.3,
    (point.z + foot.z) / 2,
  ];

  return (
    <div className="w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [10, 8, 10], fov: 50 }}>
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
          point={planePoint}
          normal={planeNormal}
          color="#06b6d4"
          opacity={0.25}
          size={6}
        />

        {/* Point P */}
        <Sphere args={[0.18]} position={pointPos}>
          <meshStandardMaterial color="#a855f7" />
        </Sphere>
        <Text
          position={[point.x + 0.3, point.y + 0.3, point.z]}
          fontSize={0.35}
          color="#a855f7"
          fontWeight="bold"
        >
          P
        </Text>

        {/* Foot of perpendicular */}
        <Sphere args={[0.15]} position={footPos}>
          <meshStandardMaterial color="#22c55e" />
        </Sphere>
        <Text
          position={[foot.x + 0.3, foot.y - 0.3, foot.z]}
          fontSize={0.3}
          color="#22c55e"
        >
          F
        </Text>

        {/* Perpendicular line */}
        <Line
          points={[pointPos, footPos]}
          color="#fbbf24"
          lineWidth={3}
          dashed
          dashSize={0.2}
          gapSize={0.1}
        />

        {/* Distance label */}
        <Text
          position={midPoint}
          fontSize={0.3}
          color="#fbbf24"
        >
          d = {roundTo(distance, 2)}
        </Text>

        <OrbitControls enablePan enableZoom enableRotate minDistance={5} maxDistance={30} />
      </Canvas>
    </div>
  );
};

export default DistanceScene;
