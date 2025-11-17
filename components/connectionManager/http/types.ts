// API Types for HTTP module

export interface ApiErrorResponse {
  detail?: string
  non_field_errors?: string[]
  [key: string]: unknown
}

export interface DjangoPaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  page_size: number
  total_pages: number
  current_page: number
  results: T[]
}

// Simplified EntityConfig for basic CRUD operations
export interface EntityConfig {
  name: string
  namePlural: string
  displayName: string
  endpoints: {
    list: string
    create: string
    update: string
    delete: string
  }
}

// Context for nested resource operations
export interface NestedResourceContext {
  parentEntity: string
  parentId: string | number
  relationship?: string
  nestedPath?: string[]
}

// API Service Options
export interface ApiServiceOptions {
  requiredPermission?: string;
  checkPermissions?: boolean;
  nestedContext?: NestedResourceContext;
  entityConfig?: EntityConfig;
}