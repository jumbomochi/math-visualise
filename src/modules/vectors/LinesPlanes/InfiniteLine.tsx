/**
 * InfiniteLine Component
 *
 * Renders a line extending in both directions from a point along a direction vector.
 */

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { InfiniteLineProps } from './types';
import { linePointAt, magnitude } from '@/math/vectors/operations';

const InfiniteLine: React.FC<InfiniteLineProps> = ({
  point,
  direction,
  color = '#f97316',
  lineWidth = 3,
  range = 10,
}) => {
  const points = useMemo(() => {
    const mag = magnitude(direction);
    if (mag < 0.001) return null;

    // Extend line in both directions
    const start = linePointAt(point, direction, -range);
    const end = linePointAt(point, direction, range);

    return [
      [start.x, start.y, start.z] as [number, number, number],
      [end.x, end.y, end.z] as [number, number, number],
    ];
  }, [point, direction, range]);

  if (!points) return null;

  return (
    <Line
      points={points}
      color={color}
      lineWidth={lineWidth}
    />
  );
};

export default InfiniteLine;
