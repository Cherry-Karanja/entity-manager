/**
 * Base Entity Types
 * 
 * Core entity interfaces that form the foundation of the entity management system.
 * These types have ZERO dependencies and can be imported anywhere without coupling.
 * 
 * @module primitives/types/entity
 */

/**
 * Base entity interface that all entities must extend.
 * Represents the minimal contract for any entity in the system.
 */
export interface BaseEntity {
  /** Unique identifier for the entity */
  id: string | number;
  /** Allow any additional properties (use `any` during migration to reduce noise) */
  [key: string]: any;
}

/**
 * Metadata associated with an entity
 */
export interface EntityMetadata {
  /** When the entity was created */
  createdAt?: Date | string;
  /** When the entity was last updated */
  updatedAt?: Date | string;
  /** User who created the entity */
  createdBy?: string;
  /** User who last updated the entity */
  updatedBy?: string;
  /** Entity version for optimistic concurrency */
  version?: number;
  /** Soft delete timestamp */
  deletedAt?: Date | string | null;
  /** Additional metadata */
  [key: string]: unknown;
}

/**
 * Entity with metadata
 */
export interface EntityWithMetadata<T extends BaseEntity = BaseEntity> extends BaseEntity {
  /** Entity data */
  data: T;
  /** Entity metadata */
  metadata: EntityMetadata;
}

/**
 * Entity selection state
 */
export interface EntitySelection<T extends BaseEntity = BaseEntity> {
  /** Selected entity IDs */
  selectedIds: Set<string | number>;
  /** All selected entities */
  selectedEntities: T[];
  /** Whether all entities are selected */
  isAllSelected: boolean;
}

/**
 * Entity state for UI components
 */
export interface EntityState {
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Success state */
  isSuccess: boolean;
  /** Idle state */
  isIdle: boolean;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  /** Response data */
  data: T;
  /** Response message */
  message?: string;
  /** Response status */
  status: number;
  /** Success indicator */
  success: boolean;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T extends BaseEntity = BaseEntity> {
  /** Array of entities */
  results: T[];
  /** Total count of entities */
  count: number;
  /** Next page URL */
  next: string | null;
  /** Previous page URL */
  previous: string | null;
  /** Current page number */
  page?: number;
  /** Page size */
  pageSize?: number;
  /** Total pages */
  totalPages?: number;
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort configuration
 */
export interface SortConfig {
  /** Field to sort by */
  field: string;
  /** Sort direction */
  direction: SortDirection;
}

/**
 * Filter operator types
 */
export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'in'
  | 'notIn'
  | 'between'
  | 'isNull'
  | 'isNotNull';

/**
 * Filter configuration
 */
export interface FilterConfig {
  /** Field to filter */
  field: string;
  /** Filter operator */
  operator: FilterOperator;
  /** Filter value(s) */
  value: unknown;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total count of items */
  totalCount?: number;
  /** Total pages */
  totalPages?: number;
}

/**
 * Search configuration
 */
export interface SearchConfig {
  /** Search query */
  query: string;
  /** Fields to search in */
  fields?: string[];
  /** Search mode (exact, fuzzy, prefix, etc.) */
  mode?: 'exact' | 'fuzzy' | 'prefix' | 'suffix' | 'contains';
}
