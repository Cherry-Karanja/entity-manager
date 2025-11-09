// ===== USER ENTITY API =====

import { User } from '../../types'
import { UserListParams, UserCreateRequest, UserUpdateRequest, UserChangePasswordRequest } from '../types'
import { useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser, useChangeUserPassword, useActivateUser, useDeactivateUser } from '../hooks'

// ===== USER API UTILITIES =====

export const userApiUtils = {
  // Format user display name
  getDisplayName: (user: User): string => {
    return `${user.first_name} ${user.last_name}`.trim() || user.email
  },

  // Check if user is active
  isActive: (user: User): boolean => {
    return user.is_active
  },

  // Get user role names
  getRoleNames: (user: User): string[] => {
    if (user.role) {
      if (typeof user.role === 'string') {
        return [user.role_display || user.role]
      } else {
        return [user.role.name]
      }
    }
    return []
  },

  // Check if user has specific role
  hasRole: (user: User, roleName: string): boolean => {
    if (user.role) {
      if (typeof user.role === 'string') {
        return user.role_display === roleName || user.role === roleName
      } else {
        return user.role.name === roleName
      }
    }
    return false
  },

  // Get user status badge variant
  getStatusBadgeVariant: (user: User): 'default' | 'secondary' | 'destructive' | 'outline' => {
    return user.is_active ? 'default' : 'secondary'
  },

  // Format user creation date
  formatCreatedDate: (user: User): string => {
    return new Date(user.created_at).toLocaleDateString()
  },

  // Format user last login
  formatLastLogin: (user: User): string => {
    return user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'
  }
}

// ===== USER FORM UTILITIES =====

export const userFormUtils = {
  // Default form values for create
  getCreateFormDefaults: (): UserCreateRequest => ({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role_name: '',
    is_active: true
  }),

  // Default form values for update
  getUpdateFormDefaults: (user: User): UserUpdateRequest => ({
    first_name: user.first_name,
    last_name: user.last_name,
    is_active: user.is_active,
    email: user.email
  }),

  // Password change form defaults
  getPasswordChangeDefaults: (): UserChangePasswordRequest => ({
    old_password: '',
    new_password: '',
    confirm_password: ''
  }),

  // Validate password strength
  validatePassword: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Validate email format
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

// ===== USER PERMISSIONS =====

export const userPermissions = {
  canCreate: (currentUser: User | null): boolean => {
    return currentUser?.is_staff || userApiUtils.hasRole(currentUser!, 'Admin') || false
  },

  canUpdate: (currentUser: User | null, targetUser: User): boolean => {
    if (!currentUser) return false
    if (currentUser.is_staff) return true
    if (userApiUtils.hasRole(currentUser, 'Admin')) return true
    // Users can update their own profile
    return currentUser.id === targetUser.id
  },

  canDelete: (currentUser: User | null, targetUser: User): boolean => {
    if (!currentUser) return false
    if (currentUser.is_staff) return true
    if (userApiUtils.hasRole(currentUser, 'Admin')) return true
    // Prevent self-deletion
    return currentUser.id !== targetUser.id
  },

  canChangePassword: (currentUser: User | null, targetUser: User): boolean => {
    if (!currentUser) return false
    if (currentUser.is_staff) return true
    if (userApiUtils.hasRole(currentUser, 'Admin')) return true
    // Users can change their own password
    return currentUser.id === targetUser.id
  },

  canActivate: (currentUser: User | null): boolean => {
    return currentUser?.is_staff || userApiUtils.hasRole(currentUser!, 'Admin') || false
  },

  canDeactivate: (currentUser: User | null, targetUser: User): boolean => {
    if (!currentUser) return false
    if (currentUser.is_staff) return true
    if (userApiUtils.hasRole(currentUser, 'Admin')) return true
    // Prevent self-deactivation
    return currentUser.id !== targetUser.id
  }
}