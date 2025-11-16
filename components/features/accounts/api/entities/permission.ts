// ===== PERMISSION ENTITY API =====

import { Permission } from '../../types'
import { PermissionCreateRequest, PermissionUpdateRequest } from '../../types/permission.types'
import { usePermissions, usePermission, useCreatePermission, useUpdatePermission, useDeletePermission } from '../hooks'

// ===== PERMISSION API UTILITIES =====

export const permissionApiUtils = {
  // Format permission display name
  getDisplayName: (permission: Permission): string => {
    return `${permission.app_label}.${permission.codename}`
  },

  // Check if permission belongs to specific app
  isFromApp: (permission: Permission, appLabel: string): boolean => {
    return permission.app_label === appLabel
  },

  // Check if permission belongs to specific model
  isFromModel: (permission: Permission, appLabel: string, model: string): boolean => {
    return permission.app_label === appLabel && permission.model === model
  },

  // Get permission status (always active for permissions)
  getStatusBadgeVariant: (): 'default' | 'secondary' | 'destructive' | 'outline' => {
    return 'default'
  },

  // Format permission creation date
  formatCreatedDate: (): string => {
    return 'N/A' // Permissions don't have creation dates in Django
  },

  // Group permissions by app label
  groupByApp: (permissions: Permission[]): Record<string, Permission[]> => {
    return permissions.reduce((groups, permission) => {
      const appLabel = permission.app_label
      if (!groups[appLabel]) {
        groups[appLabel] = []
      }
      groups[appLabel].push(permission)
      return groups
    }, {} as Record<string, Permission[]>)
  },

  // Group permissions by model within apps
  groupByModel: (permissions: Permission[]): Record<string, Record<string, Permission[]>> => {
    return permissions.reduce((groups, permission) => {
      const appLabel = permission.app_label
      const model = permission.model

      if (!groups[appLabel]) {
        groups[appLabel] = {}
      }
      if (!groups[appLabel][model]) {
        groups[appLabel][model] = []
      }
      groups[appLabel][model].push(permission)
      return groups
    }, {} as Record<string, Record<string, Permission[]>>)
  },

  // Get unique app labels
  getAppLabels: (permissions: Permission[]): string[] => {
    return [...new Set(permissions.map(p => p.app_label))].sort()
  },

  // Get unique models for an app
  getModelsForApp: (permissions: Permission[], appLabel: string): string[] => {
    return [...new Set(permissions.filter(p => p.app_label === appLabel).map(p => p.model))].sort()
  }
}

// ===== PERMISSION FORM UTILITIES =====

export const permissionFormUtils = {
  // Default form values for create
  getCreateFormDefaults: (): PermissionCreateRequest => ({
    name: '',
    codename: '',
    app_label: '',
    model: ''
  }),

  // Default form values for update
  getUpdateFormDefaults: (permission: Permission): PermissionUpdateRequest => ({
    name: permission.name,
    codename: permission.codename,
    app_label: permission.app_label,
    model: permission.model
  }),

  // Validate permission codename
  validateCodename: (codename: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!codename.trim()) {
      errors.push('Codename is required')
    } else if (!/^[a-z][a-z0-9_]*$/.test(codename)) {
      errors.push('Codename must start with a lowercase letter and contain only lowercase letters, numbers, and underscores')
    }

    return { isValid: errors.length === 0, errors }
  },

  // Validate app label
  validateAppLabel: (appLabel: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!appLabel.trim()) {
      errors.push('App label is required')
    } else if (!/^[a-z][a-z0-9_]*$/.test(appLabel)) {
      errors.push('App label must start with a lowercase letter and contain only lowercase letters, numbers, and underscores')
    }

    return { isValid: errors.length === 0, errors }
  },

  // Validate model name
  validateModel: (model: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!model.trim()) {
      errors.push('Model name is required')
    } else if (!/^[a-z][a-z0-9_]*$/.test(model)) {
      errors.push('Model name must start with a lowercase letter and contain only lowercase letters, numbers, and underscores')
    }

    return { isValid: errors.length === 0, errors }
  }
}

// ===== PERMISSION HOOKS EXPORTS =====

export {
  usePermissions,
  usePermission,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission
}