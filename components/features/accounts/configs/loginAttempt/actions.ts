// ===== LOGIN ATTEMPT ACTIONS CONFIGURATION =====

import { EntityAction } from '@/components/entityManager/EntityActions/types'
import { LoginAttempt } from '../../types'

// ===== ITEM ACTIONS =====
export const loginAttemptItemActions: EntityAction[] = [
  {
    id: 'view_details',
    label: 'View Details',
    type: 'default',
    description: 'View detailed information about this login attempt',
    actionType: 'navigation',
    onExecute: (item: unknown) => {
      const attempt = item as LoginAttempt
      console.log('Viewing login attempt details:', attempt.id)
      // Navigation to detail view would be handled by the entity manager
    }
  },
  {
    id: 'export_attempt',
    label: 'Export',
    type: 'default',
    description: 'Export this login attempt data',
    actionType: 'immediate',
    onExecute: (item: unknown) => {
      const attempt = item as LoginAttempt
      console.log('Exporting login attempt:', attempt.id)
      // Export functionality would be implemented here
    }
  },
  {
    id: 'block_ip',
    label: 'Block IP',
    type: 'primary',
    description: 'Block this IP address from future login attempts',
    actionType: 'confirm',
    condition: (item: unknown) => {
      const attempt = item as LoginAttempt
      return !attempt.success // Only show for failed attempts
    },
    onExecute: (item: unknown) => {
      const attempt = item as LoginAttempt
      console.log('Blocking IP:', attempt.ip_address)
      // IP blocking functionality would be implemented here
    }
  }
]

// ===== BULK ACTIONS =====
export const loginAttemptBulkActions: EntityAction[] = [
  {
    id: 'export_selected',
    label: 'Export Selected',
    type: 'default',
    description: 'Export selected login attempts',
    actionType: 'bulk',
    onExecute: (items: unknown) => {
      const attempts = items as LoginAttempt[]
      console.log('Exporting selected login attempts:', attempts.length)
      // Bulk export functionality would be implemented here
    }
  },
  {
    id: 'block_ips',
    label: 'Block IPs',
    type: 'primary',
    description: 'Block IP addresses of selected failed attempts',
    actionType: 'confirm',
    condition: (items: unknown) => {
      const attempts = items as LoginAttempt[]
      return attempts.some((item: LoginAttempt) => !item.success) // Only show if there are failed attempts
    },
    onExecute: (items: unknown) => {
      const attempts = items as LoginAttempt[]
      const failedAttempts = attempts.filter((item: LoginAttempt) => !item.success)
      console.log('Blocking IPs for failed attempts:', failedAttempts.length)
      // Bulk IP blocking functionality would be implemented here
    }
  },
  {
    id: 'generate_report',
    label: 'Generate Report',
    type: 'default',
    description: 'Generate a security report for selected attempts',
    actionType: 'async',
    onExecute: (items: unknown) => {
      const attempts = items as LoginAttempt[]
      console.log('Generating security report for:', attempts.length, 'attempts')
      // Report generation functionality would be implemented here
    }
  }
]