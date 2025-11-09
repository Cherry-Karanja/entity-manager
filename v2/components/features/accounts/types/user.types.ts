// ===== USER ENTITY TYPES =====

import { BaseEntity } from '../../../entityManager/manager/types'
import { UserRole } from './userRole.types'
import { UserProfile } from './userProfile.types'

// ===== USER ENTITY =====

export interface User extends BaseEntity {
  id: string // UUID
  email: string
  first_name: string
  last_name: string
  username?: string
  employee_id?: string
  role?: UserRole | string // Can be populated object or ID
  role_display?: string
  full_name?: string
  is_active: boolean
  is_approved: boolean
  is_verified: boolean
  is_staff: boolean
  must_change_password: boolean
  failed_login_attempts: number
  account_locked_until?: string
  last_login_ip?: string
  password_changed_at?: string
  date_joined: string
  last_login?: string
  created_at: string
  updated_at: string
  // Computed fields from serializer
  location?: string
  department?: string
  phone_number?: string
  profile?: UserProfile
  permissions?: string[]
  role_permissions?: string[]
  is_staff_member?: boolean
}

// ===== USER FORM DATA =====

export interface UserFormData {
  email: string
  first_name: string
  last_name: string
  username?: string
  employee_id?: string
  role?: string // Role ID
  is_active: boolean
  is_approved: boolean
  is_verified: boolean
  must_change_password: boolean
  [key: string]: unknown // Index signature to satisfy Record<string, unknown>
}

// ===== USER CREATE DATA =====

export interface UserCreateData extends Omit<UserFormData, 'is_approved' | 'is_verified'> {
  password: string
}

// ===== USER UPDATE DATA =====

export interface UserUpdateData extends Partial<UserFormData> {
  id: string
}

// ===== USER APPROVAL REQUEST =====

export interface UserApprovalRequest {
  user_id: string
  approved: boolean
  reason?: string
}

// ===== USER ROLE CHANGE REQUEST =====

export interface UserRoleChangeRequest {
  role_name: string
  reason?: string
}

// ===== USER ROLE CHANGE RESPONSE =====

export interface UserRoleChangeResponse {
  message: string
  user: User
}

// ===== USER PERMISSIONS RESPONSE =====

export interface UserPermissionsResponse {
  id: string
  role: string | null
  permissions: string[]
  is_staff: boolean
  is_superuser: boolean
}

// ===== USER STATISTICS =====

export interface UserStatistics {
  total_users: number
  active_users: number
  pending_approvals: number
  recent_logins: number
  role_distribution: Record<string, number>
  department_distribution: Record<string, number>
}