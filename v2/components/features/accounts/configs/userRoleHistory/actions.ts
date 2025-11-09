// ===== USER ROLE HISTORY ACTIONS CONFIGURATION =====

import { EntityAction } from '@/components/entityManager/EntityActions/types'
import { UserRoleHistory } from '../../types'

// ===== ITEM ACTIONS =====

export const userRoleHistoryItemActions: EntityAction[] = [
  {
    id: 'view_details',
    label: 'View Details',
    type: 'default',
    actionType: 'navigation'
  }
]

// ===== BULK ACTIONS =====

export const userRoleHistoryBulkActions: EntityAction[] = [
  {
    id: 'export_selected',
    label: 'Export Selected',
    type: 'default',
    actionType: 'async'
  }
]
