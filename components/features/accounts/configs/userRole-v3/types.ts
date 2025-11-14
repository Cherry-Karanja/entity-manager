import { Entity } from '@/components/entityManager/types'

// ===== USER ROLE ENTITY TYPE =====

export interface UserRoleEntity extends Entity {
  id: string | number
  name: string
  display_name: string
  description?: string
  is_active: boolean
  permissions?: string[]
  permissions_count?: number
  users_count?: number
  createdAt?: string
  updatedAt?: string
  created_at?: string
  updated_at?: string
}
