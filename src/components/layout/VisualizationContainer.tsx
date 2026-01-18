/**
 * Visualization Container
 *
 * Wrapper for visualization modules with consistent padding and styling
 */

import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface VisualizationContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const VisualizationContainer: FC<VisualizationContainerProps> = ({
  children,
  title,
  description,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-8"
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          )}
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        {children}
      </div>
    </motion.div>
  );
};

export default VisualizationContainer;
