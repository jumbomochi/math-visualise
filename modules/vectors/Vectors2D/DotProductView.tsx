/**
 * DotProductView Component
 *
 * SVG visualization for 2D dot product with angle and projection.
 */

import { FC, useMemo } from 'react';
import Canvas2D from './Canvas2D';
import VectorArrow2D from './VectorArrow2D';
import { DotProductViewProps } from './types';
import { Vector2D } from '@/lib/math/vectors/types';
import { magnitude2D, radToDeg, roundTo } from '@/lib/math/vectors/operations';

const COLORS = {
  a: '#f97316',
  b: '#06b6d4',
  projection: '#a3e635',
  arc: '#fbbf24',
};

const DotProductView: FC<DotProductViewProps> = ({
  vectorA,
  vectorB,
  projection,
  angle,
}) => {
  const origin: Vector2D = { x: 0, y: 0 };

  const magA = magnitude2D(vectorA);
  const magB = magnitude2D(vectorB);
  const showProjection = magA > 0.1 && magB > 0.1;

  // Generate arc path for angle visualization
  const arcPath = useMemo(() => {
    if (!showProjection) return '';

    const radius = 0.8;
    const angleA = Math.atan2(vectorA.y, vectorA.x);
    const angleB = Math.atan2(vectorB.y, vectorB.x);

    // Determine start and end angles
    let startAngle = Math.min(angleA, angleB);
    let endAngle = Math.max(angleA, angleB);

    // Handle case where arc should go the "short way"
    if (endAngle - startAngle > Math.PI) {
      const temp = startAngle;
      startAngle = endAngle;
      endAngle = temp + 2 * Math.PI;
    }

    const startX = radius * Math.cos(startAngle);
    const startY = radius * Math.sin(startAngle);
    const endX = radius * Math.cos(endAngle);
    const endY = radius * Math.sin(endAngle);

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;
  }, [vectorA, vectorB, showProjection]);

  // Angle label position
  const angleLabelPos = useMemo(() => {
    if (!showProjection) return { x: 0, y: 0 };
    const midAngle = (Math.atan2(vectorA.y, vectorA.x) + Math.atan2(vectorB.y, vectorB.x)) / 2;
    return {
      x: 1.2 * Math.cos(midAngle),
      y: 1.2 * Math.sin(midAngle),
    };
  }, [vectorA, vectorB, showProjection]);

  const angleDeg = roundTo(radToDeg(angle), 1);

  return (
    <div className="flex justify-center">
      <Canvas2D width={400} height={400} range={6}>
        {/* Vector A */}
        <VectorArrow2D
          start={origin}
          end={vectorA}
          color={COLORS.a}
          label="a"
        />

        {/* Vector B */}
        <VectorArrow2D
          start={origin}
          end={vectorB}
          color={COLORS.b}
          label="b"
        />

        {/* Projection of A onto B */}
        {showProjection && magnitude2D(projection) > 0.01 && (
          <>
            <VectorArrow2D
              start={origin}
              end={projection}
              color={COLORS.projection}
              label="proj"
              dashed
              strokeWidth={2}
            />
            {/* Dashed line from tip of A to projection */}
            <line
              x1={vectorA.x}
              y1={vectorA.y}
              x2={projection.x}
              y2={projection.y}
              stroke="#9ca3af"
              strokeWidth={0.05}
              strokeDasharray="0.15 0.08"
            />
          </>
        )}

        {/* Angle arc */}
        {showProjection && arcPath && (
          <path
            d={arcPath}
            fill="none"
            stroke={COLORS.arc}
            strokeWidth={0.06}
          />
        )}

        {/* Angle label */}
        {showProjection && (
          <text
            x={angleLabelPos.x}
            y={angleLabelPos.y}
            fill={COLORS.arc}
            fontSize={0.35}
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`scale(1, -1) translate(0, ${-2 * angleLabelPos.y})`}
          >
            {angleDeg}°
          </text>
        )}
      </Canvas2D>
    </div>
  );
};

export default DotProductView;
