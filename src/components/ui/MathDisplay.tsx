/**
 * MathDisplay Component
 *
 * Renders mathematical expressions using KaTeX
 */

import { FC } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathDisplayProps {
  /**
   * LaTeX expression to render
   */
  math: string;

  /**
   * Display mode: inline or block
   */
  display?: 'inline' | 'block';

  /**
   * Optional error handler
   */
  onError?: (error: Error) => void;
}

const MathDisplay: FC<MathDisplayProps> = ({
  math,
  display = 'inline',
  onError,
}) => {
  const errorHandler = (error: Error) => {
    console.error('KaTeX rendering error:', error);
    if (onError) {
      onError(error);
    }
  };

  try {
    if (display === 'block') {
      return <BlockMath math={math} errorColor="#dc2626" />;
    }
    return <InlineMath math={math} errorColor="#dc2626" />;
  } catch (error) {
    errorHandler(error as Error);
    return (
      <span className="text-red-600 font-mono text-sm">
        Error rendering: {math}
      </span>
    );
  }
};

export default MathDisplay;
