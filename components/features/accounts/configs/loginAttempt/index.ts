// ===== LOGIN ATTEMPT ENTITY CONFIGURATION =====

import { EntityConfig } from '@/components/entityManager/manager/types'
import { LoginAttempt, LoginAttemptFormData } from '../../types'
import { loginAttemptFields } from './fields'
import { loginAttemptListColumns } from './list'
import { loginAttemptViewConfig } from './view'
import { loginAttemptFormConfig } from './form'
import { loginAttemptItemActions, loginAttemptBulkActions } from './actions'

export const loginAttemptConfig: EntityConfig<LoginAttempt, LoginAttemptFormData> = {
  // ===== ENTITY METADATA =====
  entityName: 'LoginAttempt',
  entityNamePlural: 'LoginAttempts',

  // ===== API CONFIGURATION =====
  endpoints: {
    list: '/api/v1/accounts/login-attempts/',
    read: '/api/v1/accounts/login-attempts/{id}/',
    create: '/api/v1/accounts/login-attempts/',
    update: '/api/v1/accounts/login-attempts/{id}/',
    delete: '/api/v1/accounts/login-attempts/{id}/'
  },

  // ===== LIST CONFIGURATION =====
  list: {
    columns: loginAttemptListColumns,
    searchFields: ['email', 'ip_address', 'device_type', 'browser'],
    defaultSort: [{ field: 'created_at', direction: 'desc' }]
  },

  // ===== FORM CONFIGURATION =====
  form: loginAttemptFormConfig as any,

  // ===== VIEW CONFIGURATION =====
  view: loginAttemptViewConfig as any,

  // ===== PERMISSIONS =====
  permissions: {
    create: false, // Read-only entity - attempts are logged automatically
    view: true,
    update: false, // Read-only entity
    delete: false, // Read-only entity - security audit trail
    export: true
  }
}

export default loginAttemptConfig