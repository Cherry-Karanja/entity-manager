import { EntityActionsConfig } from '@/components/entityManager/types'
import { UserRoleHistoryEntity } from './types'

// ===== USER ROLE HISTORY ACTIONS CONFIGURATION =====

export const actionsConfig: EntityActionsConfig<UserRoleHistoryEntity> = {
  // Global actions (always visible)
  actions: [
    {
      id: 'refresh',
      label: 'Refresh',
      description: 'Reload the role history list',
      type: 'default',
      actionType: 'immediate',
      onExecute: async () => {
        console.log('Refresh role history list')
        // Refresh logic will be handled by orchestrator
      },
    },
    {
      id: 'export',
      label: 'Export',
      description: 'Export role history to file',
      type: 'default',
      actionType: 'modal',
      onExecute: async () => {
        console.log('Open export modal')
      },
    },
  ],
  
  // Bulk actions (only for export since this is read-only)
  bulkActions: [
    {
      id: 'bulk-export',
      label: 'Export Selected',
      description: 'Export selected role history records',
      type: 'default',
      actionType: 'async',
      onExecute: async (records) => {
        console.log('Export role history records:', records)
      },
      async: {
        loadingText: 'Exporting records...',
        successMessage: 'Records exported successfully',
        showProgress: true,
      },
    },
  ],
}
