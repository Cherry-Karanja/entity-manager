// ===== USER FIELDS CONFIGURATION =====

import { EntityField } from '@/components/entityManager/manager/types'
import { User, UserFormData } from '../../types'

// ===== USER FIELDS CONFIGURATION =====

export const userFields: EntityField<User, UserFormData>[] = [
  // Basic Information
  {
    key: 'id',
    label: 'ID',
    type: 'string',
    required: true,
    readOnly: true,
    fieldType: 'input'
  },
  {
    key: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    validation: {
      customValidate: (value: unknown) => {
        if (typeof value !== 'string') return 'Email must be a string'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address'
        return true
      }
    },
    fieldType: 'input',
    placeholder: 'Enter email address'
  },
  {
    key: 'first_name',
    label: 'First Name',
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 30,
    fieldType: 'input',
    placeholder: 'Enter first name'
  },
  {
    key: 'last_name',
    label: 'Last Name',
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 30,
    fieldType: 'input',
    placeholder: 'Enter last name'
  },
  {
    key: 'username',
    label: 'Username',
    type: 'string',
    required: false,
    minLength: 3,
    maxLength: 150,
    fieldType: 'input',
    placeholder: 'Enter username (optional)'
  },
  {
    key: 'employee_id',
    label: 'Employee ID',
    type: 'string',
    required: false,
    minLength: 1,
    maxLength: 50,
    fieldType: 'input',
    placeholder: 'Enter employee ID',
    validation: {
      customValidate: (value: unknown) => {
        if (!value) return true // Optional field
        if (typeof value !== 'string') return 'Employee ID must be a string'
        if (!/^[a-zA-Z0-9-_]+$/.test(value)) return 'Employee ID can only contain letters, numbers, hyphens, and underscores'
        return true
      }
    }
  },

  // Role and Permissions
  {
    key: 'role',
    label: 'Role',
    type: 'select',
    required: false,
    fieldType: 'select',
    placeholder: 'Select a role',
    // Options will be loaded dynamically from API
    options: []
  },

  // Account Status
  {
    key: 'is_active',
    label: 'Active',
    type: 'boolean',
    required: true,
    defaultValue: true,
    fieldType: 'switch'
  },
  {
    key: 'is_approved',
    label: 'Approved',
    type: 'boolean',
    required: true,
    defaultValue: false,
    fieldType: 'switch',
    readOnly: true // Set via approval action
  },
  {
    key: 'is_verified',
    label: 'Verified',
    type: 'boolean',
    required: true,
    defaultValue: false,
    fieldType: 'switch',
    readOnly: true // Set via verification process
  },
  {
    key: 'must_change_password',
    label: 'Must Change Password',
    type: 'boolean',
    required: true,
    defaultValue: false,
    fieldType: 'switch'
  },

  // Security Fields (Read-only in forms)
  {
    key: 'failed_login_attempts',
    label: 'Failed Login Attempts',
    type: 'number',
    required: false,
    readOnly: true,
    fieldType: 'input'
  },
  {
    key: 'account_locked_until',
    label: 'Account Locked Until',
    type: 'date',
    required: false,
    readOnly: true,
    fieldType: 'input'
  },
  {
    key: 'last_login_ip',
    label: 'Last Login IP',
    type: 'string',
    required: false,
    readOnly: true,
    fieldType: 'input'
  },

  // Timestamps (Read-only)
  {
    key: 'date_joined',
    label: 'Date Joined',
    type: 'date',
    required: false,
    readOnly: true,
    fieldType: 'input'
  },
  {
    key: 'last_login',
    label: 'Last Login',
    type: 'date',
    required: false,
    readOnly: true,
    fieldType: 'input'
  },
  {
    key: 'password_changed_at',
    label: 'Password Changed At',
    type: 'date',
    required: false,
    readOnly: true,
    fieldType: 'input'
  },

  // Computed Fields (Read-only)
  {
    key: 'full_name',
    label: 'Full Name',
    type: 'string',
    required: false,
    readOnly: true,
    fieldType: 'input'
  },
  {
    key: 'role_display',
    label: 'Role Display',
    type: 'string',
    required: false,
    readOnly: true,
    fieldType: 'input'
  }
]