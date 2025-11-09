// ===== USER ROLE FIELDS CONFIGURATION =====

import { EntityField } from '@/components/entityManager/manager/types'
import { UserRole, UserRoleFormData } from '../../types'

// ===== USER ROLE FIELDS CONFIGURATION =====

export const userRoleFields: EntityField<UserRole, UserRoleFormData>[] = [
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
    key: 'name',
    label: 'Role Name',
    type: 'string',
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldType: 'input',
    placeholder: 'Enter role name (e.g., admin, manager)',
    validation: {
      customValidate: (value: unknown) => {
        if (typeof value !== 'string') return 'Role name must be a string'
        if (!/^[a-z_][a-z0-9_]*$/.test(value)) return 'Role name must start with a letter and contain only lowercase letters, numbers, and underscores'
        return true
      }
    }
  },
  {
    key: 'display_name',
    label: 'Display Name',
    type: 'string',
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldType: 'input',
    placeholder: 'Enter human-readable name (e.g., Administrator, Manager)'
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    required: false,
    maxLength: 500,
    fieldType: 'textarea',
    placeholder: 'Describe the role and its responsibilities'
  },
  {
    key: 'is_active',
    label: 'Active',
    type: 'boolean',
    required: true,
    defaultValue: true,
    fieldType: 'switch'
  },

  // Permissions (Multi-select)
  {
    key: 'permissions',
    label: 'Permissions',
    type: 'array',
    required: false,
    fieldType: 'multiselect',
    placeholder: 'Select permissions for this role',
    // Options will be loaded dynamically from API
    options: []
  },

  // Read-only fields
  {
    key: 'permissions_count',
    label: 'Permissions Count',
    type: 'number',
    required: false,
    readOnly: true,
    fieldType: 'input'
  },
  {
    key: 'users_count',
    label: 'Users Count',
    type: 'number',
    required: false,
    readOnly: true,
    fieldType: 'input'
  },

  // Timestamps
  {
    key: 'created_at',
    label: 'Created At',
    type: 'date',
    required: false,
    readOnly: true,
    fieldType: 'input'
  },
  {
    key: 'updated_at',
    label: 'Updated At',
    type: 'date',
    required: false,
    readOnly: true,
    fieldType: 'input'
  }
]