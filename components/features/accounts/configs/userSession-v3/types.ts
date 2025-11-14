import { Entity } from '@/components/entityManager/types'

// ===== USER SESSION ENTITY TYPE =====

export interface UserSessionEntity extends Entity {
  id: string | number
  user: string
  session_key: string
  ip_address: string
  user_agent: string
  device_type: string
  device_os: string
  browser: string
  location_info?: Record<string, any>
  is_active: boolean
  expires_at: string
  last_activity: string
  created_at?: string
}
