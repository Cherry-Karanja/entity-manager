// ===== LOGIN ATTEMPT ENTITY API =====

import { LoginAttempt } from '../../types'
import { LoginAttemptListParams } from '../types'
import { useLoginAttempts, useLoginAttempt } from '../hooks'

// ===== LOGIN ATTEMPT API UTILITIES =====

export const loginAttemptApiUtils = {
  // Format attempt display name
  getDisplayName: (attempt: LoginAttempt): string => {
    return attempt.user ? `${attempt.user.first_name} ${attempt.user.last_name}`.trim() || attempt.user.email : attempt.email || 'Unknown'
  },

  // Check if attempt was successful
  isSuccessful: (attempt: LoginAttempt): boolean => {
    return attempt.success
  },

  // Get attempt status
  getStatus: (attempt: LoginAttempt): string => {
    return attempt.success ? 'Success' : 'Failed'
  },

  // Get device type display
  getDeviceTypeDisplay: (attempt: LoginAttempt): string => {
    const deviceMap: Record<string, string> = {
      desktop: 'Desktop',
      mobile: 'Mobile',
      tablet: 'Tablet',
      unknown: 'Unknown'
    }
    return deviceMap[String(attempt.device_type)] || 'Unknown'
  },

  // Get browser type display
  getBrowserTypeDisplay: (attempt: LoginAttempt): string => {
    const browserMap: Record<string, string> = {
      chrome: 'Chrome',
      firefox: 'Firefox',
      safari: 'Safari',
      edge: 'Edge',
      opera: 'Opera',
      unknown: 'Unknown'
    }
    return browserMap[String(attempt.browser_type)] || 'Unknown'
  },

  // Format attempt timestamp
  formatAttemptDate: (attempt: LoginAttempt): string => {
    return new Date(String(attempt.timestamp)).toLocaleString()
  },

  // Get IP address display
  getIPAddressDisplay: (attempt: LoginAttempt): string => {
    return attempt.ip_address || 'Unknown'
  },

  // Check if attempt is suspicious
  isSuspicious: (attempt: LoginAttempt): boolean => {
    // Consider failed attempts from different IPs or unusual patterns as suspicious
    return !attempt.success && attempt.failure_reason !== 'invalid_credentials'
  },

  // Get failure reason display
  getFailureReasonDisplay: (attempt: LoginAttempt): string => {
    if (attempt.success) return 'N/A'

    const reasonMap: Record<string, string> = {
      invalid_credentials: 'Invalid credentials',
      account_locked: 'Account locked',
      account_inactive: 'Account inactive',
      ip_blocked: 'IP blocked',
      too_many_attempts: 'Too many attempts',
      unknown: 'Unknown'
    }

    return reasonMap[attempt.failure_reason] || 'Unknown'
  },

  // Get status badge variant
  getStatusBadgeVariant: (attempt: LoginAttempt): 'default' | 'secondary' | 'destructive' | 'outline' => {
    return attempt.success ? 'default' : 'destructive'
  },

  // Check if attempt belongs to current user
  isOwnAttempt: (attempt: LoginAttempt, currentUserId: string): boolean => {
    return attempt.user?.id === currentUserId
  }
}

// ===== LOGIN ATTEMPT PERMISSIONS =====

export const loginAttemptPermissions = {
  canView: (currentUser: any, attempt: LoginAttempt): boolean => {
    if (!currentUser) return false
    if (currentUser.is_staff) return true
    // Users can view their own login attempts
    return loginAttemptApiUtils.isOwnAttempt(attempt, currentUser.id)
  },

  canViewAllAttempts: (currentUser: any): boolean => {
    return currentUser?.is_staff || false
  },

  canExportAttempts: (currentUser: any): boolean => {
    return currentUser?.is_staff || false
  }
}

// ===== LOGIN ATTEMPT CONSTANTS =====

export const LOGIN_ATTEMPT_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed'
} as const

export type LoginAttemptStatus = typeof LOGIN_ATTEMPT_STATUS[keyof typeof LOGIN_ATTEMPT_STATUS]

export const FAILURE_REASONS = {
  INVALID_CREDENTIALS: 'invalid_credentials',
  ACCOUNT_LOCKED: 'account_locked',
  ACCOUNT_INACTIVE: 'account_inactive',
  IP_BLOCKED: 'ip_blocked',
  TOO_MANY_ATTEMPTS: 'too_many_attempts',
  UNKNOWN: 'unknown'
} as const

export type FailureReason = typeof FAILURE_REASONS[keyof typeof FAILURE_REASONS]

export const SECURITY_THRESHOLDS = {
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 30,
  SUSPICIOUS_IP_THRESHOLD: 3,
  MONITORING_WINDOW_HOURS: 24
} as const