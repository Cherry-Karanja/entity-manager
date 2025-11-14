import { FormField } from '@/components/entityManager/types'

// ===== FIELD DEFINITIONS (Single Source of Truth) =====
// All field definitions for UserRole entity in one place

export const userRoleFields: FormField[] = [
  {
    name: 'id',
    label: 'ID',
    type: 'text',
    required: false,
    readOnly: true,
    helpText: 'Unique identifier for the role',
  },
  {
    name: 'name',
    label: 'Role Name',
    type: 'text',
    required: true,
    validation: { 
      required: 'Role name is required',
      minLength: 3,
      maxLength: 100,
    },
    placeholder: 'Enter role name (e.g., admin, manager)',
    helpText: 'Unique system name for the role',
  },
  {
    name: 'display_name',
    label: 'Display Name',
    type: 'text',
    required: true,
    validation: { 
      required: 'Display name is required',
      minLength: 3,
      maxLength: 100,
    },
    placeholder: 'Enter human-readable name (e.g., Administrator, Manager)',
    helpText: 'User-friendly name displayed in the interface',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: false,
    validation: {
      maxLength: 500,
    },
    placeholder: 'Describe the role and its responsibilities',
    helpText: 'Detailed description of the role purpose and scope',
  },
  {
    name: 'is_active',
    label: 'Active',
    type: 'checkbox',
    required: false,
    defaultValue: true,
    helpText: 'Inactive roles cannot be assigned to users',
  },
  {
    name: 'permissions',
    label: 'Permissions',
    type: 'multiselect',
    required: false,
    placeholder: 'Select permissions for this role',
    helpText: 'Permissions granted to users with this role',
    options: [], // Will be loaded dynamically from API
  },
  {
    name: 'permissions_count',
    label: 'Permissions Count',
    type: 'number',
    required: false,
    readOnly: true,
    helpText: 'Total number of permissions assigned',
  },
  {
    name: 'users_count',
    label: 'Users Count',
    type: 'number',
    required: false,
    readOnly: true,
    helpText: 'Number of users with this role',
  },
  {
    name: 'created_at',
    label: 'Created At',
    type: 'date',
    required: false,
    readOnly: true,
  },
  {
    name: 'updated_at',
    label: 'Updated At',
    type: 'date',
    required: false,
    readOnly: true,
  },
]
