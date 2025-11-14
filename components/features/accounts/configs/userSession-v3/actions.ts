import { EntityActionsConfig } from '@/components/entityManager/types'
import { UserSessionEntity } from './types'

// ===== USER SESSION ACTIONS CONFIGURATION =====

export const actionsConfig: EntityActionsConfig<UserSessionEntity> = {
  // Global actions (always visible)
  actions: [
    {
      id: 'refresh',
      label: 'Refresh',
      description: 'Reload the session list',
      type: 'default',
      actionType: 'immediate',
      onExecute: async () => {
        console.log('Refresh session list')
        // Refresh logic will be handled by orchestrator
      },
    },
    {
      id: 'export',
      label: 'Export',
      description: 'Export sessions to file',
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
      id: 'bulk-terminate',
      label: 'Terminate Selected',
      description: 'Terminate all selected sessions',
      type: 'default',
      danger: true,
      actionType: 'confirm',
      confirm: {
        title: 'Terminate Sessions',
        content: (sessions) => {
          const count = Array.isArray(sessions) ? sessions.length : 0
          return `Are you sure you want to terminate ${count} session(s)? Users will be logged out immediately.`
        },
        okText: 'Terminate',
        okType: 'danger',
        cancelText: 'Cancel',
        centered: true,
      },
      onExecute: async (sessions) => {
        console.log('Bulk terminate sessions:', sessions)
        // Bulk terminate API call
      },
    },
    {
      id: 'bulk-flag-suspicious',
      label: 'Flag as Suspicious',
      description: 'Mark selected sessions for security review',
      type: 'default',
      actionType: 'confirm',
      confirm: {
        title: 'Flag Sessions',
        content: (sessions) => {
          const count = Array.isArray(sessions) ? sessions.length : 0
          return `Mark ${count} session(s) for security review?`
        },
        okText: 'Flag',
        cancelText: 'Cancel',
      },
      onExecute: async (sessions) => {
        console.log('Flag sessions as suspicious:', sessions)
      },
    },
    {
      id: 'bulk-export',
      label: 'Export Selected',
      description: 'Export selected sessions',
      type: 'default',
      actionType: 'immediate',
      onExecute: async (sessions) => {
        console.log('Export selected sessions:', sessions)
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
    onBulkActionComplete: (action) => {
      console.log('Bulk action completed:', action.id)
    },
    onBulkActionError: (action, items, error) => {
      console.error('Bulk action failed:', action.id, error)
    },
  },
}
