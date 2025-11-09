// ===== USER ROLE ACTIONS CONFIGURATION =====

export const userRoleActionsConfig: {
  itemActions?: {
    id: string
    label: string
    icon?: string
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    disabled?: boolean
    hidden?: boolean
    confirm?: {
      title: string
      description: string
      confirmText?: string
      cancelText?: string
      variant?: 'default' | 'destructive'
    }
    action: string
    params?: Record<string, any>
    permissions?: string[]
    condition?: string
  }[]
  bulkActions?: {
    id: string
    label: string
    icon?: string
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    disabled?: boolean
    hidden?: boolean
    confirm?: {
      title: string
      description: string
      confirmText?: string
      cancelText?: string
      variant?: 'default' | 'destructive'
    }
    action: string
    params?: Record<string, any>
    permissions?: string[]
    condition?: string
  }[]
  globalActions?: {
    id: string
    label: string
    icon?: string
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    disabled?: boolean
    hidden?: boolean
    action: string
    params?: Record<string, any>
    permissions?: string[]
  }[]
} = {
  itemActions: [
    {
      id: 'edit',
      label: 'Edit Role',
      icon: 'Edit',
      variant: 'outline',
      action: 'edit',
      permissions: ['accounts.change_userrole']
    },
    {
      id: 'duplicate',
      label: 'Duplicate Role',
      icon: 'Copy',
      variant: 'outline',
      action: 'duplicate',
      permissions: ['accounts.add_userrole']
    },
    {
      id: 'toggle_active',
      label: 'Toggle Active',
      icon: 'ToggleLeft',
      variant: 'outline',
      action: 'toggle_active',
      confirm: {
        title: 'Toggle Role Status',
        description: 'Are you sure you want to change the active status of this role?',
        confirmText: 'Toggle',
        cancelText: 'Cancel'
      },
      permissions: ['accounts.change_userrole']
    },
    {
      id: 'manage_permissions',
      label: 'Manage Permissions',
      icon: 'Shield',
      variant: 'outline',
      action: 'manage_permissions',
      permissions: ['accounts.change_userrole']
    },
    {
      id: 'view_users',
      label: 'View Assigned Users',
      icon: 'Users',
      variant: 'outline',
      action: 'view_users',
      permissions: ['accounts.view_user']
    },
    {
      id: 'export_permissions',
      label: 'Export Permissions',
      icon: 'Download',
      variant: 'outline',
      action: 'export_permissions',
      permissions: ['accounts.view_userrole']
    },
    {
      id: 'delete',
      label: 'Delete Role',
      icon: 'Trash2',
      variant: 'destructive',
      action: 'delete',
      confirm: {
        title: 'Delete Role',
        description: 'Are you sure you want to delete this role? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'destructive'
      },
      permissions: ['accounts.delete_userrole'],
      condition: 'users_count === 0'
    }
  ],
  bulkActions: [
    {
      id: 'bulk_activate',
      label: 'Activate Roles',
      icon: 'CheckCircle',
      variant: 'default',
      action: 'bulk_activate',
      confirm: {
        title: 'Activate Roles',
        description: 'Are you sure you want to activate the selected roles?',
        confirmText: 'Activate',
        cancelText: 'Cancel'
      },
      permissions: ['accounts.change_userrole']
    },
    {
      id: 'bulk_deactivate',
      label: 'Deactivate Roles',
      icon: 'XCircle',
      variant: 'outline',
      action: 'bulk_deactivate',
      confirm: {
        title: 'Deactivate Roles',
        description: 'Are you sure you want to deactivate the selected roles?',
        confirmText: 'Deactivate',
        cancelText: 'Cancel'
      },
      permissions: ['accounts.change_userrole']
    },
    {
      id: 'bulk_export',
      label: 'Export Roles',
      icon: 'Download',
      variant: 'outline',
      action: 'bulk_export',
      permissions: ['accounts.view_userrole']
    },
    {
      id: 'bulk_delete',
      label: 'Delete Roles',
      icon: 'Trash2',
      variant: 'destructive',
      action: 'bulk_delete',
      confirm: {
        title: 'Delete Roles',
        description: 'Are you sure you want to delete the selected roles? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'destructive'
      },
      permissions: ['accounts.delete_userrole'],
      condition: 'all_users_count === 0'
    }
  ],
  globalActions: [
    {
      id: 'create_role',
      label: 'Create Role',
      icon: 'Plus',
      variant: 'default',
      action: 'create',
      permissions: ['accounts.add_userrole']
    },
    {
      id: 'import_roles',
      label: 'Import Roles',
      icon: 'Upload',
      variant: 'outline',
      action: 'import',
      permissions: ['accounts.add_userrole']
    },
    {
      id: 'export_all',
      label: 'Export All Roles',
      icon: 'Download',
      variant: 'outline',
      action: 'export_all',
      permissions: ['accounts.view_userrole']
    }
  ]
}