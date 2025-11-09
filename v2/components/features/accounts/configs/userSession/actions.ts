// ===== USER SESSION ACTIONS CONFIGURATION =====

import { EntityAction } from '@/components/entityManager/EntityActions/types'
import { UserSession } from '../../types'

export const userSessionItemActions: EntityAction[] = [
  // ===== SESSION MANAGEMENT =====
  {
    id: 'view_details',
    label: 'View Details',
    type: 'default',
    actionType: 'navigation',
    onExecute: async (item: unknown) => {
      // Navigate to session detail view
      console.log('Viewing session details:', (item as UserSession).id)
    }
  },
  {
    id: 'terminate_session',
    label: 'Terminate Session',
    type: 'text',
    actionType: 'confirm',
    confirm: {
      title: 'Terminate Session',
      content: 'Are you sure you want to terminate this user session? The user will be immediately logged out.'
    },
    condition: (item: unknown) => (item as UserSession).is_active,
    onExecute: async (item: unknown) => {
      const session = item as UserSession
      console.log('Terminating session:', session.id)
      // TODO: Implement session termination
    }
  },
  {
    id: 'view_user',
    label: 'View User',
    type: 'default',
    actionType: 'navigation',
    href: (item: unknown) => `/accounts/users/${(item as UserSession).user}`,
    onExecute: async (item: unknown) => {
      // Navigate to user detail view
      console.log('Viewing user:', (item as UserSession).user)
    }
  },
  {
    id: 'view_login_history',
    label: 'View Login History',
    type: 'default',
    actionType: 'navigation',
    href: (item: unknown) => `/accounts/users/${(item as UserSession).user}/login-history`,
    onExecute: async (item: unknown) => {
      // Navigate to user's login history
      console.log('Viewing login history for user:', (item as UserSession).user)
    }
  },
  {
    id: 'flag_suspicious',
    label: 'Flag as Suspicious',
    type: 'text',
    actionType: 'confirm',
    confirm: {
      title: 'Flag Session',
      content: 'This will mark the session for security review. Continue?'
    },
    onExecute: async (item: unknown) => {
      const session = item as UserSession
      console.log('Flagging session as suspicious:', session.id)
      // TODO: Implement suspicious session flagging
    }
  },
  {
    id: 'block_ip',
    label: 'Block IP Address',
    type: 'text',
    actionType: 'confirm',
    confirm: {
      title: 'Block IP Address',
      content: 'This will block all future connections from this IP address. This action cannot be undone.'
    },
    onExecute: async (item: unknown) => {
      const session = item as UserSession
      console.log('Blocking IP address:', session.ip_address)
      // TODO: Implement IP blocking
    }
  }
]

export const userSessionBulkActions: EntityAction[] = [
  {
    id: 'bulk_terminate',
    label: 'Terminate Selected',
    type: 'text',
    actionType: 'confirm',
    confirm: {
      title: 'Terminate Sessions',
      content: 'Are you sure you want to terminate the selected sessions?'
    },
    bulk: {
      minItems: 1
    },
    onExecute: async (item: unknown) => {
      const sessions = Array.isArray(item) ? item : [item]
      console.log('Bulk terminating sessions:', sessions.length)
      // TODO: Implement bulk session termination
    }
  },
  {
    id: 'bulk_flag_suspicious',
    label: 'Flag as Suspicious',
    type: 'text',
    actionType: 'confirm',
    confirm: {
      title: 'Flag Sessions',
      content: 'Are you sure you want to flag the selected sessions as suspicious?'
    },
    bulk: {
      minItems: 1
    },
    onExecute: async (item: unknown) => {
      const sessions = Array.isArray(item) ? item : [item]
      console.log('Bulk flagging sessions as suspicious:', sessions.length)
      // TODO: Implement bulk suspicious flagging
    }
  }
]