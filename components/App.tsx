/**
 * Main App Component
 *
 * Root component that integrates the entire application:
 * - Imports modules to trigger registration
 * - Loads current module from navigation store
 * - Renders visualization with state management
 */

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { useNavigationStore } from '@/lib/store/navigationStore';
import { useVisualization } from '@/lib/core/hooks/useVisualization';
import { Home } from 'lucide-react';
import { CalculatorButton } from '@/components/tools/CalculatorButton';
import { TI84Calculator } from '@/components/tools/TI84Calculator';
import { useCalculatorStore } from '@/lib/store/calculatorStore';

// Import modules to trigger registration and get registry
import { moduleRegistry } from '@/modules';

function App() {
  const { currentModule } = useNavigationStore();
  const { module, mathState, updateMathState, errors, isLoading } =
    useVisualization(currentModule);
  const { isOpen: isCalculatorOpen, close: closeCalculator } = useCalculatorStore();

  // Log module registry status on mount
  useEffect(() => {
    const stats = moduleRegistry.getStats();
    console.log('📊 Module Registry Stats:', stats);
    console.log('📦 Registered modules:', moduleRegistry.getAllIds());
  }, []);

  return (
    <>
      <AppLayout>
        <AnimatePresence mode="wait">
          {currentModule && module && mathState ? (
            // Render active module
            <motion.div
              key={currentModule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {/* Validation Errors */}
              {errors.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Validation Errors
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul className="list-disc list-inside space-y-1">
                          {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Module Component */}
              <module.Component
                mathState={mathState}
                onStateChange={updateMathState}
                isActive={true}
              />
            </motion.div>
          ) : isLoading ? (
            // Loading state
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg
                  className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-gray-600">Loading module...</p>
              </div>
            </div>
          ) : (
            // Welcome screen (no module selected)
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50"
            >
              <div className="text-center max-w-2xl px-8">
                <Home className="w-24 h-24 text-blue-600 mx-auto mb-6" />

                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  H2 Mathematics Visualizer
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                  Interactive visualizations for the Singapore H2 Math (SEAB 9758) syllabus
                </p>

                <div className="bg-white rounded-lg shadow-lg p-8 text-left">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Getting Started
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Choose a Strand</h3>
                        <p className="text-gray-600 text-sm">
                          Select one of the 6 main syllabus strands from the sidebar
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Pick a Topic</h3>
                        <p className="text-gray-600 text-sm">
                          Expand the strand to see topics and subtopics
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Explore & Learn</h3>
                        <p className="text-gray-600 text-sm">
                          Interact with visualizations, adjust parameters, and see step-by-step solutions
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Try this:</strong> Start with{' '}
                      <span className="font-semibold">Probability → Permutations & Combinations → Slot Method</span>
                    </p>
                  </div>
                </div>

                <div className="mt-8 text-sm text-gray-500">
                  <p>Built for Singapore H2 Mathematics (9758)</p>
                  <p className="mt-1">Aligned with SEAB syllabus standards</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AppLayout>

      {/* Global Calculator Button */}
      <CalculatorButton />

      {/* Calculator Right Pane */}
      <AnimatePresence>
        {isCalculatorOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-screen w-[420px] z-50"
          >
            <TI84Calculator onClose={closeCalculator} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
