import { EntityActionsConfig } from '@/components/entityManager/types'
import { LoginAttemptEntity } from './types'

// ===== LOGIN ATTEMPT ACTIONS CONFIGURATION =====

export const actionsConfig: EntityActionsConfig<LoginAttemptEntity> = {
  // Actions include both global and item-level actions
  actions: [
    // Global actions
    {
      id: 'refresh',
      label: 'Refresh',
      description: 'Reload the login attempts list',
      type: 'default',
      actionType: 'immediate',
      onExecute: async () => {
        console.log('Refresh login attempts list')
        // Refresh logic will be handled by orchestrator
      },
    },
    {
      id: 'export',
      label: 'Export',
      description: 'Export login attempts to file',
      type: 'default',
      actionType: 'modal',
      onExecute: async () => {
        console.log('Open export modal')
      },
    },
    // Item-level actions
    {
      id: 'view',
      label: 'View Details',
      description: 'View detailed information about this login attempt',
      type: 'default',
      actionType: 'navigation',
      onExecute: async (item: unknown) => {
        const attempt = item as LoginAttemptEntity
        console.log('View login attempt details:', attempt.id)
        // Navigation logic will be handled by orchestrator
      },
    },
    {
      id: 'export-single',
      label: 'Export',
      description: 'Export this login attempt data',
      type: 'default',
      actionType: 'immediate',
      onExecute: async (item: unknown) => {
        const attempt = item as LoginAttemptEntity
        console.log('Exporting login attempt:', attempt.id)
        // Export functionality
      },
    },
    {
      id: 'block-ip',
      label: 'Block IP',
      description: 'Block this IP address from future login attempts',
      type: 'primary',
      danger: true,
      actionType: 'confirm',
      condition: (item: unknown) => {
        const attempt = item as LoginAttemptEntity
        // Only show for failed attempts
        return !attempt.success
      },
      confirm: {
        title: 'Block IP Address',
        content: (item: unknown) => {
          const attempt = item as LoginAttemptEntity
          return `Are you sure you want to block IP address ${attempt.ipAddress}? This will prevent future login attempts from this IP.`
        },
        okText: 'Block',
        okType: 'danger',
        cancelText: 'Cancel',
        centered: true,
      },
      onExecute: async (item: unknown) => {
        const attempt = item as LoginAttemptEntity
        console.log('Blocking IP:', attempt.ipAddress)
        // IP blocking API call
      },
      async: {
        loadingText: 'Blocking IP address...',
        successMessage: 'IP address blocked successfully',
        errorMessage: (_: unknown, error: unknown) => `Failed to block IP: ${error}`,
      },
    },
  ],
  
  // Bulk actions (only visible when items are selected)
  bulkActions: [
    {
      id: 'bulk-export',
      label: 'Export Selected',
      description: 'Export selected login attempts',
      type: 'default',
      actionType: 'async',
      onExecute: async (attempts) => {
        console.log('Export login attempts:', attempts)
        // Bulk export API call
      },
      async: {
        loadingText: 'Exporting login attempts...',
        successMessage: 'Login attempts exported successfully',
        errorMessage: (_: unknown, error: unknown) => `Failed to export: ${error}`,
        showProgress: true,
      },
    },
    {
      id: 'bulk-block-ips',
      label: 'Block IPs',
      description: 'Block IP addresses of selected failed attempts',
      type: 'primary',
      actionType: 'confirm',
      confirm: {
        title: 'Block IP Addresses',
        content: (attempts: unknown) => {
          const attemptArray = attempts as LoginAttemptEntity[]
          const count = Array.isArray(attemptArray) 
            ? attemptArray.filter((a) => !a.success).length 
            : 0
          return `Are you sure you want to block ${count} IP address(es)? This will prevent future login attempts from these IPs.`
        },
        okText: 'Block',
        okType: 'danger',
        cancelText: 'Cancel',
        centered: true,
      },
      onExecute: async (attempts: unknown) => {
        const attemptArray = attempts as LoginAttemptEntity[]
        const failedAttempts = Array.isArray(attemptArray)
          ? attemptArray.filter((a) => !a.success)
          : []
        console.log('Block IPs for failed attempts:', failedAttempts.length)
        // Bulk IP blocking API call
      },
      async: {
        loadingText: 'Blocking IP addresses...',
        successMessage: 'IP addresses blocked successfully',
        showProgress: true,
      },
    },
    {
      id: 'bulk-generate-report',
      label: 'Generate Report',
      description: 'Generate a security report for selected attempts',
      type: 'default',
      actionType: 'async',
      onExecute: async (attempts: unknown) => {
        console.log('Generating security report for:', Array.isArray(attempts) ? attempts.length : 0, 'attempts')
        // Report generation API call
      },
      async: {
        loadingText: 'Generating security report...',
        successMessage: 'Security report generated successfully',
        errorMessage: (_: unknown, error: unknown) => `Failed to generate report: ${error}`,
        showProgress: true,
      },
    },
  ],
}
