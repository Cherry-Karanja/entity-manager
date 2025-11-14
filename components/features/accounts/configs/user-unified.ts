/**
 * User Entity Configuration - Unified Format
 * 
 * This is a real-world example showing how to configure the User entity
 * using the new unified approach. This replaces the previous 6-file structure
 * with a single, comprehensive configuration.
 * 
 * @module features/accounts/configs/user-unified
 */

import { 
  createEntityConfig, 
  createField, 
  createAction,
  commonFields, 
  commonActions,
  UnifiedEntityConfig
} from '@/components/entityManager/core'
import { User, UserFormData } from '../../types'

/**
 * Complete User entity configuration
 */
export const userUnifiedConfig: UnifiedEntityConfig<User, UserFormData> = 
  createEntityConfig<User, UserFormData>('User', 'Users')
    .displayName('User Management')
    .description('Manage system users, roles, and permissions')
    
    // API Endpoints
    .endpoints({
      list: '/api/v1/accounts/users/',
      create: '/api/v1/accounts/users/',
      update: '/api/v1/accounts/users/{id}/',
      delete: '/api/v1/accounts/users/{id}/',
      bulkImport: '/api/v1/accounts/users/bulk-import/'
    })
    
    // Permissions
    .permissions({
      create: true,
      view: true,
      update: true,
      delete: true,
      export: true,
      import: true
    })
    
    // List Configuration
    .listConfig({
      defaultFields: [
        'email',
        'first_name',
        'last_name',
        'role_name',
        'is_active',
        'date_joined'
      ],
      searchableFields: [
        'email',
        'first_name',
        'last_name',
        'username',
        'employee_id'
      ],
      defaultSort: {
        field: 'date_joined',
        direction: 'desc'
      },
      pageSize: 20,
      pageSizeOptions: [10, 20, 50, 100],
      selectable: true,
      exportable: true,
      exportFormats: ['csv', 'xlsx', 'json'],
      filters: [
        {
          id: 'is_active',
          label: 'Status',
          type: 'select',
          field: 'is_active',
          operator: 'exact',
          options: [
            { value: 'true', label: 'Active' },
            { value: 'false', label: 'Inactive' }
          ]
        },
        {
          id: 'role',
          label: 'Role',
          type: 'select',
          field: 'role_name',
          operator: 'exact',
          options: [
            { value: 'super_admin', label: 'Super Admin' },
            { value: 'admin', label: 'Admin' },
            { value: 'exam_officer', label: 'Exam Officer' },
            { value: 'viewer', label: 'Viewer' }
          ]
        },
        {
          id: 'verified',
          label: 'Email Verified',
          type: 'boolean',
          field: 'is_verified',
          operator: 'exact'
        }
      ]
    })
    
    // Form Configuration
    .formConfig({
      layout: 'grid',
      columns: 2,
      validateOnChange: true,
      validateOnBlur: true,
      submitLabel: 'Save User',
      cancelLabel: 'Cancel',
      autoFocus: true,
      showProgress: true,
      
      fieldGroups: [
        {
          id: 'basic-info',
          title: 'Basic Information',
          description: 'User identification and contact details',
          fields: ['email', 'first_name', 'last_name', 'username', 'employee_id'],
          layout: 'grid',
          columns: 2,
          collapsible: true,
          collapsed: false
        },
        {
          id: 'role-permissions',
          title: 'Role & Permissions',
          description: 'Assign user roles and permissions',
          fields: ['role_name'],
          layout: 'vertical',
          collapsible: true,
          collapsed: false
        },
        {
          id: 'account-status',
          title: 'Account Status',
          description: 'Account activation and verification status',
          fields: ['is_active', 'is_approved', 'is_verified', 'must_change_password'],
          layout: 'grid',
          columns: 2,
          collapsible: true,
          collapsed: false
        },
        {
          id: 'security-info',
          title: 'Security Information',
          description: 'Security-related account information',
          fields: ['failed_login_attempts', 'account_locked_until', 'last_login_ip'],
          layout: 'vertical',
          collapsible: true,
          collapsed: true
        },
        {
          id: 'timestamps',
          title: 'Timestamps',
          description: 'Account creation and activity timestamps',
          fields: ['date_joined', 'last_login', 'password_changed_at'],
          layout: 'grid',
          columns: 2,
          collapsible: true,
          collapsed: true
        }
      ]
    })
    
    // View Configuration
    .viewConfig({
      mode: 'detail',
      showMetadata: true,
      showActions: true,
      compact: false,
      
      fieldGroups: [
        {
          id: 'profile',
          title: 'Profile Information',
          fields: ['email', 'first_name', 'last_name', 'username', 'employee_id'],
          layout: 'grid',
          columns: 2,
          collapsible: false
        },
        {
          id: 'role',
          title: 'Role & Access',
          fields: ['role_name', 'is_active', 'is_approved', 'is_verified'],
          layout: 'grid',
          columns: 2,
          collapsible: false
        },
        {
          id: 'activity',
          title: 'Activity & Security',
          fields: ['last_login', 'last_login_ip', 'failed_login_attempts', 'account_locked_until'],
          layout: 'grid',
          columns: 2,
          collapsible: true,
          collapsed: false
        },
        {
          id: 'system',
          title: 'System Information',
          fields: ['date_joined', 'password_changed_at', 'must_change_password'],
          layout: 'grid',
          columns: 2,
          collapsible: true,
          collapsed: true
        }
      ]
    })
    
    // Bulk Import
    .bulkImport({
      enabled: true,
      templateName: 'user_import_template',
      formats: ['csv', 'xlsx', 'json'],
      sampleData: [
        {
          email: 'john.doe@example.com',
          first_name: 'John',
          last_name: 'Doe',
          role: 'exam_officer',
          is_active: true
        },
        {
          email: 'jane.smith@example.com',
          first_name: 'Jane',
          last_name: 'Smith',
          role: 'admin',
          is_active: true
        }
      ]
    })
    
    .build()

// ===== FIELD DEFINITIONS =====

userUnifiedConfig.fields = [
  // ID - Hidden, read-only
  commonFields.id().build(),
  
  // Email - Required, validated, sortable, filterable, copyable
  commonFields.email()
    .sortable()
    .filterable()
    .copyable()
    .width(250)
    .build(),
  
  // First Name
  commonFields.name('first_name', 'First Name')
    .sortable()
    .width(150)
    .build(),
  
  // Last Name
  commonFields.name('last_name', 'Last Name')
    .sortable()
    .width(150)
    .build(),
  
  // Username - Optional
  createField<User, UserFormData>('username', 'Username', 'string')
    .placeholder('Enter username (optional)')
    .minLength(3)
    .maxLength(150)
    .description('Optional unique identifier for the user')
    .sortable()
    .width(150)
    .build(),
  
  // Employee ID - Optional, validated format
  createField<User, UserFormData>('employee_id', 'Employee ID', 'string')
    .placeholder('Enter employee ID')
    .maxLength(50)
    .description('Employee identification number')
    .validate((value) => {
      if (!value) return true // Optional field
      if (typeof value !== 'string') return 'Employee ID must be a string'
      if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
        return 'Employee ID can only contain letters, numbers, hyphens, and underscores'
      }
      return true
    })
    .sortable()
    .copyable()
    .width(150)
    .build(),
  
  // Role - Foreign key relationship with search
  createField<User, UserFormData>('role_name', 'Role', 'select')
    .required()
    .placeholder('Select a role')
    .description('User role determines permissions and access levels')
    .relationship({
      entity: 'user-role',
      displayField: 'display_name',
      endpoint: '/api/v1/accounts/user-roles/',
      valueField: 'name',
      search: {
        enabled: true,
        fields: ['name', 'display_name', 'description'],
        minLength: 2,
        debounceMs: 300
      }
    })
    .sortable()
    .filterable()
    .badge()
    .width(150)
    .build(),
  
  // Active Status
  commonFields.isActive()
    .description('Whether the user account is active')
    .sortable()
    .filterable()
    .build(),
  
  // Approved Status
  createField<User, UserFormData>('is_approved', 'Approved', 'boolean')
    .defaultValue(false)
    .description('Whether the account has been approved by an administrator')
    .build(),
  
  // Email Verified
  createField<User, UserFormData>('is_verified', 'Email Verified', 'boolean')
    .defaultValue(false)
    .description('Whether the user has verified their email address')
    .readOnly()
    .build(),
  
  // Must Change Password
  createField<User, UserFormData>('must_change_password', 'Must Change Password', 'boolean')
    .defaultValue(false)
    .description('Force user to change password on next login')
    .build(),
  
  // Failed Login Attempts
  createField<User, UserFormData>('failed_login_attempts', 'Failed Login Attempts', 'number')
    .defaultValue(0)
    .readOnly()
    .min(0)
    .description('Number of consecutive failed login attempts')
    .build(),
  
  // Account Locked Until
  createField<User, UserFormData>('account_locked_until', 'Account Locked Until', 'datetime')
    .readOnly()
    .description('Date and time when account will be unlocked')
    .build(),
  
  // Last Login IP
  createField<User, UserFormData>('last_login_ip', 'Last Login IP', 'string')
    .readOnly()
    .copyable()
    .description('IP address of last login')
    .build(),
  
  // Date Joined
  commonFields.createdAt('date_joined', 'Date Joined')
    .width(180)
    .build(),
  
  // Last Login
  createField<User, UserFormData>('last_login', 'Last Login', 'datetime')
    .readOnly()
    .sortable()
    .description('Date and time of last successful login')
    .width(180)
    .build(),
  
  // Password Changed At
  createField<User, UserFormData>('password_changed_at', 'Password Changed At', 'datetime')
    .readOnly()
    .description('Date and time when password was last changed')
    .build()
]

// ===== ACTIONS =====

userUnifiedConfig.actions = [
  // Standard CRUD actions
  commonActions.view<User>().build(),
  
  commonActions.edit<User>()
    .permission('user.update')
    .build(),
  
  commonActions.delete<User>()
    .permission('user.delete')
    .condition((user) => {
      // Don't allow deleting super admin or yourself
      // In real app, would check current user from auth context
      return user.role_name !== 'super_admin'
    })
    .build(),
  
  // Bulk actions
  commonActions.bulkDelete<User>()
    .permission('user.delete')
    .build(),
  
  // Custom action: Reset Password
  createAction<User>('resetPassword', 'Reset Password')
    .type('confirm')
    .context('item', 'view')
    .variant('default')
    .permission('user.reset_password')
    .description('Send password reset email to user')
    .confirm({
      title: (user) => `Reset password for ${user.email}?`,
      content: 'The user will receive an email with instructions to set a new password.',
      okText: 'Send Reset Email',
      cancelText: 'Cancel',
      okType: 'primary'
    })
    .onExecute(async (user) => {
      // API call would go here
      console.log('Sending password reset email to:', user.email)
      // await api.post(`/api/v1/accounts/users/${user.id}/reset-password/`)
    })
    .build(),
  
  // Custom action: Approve User
  createAction<User>('approve', 'Approve User')
    .type('immediate')
    .context('item', 'view')
    .variant('primary')
    .permission('user.approve')
    .description('Approve pending user account')
    .condition((user) => !user.is_approved)
    .onExecute(async (user) => {
      console.log('Approving user:', user.id)
      // await api.post(`/api/v1/accounts/users/${user.id}/approve/`)
    })
    .build(),
  
  // Custom action: Unlock Account
  createAction<User>('unlock', 'Unlock Account')
    .type('immediate')
    .context('item', 'view')
    .variant('default')
    .permission('user.unlock')
    .description('Unlock locked user account')
    .condition((user) => !!user.account_locked_until)
    .onExecute(async (user) => {
      console.log('Unlocking account:', user.id)
      // await api.post(`/api/v1/accounts/users/${user.id}/unlock/`)
    })
    .build(),
  
  // Custom action: Send Verification Email
  createAction<User>('sendVerification', 'Send Verification Email')
    .type('confirm')
    .context('item', 'view')
    .variant('outline')
    .permission('user.send_verification')
    .description('Resend email verification link')
    .condition((user) => !user.is_verified)
    .confirm({
      title: 'Send Verification Email',
      content: (user) => `Send verification email to ${user.email}?`,
      okText: 'Send Email',
      cancelText: 'Cancel',
      okType: 'primary'
    })
    .onExecute(async (user) => {
      console.log('Sending verification email to:', user.email)
      // await api.post(`/api/v1/accounts/users/${user.id}/send-verification/`)
    })
    .build()
]

// ===== HOOKS (Optional) =====

userUnifiedConfig.hooks = {
  beforeCreate: async (data) => {
    // Normalize email to lowercase
    if (data.email && typeof data.email === 'string') {
      data.email = data.email.toLowerCase()
    }
    return data
  },
  
  afterCreate: (user) => {
    console.log('New user created:', user.email)
    // Could trigger welcome email, notifications, etc.
  },
  
  beforeUpdate: async (id, data) => {
    // Normalize email if being updated
    if (data.email && typeof data.email === 'string') {
      data.email = data.email.toLowerCase()
    }
    return data
  },
  
  afterUpdate: (user) => {
    console.log('User updated:', user.email)
    // Could invalidate caches, send notifications, etc.
  },
  
  beforeDelete: async (id) => {
    // Could check for dependencies, prevent deletion of last admin, etc.
    console.log('Deleting user:', id)
    return true // Return false to prevent deletion
  },
  
  afterDelete: (id) => {
    console.log('User deleted:', id)
    // Clean up related data, log action, etc.
  },
  
  onValidationError: (errors) => {
    console.error('Validation errors:', errors)
  },
  
  onApiError: (error) => {
    console.error('API error:', error)
  }
}

export default userUnifiedConfig
