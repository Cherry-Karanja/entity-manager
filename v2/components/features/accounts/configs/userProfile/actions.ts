// ===== USER PROFILE ACTIONS CONFIGURATION =====

export const userProfileActionsConfig: {
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
      label: 'Edit Profile',
      icon: 'Edit',
      variant: 'outline',
      action: 'edit',
      permissions: ['accounts.change_userprofile']
    },
    {
      id: 'approve',
      label: 'Approve Profile',
      icon: 'CheckCircle',
      variant: 'default',
      action: 'approve',
      confirm: {
        title: 'Approve Profile',
        description: 'Are you sure you want to approve this user profile?',
        confirmText: 'Approve',
        cancelText: 'Cancel'
      },
      permissions: ['accounts.change_userprofile'],
      condition: 'status === "pending"'
    },
    {
      id: 'reject',
      label: 'Reject Profile',
      icon: 'XCircle',
      variant: 'destructive',
      action: 'reject',
      confirm: {
        title: 'Reject Profile',
        description: 'Are you sure you want to reject this user profile?',
        confirmText: 'Reject',
        cancelText: 'Cancel',
        variant: 'destructive'
      },
      permissions: ['accounts.change_userprofile'],
      condition: 'status === "pending"'
    },
    {
      id: 'suspend',
      label: 'Suspend Profile',
      icon: 'Pause',
      variant: 'outline',
      action: 'suspend',
      confirm: {
        title: 'Suspend Profile',
        description: 'Are you sure you want to suspend this user profile?',
        confirmText: 'Suspend',
        cancelText: 'Cancel'
      },
      permissions: ['accounts.change_userprofile'],
      condition: 'status === "approved"'
    },
    {
      id: 'view_user',
      label: 'View User',
      icon: 'User',
      variant: 'outline',
      action: 'view_user',
      permissions: ['accounts.view_user']
    },
    {
      id: 'reset_preferences',
      label: 'Reset Preferences',
      icon: 'RotateCcw',
      variant: 'outline',
      action: 'reset_preferences',
      confirm: {
        title: 'Reset Preferences',
        description: 'This will reset all user preferences to default values. Continue?',
        confirmText: 'Reset',
        cancelText: 'Cancel'
      },
      permissions: ['accounts.change_userprofile']
    },
    {
      id: 'export_profile',
      label: 'Export Profile',
      icon: 'Download',
      variant: 'outline',
      action: 'export_profile',
      permissions: ['accounts.view_userprofile']
    },
    {
      id: 'delete',
      label: 'Delete Profile',
      icon: 'Trash2',
      variant: 'destructive',
      action: 'delete',
      confirm: {
        title: 'Delete Profile',
        description: 'Are you sure you want to delete this user profile? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'destructive'
      },
      permissions: ['accounts.delete_userprofile']
    }
  ],
  bulkActions: [
    {
      id: 'bulk_approve',
      label: 'Approve Profiles',
      icon: 'CheckCircle',
      variant: 'default',
      action: 'bulk_approve',
      confirm: {
        title: 'Approve Profiles',
        description: 'Are you sure you want to approve the selected profiles?',
        confirmText: 'Approve',
        cancelText: 'Cancel'
      },
      permissions: ['accounts.change_userprofile']
    },
    {
      id: 'bulk_reject',
      label: 'Reject Profiles',
      icon: 'XCircle',
      variant: 'destructive',
      action: 'bulk_reject',
      confirm: {
        title: 'Reject Profiles',
        description: 'Are you sure you want to reject the selected profiles?',
        confirmText: 'Reject',
        cancelText: 'Cancel',
        variant: 'destructive'
      },
      permissions: ['accounts.change_userprofile']
    },
    {
      id: 'bulk_suspend',
      label: 'Suspend Profiles',
      icon: 'Pause',
      variant: 'outline',
      action: 'bulk_suspend',
      confirm: {
        title: 'Suspend Profiles',
        description: 'Are you sure you want to suspend the selected profiles?',
        confirmText: 'Suspend',
        cancelText: 'Cancel'
      },
      permissions: ['accounts.change_userprofile']
    },
    {
      id: 'bulk_export',
      label: 'Export Profiles',
      icon: 'Download',
      variant: 'outline',
      action: 'bulk_export',
      permissions: ['accounts.view_userprofile']
    },
    {
      id: 'bulk_delete',
      label: 'Delete Profiles',
      icon: 'Trash2',
      variant: 'destructive',
      action: 'bulk_delete',
      confirm: {
        title: 'Delete Profiles',
        description: 'Are you sure you want to delete the selected profiles? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'destructive'
      },
      permissions: ['accounts.delete_userprofile']
    }
  ],
  globalActions: [
    {
      id: 'create_profile',
      label: 'Create Profile',
      icon: 'Plus',
      variant: 'default',
      action: 'create',
      permissions: ['accounts.add_userprofile']
    },
    {
      id: 'import_profiles',
      label: 'Import Profiles',
      icon: 'Upload',
      variant: 'outline',
      action: 'import',
      permissions: ['accounts.add_userprofile']
    },
    {
      id: 'export_all',
      label: 'Export All Profiles',
      icon: 'Download',
      variant: 'outline',
      action: 'export_all',
      permissions: ['accounts.view_userprofile']
    },
    {
      id: 'bulk_approval',
      label: 'Bulk Approval',
      icon: 'CheckSquare',
      variant: 'outline',
      action: 'bulk_approval',
      permissions: ['accounts.change_userprofile']
    }
  ]
}