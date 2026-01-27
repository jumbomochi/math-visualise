/**
 * Slot Method Explanation
 *
 * Step-by-step explanation panel
 */

import { FC } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import MathDisplay from '@/components/ui/MathDisplay';
import { SlotCalculation } from '@/lib/math/combinatorics';

interface ExplanationProps {
  slots: SlotCalculation[];
  formulaLatex: string;
  totalArrangements: number;
}

const Explanation: FC<ExplanationProps> = ({
  slots,
  formulaLatex,
  totalArrangements,
}) => {
  if (slots.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="mt-6"
    >
      <Card>
        <h3 className="text-xl font-semibold mb-4">Step-by-Step Solution</h3>

        {/* Slot Breakdown */}
        <div className="space-y-3 mb-6">
          {slots.map((slot, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{slot.reasoning}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Available choices: <span className="font-semibold">{slot.availableChoices}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Formula */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-semibold mb-3">Formula</h4>
          <div className="bg-white border-2 border-blue-200 rounded-lg p-4 mb-4">
            <div className="text-center">
              <MathDisplay math={formulaLatex} display="block" />
            </div>
          </div>
        </div>

        {/* Final Answer */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6 mt-4">
          <h4 className="text-lg font-semibold text-blue-900 mb-2">Final Answer</h4>
          <p className="text-3xl font-bold text-blue-600">
            {totalArrangements.toLocaleString()} arrangements
          </p>
          <p className="text-sm text-gray-700 mt-2">
            There are <strong>{totalArrangements.toLocaleString()}</strong> different ways to arrange{' '}
            <strong>{slots.length}</strong> position{slots.length !== 1 ? 's' : ''} from the available items.
          </p>
        </div>

        {/* Additional Notes */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h5 className="text-sm font-semibold text-yellow-900 mb-2">Note</h5>
          <p className="text-xs text-yellow-800">
            This uses the <strong>Multiplication Principle</strong>: when events occur in sequence,
            multiply the number of choices for each event to get the total number of outcomes.
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default Explanation;
