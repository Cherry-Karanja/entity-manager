// ===== USER ROLE ENTITY TYPES =====

import { BaseEntity } from '../../../entityManager/manager/types'
import { Permission } from './permission.types'

// ===== USER ROLE ENTITY =====

export interface UserRole extends BaseEntity {
  id: string // UUID
  name: string
  display_name: string
  description: string
  is_active: boolean
  permissions: Permission[]
  permissions_count?: number
  users_count?: number
  created_at: string
  updated_at: string
}

// ===== USER ROLE FORM DATA =====

export interface UserRoleFormData {
  name: string
  display_name: string
  description: string
  is_active: boolean
  permissions: string[] // Array of permission codenames
  [key: string]: unknown // Index signature to satisfy Record<string, unknown>
}

// ===== USER ROLE UPDATE DATA =====

export interface UserRoleUpdateData extends Partial<UserRoleFormData> {
  id: string
}

// ===== USER ROLE CLONE DATA =====

export interface UserRoleCloneData {
  name: string
  display_name: string
  description?: string
  permissions?: string[]
}