/**
 * Visualization Modules Index
 *
 * Auto-imports all visualization modules to trigger their self-registration.
 * Simply importing this file will register all modules with the ModuleRegistry.
 *
 * To add a new module:
 * 1. Create the module directory and files
 * 2. Add an import statement here
 * 3. That's it! The module will be automatically available in the app
 */

// Combinatorics modules - Fundamental Principles
import './combinatorics/AdditivePrincipleVisualization/index.tsx';
import './combinatorics/MultiplicativePrincipleVisualization/index.tsx';

// Combinatorics modules - Basic Permutations
import './combinatorics/SlotMethodVisualization';

// Combinatorics modules - Restricted Arrangements
import './combinatorics/NonAdjacentVisualization/index.tsx';
import './combinatorics/AdjacentVisualization/index.tsx';

// Combinatorics modules - Advanced Cases
import './combinatorics/AdvancedCasesVisualization/index.tsx';

// Probability modules
import './probability/BasicProbabilityVisualization';
import './probability/ProbabilityRulesVisualization';
import './probability/ConditionalProbabilityVisualization';
import './probability/VennDiagramsVisualization';
import './probability/TreeDiagramsVisualization';

// Statistics modules
import './statistics/DiscreteRVVisualization';
import './statistics/BinomialDistributionVisualization';
import './statistics/NormalDistributionVisualization';
import './statistics/SamplingVisualization';
import './statistics/HypothesisTestingVisualization';
import './statistics/CorrelationRegressionVisualization';

// Vectors modules
import './vectors';

// Complex numbers modules
import './complex';

// Functions & Graphs modules
import './functions';

// Calculus modules
import './calculus';

/**
 * Re-export the module registry for convenience
 */
export { moduleRegistry } from '@/core/registry/ModuleRegistry';
