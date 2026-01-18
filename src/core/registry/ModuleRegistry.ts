/**
 * Module Registry
 *
 * Central registry for all visualization modules.
 * Implements the plug-and-play architecture by allowing modules
 * to self-register on import.
 */

import {
  VisualizationModule,
  ModuleRegistrationResult,
  SyllabusStrand,
} from '../types/VisualizationModule';

/**
 * Central registry for visualization modules
 *
 * Singleton class that manages module registration, validation,
 * and lookup. Modules self-register by calling register() on import.
 */
class ModuleRegistry {
  private modules: Map<string, VisualizationModule> = new Map();
  private modulesByStrand: Map<SyllabusStrand, Set<string>> = new Map();
  private modulesByTopic: Map<string, Set<string>> = new Map();
  private modulesByTag: Map<string, Set<string>> = new Map();

  /**
   * Register a visualization module
   *
   * Validates the module structure and adds it to the registry.
   * If a module with the same ID already exists, it will be overwritten
   * with a warning.
   *
   * @param module - The module to register
   * @returns Registration result with success status and any errors/warnings
   */
  register(module: VisualizationModule): ModuleRegistrationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if module already exists
    if (this.modules.has(module.id)) {
      warnings.push(
        `Module "${module.id}" is already registered. Overwriting with new version.`
      );
    }

    // Validate module structure
    const validationErrors = this.validateModule(module);
    if (validationErrors.length > 0) {
      errors.push(...validationErrors);
      return {
        success: false,
        moduleId: module.id,
        errors,
      };
    }

    // Register the module
    this.modules.set(module.id, module);

    // Index by strand
    const { strand, topic } = module.syllabusRef;
    if (!this.modulesByStrand.has(strand)) {
      this.modulesByStrand.set(strand, new Set());
    }
    this.modulesByStrand.get(strand)!.add(module.id);

    // Index by topic
    if (!this.modulesByTopic.has(topic)) {
      this.modulesByTopic.set(topic, new Set());
    }
    this.modulesByTopic.get(topic)!.add(module.id);

    // Index by tags
    module.metadata.tags.forEach((tag) => {
      if (!this.modulesByTag.has(tag)) {
        this.modulesByTag.set(tag, new Set());
      }
      this.modulesByTag.get(tag)!.add(module.id);
    });

    console.log(`✓ Registered module: ${module.id} (${module.name})`);

    return {
      success: true,
      moduleId: module.id,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Get a module by ID
   *
   * @param moduleId - The unique module identifier
   * @returns The module if found, undefined otherwise
   */
  get(moduleId: string): VisualizationModule | undefined {
    return this.modules.get(moduleId);
  }

  /**
   * Get all modules for a specific topic
   *
   * @param topicId - The topic identifier
   * @returns Array of modules for that topic
   */
  getByTopic(topicId: string): VisualizationModule[] {
    const moduleIds = this.modulesByTopic.get(topicId);
    if (!moduleIds) return [];

    return Array.from(moduleIds)
      .map((id) => this.modules.get(id))
      .filter((module): module is VisualizationModule => module !== undefined);
  }

  /**
   * Get all modules for a strand
   *
   * @param strandId - The strand identifier
   * @returns Array of modules for that strand
   */
  getByStrand(strandId: SyllabusStrand): VisualizationModule[] {
    const moduleIds = this.modulesByStrand.get(strandId);
    if (!moduleIds) return [];

    return Array.from(moduleIds)
      .map((id) => this.modules.get(id))
      .filter((module): module is VisualizationModule => module !== undefined);
  }

  /**
   * Get all modules with a specific tag
   *
   * @param tag - The tag to search for
   * @returns Array of modules with that tag
   */
  getByTag(tag: string): VisualizationModule[] {
    const moduleIds = this.modulesByTag.get(tag);
    if (!moduleIds) return [];

    return Array.from(moduleIds)
      .map((id) => this.modules.get(id))
      .filter((module): module is VisualizationModule => module !== undefined);
  }

  /**
   * Get all registered modules
   *
   * @returns Array of all modules
   */
  getAll(): VisualizationModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get all module IDs
   *
   * @returns Array of module IDs
   */
  getAllIds(): string[] {
    return Array.from(this.modules.keys());
  }

  /**
   * Check if a module exists
   *
   * @param moduleId - The module ID to check
   * @returns True if module exists, false otherwise
   */
  has(moduleId: string): boolean {
    return this.modules.has(moduleId);
  }

  /**
   * Unregister a module
   *
   * @param moduleId - The module ID to unregister
   * @returns True if module was removed, false if it didn't exist
   */
  unregister(moduleId: string): boolean {
    const module = this.modules.get(moduleId);
    if (!module) return false;

    // Remove from main registry
    this.modules.delete(moduleId);

    // Remove from strand index
    const strandSet = this.modulesByStrand.get(module.syllabusRef.strand);
    if (strandSet) {
      strandSet.delete(moduleId);
    }

    // Remove from topic index
    const topicSet = this.modulesByTopic.get(module.syllabusRef.topic);
    if (topicSet) {
      topicSet.delete(moduleId);
    }

    // Remove from tag indices
    module.metadata.tags.forEach((tag) => {
      const tagSet = this.modulesByTag.get(tag);
      if (tagSet) {
        tagSet.delete(moduleId);
      }
    });

    console.log(`✗ Unregistered module: ${moduleId}`);
    return true;
  }

  /**
   * Clear all modules from registry
   * Useful for testing
   */
  clear(): void {
    this.modules.clear();
    this.modulesByStrand.clear();
    this.modulesByTopic.clear();
    this.modulesByTag.clear();
    console.log('✗ Cleared all modules from registry');
  }

  /**
   * Get registry statistics
   *
   * @returns Statistics about registered modules
   */
  getStats() {
    return {
      totalModules: this.modules.size,
      modulesByStrand: Object.fromEntries(
        Array.from(this.modulesByStrand.entries()).map(([strand, set]) => [
          strand,
          set.size,
        ])
      ),
      modulesByEngine: this.getEngineStats(),
      modulesByDifficulty: this.getDifficultyStats(),
    };
  }

  /**
   * Validate module implements required interface
   *
   * @param module - The module to validate
   * @returns Array of validation errors (empty if valid)
   */
  private validateModule(module: VisualizationModule): string[] {
    const errors: string[] = [];

    // Required fields
    const requiredFields: (keyof VisualizationModule)[] = [
      'id',
      'name',
      'description',
      'syllabusRef',
      'engine',
      'Component',
      'getInitialState',
      'validateState',
      'metadata',
    ];

    for (const field of requiredFields) {
      if (!(field in module) || module[field] === undefined) {
        errors.push(
          `Module ${module.id || 'unknown'} missing required field: ${field}`
        );
      }
    }

    // Validate ID format
    if (module.id && !this.isValidModuleId(module.id)) {
      errors.push(
        `Module ID "${module.id}" invalid. Expected format: "strand.topic" or "topic.visualization"`
      );
    }

    // Validate Component is a function
    if (module.Component && typeof module.Component !== 'function') {
      errors.push(`Module ${module.id} Component must be a React component`);
    }

    // Validate getInitialState returns correct type
    if (module.getInitialState && typeof module.getInitialState !== 'function') {
      errors.push(
        `Module ${module.id} getInitialState must be a function`
      );
    }

    // Validate validateState is a function
    if (module.validateState && typeof module.validateState !== 'function') {
      errors.push(`Module ${module.id} validateState must be a function`);
    }

    // Validate syllabusRef
    if (module.syllabusRef) {
      if (!module.syllabusRef.strand) {
        errors.push(`Module ${module.id} missing syllabusRef.strand`);
      }
      if (!module.syllabusRef.topic) {
        errors.push(`Module ${module.id} missing syllabusRef.topic`);
      }
    }

    // Validate metadata
    if (module.metadata) {
      if (!module.metadata.version) {
        errors.push(`Module ${module.id} missing metadata.version`);
      }
      if (!Array.isArray(module.metadata.tags)) {
        errors.push(`Module ${module.id} metadata.tags must be an array`);
      }
    }

    // Try to instantiate initial state
    try {
      const initialState = module.getInitialState?.();
      if (!initialState || typeof initialState !== 'object') {
        errors.push(
          `Module ${module.id} getInitialState() must return a MathState object`
        );
      } else {
        // Validate initial state structure
        if (!initialState.topicId) {
          errors.push(
            `Module ${module.id} initial state missing topicId`
          );
        }
      }
    } catch (error) {
      errors.push(
        `Module ${module.id} getInitialState() threw an error: ${error}`
      );
    }

    return errors;
  }

  /**
   * Validate module ID format
   *
   * @param id - The ID to validate
   * @returns True if valid format
   */
  private isValidModuleId(id: string): boolean {
    // Accept format: "word.word" or "word.word.word"
    const pattern = /^[a-z0-9]+(-[a-z0-9]+)*(\.[a-z0-9]+(-[a-z0-9]+)*)+$/;
    return pattern.test(id);
  }

  /**
   * Get statistics by visualization engine
   */
  private getEngineStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    this.modules.forEach((module) => {
      stats[module.engine] = (stats[module.engine] || 0) + 1;
    });
    return stats;
  }

  /**
   * Get statistics by difficulty level
   */
  private getDifficultyStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    this.modules.forEach((module) => {
      const difficulty = module.metadata.difficulty || 'unknown';
      stats[difficulty] = (stats[difficulty] || 0) + 1;
    });
    return stats;
  }
}

// Singleton instance
export const moduleRegistry = new ModuleRegistry();

// Export the class for testing purposes
export { ModuleRegistry };
