import { EntityActionsConfig } from '@/components/entityManager/types'
import { UserEntity } from './types'

// ===== USER ACTIONS CONFIGURATION =====

export const actionsConfig: EntityActionsConfig<UserEntity> = {
  // Global actions (always visible)
  actions: [
    {
      id: 'create',
      label: 'Create User',
      description: 'Add a new user to the system',
      type: 'primary',
      actionType: 'navigation',
      onExecute: async (_, context) => {
        console.log('Navigate to create user form')
        // Navigation logic will be handled by orchestrator
      },
    },
    {
      id: 'refresh',
      label: 'Refresh',
      description: 'Reload the user list',
      type: 'default',
      actionType: 'immediate',
      onExecute: async (_, context) => {
        console.log('Refresh user list')
        // Refresh logic will be handled by orchestrator
      },
    },
    {
      id: 'export',
      label: 'Export',
      description: 'Export users to file',
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
      description: 'Activate all selected users',
      type: 'default',
      actionType: 'async',
      condition: (item, context) => {
        // Only show if at least one inactive user is selected
        return true
      },
      onExecute: async (users) => {
        console.log('Activate users:', users)
        // Bulk activate API call
      },
      async: {
        loadingText: 'Activating users...',
        successMessage: (_, result) => 'Users activated successfully',
        errorMessage: (_, error) => `Failed to activate users: ${error}`,
        showProgress: true,
      },
    },
    {
      id: 'bulk-deactivate',
      label: 'Deactivate Selected',
      description: 'Deactivate all selected users',
      type: 'default',
      actionType: 'async',
      onExecute: async (users) => {
        console.log('Deactivate users:', users)
      },
      async: {
        loadingText: 'Deactivating users...',
        successMessage: 'Users deactivated successfully',
        showProgress: true,
      },
    },
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      description: 'Delete all selected users',
      type: 'default',
      danger: true,
      actionType: 'confirm',
      confirm: {
        title: 'Delete Users',
        content: (users) => {
          const count = Array.isArray(users) ? users.length : 0
          return `Are you sure you want to delete ${count} user(s)? This action cannot be undone.`
        },
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        centered: true,
      },
      onExecute: async (users) => {
        console.log('Delete users:', users)
        // Bulk delete API call
      },
    },
    {
      id: 'bulk-change-role',
      label: 'Change Role',
      description: 'Change role for selected users',
      type: 'default',
      actionType: 'form',
      form: {
        title: 'Change User Role',
        width: 400,
        fields: [
          {
            name: 'role',
            label: 'New Role',
            type: 'select',
            required: true,
            options: [
              { value: 'admin', label: 'Administrator' },
              { value: 'user', label: 'User' },
              { value: 'guest', label: 'Guest' },
              { value: 'moderator', label: 'Moderator' },
            ],
          },
        ],
        submitText: 'Change Role',
        onSubmit: async (values, users) => {
          console.log('Change role to:', values.role, 'for users:', users)
        },
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
    check: (permission: string) => {
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
