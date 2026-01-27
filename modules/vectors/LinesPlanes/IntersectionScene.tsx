/**
 * IntersectionScene Component
 *
 * 3D visualization for line-plane intersection.
 */

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line, Sphere } from '@react-three/drei';
import VectorArrow from '../Vector3DOperations/VectorArrow';
import InfiniteLine from './InfiniteLine';
import PlaneGrid from './PlaneGrid';
import { IntersectionSceneProps } from './types';
import { linePlaneIntersection } from '@/lib/math/vectors/operations';

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

const IntersectionScene: React.FC<IntersectionSceneProps> = ({
  linePoint,
  lineDirection,
  planePoint,
  planeNormal,
}) => {
  const intersection = useMemo(
    () => linePlaneIntersection(linePoint, lineDirection, planePoint, planeNormal),
    [linePoint, lineDirection, planePoint, planeNormal]
  );

  const linePointPos: [number, number, number] = [linePoint.x, linePoint.y, linePoint.z];
  const lineDirEnd: [number, number, number] = [
    linePoint.x + lineDirection.x,
    linePoint.y + lineDirection.y,
    linePoint.z + lineDirection.z,
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
          opacity={0.2}
          size={6}
        />

        {/* Line point A */}
        <Sphere args={[0.12]} position={linePointPos}>
          <meshStandardMaterial color="#f97316" />
        </Sphere>
        <Text
          position={[linePoint.x + 0.25, linePoint.y + 0.25, linePoint.z]}
          fontSize={0.3}
          color="#f97316"
        >
          A
        </Text>

        {/* Direction vector */}
        <VectorArrow
          start={linePointPos}
          end={lineDirEnd}
          color="#f97316"
          label="d"
          lineWidth={2}
        />

        {/* The infinite line */}
        <InfiniteLine
          point={linePoint}
          direction={lineDirection}
          color="#fbbf24"
          lineWidth={2}
          range={8}
        />

        {/* Intersection point */}
        {intersection && (
          <>
            <Sphere
              args={[0.2]}
              position={[intersection.point.x, intersection.point.y, intersection.point.z]}
            >
              <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
            </Sphere>
            <Text
              position={[
                intersection.point.x + 0.3,
                intersection.point.y + 0.3,
                intersection.point.z,
              ]}
              fontSize={0.35}
              color="#22c55e"
              fontWeight="bold"
            >
              P
            </Text>
          </>
        )}

        <OrbitControls enablePan enableZoom enableRotate minDistance={5} maxDistance={30} />
      </Canvas>
    </div>
  );
};

export default IntersectionScene;
