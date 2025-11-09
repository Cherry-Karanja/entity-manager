// ===== ACCOUNTS API TYPES =====

import { User, UserRole, UserProfile, UserSession, LoginAttempt, UserRoleHistory } from '../types'

// ===== PAGINATION TYPES =====

export interface PaginationMeta {
  count: number
  next: string | null
  previous: string | null
  current_page: number
  total_pages: number
  page_size: number
}

export interface PaginatedResponse<T> {
  results: T[]
  meta: PaginationMeta
}

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ListResponse<T> extends PaginatedResponse<T> {
  filters?: Record<string, any>
  ordering?: string[]
}

// ===== ENTITY-SPECIFIC API TYPES =====

// User API Types
export interface UserListParams {
  search?: string
  is_active?: boolean
  role?: string
  ordering?: string
  page?: number
  page_size?: number
}

export interface UserCreateRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  role_name: string
  is_active?: boolean
}

export interface UserUpdateRequest {
  first_name?: string
  last_name?: string
  is_active?: boolean
  email?: string
}

export interface UserChangePasswordRequest {
  old_password: string
  new_password: string
  confirm_password: string
}

// UserRole API Types
export interface UserRoleListParams {
  search?: string
  is_active?: boolean
  ordering?: string
  page?: number
  page_size?: number
}

export interface UserRoleCreateRequest {
  name: string
  description?: string
  permissions: string[]
  is_active?: boolean
}

export interface UserRoleUpdateRequest {
  name?: string
  description?: string
  permissions?: string[]
  is_active?: boolean
}

// UserProfile API Types
export interface UserProfileListParams {
  search?: string
  user__is_active?: boolean
  ordering?: string
  page?: number
  page_size?: number
}

export interface UserProfileUpdateRequest {
  phone_number?: string
  bio?: string
  department?: string
  job_title?: string
  preferred_language?: string
  interface_theme?: string
  allow_notifications?: boolean
  show_email?: boolean
  show_phone?: boolean
}

// UserSession API Types
export interface UserSessionListParams {
  user?: string
  is_active?: boolean
  device_type?: string
  ordering?: string
  page?: number
  page_size?: number
}

export interface UserSessionTerminateRequest {
  reason?: string
}

// LoginAttempt API Types
export interface LoginAttemptListParams {
  user?: string
  success?: boolean
  ip_address?: string
  ordering?: string
  page?: number
  page_size?: number
}

// UserRoleHistory API Types
export interface UserRoleHistoryListParams {
  user?: string
  role?: string
  changed_by?: string
  ordering?: string
  page?: number
  page_size?: number
}

// ===== AUTHENTICATION TYPES =====

export interface LoginRequest {
  email: string
  password: string
  remember_me?: boolean
}

export interface LoginResponse {
  user: User
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
  expires_in: number
}

// ===== BULK OPERATIONS TYPES =====

export interface BulkOperationRequest {
  ids: string[]
  action: 'activate' | 'deactivate' | 'delete'
}

export interface BulkOperationResponse {
  success_count: number
  failure_count: number
  errors?: Record<string, string>
}

// ===== EXPORT/IMPORT TYPES =====

export interface ExportRequest {
  format: 'csv' | 'xlsx' | 'json'
  fields?: string[]
  filters?: Record<string, any>
}

export interface ImportResponse {
  imported_count: number
  skipped_count: number
  errors?: Record<string, string>
}

// ===== AUDIT TYPES =====

export interface AuditLogEntry {
  id: string
  user: string
  action: string
  resource: string
  resource_id: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  ip_address: string
  user_agent: string
  timestamp: string
}

export interface AuditLogParams {
  user?: string
  action?: string
  resource?: string
  date_from?: string
  date_to?: string
  ordering?: string
  page?: number
  page_size?: number
}

// ===== RE-EXPORT ENTITY TYPES =====

export type { User, UserRole, UserProfile, UserSession, LoginAttempt, UserRoleHistory }