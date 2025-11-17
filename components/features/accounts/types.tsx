/**
 * Accounts Module Types
 * 
 * Type definitions for the accounts module based on Django backend models.
 */

import { BaseEntity } from '@/components/entityManager/primitives/types';

// ===========================
// User Role Types
// ===========================

export interface UserRole extends BaseEntity {
  id: string;
  name: string;
  display_name: string;
  description: string;
  is_active: boolean;
  permissions: Permission[];
  permissions_count: number;
  users_count: number;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface Permission {
  id: number;
  name: string;
  codename: string;
  app_label: string;
  model: string;
  content_type_name: string;
}

// ===========================
// User Profile Types
// ===========================

export interface UserProfile extends BaseEntity {
  id: string;
  user: string; // User ID
  user_email?: string;
  user_full_name?: string;
  bio: string;
  phone_number: string;
  department: string;
  job_title: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  approved_by?: string;
  approved_at?: string;
  preferred_language: string;
  interface_theme: 'light' | 'dark' | 'auto';
  allow_notifications: boolean;
  show_email: boolean;
  show_phone: boolean;
  notification_preferences?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ===========================
// User Types
// ===========================

export interface User extends BaseEntity {
  id: string | number;
  email: string;
  first_name: string;
  last_name: string;
  username?: string;
  full_name: string;
  
  // Role & Organization
  role?: string; // Role ID
  role_display?: string;
  employee_id?: string;
  department?: string;
  phone_number?: string;
  job_title?: string;
  
  // Status & Permissions
  is_active: boolean;
  is_approved: boolean;
  is_verified: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_staff_member?: boolean;
  
  // Security
  failed_login_attempts: number;
  account_locked_until?: string | null;
  last_login_ip?: string;
  must_change_password: boolean;
  password_changed_at?: string;
  
  // Two-Factor Auth
  otp_enabled?: boolean;
  backup_codes_count?: number;
  
  // Timestamps
  date_joined: string;
  last_login?: string | null;
  created_at: string;
  updated_at?: string;
  
  // Profile & Location
  profile?: UserProfile;
  location?: string;
  profile_picture?: string;
  date_of_birth?: string;
  ward?: string;
  constituency?: string;
  county?: string;
  
  // Permissions
  permissions?: Permission[];
  role_permissions?: Record<string, string[]>;
}

// ===========================
// User Session Types
// ===========================

export interface UserSession extends BaseEntity {
  id: string | number;
  user: string; // User ID
  user_email: string;
  user_full_name: string;
  session_key: string;
  ip_address: string;
  user_agent: string;
  is_active: boolean;
  is_expired: boolean;
  is_current_session: boolean;
  expires_at: string;
  device_type?: string;
  device_os?: string;
  browser?: string;
  location_info?: Record<string, unknown>;
  device_info?: Record<string, unknown>;
  risk_score?: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

// ===========================
// Login Attempt Types
// ===========================

export interface LoginAttempt extends BaseEntity {
  id: string | number;
  user?: string; // User ID
  user_email: string;
  user_full_name?: string;
  email: string;
  ip_address: string;
  success: boolean;
  user_agent: string;
  failure_reason?: string;
  location_info?: Record<string, unknown>;
  device_type?: string;
  device_os?: string;
  browser?: string;
  session_id?: string;
  created_at: string;
  updated_at: string;
}

// ===========================
// User Role History Types
// ===========================

export interface UserRoleHistory extends BaseEntity {
  id: string | number;
  user: string; // User ID
  user_full_name: string;
  old_role?: UserRole;
  new_role?: UserRole;
  changed_by?: string; // User ID
  changed_by_name?: string;
  reason?: string;
  created_at: string;
}

// ===========================
// Request/Response Types
// ===========================

export interface UserCreateRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password2?: string;
  role_name?: string;
  employee_id?: string;
  department?: string;
  phone_number?: string;
  is_active?: boolean;
  is_approved?: boolean;
}

export interface UserUpdateRequest {
  first_name?: string;
  last_name?: string;
  role_name?: string;
  employee_id?: string;
  is_active?: boolean;
  is_approved?: boolean;
  is_verified?: boolean;
  must_change_password?: boolean;
}

export interface UserRoleChangeRequest {
  role_name: string;
}

export interface UserApprovalRequest {
  is_approved: boolean;
}

export interface UserPermissionUpdateRequest {
  permissions: string[]; // Array of permission codenames
}

// ===========================
// Two-Factor Auth Types
// ===========================

export interface TwoFactorSetupResponse {
  qr_code: string;
  secret: string;
  backup_codes: string[];
}

export interface TwoFactorVerifyRequest {
  token: string;
}

export interface TwoFactorStatusResponse {
  enabled: boolean;
  backup_codes_count: number;
}

// ===========================
// Statistics Types
// ===========================

export interface UserStatistics {
  total_users: number;
  active_users: number;
  approved_users: number;
  pending_approval: number;
  verified_users: number;
  users_with_2fa: number;
  locked_accounts: number;
  recent_signups: number;
  recent_logins: number;
  users_by_role: Record<string, number>;
}

// ===========================
// Filter Types
// ===========================

export interface UserFilters {
  search?: string;
  role_name?: string;
  is_active?: boolean;
  is_approved?: boolean;
  is_verified?: boolean;
  is_staff?: boolean;
  department?: string;
  ordering?: string;
}

export interface UserSessionFilters {
  is_active?: boolean;
  user?: string | number;
  ordering?: string;
}

export interface LoginAttemptFilters {
  success?: boolean;
  email?: string;
  user?: string | number;
  ordering?: string;
}

// ===========================
// Bulk Action Types
// ===========================

export interface BulkUserActionRequest {
  user_ids: (string | number)[];
  action: 'approve' | 'reject' | 'activate' | 'deactivate' | 'delete' | 'assign_role';
  role_name?: string; // For assign_role action
}

// ===========================
// Export Types
// ===========================

export type { User as AccountUser };
export type { UserRole as AccountRole };
export type { UserProfile as AccountProfile };
export type { UserSession as AccountSession };
export type { LoginAttempt as AccountLoginAttempt };
