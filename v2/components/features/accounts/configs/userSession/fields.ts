// ===== USER SESSION FIELDS CONFIGURATION =====

import { EntityField } from '@/components/entityManager/manager/types'
import { UserSession, UserSessionFormData } from '../../types'

export const userSessionFields: EntityField<UserSession, UserSessionFormData>[] = [
  // ===== BASIC SESSION INFO =====
  {
    key: 'id',
    label: 'Session ID',
    type: 'uuid',
    required: false,
    readOnly: true,
    fieldType: 'input'
  },
  {
    key: 'user',
    label: 'User',
    type: 'string',
    required: true,
    readOnly: true,
    fieldType: 'input'
  },
  {
    key: 'session_key',
    label: 'Session Key',
    type: 'string',
    required: true,
    readOnly: true,
    fieldType: 'input'
  },

  // ===== DEVICE & BROWSER INFO =====
  {
    key: 'ip_address',
    label: 'IP Address',
    type: 'string',
    required: true,
    readOnly: true,
    fieldType: 'input',
    pattern: /^(\d{1,3}\.){3}\d{1,3}$/
  },
  {
    key: 'user_agent',
    label: 'User Agent',
    type: 'textarea',
    required: true,
    readOnly: true,
    fieldType: 'textarea',
    maxLength: 500
  },
  {
    key: 'device_type',
    label: 'Device Type',
    type: 'select',
    required: true,
    readOnly: true,
    fieldType: 'select'
  },
  {
    key: 'device_os',
    label: 'Operating System',
    type: 'string',
    required: true,
    readOnly: true,
    fieldType: 'input'
  },
  {
    key: 'browser',
    label: 'Browser',
    type: 'string',
    required: true,
    readOnly: true,
    fieldType: 'input'
  },

  // ===== LOCATION INFO =====
  {
    key: 'location_info',
    label: 'Location Info',
    type: 'object',
    required: false,
    readOnly: true,
    fieldType: 'object'
  },

  // ===== SESSION STATUS =====
  {
    key: 'is_active',
    label: 'Active',
    type: 'boolean',
    required: true,
    readOnly: true,
    fieldType: 'switch'
  },
  {
    key: 'expires_at',
    label: 'Expires At',
    type: 'date',
    required: true,
    readOnly: true,
    fieldType: 'date'
  },
  {
    key: 'last_activity',
    label: 'Last Activity',
    type: 'date',
    required: true,
    readOnly: true,
    fieldType: 'date'
  },

  // ===== TIMESTAMPS =====
  {
    key: 'created_at',
    label: 'Created At',
    type: 'date',
    required: false,
    readOnly: true,
    fieldType: 'date'
  }
]
