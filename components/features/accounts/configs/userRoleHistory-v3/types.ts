import { Entity } from '@/components/entityManager/types'

// ===== USER ROLE HISTORY ENTITY TYPE =====

export interface UserRoleHistoryEntity extends Entity {
  id: string | number
  user: string
  old_role: string | null
  new_role: string | null
  changed_by: string | null
  reason: string
  created_at: string
}
