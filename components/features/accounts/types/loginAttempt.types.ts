// ===== LOGIN ATTEMPT ENTITY TYPES =====

import { BaseEntity } from '../../../entityManager/manager/types'
import { DeviceInfo, LocationInfo } from './common.types'

// ===== LOGIN ATTEMPT ENTITY =====

export interface LoginAttempt extends BaseEntity {
  id: string // UUID
  email: string
  user?: string | any // Can be User object or ID
  ip_address: string
  user_agent: string
  session_id: string
  failure_reason: string
  location_info?: LocationInfo
  device_type: string
  device_os: string
  browser: string
  success: boolean
  created_at: string
}

// ===== LOGIN ATTEMPT FORM DATA =====

export interface LoginAttemptFormData extends Record<string, unknown> {
  email: string
  user?: string
  ip_address: string
  user_agent: string
  session_id: string
  failure_reason: string
  location_info?: LocationInfo
  device_type: string
  device_os: string
  browser: string
  success: boolean
  created_at: string
}

// ===== LOGIN ATTEMPT STATISTICS =====

export interface LoginAttemptStatistics {
  total_attempts: number
  successful_attempts: number
  failed_attempts: number
  failure_rate: number
  recent_failures: number
  top_failure_reasons: Record<string, number>
  suspicious_ips: string[]
  device_distribution: Record<string, number>
}

// ===== LOGIN ATTEMPT FILTERS =====

export interface LoginAttemptFilters {
  email?: string
  success?: boolean
  ip_address?: string
  device_type?: string
  date_from?: string
  date_to?: string
}