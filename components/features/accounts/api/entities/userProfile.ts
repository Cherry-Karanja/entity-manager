// ===== USER PROFILE ENTITY API =====

import { UserProfile } from '../../types'
import { UserProfileListParams, UserProfileUpdateRequest } from '../types'
import { useUserProfiles, useUserProfile, useUpdateUserProfile, useApproveUserProfile, useRejectUserProfile } from '../hooks'

// ===== USER PROFILE API UTILITIES =====

export const userProfileApiUtils = {
  // Format profile display name
  getDisplayName: (profile: UserProfile): string => {
    return profile.user ? `${profile.user.first_name} ${profile.user.last_name}`.trim() || profile.user.email : 'Unknown User'
  },

  // Get profile status
  getStatus: (profile: UserProfile): string => {
    if (profile.is_approved) return 'Approved'
    if (profile.is_rejected) return 'Rejected'
    return 'Pending'
  },

  // Check if profile is complete
  isComplete: (profile: UserProfile): boolean => {
    return !!(profile.phone_number && profile.bio && profile.department && profile.job_title)
  },

  // Get completion percentage
  getCompletionPercentage: (profile: UserProfile): number => {
    const fields = ['phone_number', 'bio', 'department', 'job_title', 'preferred_language']
    const completedFields = fields.filter(field => profile[field as keyof UserProfile])
    return Math.round((completedFields.length / fields.length) * 100)
  },

  // Get profile status badge variant
  getStatusBadgeVariant: (profile: UserProfile): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (profile.is_approved) return 'default'
    if (profile.is_rejected) return 'destructive'
    return 'secondary'
  },

  // Format profile creation date
  formatCreatedDate: (profile: UserProfile): string => {
    return new Date(profile.created_at).toLocaleDateString()
  },

  // Format date of birth - not available in this profile type
  formatDateOfBirth: (profile: UserProfile): string => {
    return 'Not applicable'
  },

  // Get user email from profile
  getUserEmail: (profile: UserProfile): string => {
    return profile.user?.email || 'Unknown'
  },

  // Check if profile belongs to current user
  isOwnProfile: (profile: UserProfile, currentUserId: string): boolean => {
    return profile.user?.id === currentUserId
  }
}

// ===== USER PROFILE FORM UTILITIES =====

export const userProfileFormUtils = {
  // Default form values for update
  getUpdateFormDefaults: (profile: UserProfile): UserProfileUpdateRequest => ({
    phone_number: profile.phone_number || '',
    bio: profile.bio || '',
    department: profile.department || '',
    job_title: profile.job_title || '',
    preferred_language: profile.preferred_language || '',
    interface_theme: profile.interface_theme || 'auto',
    allow_notifications: profile.allow_notifications ?? true,
    show_email: profile.show_email ?? false,
    show_phone: profile.show_phone ?? false
  }),

  // Validate phone number
  validatePhoneNumber: (phone: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!phone.trim()) {
      errors.push('Phone number is required')
    }

    // Basic phone number validation (adjust regex as needed for your region)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (phone && !phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Please enter a valid phone number')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Validate date of birth - not applicable for this profile type
  validateDateOfBirth: (dob: string): { isValid: boolean; errors: string[] } => {
    return { isValid: true, errors: [] } // Not applicable
  },

  // Validate address - not applicable for this profile type
  validateAddress: (address: string): { isValid: boolean; errors: string[] } => {
    return { isValid: true, errors: [] } // Not applicable
  },

  // Validate emergency contact - not applicable for this profile type
  validateEmergencyContact: (contact: string): { isValid: boolean; errors: string[] } => {
    return { isValid: true, errors: [] } // Not applicable
  },

  // Validate bio
  validateBio: (bio: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (bio && bio.length > 500) {
      errors.push('Bio must be less than 500 characters')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Validate job title
  validateJobTitle: (jobTitle: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (jobTitle && jobTitle.length > 100) {
      errors.push('Job title must be less than 100 characters')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// ===== USER PROFILE PERMISSIONS =====

export const userProfilePermissions = {
  canView: (currentUser: any, profile: UserProfile): boolean => {
    if (!currentUser) return false
    if (currentUser.is_staff) return true
    // Users can view their own profile
    return userProfileApiUtils.isOwnProfile(profile, currentUser.id)
  },

  canUpdate: (currentUser: any, profile: UserProfile): boolean => {
    if (!currentUser) return false
    if (currentUser.is_staff) return true
    // Users can update their own profile
    return userProfileApiUtils.isOwnProfile(profile, currentUser.id)
  },

  canApprove: (currentUser: any): boolean => {
    return currentUser?.is_staff || false
  },

  canReject: (currentUser: any): boolean => {
    return currentUser?.is_staff || false
  },

  canViewAllProfiles: (currentUser: any): boolean => {
    return currentUser?.is_staff || false
  }
}

// ===== APPROVAL WORKFLOW CONSTANTS =====

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const

export type ApprovalStatus = typeof APPROVAL_STATUS[keyof typeof APPROVAL_STATUS]

export const APPROVAL_ACTIONS = {
  APPROVE: 'approve',
  REJECT: 'reject',
  REQUEST_CHANGES: 'request_changes'
} as const

export type ApprovalAction = typeof APPROVAL_ACTIONS[keyof typeof APPROVAL_ACTIONS]