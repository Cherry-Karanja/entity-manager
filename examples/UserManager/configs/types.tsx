import { BaseEntity } from '../../../components/entityManager/manager/types'

// ===== USER TYPES =====

export interface User extends BaseEntity {
  id: number
  first_name: string
  last_name: string
  email: string
  phone_number: string
  national_id: string
  user_type: 'admin' | 'tenant' | 'landlord' | 'caretaker' | 'property_manager'
  is_active: boolean
  date_joined: string
  updated_at: string
  get_full_name: string
}

export interface UserFormData {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  national_id: string
  user_type: 'admin' | 'tenant' | 'landlord' | 'caretaker' | 'property_manager'
  is_active: boolean
  [key: string]: unknown // Index signature to satisfy Record<string, unknown>
}