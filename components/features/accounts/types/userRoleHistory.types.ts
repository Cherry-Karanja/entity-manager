// ===== USER ROLE HISTORY ENTITY TYPES =====

import { BaseEntity } from '../../../entityManager/manager/types'

// ===== USER ROLE HISTORY ENTITY =====

export interface UserRoleHistory extends BaseEntity {
  id: string // UUID
  user: string | any // Can be User object or ID
  old_role?: string | any // Can be UserRole object or ID
  new_role?: string | any // Can be UserRole object or ID
  changed_by?: string | any // Can be User object or ID
  reason: string
  created_at: string
}

// ===== USER ROLE HISTORY FORM DATA =====

export interface UserRoleHistoryFormData extends Record<string, unknown> {
  user: string
  old_role?: string
  new_role?: string
  changed_by?: string
  reason: string
  created_at: string
}

// ===== USER ROLE HISTORY STATISTICS =====

export interface UserRoleHistoryStatistics {
  total_changes: number
  changes_this_month: number
  changes_this_week: number
  top_changed_roles: Record<string, number>
  most_active_changers: Record<string, number>
}

// ===== USER ROLE HISTORY FILTERS =====

export interface UserRoleHistoryFilters {
  user?: string
  changed_by?: string
  old_role?: string
  new_role?: string
  date_from?: string
  date_to?: string
}