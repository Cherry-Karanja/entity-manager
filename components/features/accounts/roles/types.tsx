/**
 * UserRole Type Definition
 * 
 * Type definition for user roles used in role-based access control.
 */

import { BaseEntity } from '@/components/entityManager/primitives/types';

export interface UserRole extends BaseEntity {
  // Primary identifier
  id: string;
  
  // Role identification
  name: string;
  display_name: string;
  description?: string;
  
  // Status
  is_active: boolean;
  
  // Relationships
  permissions?: string[]; // Permission IDs or codenames
  users_count?: number; // Number of users with this role
  
  // Audit fields (from BaseEntity and Django models)
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  
  // Soft delete
  deleted_at?: string | null;
}

/**
 * Permission Type
 */
export interface Permission {
  id: string;
  codename: string;
  name: string;
  content_type: string;
}

/**
 * UserRole API Request/Response Types
 */
export interface CreateUserRoleRequest {
  name: string;
  display_name: string;
  description?: string;
  is_active?: boolean;
  permissions?: string[];
}

export interface UpdateUserRoleRequest {
  name?: string;
  display_name?: string;
  description?: string;
  is_active?: boolean;
  permissions?: string[];
}

export interface UserRoleListResponse {
  results: UserRole[];
  count: number;
  next?: string | null;
  previous?: string | null;
}
