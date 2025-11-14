import { FormField } from '@/components/entityManager/types'

// ===== FIELD DEFINITIONS (Single Source of Truth) =====
// All field definitions for UserSession entity in one place

export const userSessionFields: FormField[] = [
  {
    name: 'id',
    label: 'Session ID',
    type: 'text',
    required: false,
    readOnly: true,
  },
  {
    name: 'user',
    label: 'User',
    type: 'text',
    required: true,
    readOnly: true,
    helpText: 'User associated with this session',
  },
  {
    name: 'session_key',
    label: 'Session Key',
    type: 'text',
    required: true,
    readOnly: true,
  },
  {
    name: 'ip_address',
    label: 'IP Address',
    type: 'text',
    required: true,
    readOnly: true,
    helpText: 'IP address from which the session was initiated',
  },
  {
    name: 'user_agent',
    label: 'User Agent',
    type: 'textarea',
    required: true,
    readOnly: true,
    validation: {
      maxLength: 500,
    },
  },
  {
    name: 'device_type',
    label: 'Device Type',
    type: 'select',
    required: true,
    readOnly: true,
    options: [
      { value: 'desktop', label: 'Desktop' },
      { value: 'mobile', label: 'Mobile' },
      { value: 'tablet', label: 'Tablet' },
      { value: 'unknown', label: 'Unknown' },
    ],
  },
  {
    name: 'device_os',
    label: 'Operating System',
    type: 'text',
    required: true,
    readOnly: true,
  },
  {
    name: 'browser',
    label: 'Browser',
    type: 'text',
    required: true,
    readOnly: true,
  },
  {
    name: 'location_info',
    label: 'Location Info',
    type: 'text',
    required: false,
    readOnly: true,
    helpText: 'Geographical location information (if available)',
  },
  {
    name: 'is_active',
    label: 'Active',
    type: 'checkbox',
    required: true,
    readOnly: true,
    defaultValue: true,
    helpText: 'Whether the session is currently active',
  },
  {
    name: 'expires_at',
    label: 'Expires At',
    type: 'date',
    required: true,
    readOnly: true,
  },
  {
    name: 'last_activity',
    label: 'Last Activity',
    type: 'date',
    required: true,
    readOnly: true,
  },
  {
    name: 'created_at',
    label: 'Created At',
    type: 'date',
    required: false,
    readOnly: true,
  },
]
