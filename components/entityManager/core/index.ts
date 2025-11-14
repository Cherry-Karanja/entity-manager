/**
 * Entity Manager Core
 * 
 * Central exports for the unified entity manager core functionality.
 * 
 * @module core
 */

// Types
export type {
  // Base types
  BaseEntity,
  ApiResponse,
  ValidationErrors,
  
  // Field types
  FieldDataType,
  FieldRenderType,
  RelationshipType,
  FieldOption,
  ValidationRule,
  RelationshipConfig,
  UnifiedFieldConfig,
  
  // Action types
  ActionType,
  ActionContext,
  UnifiedActionConfig,
  
  // Filter types
  FilterOperator,
  UnifiedFilterConfig,
  
  // Permission types
  UnifiedPermissionConfig,
  
  // Endpoint types
  UnifiedEndpointConfig,
  
  // Layout types
  FieldGroup,
  ViewMode,
  
  // Main config
  UnifiedEntityConfig,
  
  // Utility types
  ExtractEntity,
  ExtractFormData,
  Optional,
  RequiredKeys
} from './types'

// Adapters
export {
  fieldToListColumn,
  fieldToFormField,
  fieldToViewField,
  actionToListAction,
  actionToEntityAction,
  filterToListFilter,
  toListConfig,
  toFormConfig,
  toViewConfig,
  convertFieldGroups,
  getFieldsForContext,
  getActionsForContext
} from './adapters'

// Builders
export {
  FieldBuilder,
  ActionBuilder,
  EntityConfigBuilder,
  createEntityConfig,
  createField,
  createAction,
  commonFields,
  commonActions
} from './builder'
