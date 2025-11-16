// ===== PERMISSION ACTIONS CONFIGURATION =====

import { EntityActionsConfig } from '@/components/entityManager/EntityActions/types'
import { Permission } from '../../types/permission.types'

export const permissionActionsConfig: EntityActionsConfig<Permission> = {
  actions: [
  {
      id: 'view',
      label: 'View Details',
      type: 'default',
      actionType: 'navigation',
      router: 'next',
      href(item) {
        const permission = item as Permission
        return `/dashboard/accounts/permissions/${permission.id}`
      },
      onExecute: (item: unknown) => {
        const permission = item as Permission
        console.log('Viewing permission details:', permission.id)
      }
    },
    {
      id: 'edit',
      label: 'Edit Permission',
      type: 'default',
      actionType: 'navigation',
      router: 'next',
      href(item) {
        const permission = item as Permission
        return `/dashboard/accounts/permissions/${permission.id}`
      },
      onExecute: (item: unknown) => {
        const permission = item as Permission
        console.log('Editing permission:', permission.id)
      }
    },
    {
      id: 'delete',
      label: 'Delete Permission',
      description: 'Delete this permission',
      type: 'primary',
      danger: true,
      actionType: 'confirm',
      confirm: {
        title: 'Delete Permission',
        content: 'Are you sure you want to delete this permission? This action cannot be undone and may affect user access.',
        okText: 'Delete',
        cancelText: 'Cancel',
        okType: 'danger'
      }
    }
  ],
  bulkActions: [
    {
      id: 'delete',
      label: 'Delete Selected',
      description: 'Delete selected permissions',
      type: 'primary',
      danger: true,
      actionType: 'confirm',
      confirm: {
        title: 'Delete Selected Permissions',
        content: 'Are you sure you want to delete the selected permissions? This action cannot be undone.',
        okText: 'Delete',
        cancelText: 'Cancel',
        okType: 'danger'
      }
    }
  ]
}