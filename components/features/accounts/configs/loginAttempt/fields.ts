// ===== LOGIN ATTEMPT FIELD CONFIGURATIONS =====

import { EntityField } from '@/components/entityManager/manager/types'
import { LoginAttempt, LoginAttemptFormData } from '../../types'

// ===== FIELD DEFINITIONS =====

export const loginAttemptFields: EntityField<LoginAttempt, LoginAttemptFormData>[] = [
  // ===== BASIC INFORMATION =====
  {
    key: 'id',
    label: 'Attempt ID',
    type: 'string',
    required: false,
    readOnly: true,
    description: 'Unique identifier for the login attempt'
  },
  {
    key: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    readOnly: false,
    description: 'Email address used for login attempt',
    validation: {
      minLength: 5,
      maxLength: 254,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },
  {
    key: 'user',
    label: 'User',
    type: 'string',
    required: false,
    readOnly: true,
    description: 'Associated user if login was successful'
  },

  // ===== ATTEMPT DETAILS =====
  {
    key: 'success',
    label: 'Success',
    type: 'boolean',
    required: true,
    readOnly: false,
    description: 'Whether the login attempt was successful',
    defaultValue: false
  },
  {
    key: 'failure_reason',
    label: 'Failure Reason',
    type: 'string',
    required: false,
    readOnly: false,
    description: 'Reason for login failure (if applicable)'
  },
  {
    key: 'session_id',
    label: 'Session ID',
    type: 'string',
    required: false,
    readOnly: true,
    description: 'ID of the session created on successful login'
  },

  // ===== DEVICE & BROWSER INFO =====
  {
    key: 'ip_address',
    label: 'IP Address',
    type: 'string',
    required: true,
    readOnly: false,
    description: 'IP address of the login attempt'
  },
  {
    key: 'user_agent',
    label: 'User Agent',
    type: 'string',
    required: true,
    readOnly: false,
    description: 'Browser user agent string'
  },
  {
    key: 'device_type',
    label: 'Device Type',
    type: 'select',
    required: true,
    readOnly: false,
    description: 'Type of device used',
    options: [
      { value: 'desktop', label: 'Desktop' },
      { value: 'mobile', label: 'Mobile' },
      { value: 'tablet', label: 'Tablet' },
      { value: 'unknown', label: 'Unknown' }
    ]
  },
  {
    key: 'device_os',
    label: 'Operating System',
    type: 'string',
    required: true,
    readOnly: false,
    description: 'Operating system of the device'
  },
  {
    key: 'browser',
    label: 'Browser',
    type: 'string',
    required: true,
    readOnly: false,
    description: 'Browser used for the attempt'
  },

  // ===== LOCATION INFORMATION =====
  {
    key: 'location_info',
    label: 'Location Info',
    type: 'object',
    required: false,
    readOnly: false,
    description: 'Geographic location information'
  },

  // ===== TIMESTAMPS =====
  {
    key: 'created_at',
    label: 'Attempt Time',
    type: 'date',
    required: true,
    readOnly: false,
    description: 'When the login attempt occurred'
  }
]