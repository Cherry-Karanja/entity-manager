/**
 * Entity Manager Module Exports
 * 
 * @module manager
 */

// Main components
export { EntityManager } from './orchestrator'
export type { EntityManagerProps, BreadcrumbItem } from './orchestrator'

export { UnifiedEntityManager } from './UnifiedEntityManager'
export type { UnifiedEntityManagerProps } from './UnifiedEntityManager'

// Types
export type {
  EntityConfig,
  EntityField,
  BaseEntity,
  RelatedEntityConfig
} from './types'

// Compatibility utilities
export {
  isUnifiedConfig,
  legacyToUnified,
  normalizeConfig,
  validateUnifiedConfig
} from './compatibility'

// Utilities
export {
  transformEntityFieldToFormField,
  transformEntityFieldsToFormFields,
  useDebounce,
  useThrottle,
  validateFileContent,
  deepClone,
  getNestedValue,
  setNestedValue,
  isEmpty,
  generateId,
  cn
} from './utils'

// Re-export core types for convenience
export type {
  UnifiedEntityConfig,
  UnifiedFieldConfig,
  UnifiedActionConfig,
  UnifiedFilterConfig,
  UnifiedPermissionConfig,
  UnifiedEndpointConfig,
  FieldGroup,
  ViewMode
} from '../core/types'
