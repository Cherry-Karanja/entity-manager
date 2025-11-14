import { Entity } from '@/components/entityManager/types'

// ===== USER ENTITY TYPE =====

export interface UserEntity extends Entity {
  id: string | number
  email: string
  firstName: string
  lastName: string
  username?: string
  role: 'admin' | 'user' | 'guest' | 'moderator'
  isActive: boolean
  phoneNumber?: string
  bio?: string
  avatar?: string
  dateJoined?: string
  createdAt?: string
  updatedAt?: string
}
