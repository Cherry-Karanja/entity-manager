// ===== PERMISSION ENTITY TYPES =====

import { BaseEntity } from '@/components/entityManager/manager'

// ===== PERMISSION ENTITY =====

export interface Permission extends BaseEntity {
  readonly id: string | number
  name: string
  codename: string
  app_label: string
  model: string
  content_type_name?: string
  [key: string]: unknown
}

// ===== PERMISSION FORM DATA =====

export interface PermissionFormData extends Record<string, unknown> {
  name: string
  codename: string
  app_label: string
  model: string
}

// ===== PERMISSION LIST PARAMS =====

export interface PermissionListParams {
  search?: string
  app_label?: string
  model?: string
  ordering?: string
  page?: number
  page_size?: number
}

// ===== PERMISSION API TYPES =====

export interface PermissionCreateRequest {
  name: string
  codename: string
  app_label: string
  model: string
}

export interface PermissionUpdateRequest {
  name?: string
  codename?: string // Note: This might be read-only in backend
  app_label?: string // Note: This might be read-only in backend
  model?: string // Note: This might be read-only in backend
}

// ===== PERMISSION GROUPING TYPES =====

export interface PermissionGroup {
  app_label: string
  permissions: Permission[]
}

export interface PermissionMatrix {
  [appLabel: string]: {
    [model: string]: Permission[]
  }
}