/**
 * Entity Manager - Main Entry Point
 * 
 * Complete modular entity management system with 5-layer architecture:
 * 1. Primitives - Zero-dependency types, hooks, and utilities
 * 2. Components - Standalone UI components (List, Form, View, Actions, Exporter)
 * 3. Composition - Builders, state management, and API integration
 * 4. Features - Optional enhancements (offline, realtime, optimistic, collaborative)
 * 5. Orchestration - Thin coordinator (~150 lines)
 */

// ===========================
// Layer 5: Orchestration
// ===========================
export * from './orchestrator/exports';

// ===========================
// Layer 3: Composition
// ===========================
export * from './composition/exports';

// ===========================
// Layer 2: Components
// ===========================

// List component
export { EntityList } from './components/list';
export type {
  ListView,
  Column,
  ToolbarConfig,
  EntityListProps
} from './components/list/types';

// Form component
export { EntityForm } from './components/form';
export type {
  FormMode,
  FormLayout,
  FieldType,
  FormField,
  ValidationRule,
  EntityFormProps
} from './components/form/types';

// View component
export { EntityView } from './components/view';
export type {
  ViewMode,
  ViewField,
  FieldGroup,
  ViewTab,
  EntityViewProps
} from './components/view/types';

// Actions component
export { EntityActions } from './components/actions';
export type {
  ActionType,
  Action,
  FormFieldDefinition,
  EntityActionsProps
} from './components/actions/types';

// Exporter component
export { EntityExporter } from './components/exporter';
export type {
  ExportFormat,
  ExportField,
  ExportOptions,
  EntityExporterProps
} from './components/exporter/types';

// ===========================
// Layer 1: Primitives
// ===========================

// Core types
export type {
  BaseEntity,
  FilterConfig,
  FilterOperator,
  SortConfig,
  PaginationConfig
} from './primitives/types';

// Hooks
export { useFilters } from './primitives/hooks/useFilters';
export { usePagination } from './primitives/hooks/usePagination';
export { useSelection } from './primitives/hooks/useSelection';
export { useSort } from './primitives/hooks/useSort';

// Utilities
export * from './primitives/utils/validation';
export * from './primitives/utils/formatting';
