// ===== USER ROLE ENTITY API =====

import { UserRole } from '../../types'
import { UserRoleListParams, UserRoleCreateRequest, UserRoleUpdateRequest } from '../types'
import { useUserRoles, useUserRole, useCreateUserRole, useUpdateUserRole, useDeleteUserRole } from '../hooks'

// ===== USER ROLE API UTILITIES =====

export const userRoleApiUtils = {
  // Format role display name
  getDisplayName: (role: UserRole): string => {
    return role.name
  },

  // Check if role is active
  isActive: (role: UserRole): boolean => {
    return role.is_active
  },

  // Get permissions count
  getPermissionsCount: (role: UserRole): number => {
    return role.permissions?.length || 0
  },

  // Get users count (if populated)
  getUsersCount: (role: UserRole): number => {
    return role.users_count || 0
  },

  // Check if role has specific permission
  hasPermission: (role: UserRole, permission: string): boolean => {
    return role.permissions?.some(p => p.codename === permission) || false
  },

  // Get role status badge variant
  getStatusBadgeVariant: (role: UserRole): 'default' | 'secondary' | 'destructive' | 'outline' => {
    return role.is_active ? 'default' : 'secondary'
  },

  // Format role creation date
  formatCreatedDate: (role: UserRole): string => {
    return new Date(role.created_at).toLocaleDateString()
  },

  // Get permission categories
  getPermissionCategories: (permissions: string[]): Record<string, string[]> => {
    const categories: Record<string, string[]> = {
      users: [],
      roles: [],
      profiles: [],
      sessions: [],
      security: [],
      other: []
    }

    permissions.forEach(permission => {
      if (permission.includes('user')) {
        categories.users.push(permission)
      } else if (permission.includes('role')) {
        categories.roles.push(permission)
      } else if (permission.includes('profile')) {
        categories.profiles.push(permission)
      } else if (permission.includes('session')) {
        categories.sessions.push(permission)
      } else if (permission.includes('security') || permission.includes('login')) {
        categories.security.push(permission)
      } else {
        categories.other.push(permission)
      }
    })

    return categories
  }
}

// ===== USER ROLE FORM UTILITIES =====

export const userRoleFormUtils = {
  // Default form values for create
  getCreateFormDefaults: (): UserRoleCreateRequest => ({
    name: '',
    description: '',
    permissions: [],
    is_active: true
  }),

  // Default form values for update
  getUpdateFormDefaults: (role: UserRole): UserRoleUpdateRequest => ({
    name: role.name,
    description: role.description || '',
    permissions: role.permissions?.map(p => p.codename) || [],
    is_active: role.is_active
  }),

  // Validate role name
  validateRoleName: (name: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!name.trim()) {
      errors.push('Role name is required')
    }

    if (name.length < 2) {
      errors.push('Role name must be at least 2 characters long')
    }

    if (name.length > 50) {
      errors.push('Role name must be less than 50 characters')
    }

    // Check for valid characters (alphanumeric, spaces, hyphens, underscores)
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      errors.push('Role name can only contain letters, numbers, spaces, hyphens, and underscores')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Validate permissions
  validatePermissions: (permissions: string[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!permissions || permissions.length === 0) {
      errors.push('At least one permission must be selected')
    }

    // Check for duplicate permissions
    const uniquePermissions = new Set(permissions)
    if (uniquePermissions.size !== permissions.length) {
      errors.push('Duplicate permissions are not allowed')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// ===== USER ROLE PERMISSIONS =====

export const userRolePermissions = {
  canCreate: (currentUser: any): boolean => {
    return currentUser?.is_staff || false
  },

  canUpdate: (currentUser: any, targetRole: UserRole): boolean => {
    if (!currentUser) return false
    if (currentUser.is_staff) return true
    // Prevent modification of system roles
    return !targetRole.is_system
  },

  canDelete: (currentUser: any, targetRole: UserRole): boolean => {
    if (!currentUser) return false
    if (currentUser.is_staff) return true
    // Prevent deletion of system roles or roles with users
    return !targetRole.is_system && (targetRole.users_count || 0) === 0
  },

  canAssignUsers: (currentUser: any): boolean => {
    return currentUser?.is_staff || false
  },

  canModifyPermissions: (currentUser: any, targetRole: UserRole): boolean => {
    if (!currentUser) return false
    if (currentUser.is_staff) return true
    // Prevent modification of system role permissions
    return !targetRole.is_system
  }
}

// ===== COMMON PERMISSIONS LIST =====

export const COMMON_PERMISSIONS = {
  // User management
  'accounts.view_user': 'View Users',
  'accounts.add_user': 'Create Users',
  'accounts.change_user': 'Edit Users',
  'accounts.delete_user': 'Delete Users',

  // Role management
  'accounts.view_userrole': 'View Roles',
  'accounts.add_userrole': 'Create Roles',
  'accounts.change_userrole': 'Edit Roles',
  'accounts.delete_userrole': 'Delete Roles',

  // Profile management
  'accounts.view_userprofile': 'View Profiles',
  'accounts.add_userprofile': 'Create Profiles',
  'accounts.change_userprofile': 'Edit Profiles',
  'accounts.delete_userprofile': 'Delete Profiles',

  // Session management
  'accounts.view_usersession': 'View Sessions',
  'accounts.add_usersession': 'Create Sessions',
  'accounts.change_usersession': 'Edit Sessions',
  'accounts.delete_usersession': 'Delete Sessions',

  // Security & Login
  'accounts.view_loginattempt': 'View Login Attempts',
  'accounts.add_loginattempt': 'Create Login Attempts',
  'accounts.change_loginattempt': 'Edit Login Attempts',
  'accounts.delete_loginattempt': 'Delete Login Attempts',

  // Audit
  'accounts.view_userrolehistory': 'View Role History',
  'accounts.add_userrolehistory': 'Create Role History',
  'accounts.change_userrolehistory': 'Edit Role History',
  'accounts.delete_userrolehistory': 'Delete Role History'
} as const

export type PermissionKey = keyof typeof COMMON_PERMISSIONS