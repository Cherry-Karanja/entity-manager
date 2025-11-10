// ===== LOGIN ATTEMPT ENTITY CONFIGURATION =====

import { EntityConfig } from '@/components/entityManager/manager/types'
import { LoginAttempt, LoginAttemptFormData } from '../../types'
import { loginAttemptFields } from './fields'
import { loginAttemptListColumns } from './list'
import { loginAttemptViewConfig } from './view'
import { loginAttemptItemActions, loginAttemptBulkActions } from './actions'

export const loginAttemptConfig: EntityConfig<LoginAttempt, LoginAttemptFormData> = {
  // ===== ENTITY METADATA =====
  name: 'LoginAttempt',
  namePlural: 'LoginAttempts',
  displayName: 'Login Attempt',
  fields: loginAttemptFields,

  // ===== API CONFIGURATION =====
  endpoints: {
    list: '/api/v1/accounts/login-attempts/',
    create: '/api/v1/accounts/login-attempts/',
    update: '/api/v1/accounts/login-attempts/{id}/',
    delete: '/api/v1/accounts/login-attempts/{id}/'
  },

  // ===== LIST CONFIGURATION =====
  listConfig: {
    columns: loginAttemptListColumns,
    searchableFields: ['email', 'ip_address', 'device_type', 'browser'],
    defaultSort: { field: 'created_at', direction: 'desc' },
    pageSize: 20,
    allowBatchActions: true,
    allowExport: true
  },

  // ===== VIEW CONFIGURATION =====
  viewConfig: loginAttemptViewConfig,

  // ===== PERMISSIONS =====
  permissions: {
    create: false, // Read-only entity - attempts are logged automatically
    view: true,
    update: false, // Read-only entity
    delete: false, // Read-only entity - security audit trail
    export: true
  },

  // ===== CUSTOM ACTIONS =====
  customActions: {
    item: loginAttemptItemActions,
    bulk: loginAttemptBulkActions
  }
}

export default loginAttemptConfig