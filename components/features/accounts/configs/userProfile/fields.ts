// ===== USER PROFILE FIELDS CONFIGURATION =====

import { EntityField } from '@/components/entityManager/manager/types'
import { UserProfile, UserProfileFormData } from '../../types'

// ===== USER PROFILE FIELDS CONFIGURATION =====

export const userProfileFields: EntityField<UserProfile, UserProfileFormData>[] = [
  // Basic Information
  {
    key: 'user',
    label: 'User',
    type: 'string',
    required: true,
    readOnly: true,
    fieldType: 'input',
    description: 'The user this profile belongs to'
  },
  {
    key: 'bio',
    label: 'Bio',
    type: 'string',
    required: false,
    maxLength: 500,
    fieldType: 'textarea',
    placeholder: 'Tell us about yourself...'
  },
  {
    key: 'phone_number',
    label: 'Phone Number',
    type: 'string',
    required: false,
    fieldType: 'input',
    placeholder: '+1234567890',
    validation: {
      customValidate: (value: unknown) => {
        if (typeof value !== 'string') return true
        if (value && !/^\+?[\d\s\-\(\)]+$/.test(value)) return 'Please enter a valid phone number'
        return true
      }
    }
  },
  {
    key: 'department',
    label: 'Department',
    type: 'string',
    required: false,
    maxLength: 100,
    fieldType: 'input',
    placeholder: 'e.g., IT, HR, Finance'
  },
  {
    key: 'job_title',
    label: 'Job Title',
    type: 'string',
    required: false,
    maxLength: 100,
    fieldType: 'input',
    placeholder: 'e.g., Software Engineer, Manager'
  },
  {
    key: 'status',
    label: 'Status',
    type: 'string',
    required: true,
    fieldType: 'select',
    defaultValue: 'pending',
    options: [
      { value: 'pending', label: 'Pending Approval' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'suspended', label: 'Suspended' }
    ]
  },
  {
    key: 'approved_by',
    label: 'Approved By',
    type: 'string',
    required: false,
    readOnly: true,
    fieldType: 'input'
  },
  {
    key: 'approved_at',
    label: 'Approved At',
    type: 'string',
    required: false,
    readOnly: true,
    fieldType: 'input'
  },
  {
    key: 'preferred_language',
    label: 'Preferred Language',
    type: 'string',
    required: true,
    fieldType: 'select',
    defaultValue: 'en',
    options: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'sw', label: 'Swahili' }
    ]
  },
  {
    key: 'interface_theme',
    label: 'Interface Theme',
    type: 'string',
    required: true,
    fieldType: 'select',
    defaultValue: 'system',
    options: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'system', label: 'System' }
    ]
  },
  {
    key: 'allow_notifications',
    label: 'Allow Notifications',
    type: 'boolean',
    required: true,
    fieldType: 'checkbox',
    defaultValue: true
  },
  {
    key: 'show_email',
    label: 'Show Email Publicly',
    type: 'boolean',
    required: true,
    fieldType: 'checkbox',
    defaultValue: false
  },
  {
    key: 'show_phone',
    label: 'Show Phone Publicly',
    type: 'boolean',
    required: true,
    fieldType: 'checkbox',
    defaultValue: false
  },
  // Read-only timestamps
  {
    key: 'created_at',
    label: 'Created At',
    type: 'string',
    required: false,
    readOnly: true,
    fieldType: 'input'
  },
  {
    key: 'updated_at',
    label: 'Updated At',
    type: 'string',
    required: false,
    readOnly: true,
    fieldType: 'input'
  }
]