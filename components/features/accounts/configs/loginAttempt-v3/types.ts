import { Entity } from '@/components/entityManager/types'

// ===== LOGIN ATTEMPT ENTITY TYPE =====

export interface LoginAttemptEntity extends Entity {
  id: string
  email: string
  user?: string | any
  ipAddress: string
  userAgent: string
  sessionId: string
  failureReason: string
  locationInfo?: Record<string, any>
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  deviceOs: string
  browser: string
  success: boolean
  createdAt: string
}
