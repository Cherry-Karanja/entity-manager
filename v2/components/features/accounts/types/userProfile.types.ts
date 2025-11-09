// ===== USER PROFILE ENTITY TYPES =====

import { BaseEntity } from '../../../entityManager/manager/types'
import { UserStatus, ThemePreference } from './common.types'

// ===== USER PROFILE ENTITY =====

export interface UserProfile extends BaseEntity {
  id: string // UUID
  user: string | any // Can be User object or ID
  bio: string
  phone_number: string
  department: string
  job_title: string
  status: UserStatus
  approved_by?: string | any // Can be User object or ID
  approved_at?: string
  preferred_language: string
  interface_theme: ThemePreference
  allow_notifications: boolean
  show_email: boolean
  show_phone: boolean
  created_at: string
  updated_at: string
}

// ===== USER PROFILE FORM DATA =====

export interface UserProfileFormData {
  bio: string
  phone_number: string
  department: string
  job_title: string
  preferred_language: string
  interface_theme: ThemePreference
  allow_notifications: boolean
  show_email: boolean
  show_phone: boolean
  [key: string]: unknown // Index signature to satisfy Record<string, unknown>
}

// ===== USER PROFILE UPDATE DATA =====

export interface UserProfileUpdateData extends Partial<UserProfileFormData> {
  id: string
}

// ===== USER PROFILE APPROVAL REQUEST =====

export interface UserProfileApprovalRequest {
  profile_id: string
  action: 'approve' | 'reject' | 'suspend'
  reason?: string
}