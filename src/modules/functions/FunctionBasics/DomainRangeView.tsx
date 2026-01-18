/**
 * DomainRangeView Component
 *
 * Visualizes domain and range of a function.
 */

import { FC, useMemo } from 'react';
import GraphCanvas from './GraphCanvas';
import FunctionCurve from './FunctionCurve';
import { DomainRangeViewProps, FunctionId } from './types';
import { STANDARD_FUNCTIONS, findRange } from '@/math/functions/operations';

const getFunctionById = (id: FunctionId) => {
  return STANDARD_FUNCTIONS.find((f) => f.id === id) || STANDARD_FUNCTIONS[0];
};

const DomainRangeView: FC<DomainRangeViewProps> = ({
  functionId,
  domainMin,
  domainMax,
}) => {
  const funcDef = getFunctionById(functionId);

  const { rangeMin, rangeMax } = useMemo(() => {
    const range = findRange(funcDef.fn, domainMin, domainMax, 200);
    return {
      rangeMin: Math.max(-10, range.min),
      rangeMax: Math.min(10, range.max),
    };
  }, [funcDef, domainMin, domainMax]);

  // Colors
  const colorFunction = '#3b82f6'; // Blue
  const colorDomain = '#22c55e'; // Green
  const colorRange = '#f97316'; // Orange

  return (
    <div className="flex justify-center">
      <GraphCanvas xRange={[-5, 5]} yRange={[-5, 5]}>
        {/* Domain highlight on x-axis */}
        <line
          x1={domainMin}
          y1={0}
          x2={domainMax}
          y2={0}
          stroke={colorDomain}
          strokeWidth={0.15}
          strokeLinecap="round"
        />
        {/* Domain endpoints */}
        <circle cx={domainMin} cy={0} r={0.12} fill={colorDomain} />
        <circle cx={domainMax} cy={0} r={0.12} fill={colorDomain} />

        {/* Range highlight on y-axis */}
        <line
          x1={0}
          y1={rangeMin}
          x2={0}
          y2={rangeMax}
          stroke={colorRange}
          strokeWidth={0.15}
          strokeLinecap="round"
        />
        {/* Range endpoints */}
        <circle cx={0} cy={rangeMin} r={0.12} fill={colorRange} />
        <circle cx={0} cy={rangeMax} r={0.12} fill={colorRange} />

        {/* Dashed lines showing domain boundaries */}
        <line
          x1={domainMin}
          y1={-5}
          x2={domainMin}
          y2={5}
          stroke={colorDomain}
          strokeWidth={0.03}
          strokeDasharray="0.1 0.1"
          opacity={0.5}
        />
        <line
          x1={domainMax}
          y1={-5}
          x2={domainMax}
          y2={5}
          stroke={colorDomain}
          strokeWidth={0.03}
          strokeDasharray="0.1 0.1"
          opacity={0.5}
        />

        {/* Dashed lines showing range boundaries */}
        <line
          x1={-5}
          y1={rangeMin}
          x2={5}
          y2={rangeMin}
          stroke={colorRange}
          strokeWidth={0.03}
          strokeDasharray="0.1 0.1"
          opacity={0.5}
        />
        <line
          x1={-5}
          y1={rangeMax}
          x2={5}
          y2={rangeMax}
          stroke={colorRange}
          strokeWidth={0.03}
          strokeDasharray="0.1 0.1"
          opacity={0.5}
        />

        {/* Function curve (only in domain) */}
        <FunctionCurve
          fn={funcDef.fn}
          xMin={domainMin}
          xMax={domainMax}
          color={colorFunction}
          label="f"
        />

        {/* Function curve outside domain (faded) */}
        <FunctionCurve
          fn={funcDef.fn}
          xMin={-5}
          xMax={domainMin - 0.01}
          color={colorFunction}
          dashed={true}
        />
        <FunctionCurve
          fn={funcDef.fn}
          xMin={domainMax + 0.01}
          xMax={5}
          color={colorFunction}
          dashed={true}
        />
      </GraphCanvas>
    </div>
  );
};

export default DomainRangeView;
