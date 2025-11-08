import { User } from './types'

// ===== USER ACTIONS CONFIGURATION =====

export const userCustomActions: {
  item: any[]
  bulk: any[]
} = {
  item: [
    {
      id: 'view',
      label: 'View Details',
      type: 'default',
      actionType: 'immediate'
    },
    {
      id: 'edit',
      label: 'Edit User',
      type: 'default',
      actionType: 'immediate'
    },
    {
      id: 'toggle-status',
      label: 'Toggle Status',
      type: 'default',
      actionType: 'confirm',
      confirm: {
        title: 'Toggle User Status',
        content: (item: unknown) => {
          const user = item as User
          return `Are you sure you want to ${user.is_active ? 'deactivate' : 'activate'} this user?`
        },
        okText: 'Confirm',
        cancelText: 'Cancel'
      },
      onExecute: async (item: unknown) => {
        const user = item as User
        console.log('Toggle user active status:', user.id, 'to', !user.is_active)
        // This would typically make an API call to update the user's status
      }
    },
    {
      id: 'delete',
      label: 'Delete User',
      type: 'default',
      danger: true,
      actionType: 'confirm',
      confirm: {
        title: 'Delete User',
        content: 'Are you sure you want to delete this user? This action cannot be undone.',
        okText: 'Delete',
        cancelText: 'Cancel'
      }
    }
  ],
  bulk: [
    {
      id: 'bulk-activate',
      label: 'Activate Selected',
      type: 'default',
      actionType: 'bulk',
      onExecute: async (items: unknown) => {
        console.log('Activate users:', items)
        // This would typically make API calls to activate multiple users
      }
    },
    {
      id: 'bulk-deactivate',
      label: 'Deactivate Selected',
      type: 'default',
      actionType: 'bulk',
      onExecute: async (items: unknown) => {
        console.log('Deactivate users:', items)
        // This would typically make API calls to deactivate multiple users
      }
    },
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      type: 'default',
      danger: true,
      actionType: 'confirm',
      confirm: {
        title: 'Delete Users',
        content: 'Are you sure you want to delete the selected users? This action cannot be undone.',
        okText: 'Delete',
        cancelText: 'Cancel'
      },
      onExecute: async (items: unknown) => {
        console.log('Delete users:', items)
        // This would typically make API calls to delete multiple users
      }
    }
  ]
}
