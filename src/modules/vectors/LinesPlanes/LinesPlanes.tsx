/**
 * LinesPlanes Component
 *
 * Main component for the Lines & Planes visualization module.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import LineScene from './LineScene';
import PlaneScene from './PlaneScene';
import IntersectionScene from './IntersectionScene';
import DistanceScene from './DistanceScene';
import ControlPanel from './ControlPanel';
import MathDisplay from '@/components/ui/MathDisplay';
import { LinesPlanesTab } from './types';
import { Vector3D } from '@/core/types';
import {
  linePlaneIntersection,
  pointToPlaneDistance,
  planeCartesian,
  roundTo,
  dotProduct,
} from '@/math/vectors/operations';

const LinesPlanes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LinesPlanesTab>('line');

  // Line parameters
  const [linePoint, setLinePoint] = useState<Vector3D>({ x: 1, y: 2, z: 0 });
  const [lineDirection, setLineDirection] = useState<Vector3D>({ x: 2, y: 1, z: 1 });

  // Plane parameters
  const [planePoint, setPlanePoint] = useState<Vector3D>({ x: 0, y: 0, z: 2 });
  const [planeNormal, setPlaneNormal] = useState<Vector3D>({ x: 0, y: 0, z: 1 });

  // Distance point
  const [distancePoint, setDistancePoint] = useState<Vector3D>({ x: 2, y: 3, z: 5 });

  // Computed values
  const computed = useMemo(() => {
    const intersection = linePlaneIntersection(linePoint, lineDirection, planePoint, planeNormal);
    const distance = pointToPlaneDistance(distancePoint, planePoint, planeNormal);
    const cartesian = planeCartesian(planePoint, planeNormal);

    return {
      intersection,
      distance: roundTo(distance, 2),
      cartesian,
    };
  }, [linePoint, lineDirection, planePoint, planeNormal, distancePoint]);

  // Generate LaTeX formulas
  const lineFormulaLatex = `\\mathbf{r} = \\begin{pmatrix} ${linePoint.x} \\\\ ${linePoint.y} \\\\ ${linePoint.z} \\end{pmatrix} + \\lambda \\begin{pmatrix} ${lineDirection.x} \\\\ ${lineDirection.y} \\\\ ${lineDirection.z} \\end{pmatrix}`;

  const planeFormulaLatex = `\\mathbf{r} \\cdot \\begin{pmatrix} ${planeNormal.x} \\\\ ${planeNormal.y} \\\\ ${planeNormal.z} \\end{pmatrix} = ${roundTo(dotProduct(planePoint, planeNormal), 2)}`;

  const cartesianLatex = `${computed.cartesian.a}x + ${computed.cartesian.b}y + ${computed.cartesian.c}z = ${roundTo(computed.cartesian.d, 2)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Lines & Planes in 3D</h2>
        <p className="text-gray-600 mt-1">
          Explore vector equations of lines and planes, their intersections, and distances.
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: 3D Scene */}
        <div className="space-y-4">
          {activeTab === 'line' && (
            <LineScene point={linePoint} direction={lineDirection} />
          )}
          {activeTab === 'plane' && (
            <PlaneScene point={planePoint} normal={planeNormal} />
          )}
          {activeTab === 'intersection' && (
            <IntersectionScene
              linePoint={linePoint}
              lineDirection={lineDirection}
              planePoint={planePoint}
              planeNormal={planeNormal}
            />
          )}
          {activeTab === 'distance' && (
            <DistanceScene
              point={distancePoint}
              planePoint={planePoint}
              planeNormal={planeNormal}
            />
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-sm">
            {activeTab === 'line' && (
              <>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#f97316]" /> Point A
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#06b6d4]" /> Direction d
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#fbbf24]" /> Line
                </span>
              </>
            )}
            {activeTab === 'plane' && (
              <>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#f97316]" /> Point A
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#eab308]" /> Normal n
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-[#06b6d4] opacity-50" /> Plane
                </span>
              </>
            )}
            {activeTab === 'intersection' && (
              <>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-1 bg-[#fbbf24]" /> Line
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-[#06b6d4] opacity-50" /> Plane
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#22c55e]" /> Intersection
                </span>
              </>
            )}
            {activeTab === 'distance' && (
              <>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#a855f7]" /> Point P
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-[#06b6d4] opacity-50" /> Plane
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#22c55e]" /> Foot F
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Controls and Results */}
        <div className="space-y-4">
          <ControlPanel
            activeTab={activeTab}
            linePoint={linePoint}
            lineDirection={lineDirection}
            planePoint={planePoint}
            planeNormal={planeNormal}
            distancePoint={distancePoint}
            onTabChange={setActiveTab}
            onLinePointChange={setLinePoint}
            onLineDirectionChange={setLineDirection}
            onPlanePointChange={setPlanePoint}
            onPlaneNormalChange={setPlaneNormal}
            onDistancePointChange={setDistancePoint}
          />

          {/* Equations display */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Equations
            </h3>

            {(activeTab === 'line' || activeTab === 'intersection') && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Line (vector form):</div>
                <MathDisplay math={lineFormulaLatex} display="block" />
              </div>
            )}

            {(activeTab === 'plane' || activeTab === 'intersection' || activeTab === 'distance') && (
              <>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Plane (vector form):</div>
                  <MathDisplay math={planeFormulaLatex} display="block" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Plane (Cartesian):</div>
                  <MathDisplay math={cartesianLatex} display="block" />
                </div>
              </>
            )}

            {activeTab === 'intersection' && (
              <div className="pt-2 border-t border-gray-100">
                {computed.intersection ? (
                  <>
                    <div className="text-xs text-gray-500 mb-1">Intersection point:</div>
                    <div className="font-mono text-sm">
                      P = ({roundTo(computed.intersection.point.x, 2)},{' '}
                      {roundTo(computed.intersection.point.y, 2)},{' '}
                      {roundTo(computed.intersection.point.z, 2)})
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      λ = {roundTo(computed.intersection.lambda, 2)}
                    </div>
                  </>
                ) : (
                  <div className="text-yellow-700 bg-yellow-50 p-2 rounded text-sm">
                    Line is parallel to plane — no intersection
                  </div>
                )}
              </div>
            )}

            {activeTab === 'distance' && (
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Perpendicular distance:</div>
                <div className="font-mono text-lg font-semibold text-purple-600">
                  d = {computed.distance} units
                </div>
              </div>
            )}
          </div>

          {/* Educational note */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-2">
              {activeTab === 'line' && 'Vector Equation of a Line'}
              {activeTab === 'plane' && 'Vector Equation of a Plane'}
              {activeTab === 'intersection' && 'Line-Plane Intersection'}
              {activeTab === 'distance' && 'Point-to-Plane Distance'}
            </h3>
            <p className="text-sm text-purple-900">
              {activeTab === 'line' && (
                <>
                  A line through point <strong>A</strong> with direction <strong>d</strong>:{' '}
                  <MathDisplay math="\mathbf{r} = \mathbf{a} + \lambda\mathbf{d}" />
                  {' '}where λ is a parameter. Each value of λ gives a different point on the line.
                </>
              )}
              {activeTab === 'plane' && (
                <>
                  A plane through point <strong>A</strong> with normal <strong>n</strong>:{' '}
                  <MathDisplay math="\mathbf{r} \cdot \mathbf{n} = \mathbf{a} \cdot \mathbf{n}" />
                  {' '}The normal vector is perpendicular to the plane.
                </>
              )}
              {activeTab === 'intersection' && (
                <>
                  To find the intersection, substitute the line equation into the plane equation
                  and solve for λ. If <MathDisplay math="\mathbf{d} \cdot \mathbf{n} = 0" />,
                  the line is parallel to the plane.
                </>
              )}
              {activeTab === 'distance' && (
                <>
                  The perpendicular distance from point P to a plane:{' '}
                  <MathDisplay math="d = \frac{|(\mathbf{p} - \mathbf{a}) \cdot \mathbf{n}|}{|\mathbf{n}|}" />
                  {' '}The foot F is where the perpendicular meets the plane.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <span className="font-medium">Tip:</span>
        <span>Click and drag to rotate. Scroll to zoom. Right-click to pan.</span>
      </div>
    </motion.div>
  );
};

export default LinesPlanes;
