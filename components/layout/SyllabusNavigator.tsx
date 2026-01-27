/**
 * Syllabus Navigator
 *
 * Sidebar navigation showing the 6 main H2 Math strands
 * with topics at a flat level (two-level hierarchy).
 */

import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { ChevronDown, ChevronRight, Home } from 'lucide-react';
import { SYLLABUS_STRUCTURE, SyllabusTopicDef } from '@/data/syllabus/syllabusStructure';
import { useNavigationStore, useNavigationActions } from '@/lib/store/navigationStore';
import { moduleRegistry } from '@/lib/core/registry/ModuleRegistry';

const SyllabusNavigator: FC = () => {
  const { currentStrand, currentTopic, currentModule } = useNavigationStore();
  const { navigateToStrand, navigateToTopic, navigateToModule, goHome } = useNavigationActions();

  const [expandedStrands, setExpandedStrands] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleStrand = (strandId: string) => {
    const newExpanded = new Set(expandedStrands);
    if (newExpanded.has(strandId)) {
      newExpanded.delete(strandId);
    } else {
      newExpanded.add(strandId);
    }
    setExpandedStrands(newExpanded);
  };

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const handleStrandClick = (strandId: string) => {
    navigateToStrand(strandId);
    toggleStrand(strandId);
  };

  const handleTopicClick = (topicId: string, hasModules: boolean) => {
    navigateToTopic(topicId);
    if (hasModules) {
      toggleTopic(topicId);
    }
  };

  const handleModuleClick = (moduleId: string) => {
    navigateToModule(moduleId);
  };

  const renderTopic = (topic: SyllabusTopicDef) => {
    const isExpanded = expandedTopics.has(topic.id);
    const isActive = currentTopic === topic.id;
    const hasModules = topic.modules.length > 0;

    // Get actual modules from registry
    const modules = topic.modules
      .map((moduleId) => moduleRegistry.get(moduleId))
      .filter((m) => m !== undefined);

    return (
      <div key={topic.id}>
        <button
          onClick={() => handleTopicClick(topic.id, hasModules)}
          className={clsx(
            'nav-item w-full flex items-center justify-between text-left',
            isActive && 'active'
          )}
        >
          <span className="flex items-center gap-2">
            {hasModules && (
              isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            )}
            {topic.name}
          </span>
          {hasModules && (
            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
              {modules.length}
            </span>
          )}
        </button>

        {/* Render modules when expanded */}
        <AnimatePresence>
          {isExpanded && hasModules && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => handleModuleClick(module.id)}
                  className={clsx(
                    'nav-item w-full text-left text-sm ml-6',
                    currentModule === module.id && 'active'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    {module.name}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <nav className="w-64 h-screen bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={goHome}
          className="flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
        >
          <Home size={20} />
          H2 Math Visualizer
        </button>
        <p className="text-xs text-gray-500 mt-1">SEAB 9758 Syllabus</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {SYLLABUS_STRUCTURE.map((strand) => {
          const isExpanded = expandedStrands.has(strand.id);
          const isActive = currentStrand === strand.id;

          return (
            <div key={strand.id}>
              {/* Strand */}
              <button
                onClick={() => handleStrandClick(strand.id)}
                className={clsx(
                  'nav-item w-full flex items-center justify-between font-semibold',
                  isActive && 'active'
                )}
                style={{
                  borderLeft: `4px solid var(--tw-strand-${strand.color})`,
                }}
              >
                <span className="flex items-center gap-2">
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  {strand.name}
                </span>
                <span className="text-xs">{strand.topics.length}</span>
              </button>

              {/* Topics */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden ml-2 space-y-1"
                  >
                    {strand.topics.map((topic) => renderTopic(topic))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        <p>Singapore H2 Mathematics</p>
        <p>SEAB Syllabus 9758</p>
      </div>
    </nav>
  );
};

export default SyllabusNavigator;
