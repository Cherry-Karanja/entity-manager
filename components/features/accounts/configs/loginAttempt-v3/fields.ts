import { FormField } from '@/components/entityManager/types'

// ===== FIELD DEFINITIONS (Single Source of Truth) =====
// All field definitions for LoginAttempt entity in one place

export const loginAttemptFields: FormField[] = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    validation: { 
      email: true,
      required: 'Email is required',
      minLength: 5,
      maxLength: 254,
    },
    placeholder: 'user@example.com',
    helpText: 'Email address used for login attempt',
    readOnly: true,
  },
  {
    name: 'user',
    label: 'User',
    type: 'text',
    required: false,
    helpText: 'Associated user if login was successful',
    readOnly: true,
  },
  {
    name: 'success',
    label: 'Success',
    type: 'checkbox',
    required: true,
    defaultValue: false,
    helpText: 'Whether the login attempt was successful',
    readOnly: true,
  },
  {
    name: 'failureReason',
    label: 'Failure Reason',
    type: 'text',
    required: false,
    helpText: 'Reason for login failure (if applicable)',
    readOnly: true,
  },
  {
    name: 'sessionId',
    label: 'Session ID',
    type: 'text',
    required: false,
    helpText: 'ID of the session created on successful login',
    readOnly: true,
  },
  {
    name: 'ipAddress',
    label: 'IP Address',
    type: 'text',
    required: true,
    validation: {
      required: 'IP address is required',
    },
    helpText: 'IP address of the login attempt',
    readOnly: true,
  },
  {
    name: 'userAgent',
    label: 'User Agent',
    type: 'textarea',
    required: true,
    validation: {
      required: 'User agent is required',
    },
    helpText: 'Browser user agent string',
    readOnly: true,
  },
  {
    name: 'deviceType',
    label: 'Device Type',
    type: 'select',
    required: true,
    validation: {
      required: 'Device type is required',
    },
    options: [
      { value: 'desktop', label: 'Desktop' },
      { value: 'mobile', label: 'Mobile' },
      { value: 'tablet', label: 'Tablet' },
      { value: 'unknown', label: 'Unknown' },
    ],
    helpText: 'Type of device used',
    readOnly: true,
  },
  {
    name: 'deviceOs',
    label: 'Operating System',
    type: 'text',
    required: true,
    validation: {
      required: 'Operating system is required',
    },
    helpText: 'Operating system of the device',
    readOnly: true,
  },
  {
    name: 'browser',
    label: 'Browser',
    type: 'text',
    required: true,
    validation: {
      required: 'Browser is required',
    },
    helpText: 'Browser used for the attempt',
    readOnly: true,
  },
  {
    name: 'locationInfo',
    label: 'Location Info',
    type: 'text',
    required: false,
    helpText: 'Geographic location information',
    readOnly: true,
  },
  {
    name: 'createdAt',
    label: 'Attempt Time',
    type: 'date',
    required: true,
    helpText: 'When the login attempt occurred',
    readOnly: true,
  },
]
