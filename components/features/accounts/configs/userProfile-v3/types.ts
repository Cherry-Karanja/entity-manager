import { Entity } from '@/components/entityManager/types'

// ===== USER PROFILE ENTITY TYPE =====

export interface UserProfileEntity extends Entity {
  id: string
  user: string | any // Can be User object or ID
  bio: string
  phone_number: string
  department: string
  job_title: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  approved_by?: string | any // Can be User object or ID
  approved_at?: string
  preferred_language: string
  interface_theme: 'light' | 'dark' | 'system'
  allow_notifications: boolean
  show_email: boolean
  show_phone: boolean
  created_at?: string
  updated_at?: string
}
