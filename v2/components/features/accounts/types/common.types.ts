// ===== COMMON TYPES FOR ACCOUNTS MODULE =====

import { BaseEntity } from '../../../entityManager/manager/types'

// ===== ENUMS & CONSTANTS =====

export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended'
export type ThemePreference = 'light' | 'dark' | 'auto'
export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'unknown'
export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown'

// ===== SHARED INTERFACES =====

export interface Permission {
  id: number
  name: string
  codename: string
  app_label: string
  model: string
}

export interface LocationInfo {
  country?: string
  region?: string
  city?: string
  latitude?: number
  longitude?: number
  timezone?: string
}

export interface DeviceInfo {
  type: DeviceType
  os: string
  browser: BrowserType
  user_agent: string
}

export interface AuditInfo {
  created_by?: string | BaseEntity
  updated_by?: string | BaseEntity
  created_at: string
  updated_at: string
}

// ===== FORM DATA TYPES =====

export interface BaseFormData {
  [key: string]: unknown
}

// ===== API RESPONSE TYPES =====

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiError {
  detail?: string
  [key: string]: unknown
}

// ===== UTILITY TYPES =====

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>