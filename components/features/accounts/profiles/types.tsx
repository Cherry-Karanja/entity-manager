/**
 * UserProfile Type Definition
 * 
 * Type definition for user profiles with extended information.
 */

import { BaseEntity } from '@/components/entityManager/primitives/types';

export interface UserProfile extends BaseEntity {
  // Primary identifier
  id: string;
  
  // User relationship
  user_id: string;
  user_email?: string;
  user_name?: string;
  
  // Profile information
  bio?: string;
  phone_number?: string;
  department?: string;
  job_title?: string;
  
  // Avatar
  avatar?: string | null;
  avatar_url?: string | null;
  
  // Status
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  
  // Approval tracking
  approved_by?: string;
  approved_by_name?: string;
  approved_at?: string | null;
  
  // Preferences
  preferred_language: string;
  interface_theme: 'light' | 'dark' | 'auto';
  allow_notifications: boolean;
  
  // Privacy
  show_email: boolean;
  show_phone: boolean;
  
  // Audit fields
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  
  // Soft delete
  deleted_at?: string | null;
}

/**
 * UserProfile API Request/Response Types
 */
export interface CreateUserProfileRequest {
  user_id: string;
  bio?: string;
  phone_number?: string;
  department?: string;
  job_title?: string;
  avatar?: File | null;
  preferred_language?: string;
  interface_theme?: 'light' | 'dark' | 'auto';
  allow_notifications?: boolean;
  show_email?: boolean;
  show_phone?: boolean;
}

export interface UpdateUserProfileRequest {
  bio?: string;
  phone_number?: string;
  department?: string;
  job_title?: string;
  avatar?: File | null;
  preferred_language?: string;
  interface_theme?: 'light' | 'dark' | 'auto';
  allow_notifications?: boolean;
  show_email?: boolean;
  show_phone?: boolean;
}

export interface UserProfileListResponse {
  results: UserProfile[];
  count: number;
  next?: string | null;
  previous?: string | null;
}
