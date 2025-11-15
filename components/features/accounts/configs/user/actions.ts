// ===== USER ACTIONS CONFIGURATION =====

import { EntityAction } from '@/components/entityManager/EntityActions/types'
import { EntityBulkAction } from '@/components/entityManager/EntityActions/types'
import { User } from '../../types'

export const userCustomActions: {
  item: EntityAction[]
  bulk: EntityBulkAction[]
} = {
  item: [
    {
      id: 'view',
      label: 'View Details',
      type: 'default',
      actionType: 'navigation',
      onExecute: (item: unknown) => {
        const user = item as User
        console.log('Viewing user details:', user.id)
      }
    },
    {
      id: 'edit',
      label: 'Edit User',
      type: 'default',
      actionType: 'navigation',
      onExecute: (item: unknown) => {
        const user = item as User
        console.log('Editing user:', user.id)
      }
    },
    // {
    //   id: 'approve',
    //   label: 'Approve User',
    //   type: 'primary',
    //   actionType: 'confirm',
    //   confirm: {
    //     title: 'Approve User',
    //     content: (item: unknown) => {
    //       const user = item as User
    //       return `Are you sure you want to approve ${user.full_name || user.email}? This will grant them access to the system.`
    //     },
    //     okText: 'Approve',
    //     cancelText: 'Cancel'
    //   },
    //   onExecute: async (item: unknown) => {
    //     const user = item as User
    //     console.log('Approving user:', user.id)
    //     // This will be handled by the API integration
    //   },
    //   condition: (item: unknown) => !(item as User).is_approved,
    //   visible: (item: unknown) => !(item as User).is_approved
    // },
    // {
    //   id: 'change_role',
    //   label: 'Change Role',
    //   type: 'default',
    //   actionType: 'modal',
    //   onExecute: async (item: unknown) => {
    //     const user = item as User
    //     console.log('Opening role change modal for user:', user.id)
    //     // This will open a modal for role selection
    //   }
    // },
    // {
    //   id: 'toggle_status',
    //   label: 'Toggle Active Status',
    //   type: 'default',
    //   actionType: 'confirm',
    //   confirm: {
    //     title: 'Toggle User Status',
    //     content: (item: unknown) => {
    //       const user = item as User
    //       return `Are you sure you want to ${user.is_active ? 'deactivate' : 'activate'} this user?`
    //     },
    //     okText: 'Confirm',
    //     cancelText: 'Cancel'
    //   },
    //   onExecute: async (item: unknown) => {
    //     const user = item as User
    //     console.log('Toggle user active status:', user.id, 'to', !user.is_active)
    //     // This will be handled by the API integration
    //   }
    // },
    // {
    //   id: 'reset_password',
    //   label: 'Reset Password',
    //   type: 'text',
    //   actionType: 'confirm',
    //   confirm: {
    //     title: 'Reset Password',
    //     content: 'Are you sure you want to reset this user\'s password? They will receive an email with instructions to set a new password.',
    //     okText: 'Reset Password',
    //     cancelText: 'Cancel'
    //   },
    //   onExecute: async (item: unknown) => {
    //     const user = item as User
    //     console.log('Resetting password for user:', user.id)
    //     // This will trigger password reset email
    //   }
    // },
    // {
    //   id: 'view_sessions',
    //   label: 'View Sessions',
    //   type: 'default',
    //   actionType: 'navigation',
    //   onExecute: async (item: unknown) => {
    //     const user = item as User
    //     console.log('Navigating to user sessions:', user.id)
    //     // This will navigate to user's session list
    //   }
    // },
    // {
    //   id: 'view_login_history',
    //   label: 'Login History',
    //   type: 'default',
    //   actionType: 'navigation',
    //   onExecute: async (item: unknown) => {
    //     const user = item as User
    //     console.log('Navigating to user login history:', user.id)
    //     // This will navigate to user's login attempts
    //   }
    // },
    // {
    //   id: 'delete',
    //   label: 'Delete User',
    //   type: 'primary',
    //   actionType: 'confirm',
    //   confirm: {
    //     title: 'Delete User',
    //     content: 'Are you sure you want to delete this user? This action cannot be undone and will permanently remove all associated data.',
    //     okText: 'Delete',
    //     cancelText: 'Cancel'
    //   },
    //   onExecute: async (item: unknown) => {
    //     const user = item as User
    //     console.log('Deleting user:', user.id)
    //     // This will be handled by the API integration
    //   }
    // }
  ],
  bulk: [
    {
      id: 'bulk_approve',
      label: 'Approve Selected',
      type: 'primary',
      actionType: 'confirm',
      confirm: {
        title: 'Approve Users',
        content: 'Are you sure you want to approve the selected users? This will grant them access to the system.',
        okText: 'Approve All',
        cancelText: 'Cancel'
      },
      onExecute: async (item: unknown) => {
        const items = Array.isArray(item) ? item : [item]
        console.log('Bulk approving users:', items.length)
        // This will be handled by the API integration
      }
    },
    {
      id: 'bulk_activate',
      label: 'Activate Selected',
      type: 'default',
      actionType: 'confirm',
      confirm: {
        title: 'Activate Users',
        content: 'Are you sure you want to activate the selected users?',
        okText: 'Activate All',
        cancelText: 'Cancel'
      },
      onExecute: async (item: unknown, context?: unknown) => {
        const items = Array.isArray(item) ? item : [item]
        console.log('Bulk activating users:', items.length)
        // This will be handled by the API integration
      }
    },
    {
      id: 'bulk_deactivate',
      label: 'Deactivate Selected',
      type: 'text',
      actionType: 'confirm',
      confirm: {
        title: 'Deactivate Users',
        content: 'Are you sure you want to deactivate the selected users?',
        okText: 'Deactivate All',
        cancelText: 'Cancel'
      },
      onExecute: async (item: unknown) => {
        const items = Array.isArray(item) ? item : [item]
        console.log('Bulk deactivating users:', items.length)
        // This will be handled by the API integration
      }
    },
    {
      id: 'bulk_delete',
      label: 'Delete Selected',
      type: 'text',
      actionType: 'confirm',
      confirm: {
        title: 'Delete Users',
        content: 'Are you sure you want to delete the selected users? This action cannot be undone.',
        okText: 'Delete All',
        cancelText: 'Cancel'
      },
      onExecute: async (item: unknown) => {
        const items = Array.isArray(item) ? item : [item]
        console.log('Bulk deleting users:', items.length)
        // This will be handled by the API integration
      }
    }
  ]
}