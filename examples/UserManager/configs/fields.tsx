import { EntityField } from '../../../components/entityManager/manager/types'
import { User, UserFormData } from './types'

// ===== USER FIELDS CONFIGURATION =====

export const userFields: EntityField<User, UserFormData>[] = [
  {
    key: 'id',
    label: 'ID',
    type: 'number',
    required: true,
    readOnly: true
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
    key: 'email',
    label: 'Email',
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
    key: 'phone_number',
    label: 'Phone Number',
    type: 'string',
    required: true,
    fieldType: 'input',
    placeholder: 'Enter phone number (e.g., +1234567890)',
    validation: {
      customValidate: (value: unknown) => {
        if (typeof value !== 'string') return 'Phone number must be a string'
        if (!/^\+\d{10,15}$/.test(value)) return 'Please enter a valid phone number with country code (e.g., +1234567890)'
        return true
      }
    }
  },
  {
    key: 'national_id',
    label: 'National ID',
    type: 'string',
    required: true,
    minLength: 5,
    maxLength: 20,
    fieldType: 'input',
    placeholder: 'Enter national ID',
    validation: {
      customValidate: (value: unknown) => {
        if (typeof value !== 'string') return 'National ID must be a string'
        if (!/^[a-zA-Z0-9]{5,20}$/.test(value)) return 'National ID must be 5-20 alphanumeric characters'
        return true
      }
    }
  },
  {
    key: 'user_type',
    label: 'User Type',
    type: 'select',
    required: true,
    options: [
      { value: 'admin', label: 'Administrator' },
      { value: 'tenant', label: 'Tenant' },
      { value: 'landlord', label: 'Landlord' },
      { value: 'caretaker', label: 'Caretaker' },
      { value: 'property_manager', label: 'Property Manager' }
    ],
    fieldType: 'select',
    defaultValue: 'tenant'
  },
  {
    key: 'is_active',
    label: 'Active',
    type: 'boolean',
    required: true,
    defaultValue: true,
    fieldType: 'switch'
  },
  {
    key: 'date_joined',
    label: 'Date Joined',
    type: 'date',
    required: false,
    readOnly: true
  },
  {
    key: 'updated_at',
    label: 'Updated At',
    type: 'date',
    required: false,
    readOnly: true
  },
  {
    key: 'get_full_name',
    label: 'Full Name',
    type: 'string',
    required: false,
    readOnly: true
  }
]