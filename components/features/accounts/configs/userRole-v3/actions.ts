import { EntityActionsConfig } from '@/components/entityManager/types'
import { UserRoleEntity } from './types'

// ===== USER ROLE ACTIONS CONFIGURATION =====

export const actionsConfig: EntityActionsConfig<UserRoleEntity> = {
  // Global actions (always visible)
  actions: [
    {
      id: 'create',
      label: 'Create Role',
      description: 'Add a new role to the system',
      type: 'primary',
      actionType: 'navigation',
      onExecute: async () => {
        console.log('Navigate to create role form')
        // Navigation logic will be handled by orchestrator
      },
    },
    {
      id: 'refresh',
      label: 'Refresh',
      description: 'Reload the role list',
      type: 'default',
      actionType: 'immediate',
      onExecute: async () => {
        console.log('Refresh role list')
        // Refresh logic will be handled by orchestrator
      },
    },
    {
      id: 'export',
      label: 'Export',
      description: 'Export roles to file',
      type: 'default',
      actionType: 'modal',
      onExecute: async () => {
        console.log('Open export modal')
      },
    },
  ],
  
  // Bulk actions (only visible when items are selected)
  bulkActions: [
    {
      id: 'bulk-activate',
      label: 'Activate Selected',
      description: 'Activate all selected roles',
      type: 'default',
      actionType: 'async',
      onExecute: async (roles) => {
        console.log('Activate roles:', roles)
        // Bulk activate API call
      },
      async: {
        loadingText: 'Activating roles...',
        successMessage: 'Roles activated successfully',
        errorMessage: 'Failed to activate roles',
        showProgress: true,
      },
    },
    {
      id: 'bulk-deactivate',
      label: 'Deactivate Selected',
      description: 'Deactivate all selected roles',
      type: 'default',
      actionType: 'async',
      onExecute: async (roles) => {
        console.log('Deactivate roles:', roles)
      },
      async: {
        loadingText: 'Deactivating roles...',
        successMessage: 'Roles deactivated successfully',
        showProgress: true,
      },
    },
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      description: 'Delete all selected roles',
      type: 'default',
      danger: true,
      actionType: 'confirm',
      confirm: {
        title: 'Delete Roles',
        content: (roles) => {
          const count = Array.isArray(roles) ? roles.length : 0
          return `Are you sure you want to delete ${count} role(s)? This action cannot be undone.`
        },
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        centered: true,
      },
      onExecute: async (roles) => {
        console.log('Delete roles:', roles)
        // Bulk delete API call
      },
    },
    {
      id: 'bulk-assign-permissions',
      label: 'Assign Permissions',
      description: 'Assign permissions to selected roles',
      type: 'default',
      actionType: 'modal',
      onExecute: async (roles) => {
        console.log('Assign permissions to roles:', roles)
        // Modal logic will be handled by orchestrator
      },
    },
  ],
  
  // UI configuration
  maxVisibleActions: 3,
  showLabels: true,
  groupActions: false,
  showShortcuts: true,
  actionButtonVariant: 'default',
  actionButtonSize: 'default',
  dropdownPlacement: 'bottomRight',
  
  // Permissions
  permissions: {
    check: () => {
      // Permission checking logic
      return true
    },
    fallback: 'hide',
  },
  
  // Hooks
  hooks: {
    onActionStart: (action, item) => {
      console.log('Action started:', action.id, item)
    },
    onActionComplete: (action, item, result) => {
      console.log('Action completed:', action.id, result)
    },
    onActionError: (action, item, error) => {
      console.error('Action failed:', action.id, error)
    },
    onBulkActionStart: (action, items) => {
      console.log('Bulk action started:', action.id, items.length, 'items')
    },
    onBulkActionComplete: (action, items, result) => {
      console.log('Bulk action completed:', action.id)
    },
    onBulkActionError: (action, items, error) => {
      console.error('Bulk action failed:', action.id, error)
    },
  },
}
