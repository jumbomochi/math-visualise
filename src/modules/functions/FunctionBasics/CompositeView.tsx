/**
 * CompositeView Component
 *
 * Visualizes function composition f(g(x)).
 */

import { FC, useMemo } from 'react';
import GraphCanvas from './GraphCanvas';
import FunctionCurve from './FunctionCurve';
import { CompositeViewProps, FunctionId } from './types';
import { STANDARD_FUNCTIONS, compose } from '@/math/functions/operations';

const getFunctionById = (id: FunctionId) => {
  return STANDARD_FUNCTIONS.find((f) => f.id === id) || STANDARD_FUNCTIONS[0];
};

const CompositeView: FC<CompositeViewProps> = ({ functionF, functionG }) => {
  const funcF = getFunctionById(functionF);
  const funcG = getFunctionById(functionG);

  const composedFn = useMemo(() => {
    return compose(funcF.fn, funcG.fn);
  }, [funcF, funcG]);

  // Colors
  const colorF = '#3b82f6'; // Blue for f
  const colorG = '#22c55e'; // Green for g
  const colorComposed = '#f97316'; // Orange for f∘g

  return (
    <div className="flex justify-center">
      <GraphCanvas xRange={[-5, 5]} yRange={[-5, 5]}>
        {/* g(x) - dashed */}
        <FunctionCurve
          fn={funcG.fn}
          xMin={-5}
          xMax={5}
          color={colorG}
          dashed={true}
          label="g"
        />

        {/* f(x) - dashed */}
        <FunctionCurve
          fn={funcF.fn}
          xMin={-5}
          xMax={5}
          color={colorF}
          dashed={true}
          label="f"
        />

        {/* f(g(x)) - solid */}
        <FunctionCurve
          fn={composedFn}
          xMin={-5}
          xMax={5}
          color={colorComposed}
          label="f∘g"
        />
      </GraphCanvas>
    </div>
  );
};

export default CompositeView;
