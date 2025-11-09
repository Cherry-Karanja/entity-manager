// ===== USER ROLE HISTORY ENTITY API =====

import { UserRoleHistory } from '../../types'
import { UserRoleHistoryListParams } from '../types'
import { useUserRoleHistory, useUserRoleHistoryByUser } from '../hooks'

// ===== USER ROLE HISTORY API UTILITIES =====

export const userRoleHistoryApiUtils = {
  // Format history display name
  getDisplayName: (history: UserRoleHistory): string => {
    return history.user ? `${history.user.first_name} ${history.user.last_name}`.trim() || history.user.email : 'Unknown User'
  },

  // Get action display
  getActionDisplay: (history: UserRoleHistory): string => {
    const actionMap: Record<string, string> = {
      assigned: 'Role Assigned',
      removed: 'Role Removed',
      changed: 'Role Changed',
      created: 'Role Created',
      updated: 'Role Updated',
      deleted: 'Role Deleted'
    }
    return actionMap[String(history.action)] || String(history.action)
  },

  // Get role name from history
  getRoleName: (history: UserRoleHistory): string => {
    if (history.role) {
      if (typeof history.role === 'string') {
        return String(history.role_display) || String(history.role)
      } else {
        return String((history.role as any).name)
      }
    }
    return 'Unknown Role'
  },

  // Get changed by user display
  getChangedByDisplay: (history: UserRoleHistory): string => {
    if (history.changed_by) {
      if (typeof history.changed_by === 'string') {
        return String((history as any).changed_by_display) || String(history.changed_by)
      } else {
        return `${String((history.changed_by as any).first_name)} ${String((history.changed_by as any).last_name)}`.trim() || String((history.changed_by as any).email)
      }
    }
    return 'System'
  },

  // Format change timestamp
  formatChangeDate: (history: UserRoleHistory): string => {
    return new Date(String(history.timestamp)).toLocaleString()
  },

  // Check if change was made by current user
  isChangedByCurrentUser: (history: UserRoleHistory, currentUserId: string): boolean => {
    if (typeof history.changed_by === 'string') {
      return history.changed_by === currentUserId
    } else {
      return history.changed_by?.id === currentUserId
    }
  },

  // Check if history belongs to current user
  isOwnHistory: (history: UserRoleHistory, currentUserId: string): boolean => {
    if (typeof history.user === 'string') {
      return history.user === currentUserId
    } else {
      return history.user?.id === currentUserId
    }
  },

  // Get action badge variant
  getActionBadgeVariant: (history: UserRoleHistory): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const actionVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      assigned: 'default',
      removed: 'destructive',
      changed: 'secondary',
      created: 'default',
      updated: 'secondary',
      deleted: 'destructive'
    }
    return actionVariants[String(history.action)] || 'outline'
  },

  // Get change details
  getChangeDetails: (history: UserRoleHistory): string => {
    if (history.old_values && history.new_values) {
      const oldRole = String((history.old_values as any).role_name) || 'None'
      const newRole = String((history.new_values as any).role_name) || 'None'
      return `${oldRole} → ${newRole}`
    }
    return String(history.details) || 'No details available'
  }
}

// ===== USER ROLE HISTORY PERMISSIONS =====

export const userRoleHistoryPermissions = {
  canView: (currentUser: any, history: UserRoleHistory): boolean => {
    if (!currentUser) return false
    if (currentUser.is_staff) return true
    // Users can view their own role history
    return userRoleHistoryApiUtils.isOwnHistory(history, currentUser.id)
  },

  canViewAllHistory: (currentUser: any): boolean => {
    return currentUser?.is_staff || false
  },

  canExportHistory: (currentUser: any): boolean => {
    return currentUser?.is_staff || false
  }
}

// ===== HISTORY CONSTANTS =====

export const HISTORY_ACTIONS = {
  ASSIGNED: 'assigned',
  REMOVED: 'removed',
  CHANGED: 'changed',
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted'
} as const

export type HistoryAction = typeof HISTORY_ACTIONS[keyof typeof HISTORY_ACTIONS]

export const HISTORY_CHANGE_TYPES = {
  ROLE_ASSIGNMENT: 'role_assignment',
  ROLE_REMOVAL: 'role_removal',
  PERMISSION_CHANGE: 'permission_change',
  STATUS_CHANGE: 'status_change'
} as const

export type HistoryChangeType = typeof HISTORY_CHANGE_TYPES[keyof typeof HISTORY_CHANGE_TYPES]