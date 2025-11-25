/**
 * UserRole Type Definition
 * 
 * Type definition for user roles used in role-based access control.
 */

import { BaseEntity } from '@/components/entityManager/primitives/types';
import { Permission } from '../types';

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
  permissions?: Permission[] | number[]; // Permission objects (from API) or IDs (for form)
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
 * UserRole API Request/Response Types
 */
export interface CreateUserRoleRequest {
  name: string;
  display_name: string;
  description?: string;
  is_active?: boolean;
  permissions?: number[];
}

export interface UpdateUserRoleRequest {
  name?: string;
  display_name?: string;
  description?: string;
  is_active?: boolean;
  permissions?: number[];
}

export interface UserRoleListResponse {
  results: UserRole[];
  count: number;
  next?: string | null;
  previous?: string | null;
}
