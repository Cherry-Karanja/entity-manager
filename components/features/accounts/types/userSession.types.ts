// ===== USER SESSION ENTITY TYPES =====

import { BaseEntity } from '../../../entityManager/manager/types'
import { DeviceInfo, LocationInfo } from './common.types'

// ===== USER SESSION ENTITY =====

export interface UserSession extends BaseEntity {
  id: string // UUID
  user: string | any // Can be User object or ID
  session_key: string
  ip_address: string
  user_agent: string
  device_type: string
  device_os: string
  browser: string
  location_info?: LocationInfo
  is_active: boolean
  expires_at: string
  last_activity: string
  created_at: string
}

// ===== USER SESSION TERMINATE REQUEST =====

export interface UserSessionTerminateRequest {
  session_id: string
  reason?: string
}

// ===== USER SESSION BULK TERMINATE REQUEST =====

export interface UserSessionBulkTerminateRequest {
  session_ids: string[]
  reason?: string
}

// ===== USER SESSION STATISTICS =====

export interface UserSessionStatistics {
  total_sessions: number
  active_sessions: number
  expired_sessions: number
  device_distribution: Record<string, number>
  browser_distribution: Record<string, number>
}

// ===== USER SESSION FORM DATA =====

export interface UserSessionFormData {
  user: string
  session_key: string
  ip_address: string
  user_agent: string
  device_type: string
  device_os: string
  browser: string
  location_info?: LocationInfo
  is_active: boolean
  expires_at: string
  last_activity: string
  [key: string]: unknown // Index signature to satisfy Record<string, unknown>
}