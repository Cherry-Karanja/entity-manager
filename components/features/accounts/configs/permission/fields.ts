// ===== PERMISSION FIELDS CONFIGURATION =====

import { EntityField } from '@/components/entityManager/manager/types'
import { Permission, PermissionFormData } from '../../types'

// ===== PERMISSION FIELDS CONFIGURATION =====

export const permissionFields: EntityField<Permission, PermissionFormData>[] = [
  // Basic Information
  {
    key: 'id',
    label: 'ID',
    type: 'number',
    required: true,
    readOnly: true,
    fieldType: 'input'
  },
  {
    key: 'name',
    label: 'Permission Name',
    type: 'string',
    required: true,
    minLength: 3,
    maxLength: 255,
    fieldType: 'input',
    placeholder: 'Enter permission name (e.g., Can view users)',
    validation: {
      customValidate: (value: unknown) => {
        if (typeof value !== 'string') return 'Permission name must be a string'
        if (value.trim().length < 3) return 'Permission name must be at least 3 characters'
        return true
      }
    }
  },
  {
    key: 'codename',
    label: 'Codename',
    type: 'string',
    required: true,
    minLength: 3,
    maxLength: 100,
    fieldType: 'input',
    placeholder: 'Enter codename (e.g., view_user)',
    validation: {
      customValidate: (value: unknown) => {
        if (typeof value !== 'string') return 'Codename must be a string'
        if (!/^[a-z][a-z0-9_]*$/.test(value)) {
          return 'Codename must start with a lowercase letter and contain only lowercase letters, numbers, and underscores'
        }
        return true
      }
    }
  },
  {
    key: 'app_label',
    label: 'App Label',
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 100,
    fieldType: 'input',
    placeholder: 'Enter app label (e.g., accounts)',
    validation: {
      customValidate: (value: unknown) => {
        if (typeof value !== 'string') return 'App label must be a string'
        if (!/^[a-z][a-z0-9_]*$/.test(value)) {
          return 'App label must start with a lowercase letter and contain only lowercase letters, numbers, and underscores'
        }
        return true
      }
    }
  },
  {
    key: 'model',
    label: 'Model',
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 100,
    fieldType: 'input',
    placeholder: 'Enter model name (e.g., user)',
    validation: {
      customValidate: (value: unknown) => {
        if (typeof value !== 'string') return 'Model name must be a string'
        if (!/^[a-z][a-z0-9_]*$/.test(value)) {
          return 'Model name must start with a lowercase letter and contain only lowercase letters, numbers, and underscores'
        }
        return true
      }
    }
  },

  // Read-only fields
  {
    key: 'content_type_name',
    label: 'Content Type',
    type: 'string',
    required: false,
    readOnly: true,
    fieldType: 'input'
  }
]