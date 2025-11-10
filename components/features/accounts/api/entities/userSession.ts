// ===== USER SESSION ENTITY API =====

import { UserSession } from '../../types'
import { UserSessionListParams, UserSessionTerminateRequest } from '../types'
import { useUserSessions, useUserSession, useTerminateUserSession, useTerminateAllUserSessions } from '../hooks'

// ===== USER SESSION API UTILITIES =====

export const userSessionApiUtils = {
  // Format session display name
  getDisplayName: (session: UserSession): string => {
    return session.user ? `${session.user.first_name} ${session.user.last_name}`.trim() || session.user.email : 'Unknown User'
  },

  // Check if session is active
  isActive: (session: UserSession): boolean => {
    return session.is_active && !session.is_expired
  },

  // Get session status
  getStatus: (session: UserSession): string => {
    if (!session.is_active) return 'Inactive'
    if (session.is_expired) return 'Expired'
    return 'Active'
  },

  // Get device type display
  getDeviceTypeDisplay: (session: UserSession): string => {
    const deviceMap: Record<string, string> = {
      desktop: 'Desktop',
      mobile: 'Mobile',
      tablet: 'Tablet',
      unknown: 'Unknown'
    }
    return deviceMap[session.device_type] || 'Unknown'
  },

  // Get browser type display
  getBrowserTypeDisplay: (session: UserSession): string => {
    const browserMap: Record<string, string> = {
      chrome: 'Chrome',
      firefox: 'Firefox',
      safari: 'Safari',
      edge: 'Edge',
      opera: 'Opera',
      unknown: 'Unknown'
    }
    return browserMap[String(session.browser_type)] || 'Unknown'
  },

  // Format session creation date
  formatCreatedDate: (session: UserSession): string => {
    return new Date(session.created_at).toLocaleString()
  },

  // Format last activity
  formatLastActivity: (session: UserSession): string => {
    return session.last_activity ? new Date(session.last_activity).toLocaleString() : 'Never'
  },

  // Format expiry date
  formatExpiryDate: (session: UserSession): string => {
    return session.expires_at ? new Date(session.expires_at).toLocaleString() : 'Never'
  },

  // Check if session is current user's session
  isCurrentSession: (session: UserSession, currentSessionId: string): boolean => {
    return session.id === currentSessionId
  },

  // Get session status badge variant
  getStatusBadgeVariant: (session: UserSession): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (session.is_active && !session.is_expired) return 'default'
    return 'secondary'
  },

  // Calculate session duration
  getSessionDuration: (session: UserSession): string => {
    if (!session.created_at) return 'Unknown'

    const created = new Date(session.created_at)
    const end = session.last_activity ? new Date(session.last_activity) : new Date()
    const duration = end.getTime() - created.getTime()

    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }
}

// ===== USER SESSION FORM UTILITIES =====

export const userSessionFormUtils = {
  // Default form values for terminate
  getTerminateFormDefaults: (): UserSessionTerminateRequest => ({
    reason: ''
  }),

  // Validate termination reason
  validateTerminationReason: (reason: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (reason && reason.length > 200) {
      errors.push('Reason must be less than 200 characters')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// ===== USER SESSION PERMISSIONS =====

export const userSessionPermissions = {
  canView: (currentUser: any, session: UserSession): boolean => {
    if (!currentUser) return false
    if (currentUser.is_staff) return true
    // Users can view their own sessions
    return session.user?.id === currentUser.id
  },

  canTerminate: (currentUser: any, session: UserSession): boolean => {
    if (!currentUser) return false
    if (currentUser.is_staff) return true
    // Users can terminate their own sessions (except current)
    return session.user?.id === currentUser.id && !userSessionApiUtils.isCurrentSession(session, currentUser.current_session_id)
  },

  canTerminateAll: (currentUser: any, targetUserId: string): boolean => {
    if (!currentUser) return false
    if (currentUser.is_staff) return true
    // Users can terminate all their own sessions
    return currentUser.id === targetUserId
  },

  canViewAllSessions: (currentUser: any): boolean => {
    return currentUser?.is_staff || false
  }
}

// ===== SESSION CONSTANTS =====

export const SESSION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired'
} as const

export type SessionStatus = typeof SESSION_STATUS[keyof typeof SESSION_STATUS]

export const DEVICE_TYPES = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
  TABLET: 'tablet',
  UNKNOWN: 'unknown'
} as const

export type DeviceType = typeof DEVICE_TYPES[keyof typeof DEVICE_TYPES]

export const BROWSER_TYPES = {
  CHROME: 'chrome',
  FIREFOX: 'firefox',
  SAFARI: 'safari',
  EDGE: 'edge',
  OPERA: 'opera',
  UNKNOWN: 'unknown'
} as const

export type BrowserType = typeof BROWSER_TYPES[keyof typeof BROWSER_TYPES]